# EPIC — Empowering People Through Innovative Computing

Official web portal for **EPIC**, a technical club at **MBM University, Jodhpur**, supported by Google Developer Groups.

![EPIC Logo](https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_800/v1/epic_portal/logos/epic-logo.png)

---

## Overview

EPIC bridges the gap between academic curriculum and industry engineering. We build production systems, compete in national hackathons, and run structured student project cohorts across three specialized wings:

| Wing | Focus |
|------|-------|
| **SPARK** | Ideation, foundation workshops, beginner project incubator |
| **KAIZEN** | Full-stack engineering, system design, AI/ML |
| **PHOENIX** | Competitive programming, national hackathons, open-source |

---

## Tech Stack

- **HTML5** with semantic markup and ARIA attributes
- **CSS3** with custom properties (design tokens), light/dark theming
- **Vanilla JavaScript** (no frameworks)
- **Firebase Realtime Database** for form submissions and remote CSS control
- **Cloudinary CDN** for optimized image delivery (`w_auto`, `f_auto`, `q_auto`)
- **Google Fonts** — Inter, Space Grotesk, DM Mono
- **Font Awesome 6.5** for icons

---

## Features

| Feature | Description |
|---------|-------------|
| Light/Dark theme | Toggle with system preference detection and localStorage persistence |
| Smart navbar | Auto-hides on scroll down, reappears on scroll up |
| AI chatbot | Keyword-matching assistant with typing indicators and quick-reply chips |
| Timeline | Interactive vertical milestone track with scroll-driven fill animation |
| Responsive | Fluid typography, mobile-first grid layouts, bottom social bar on mobile |
| Accessibility | Skip-to-content link, focus-visible styles, ARIA roles, semantic HTML |
| SEO | Open Graph, Twitter Cards, JSON-LD structured data, canonical URL |
| Induction deck | 28-slide fullscreen presentation with keyboard/touch/wheel navigation |
| Firebase forms | Quick messages and member registrations stored in Firebase Realtime DB |
| Remote CSS switch | Real-time CSS killswitch controllable from any device via Firebase |
| Admin dashboard | View messages, registrations, export CSV, and toggle CSS remotely |

---

## Project Structure

```
EPIC/
├── index.html                        Main landing page
├── induction.html                    Interactive slide deck
├── admin.html                        Admin dashboard (local / private)
├── epic-induction-control.html       Standalone CSS controller for presentations
├── epic-induction-control/
│   └── index.html                    Same controller at /epic-induction-control route
├── 404.html                          Custom error page
├── robots.txt                        Crawler instructions
├── assets/
│   ├── css/style.css                 Design tokens, themes, components, responsive
│   └── js/
│       ├── script.js                 Theme, chatbot, navbar, timeline, FAQ, forms
│       ├── firebase-config.js        Firebase project configuration
│       └── remote-css-listener.js    Real-time CSS killswitch listener
├── scripts/
│   └── upload_to_cloudinary.js       Bulk image uploader
├── .env                              Environment variables (gitignored)
├── .env.example                      Environment variable template
├── .gitignore
└── package.json
```

---

## Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/Aadikhanux/EPIC.git
cd EPIC

# Start a local server (pick one)
python -m http.server 3000
# or
npx serve .
```

Then open `http://localhost:3000`.

### Build (Minification)

```bash
npm install
npm run build
```

This generates `style.min.css` and `script.min.js` using cssnano and terser.

### Environment Setup

```bash
cp .env.example .env
# Fill in your Cloudinary and Firebase credentials
```

### Cloudinary Asset Upload

```bash
npm run upload-images
```

---

## Firebase Integration

The portal uses **Firebase Realtime Database** for three features:

### 1. Form Submissions

- **Quick Messages** (`/messages`) — Contact form submissions from visitors
- **Member Registrations** (`/registrations`) — New member signup data

### 2. Remote CSS Killswitch

A real-time toggle at `/killswitch/cssDisabled` that enables or disables all stylesheets on the live site instantly — useful for induction presentations demonstrating what CSS does.

### 3. Admin Dashboard

Open `admin.html` to access:
- **Quick Messages inbox** — Search, view, and delete contact messages
- **Member Registrations roster** — Search, view, delete, and export as CSV
- **CSS Killswitch** — Toggle stylesheets on/off across the live site

### Firebase Database Structure

```json
{
  "killswitch": {
    "cssDisabled": false
  },
  "messages": {
    "-uniqueKey": {
      "name": "...",
      "email": "...",
      "phone": "...",
      "domain": "...",
      "message": "...",
      "submittedAt": "2026-08-17T16:00:00.000Z"
    }
  },
  "registrations": {
    "-uniqueKey": {
      "name": "...",
      "gender": "...",
      "mobile": "...",
      "email": "...",
      "branch": "...",
      "codingExperience": "Yes/No",
      "experienceDetail": "...",
      "question": "...",
      "submittedAt": "2026-08-17T16:00:00.000Z"
    }
  }
}
```

### Firebase Security

Set the following rules in **Firebase Console → Realtime Database → Rules**:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, restrict the API key in **Google Cloud Console → Credentials** to only allow HTTP referrers from `epicmbm.netlify.app/*`.

---

## Core Team

**Faculty Advisor:** Dr. Abhishek Gour.

| Name | Year | Branch |
|------|------|--------|
| Vinti Jingar | 3rd Year | IT |
| Niyati Bhandari | 3rd Year | EEE |
| Renu Gehlot | 3rd Year | IT |
| Samarth Mathur | 3rd Year | AI |
| Kritika | 2nd Year | Civil |
| Adil Khan | 2nd Year | CSE |
| Udit Sharma | 2nd Year | IT |
| Vanshika Singh | 2nd Year | IT |
| Ishika Gupta | 2nd Year | AIDS |
| Tejasvini Jain | 2nd Year | EEE |

---

## Contact

| Channel | Link |
|---------|------|
| Email | dsc.clubs@mbm.ac.in |
| WhatsApp | [+91 78509 40248](https://wa.me/917850940248) |
| Instagram | [@gdg_mbmu](https://www.instagram.com/gdg_mbmu) |
| LinkedIn | [EPIC MBM](https://linkedin.com/company/epic-mbmu) |
| Campus | MBM University, Jodhpur, Rajasthan |

---

## License

© 2026 EPIC Technical Club. Built by EPIC members at MBM University.
