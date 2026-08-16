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

---

## Project Structure

```
EPIC/
├── index.html                  Main landing page
├── induction.html              Interactive slide deck
├── 404.html                    Custom error page
├── robots.txt                  Crawler instructions
├── assets/
│   ├── css/style.css           Design tokens, themes, components, responsive
│   └── js/script.js            Theme switcher, chatbot, navbar, timeline, FAQ
├── scripts/
│   └── upload_to_cloudinary.js Bulk image uploader
├── .env.example                Environment variable template
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

### Cloudinary Asset Upload

```bash
cp .env.example .env
# Fill in your Cloudinary credentials
npm run upload-images
```

---

## Core Team

**Faculty Advisor:** Dr. Abhishek Gour

| Name | Year | Branch |
|------|------|--------|
| Mayank Aggarwal | Final Year | CSE |
| Vinti Jingar | 3rd Year | IT |
| Niyati Bhandari | 3rd Year | EEE |
| Renu Gehlot | 3rd Year | EEE |
| Kritika | 2nd Year | Civil |
| Samarth Mathur | 3rd Year | AI |
| Adil Khan | 2nd Year | CSE |
| Udit Sharma | 2nd Year | IT |
| Vanshika Singh | 2nd Year | IT |
| Ishika Gupta | 2nd Year | AIDS |
| Tejasvini Jain | 2nd Year | CSE |

---

## Contact

| Channel | Link |
|---------|------|
| Email | sparkmbmu@gmail.com |
| WhatsApp | [+91 78509 40248](https://wa.me/917850940248) |
| Instagram | [@gdg_mbmu](https://www.instagram.com/gdg_mbmu) |
| LinkedIn | [EPIC MBM](https://linkedin.com/company/epic-mbmu) |
| Campus | MBM University, Jodhpur, Rajasthan |

---

## License

2026 EPIC Technical Club. Built by EPIC members at MBM University.
