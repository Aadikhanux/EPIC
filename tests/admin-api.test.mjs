import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { makeHandler } from '../netlify/functions/admin-api.mjs';

function fixture() {
    const entries = new Map(); let revision = 0;
    const store = {
        async get(key) { return structuredClone(entries.get(key)?.data ?? null); },
        async getWithMetadata(key) { return structuredClone(entries.get(key) ?? null); },
        async setJSON(key, data, condition = {}) {
            const old = entries.get(key);
            if ((condition.onlyIfNew && old) || (condition.onlyIfMatch && old?.etag !== condition.onlyIfMatch)) return { modified: false };
            const etag = String(++revision); entries.set(key, { data: structuredClone(data), etag }); return { modified: true, etag };
        },
        async set(key, data) { entries.set(key, { data, etag: String(++revision) }); },
        async delete(key) { entries.delete(key); }
    };
    const env = { PUBLIC_ORIGIN: 'https://epic.test', ADMIN_USERNAME: 'Test Admin', ADMIN_PASSWORD_SALT: 'test-salt', ADMIN_PASSWORD_HASH: scryptSync('test-password', 'test-salt', 64).toString('hex') };
    const handler = makeHandler(() => store, env);
    const request = (route, method = 'GET', body, headers = {}) => handler(new Request(`https://epic.test/api/${route}`, { method, headers: { origin: env.PUBLIC_ORIGIN, ...headers }, ...(body !== undefined ? { body: typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body) } : {}) }), { ip: '127.0.0.1' });
    async function login() {
        const res = await request('login', 'POST', { username: 'Test Admin', password: 'test-password' });
        assert.equal(res.status, 200); assert.match(res.headers.get('set-cookie'), /HttpOnly; SameSite=Strict.*Secure/);
        return { cookie: res.headers.get('set-cookie').split(';')[0], 'x-csrf-token': (await res.json()).csrf };
    }
    return { request, login, entries, env };
}

test('public reads work but writes, uploads, and sessions require authentication', async () => {
    const { request } = fixture();
    assert.equal((await request('content')).status, 200);
    for (const [route, method] of [['content','PUT'],['upload','POST'],['session','GET'],['logout','POST']]) assert.equal((await request(route, method)).status, 401);
    assert.equal((await request('session','GET',undefined,{cookie:'epic_admin=forged'})).status,401);
});
test('login rejects wrong credentials and cross-origin requests; limits repeated attempts', async () => {
    const { request } = fixture();
    assert.equal((await request('login','POST',{}, { origin:'https://evil.test' })).status,403);
    for(let i=0;i<10;i++) assert.equal((await request('login','POST',{username:'Test Admin',password:'wrong'})).status,401);
    assert.equal((await request('login','POST',{username:'Test Admin',password:'test-password'})).status,429);
});
test('authenticated publishing persists, rejects stale versions, and requires CSRF', async () => {
    const { request, login } = fixture(); const auth = await login();
    const data = await (await request('content')).json();
    data.events[0].title = 'Published session';
    assert.equal((await request('content','PUT',data,{cookie:auth.cookie,'if-match':'0'})).status,403);
    assert.equal((await request('content','PUT',data,{...auth,origin:'https://evil.test','if-match':'0'})).status,403);
    assert.equal((await request('content','PUT',data,{...auth,'if-match':'0'})).status,200);
    assert.equal((await (await request('content')).json()).events[0].title,'Published session');
    assert.equal((await request('content','PUT',data,{...auth,'if-match':'0'})).status,409);
});
test('simultaneous publishing allows only one write', async () => {
    const { request, login } = fixture(); const auth = await login(); const data = await (await request('content')).json();
    const results = await Promise.all([request('content','PUT',data,{...auth,'if-match':'0'}),request('content','PUT',data,{...auth,'if-match':'0'})]);
    assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
});
test('invalid dates, unsafe image URLs, and changed catalog IDs are rejected', async () => {
    const { request, login } = fixture(); const auth = await login();
    for(const change of [d=>d.events[0].date='2026-02-30',d=>d.events[0].image='javascript:alert(1)',d=>d.content[0].id='injected',d=>d.events[0].icon='fa-fire" onclick="alert(1)']) {
        const data = await (await request('content')).json(); change(data);
        assert.equal((await request('content','PUT',data,{...auth,'if-match':'0'})).status,400);
    }
});
test('image uploads reject SVG and oversized files; valid PNG can be served', async () => {
    const { request, login } = fixture(); const auth = await login();
    assert.equal((await request('upload','POST','<svg onload="alert(1)"/>',auth)).status,400);
    assert.equal((await request('upload','POST',Buffer.alloc(3*1024*1024+1),auth)).status,413);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
    const uploaded = await request('upload','POST',png,auth); assert.equal(uploaded.status,201);
    const {url} = await uploaded.json();
    const image = await request(url.slice(1)); assert.equal(image.status,200); assert.equal(image.headers.get('content-type'),'image/png');
});
test('logout and expiry invalidate server-side sessions', async () => {
    const { request, login, entries } = fixture(); const auth = await login();
    assert.equal((await request('session','GET',undefined,auth)).status,200);
    assert.equal((await request('logout','POST',undefined,auth)).status,200);
    assert.equal((await request('session','GET',undefined,auth)).status,401);
    const next = await login();
    for (const [key, value] of entries) if (key.startsWith('sessions/')) value.data.expires = 0;
    assert.equal((await request('session','GET',undefined,next)).status,401);
});
test('missing deployment credentials fail closed', async () => {
    for (const name of ['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'ADMIN_PASSWORD_SALT']) {
        const { request, env } = fixture(); delete env[name];
        const response = await request('login','POST',{username:'Test Admin',password:'test-password'});
        assert.equal(response.status,503);
        const { error } = await response.json();
        assert.ok(error.includes(name));
        assert.ok(!error.includes('test-password'));
        assert.ok(!error.includes('test-salt'));
    }
});
