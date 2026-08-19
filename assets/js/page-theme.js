(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('epic_theme') || (systemDark ? 'dark' : 'light');
    root.setAttribute('data-theme', savedTheme);

    const updateButton = (button, theme) => {
        const isDark = theme === 'dark';
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        const icon = button.querySelector('i');
        if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.page-theme-toggle').forEach(button => {
            updateButton(button, root.getAttribute('data-theme'));
            button.addEventListener('click', () => {
                const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', theme);
                localStorage.setItem('epic_theme', theme);
                updateButton(button, theme);
            });
        });
    });
})();
