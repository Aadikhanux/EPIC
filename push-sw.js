self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
    let payload = {};
    try { payload = event.data ? event.data.json() : {}; } catch (_) { payload = { body: event.data?.text() || '' }; }
    event.waitUntil(self.registration.showNotification(payload.title || 'EPIC update', {
        body: payload.body || 'There is a new update from EPIC.',
        icon: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1/epic_portal/logos/epic-logo.png',
        badge: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1/epic_portal/logos/epic-logo.png',
        data: { url: payload.url || '/' }
    }));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    let targetUrl;
    try { targetUrl = new URL(event.notification.data?.url || '/', self.location.origin); }
    catch (_) { targetUrl = new URL('/', self.location.origin); }
    if (targetUrl.origin !== self.location.origin) targetUrl = new URL('/', self.location.origin);
    const target = targetUrl.href;
    event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
        const existing = windows.find(client => new URL(client.url).origin === self.location.origin);
        if (!existing) return clients.openWindow(target);
        return existing.navigate(target).then(client => (client || existing).focus());
    }));
});
