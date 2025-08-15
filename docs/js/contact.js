// /js/contact.js
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Contact page scripts loaded.");

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.className = 'form-status-message error visible';
                return;
            }
            if (!isValidEmail(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'form-status-message error visible';
                return;
            }

            formMessage.textContent = 'Sending your message...';
            formMessage.className = 'form-status-message visible';
            
            setTimeout(() => {
                formMessage.textContent = 'Thank you! Your message has been sent.';
                formMessage.className = 'form-status-message success visible';
                contactForm.reset(); 
                setTimeout(() => {
                    formMessage.classList.remove('visible');
                    formMessage.className = 'form-status-message'; 
                }, 4000);
            }, 1500);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});