/* ===================================================
   EPIC Technical Club - Main Interactive Script
   Theme Switcher, Minimizable Sidebar, Smart Header,
   AI Doubts Chatbot Engine, Contact & Registration Tabs,
   SPARK Continuous Timeline & FAQ
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. THEME SWITCHER (LIGHT / DARK) ================= */
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('epic_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('epic_theme', theme);

        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fa-solid fa-sun';
                    themeToggleBtn.title = 'Switch to Light Mode';
                } else {
                    icon.className = 'fa-solid fa-moon';
                    themeToggleBtn.title = 'Switch to Dark Mode';
                }
            }
        }
    }

    /* ================= 2. MINIMIZABLE FLOATING SIDEBAR ================= */
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (sidebarToggle && sidebarWrapper) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarWrapper.classList.toggle('minimized');
        });
    }

    /* ================= 3. SMART HEADER (HIDE ON SCROLL DOWN, SHOW ON UP) ================= */
    const navbarContainer = document.getElementById('navbarContainer');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (currentScrollY / docHeight) * 100;

                // Progress Bar
                if (scrollProgress) {
                    scrollProgress.style.width = `${scrollPercent}%`;
                }

                // Smart Header
                if (navbarContainer) {
                    if (currentScrollY > 100) {
                        navbarContainer.classList.add('scrolled');
                        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
                            navbarContainer.classList.add('nav-hidden');
                        } else if (lastScrollY - currentScrollY > 6) {
                            navbarContainer.classList.remove('nav-hidden');
                        }
                    } else {
                        navbarContainer.classList.remove('scrolled');
                        navbarContainer.classList.remove('nav-hidden');
                    }
                }

                // Back to Top Button
                if (backToTopBtn) {
                    if (currentScrollY > 400) {
                        backToTopBtn.classList.add('show');
                    } else {
                        backToTopBtn.classList.remove('show');
                    }
                }

                // SPARK Timeline dynamic fill tracking
                const timelineContainer = document.querySelector('.timeline-container');
                const timelineLineFill = document.getElementById('timelineLineFill');
                const timelineItems = document.querySelectorAll('.timeline-item');

                if (timelineContainer && timelineLineFill) {
                    const rect = timelineContainer.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    if (rect.top < viewportHeight && rect.bottom > 0) {
                        const totalHeight = rect.height;
                        const visiblePassed = Math.max(0, viewportHeight * 0.6 - rect.top);
                        const fillPercent = Math.min(100, Math.max(0, (visiblePassed / totalHeight) * 100));
                        timelineLineFill.style.height = `${fillPercent}%`;

                        timelineItems.forEach(item => {
                            const itemRect = item.getBoundingClientRect();
                            if (itemRect.top < viewportHeight * 0.65) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        });
                    }
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ================= 4. MOBILE MENU ================= */
    const menuButton = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');

    function closeMobileMenu() {
        if (navLinks && menuButton) {
            navLinks.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            const icon = menuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    }

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            const icon = menuButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-xmark', isOpen);
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuButton.contains(e.target)) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 868) {
                closeMobileMenu();
            }
        });
    }

    /* ================= 5. CONTACT & REGISTRATION TABS ================= */
    const contactTabBtn = document.getElementById('contactTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const contactForm = document.getElementById('contactForm');
    const registerContainer = document.getElementById('registerContainer');
    const registerForm = document.getElementById('registerForm');
    const formSuccessMsg = document.getElementById('formSuccessMsg');
    const registerSuccessMsg = document.getElementById('registerSuccessMsg');

    if (contactTabBtn && registerTabBtn && contactForm && registerContainer) {
        contactTabBtn.addEventListener('click', () => {
            contactTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            contactForm.style.display = 'flex';
            registerContainer.classList.remove('active');
        });

        registerTabBtn.addEventListener('click', () => {
            registerTabBtn.classList.add('active');
            contactTabBtn.classList.remove('active');
            contactForm.style.display = 'none';
            registerContainer.classList.add('active');
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) return;

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const domain = document.getElementById('contactDomain').value;

            if (formSuccessMsg) {
                formSuccessMsg.style.display = 'block';
                formSuccessMsg.innerHTML = `Thank you <strong>${name}</strong>! Your message regarding <em>${domain}</em> has been received. We will get in touch at <em>${email}</em> soon.`;
                contactForm.reset();

                setTimeout(() => {
                    formSuccessMsg.style.display = 'none';
                }, 7000);
            }
        });
    }

    /* ================= 5b. REGISTRATION FORM ================= */
    const experienceRadios = document.querySelectorAll('input[name="regExperience"]');
    const experienceDetailGroup = document.getElementById('experienceDetailGroup');

    experienceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Yes' && radio.checked) {
                experienceDetailGroup.style.display = 'block';
            } else if (radio.value === 'No' && radio.checked) {
                experienceDetailGroup.style.display = 'none';
            }
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const hp = document.getElementById('reg-website');
            if (hp && hp.value) return;

            const name = document.getElementById('regName');
            const gender = document.getElementById('regGender');
            const mobile = document.getElementById('regMobile');
            const email = document.getElementById('regEmail');
            const branch = document.getElementById('regBranch');
            let valid = true;

            [name, gender, mobile, email, branch].forEach(f => {
                f.classList.remove('error');
                const err = f.parentElement.querySelector('.form-error-msg');
                if (err) err.classList.remove('visible');
            });

            if (!name.value.trim()) {
                name.classList.add('error');
                valid = false;
            }

            if (!gender.value) {
                gender.classList.add('error');
                valid = false;
            }

            const mobilePattern = /^[0-9]{10}$/;
            if (!mobilePattern.test(mobile.value.trim())) {
                mobile.classList.add('error');
                valid = false;
            }

            if (!email.value.trim() || !email.validity.valid) {
                email.classList.add('error');
                valid = false;
            }

            if (!branch.value) {
                branch.classList.add('error');
                valid = false;
            }

            if (!valid) return;

            const submitBtn = document.getElementById('registerSubmitBtn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Submitting...';
            }

            const experienceRadio = document.querySelector('input[name="regExperience"]:checked');
            const payload = {
                name: name.value.trim(),
                gender: gender.value,
                mobile: mobile.value.trim(),
                email: email.value.trim(),
                branch: branch.value,
                codingExperience: experienceRadio ? experienceRadio.value : 'No',
                experienceDetail: document.getElementById('regExperienceDetail').value.trim(),
                question: document.getElementById('regQuestion').value.trim(),
                timestamp: new Date().toISOString()
            };

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = 'Submit Registration <i class="fa-solid fa-arrow-right"></i>';
                }

                console.log('Registration payload:', payload);

                if (registerSuccessMsg) {
                    registerSuccessMsg.style.display = 'block';
                    registerSuccessMsg.innerHTML = 'Thank you <strong>' + payload.name + '</strong>! Your registration has been submitted. We will contact you at <em>' + payload.email + '</em> soon.';
                }

                registerForm.reset();
                if (experienceDetailGroup) experienceDetailGroup.style.display = 'none';

                setTimeout(() => {
                    if (registerSuccessMsg) registerSuccessMsg.style.display = 'none';
                }, 8000);
            }, 1200);
        });
    }

    /* ================= 6. ENHANCED CHATBOT GENERAL DOUBTS ENGINE ================= */
    const chatbotBubble = document.getElementById('chatbotBubble');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotClear = document.getElementById('chatbotClear');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotBody = document.getElementById('chatbotBody');

    const botKnowledge = [
        {
            keywords: ['join', 'membership', 'register', 'apply', 'enroll', 'form'],
            response: "You can easily join EPIC by heading down to our <strong>Connect & Register</strong> section on this page! You can also join our official WhatsApp group at <a href='https://wa.me/917850940248' target='_blank' style='color:var(--brand-accent);font-weight:600;'>+91 78509 40248</a> for workshop updates."
        },
        {
            keywords: ['wing', 'wings', 'spark', 'kaizen', 'phoenix', 'branch', 'branches', 'ecosystem'],
            response: "EPIC has 3 specialized wings:<br>⚡ <strong>SPARK</strong> — For beginners taking their first steps in programming.<br>🛠️ <strong>KAIZEN</strong> — Continuous learning in Web, Backend, AI/ML & Systems.<br>🔥 <strong>PHOENIX</strong> — High-intensity national hackathons & competitive challenges."
        },
        {
            keywords: ['coding', 'experience', 'beginner', 'fresher', 'prior', 'prerequisite', 'know nothing'],
            response: "No prior experience is needed! <strong>SPARK</strong> is specially structured to guide newcomers with structured workshops, zero-prerequisite bootcamps, and friendly peer mentors."
        },
        {
            keywords: ['team', 'core', 'members', 'leads', 'leadership', 'president'],
            response: "Our current year core leadership team includes:<br>• <strong>Mayank Aggarwal</strong> (Final Year • CSE)<br>• <strong>Vinti Jingar</strong> (3rd Year • IT)<br>• <strong>Niyati Bhandari</strong> (3rd Year • EEE)<br>• <strong>Renu Gehlot</strong> (3rd Year • EEE)<br>• <strong>Kritika</strong> (2nd Year • Civil)<br>• <strong>Samarth Mathur</strong> (3rd Year • AI)<br>• <strong>Adil Khan</strong> (2nd Year • CSE)<br>• <strong>Udit Sharma</strong> (2nd Year • IT)<br>• <strong>Vanshika Singh</strong> (2nd Year • IT)<br>• <strong>Ishika Gupta</strong> (2nd Year • AIDS)<br>• <strong>Tejasvini Jain</strong> (2nd Year • CSE)"
        },
        {
            keywords: ['mentor', 'abhishek', 'gour', 'faculty', 'advisor', 'patron', 'teacher'],
            response: "Our club is mentored by <strong>Dr. Abhishek Gour Sir</strong>, Faculty Advisor at MBM University, who guides student teams in software development and competitive problem-solving."
        },
        {
            keywords: ['studypods', 'studypod', 'cohort', 'project drive'],
            response: "<strong>StudyPods 5.0</strong> was our 4-week intensive project drive where student teams built production web, AI, and systems software and presented working prototypes!"
        },
        {
            keywords: ['hackathon', 'event', 'events', 'converge', 'hack-a-day'],
            response: "We host premier tech events including <strong>Hack-a-Day</strong> (24hr rapid prototyping sprint) and <strong>Converge 2026</strong> (our flagship annual university project expo)."
        },
        {
            keywords: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'number'],
            response: "You can reach us directly at <strong>dsc.clubs@mbm.ac.in</strong> or chat with us on WhatsApp at <strong>+91 78509 40248</strong>."
        },
        {
            keywords: ['hi', 'hello', 'hey', 'greetings', 'help'],
            response: "Hey there! 👋 I'm ready to answer any questions you have about EPIC, our wings (SPARK, KAIZEN, PHOENIX), projects, team, or upcoming events. What's on your mind?"
        }
    ];

    function getCurrentTimeStr() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (chatbotBubble && chatbotWindow && chatbotClose) {
        chatbotBubble.addEventListener('click', () => {
            const isOpen = chatbotWindow.classList.toggle('open');
            chatbotBubble.setAttribute('aria-expanded', String(isOpen));
            chatbotWindow.setAttribute('aria-hidden', String(!isOpen));
            if (isOpen && chatbotInput) {
                chatbotInput.focus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
            chatbotBubble.setAttribute('aria-expanded', 'false');
            chatbotWindow.setAttribute('aria-hidden', 'true');
            chatbotBubble.focus();
        });

        if (chatbotClear) {
            chatbotClear.addEventListener('click', () => {
                if (chatbotBody) {
                    chatbotBody.innerHTML = `
                        <div class="chat-msg-wrap bot">
                            <div class="chat-msg bot">
                                Chat refreshed! How can I help you explore EPIC today?
                            </div>
                            <span class="chat-timestamp">${getCurrentTimeStr()}</span>
                        </div>
                        <div class="chat-chips">
                            <button class="chat-chip-btn" data-query="How do I join EPIC?">How to join?</button>
                            <button class="chat-chip-btn" data-query="What are the 3 wings?">What are the 3 wings?</button>
                            <button class="chat-chip-btn" data-query="Do I need coding experience?">Do I need coding?</button>
                            <button class="chat-chip-btn" data-query="Who is the faculty advisor?">Faculty Advisor?</button>
                            <button class="chat-chip-btn" data-query="Who is in the core team?">Core Team?</button>
                        </div>
                    `;
                    bindChipClicks();
                }
            });
        }

        function bindChipClicks() {
            document.querySelectorAll('.chat-chip-btn').forEach(btn => {
                btn.onclick = () => {
                    const query = btn.getAttribute('data-query');
                    handleUserChat(query);
                };
            });
        }
        bindChipClicks();

        if (chatbotForm && chatbotInput) {
            chatbotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = chatbotInput.value.trim();
                if (query) {
                    handleUserChat(query);
                    chatbotInput.value = '';
                }
            });
        }
    }

    function handleUserChat(userText) {
        if (!chatbotBody) return;

        const userWrap = document.createElement('div');
        userWrap.className = 'chat-msg-wrap user';

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = userText;

        const userTimestamp = document.createElement('span');
        userTimestamp.className = 'chat-timestamp';
        userTimestamp.textContent = getCurrentTimeStr();

        userWrap.appendChild(userMsg);
        userWrap.appendChild(userTimestamp);
        chatbotBody.appendChild(userWrap);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        const typingWrap = document.createElement('div');
        typingWrap.className = 'chat-msg-wrap bot typing-temp';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        typingWrap.appendChild(typingIndicator);
        chatbotBody.appendChild(typingWrap);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        setTimeout(() => {
            const temp = chatbotBody.querySelector('.typing-temp');
            if (temp) temp.remove();

            const lower = userText.toLowerCase();
            let botReply = "That's a great question! For detailed assistance, feel free to drop a message in our Contact section or reach us directly at <strong>dsc.clubs@mbm.ac.in</strong>.";

            for (const item of botKnowledge) {
                if (item.keywords.some(k => lower.includes(k))) {
                    botReply = item.response;
                    break;
                }
            }

            const botWrap = document.createElement('div');
            botWrap.className = 'chat-msg-wrap bot';

            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            botMsg.innerHTML = botReply;

            const botTimestamp = document.createElement('span');
            botTimestamp.className = 'chat-timestamp';
            botTimestamp.textContent = getCurrentTimeStr();

            botWrap.appendChild(botMsg);
            botWrap.appendChild(botTimestamp);
            chatbotBody.appendChild(botWrap);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 450);
    }

    /* ================= 7. FAQ ACCORDION ================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        if (header) {
            header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
            if (content) {
                content.id = `faq-content-${index}`;
                header.setAttribute('aria-controls', `faq-content-${index}`);
            }
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.faq-header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                });
                if (!isActive) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    /* ================= 8. ACTIVE LINK SCROLL SPY ================= */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a:not(.induction-button):not(.join-button)');

    window.addEventListener('scroll', () => {
        let currentId = '';
        const scrollPosition = window.scrollY + 220;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        let targetNavId = currentId;
        if (currentId === 'mentor') targetNavId = 'about';
        if (currentId === 'gallery') targetNavId = 'journey';
        if (currentId === 'faq') targetNavId = 'contact';

        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === `#${targetNavId}`) {
                anchor.classList.add('active');
            }
        });
    });

    /* ================= 9. TEAM GRID — RESPONSIVE 2-ROW LAYOUT ================= */
    function applyTeamGridLayout() {
        const isMobile = window.innerWidth <= 868;

        document.querySelectorAll('.team-grid').forEach(grid => {
            const cards = Array.from(grid.children);

            if (isMobile) {
                grid.style.gridTemplateColumns = '';
                grid.style.justifyContent = '';
                cards.forEach(card => {
                    card.style.gridColumn = '';
                    card.style.gridRow = '';
                });
                return;
            }

            const count = cards.length;
            const firstRowCount = Math.floor(count / 2);
            const gridCols = Math.ceil(count / 2) * 2;

            grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
            grid.style.justifyContent = 'center';

            const row1Span = firstRowCount * 2;
            const row1Offset = Math.floor((gridCols - row1Span) / 2);

            cards.forEach((card, i) => {
                if (i < firstRowCount) {
                    card.style.gridColumn = `${row1Offset + i * 2 + 1} / span 2`;
                    card.style.gridRow = '1';
                } else {
                    card.style.gridColumn = `${(i - firstRowCount) * 2 + 1} / span 2`;
                    card.style.gridRow = '2';
                }
            });
        });
    }

    applyTeamGridLayout();
    let teamGridResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(teamGridResizeTimer);
        teamGridResizeTimer = setTimeout(applyTeamGridLayout, 150);
    });

    /* ================= 10. HERO STAT COUNTER ANIMATION ================= */
    const heroStats = document.querySelectorAll('.hero-stat-item strong');
    if (heroStats.length) {
        const animateCount = (el) => {
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)(\+?)$/);
            if (!match) return;
            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            const duration = 1500;
            const start = performance.now();
            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            el.textContent = '0' + suffix;
            requestAnimationFrame(step);
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        heroStats.forEach((el) => observer.observe(el));
    }

    /* ================= 11. CONSOLE BRANDING ================= */
    console.log(
        "%c EPIC | MBM University ",
        "background:#0f172a;color:#10b981;font-size:16px;font-weight:bold;padding:8px 14px;border-radius:6px;"
    );
});