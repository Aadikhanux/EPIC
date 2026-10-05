const $ = id => document.getElementById(id);
let csrf = '', data, selected = -1, dirty = false;
function status(message, error = false) { $('status').textContent = message; $('status').classList.toggle('error', error); }
async function api(path, options = {}) {
    const response = await fetch(`/api/${path}`, { ...options, headers: { 'X-CSRF-Token': csrf, ...options.headers } });
    const body = await response.json().catch(() => ({ error: 'The admin backend is unavailable. Open this panel on Netlify.' }));
    if (!response.ok) {
        if (response.status === 401) { $('login-panel').hidden = false; $('dashboard').hidden = true; }
        throw new Error(body.error || 'Request failed.');
    }
    return body;
}
async function openDashboard() {
    data = await api('content'); dirty = false;
    $('login-panel').hidden = true; $('dashboard').hidden = false; renderList(); status('Signed in. Select an item to get started.');
}
$('login-form').addEventListener('submit', async event => {
    event.preventDefault(); const button = event.target.querySelector('button'); button.disabled = true;
    try { const input = Object.fromEntries(new FormData(event.target)); csrf = (await api('login', { method: 'POST', body: JSON.stringify(input) })).csrf; event.target.reset(); await openDashboard(); }
    catch (error) { status(error.message, true); } finally { button.disabled = false; }
});
function changed() { dirty = true; status('Unpublished changes — publish when you are ready.'); }
function entries() { return data.events; }
function renderList() {
    $('items').replaceChildren();
    const query = $('search').value.toLowerCase();
    entries().forEach((entry, index) => {
        if (!`${entry.title} ${entry.type}`.toLowerCase().includes(query)) return;
        const button = document.createElement('button'); button.className = `item${selected === index ? ' active' : ''}`;
        button.textContent = entry.title;
        const sub = document.createElement('small'); sub.textContent = `${entry.type} · ${entry.date || 'Date TBA'}`; button.append(sub);
        button.onclick = () => { selected = index; renderList(); renderEditor(); }; $('items').append(button);
    });
}
function field(container, entry, key, label, type = 'text', wide = false) {
    const wrapper = document.createElement('label'); wrapper.textContent = label; if (wide) wrapper.className = 'wide';
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') input.type = type;
    input.value = entry[key] || ''; input.maxLength = type === 'textarea' ? 5000 : 1000;
    input.oninput = () => { entry[key] = input.value; changed(); };
    input.onchange = renderList;
    wrapper.append(input); container.append(wrapper); return input;
}
function imageField(container, entry, key) {
    const input = field(container, entry, key, 'Image URL (HTTPS) or upload below', 'text', true);
    const preview = document.createElement('img'); preview.className = 'preview'; preview.alt = 'Image preview'; preview.hidden = !entry[key];
    const refresh = () => { preview.hidden = !entry[key]; if (/^(https:\/\/|\/media\/)/.test(entry[key])) preview.src = entry[key]; else preview.removeAttribute('src'); };
    refresh(); input.addEventListener('change', refresh); container.append(preview);
    const label = document.createElement('label'); label.textContent = 'Upload image'; label.className = 'wide';
    const upload = document.createElement('input'); upload.type = 'file'; upload.accept = 'image/png,image/jpeg,image/webp';
    upload.onchange = async () => {
        const file = upload.files[0]; if (!file) return;
        if (file.size > 3 * 1024 * 1024) return status('Choose an image smaller than 3 MB.', true);
        upload.disabled = true; $('save').disabled = true;
        try { status('Uploading image…'); entry[key] = (await api('upload', { method: 'POST', body: file })).url; input.value = entry[key]; refresh(); changed(); }
        catch (error) { status(error.message, true); } finally { upload.disabled = false; $('save').disabled = false; }
    };
    label.append(upload); container.append(label);
}
function action(container, title, callback, className = 'secondary') { const button = document.createElement('button'); button.textContent = title; button.className = className; button.onclick = callback; container.append(button); }
function renderEditor() {
    const editor = $('editor'); editor.replaceChildren(); const entry = entries()[selected]; if (!entry) return;
    const heading = document.createElement('h2'); heading.textContent = 'Event details'; editor.append(heading);
    const fields = document.createElement('div'); fields.className = 'fields'; editor.append(fields);
    for (const [key, label, type] of [['title','Title','text'],['type','Type (session, workshop, event…)','text'],['week','Week or label','text'],['venue','Venue','text'],['date','Date (leave blank if unconfirmed)','date'],['time','Start time (IST)','time'],['endTime','End time (IST, optional)','time'],['icon','Icon (e.g. fa-fire, fa-code, fa-layer-group)','text']]) field(fields, entry, key, label, type);
    field(fields, entry, 'description', 'Description', 'textarea', true); imageField(fields, entry, 'image');
    const actions = document.createElement('div'); actions.className = 'actions'; editor.append(actions);
    for (const [title, direction] of [['Move up',-1],['Move down',1]]) action(actions, title, () => { const next = selected + direction; if (next < 0 || next >= data.events.length) return; [data.events[selected],data.events[next]] = [data.events[next],data.events[selected]]; selected = next; changed(); renderList(); });
    action(actions, 'Delete event', () => { if (!confirm('Delete this event? The change takes effect when you publish.')) return; data.events.splice(selected, 1); selected = -1; changed(); renderList(); renderEditor(); }, 'danger');
}
$('search').oninput = renderList;
$('notify-users').onclick = () => { $('notification-panel').hidden = !$('notification-panel').hidden; if (!$('notification-panel').hidden) $('notification-form').elements.title.focus(); };
$('notification-cancel').onclick = () => { $('notification-panel').hidden = true; };
$('notification-form').onsubmit = async event => {
    event.preventDefault();
    const button = event.target.querySelector('button[type="submit"]'); button.disabled = true;
    try {
        const input = Object.fromEntries(new FormData(event.target));
        const result = await api('notifications/send', { method: 'POST', body: JSON.stringify(input) });
        event.target.reset(); event.target.elements.url.value = '/'; $('notification-panel').hidden = true;
        status(`Notification sent to ${result.sent} subscriber${result.sent === 1 ? '' : 's'}${result.removed ? `; removed ${result.removed} expired subscription${result.removed === 1 ? '' : 's'}` : ''}.`);
    } catch (error) { status(error.message, true); } finally { button.disabled = false; }
};
$('add').onclick = () => { data.events.push({ title: 'New event', type: 'Session', week: '', date: '', time: '', endTime: '', venue: '', description: '', icon: 'fa-calendar-days', image: '' }); selected = data.events.length - 1; changed(); renderList(); renderEditor(); };
$('save').onclick = async () => {
    $('save').disabled = true;
    try { data = await api('content', { method: 'PUT', body: JSON.stringify(data) }); dirty = false; status('Published. Refresh the website to see your changes.'); renderList(); renderEditor(); }
    catch (error) { status(error.message, true); } finally { $('save').disabled = false; }
};
$('logout').onclick = async () => {
    if ((dirty || window.hasGalleryDraft?.()) && !confirm('Sign out and discard unpublished changes?')) return;
    try { await api('logout', { method: 'POST' }); dirty = false; window.resetGalleryEditor?.(); csrf = ''; data = null; $('editor').replaceChildren(); $('items').replaceChildren(); $('dashboard').hidden = true; $('login-panel').hidden = false; status('Signed out.'); }
    catch (error) { status(error.message, true); }
};
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
api('session').then(session => { csrf = session.csrf; return openDashboard(); }).catch(error => { if (error.message !== 'Please sign in.') status(error.message, true); });
