const fail = (status, message) => Object.assign(new Error(message), { status });
const safeImage = value => value === '' || /^https:\/\/[^\s<>"']+$/.test(value) || /^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(value);
function validate(data) {
    if (!data || !Array.isArray(data.events) || data.events.length > 200) throw fail(400, 'Invalid event schedule.');
    for (const event of data.events) {
        if (!event || typeof event !== 'object') throw fail(400, 'Invalid event.');
        for (const key of ['title', 'week', 'type', 'date', 'time', 'venue', 'description', 'icon', 'image']) {
            if (typeof event[key] !== 'string' || event[key].length > (key === 'description' ? 5000 : 1000)) throw fail(400, `Invalid event ${key}.`);
        }
        if (!event.title.trim() || !safeImage(event.image) || !/^fa-[a-z0-9-]+$/.test(event.icon)) throw fail(400, 'Check the event title, image URL, and icon.');
        if (event.date && (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !Number.isFinite(Date.parse(event.date)) || new Date(event.date).toISOString().slice(0, 10) !== event.date)) throw fail(400, 'Invalid date.');
        if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) throw fail(400, 'Invalid time.');
        if (event.endTime !== undefined && (typeof event.endTime !== 'string' || (event.endTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.endTime)))) throw fail(400, 'Invalid end time.');
    }
    return { events: data.events.map(event => ({ ...Object.fromEntries(['title', 'week', 'type', 'date', 'time', 'venue', 'description', 'icon', 'image'].map(key => [key, event[key]])), endTime: event.endTime || '' })) };
}

const branches = ['spark', 'kaizen', 'phoenix'];
const cloudinaryImage = value => typeof value === 'string' && value.length <= 2000 && /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/[^\s<>"']+$/.test(value);
function validateGalleries(input) {
    if (!input?.galleries || Object.keys(input.galleries).some(key => !branches.includes(key))) throw fail(400, 'Only SPARK, KAIZEN, and PHOENIX galleries can be edited.');
    const galleries = {};
    for (const key of branches) {
        const images = input.galleries[key];
        if (!Array.isArray(images) || images.length > 200) throw fail(400, 'Each gallery supports up to 200 images.');
        galleries[key] = images.map(image => {
            if (!image || !cloudinaryImage(image.url) || typeof image.caption !== 'string' || image.caption.length > 500) throw fail(400, 'Use a Cloudinary image URL and a caption of up to 500 characters.');
            return { url: image.url, caption: image.caption };
        });
    }
    return { galleries };
}
module.exports = { validate, safeImage, validateGalleries, cloudinaryImage, branches };
