// Portfolio JavaScript - Smooth Directional Scroll, Progress Bar, Interactive Calculator, Bias Simulator & Rail Tracker

function initPortfolio() {
    const siteHeader = document.getElementById('siteHeader');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const navToggle = document.getElementById('navToggle');
    const mobileNavFullscreen = document.getElementById('mobileNavFullscreen');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const desktopNavLinks = document.querySelectorAll('#navList .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-fullscreen-link');
    const railDots = document.querySelectorAll('.rail-dot-btn');
    const sections = document.querySelectorAll('section[id]');
    const toastNotice = document.getElementById('toastNotice');

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    let isTicking = false;

    // Toast Notification Helper (Clean, Professional & No Emojis)
    const showToast = (message) => {
        if (!toastNotice) return;
        toastNotice.textContent = message;
        toastNotice.classList.add('is-visible');
        setTimeout(() => {
            toastNotice.classList.remove('is-visible');
        }, 2500);
    };

    // 1. Scroll Progress Bar, Section Tracker Rail & ScrollSpy
    const updateScrollEffects = (scrollY) => {
        // Update Scroll Progress Bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && scrollProgressBar) {
            const progress = (scrollY / docHeight) * 100;
            scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        // ScrollSpy
        const triggerPoint = scrollY + 200;
        let currentSectionId = 'hero';

        if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 90) {
            currentSectionId = 'contact';
        } else if (scrollY <= 60) {
            currentSectionId = 'hero';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (triggerPoint >= sectionTop && triggerPoint < (sectionTop + sectionHeight)) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        // Update Desktop Navbar
        desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });

        // Update Mobile Full-Screen Menu
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });

        // Update Floating Rail Tracker Dots
        railDots.forEach(dot => {
            const sectionAttr = dot.getAttribute('data-section');
            if (sectionAttr === currentSectionId) {
                dot.classList.add('active-rail');
            } else {
                dot.classList.remove('active-rail');
            }
        });
    };

    // 2. Smooth Directional Scroll Handler
    const handleScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (currentScrollY <= 60) {
            if (siteHeader) {
                siteHeader.classList.add('is-home');
                siteHeader.classList.remove('is-scrolling', 'is-island');
            }
        } else {
            const scrollDiff = currentScrollY - lastScrollY;

            if (scrollDiff > 2) {
                // Scrolling DOWN
                if (siteHeader) {
                    siteHeader.classList.remove('is-home', 'is-island');
                    siteHeader.classList.add('is-scrolling');
                }
            } else if (scrollDiff < -2) {
                // Scrolling UP
                if (siteHeader) {
                    siteHeader.classList.remove('is-home', 'is-scrolling');
                    siteHeader.classList.add('is-island');
                }
            }
        }

        if (mobileNavFullscreen && mobileNavFullscreen.classList.contains('is-open')) {
            mobileNavFullscreen.classList.remove('is-open');
            mobileNavFullscreen.setAttribute('aria-hidden', 'true');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        updateScrollEffects(currentScrollY);
        isTicking = false;
    };

    const requestTick = () => {
        if (!isTicking) {
            window.requestAnimationFrame(handleScroll);
            isTicking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    handleScroll();

    // 3. Full-Screen Mobile Navigation Overlay
    if (navToggle && mobileNavFullscreen) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNavFullscreen.classList.add('is-open');
            mobileNavFullscreen.setAttribute('aria-hidden', 'false');
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', () => {
                mobileNavFullscreen.classList.remove('is-open');
                mobileNavFullscreen.setAttribute('aria-hidden', 'true');
            });
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavFullscreen.classList.remove('is-open');
                mobileNavFullscreen.setAttribute('aria-hidden', 'true');
            });
        });

        document.addEventListener('click', (e) => {
            if (mobileNavFullscreen.classList.contains('is-open') && !mobileNavFullscreen.contains(e.target) && e.target !== navToggle) {
                mobileNavFullscreen.classList.remove('is-open');
                mobileNavFullscreen.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 4. Case Study Accordion Toggle
    const caseStudyBtns = document.querySelectorAll('.case-study-toggle');
    caseStudyBtns.forEach(button => {
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            const targetId = this.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);

            if (targetPanel) {
                const isCurrentlyOpen = targetPanel.classList.contains('is-open') || targetPanel.style.display === 'block';

                if (isCurrentlyOpen) {
                    targetPanel.classList.remove('is-open');
                    targetPanel.style.display = 'none';
                    this.innerHTML = '<span class="case-study-label">View Case Study</span> &darr;';
                } else {
                    targetPanel.classList.add('is-open');
                    targetPanel.style.display = 'block';
                    this.innerHTML = '<span class="case-study-label">Hide Case Study</span> &uarr;';

                    setTimeout(() => {
                        const panelPosition = targetPanel.getBoundingClientRect().top + window.pageYOffset - 100;
                        window.scrollTo({
                            top: panelPosition,
                            behavior: 'smooth'
                        });
                    }, 80);
                }
            }
        };
    });

    // ==========================================================================
    // 5. Fully Operational Interactive Live Calculator Widget
    // ==========================================================================
    const calcWidget = document.getElementById('liveCalcWidget');
    if (calcWidget) {
        const calcDisplay = document.getElementById('calcDisplay');
        const calcFormula = document.getElementById('calcFormula');
        let currentInput = '528';
        let previousInput = '';
        let operation = null;
        let resetScreen = true;

        const updateScreen = () => {
            calcDisplay.textContent = currentInput || '0';
            if (operation && previousInput) {
                const opSymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
                calcFormula.textContent = `${previousInput} ${opSymbol} ${resetScreen ? '' : currentInput}`;
            } else {
                calcFormula.textContent = '';
            }
        };

        calcWidget.addEventListener('click', (e) => {
            const btn = e.target.closest('.calc-btn');
            if (!btn) return;

            const num = btn.getAttribute('data-num');
            const op = btn.getAttribute('data-op');
            const action = btn.getAttribute('data-action');

            if (num !== null) {
                if (currentInput === '0' || resetScreen) {
                    currentInput = num;
                    resetScreen = false;
                } else {
                    if (currentInput.length < 10) currentInput += num;
                }
                updateScreen();
            } else if (op) {
                if (previousInput && !resetScreen) {
                    calculate();
                }
                operation = op;
                previousInput = currentInput;
                resetScreen = true;
                updateScreen();
            } else if (action === 'equals') {
                if (previousInput && operation) {
                    calculate();
                    operation = null;
                    previousInput = '';
                    resetScreen = true;
                }
            } else if (action === 'clear') {
                currentInput = '0';
                previousInput = '';
                operation = null;
                resetScreen = true;
                updateScreen();
            } else if (action === 'decimal') {
                if (resetScreen) {
                    currentInput = '0.';
                    resetScreen = false;
                } else if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                updateScreen();
            } else if (action === 'sign') {
                currentInput = (parseFloat(currentInput) * -1).toString();
                updateScreen();
            } else if (action === 'percent') {
                currentInput = (parseFloat(currentInput) / 100).toString();
                updateScreen();
            }
        });

        const calculate = () => {
            const prev = parseFloat(previousInput);
            const curr = parseFloat(currentInput);
            let result = 0;

            if (isNaN(prev) || isNaN(curr)) return;

            switch (operation) {
                case '+': result = prev + curr; break;
                case '-': result = prev - curr; break;
                case '*': result = prev * curr; break;
                case '/': result = curr === 0 ? 'Error' : prev / curr; break;
                default: return;
            }

            currentInput = typeof result === 'number' ? Math.round(result * 100000) / 100000 : result;
            calcFormula.textContent = `${previousInput} ${operation === '*' ? '×' : operation === '/' ? '÷' : operation} ${curr} =`;
            calcDisplay.textContent = currentInput;
        };
    }

    // ==========================================================================
    // 6. Interactive Fairalyze AI Parity Simulator
    // ==========================================================================
    const fairnessSlider = document.getElementById('fairnessSlider');
    if (fairnessSlider) {
        const fairnessSliderVal = document.getElementById('fairnessSliderVal');
        const fairnessRatioVal = document.getElementById('fairnessRatioVal');
        const fairnessProgressFill = document.getElementById('fairnessProgressFill');
        const fairnessStatusPill = document.getElementById('fairnessStatusPill');

        const updateFairnessMetrics = (val) => {
            const rep = parseInt(val, 10);
            const ratio = (rep / 100).toFixed(2);
            
            fairnessSliderVal.textContent = `${rep}%`;
            fairnessRatioVal.textContent = ratio;
            fairnessProgressFill.style.width = `${rep}%`;

            if (rep >= 80) {
                fairnessRatioVal.style.color = '#38bdf8';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #38bdf8, #22c55e)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-safe';
                fairnessStatusPill.textContent = 'SDG 10 Compliant';
            } else if (rep >= 55) {
                fairnessRatioVal.style.color = '#fbbf24';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-warn';
                fairnessStatusPill.textContent = 'Moderate Disparity';
            } else {
                fairnessRatioVal.style.color = '#f87171';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-danger';
                fairnessStatusPill.textContent = 'High Bias Risk';
            }
        };

        fairnessSlider.addEventListener('input', (e) => {
            updateFairnessMetrics(e.target.value);
        });
    }

    // ==========================================================================
    // 7. Interactive Chess Tactical Puzzle (Clean, No Emojis)
    // ==========================================================================
    const chessPuzzleBtn = document.getElementById('chessPuzzleBtn');
    if (chessPuzzleBtn) {
        let isSolved = false;
        chessPuzzleBtn.addEventListener('click', () => {
            if (!isSolved) {
                chessPuzzleBtn.innerHTML = '<span>Checkmate: Qxf7# Solved</span>';
                chessPuzzleBtn.style.background = '#10b981';
                chessPuzzleBtn.style.borderColor = '#10b981';
                chessPuzzleBtn.style.color = '#ffffff';
                showToast('Checkmate: Qxf7# delivers checkmate.');
                isSolved = true;
            } else {
                chessPuzzleBtn.innerHTML = '<span>Solve Tactic: Qxf7#</span>';
                chessPuzzleBtn.style.background = 'rgba(245, 158, 11, 0.12)';
                chessPuzzleBtn.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                chessPuzzleBtn.style.color = '#d97706';
                isSolved = false;
            }
        });
    }

    // ==========================================================================
    // 8. 1-Click Copy Email to Clipboard (Clean, No Emojis)
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText('anuppaudel0562@gmail.com').then(() => {
                copyEmailBtn.textContent = 'Copied';
                showToast('Email address copied to clipboard');
                setTimeout(() => {
                    copyEmailBtn.textContent = 'Copy';
                }, 2000);
            }).catch(() => {
                showToast('Email: anuppaudel0562@gmail.com');
            });
        });
    }

    // 9. Contact Form Direct Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formStatus = document.getElementById('formStatus');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const showError = (input) => {
            const group = input.closest('.form-field-group');
            if (group) group.classList.add('has-error');
        };

        const hideError = (input) => {
            const group = input.closest('.form-field-group');
            if (group) group.classList.remove('has-error');
        };

        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            [nameInput, emailInput, messageInput].forEach(hideError);

            if (!nameInput.value.trim()) {
                showError(nameInput);
                isValid = false;
            }

            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                showError(emailInput);
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                showError(messageInput);
                isValid = false;
            }

            if (isValid) {
                const recipientEmail = 'anuppaudel0562@gmail.com';
                const subject = `Portfolio Message from ${nameInput.value.trim()}`;
                const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;

                const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                window.location.href = mailtoLink;

                if (formStatus) {
                    formStatus.textContent = 'Your message has been sent. Thank you for reaching out.';
                    formStatus.className = 'form-status-message success';
                }

                setTimeout(() => {
                    contactForm.reset();
                }, 1000);
            } else {
                if (formStatus) {
                    formStatus.textContent = 'Please fill out all required fields.';
                    formStatus.className = 'form-status-message error';
                }
            }
        });

        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) hideError(input);
            });
        });
    }

    // 10. Dynamic Year in Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}