// /js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hamburger menu
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

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        // Apply theme immediately on page load
        document.documentElement.setAttribute('data-theme', initialTheme);
        themeToggle.setAttribute('aria-label', `Toggle ${initialTheme === 'dark' ? 'light' : 'dark'} mode`);
        
        // Handle theme toggle click
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.setAttribute('aria-label', `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if user hasn't explicitly set a theme
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.setAttribute('aria-label', `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
            }
        });
    }
});