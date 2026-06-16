/**
 * Gowdul Aalam M — Portfolio Interactions
 * Particle canvas, typewriter effect, scroll animations, 
 * counter animations, cursor glow, preloader, and more
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticleCanvas();
    initCursorGlow();
    initNavigation();
    initSmoothScroll();
    initActiveNavHighlight();
    initTypewriter();
    initScrollReveal();
    initCounterAnimation();
    initSkillRings();
    initImpactBars();
    initContactForm();
    initCardGlowTracking();
    initTerminalGlow();
    initDeepDiveToggle();
});

/* ============================================
   PRELOADER
   ============================================ */

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });

    // Fallback: hide after 3s no matter what
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);
}

/* ============================================
   PARTICLE CANVAS BACKGROUND
   ============================================ */

function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getColor();
        }

        getColor() {
            const colors = [
                '124, 58, 237',   // violet
                '168, 85, 247',   // purple
                '6, 182, 212',    // cyan
                '59, 130, 246',   // blue
                '16, 185, 129',   // emerald
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x -= (dx / distance) * force * 0.8;
                    this.y -= (dy / distance) * force * 0.8;
                }
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Subtle opacity pulsing
            this.opacity += (Math.random() - 0.5) * 0.01;
            this.opacity = Math.max(0.05, Math.min(0.5, this.opacity));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 140) {
                    const opacity = (1 - distance / 140) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   CURSOR GLOW FOLLOWER
   ============================================ */

function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateGlow() {
        // Smooth interpolation
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';

        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');

    // Scroll behavior — add/remove scrolled class
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.pageYOffset > 60) {
                    nav.classList.add('nav--scrolled');
                } else {
                    nav.classList.remove('nav--scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile toggle
    if (toggle && mobile) {
        toggle.addEventListener('click', () => {
            mobile.classList.toggle('nav__mobile--open');

            const spans = toggle.querySelectorAll('span');
            if (mobile.classList.contains('nav__mobile--open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close mobile menu on link click
        mobile.querySelectorAll('.nav__mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobile.classList.remove('nav__mobile--open');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   ACTIVE NAV HIGHLIGHTING
   ============================================ */

function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[data-section]');

    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        'Scalable Backend Infrastructure',
        'Java & Spring Boot Microservices',
        'Cloud-Native Solutions on GCP',
        'Enterprise B2B Applications',
        'High-Performance RESTful APIs',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    // Start after a brief delay
    setTimeout(type, 1500);
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */

function initScrollReveal() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.impact__number, .stat-card__number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   SKILL RINGS ANIMATION
   ============================================ */

function initSkillRings() {
    const rings = document.querySelectorAll('.skill-ring');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillCircle = entry.target.querySelector('.skill-ring__fill');
                if (fillCircle) {
                    // The CSS handles the animation via --percentage custom property
                    entry.target.classList.add('animated');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    rings.forEach(ring => observer.observe(ring));
}

/* ============================================
   IMPACT BARS
   ============================================ */

function initImpactBars() {
    const bars = document.querySelectorAll('.impact__bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = `${width}%`;
                }, 400);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

/* ============================================
   CONTACT FORM
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        // Simulate submission
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        button.style.opacity = '0.7';

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            button.style.background = 'linear-gradient(135deg, #10b981, #22c55e)';
            button.style.opacity = '1';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
                form.reset();
            }, 2500);
        }, 1500);
    });
}

/* ============================================
   CARD GLOW TRACKING (Mouse follow)
   ============================================ */

function initCardGlowTracking() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.expertise__card, .project__card, .impact__card, .stat-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glow = card.querySelector('.card-glow, .project__card-shine');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 58, 237, 0.08) 0%, transparent 50%)`;
            }
        });
    });
}

/* ============================================
   TERMINAL GLOW
   ============================================ */

function initTerminalGlow() {
    const cursors = document.querySelectorAll('.terminal__cursor');
    cursors.forEach(cursor => {
        cursor.style.textShadow = '0 0 10px rgba(124, 58, 237, 0.7)';
    });
}

/* ============================================
   DEEP DIVE TOGGLE
   ============================================ */

function initDeepDiveToggle() {
    const toggle = document.getElementById('deepdiveToggle');
    const panel = document.getElementById('deepdivePanel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card tilt from triggering
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Collapse
            toggle.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
        } else {
            // Expand
            toggle.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');

            // Smooth scroll the panel into view after a short delay for the animation
            setTimeout(() => {
                const panelRect = panel.getBoundingClientRect();
                const navHeight = document.getElementById('nav')?.offsetHeight || 80;

                // Only scroll if the panel bottom is below the viewport
                if (panelRect.bottom > window.innerHeight) {
                    const scrollTarget = window.pageYOffset + panelRect.top - navHeight - 40;
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    });

    // Prevent card tilt/shine effects on deep dive content clicks
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/* ============================================
   PARALLAX ON HERO (subtle)
   ============================================ */

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const terminal = hero.querySelector('.hero__terminal');
        const badges = hero.querySelectorAll('.floating-badge');

        if (terminal) {
            terminal.style.transform = `translateY(${scrolled * 0.08}px)`;
        }

        badges.forEach((badge, i) => {
            const speed = 0.03 + (i * 0.015);
            badge.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}, { passive: true });

/* ============================================
   TILT EFFECT ON PROJECT CARDS
   ============================================ */

document.querySelectorAll('.project__card, .expertise__card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
