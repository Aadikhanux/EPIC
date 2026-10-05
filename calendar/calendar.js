(async () => {
    const contentURL = new URL('../api/content', document.currentScript.src);
    const host = document.getElementById('calendar-content');
    if (!host) return;
    host.innerHTML = `
            <div class="calendar-layout">
                <div class="month-calendar" aria-label="Month calendar">
                    <div class="calendar-eyebrow"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> THE EPIC CALENDAR</span><span class="calendar-live">What's next</span></div>
                    <div class="month-calendar-nav">
                        <button type="button" id="calendar-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
                        <h3 id="calendar-month" aria-live="polite"></h3>
                        <button type="button" id="calendar-next" aria-label="Next month"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
                    </div>
                    <table class="month-calendar-grid" aria-labelledby="calendar-month">
                        <thead><tr><th scope="col">Sun</th><th scope="col">Mon</th><th scope="col">Tue</th><th scope="col">Wed</th><th scope="col">Thu</th><th scope="col">Fri</th><th scope="col">Sat</th></tr></thead>
                        <tbody id="calendar-days"></tbody>
                    </table>
                    <div class="month-calendar-footer"><span><span class="calendar-today-key" aria-hidden="true"></span> Today</span><button type="button" id="calendar-today">Back to today</button></div>
                    <noscript>Enable JavaScript to view the month calendar.</noscript>
                </div>
                <div class="event-agenda">
                    <div class="event-agenda-heading"><div><span class="agenda-eyebrow">LEARN. CONNECT. CREATE.</span><h3>On the horizon</h3></div><div class="event-agenda-actions"><span class="event-agenda-count"></span><button class="event-notification-button" type="button" id="eventNotificationButton"><i class="fa-regular fa-bell" aria-hidden="true"></i> Enable reminders</button></div></div>
                    <ol class="event-agenda-list" role="list" id="calendar-events"></ol>
                    <p class="event-agenda-note">Dates, timings, and venue details will be shared once confirmed.</p>
                </div>
            </div>
    `;
    let events = window.EPIC_EVENTS || [];
    try {
        const response = await fetch(contentURL, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        if (response.ok) {
            const content = await response.json();
            if (Array.isArray(content.events)) events = content.events;
        }
    } catch (_) { /* Keep the static schedule available offline. */ }
    const list = document.getElementById('calendar-events');
    const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const parseDate = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
    };
    const formatTime = value => {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value || '')) return 'Time TBA';
        const [hours, minutes] = value.split(':').map(Number);
        return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'} IST`;
    };
    const eventRetentionMs = 5 * 60 * 60 * 1000;
    const validTime = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '');
    const parseEventStart = event => {
        if (!parseDate(event.date)) return null;
        const time = validTime(event.time) ? `${event.time}:00.000` : '23:59:59.999';
        return new Date(`${event.date}T${time}+05:30`);
    };
    const eventExpiresAt = event => {
        const start = parseEventStart(event);
        if (!start) return Infinity;
        let end = start.getTime();
        if (validTime(event.endTime)) {
            end = new Date(`${event.date}T${event.endTime}:00+05:30`).getTime();
            if (end < start.getTime() && validTime(event.time)) end += 24 * 60 * 60 * 1000;
        }
        return end + eventRetentionMs;
    };
    events = events.filter(event => Date.now() < eventExpiresAt(event));
    host.querySelector('.event-agenda-count').textContent = `${events.length} upcoming`;
    for (const event of events) {
        const date = parseDate(event.date);
        const dateText = date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date) : 'Date TBA';
        const item = document.createElement('li');
        event.agendaItem = item;
        item.innerHTML = `<details class="event-agenda-item"><summary>
            <span class="event-session-icon" aria-hidden="true"><i class="fa-solid ${escape(/^fa-[a-z0-9-]+$/.test(event.icon || '') ? event.icon : 'fa-calendar-days')}"></i></span>
            <span class="event-agenda-details"><span class="event-kind">${escape(event.week)} / ${escape(event.type)}</span>
            <span class="event-session-title">${escape(event.title)}</span>
            <span class="event-schedule"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${escape(dateText)}</span><span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${formatTime(event.time)}</span></span></span>
            <span class="event-expand" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
            </summary>${event.image && /^(https:\/\/|\/media\/)/.test(event.image) ? `<img class="event-cover" src="${escape(event.image)}" alt="${escape(event.title)}" loading="lazy">` : ''}<p class="event-session-description">${escape(event.description)}<br>Venue: ${escape(event.venue || 'To be announced')}</p></details>`;
        list.append(item);
    }
    if (!events.length) list.textContent = 'New events will be announced soon.';

    const notificationButton = document.getElementById('eventNotificationButton');
    const notificationKey = 'epic_event_notifications';
    const readNotificationState = () => {
        try { return JSON.parse(localStorage.getItem(notificationKey) || '{}'); } catch (_) { return {}; }
    };
    const writeNotificationState = state => {
        try { localStorage.setItem(notificationKey, JSON.stringify(state)); } catch (_) { /* Storage may be unavailable. */ }
    };
    const notificationSupported = 'Notification' in window;
    const updateNotificationButton = () => {
        if (!notificationSupported) {
            notificationButton.disabled = true;
            notificationButton.title = 'Browser notifications are not supported here.';
        } else if (Notification.permission === 'granted') {
            notificationButton.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i> Reminders on';
            notificationButton.classList.add('is-enabled');
        }
    };
    const notifyForUpcomingEvents = () => {
        if (!notificationSupported || Notification.permission !== 'granted') return;
        const state = readNotificationState();
        const currentTime = Date.now();
        events.forEach(event => {
            const start = parseEventStart(event);
            if (!start) return;
            const timeUntilEvent = start.getTime() - currentTime;
            if (timeUntilEvent < 0 || timeUntilEvent > 24 * 60 * 60 * 1000) return;
            const eventKey = `${event.title}|${event.date}|${event.time}`;
            if (state[eventKey]) return;
            new Notification(`EPIC reminder: ${event.title}`, {
                body: event.time ? `Starts at ${formatTime(event.time)}${event.venue ? ` at ${event.venue}` : ''}.` : 'This event is coming up within 24 hours.',
                tag: eventKey
            });
            state[eventKey] = currentTime;
        });
        writeNotificationState(state);
    };
    updateNotificationButton();
    notificationButton.addEventListener('click', async () => {
        if (!notificationSupported || !window.EPIC_PUSH?.supported) return;
        notificationButton.disabled = true;
        try {
            await window.EPIC_PUSH.enable();
            updateNotificationButton();
            notifyForUpcomingEvents();
        } catch (error) { notificationButton.disabled = false; notificationButton.title = error.message; }
    });
    notifyForUpcomingEvents();
    window.setInterval(notifyForUpcomingEvents, 60 * 1000);

    const heading = document.getElementById('calendar-month');
    const days = document.getElementById('calendar-days');
    if (!heading || !days) return;

    const today = new Date();
    const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let month = new Date(firstMonth);
    const previous = document.getElementById('calendar-prev');
    const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
    const dateLabel = new Intl.DateTimeFormat('en', { dateStyle: 'full' });

    function render() {
        previous.disabled = month <= firstMonth;
        heading.textContent = monthLabel.format(month);
        days.replaceChildren();
        const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
        for (let week = 0; week < 6; week++) {
            const row = document.createElement('tr');
            for (let day = 0; day < 7; day++) {
                const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7 + day);
                const cell = document.createElement('td');
                if (date.getMonth() !== month.getMonth()) {
                    row.append(cell);
                    continue;
                }
                const number = document.createElement('span');
                number.textContent = date.getDate();
                cell.setAttribute('aria-label', dateLabel.format(date));
                if (date.toDateString() === today.toDateString()) cell.setAttribute('aria-current', 'date');
                const scheduled = events.filter(event => parseDate(event.date)?.toDateString() === date.toDateString());
                if (scheduled.length) {
                    cell.classList.add('calendar-has-event');
                    cell.title = scheduled.map(event => event.title).join(', ');
                    cell.setAttribute('aria-label', `${dateLabel.format(date)}: ${cell.title}`);
                }
                cell.append(number);
                row.append(cell);
            }
            days.append(row);
        }
    }

    previous.addEventListener('click', () => {
        if (month <= firstMonth) return;
        month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        render();
    });
    document.getElementById('calendar-next').addEventListener('click', () => {
        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        render();
    });
    document.getElementById('calendar-today').addEventListener('click', () => {
        month = new Date(firstMonth);
        render();
    });
    render();
    // Expire sessions even when the visitor leaves the calendar open.
    window.setInterval(() => {
        const currentTime = Date.now();
        const retained = events.filter(event => {
            if (currentTime < eventExpiresAt(event)) return true;
            event.agendaItem.remove();
            return false;
        });
        if (retained.length === events.length) return;
        events = retained;
        host.querySelector('.event-agenda-count').textContent = `${events.length} upcoming`;
        if (!events.length) list.textContent = 'New events will be announced soon.';
        render();
    }, 60 * 1000);
})();
