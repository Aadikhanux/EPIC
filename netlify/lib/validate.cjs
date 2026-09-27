const fail = (status, message) => Object.assign(new Error(message), { status });
const safeImage = value => value === '' || /^https:\/\/[^\s<>"']+$/.test(value) || /^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(value);
function validate(data) {
    if (!data || !Array.isArray(data.events) || data.events.length > 200 || !Array.isArray(data.content) || data.content.length > 2000) throw fail(400, 'Invalid content.');
    for (const event of data.events) {
        if (!event || typeof event !== 'object') throw fail(400, 'Invalid event.');
        for (const key of ['title', 'week', 'type', 'date', 'time', 'venue', 'description', 'icon', 'image']) {
            if (typeof event[key] !== 'string' || event[key].length > (key === 'description' ? 5000 : 1000)) throw fail(400, `Invalid event ${key}.`);
        }
        if (!event.title.trim() || !safeImage(event.image) || !/^fa-[a-z0-9-]+$/.test(event.icon)) throw fail(400, 'Check the event title, image URL, and icon.');
        if (event.date && (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !Number.isFinite(Date.parse(event.date)) || new Date(event.date).toISOString().slice(0, 10) !== event.date)) throw fail(400, 'Invalid date.');
        if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) throw fail(400, 'Invalid time.');
    }
    const catalog = require('../../cms/catalog.json');
    if (data.content.length !== catalog.length) throw fail(400, 'Content catalog mismatch.');
    data.content.forEach((entry, i) => {
        if (!entry || typeof entry !== 'object') throw fail(400, 'Invalid page content.');
        if (entry.id !== catalog[i].id || entry.kind !== catalog[i].kind || typeof entry.value !== 'string' || entry.value.length > 10000 || (entry.kind === 'image' && !safeImage(entry.value))) throw fail(400, 'Invalid page content.');
    });
    return { events: data.events.map(event => Object.fromEntries(['title', 'week', 'type', 'date', 'time', 'venue', 'description', 'icon', 'image'].map(key => [key, event[key]]))), content: data.content.map((entry, i) => ({ ...catalog[i], value: entry.value })) };
}

module.exports = { validate, safeImage };
