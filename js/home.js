// /js/home.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded for home.js animations.");
        return;
    }

    // --- GSAP Hero Title Reveal ---
    const heroTitle = document.querySelector('.hero-section .hero-title');
    if (heroTitle) {
        gsap.set(heroTitle, { opacity: 0, y: 30, scale: 0.95 });
        gsap.to(heroTitle, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0, 
            ease: "power3.out", 
            delay: 0.2
        });
    }

    // --- GSAP Tagline - Simple Staggered Phrase Reveal ---
    const taglinePhrases = document.querySelectorAll(".hero-tagline.animated-tagline > span");
    if (taglinePhrases.length > 0) {
        gsap.set(taglinePhrases, { opacity: 0, y: 20, filter: 'blur(1px)' });
        gsap.to(taglinePhrases, {
            duration: 0.9,
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: "power2.out",
            stagger: 0.25, 
            delay: 0.5 
        });
    }
    
    // --- GSAP CTA Button Reveal ---
    const heroCtaButton = document.querySelector('.hero-content .cta-button');
    if (heroCtaButton) {
        gsap.set(heroCtaButton, { opacity: 0, y: 20, scale: 0.85 });
        gsap.to(heroCtaButton, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9, // Slightly faster
            ease: "elastic.out(1, 0.65)", // Slightly less bouncy
            delay: 1.0 
        });
    }
});