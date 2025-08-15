// /js/projects.js
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Projects page scripts loaded.");

    const mainHeader = document.querySelector('.site-header');

    const caseStudyToggles = document.querySelectorAll('.case-study-toggle');
    caseStudyToggles.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.dataset.target;
            const targetDetails = document.getElementById(targetId);
            if (targetDetails) {
                const isActive = targetDetails.classList.toggle('active');
                
                if(isActive) {
                    button.innerHTML = 'Hide Details <span class="arrow">&uarr;</span>';
                } else {
                    button.innerHTML = 'View Details <span class="arrow">&rarr;</span>';
                }
                button.setAttribute('aria-expanded', isActive.toString());

                if (isActive) {
                    const headerOffset = mainHeader ? mainHeader.offsetHeight : 70; 
                    const elementPosition = targetDetails.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20; 

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});