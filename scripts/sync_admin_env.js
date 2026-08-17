/**
 * Syncs ADMIN_USERNAME and ADMIN_PASSWORD from .env to assets/js/admin-auth-config.js
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const username = process.env.ADMIN_USERNAME || "epicadmin";
const password = process.env.ADMIN_PASSWORD || "EpicAdmin@2026#Secure";

const configContent = `/**
 * EPIC Admin Authentication Config (PRIVATE / GITIGNORED)
 * Synced automatically from .env
 */
window.ADMIN_CONFIG = {
    username: ${JSON.stringify(username)},
    password: ${JSON.stringify(password)}
};
`;

const targetPath = path.join(__dirname, '..', 'assets', 'js', 'admin-auth-config.js');
fs.writeFileSync(targetPath, configContent, 'utf-8');
console.log(`[Admin Auth] Successfully synced admin credentials from .env to ${targetPath}`);
