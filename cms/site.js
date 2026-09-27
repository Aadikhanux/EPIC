(() => {
    const script = document.currentScript;
    const base = new URL('../', script.src);
    fetch(new URL('api/content', base), { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('CMS unavailable');
        return r.json();
    }).then(data => {
        const decoder = document.createElement('textarea');
        for (const entry of data.content || []) {
            if (entry.kind !== 'text') continue;
            const element = document.querySelector(`[data-cms="${entry.id}"]`);
            if (element) { decoder.innerHTML = entry.value; element.textContent = decoder.value; }
        }
        const replacements = new Map(data.content.filter(e => e.kind === 'image' && e.original !== e.value).map(e => [e.original, e.value]));
        const updateImages = () => document.querySelectorAll('img').forEach(img => {
            const original = img.dataset.cmsOriginal || img.getAttribute('src');
            const replacement = replacements.get(original);
            if (replacement && img.getAttribute('src') !== replacement) {
                img.dataset.cmsOriginal = original;
                img.src = replacement;
                img.removeAttribute('srcset');
            }
        });
        updateImages();
        if (replacements.size) new MutationObserver(updateImages).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    }).catch(() => { /* Static content remains available when the CMS is offline. */ });
})();
