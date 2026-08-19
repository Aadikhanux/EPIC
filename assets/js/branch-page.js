const branchPages = {
    spark: {
        name: 'SPARK', eyebrow: '01 / Foundation Wing', tagline: 'Your Curiosity, Our Spark',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/spark-logo.png',
        description: 'SPARK is where technical curiosity becomes momentum. It gives new builders a welcoming, structured path from first principles to a working prototype—without assuming prior experience.',
        represents: 'The entry gateway to EPIC and its culture of experimentation. SPARK helps members discover what excites them, learn confidently with peers, and develop the habit of turning an idea into something tangible.',
        focus: ['Programming fundamentals', 'HTML & CSS', 'JavaScript', 'Python', 'Git & GitHub', 'UI prototyping', 'Problem solving', 'Idea validation'],
        activities: ['Beginner-friendly coding bootcamps and guided labs', 'Ideation circles and design-thinking sprints', 'Mini-project weeks with mentor checkpoints', 'Git, portfolio, and developer-tool workshops'],
        skills: ['Strong technical foundations', 'Confidence to build independently', 'Team communication and presentation', 'A first project-ready portfolio'],
        images: [
            ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=82', 'Students learning together on laptops'],
            ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=82', 'A beginner web development workspace'],
            ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=82', 'A collaborative student ideation session'],
            ['https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1100&q=82', 'Peers building their first prototype']
        ]
    },
    kaizen: {
        name: 'KAIZEN', eyebrow: '02 / Engineering Wing', tagline: 'Change For The Better',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/kaizen-logo.png',
        description: 'KAIZEN is the continuous-improvement track for members ready to deepen their engineering craft. It connects disciplined learning with real systems, modern tools, and thoughtful technical decisions.',
        represents: "EPIC's commitment to steady, measurable technical growth. KAIZEN turns foundational knowledge into specialized, domain-focused expertise through iteration, code review, system thinking, and production-style collaboration.",
        focus: ['React & modern frontend', 'Node.js & APIs', 'Databases', 'AI & machine learning', 'Cloud computing', 'DevOps', 'System design', 'UI/UX'],
        activities: ['Full-stack and AI/ML learning tracks', 'Architecture discussions and peer code reviews', 'Cloud deployment and DevOps workshops', 'Long-form team projects with technical demos'],
        skills: ['Writing maintainable production code', 'Designing reliable end-to-end systems', 'Debugging and technical decision-making', 'Collaborating with professional workflows'],
        images: [
            ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=82', 'Software engineering code on a workstation'],
            ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=82', 'Modern application development'],
            ['https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1100&q=82', 'Python and machine learning development'],
            ['https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1100&q=82', 'Reviewing and improving a software system']
        ]
    },
    phoenix: {
        name: 'PHOENIX', eyebrow: '03 / Freelancing Wing', tagline: 'Redefining The Horizons',
        logo: 'https://res.cloudinary.com/sjl1rfvu/image/upload/f_auto,q_auto,w_auto/v1/epic_portal/logos/phoenix-logo.png',
        description: 'Freelancing as a career path, hands-on experience, earn while you learn.',
        represents: 'The professional and entrepreneurial wing of EPIC. PHOENIX bridges the gap between learning a skill and earning through it by building confidence, business awareness, client experience, and a strong body of work.',
        focus: ['Freelance platforms', 'Portfolio building', 'Client acquisition', 'Proposal writing', 'Project estimation', 'UI/UX delivery', 'Full-stack projects', 'Personal branding'],
        activities: ['Freelance profile and portfolio review sessions', 'Client communication and proposal-writing workshops', 'Real-world project scoping and delivery simulations', 'Pricing, negotiation, invoicing, and personal-branding sessions'],
        skills: ['Finding and approaching suitable clients', 'Writing clear proposals and project scopes', 'Managing timelines, feedback, and revisions', 'Delivering professional work and building client trust'],
        images: [
            ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=82', 'Freelancers collaborating in a professional workspace'],
            ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=82', 'A team discussing client goals and project scope'],
            ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=82', 'Developers delivering a client project together'],
            ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=82', 'Independent professional software development']
        ]
    }
};

const key = document.body.dataset.branchPage;
const branch = branchPages[key];

if (branch) {
    document.body.classList.add(`branch-page-${key}`);
    document.getElementById('pageLogo').src = branch.logo;
    document.getElementById('pageLogo').alt = `${branch.name} logo`;
    document.getElementById('pageEyebrow').textContent = branch.eyebrow;
    document.getElementById('pageTitle').textContent = branch.name;
    document.getElementById('pageTagline').textContent = `“${branch.tagline}”`;
    document.getElementById('pageDescription').textContent = branch.description;
    document.getElementById('pageRepresents').textContent = branch.represents;
    document.getElementById('pageFocus').innerHTML = branch.focus.map(item => `<span>${item}</span>`).join('');
    document.getElementById('pageActivities').innerHTML = branch.activities.map(item => `<li>${item}</li>`).join('');
    document.getElementById('pageSkills').innerHTML = branch.skills.map(item => `<li>${item}</li>`).join('');
    document.getElementById('pageGallery').innerHTML = branch.images.map(([src, alt]) =>
        `<figure><img src="${src}" alt="${alt}" loading="lazy"></figure>`
    ).join('');
}
