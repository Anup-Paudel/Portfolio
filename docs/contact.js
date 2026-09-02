document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const contactForm = document.getElementById('contactForm');
    
    // Check if the form exists on the page before proceeding
    if (!contactForm) {
        return;
    }

    const formStatus = document.getElementById('formStatus');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // --- Utility Functions ---
    /**
     * Shows an error message for a specific form field.
     * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The input element with an error.
     */
    const showError = (inputElement) => {
        const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
        if (formGroup) {
            formGroup.classList.add('error');
        }
    };

    /**
     * Hides the error message for a specific form field.
     * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The input element to clear.
     */
    const hideError = (inputElement) => {
        const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    };

    /**
     * Validates an email address using a simple regex.
     * @param {string} email - The email string to validate.
     * @returns {boolean} - True if the email is valid, false otherwise.
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Updates the form status message.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'info'} type - The type of message.
     */
    const updateStatus = (message, type) => {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
        }
    };

    // --- Event Listener for Form Submission ---
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Reset previous states
        let isFormValid = true;
        updateStatus('', 'info');
        [nameInput, emailInput, messageInput].forEach(hideError);

        // --- Form Validation ---
        if (!nameInput.value.trim()) {
            showError(nameInput);
            isFormValid = false;
        }

        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            showError(emailInput);
            isFormValid = false;
        }

        if (!messageInput.value.trim()) {
            showError(messageInput);
            isFormValid = false;
        }

        // --- Handle Submission ---
        if (isFormValid) {
            const recipientEmail = 'anuppaudel0562@gmail.com';
            const subject = `Message from ${nameInput.value.trim()}`;
            const body = `Name: ${nameInput.value.trim()}\nFrom Email: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;

            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            updateStatus('Opening your email client...', 'success');

            window.location.href = mailtoLink;

            setTimeout(() => {
                contactForm.reset();
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                updateStatus('Message generated! Thank you for reaching out.', 'success');
            }, 1500);

        } else {
            updateStatus('Please correct the highlighted fields.', 'error');
        }
    });

    // --- Real-time Validation Feedback ---
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                hideError(input);
            }
        });
    });
});
