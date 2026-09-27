import { getStore } from '@netlify/blobs';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import seed from '../lib/events.json' with { type: 'json' };
import gallerySeed from '../lib/galleries.json' with { type: 'json' };
import validation from '../lib/validate.cjs';

export function makeHandler(storeFactory = () => getStore({ name: 'epic-cms', consistency: 'strong' }), env = process.env, uploadFetch = fetch) {
    return async (req, context = {}) => {
        const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
        const reply = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
        try {
            const route = new URL(req.url).pathname.replace(/^\/.netlify\/functions\/admin-api/, '').replace(/^\/api/, '');
            const store = storeFactory();
            const origin = env.PUBLIC_ORIGIN || env.URL;
            const secure = origin?.startsWith('https://');
            const cookie = (token, age) => `epic_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${secure ? '; Secure' : ''}`;
            if (!['GET', 'POST', 'PUT'].includes(req.method)) return reply(405, { error: 'Method not allowed.' });
            if (req.method !== 'GET' && (!origin || req.headers.get('origin') !== origin)) return reply(403, { error: 'Untrusted request origin.' });
            const read = async () => {
                const saved = await store.get('content', { type: 'json' }) || seed;
                return { version: saved.version || 0, events: saved.events };
            };
            const json = async (limit = 1024 * 1024) => {
                const text = await req.text();
                if (Buffer.byteLength(text) > limit) throw Object.assign(new Error('Request too large.'), { status: 413 });
                return JSON.parse(text);
            };
            if (route === '/content' && req.method === 'GET') return reply(200, await read());
            if (route === '/galleries' && req.method === 'GET') return reply(200, await store.get('galleries', { type: 'json' }) || gallerySeed);
            if (/^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(route) && req.method === 'GET') {
                const image = await store.get(route.slice(1), { type: 'arrayBuffer' });
                return image ? new Response(image, { headers: { 'Content-Type': `image/${route.endsWith('.jpg') ? 'jpeg' : route.split('.').pop()}`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' } }) : reply(404, { error: 'Image not found.' });
            }
            if (route === '/login' && req.method === 'POST') {
                const missing = ['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'ADMIN_PASSWORD_SALT'].filter(name => !env[name]?.trim());
                if (missing.length) return reply(503, { error: `Netlify configuration missing: ${missing.join(', ')}. Add these exact keys with values for Functions / Production, then trigger a new production deploy.` });
                const bucket = Math.floor(Date.now() / 900000);
                const ip = createHash('sha256').update(context.ip || 'unknown').digest('hex');
                const key = `attempts/${ip}`;
                const attemptRecord = await store.getWithMetadata(key, { type: 'json' });
                const rate = attemptRecord?.data;
                const count = rate?.bucket === bucket ? rate.count : 0;
                if (count >= 10) return reply(429, { error: 'Too many attempts. Try again in 15 minutes.' });
                const attempt = await store.setJSON(key, { bucket, count: count + 1 }, attemptRecord ? { onlyIfMatch: attemptRecord.etag } : { onlyIfNew: true });
                if (!attempt.modified) return reply(429, { error: 'Another login attempt is in progress. Try again shortly.' });
                const data = await json(4096);
                if (typeof data.password !== 'string' || data.password.length > 256) return reply(401, { error: 'Incorrect username or password.' });
                const hash = scryptSync(data.password, env.ADMIN_PASSWORD_SALT, 64);
                const expected = Buffer.from(env.ADMIN_PASSWORD_HASH, 'hex');
                if (expected.length !== hash.length || !timingSafeEqual(hash, expected) || data.username !== env.ADMIN_USERNAME) return reply(401, { error: 'Incorrect username or password.' });
                const token = randomBytes(32).toString('hex'), csrf = randomBytes(24).toString('hex');
                await store.setJSON(`sessions/${createHash('sha256').update(token).digest('hex')}`, { csrf, expires: Date.now() + 8 * 3600000 });
                return reply(200, { csrf }, { 'Set-Cookie': cookie(token, 28800) });
            }
            const token = /(?:^|;\s*)epic_admin=([a-f0-9]{64})(?:;|$)/.exec(req.headers.get('cookie') || '')?.[1];
            const key = token && `sessions/${createHash('sha256').update(token).digest('hex')}`;
            const session = key && await store.get(key, { type: 'json' });
            if (!session || session.expires < Date.now()) return reply(401, { error: 'Please sign in.' });
            if (req.method !== 'GET' && req.headers.get('x-csrf-token') !== session.csrf) return reply(403, { error: 'Invalid session token.' });
            if (route === '/session' && req.method === 'GET') return reply(200, { csrf: session.csrf });
            if (route === '/logout' && req.method === 'POST') { await store.delete(key); return reply(200, { ok: true }, { 'Set-Cookie': cookie('', 0) }); }
            if (route === '/galleries' && req.method === 'PUT') {
                const input = await json();
                const data = validation.validateGalleries(input);
                if (!Number.isSafeInteger(input.version) || input.version < 0) return reply(400, { error: 'Refresh the panel to load the gallery version.' });
                const record = await store.getWithMetadata('galleries', { type: 'json' });
                const current = record?.data || gallerySeed;
                if (input.version !== current.version) return reply(409, { error: 'Galleries changed in another tab. Reload before publishing.' });
                data.version = current.version + 1;
                const write = await store.setJSON('galleries', data, record ? { onlyIfMatch: record.etag } : { onlyIfNew: true });
                if (!write.modified) return reply(409, { error: 'Galleries changed in another tab. Reload before publishing.' });
                return reply(200, data);
            }
            if (route === '/gallery-upload' && req.method === 'POST') {
                const branch = req.headers.get('x-gallery-branch');
                if (!validation.branches.includes(branch)) return reply(400, { error: 'Choose SPARK, KAIZEN, or PHOENIX.' });
                const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(name => !env[name]?.trim());
                if (missing.length) return reply(503, { error: `Cloudinary configuration missing: ${missing.join(', ')}. Add these Netlify variables for Functions / Production and redeploy.` });
                if (!/^[a-zA-Z0-9_-]+$/.test(env.CLOUDINARY_CLOUD_NAME)) return reply(503, { error: 'CLOUDINARY_CLOUD_NAME must contain the Cloudinary cloud name only.' });
                const buffer = Buffer.from(await req.arrayBuffer());
                if (buffer.length > 3 * 1024 * 1024) return reply(413, { error: 'Choose an image smaller than 3 MB.' });
                const type = buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' : buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 ? 'jpeg' : buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP' ? 'webp' : null;
                if (!type) return reply(400, { error: 'Use PNG, JPEG, or WebP images.' });
                const form = new FormData();
                form.set('file', new Blob([buffer], { type: `image/${type}` }), `gallery.${type}`);
                form.set('public_id', `epic_portal/galleries/${branch}/${randomUUID()}`);
                form.set('overwrite', 'false');
                let response;
                try {
                    response = await uploadFetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`).toString('base64')}` },
                        body: form, signal: AbortSignal.timeout(20000)
                    });
                } catch { return reply(502, { error: 'Cloudinary upload could not complete. Please try again.' }); }
                if (!response.ok) return reply(502, { error: 'Cloudinary rejected the upload. Check your Cloudinary credentials and account limits.' });
                const result = await response.json();
                if (!validation.cloudinaryImage(result.secure_url)) return reply(502, { error: 'Cloudinary did not return a valid image URL.' });
                return reply(201, { url: result.secure_url });
            }
            if (route === '/content' && req.method === 'PUT') {
                const input = await json();
                const data = validation.validate(input);
                const record = await store.getWithMetadata('content', { type: 'json' });
                const current = record?.data || seed;
                // Keep the application revision in JSON rather than the HTTP
                // If-Match header, which deployment proxies can interpret or strip.
                if (!Number.isSafeInteger(input.version) || input.version < 0) return reply(400, { error: 'Missing content version. Refresh the admin panel and try again.' });
                if (input.version !== (current.version || 0)) return reply(409, { error: 'Content changed in another tab. Reload before saving.' });
                data.version = (current.version || 0) + 1;
                const write = await store.setJSON('content', data, record ? { onlyIfMatch: record.etag } : { onlyIfNew: true });
                if (!write.modified) return reply(409, { error: 'Content changed in another tab. Reload before saving.' });
                return reply(200, data);
            }
            if (route === '/upload' && req.method === 'POST') {
                const buffer = Buffer.from(await req.arrayBuffer());
                if (buffer.length > 3 * 1024 * 1024) return reply(413, { error: 'Choose an image smaller than 3 MB.' });
                const ext = buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' : buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 ? 'jpg' : buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : null;
                if (!ext) return reply(400, { error: 'Use PNG, JPEG, or WebP images.' });
                const name = `media/${randomUUID()}.${ext}`;
                await store.set(name, buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
                return reply(201, { url: `/${name}` });
            }
            return reply(404, { error: 'Not found.' });
        } catch (error) { return reply(error.status || (error instanceof SyntaxError ? 400 : 500), { error: error.status ? error.message : 'Unable to process request.' }); }
    };
}
export default makeHandler();
export const config = { rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
