document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initCursorTrail();
    initGalleryAnimation();
    initGalleryHover();
    initSectionNavigation();
});

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    container.innerHTML = '';
    const particleCount = 30;

    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

function initCursorTrail() {
    const existingTrail = document.querySelector('.cursor-trail-container');
    if (existingTrail) existingTrail.remove();

    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    document.body.appendChild(trailContainer);

    const particles = [];
    const particleCount = 20;
    const colors = ['#C41E3A', '#8B0000', '#DC143C', '#D4AF37', '#FFD700'];

    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail-particle';
        particle.style.opacity = '0';
        trailContainer.appendChild(particle);

        particles.push({
            element: particle,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 0,
            maxLife: 30 + Math.random() * 20,
            size: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let particleIndex = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const speed = Math.sqrt((dx * dx) + (dy * dy));

        if (speed > 3) {
            const particlesToSpawn = Math.min(Math.floor(speed / 5), 3);

            for (let i = 0; i < particlesToSpawn; i += 1) {
                const particle = particles[particleIndex];
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;

                particle.x = mouseX + offsetX;
                particle.y = mouseY + offsetY;
                particle.vx = (dx * 0.1) + ((Math.random() - 0.5) * 2);
                particle.vy = (dy * 0.1) + ((Math.random() - 0.5) * 2);
                particle.life = particle.maxLife;
                particle.size = 4 + Math.random() * 6;
                particle.color = colors[Math.floor(Math.random() * colors.length)];

                particle.element.style.width = `${particle.size}px`;
                particle.element.style.height = `${particle.size}px`;
                particle.element.style.background = particle.color;
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = '1';
                particle.element.style.boxShadow = `0 0 ${particle.size * 2}px ${particle.color}`;

                particleIndex = (particleIndex + 1) % particleCount;
            }
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    });

    function animateParticles() {
        particles.forEach((particle) => {
            if (particle.life > 0) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.life -= 1;

                const opacity = particle.life / particle.maxLife;
                const scale = 0.5 + (opacity * 0.5);

                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = opacity;
                particle.element.style.transform = `scale(${scale})`;
            } else {
                particle.element.style.opacity = '0';
            }
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

function initGalleryAnimation() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 200 + (index * 200));
    });
}

function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            galleryItems.forEach((otherItem, otherIndex) => {
                if (otherIndex === index) return;

                const distance = otherIndex - index;
                if (distance < 0) {
                    otherItem.classList.add('rotate-right');
                } else if (distance > 0) {
                    otherItem.classList.add('rotate-left');
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            galleryItems.forEach((otherItem) => {
                otherItem.classList.remove('rotate-left', 'rotate-right');
            });
        });
    });
}

function initSectionNavigation() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const setActiveById = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
        });
    };

    const updateActiveLink = () => {
        const triggerPoint = window.scrollY + 120;
        let currentId = sections[0].id;

        sections.forEach((section) => {
            if (triggerPoint >= section.offsetTop) {
                currentId = section.id;
            }
        });

        setActiveById(currentId);
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetSelector = link.getAttribute('href');
            const target = document.querySelector(targetSelector);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', targetSelector);
            setActiveById(target.id);
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;

        window.requestAnimationFrame(() => {
            updateActiveLink();
            ticking = false;
        });

        ticking = true;
    });

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveById(target.id);
            }, 100);
            return;
        }
    }

    updateActiveLink();
}

function goHome() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#home');
}
