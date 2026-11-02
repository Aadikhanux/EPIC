(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    let registration;

    const base64ToBytes = value => {
        const padding = '='.repeat((4 - value.length % 4) % 4);
        const decoded = atob((value + padding).replace(/-/g, '+').replace(/_/g, '/'));
        return Uint8Array.from(decoded, character => character.charCodeAt(0));
    };

    async function activateWorkerUpdate(worker) {
        if (!worker || worker.state === 'activated') return;
        await new Promise((resolve, reject) => {
            const finish = () => {
                worker.removeEventListener('statechange', onStateChange);
                if (worker.state === 'redundant') reject(new Error('The notification service worker could not update. Refresh and try again.'));
                else resolve();
            };
            const onStateChange = () => {
                if (worker.state === 'activated' || worker.state === 'redundant') finish();
            };
            worker.addEventListener('statechange', onStateChange);
            if (worker.state === 'activated' || worker.state === 'redundant') finish();
        });
    }

    async function enable() {
        if (!supported) throw new Error('Push notifications are not supported by this browser.');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('Notification permission was not granted.');
        registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/', updateViaCache: 'none' });
        await registration.update();
        await activateWorkerUpdate(registration.installing);
        const config = await fetch('/api/notifications/config', { cache: 'no-store' }).then(response => response.json());
        if (!config.publicKey) throw new Error('Push notifications are not configured yet.');
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ToBytes(config.publicKey)
        });
        const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Could not enable notifications.');
        return subscription;
    }

    window.EPIC_PUSH = { supported, enable };
})();
