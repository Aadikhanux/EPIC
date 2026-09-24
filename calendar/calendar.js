(() => {
    const host = document.getElementById('calendar-content');
    if (!host) return;
    host.innerHTML = `
            <div class="calendar-layout">
                <div class="month-calendar" aria-label="Month calendar">
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
                    <div class="event-agenda-heading"><span>Upcoming sessions &amp; events</span><span class="event-agenda-count"></span></div>
                    <ol class="event-agenda-list" role="list" id="calendar-events"></ol>
                    <p class="event-agenda-note">Dates, timings, and venue details will be shared once confirmed.</p>
                </div>
            </div>
    `;
    const events = window.EPIC_EVENTS || [];
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
    host.querySelector('.event-agenda-count').textContent = `${events.length} upcoming`;
    for (const event of events) {
        const date = parseDate(event.date);
        const dateText = date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date) : 'Date TBA';
        const item = document.createElement('li');
        item.innerHTML = `<details class="event-agenda-item"><summary>
            <span class="event-session-icon"><img src="https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/epic-logo.png" alt="EPIC logo" loading="lazy" decoding="async"></span>
            <span class="event-agenda-details"><span class="event-kind">${escape(event.week)} / ${escape(event.type)}</span>
            <span class="event-session-title">${escape(event.title)}</span>
            <span class="event-schedule"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${escape(dateText)}</span><span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${formatTime(event.time)}</span></span></span>
            <span class="event-expand" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
            </summary><p class="event-session-description">${escape(event.description)}<br>Venue: ${escape(event.venue || 'To be announced')}</p></details>`;
        list.append(item);
    }
    if (!events.length) list.textContent = 'New events will be announced soon.';

    const heading = document.getElementById('calendar-month');
    const days = document.getElementById('calendar-days');
    if (!heading || !days) return;

    const today = new Date();
    let month = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
    const dateLabel = new Intl.DateTimeFormat('en', { dateStyle: 'full' });

    function render() {
        heading.textContent = monthLabel.format(month);
        days.replaceChildren();
        const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
        for (let week = 0; week < 6; week++) {
            const row = document.createElement('tr');
            for (let day = 0; day < 7; day++) {
                const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7 + day);
                const cell = document.createElement('td');
                const number = document.createElement('span');
                number.textContent = date.getDate();
                cell.setAttribute('aria-label', dateLabel.format(date));
                if (date.getMonth() !== month.getMonth()) cell.classList.add('calendar-outside');
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

    document.getElementById('calendar-prev').addEventListener('click', () => {
        month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        render();
    });
    document.getElementById('calendar-next').addEventListener('click', () => {
        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        render();
    });
    document.getElementById('calendar-today').addEventListener('click', () => {
        month = new Date(today.getFullYear(), today.getMonth(), 1);
        render();
    });
    render();
})();
