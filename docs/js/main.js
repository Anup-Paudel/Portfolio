// /js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize hamburger menu ---
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (navToggle && navOverlay) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', (!isExpanded).toString());
            body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking on overlay or menu items
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay || e.target.closest('.nav-link')) {
                navToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
                navToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    if (scrollRevealElements.length > 0 && typeof IntersectionObserver === 'function') {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });
        scrollRevealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --- Project Card Hover Interaction ---
    const interactiveProjectCards = document.querySelectorAll('.project-preview-card');
    if (interactiveProjectCards.length > 0 && typeof gsap !== 'undefined') {
        interactiveProjectCards.forEach(card => {
            const cardImageContainer = card.querySelector('.card-image-container');
            if (cardImageContainer) {
                gsap.set(card, { perspective: 800 });
                gsap.set(cardImageContainer, { transformStyle: "preserve-3d" });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    const maxRotate = 4;
                    const rotateX = (y / rect.height) * -maxRotate * 1.5;
                    const rotateY = (x / rect.width) * maxRotate * 1.5;
                    
                    gsap.to(cardImageContainer, {
                        rotationX: rotateX,
                        rotationY: rotateY,
                        z: 5,
                        duration: 0.4,
                        ease: "power1.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(cardImageContainer, {
                        rotationX: 0,
                        rotationY: 0,
                        z: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});