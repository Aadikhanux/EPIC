/**
 * Remote CSS Killswitch Listener (Firebase Realtime Database)
 *
 * Listens in real-time to your Firebase Realtime Database at the path `killswitch/cssDisabled`.
 * When cssDisabled === true, it disables all stylesheets (<link rel="stylesheet"> & <style>).
 * When cssDisabled === false, it restores them.
 */

// Replace with your Firebase Realtime Database URL, e.g. "https://your-project-id-default-rtdb.firebaseio.com"
const DEFAULT_FIREBASE_DB_URL = "https://epic-3b86d-default-rtdb.asia-southeast1.firebasedatabase.app";

(function() {
    const dbUrl = window.FIREBASE_DB_URL || localStorage.getItem('epic_firebase_db_url') || DEFAULT_FIREBASE_DB_URL;

    if (!dbUrl || dbUrl.includes("YOUR_PROJECT_ID") || dbUrl.includes("your-project-id")) {
        console.info("[Remote CSS] Configure your Firebase Realtime Database URL in assets/js/remote-css-listener.js or admin.html");
        return;
    }

    const cleanUrl = dbUrl.replace(/\/+$/, "");
    const streamUrl = `${cleanUrl}/killswitch/cssDisabled.json`;

    function setCssDisabled(disabled) {
        document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => {
            el.disabled = Boolean(disabled);
        });
        if (disabled) {
            document.documentElement.setAttribute('data-css-disabled', 'true');
        } else {
            document.documentElement.removeAttribute('data-css-disabled');
        }
    }

    // 1. Initial fast check
    fetch(streamUrl)
        .then(res => res.json())
        .then(val => {
            if (val === true) {
                setCssDisabled(true);
            }
        })
        .catch(() => {});

    // 2. Real-time Live Stream (Firebase REST streaming via EventSource)
    if (typeof EventSource !== 'undefined') {
        try {
            const evtSource = new EventSource(streamUrl);

            evtSource.addEventListener('put', (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    setCssDisabled(parsed.data === true);
                } catch (e) {}
            });

            evtSource.addEventListener('patch', (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    setCssDisabled(parsed.data === true);
                } catch (e) {}
            });

            evtSource.onerror = () => {
                // EventSource will automatically retry connecting
            };
        } catch (err) {
            console.warn("[Remote CSS] EventSource init failed:", err);
        }
    }
})();
