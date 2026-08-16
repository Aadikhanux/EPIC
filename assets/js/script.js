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

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuButton.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* ================= 5. CONTACT & REGISTRATION TABS ================= */
    const contactTabBtn = document.getElementById('contactTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const contactForm = document.getElementById('contactForm');
    const registerContainer = document.getElementById('registerContainer');
    const formSuccessMsg = document.getElementById('formSuccessMsg');

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
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const domain = document.getElementById('contactDomain').value;

            if (formSuccessMsg) {
                formSuccessMsg.style.display = 'block';
                formSuccessMsg.innerHTML = `✓ Thank you <strong>${name}</strong>! Your message regarding <em>${domain}</em> has been received. We will get in touch at <em>${email}</em> soon.`;
                contactForm.reset();

                setTimeout(() => {
                    formSuccessMsg.style.display = 'none';
                }, 7000);
            }
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
            response: "Our current year core leadership team includes:<br>• <strong>Mayank Aggarwal</strong> (Final Year • CSE)<br>• <strong>Renu Gehlot</strong> (3rd Year • EEE)<br>• <strong>Niyati Bhandari</strong> (3rd Year • EEE)<br>• <strong>Vinti Jingar</strong> (3rd Year • IT)<br>• <strong>Kritika</strong> (2nd Year • Civil)<br>• <strong>Adil Khan</strong> (2nd Year • CSE)<br>• <strong>Udit Sharma</strong> (2nd Year • IT)<br>• <strong>Vanshika Singh</strong> (2nd Year • IT)<br>• <strong>Ishita</strong> (2nd Year • AIDS)<br>• <strong>Tejasvini Jain</strong> (2nd Year • CSE)"
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
            response: "You can reach us directly at <strong>sparkmbmu@gmail.com</strong> or chat with us on WhatsApp at <strong>+91 78509 40248</strong>."
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
            chatbotWindow.classList.toggle('open');
            if (chatbotWindow.classList.contains('open') && chatbotInput) {
                chatbotInput.focus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
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

        // User Message Wrap
        const userWrap = document.createElement('div');
        userWrap.className = 'chat-msg-wrap user';
        userWrap.innerHTML = `
            <div class="chat-msg user">${userText}</div>
            <span class="chat-timestamp">${getCurrentTimeStr()}</span>
        `;
        chatbotBody.appendChild(userWrap);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Add Typing Indicator
        const typingWrap = document.createElement('div');
        typingWrap.className = 'chat-msg-wrap bot typing-temp';
        typingWrap.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatbotBody.appendChild(typingWrap);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Bot Response Simulation
        setTimeout(() => {
            const temp = chatbotBody.querySelector('.typing-temp');
            if (temp) temp.remove();

            const lower = userText.toLowerCase();
            let botReply = "That's a great question! For detailed assistance, feel free to drop a message in our Contact section or reach us directly at <strong>sparkmbmu@gmail.com</strong>.";

            for (const item of botKnowledge) {
                if (item.keywords.some(k => lower.includes(k))) {
                    botReply = item.response;
                    break;
                }
            }

            const botWrap = document.createElement('div');
            botWrap.className = 'chat-msg-wrap bot';
            botWrap.innerHTML = `
                <div class="chat-msg bot">${botReply}</div>
                <span class="chat-timestamp">${getCurrentTimeStr()}</span>
            `;
            chatbotBody.appendChild(botWrap);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 450);
    }

    /* ================= 7. FAQ ACCORDION ================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
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

    /* ================= 9. CONSOLE BRANDING ================= */
    console.log(
        "%c EPIC | MBM University ",
        "background:#0f172a;color:#10b981;font-size:16px;font-weight:bold;padding:8px 14px;border-radius:6px;"
    );
});