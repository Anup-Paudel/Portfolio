// /js/interactions.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animations (Global) ---
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

    // --- Project Card Hover Interaction (Global for .project-preview-card) ---
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
                        ease: "elastic.out(1, 0.75)" 
                    });
                });
            }
        });
    }

    // --- Desktop Navigation Active State Logic (Global for Desktop Nav) ---
    // This ensures the .active-link class is correctly set via JS if not hardcoded properly,
    // and can also be a base for more complex JS-driven nav interactions if you revisit the crown idea.
    if (window.innerWidth >= 769) { // Only run on desktop
        const mainNavList = document.getElementById('navList');
        if (mainNavList) {
            const navLinks = mainNavList.querySelectorAll('a.nav-link');
            let currentPath = window.location.pathname.split('/').pop();
            if (currentPath === '') currentPath = 'index.html'; // Normalize for root
            
            // Construct full path for comparison if your hrefs are relative from root
            const basePath = window.location.origin; // Or your site's base URL if deployed in a subfolder

            navLinks.forEach(link => {
                const linkHref = new URL(link.href, basePath).pathname.split('/').pop();
                link.classList.remove('active-link'); // Clear existing
                if (linkHref === currentPath) {
                    link.classList.add('active-link');
                }
            });
        }
    }
});