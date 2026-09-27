const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
// Explicit public allowlist: never publish credentials, backend code, or .env files.
for (const name of ['index.html', '404.html', 'induction.html', 'robots.txt', 'assets', 'calendar', 'cms', 'admin', 'spark', 'kaizen', 'phoenix', 'converge', 'hack-a-day', 'studypods', 'game', 'quiz']) {
    fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}
console.log('Public site built in dist/.');
