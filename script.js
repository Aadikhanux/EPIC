/* =========================================
   EPIC WEBSITE JAVASCRIPT
========================================= */


/* ================= MOBILE MENU ================= */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon = menuButton.querySelector("i");

    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* Close mobile menu after clicking link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuButton.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= BRANCH SWITCHER ================= */

const branchButtons = document.querySelectorAll(".branch-btn");

const branchContent = document.querySelector(".branch-content");

const branchData = {

    spark: {

        number: "01",

        label: "EPIC / SPARK",

        title: "Ideas that ignite.",

        description:
            "A space for curiosity, experimentation and turning raw ideas into real-world prototypes.",

        tags: [
            "Innovation",
            "Ideation",
            "Prototyping"
        ]

    },

    kaizen: {

        number: "02",

        label: "EPIC / KAIZEN",

        title: "Improve. Every day.",

        description:
            "A growth-driven branch focused on learning, collaboration, technical skills and continuous improvement.",

        tags: [
            "Learning",
            "Development",
            "Growth"
        ]

    },

    phoenix: {

        number: "03",

        label: "EPIC / PHOENIX",

        title: "Rise. Build. Compete.",

        description:
            "A competitive engineering wing built around advanced projects, hackathons and ambitious challenges.",

        tags: [
            "Hackathons",
            "Projects",
            "Competitions"
        ]

    }

};


branchButtons.forEach(button => {

    button.addEventListener("click", () => {

        /* Remove active class */

        branchButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        /* Get branch */

        const branch = button.dataset.branch;

        const data = branchData[branch];


        /* Animate old content */

        branchContent.style.opacity = "0";
        branchContent.style.transform = "translateY(10px)";


        setTimeout(() => {

            branchContent.innerHTML = `

                <span class="branch-number">
                    ${data.number}
                </span>

                <div class="branch-info">

                    <small>
                        ${data.label}
                    </small>

                    <h3>
                        ${data.title}
                    </h3>

                    <p>
                        ${data.description}
                    </p>

                    <div class="tags">

                        ${data.tags.map(tag => `
                            <span>${tag}</span>
                        `).join("")}

                    </div>

                </div>

            `;

            branchContent.style.opacity = "1";
            branchContent.style.transform = "translateY(0)";

        }, 180);

    });

});


/* ================= SCROLL EFFECT ================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background = "rgba(8,9,11,0.92)";

    } else {

        navbar.style.background = "rgba(8,9,11,0.78)";

    }

});


/* ================= REVEAL ANIMATION ================= */

const revealElements = document.querySelectorAll(
    ".section, .stats, .timeline-item, .gallery-card, .resource"
);

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


/* ================= MOUSE GLOW ================= */

const glow = document.createElement("div");

glow.style.position = "fixed";
glow.style.width = "280px";
glow.style.height = "280px";
glow.style.borderRadius = "50%";
glow.style.background = "rgba(200,255,47,0.035)";
glow.style.filter = "blur(70px)";
glow.style.pointerEvents = "none";
glow.style.zIndex = "0";
glow.style.transform = "translate(-50%, -50%)";

document.body.appendChild(glow);


document.addEventListener("mousemove", event => {

    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;

});


/* ================= ACTIVE NAV LINK ================= */

const sections = document.querySelectorAll("section[id]");

const navigationLinks = document.querySelectorAll(
    ".nav-links a:not(.join-button)"
);


window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });


    navigationLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* ================= IMAGE ERROR HANDLER ================= */

document.querySelectorAll(".gallery-card img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.display = "none";

        image.parentElement.style.background =
            "radial-gradient(circle at center, rgba(200,255,47,0.08), #111318 55%)";

    });

});


/* ================= CONSOLE ================= */

console.log(
    "%c EPIC WEBSITE ",
    "background:#c8ff2f;color:#08090b;font-size:20px;font-weight:bold;padding:10px;"
);

console.log(
    "Engineering • Projects • Innovation • Competitions"
);