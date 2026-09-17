// Preloader
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 1200);
});

// Particles
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 10 + 8) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
        particlesContainer.appendChild(p);
    }
}

// Navbar scroll
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Highlight active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// Counter animation
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            let count = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) { entry.target.textContent = target + '+'; clearInterval(timer); }
                else { entry.target.textContent = Math.floor(count); }
            }, 30);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.service-card, .gallery-item, .about-grid, .contact-grid, .player-container, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s ease';
    revealObserver.observe(el);
});

// Music player
const tracks = document.querySelectorAll('.player-track');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressFill = document.getElementById('progressFill');
let isPlaying = false;

if (tracks.length) {
    tracks.forEach(track => {
        track.addEventListener('click', () => {
            tracks.forEach(t => t.classList.remove('active'));
            track.classList.add('active');
        });
    });
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        if (isPlaying) animateProgress();
    });
}

function animateProgress() {
    if (!isPlaying || !progressFill) return;
    let width = parseFloat(progressFill.style.width) || 35;
    width += 0.1;
    if (width >= 100) width = 0;
    progressFill.style.width = width + '%';
    requestAnimationFrame(animateProgress);
}

// Testimonial slider
const testimonials = document.querySelectorAll('.testimonial-item');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    if (!testimonials.length) return;
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

if (dots.length) {
    dots.forEach(dot => {
        dot.addEventListener('click', () => showSlide(+dot.getAttribute('data-index')));
    });
    setInterval(() => {
        showSlide((currentSlide + 1) % testimonials.length);
    }, 5000);
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-primary span');
        btn.textContent = 'Message Sent!';
        setTimeout(() => { btn.textContent = 'Send Message'; e.target.reset(); }, 3000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
