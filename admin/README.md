# EPIC Admin Studio

Open `/admin/` on the Netlify website. The login screen is public; all edits and uploads require a server-verified session.

## Activate on Netlify

1. Deploy this repository using the included `netlify.toml`. Build command: `node scripts/build-site.js`. Publish directory: `dist`. The repository root must **not** be the publish directory.
2. In Netlify project configuration, add these environment variables with **Functions** scope:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_SALT`
   - `ADMIN_PASSWORD_HASH`
   - `PUBLIC_ORIGIN`: your exact live HTTPS origin, without a trailing slash (for example `https://your-site.netlify.app` or your custom domain).
3. The requested username and hashed password are prepared locally in `.env.netlify.local` (ignored by Git). Copy the three values from that file to Netlify. The plaintext password is not stored in the application. Never put these values in frontend JavaScript or commit this file.
4. Redeploy after setting the variables, then sign in at `/admin/` using the credentials you supplied.

The panel fails closed until credentials are configured. This change does not deploy the site or modify the existing Firebase project's permissions.

## Content controls

- Create, edit, reorder, and delete calendar events and sessions.
- Edit dates, IST times, venue, descriptions, labels, icons, and event images. Blank dates and times display as TBA.
- Upload PNG, JPEG, or WebP files up to 3 MB, or use HTTPS image URLs.
- Publish explicitly. Unpublished edits stay in the current tab. Closing the tab warns about unsaved changes.
- Published content and images persist across deploys in a site-wide Netlify Blobs store. Static content remains the fallback if the content service is unavailable.

The admin panel manages events and sessions only. Website text, general page images, navigation, theme settings, and page layouts are maintained in the website source code.

## Security and maintenance

Password verification uses salted scrypt hashes. Sessions use random tokens, are stored server-side, expire after eight hours, and are sent through HttpOnly, SameSite=Strict, Secure cookies on HTTPS. Writes require both the configured origin and a session CSRF token. Login attempts are limited using atomic persistent counters; the function also has a platform rate-limit configuration. Content writes use conditional storage updates to prevent concurrent overwrites. Uploaded images are checked by signature; SVG uploads are not accepted. Event text is escaped before rendering.

Use the production origin for login; preview domains cannot make authenticated writes unless explicitly configured as the origin. Preview deploys share site-wide storage, so do not change the origin to a public preview casually. Back up the `content` blob and media periodically. Uploaded files are retained even after an event is deleted so reused images do not break. Expired session records are rejected but retained in storage; periodic cleanup can be added as usage grows.

To rotate a password, generate a new random salt and scrypt hash, update the Functions variables, and remove existing `sessions/` entries from the Blobs store to revoke current sessions.

## Verification

`node --test tests/admin-api.test.mjs` tests the function with an in-memory store, including login, authentication bypass attempts, CSRF, validation, uploads, persistence, session expiry, and logout. `node scripts/build-site.js` builds the public output without backend or credential files. Test the deployed site once on Netlify to confirm platform bindings, HTTPS cookies, custom-domain origin, and storage permissions.

Storage integration follows [Netlify Blobs documentation](https://docs.netlify.com/build/data-and-storage/netlify-blobs/).
