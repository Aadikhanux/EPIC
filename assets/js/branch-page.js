/* ================================================================
   Branch Page — Enhanced JS (Redesigned)
   ================================================================ */

const branchPages = {
    spark: {
        name: 'SPARK',
        eyebrow: '01 / Foundation Wing',
        tagline: 'Your Curiosity, Our Spark',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/spark-logo.png',
        description: 'SPARK is where technical curiosity becomes momentum. It gives new builders a welcoming, structured path from first principles to a working prototype—without assuming prior experience.',
        represents: 'The entry gateway to EPIC and its culture of experimentation. SPARK helps members discover what excites them, learn confidently with peers, and develop the habit of turning an idea into something tangible.',
        focus: ['Programming fundamentals', 'HTML & CSS', 'JavaScript', 'Python', 'Git & GitHub', 'UI prototyping', 'Problem solving', 'Idea validation'],
        activities: ['Beginner-friendly coding bootcamps and guided labs', 'Ideation circles and design-thinking sprints', 'Mini-project weeks with mentor checkpoints', 'Git, portfolio, and developer-tool workshops'],
        skills: ['Strong technical foundations', 'Confidence to build independently', 'Team communication and presentation', 'A first project-ready portfolio'],
        stats: [
            { value: '50+', label: 'Active Members' },
            { value: '12', label: 'Workshops/Year' },
            { value: '30+', label: 'Projects Built' },
            { value: '4', label: 'Focus Tracks' }
        ],
        images: [
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213201/spark_02.jpg', 'SPARK members learning and building together'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213202/spark_03.jpg', 'SPARK collaborative learning session'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213201/spark_04.jpg', 'SPARK students working on technical activities'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213201/spark_05.jpg', 'A hands-on SPARK workshop'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213199/spark_08.jpg', 'SPARK members sharing ideas'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213199/spark_07.jpg', 'Students participating in a SPARK session'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213199/spark_01.jpg', 'A memorable moment from SPARK'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787213199/spark_06.jpg', 'The SPARK community in action']
        ]
    },
    kaizen: {
        name: 'KAIZEN',
        eyebrow: '02 / Engineering Wing',
        tagline: 'Change For The Better',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/kaizen-logo.png',
        description: 'KAIZEN is the continuous-improvement track for members ready to deepen their engineering craft. It connects disciplined learning with real systems, modern tools, and thoughtful technical decisions.',
        represents: "EPIC's commitment to steady, measurable technical growth. KAIZEN turns foundational knowledge into specialized, domain-focused expertise through iteration, code review, system thinking, and production-style collaboration.",
        focus: ['Web Development', 'AI/ML', 'UI/UX Design', 'Android Development', 'Cloud Computing', 'Data Structures & Algorithms', 'System Design Basics', 'Version Control Workflows'],
        activities: ['Domain-specific bootcamps (AI/ML, Web, Android, Cloud, UI/UX)', 'Intermediate project builds with mentor guidance', 'Code review and pair-programming sessions', 'Tool and framework-specific workshops'],
        skills: ['Specialization in a chosen tech domain', 'Ability to build full-scale projects independently', 'Hands-on experience with industry-relevant tools', 'A stronger, domain-focused portfolio'],
        stats: [
            { value: '40+', label: 'Active Members' },
            { value: '8', label: 'Tech Tracks' },
            { value: '20+', label: 'Production Apps' },
            { value: '6', label: 'Domains' }
        ],
        images: [
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787214204/kaizen_05.jpg', 'KAIZEN members developing their engineering skills'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787214204/kaizen_04.jpg', 'A collaborative KAIZEN learning session'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787214204/kaizen_02.jpg', 'KAIZEN students working together'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787214205/kaizen_01.jpg', 'Hands-on learning at KAIZEN'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787214203/kaizen_03.jpg', 'The KAIZEN community in action']
        ]
    },
    phoenix: {
        name: 'PHOENIX',
        eyebrow: '03 / Freelancing Wing',
        tagline: 'Redefining The Horizons',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/phoenix-logo.png',
        description: 'PHOENIX bridges the gap between learning a skill and earning through it. Freelancing as a career path, hands-on experience, earn while you learn — building confidence, business awareness, and a strong body of work.',
        represents: 'The professional and entrepreneurial wing of EPIC. PHOENIX builds confidence, business awareness, client experience, and a strong body of work by bridging the gap between learning a skill and earning through it.',
        focus: ['Client Communication', 'Freelance Project Delivery', 'Portfolio Building', 'Pricing & Proposals', 'Web/App Development', 'UI/UX for Clients', 'Time & Scope Management', 'Personal Branding'],
        activities: ['Freelance project matching and onboarding', 'Peer code reviews and delivery checkpoints', 'Client communication and proposal-writing workshops', 'Portfolio and personal-branding sessions'],
        skills: ['Practical portfolio building through real client work', 'Experience handling freelance projects end-to-end', 'Peer code review and quality feedback', 'Resume-worthy, real-world project experience'],
        stats: [
            { value: '35+', label: 'Active Members' },
            { value: '15+', label: 'Client Projects' },
            { value: '₹2L+', label: 'Earned by Members' },
            { value: '5', label: 'Platforms Used' }
        ],
        images: [
            ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=82', 'Freelancers collaborating in a professional workspace'],
            ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=82', 'A team discussing client goals and project scope'],
            ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=82', 'Developers delivering a client project together'],
            ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=82', 'Independent professional software development']
        ]
    }
};

// Cross-navigation data
const allBranches = [
    { key: 'spark', name: 'SPARK', tagline: 'Foundation Wing', logo: branchPages.spark.logo },
    { key: 'kaizen', name: 'KAIZEN', tagline: 'Engineering Wing', logo: branchPages.kaizen.logo },
    { key: 'phoenix', name: 'PHOENIX', tagline: 'Freelancing Wing', logo: branchPages.phoenix.logo }
];

// Determine current branch
const key = document.body.dataset.branchPage;
const branch = branchPages[key];

if (branch) {
    // Apply branch color class
    document.body.classList.add(`bp-${key}`);

    // --- Populate Hero ---
    document.getElementById('bpLogo').src = branch.logo;
    document.getElementById('bpLogo').alt = `${branch.name} logo`;
    document.getElementById('bpEyebrow').textContent = branch.eyebrow;
    document.getElementById('bpTitle').textContent = branch.name;
    document.getElementById('bpTagline').textContent = `"${branch.tagline}"`;
    document.getElementById('bpDescription').textContent = branch.description;

    // --- Populate "What this branch represents" ---
    document.getElementById('bpRepresents').textContent = branch.represents;

    // --- Focus Tags (Bento wide card) ---
    document.getElementById('bpFocus').innerHTML = branch.focus
        .map(item => `<span>${item}</span>`)
        .join('');

    // --- Activities List ---
    document.getElementById('bpActivities').innerHTML = branch.activities
        .map(item => `<li>${item}</li>`)
        .join('');

    // --- Skills List ---
    document.getElementById('bpSkills').innerHTML = branch.skills
        .map(item => `<li>${item}</li>`)
        .join('');

    // --- Stats ---
    document.getElementById('bpStats').innerHTML = branch.stats
        .map(stat => `
            <div class="bp-stat-card bp-reveal">
                <span class="bp-stat-number" data-target="${stat.value}">${stat.value}</span>
                <span class="bp-stat-label">${stat.label}</span>
            </div>
        `).join('');

    // --- Gallery ---
    document.getElementById('bpGallery').innerHTML = branch.images
        .map(([src, alt]) => `
            <figure class="bp-gallery-item bp-reveal">
                <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
                <figcaption class="bp-gallery-caption">${alt}</figcaption>
            </figure>
        `).join('');

    // --- Cross-Branch Navigation ---
    const otherBranches = allBranches.filter(b => b.key !== key);
    document.getElementById('bpCrossNav').innerHTML = otherBranches
        .map(b => `
            <a href="../${b.key}/" class="bp-cross-card bp-cross-${b.key}">
                <div class="bp-cross-card-logo">
                    <img src="${b.logo}" alt="${b.name} logo" loading="lazy">
                </div>
                <div class="bp-cross-card-info">
                    <small class="bp-cross-card-tag">${b.tagline}</small>
                    <h4>${b.name}</h4>
                </div>
                <div class="bp-cross-arrow-box">
                    <i class="fa-solid fa-arrow-right bp-cross-card-arrow"></i>
                </div>
            </a>
        `).join('');

    // --- Image Card Modal System with Left/Right Navigation ---
    function setupBranchImageModal() {
        const galleryItems = branch.images.map(([src, alt]) => ({ src, caption: alt }));
        let currentIndex = 0;

        let modal = document.getElementById('imageCardModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'imageCardModal';
            modal.className = 'image-card-modal';
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('role', 'dialog');
            modal.innerHTML = `
                <div class="image-card-backdrop" data-close-card></div>
                <div class="image-card-dialog">
                    <div class="image-card-header">
                        <div class="image-card-header-left">
                            <span class="image-card-tag"><i class="fa-regular fa-image"></i> ${branch.name} Gallery</span>
                            <span class="image-card-counter" id="imageCardCounter">1 / ${galleryItems.length}</span>
                        </div>
                        <button class="image-card-close" type="button" data-close-card aria-label="Close image card"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="image-card-media">
                        <button class="image-card-nav-btn prev" id="imageCardPrev" type="button" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
                        <img id="imageCardImg" src="" alt="">
                        <button class="image-card-nav-btn next" id="imageCardNext" type="button" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <div class="image-card-footer">
                        <div class="image-card-caption" id="imageCardCaption"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const imgEl = modal.querySelector('#imageCardImg');
        const capEl = modal.querySelector('#imageCardCaption');
        const counterEl = modal.querySelector('#imageCardCounter');
        const prevBtn = modal.querySelector('#imageCardPrev');
        const nextBtn = modal.querySelector('#imageCardNext');

        const updateCardView = (idx, animated = true) => {
            if (idx < 0) idx = galleryItems.length - 1;
            if (idx >= galleryItems.length) idx = 0;
            currentIndex = idx;

            const item = galleryItems[currentIndex];
            if (!item) return;

            if (animated) {
                imgEl.classList.add('fading');
                setTimeout(() => {
                    imgEl.src = item.src;
                    imgEl.alt = item.caption || `${branch.name} Gallery Image`;
                    capEl.textContent = item.caption || `${branch.name} in Action`;
                    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
                    imgEl.classList.remove('fading');
                }, 150);
            } else {
                imgEl.src = item.src;
                imgEl.alt = item.caption || `${branch.name} Gallery Image`;
                capEl.textContent = item.caption || `${branch.name} in Action`;
                if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
            }
        };

        const openModal = (index) => {
            updateCardView(index, false);
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('image-card-open');
        };

        const closeModal = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('image-card-open');
            setTimeout(() => {
                if (!modal.classList.contains('is-open')) imgEl.src = '';
            }, 300);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCardView(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCardView(currentIndex + 1);
            });
        }

        modal.querySelectorAll('[data-close-card]').forEach(el => el.addEventListener('click', closeModal));

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') updateCardView(currentIndex - 1);
            if (e.key === 'ArrowRight') updateCardView(currentIndex + 1);
        });

        document.querySelectorAll('.bp-gallery-item').forEach((item, idx) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                openModal(idx);
            });
        });
    }

    setupBranchImageModal();

    // --- Scroll Reveal (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.bp-reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bp-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('bp-visible'));
    }
}
