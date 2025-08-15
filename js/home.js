// /js/home.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded for home.js animations.");
        return;
    }

    // --- GSAP Hero Title - Letter by Letter "Wow" Reveal ---
    const heroTitle = document.querySelector('.hero-section .hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.innerHTML = ''; // Clear original text to rebuild with spans
        originalText.split('').forEach(char => {
            const span = document.createElement('span');
            // Preserve space characters, otherwise they collapse
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.style.display = 'inline-block'; // Essential for individual transforms
            heroTitle.appendChild(span);
        });

        // Animate each letter
        gsap.set(heroTitle.children, { // Target the new spans
            opacity: 0,
            y: 60, // Start further down
            scale: 0.7,
            rotationX: -90, // Flip in from top
            transformOrigin: "center bottom"
        });
        gsap.to(heroTitle.children, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.8, // Duration for each letter's animation
            ease: "back.out(1.4)", // Expressive ease
            stagger: 0.04, // Delay between each letter
            delay: 0.2 // Initial delay before title animation starts
        });
    }

    // --- GSAP Tagline - Dynamic Reveal (from previous step) ---
    const taglinePhrases = document.querySelectorAll(".hero-tagline.animated-tagline > span");
    if (taglinePhrases.length > 0) {
        taglinePhrases.forEach((phrase, index) => {
            gsap.set(phrase, {
                opacity: 0,
                y: 30,
                x: (index % 2 === 0) ? -25 : 25, // Slightly wider start
                filter: 'blur(2px)',
                scale: 0.9
            });
        });
        gsap.to(taglinePhrases, {
            duration: 1,
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            ease: "elastic.out(1, 0.65)",
            stagger: 0.2,
            delay: 1.2 // Delayed to start after title animation is underway
        });
    }

    // --- GSAP CTA Button - Enhanced "Pop" Reveal ---
    const heroCtaButton = document.querySelector('.hero-content .cta-button');
    if (heroCtaButton) {
        gsap.set(heroCtaButton, {
            opacity: 0,
            y: 50,          // Start further down
            scale: 0.5,       // Start smaller
            rotationZ: -15    // Slight initial rotation
        });
        gsap.to(heroCtaButton, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationZ: 0,
            duration: 1, // Slightly longer for more impact
            ease: "elastic.out(1, 0.70)", // Adjusted elasticity
            delay: 2.0 // Delayed to start after taglines are underway
        });
    }
});