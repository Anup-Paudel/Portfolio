// Portfolio JavaScript - Senior Designer Elevation: Constellation Mesh, HUD Reveal, Gallery Drawer, Calculator, Simulator & AJAX Inbox

// 0. Living Ambient Constellation Mesh Engine
function initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, active: false };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    }, { passive: true });

    // Generate constellation nodes with vibrant designer presence
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 75);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 1.6 + 1.8,
            color: i % 4 === 0 ? '168, 85, 247' : i % 4 === 1 ? '139, 92, 246' : i % 4 === 2 ? '192, 132, 252' : '99, 102, 241',
            baseAlpha: Math.random() * 0.25 + 0.65
        });
    }

    const maxDist = 145;
    const mouseRadius = 170;

    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];

            // Interactive mouse dynamics
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius && dist > 0) {
                    const force = (1 - dist / mouseRadius) * 1.5;
                    p.x += (dx / dist) * force;
                    p.y += (dy / dist) * force;
                }

                // Interactive cursor tether lines (vibrant purple/violet)
                if (dist < 145) {
                    const cursorLineAlpha = (1 - dist / 145) * 0.7;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${cursorLineAlpha})`;
                    ctx.lineWidth = 1.3;
                    ctx.stroke();
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Bounce on boundaries
            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            else if (p.x > width) { p.x = width; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            else if (p.y > height) { p.y = height; p.vy *= -1; }

            // Draw node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.baseAlpha})`;
            ctx.fill();

            // Connect nearby nodes with visible harmonious lines
            for (let j = i + 1; j < nodes.length; j++) {
                const p2 = nodes[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.38;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = i % 2 === 0 ? `rgba(168, 85, 247, ${alpha})` : `rgba(124, 58, 237, ${alpha})`;
                    ctx.lineWidth = 0.95;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(render);
    }

    render();
}

function initPortfolio() {
    initAmbientCanvas();
    const siteHeader = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');
    const mobileNavFullscreen = document.getElementById('mobileNavFullscreen');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const desktopNavLinks = document.querySelectorAll('#navList .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-fullscreen-link');
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

    // Shared Tactile Audio Feedback (Zero external dependencies)
    let sharedAudioCtx = null;
    const playTactileAudio = (freq = 700) => {
        try {
            if (!sharedAudioCtx) {
                sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (sharedAudioCtx.state === 'suspended') {
                sharedAudioCtx.resume();
            }
            const osc = sharedAudioCtx.createOscillator();
            const gain = sharedAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, sharedAudioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, sharedAudioCtx.currentTime + 0.022);
            gain.gain.setValueAtTime(0.04, sharedAudioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, sharedAudioCtx.currentTime + 0.022);
            osc.connect(gain);
            gain.connect(sharedAudioCtx.destination);
            osc.start();
            osc.stop(sharedAudioCtx.currentTime + 0.025);
        } catch (e) {}
    };

    // 0. Dynamic Mouse Ambient Spotlight & Purple Ambient Backdrop Tracking
    const docRoot = document.documentElement;
    const purpleBackdrop = document.getElementById('purpleAmbientBackdrop');
    let mouseTicking = false;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let curX = targetX;
    let curY = targetY;
    let isTrackingMouse = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        isTrackingMouse = true;

        if (!mouseTicking) {
            window.requestAnimationFrame(() => {
                docRoot.style.setProperty('--mouse-x', `${e.clientX}px`);
                docRoot.style.setProperty('--mouse-y', `${e.clientY}px`);
                mouseTicking = false;
            });
            mouseTicking = true;
        }
    }, { passive: true });

    // Smooth lerp physics for the Purple Ambient Backdrop following mouse
    if (purpleBackdrop) {
        function lerpBackdrop() {
            if (isTrackingMouse) {
                curX += (targetX - curX) * 0.075;
                curY += (targetY - curY) * 0.075;
                purpleBackdrop.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
            }
            requestAnimationFrame(lerpBackdrop);
        }
        requestAnimationFrame(lerpBackdrop);
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 1. ScrollSpy Section Tracker
    const updateScrollEffects = (scrollY) => {

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

    };

    // 2. Smooth Directional Scroll Handler (Unified Frosted Header)
    const handleScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (siteHeader) {
            siteHeader.classList.toggle('is-scrolled', currentScrollY > 20);
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

    // 4. Case Study Accordion Toggle (Smooth CSS max-height transition)
    const caseStudyBtns = document.querySelectorAll('.case-study-toggle');
    caseStudyBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const targetId = button.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);

            if (targetPanel) {
                const isOpen = targetPanel.classList.toggle('is-open');
                button.setAttribute('aria-expanded', isOpen);
                targetPanel.setAttribute('aria-hidden', !isOpen);

                if (isOpen) {
                    button.innerHTML = '<span class="case-study-label">Hide Case Study</span> &uarr;';
                } else {
                    button.innerHTML = '<span class="case-study-label">View Case Study</span> &darr;';
                }
            }
        });
    });

    // ==========================================================================
    // 5. Fully Operational Interactive Live Calculator Widget (With Tactile Audio & Physical Keyboard)
    // ==========================================================================
    const calcWidget = document.getElementById('liveCalcWidget');
    if (calcWidget) {
        const calcDisplay = document.getElementById('calcDisplay');
        const calcFormula = document.getElementById('calcFormula');
        let currentInput = '56';
        let previousInput = '';
        let operation = null;
        let resetScreen = true;

        // Subtle zero-dependency Web Audio tactile keyclick
        let audioCtx = null;
        const playTactileClick = (freq = 750) => {
            try {
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.02);
                gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.025);
            } catch (err) {
                // AudioContext not allowed or unsupported
            }
        };

        const updateScreen = () => {
            calcDisplay.textContent = currentInput || '0';
            if (operation && previousInput) {
                const opSymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
                calcFormula.textContent = `${previousInput} ${opSymbol} ${resetScreen ? '' : currentInput}`;
            } else {
                calcFormula.textContent = '';
            }
        };

        const executeAction = (num, op, action) => {
            if (num !== null && num !== undefined) {
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
        };

        calcWidget.addEventListener('click', (e) => {
            const btn = e.target.closest('.calc-btn');
            if (!btn) return;

            playTactileClick();

            const num = btn.getAttribute('data-num');
            const op = btn.getAttribute('data-op');
            const action = btn.getAttribute('data-action');

            executeAction(num, op, action);
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

        // Physical Keyboard Event Listener for Dieter Rams Calculator
        window.addEventListener('keydown', (e) => {
            const active = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (active === 'input' || active === 'textarea') return;

            let targetBtn = null;
            const key = e.key;

            if (key >= '0' && key <= '9') {
                targetBtn = calcWidget.querySelector(`.calc-btn[data-num="${key}"]`);
            } else if (key === '.') {
                targetBtn = calcWidget.querySelector('.calc-btn[data-action="decimal"]');
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                targetBtn = calcWidget.querySelector(`.calc-btn[data-op="${key}"]`);
                e.preventDefault();
            } else if (key === 'Enter' || key === '=') {
                targetBtn = calcWidget.querySelector('.calc-btn[data-action="equals"]');
                e.preventDefault();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                targetBtn = calcWidget.querySelector('.calc-btn[data-action="clear"]');
            } else if (key === '%') {
                targetBtn = calcWidget.querySelector('.calc-btn[data-action="percent"]');
            } else if (key === 'Backspace') {
                if (currentInput.length > 1 && currentInput !== '0') {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateScreen();
                playTactileClick(600);
                return;
            }

            if (targetBtn) {
                targetBtn.classList.add('key-pressed');
                targetBtn.click();
                setTimeout(() => {
                    targetBtn.classList.remove('key-pressed');
                }, 130);
            }
        });
    }

    // ==========================================================================
    // 6. Interactive Fairalyze AI Parity Simulator (With Animated Tweens & Rotary Ticks)
    // ==========================================================================
    const fairnessSlider = document.getElementById('fairnessSlider');
    if (fairnessSlider) {
        const fairnessSliderVal = document.getElementById('fairnessSliderVal');
        const fairnessRatioVal = document.getElementById('fairnessRatioVal');
        const fairnessProgressFill = document.getElementById('fairnessProgressFill');
        const fairnessStatusPill = document.getElementById('fairnessStatusPill');

        let dialAudioCtx = null;
        const playDialTick = (freq = 520) => {
            try {
                if (!dialAudioCtx) {
                    dialAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (dialAudioCtx.state === 'suspended') {
                    dialAudioCtx.resume();
                }
                const osc = dialAudioCtx.createOscillator();
                const gain = dialAudioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, dialAudioCtx.currentTime);
                gain.gain.setValueAtTime(0.025, dialAudioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, dialAudioCtx.currentTime + 0.018);
                osc.connect(gain);
                gain.connect(dialAudioCtx.destination);
                osc.start();
                osc.stop(dialAudioCtx.currentTime + 0.02);
            } catch (e) {}
        };

        let currentRatioNum = 0.84;
        let tweenRaf = null;

        const animateRatioDisplay = (targetVal) => {
            cancelAnimationFrame(tweenRaf);
            const startVal = currentRatioNum;
            const startTime = performance.now();
            const duration = 220;

            const step = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const val = startVal + (targetVal - startVal) * ease;
                currentRatioNum = val;

                fairnessRatioVal.textContent = val.toFixed(2);
                fairnessSliderVal.textContent = val.toFixed(2);

                if (progress < 1) {
                    tweenRaf = requestAnimationFrame(step);
                } else {
                    currentRatioNum = targetVal;
                    fairnessRatioVal.textContent = targetVal.toFixed(2);
                    fairnessSliderVal.textContent = targetVal.toFixed(2);
                }
            };
            tweenRaf = requestAnimationFrame(step);
        };

        const updateFairnessMetrics = (val, isSmooth = false) => {
            const rep = parseInt(val, 10);
            const targetRatio = rep / 100;
            
            fairnessProgressFill.style.width = `${rep}%`;

            if (isSmooth) {
                animateRatioDisplay(targetRatio);
            } else {
                currentRatioNum = targetRatio;
                fairnessSliderVal.textContent = targetRatio.toFixed(2);
                fairnessRatioVal.textContent = targetRatio.toFixed(2);
            }

            if (rep >= 80) {
                fairnessRatioVal.style.color = '#10b981';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #6366f1, #10b981)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-safe';
                fairnessStatusPill.textContent = rep === 100 ? '✦ Optimal Parity' : '✦ SDG 10 Parity';
            } else if (rep >= 55) {
                fairnessRatioVal.style.color = '#f59e0b';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #d97706, #f59e0b)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-warn';
                fairnessStatusPill.textContent = '⚠ Moderate Bias';
            } else {
                fairnessRatioVal.style.color = '#f43f5e';
                fairnessProgressFill.style.background = 'linear-gradient(90deg, #dc2626, #ef4444)';
                fairnessStatusPill.className = 'sim-status-pill sim-status-danger';
                fairnessStatusPill.textContent = '✕ High Bias';
            }
        };

        fairnessSlider.addEventListener('input', (e) => {
            updateFairnessMetrics(e.target.value, false);
            playDialTick(400 + parseInt(e.target.value, 10) * 3);
            // Sync preset active state
            presetBtns.forEach(btn => {
                if (btn.getAttribute('data-val') === e.target.value) {
                    btn.classList.add('is-active');
                } else {
                    btn.classList.remove('is-active');
                }
            });
        });

        // Preset buttons instant audit trigger with smooth tween
        const presetBtns = document.querySelectorAll('.sim-preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-val');
                if (val) {
                    fairnessSlider.value = val;
                    updateFairnessMetrics(val, true);
                    playDialTick(680);
                    presetBtns.forEach(b => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                }
            });
        });
    }

    // ==========================================================================
    // 6.5. Section 02 Capabilities & Systems Interactive Sandboxes
    // ==========================================================================
    // Pillar 1: Visual Systems Interactive Design Token Component Sandbox
    const tokenPreviewComp = document.getElementById('tokenPreviewComponent');
    const tokenCompTag = document.getElementById('tokenCompTag');
    const tokenCompStatus = document.getElementById('tokenCompStatus');
    const tokenCompBtn = document.getElementById('tokenCompBtn');
    const tokenCadenceBtns = document.querySelectorAll('.token-cadence-btn');
    const tokenColorBtns = document.querySelectorAll('.token-color-btn');

    let currentTokenRadius = '8px';
    let currentTokenColor = '#8b5cf6';

    const applyTokens = () => {
        if (tokenPreviewComp) {
            tokenPreviewComp.style.borderRadius = currentTokenRadius;
            tokenPreviewComp.style.borderColor = `${currentTokenColor}44`;
        }
        if (tokenCompTag) {
            tokenCompTag.style.color = currentTokenColor;
        }
        if (tokenCompBtn) {
            tokenCompBtn.style.borderRadius = currentTokenRadius === '18px' ? '9999px' : currentTokenRadius;
            tokenCompBtn.style.backgroundColor = currentTokenColor;
            tokenCompBtn.style.boxShadow = `0 4px 14px ${currentTokenColor}50`;
        }
    };

    tokenCadenceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tokenCadenceBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const rad = btn.getAttribute('data-radius') || '8';
            currentTokenRadius = `${rad}px`;
            if (tokenCompStatus) {
                tokenCompStatus.textContent = btn.getAttribute('data-label') || `Radius: ${rad}px`;
            }
            applyTokens();
            playTactileAudio(640);
        });
    });

    tokenColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tokenColorBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentTokenColor = btn.getAttribute('data-color') || '#8b5cf6';
            applyTokens();
            playTactileAudio(720);
        });
    });

    if (tokenCompBtn) {
        tokenCompBtn.addEventListener('click', () => {
            tokenCompBtn.style.transform = 'scale(0.96)';
            playTactileAudio(820);
            setTimeout(() => {
                tokenCompBtn.style.transform = '';
            }, 120);
            showToast('Design token applied to component');
        });
    }
    applyTokens();

    // Pillar 2: Tactile Micro-Interactions Spring Physics Stage & Waveform Canvas
    const springWaveformCanvas = document.getElementById('springWaveformCanvas');
    const springTriggerBtn = document.getElementById('springTriggerBtn');
    const springDiscCore = document.getElementById('springDiscCore');
    const springProfileBtns = document.querySelectorAll('.spring-profile-btn');

    let springK = 300;   // stiffness
    let springD = 22;    // damping
    let springProfile = 'snappy';
    let springX = 0;
    let springV = 0;
    let springHistory = new Array(50).fill(0);
    let springAnimId = null;

    const renderSpringWaveform = () => {
        if (!springWaveformCanvas) return;
        const ctx = springWaveformCanvas.getContext('2d');
        if (!ctx) return;
        const w = springWaveformCanvas.width;
        const h = springWaveformCanvas.height;
        const midY = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Center equilibrium line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Oscillation wave trace
        ctx.beginPath();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 5;

        for (let i = 0; i < springHistory.length; i++) {
            const px = (i / (springHistory.length - 1)) * w;
            const py = midY - (springHistory[i] * 0.65);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    const runSpringPhysics = () => {
        cancelAnimationFrame(springAnimId);
        let lastTimestamp = performance.now();

        const stepSpring = (now) => {
            const dt = Math.min((now - lastTimestamp) / 1000, 0.032);
            lastTimestamp = now;

            const f = -springK * springX - springD * springV;
            springV += f * dt;
            springX += springV * dt;

            springHistory.shift();
            springHistory.push(springX);
            renderSpringWaveform();

            if (springDiscCore) {
                springDiscCore.style.transform = `translateX(${springX.toFixed(1)}px)`;
            }

            if (Math.abs(springX) > 0.15 || Math.abs(springV) > 0.15) {
                springAnimId = requestAnimationFrame(stepSpring);
            } else {
                springX = 0;
                springV = 0;
                if (springDiscCore) springDiscCore.style.transform = 'translateX(0px)';
                springHistory.shift();
                springHistory.push(0);
                renderSpringWaveform();
            }
        };

        springAnimId = requestAnimationFrame(stepSpring);
    };

    const triggerSpringImpulse = () => {
        springX = 26;
        springV = 0;
        playTactileAudio(springProfile === 'snappy' ? 860 : springProfile === 'bouncy' ? 520 : 380);
        runSpringPhysics();
    };

    springProfileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            springProfileBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            springProfile = btn.getAttribute('data-profile') || 'snappy';
            springK = parseFloat(btn.getAttribute('data-stiff')) || 300;
            springD = parseFloat(btn.getAttribute('data-damp')) || 22;
            triggerSpringImpulse();
        });
    });

    if (springTriggerBtn) {
        springTriggerBtn.addEventListener('click', triggerSpringImpulse);
    }
    renderSpringWaveform();

    // Pillar 3: Zero-Dependency Hardware Performance Oscilloscope
    const perfCanvas = document.getElementById('perfOscilloscopeCanvas');
    const perfFpsVal = document.getElementById('perfFpsVal');
    const perfMsVal = document.getElementById('perfMsVal');
    const perfBenchmarkBtn = document.getElementById('perfBenchmarkBtn');
    const benchmarkStatus = document.getElementById('benchmarkStatus');

    let perfBuffer = new Array(45).fill(16.6);
    let perfLastTime = performance.now();
    let isBenchmarking = false;

    const drawOscilloscope = () => {
        if (!perfCanvas) return;
        const ctx = perfCanvas.getContext('2d');
        if (!ctx) return;
        const w = perfCanvas.width;
        const h = perfCanvas.height;

        ctx.clearRect(0, 0, w, h);

        // Target baseline at 16.6ms (60 FPS)
        const targetY = h * 0.52;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.setLineDash([3, 2]);
        ctx.moveTo(0, targetY);
        ctx.lineTo(w, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Live oscilloscope wave trace
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 4;

        for (let i = 0; i < perfBuffer.length; i++) {
            const x = (i / (perfBuffer.length - 1)) * w;
            const delta = perfBuffer[i];
            const y = targetY - (delta - 16.6) * 2.8;
            const clampedY = Math.max(2, Math.min(h - 2, y));
            if (i === 0) ctx.moveTo(x, clampedY);
            else ctx.lineTo(x, clampedY);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Head sensor point
        const lastX = w - 2;
        const lastY = Math.max(2, Math.min(h - 2, targetY - (perfBuffer[perfBuffer.length - 1] - 16.6) * 2.8));
        ctx.beginPath();
        ctx.arc(lastX, lastY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.fill();
    };

    const updateOscilloscopeLoop = (now) => {
        const delta = now - perfLastTime;
        perfLastTime = now;

        if (delta > 0 && delta < 100) {
            perfBuffer.shift();
            perfBuffer.push(delta);
        }

        drawOscilloscope();
        requestAnimationFrame(updateOscilloscopeLoop);
    };
    requestAnimationFrame(updateOscilloscopeLoop);

    if (perfBenchmarkBtn) {
        perfBenchmarkBtn.addEventListener('click', () => {
            if (isBenchmarking) return;
            isBenchmarking = true;
            if (benchmarkStatus) {
                benchmarkStatus.textContent = 'Measuring...';
                benchmarkStatus.style.color = '#38bdf8';
            }

            let frames = 0;
            const start = performance.now();

            const countFrames = (now) => {
                frames++;
                if (now - start < 700) {
                    requestAnimationFrame(countFrames);
                } else {
                    const elapsed = now - start;
                    const measuredFps = Math.min(60, Math.round((frames / elapsed) * 1000));
                    const avgMs = (elapsed / frames).toFixed(1);
                    if (perfFpsVal) perfFpsVal.textContent = `${measuredFps}.0 FPS`;
                    if (perfMsVal) perfMsVal.textContent = `${avgMs} ms`;
                    if (benchmarkStatus) {
                        benchmarkStatus.textContent = '60 FPS Clean';
                        benchmarkStatus.style.color = '#10b981';
                    }
                    playTactileAudio(960);
                    setTimeout(() => {
                        if (benchmarkStatus) {
                            benchmarkStatus.textContent = 'Live Active';
                            benchmarkStatus.style.color = '';
                        }
                        isBenchmarking = false;
                    }, 2400);
                }
            };
            requestAnimationFrame(countFrames);
        });
    }

    // ==========================================================================
    // 6.8. Magnetic Attraction Physics on Hero & Studio CTAs
    // ==========================================================================
    const magneticElements = document.querySelectorAll('.hero-primary-cta, .hero-resume-cta, .footnote-cv-link, .case-study-toggle-btn');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            elem.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================================================
    // 7. Architectural Photography Gallery Drawer
    // ==========================================================================
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const closeGalleryBtn = document.getElementById('closeGalleryBtn');
    const photoGalleryDrawer = document.getElementById('photoGalleryDrawer');

    if (toggleGalleryBtn && photoGalleryDrawer) {
        toggleGalleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = photoGalleryDrawer.classList.toggle('is-open');
            toggleGalleryBtn.setAttribute('aria-expanded', isOpen);
            photoGalleryDrawer.setAttribute('aria-hidden', !isOpen);
            const chevron = toggleGalleryBtn.querySelector('.gallery-chevron');
            if (chevron) chevron.innerHTML = isOpen ? '&uarr;' : '&darr;';
        });
    }

    if (closeGalleryBtn && photoGalleryDrawer) {
        closeGalleryBtn.addEventListener('click', () => {
            photoGalleryDrawer.classList.remove('is-open');
            if (toggleGalleryBtn) toggleGalleryBtn.setAttribute('aria-expanded', 'false');
            photoGalleryDrawer.setAttribute('aria-hidden', 'true');
            const chevron = toggleGalleryBtn ? toggleGalleryBtn.querySelector('.gallery-chevron') : null;
            if (chevron) chevron.innerHTML = '&darr;';
        });
    }

    // ==========================================================================
    // 7.5. Architectural Photography Lightbox Modal Controller
    // ==========================================================================
    const photoLightboxModal = document.getElementById('photoLightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCamera = document.getElementById('lightboxCamera');
    const lightboxFullLink = document.getElementById('lightboxFullLink');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const photoTriggers = document.querySelectorAll('.photo-lightbox-trigger');

    const openLightbox = (fullUrl, title, camera) => {
        if (!photoLightboxModal || !lightboxImage) return;
        lightboxImage.src = fullUrl;
        lightboxImage.alt = title || 'Visual Capture';
        if (lightboxTitle) lightboxTitle.textContent = title || 'Visual Capture';
        if (lightboxCamera) lightboxCamera.innerHTML = camera || '';
        if (lightboxFullLink) lightboxFullLink.href = fullUrl;
        photoLightboxModal.classList.add('is-open');
        photoLightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!photoLightboxModal) return;
        photoLightboxModal.classList.remove('is-open');
        photoLightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    photoTriggers.forEach(trigger => {
        const handleTrigger = (e) => {
            e.preventDefault();
            const fullUrl = trigger.getAttribute('data-full') || trigger.querySelector('img')?.src;
            const title = trigger.getAttribute('data-title') || 'Visual Capture';
            const camera = trigger.getAttribute('data-camera') || '';
            if (fullUrl) openLightbox(fullUrl, title, camera);
        };

        trigger.addEventListener('click', handleTrigger);
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleTrigger(e);
            }
        });
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoLightboxModal && photoLightboxModal.classList.contains('is-open')) {
            closeLightbox();
        }
    });

    // ==========================================================================
    // 8. 1-Click Copy Email to Clipboard (Clean, No Emojis)
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const labelSpan = copyEmailBtn.querySelector('span');
            navigator.clipboard.writeText('anuppaudel0562@gmail.com').then(() => {
                if (labelSpan) labelSpan.textContent = 'Copied!';
                else copyEmailBtn.textContent = 'Copied!';
                showToast('Email address copied to clipboard');
                setTimeout(() => {
                    if (labelSpan) labelSpan.textContent = 'Copy Email';
                    else copyEmailBtn.textContent = 'Copy Email';
                }, 2000);
            }).catch(() => {
                showToast('Email: anuppaudel0562@gmail.com');
            });
        });
    }

    // ==========================================================================
    // 9. Contact Form Direct Asynchronous Submission (FormSubmit AJAX + Fallback)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitContactBtn') || contactForm.querySelector('button[type="submit"]');
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

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            [nameInput, emailInput, messageInput].forEach(hideError);

            const nameVal = nameInput.value.trim();
            const emailVal = emailInput.value.trim();
            const msgVal = messageInput.value.trim();

            if (!nameVal) {
                showError(nameInput);
                isValid = false;
            }

            if (!emailVal || !isValidEmail(emailVal)) {
                showError(emailInput);
                isValid = false;
            }

            if (!msgVal) {
                showError(messageInput);
                isValid = false;
            }

            if (!isValid) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill out all required fields correctly.';
                    formStatus.className = 'form-status-message error';
                }
                return;
            }

            const origBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message &rarr;';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending Message...';
            }
            if (formStatus) {
                formStatus.textContent = 'Dispatching message directly to inbox...';
                formStatus.className = 'form-status-message';
                formStatus.style.color = '#2563eb';
            }

            try {
                const response = await fetch('https://formsubmit.co/ajax/anuppaudel0562@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameVal,
                        email: emailVal,
                        message: msgVal,
                        _subject: `Portfolio Message from ${nameVal}`
                    })
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = 'Message dispatched directly to inbox! Thank you for reaching out.';
                        formStatus.className = 'form-status-message success';
                        formStatus.style.color = '';
                    }
                    showToast('Message successfully sent to inbox');
                    contactForm.reset();
                } else {
                    throw new Error('Server returned error status');
                }
            } catch (err) {
                // Graceful fallback to mailto
                const subject = `Portfolio Message from ${nameVal}`;
                const body = `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${msgVal}`;
                window.location.href = `mailto:anuppaudel0562@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                if (formStatus) {
                    formStatus.textContent = 'Dispatched via email client fallback. Thank you for reaching out!';
                    formStatus.className = 'form-status-message success';
                    formStatus.style.color = '';
                }
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnText;
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

    // 11. Live Dallas CST Clock Engine
    const dallasTimeSpan = document.getElementById('dallasTime');
    if (dallasTimeSpan) {
        const updateDallasClock = () => {
            try {
                const now = new Date();
                const options = {
                    timeZone: 'America/Chicago',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };
                dallasTimeSpan.textContent = new Intl.DateTimeFormat('en-US', options).format(now) + ' CST';
            } catch (e) {
                const now = new Date();
                dallasTimeSpan.textContent = now.toLocaleTimeString() + ' CST';
            }
        };
        setInterval(updateDallasClock, 1000);
        updateDallasClock();
    }

    // ==========================================================================
    // ==========================================================================
    // 12. Interactive Background Pop-Out Fact Cards (Clean, Stable & Tactile)
    // ==========================================================================
    const portraitCapsule = document.getElementById('designerPortraitCapsule');
    if (portraitCapsule) {
        let popoutTimeout = null;

        const activatePopout = () => {
            const isCurrentlyActive = portraitCapsule.classList.contains('is-active');
            portraitCapsule.classList.toggle('is-active');
            playTactileAudio(isCurrentlyActive ? 420 : 640);
            
            clearTimeout(popoutTimeout);
            if (portraitCapsule.classList.contains('is-active')) {
                popoutTimeout = setTimeout(() => {
                    portraitCapsule.classList.remove('is-active');
                }, 4000);
            }
        };

        portraitCapsule.addEventListener('mouseenter', () => {
            playTactileAudio(560);
        });

        portraitCapsule.addEventListener('mouseleave', () => {
            portraitCapsule.classList.remove('is-active');
            clearTimeout(popoutTimeout);
        });

        portraitCapsule.addEventListener('click', () => {
            activatePopout();
        });

        portraitCapsule.addEventListener('touchstart', () => {
            activatePopout();
        }, { passive: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}