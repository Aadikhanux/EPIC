# EPIC — Empowering People Through Innovative Computing 🚀

Official web portal and technical showcase for **EPIC**, a premier technical club at **MBM University, Jodhpur**, supported by Google Developer Groups.

![EPIC Portal Preview](https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto/v1/epic_portal/logos/epic-logo.png)

---

## 🌟 Overview

EPIC is an engineering community designed to bridge academic curriculum with industry technology standards. We build production systems, compete in national hackathons, and run structured student project cohorts.

### 🏛️ The Three Wings
1. **⚡ SPARK**: Ideation, foundation workshops, and beginner project incubator.
2. **🛠️ KAIZEN**: Continuous learning, full-stack engineering, system design, and AI/ML tracks.
3. **🔥 PHOENIX**: High-intensity competitive programming, national hackathons, and open-source contributions.

---

## 🎯 Features

- **🎨 Modern Aesthetic**: Clean, professional Light & Dark themes with tailored typography and subtle glassmorphic UI.
- **🧭 Smart Auto-Hiding Navbar**: Intelligently hides on downward scroll and reappears when scrolling up.
- **⏳ SPARK Continuous Timeline**: Interactive vertical milestone progress track tracking club events (Foundation, StudyPods 5.0, Hack-a-Day, Converge 2026).
- **🤖 EPIC Assistant Chatbot**: Interactive floating doubts assistant with simulated real-time typing, timestamps, quick chips, and knowledge-matching capabilities.
- **📱 Fully Mobile Responsive**: Engineered with fluid typography, responsive flex/grid layouts, and customized tap targets.
- **☁️ Cloudinary CDN Ready**: Optimized image loading with automatic format conversion (`f_auto, q_auto`), smart face detection (`c_fill, g_face`), and local offline fallbacks.
- **📑 Induction Slide Deck**: Dedicated interactive keyboard-controlled presentation at `induction.html`.

---

## 👥 Core Leadership (Current Year)

- **Patron & Faculty Advisor**: Dr. Abhishek Gour
- **Mayank Aggarwal** (Final Year • CSE)
- **Renu Gehlot** (3rd Year • EEE)
- **Niyati Bhandari** (3rd Year • EEE)
- **Vinti Jingar** (3rd Year • IT)
- **Kritika** (2nd Year • Civil)
- **Adil Khan** (2nd Year • CSE)
- **Udit Sharma** (2nd Year • IT)
- **Vanshika Singh** (2nd Year • IT)
- **Ishita** (2nd Year • AIDS)
- **Tejasvini Jain** (2nd Year • CSE)

---

## 📁 Project Structure

```
EPIC/
├── index.html                  # Main club landing page
├── induction.html              # Fullscreen interactive induction slide deck
├── .env.example                # Template for environment variables
├── .gitignore                  # Git safety rules (protects credentials)
├── package.json                # Project scripts & optional CDN upload tool
├── assets/
│   ├── css/
│   │   └── style.css           # Design tokens, themes, layout, components
│   ├── js/
│   │   └── script.js           # Theme switcher, chatbot engine, smart navbar, timeline
│   └── images/
│       ├── logos/              # Official club & branch logos
│       ├── mentor/             # Faculty advisor media
│       ├── team/               # Core team photos
│       └── projects/           # Showcase and event captures
└── scripts/
    └── upload_to_cloudinary.js # Automated bulk asset upload tool
```

---

## 🚀 Getting Started

### Local Preview
Simply open `index.html` in any modern web browser or run a local static server:

```bash
# Using Python
python -m http.server 3000

# Using Node / npx
npx serve .
```

### Cloudinary Asset Sync (Optional)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Enter your Cloudinary credentials in `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=epic_portal
   ```
3. Run the automated upload tool:
   ```bash
   npm install
   npm run upload-images
   ```

---

## 📬 Contact & Community

- **Email**: `sparkmbmu@gmail.com`
- **WhatsApp**: [+91 78509 40248](https://wa.me/917850940248)
- **Instagram**: [@gdg_mbmu](https://www.instagram.com/gdg_mbmu)
- **Campus**: MBM University, Jodhpur, Rajasthan, India

---

© 2026 EPIC Technical Club. Built by EPIC builders.
