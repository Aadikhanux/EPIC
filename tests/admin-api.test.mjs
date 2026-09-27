import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { makeHandler } from '../netlify/functions/admin-api.mjs';

function fixture(uploadFetch) {
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
    const handler = makeHandler(() => store, env, uploadFetch);
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
test('publishing uses the JSON revision without relying on HTTP If-Match', async () => {
    const { request, login } = fixture(); const auth = await login();
    const data = await (await request('content')).json();
    data.events[0].time = '16:30';
    const first = await request('content','PUT',data,auth);
    assert.equal(first.status,200);
    const saved = await first.json();
    assert.equal(saved.version,1);
    assert.equal((await (await request('content')).json()).events[0].time,'16:30');
    saved.events[0].time = '17:00';
    assert.equal((await request('content','PUT',saved,auth)).status,200);
    assert.equal((await request('content','PUT',data,auth)).status,409);
    delete saved.version;
    assert.equal((await request('content','PUT',saved,auth)).status,400);
});
test('invalid dates, unsafe image URLs, and invalid icons are rejected', async () => {
    const { request, login } = fixture(); const auth = await login();
    for(const change of [d=>d.events[0].date='2026-02-30',d=>d.events[0].image='javascript:alert(1)',d=>d.events[0].icon='fa-fire" onclick="alert(1)']) {
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

test('legacy page overrides are excluded while saved events remain editable', async () => {
    const { request, login, entries } = fixture();
    const initial = await (await request('content')).json();
    initial.version = 7;
    initial.events[0].time = '18:15';
    entries.set('content', { data: { ...initial, content: [{ id: 'old-page', value: 'Old override' }] }, etag: 'legacy' });
    const current = await (await request('content')).json();
    assert.equal(current.events[0].time, '18:15');
    assert.equal(current.version, 7);
    assert.equal('content' in current, false);
    const auth = await login();
    current.events[0].time = '19:00';
    current.content = [{ id: 'old-page', value: 'Unwanted override' }];
    const response = await request('content', 'PUT', current, auth);
    assert.equal(response.status, 200);
    assert.equal('content' in entries.get('content').data, false);
    assert.equal((await (await request('content')).json()).events[0].time, '19:00');
});

test('gallery publishing is protected, isolated from events, and versioned', async () => {
    const { request, login } = fixture();
    const initial = await (await request('galleries')).json();
    assert.deepEqual(Object.keys(initial.galleries), ['spark','kaizen','phoenix']);
    assert.ok(initial.galleries.spark.length > 0);
    assert.equal((await request('galleries','PUT',initial)).status,401);
    assert.equal((await request('gallery-upload','POST',Buffer.from('image'))).status,401);
    const auth = await login();
    assert.equal((await request('galleries','PUT',initial,{cookie:auth.cookie})).status,403);
    initial.galleries.phoenix.push({url:'https://res.cloudinary.com/demo/image/upload/new.png',caption:'New Phoenix image'});
    assert.equal((await request('galleries','PUT',initial,auth)).status,200);
    assert.equal((await (await request('galleries')).json()).galleries.phoenix[0].caption,'New Phoenix image');
    assert.equal((await (await request('content')).json()).version,0);
    assert.equal((await request('galleries','PUT',initial,auth)).status,409);
});
test('gallery validation rejects unsupported branches and non-Cloudinary URLs', async () => {
    const { request, login } = fixture(); const auth = await login();
    for (const url of ['javascript:alert(1)','https://example.com/image.png','https://res.cloudinary.com.evil.test/demo/image/upload/x.png']) {
        const draft = await (await request('galleries')).json();
        draft.galleries.phoenix.push({url,caption:'Image'});
        assert.equal((await request('galleries','PUT',draft,auth)).status,400);
    }
    const draft = await (await request('galleries')).json(); draft.galleries.other = [];
    assert.equal((await request('galleries','PUT',draft,auth)).status,400);
});
test('Cloudinary gallery upload uses server credentials and returns only the image URL', async () => {
    let sent;
    const { request, login, env } = fixture(async (url, options) => {
        sent = { url, options };
        return Response.json({secure_url:'https://res.cloudinary.com/test-cloud/image/upload/new.png',api_key:'private-key'});
    });
    const auth = await login();
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
    const headers = {...auth,'x-gallery-branch':'phoenix'};
    assert.equal((await request('gallery-upload','POST',png,headers)).status,503);
    Object.assign(env,{CLOUDINARY_CLOUD_NAME:'test-cloud',CLOUDINARY_API_KEY:'private-key',CLOUDINARY_API_SECRET:'private-secret'});
    assert.equal((await request('gallery-upload','POST',png,{...headers,'x-gallery-branch':'other'})).status,400);
    assert.equal((await request('gallery-upload','POST','<svg/>',headers)).status,400);
    assert.equal((await request('gallery-upload','POST',Buffer.alloc(3*1024*1024+1),headers)).status,413);
    const response = await request('gallery-upload','POST',png,headers);
    assert.equal(response.status,201);
    assert.deepEqual(await response.json(),{url:'https://res.cloudinary.com/test-cloud/image/upload/new.png'});
    assert.equal(sent.url,'https://api.cloudinary.com/v1_1/test-cloud/image/upload');
    assert.equal(sent.options.headers.Authorization,'Basic '+Buffer.from('private-key:private-secret').toString('base64'));
    assert.match(sent.options.body.get('public_id'),/^epic_portal\/galleries\/phoenix\//);
    assert.equal(sent.options.body.get('overwrite'),'false');
});
