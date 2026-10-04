self.addEventListener('push', event => {
    let payload = {};
    try { payload = event.data ? event.data.json() : {}; } catch (_) { payload = { body: event.data?.text() || '' }; }
    event.waitUntil(self.registration.showNotification(payload.title || 'EPIC update', {
        body: payload.body || 'There is a new update from EPIC.',
        icon: '/assets/images/highlights/converge-cover-generated.png',
        badge: '/assets/images/highlights/converge-cover-generated.png',
        data: { url: payload.url || '/' }
    }));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
    event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
           const existing = windows.find(client => client.url.startsWith(self.location.origin));
        return existing ? existing.focus() : clients.openWindow(target);
    }));
});
