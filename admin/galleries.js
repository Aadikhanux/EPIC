(() => {
    let draft = null, changed = false, busy = false;
    const branch = () => $('gallery-branch').value;
    window.hasGalleryDraft = () => changed || busy;
    window.resetGalleryEditor = () => { draft = null; changed = false; $('gallery-images').replaceChildren(); };
    function setBusy(value) {
        busy = value;
        $('gallery-controls').disabled = value;
        $('publish-galleries').disabled = value || !draft;
        $('logout').disabled = value;
    }
    function markChanged() { changed = true; status('Gallery changes are not live yet. Click Publish galleries when ready.'); }
    function render() {
        const host = $('gallery-images'); host.replaceChildren();
        if (!draft) return;
        const images = draft.galleries[branch()];
        if (!images.length) { const empty = document.createElement('p'); empty.textContent = 'No images yet. Upload the first image for this gallery.'; host.append(empty); }
        images.forEach((image, index) => {
            const card = document.createElement('article'); card.className = 'gallery-card';
            const preview = document.createElement('img'); preview.src = image.url; preview.alt = image.caption || `${branch().toUpperCase()} gallery image`; preview.loading = 'lazy'; card.append(preview);
            const label = document.createElement('label'); label.textContent = 'Caption / image description';
            const caption = document.createElement('input'); caption.value = image.caption; caption.maxLength = 500;
            caption.oninput = () => { image.caption = caption.value; markChanged(); }; label.append(caption); card.append(label);
            const url = document.createElement('a'); url.href = image.url; url.target = '_blank'; url.rel = 'noopener'; url.textContent = 'View Cloudinary image ↗'; card.append(url);
            const controls = document.createElement('div'); controls.className = 'actions';
            for (const [text, offset] of [['Move earlier', -1], ['Move later', 1]]) {
                const button = document.createElement('button'); button.className = 'secondary'; button.textContent = text;
                button.disabled = index + offset < 0 || index + offset >= images.length;
                button.onclick = () => { [images[index], images[index + offset]] = [images[index + offset], images[index]]; markChanged(); render(); }; controls.append(button);
            }
            const remove = document.createElement('button'); remove.className = 'danger'; remove.textContent = 'Remove';
            remove.onclick = () => { if (!confirm('Remove this image from the gallery when you publish?')) return; images.splice(index, 1); markChanged(); render(); }; controls.append(remove);
            card.append(controls); host.append(card);
        });
    }
    async function showGallery(show) {
        $('event-area').hidden = show; $('gallery-area').hidden = !show;
        $('events-tab').setAttribute('aria-pressed', String(!show)); $('gallery-tab').setAttribute('aria-pressed', String(show));
        if (!show || draft || busy) return;
        setBusy(true);
        try { draft = await api('galleries'); render(); status('Choose a branch and upload images to its gallery.'); }
        catch (error) { status(error.message, true); } finally { setBusy(false); }
    }
    $('events-tab').onclick = () => showGallery(false);
    $('gallery-tab').onclick = () => showGallery(true);
    $('gallery-branch').onchange = render;
    $('gallery-files').onchange = async event => {
        const files = Array.from(event.target.files); if (!files.length || !draft) return;
        const target = branch();
        if (draft.galleries[target].length + files.length > 200) { event.target.value = ''; return status('Each gallery supports up to 200 images.', true); }
        if (files.some(file => file.size > 3 * 1024 * 1024 || !['image/png','image/jpeg','image/webp'].includes(file.type))) { event.target.value = ''; return status('Choose PNG, JPEG, or WebP images smaller than 3 MB each.', true); }
        setBusy(true); let count = 0;
        try {
            for (const file of files) {
                status(`Uploading ${count + 1} of ${files.length} to ${target.toUpperCase()} on Cloudinary…`);
                const result = await api('gallery-upload', { method: 'POST', headers: { 'X-Gallery-Branch': target }, body: file });
                draft.galleries[target].push({ url: result.url, caption: `${target.toUpperCase()} gallery image` }); changed = true; count++;
            }
            status(`${count} image(s) uploaded. Click Publish galleries to add them to the website.`);
        } catch (error) { status(`${error.message}${count ? ` ${count} image(s) uploaded successfully and can still be published.` : ''}`, true); }
        finally { event.target.value = ''; render(); setBusy(false); }
    };
    $('publish-galleries').onclick = async () => {
        if (!draft || busy) return;
        setBusy(true);
        try { draft = await api('galleries', { method: 'PUT', body: JSON.stringify(draft) }); changed = false; render(); status('Galleries published. Refresh the branch page to see your images.'); }
        catch (error) { status(error.message, true); } finally { setBusy(false); }
    };
    window.addEventListener('beforeunload', event => { if (changed || busy) { event.preventDefault(); event.returnValue = ''; } });
})();
