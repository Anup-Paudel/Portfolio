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
        const formGroup = inputElement.parentElement;
        formGroup.classList.add('error');
    };

    /**
     * Hides the error message for a specific form field.
     * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The input element to clear.
     */
    const hideError = (inputElement) => {
        const formGroup = inputElement.parentElement;
        formGroup.classList.remove('error');
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
        event.preventDefault(); // Prevent default form submission

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
            // All fields are valid, construct and open mailto link
            const recipientEmail = 'anuppaudel0562@gmail.com';
            const subject = `Message from ${nameInput.value.trim()}`;
            const body = `Name: ${nameInput.value.trim()}\nFrom Email: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;

            // Create the mailto link with encoded components
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            updateStatus('Opening your email client...', 'success');

            // Open the user's default email client
            window.location.href = mailtoLink;

            // Reset form after a short delay to allow the email client to open
            setTimeout(() => {
                contactForm.reset();
                // Manually trigger blur to reset floating labels correctly
                document.activeElement.blur(); 
                updateStatus('', 'info');
            }, 2000);

        } else {
            // Form has errors
            updateStatus('Please correct the errors above.', 'error');
        }
    });

    // --- Real-time Validation Feedback ---
    // Add event listeners to clear errors as the user types
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            // A basic check to hide the error. More specific checks can be added.
            if (input.value.trim()) {
                 hideError(input);
            }
        });
    });
});
