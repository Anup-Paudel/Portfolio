// Projects Page Accordion Script
document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.querySelector('.site-header');
    const caseStudyToggles = document.querySelectorAll('.case-study-toggle');

    caseStudyToggles.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.dataset.target;
            const targetDetails = document.getElementById(targetId);

            if (targetDetails) {
                const isCurrentlyActive = targetDetails.classList.contains('active');

                if (isCurrentlyActive) {
                    // Collapse
                    targetDetails.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    button.innerHTML = '<span class="btn-toggle-text">View Case Study</span> <span class="arrow-icon">&darr;</span>';
                } else {
                    // Expand
                    targetDetails.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                    button.innerHTML = '<span class="btn-toggle-text">Hide Case Study</span> <span class="arrow-icon">&uarr;</span>';

                    // Smooth scroll to the top of the case study
                    const headerHeight = mainHeader ? mainHeader.offsetHeight : 70;
                    const elementTop = targetDetails.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementTop - headerHeight - 20;

                    setTimeout(() => {
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 50);
                }
            }
        });
    });

    // Check if URL has hash (e.g. #project1 or #case-study-1-details)
    if (window.location.hash) {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
            const toggleBtn = hashTarget.querySelector('.case-study-toggle') || 
                              document.querySelector(`[data-target="${window.location.hash.substring(1)}"]`);
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
    }
});
