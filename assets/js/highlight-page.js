const highlightPages = {
    studypods: {
        type: 'Project Expo', title: 'StudyPods 5.0', tagline: 'Learn together. Build together. Ship something real.',
        cover: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_1600/v1/epic_portal/projects/studypods.jpg',
        heading: 'A focused project-building journey',
        description: 'StudyPods 5.0 brought students together in small, domain-focused teams to turn learning into working products. Participants moved from an initial idea through planning, building, review, and a final technical showcase.',
        purpose: 'Give students a structured environment to apply their skills, collaborate across roles, and complete a portfolio-ready project with guidance from EPIC mentors.',
        activities: ['Domain-based team formation', 'Mentor checkpoints and peer reviews', 'Frontend, backend, UI/UX, and AI/ML development', 'Final demos and project evaluation'],
        outcomes: ['Practical product-development experience', 'Stronger teamwork and communication', 'Deployable projects for member portfolios', 'Feedback from experienced builders'],
        winners: [
            { place: 1, team: 'Mind Flayers', project: 'AI/ML Domain' },
            { place: 2, team: 'TechChefs', project: 'Frontend Domain' },
            { place: 3, team: 'NeuronNinjas', project: 'Backend Domain' }
        ],
        images: [
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787158897/sp_01.heic', 'StudyPods participants collaborating'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787158898/sp_03.jpg', 'StudyPods project development session'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787158892/sp_04.jpg', 'StudyPods team presenting its work'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787159004/sp_05.jpg', 'StudyPods event highlight']
        ]
    },
    'hack-a-day': {
        type: '24-Hour Coding Competition', title: 'Hack-a-Day', tagline: 'One day. One challenge. Limitless possibilities.',
        cover: 'https://res.cloudinary.com/sitqyj0b/image/upload/v1787128516/Hack-a-Day.jpg',
        heading: 'Building against the clock',
        description: 'Hack-a-Day is an intensive 24-hour coding competition where participants transform a problem statement into a functional solution. Teams combine technical execution, creativity, and presentation skills under real time constraints.',
        purpose: 'Challenge students to think quickly, divide responsibilities effectively, and deliver a convincing technical prototype within a focused competition environment.',
        activities: ['Problem-statement analysis and ideation', 'Rapid design and development sprints', 'Mentor reviews and debugging checkpoints', 'Final product demonstration and judging'],
        outcomes: ['Faster technical decision-making', 'Experience building under pressure', 'Improved pitching and demonstration skills', 'Stronger multidisciplinary teamwork'],
        winnerGroups: [
            { category: 'Logo Design', winners: [{ place: 1, name: 'Dilkush' }, { place: 2, name: 'Vanshika Singh' }] },
            { category: 'Startup', winners: [{ place: 1, name: 'Nandini Sharma' }, { place: 2, name: 'Adil Khan' }] },
            { category: 'Scramble Code', winners: [{ place: 1, name: 'Aman Kumar Jangid' }] },
            { category: 'Contest — Beginner', winners: [{ place: 1, name: 'Naresh Sirvi' }, { place: 2, name: 'Somesh Khangar' }, { place: 3, name: 'Divyanshu Gaur' }] },
            { category: 'Contest — Intermediate', winners: [{ place: 1, name: 'Rahul Kumar' }, { place: 2, name: 'Bhumika Tayal' }, { place: 3, name: 'Samarth Mathur' }] },
            { category: 'Contest — Advanced', winners: [{ place: 1, name: 'Mohit Pohwani' }] }
        ],
        images: [
            ['https://res.cloudinary.com/sitqyj0b/image/upload/v1787128516/Hack-a-Day.jpg', 'Hack-a-Day coding competition'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160738/hd_01.jpg', 'Hack-a-Day competition moment'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160777/hd_03.jpg', 'Hack-a-Day participants and organizers'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160804/hd_02.jpg', 'Hack-a-Day event highlight']
        ]
    },
    converge: {
        type: 'Problem-Solving Showcase', title: 'Converge', tagline: 'Different disciplines. Shared ideas. One powerful solution.',
        cover: 'https://res.cloudinary.com/sitqyj0b/image/upload/v1787158172/converge.jpg',
        heading: 'Where ideas and disciplines converge',
        description: 'Converge brings students from different technical backgrounds together to examine meaningful problems and develop practical, well-reasoned solutions. The experience emphasizes collaboration, structured thinking, and clear communication.',
        purpose: 'Create a shared platform where diverse skills and perspectives can combine to solve complex problems and produce solutions with genuine technical and social relevance.',
        activities: ['Collaborative problem discovery', 'Research and solution mapping', 'Cross-domain prototype development', 'Technical presentation and feedback'],
        outcomes: ['Structured problem-solving ability', 'Cross-disciplinary collaboration', 'Better research and validation habits', 'Confident technical communication'],
        winners: [
            { place: 1, team: 'Envitro' },
            { place: 2, team: 'Equitech' },
            { place: 3, team: 'PromethyX' }
        ],
        images: [
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160171/cov_02.jpg', 'Converge event moment'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160173/con_04.jpg', 'Converge participants collaborating'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160194/cov_01.jpg', 'Converge team showcase'],
            ['https://res.cloudinary.com/sitqyj0b/image/upload/f_auto,q_auto/v1787160197/con_0.3.jpg', 'Converge presentation highlight']
        ]
    }
};

const highlight = highlightPages[document.body.dataset.highlightPage];
if (highlight) {
    document.body.classList.add(`highlight-page-${document.body.dataset.highlightPage}`);
    const cover = document.getElementById('highlightCover');
    cover.src = highlight.cover;
    cover.alt = highlight.title;
    document.getElementById('highlightType').textContent = highlight.type;
    document.getElementById('highlightTitle').textContent = highlight.title;
    document.getElementById('highlightTagline').textContent = highlight.tagline;
    document.getElementById('highlightHeading').textContent = highlight.heading;
    document.getElementById('highlightDescription').textContent = highlight.description;
    document.getElementById('highlightPurpose').textContent = highlight.purpose;
    document.getElementById('highlightActivities').innerHTML = highlight.activities.map(item => `<li>${item}</li>`).join('');
    document.getElementById('highlightOutcomes').innerHTML = highlight.outcomes.map(item => `<li>${item}</li>`).join('');
    const winnersPanel = document.getElementById('highlightWinners');
    if (highlight.winnerGroups) {
        winnersPanel.classList.add('highlight-winner-groups');
        winnersPanel.innerHTML = highlight.winnerGroups.map(group => `<article class="winner-group-card">
            <div class="winner-group-title"><i class="fa-solid fa-trophy"></i><h3>${group.category}</h3></div>
            <ol>${group.winners.map(winner => `<li class="group-place-${winner.place}"><span>${winner.place}</span><strong>${winner.name}</strong><small>${winner.place === 1 ? 'Winner' : winner.place === 2 ? 'Runner-up' : 'Third Place'}</small></li>`).join('')}</ol>
        </article>`).join('');
    } else {
        winnersPanel.innerHTML = highlight.winners.map(winner => {
            const labels = { 1: 'Winner', 2: 'First Runner-up', 3: 'Second Runner-up' };
            const medals = { 1: 'fa-trophy', 2: 'fa-medal', 3: 'fa-award' };
            return `<article class="highlight-winner-card winner-place-${winner.place}">
                <div class="winner-rank"><i class="fa-solid ${medals[winner.place]}"></i><span>${winner.place}</span></div>
                <small>${labels[winner.place]}</small><h3>${winner.team}</h3>
                ${winner.project ? `<p><span>Project</span><strong>${winner.project}</strong></p>` : ''}
            </article>`;
        }).join('');
    }
    document.getElementById('highlightGallery').innerHTML = highlight.images.map(([src, alt]) =>
        `<figure><img src="${src}" alt="${alt}" loading="lazy"><figcaption style="display:none;">${alt}</figcaption></figure>`
    ).join('');

    // --- Image Card Modal System for Highlights with Left/Right Navigation ---
    function setupHighlightImageModal() {
        const galleryItems = highlight.images.map(([src, alt]) => ({ src, caption: alt }));
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
                            <span class="image-card-tag"><i class="fa-regular fa-image"></i> ${highlight.title} Gallery</span>
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
                    imgEl.alt = item.caption || `${highlight.title} Photo`;
                    capEl.textContent = item.caption || `${highlight.title} Event Moment`;
                    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
                    imgEl.classList.remove('fading');
                }, 150);
            } else {
                imgEl.src = item.src;
                imgEl.alt = item.caption || `${highlight.title} Photo`;
                capEl.textContent = item.caption || `${highlight.title} Event Moment`;
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

        document.querySelectorAll('.highlight-page-gallery figure').forEach((fig, idx) => {
            fig.style.cursor = 'pointer';
            fig.addEventListener('click', () => {
                openModal(idx);
            });
        });

        // Hero cover image click opens modal
        if (cover) {
            cover.style.cursor = 'pointer';
            cover.title = 'Click to view full image card';
            cover.addEventListener('click', () => {
                openModal(0);
            });
        }
    }

    setupHighlightImageModal();
}
