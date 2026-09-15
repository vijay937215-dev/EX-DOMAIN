/* DOMAIN EXPANSION // QUANTUM AI COMMAND CENTER APPLICATION ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== 0. AUDIO SYNTHESIZER ENGINE ====================
    const AudioEngine = {
        ctx: null,
        muted: false,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },
        playBeep(freq = 800, type = 'sine', duration = 0.08) {
            if (this.muted) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {}
        },
        playGrantChime() {
            if (this.muted) return;
            try {
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.08, now + idx * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + idx * 0.1);
                    osc.stop(now + idx * 0.1 + 0.4);
                });
            } catch (e) {}
        }
    };

    // Audio Toggle Button
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    if (audioBtn && audioIcon) {
        audioBtn.addEventListener('click', () => {
            AudioEngine.muted = !AudioEngine.muted;
            if (AudioEngine.muted) {
                audioIcon.setAttribute('data-lucide', 'volume-x');
                audioBtn.classList.add('text-slate-500');
            } else {
                audioIcon.setAttribute('data-lucide', 'volume-2');
                audioBtn.classList.remove('text-slate-500');
                AudioEngine.playBeep(1000, 'sine', 0.1);
            }
            lucide.createIcons();
        });
    }

    // Attach click SFX to buttons & links
    document.querySelectorAll('button, a, input, select').forEach(el => {
        el.addEventListener('click', () => AudioEngine.playBeep(900, 'sine', 0.05));
    });


    // ==================== 1. TELEMETRY PING SIMULATOR ====================
    const pingEl = document.getElementById('telemetry-ping');
    if (pingEl) {
        setInterval(() => {
            const p = Math.floor(Math.random() * 8) + 8;
            pingEl.textContent = `${p}ms`;
        }, 3000);
    }


    // ==================== 2. CINEMATIC INTRO ENGINE ====================
    const introEl = document.getElementById('cinematic-intro');
    const skipBtn = document.getElementById('skip-intro-btn');
    const stage1 = document.getElementById('intro-stage-1');
    const stage2 = document.getElementById('intro-stage-2');
    const stage3 = document.getElementById('intro-stage-3');
    const stage4 = document.getElementById('intro-stage-4');
    
    let introEnded = false;

    // Intro Canvas Animation
    const introCanvas = document.getElementById('intro-canvas');
    if (introCanvas) {
        const ctx = introCanvas.getContext('2d');
        let width = introCanvas.width = window.innerWidth;
        let height = introCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = introCanvas.width = window.innerWidth;
            height = introCanvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 90 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedY: -Math.random() * 1.8 - 0.5,
            alpha: Math.random() * 0.8 + 0.2
        }));

        function drawIntroCanvas() {
            if (introEnded) return;
            ctx.clearRect(0, 0, width, height);

            const scanY = (Date.now() * 0.2) % height;
            ctx.strokeStyle = 'rgba(255, 0, 60, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();

            particles.forEach(p => {
                p.y += p.speedY;
                if (p.y < 0) p.y = height;
                ctx.fillStyle = `rgba(255, 0, 60, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(drawIntroCanvas);
        }
        drawIntroCanvas();
    }

    function endIntro() {
        if (introEnded) return;
        introEnded = true;
        introEl.style.opacity = '0';
        introEl.style.pointerEvents = 'none';
        setTimeout(() => {
            introEl.style.display = 'none';
        }, 1000);
        AudioEngine.playBeep(1200, 'triangle', 0.2);
    }

    setTimeout(() => {
        if (!introEnded) {
            stage1.style.opacity = '1';
            stage1.style.transform = 'translateY(0)';
            AudioEngine.playBeep(600, 'sine', 0.08);
        }
    }, 400);

    setTimeout(() => {
        if (!introEnded) {
            stage2.style.opacity = '1';
            stage2.style.transform = 'translateY(0)';
            AudioEngine.playBeep(750, 'sine', 0.08);
        }
    }, 1800);

    setTimeout(() => {
        if (!introEnded) {
            stage3.style.opacity = '1';
            stage3.style.transform = 'scale(1)';
            AudioEngine.playBeep(950, 'square', 0.12);
        }
    }, 3200);

    setTimeout(() => {
        if (!introEnded) {
            stage4.style.opacity = '1';
            stage4.style.transform = 'translateY(0)';
            AudioEngine.playBeep(1100, 'sine', 0.1);
        }
    }, 4600);

    setTimeout(() => {
        if (!introEnded) endIntro();
    }, 6200);

    if (skipBtn) skipBtn.addEventListener('click', endIntro);


    // ==================== 3. INTERACTIVE 3D THREE.JS QUANTUM CORE ====================
    const coreContainer = document.getElementById('ai-core-container');
    let coreMouseX = 0, coreMouseY = 0;

    if (coreContainer && typeof Three !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 7.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(420, 420);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        coreContainer.appendChild(renderer.domElement);

        // Core Energy Orb
        const sphereGeo = new THREE.IcosahedronGeometry(1.6, 3);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0xFF003C,
            wireframe: true,
            transparent: true,
            opacity: 0.9
        });
        const coreOrb = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(coreOrb);

        // Inner Core
        const innerGeo = new THREE.SphereGeometry(1.1, 32, 32);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xff1a4f,
            transparent: true,
            opacity: 0.95
        });
        const innerOrb = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerOrb);

        // Concentric Rings
        function createRing(radius, tube, color, opacity) {
            const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: opacity
            });
            return new THREE.Mesh(ringGeo, ringMat);
        }

        const ring1 = createRing(2.3, 0.02, 0xFF003C, 0.8);
        const ring2 = createRing(2.8, 0.015, 0xE2E8F0, 0.6);
        const ring3 = createRing(3.3, 0.02, 0xFF003C, 0.4);

        ring1.rotation.x = Math.PI / 3;
        ring2.rotation.y = Math.PI / 4;
        ring3.rotation.x = -Math.PI / 6;

        scene.add(ring1);
        scene.add(ring2);
        scene.add(ring3);

        // Particle System
        const partGeo = new THREE.BufferGeometry();
        const partCount = 220;
        const posArray = new Float32Array(partCount * 3);

        for (let i = 0; i < partCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 9;
        }

        partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const partMat = new THREE.PointsMaterial({
            size: 0.035,
            color: 0xFF003C,
            transparent: true,
            opacity: 0.85
        });
        const particles3D = new THREE.Points(partGeo, partMat);
        scene.add(particles3D);

        function resizeCore() {
            const size = Math.min(coreContainer.clientWidth, 460);
            renderer.setSize(size, size);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resizeCore);
        resizeCore();

        document.addEventListener('mousemove', (e) => {
            coreMouseX = (e.clientX / window.innerWidth - 0.5) * 0.9;
            coreMouseY = (e.clientY / window.innerHeight - 0.5) * 0.9;
        });

        function animateCore() {
            requestAnimationFrame(animateCore);
            const time = Date.now() * 0.001;

            coreOrb.rotation.x += 0.005;
            coreOrb.rotation.y += 0.007;

            const scalePulse = 1 + Math.sin(time * 3.5) * 0.06;
            innerOrb.scale.set(scalePulse, scalePulse, scalePulse);

            ring1.rotation.z += 0.012;
            ring2.rotation.x += 0.009;
            ring3.rotation.y += 0.014;

            particles3D.rotation.y += 0.0025;

            scene.rotation.y += (coreMouseX - scene.rotation.y) * 0.05;
            scene.rotation.x += (coreMouseY - scene.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }
        animateCore();
    }


    // ==================== 4. NEURAL CONSTELLATION CANVAS ====================
    const neuralCanvas = document.getElementById('neural-canvas');
    if (neuralCanvas) {
        const ctx = neuralCanvas.getContext('2d');
        let width = neuralCanvas.width = window.innerWidth;
        let height = neuralCanvas.height = window.innerHeight;
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('resize', () => {
            width = neuralCanvas.width = window.innerWidth;
            height = neuralCanvas.height = window.innerHeight;
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const nodes = Array.from({ length: 70 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1
        }));

        function drawNeural() {
            ctx.clearRect(0, 0, width, height);

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.fillStyle = 'rgba(255, 0, 60, 0.6)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                // Mouse interaction connection
                const dxMouse = mouseX - node.x;
                const dyMouse = mouseY - node.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 140) {
                    ctx.strokeStyle = `rgba(255, 0, 60, ${1 - distMouse / 140})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }

                // Node-to-node connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 100) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(drawNeural);
        }
        drawNeural();
    }


    // ==================== 5. CURSOR GLOW TRACKER ====================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(255, 0, 60, 0.14), transparent 80%)`;
        });
    }


    // ==================== 6. 3D CARD TILT EFFECT ====================
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 14;
            const rotateY = (x - centerX) / 14;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });


    // ==================== 7. INTERACTIVE AI PROMPT SYNTHESIZER LAB ====================
    const synthDomain = document.getElementById('synth-domain');
    const synthKeywords = document.getElementById('synth-keywords');
    const synthStyleBtns = document.querySelectorAll('.synth-style-btn');
    const synthOutputText = document.getElementById('synth-output-text');
    const synthGenerateBtn = document.getElementById('synth-generate-btn');
    const synthStatus = document.getElementById('synth-status');
    const synthPosterPreview = document.getElementById('synth-poster-preview');

    let activeStyle = 'Holographic Cyberpunk HUD';

    synthStyleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            synthStyleBtns.forEach(b => b.classList.remove('border-crimson', 'bg-crimson/20', 'text-white'));
            btn.classList.add('border-crimson', 'bg-crimson/20', 'text-white');
            activeStyle = btn.getAttribute('data-style');
            updateSynthPreview();
        });
    });

    function updateSynthPreview() {
        if (!synthOutputText || !synthDomain || !synthKeywords) return;
        const dom = synthDomain.value.split(':')[1] || synthDomain.value;
        const kw = synthKeywords.value || 'AI Prompt Synthesis';
        synthOutputText.textContent = `GENERATE_POSTER(domain="${dom.trim()}", style="${activeStyle}", keywords="${kw.trim()}", resolution="8K");`;
    }

    if (synthDomain) synthDomain.addEventListener('change', updateSynthPreview);
    if (synthKeywords) synthKeywords.addEventListener('input', updateSynthPreview);

    if (synthGenerateBtn) {
        synthGenerateBtn.addEventListener('click', () => {
            AudioEngine.playGrantChime();
            if (synthStatus) synthStatus.textContent = 'SYNTHESIZING...';
            if (synthPosterPreview) {
                synthPosterPreview.innerHTML = `
                    <div class="w-10 h-10 border-2 border-crimson border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div class="font-orbitron font-bold text-xs text-crimson-glow">GENERATING HOLOGRAPHIC POSTER...</div>
                `;
            }

            setTimeout(() => {
                if (synthStatus) synthStatus.textContent = 'READY';
                if (synthPosterPreview) {
                    synthPosterPreview.innerHTML = `
                        <i data-lucide="sparkles" class="w-10 h-10 text-crimson mx-auto animate-bounce"></i>
                        <div class="font-orbitron font-bold text-sm text-white tracking-widest">PROMPT SYNTHESIZED SUCCESSFULLY</div>
                        <span class="px-3 py-1 rounded-full bg-crimson/30 text-crimson-glow font-mono text-[10px] border border-crimson/50 font-bold">MATCH ACCURACY: 99.8%</span>
                    `;
                    lucide.createIcons();
                }
            }, 1200);
        });
    }


    // ==================== 8. STOPWATCH & RAISE HAND SIMULATOR ====================
    const timerDisplay = document.getElementById('round1-timer-display');
    const timerToggleBtn = document.getElementById('timer-toggle-btn');
    const raiseHandBtn = document.getElementById('raise-hand-demo-btn');

    let timerInterval = null;
    let timerSeconds = 300;
    let timerRunning = false;

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    if (timerToggleBtn && timerDisplay) {
        timerToggleBtn.addEventListener('click', () => {
            if (timerRunning) {
                clearInterval(timerInterval);
                timerRunning = false;
                timerToggleBtn.textContent = 'START DEMO';
            } else {
                timerRunning = true;
                timerToggleBtn.textContent = 'PAUSE DEMO';
                timerInterval = setInterval(() => {
                    if (timerSeconds > 0) {
                        timerSeconds--;
                        timerDisplay.textContent = formatTime(timerSeconds);
                    } else {
                        clearInterval(timerInterval);
                        timerRunning = false;
                        timerToggleBtn.textContent = 'RESET DEMO';
                    }
                }, 1000);
            }
        });
    }

    if (raiseHandBtn) {
        raiseHandBtn.addEventListener('click', () => {
            AudioEngine.playGrantChime();
            alert('🖐️ GOOGLE MEET RAISE HAND SIMULATION:\n\nHand Raised Successfully!\nSpeed Point Claimed (1 Point Awarded).\nHost notified for Google Meet screen presentation.');
        });
    }


    // ==================== 9. FLOATING HUD NAVBAR & OBSERVER ====================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.getElementById('nav-indicator');
    const sections = document.querySelectorAll('section');

    function updateNavIndicator(activeLink) {
        if (!activeLink || !indicator) return;
        const rect = activeLink.getBoundingClientRect();
        const parentRect = activeLink.parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - parentRect.left}px`;
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('text-white');
                        link.classList.remove('text-slate-300');
                        updateNavIndicator(link);
                    } else {
                        link.classList.remove('text-white');
                        link.classList.add('text-slate-300');
                    }
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(sec => sectionObserver.observe(sec));

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.querySelector('.hud-glass').classList.add('bg-black/95', 'border-crimson/40');
        } else {
            navbar.querySelector('.hud-glass').classList.remove('bg-black/95', 'border-crimson/40');
        }
    });

    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }


    // ==================== 10. REGISTRATION FORM VALIDATION ====================
    const regForm = document.getElementById('registration-form');
    const ieeeYes = document.getElementById('ieee-yes');
    const ieeeNo = document.getElementById('ieee-no');
    const ieeeInterestInput = document.getElementById('ieeeInterest');
    const ieeeError = document.getElementById('ieee-error');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (ieeeYes && ieeeNo && ieeeInterestInput) {
        ieeeYes.addEventListener('click', () => {
            ieeeInterestInput.value = 'YES';
            ieeeYes.classList.add('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeNo.classList.remove('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            if (ieeeError) ieeeError.classList.add('hidden');
        });

        ieeeNo.addEventListener('click', () => {
            ieeeInterestInput.value = 'NO';
            ieeeNo.classList.add('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeYes.classList.remove('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            if (ieeeError) ieeeError.classList.add('hidden');
        });
    }

    function validateField(input) {
        const parent = input.closest('.space-y-2');
        if (!parent) return true;
        const errorMsg = parent.querySelector('.error-msg');
        const validIcon = parent.querySelector('.valid-icon');
        let isValid = true;

        if (input.id === 'whatsapp') {
            const phoneRegex = /^[0-9]{10}$/;
            isValid = phoneRegex.test(input.value.trim());
        } else {
            isValid = input.value.trim().length > 1;
        }

        if (isValid) {
            input.classList.remove('border-crimson');
            input.classList.add('border-emerald-500/50');
            if (errorMsg) errorMsg.classList.add('hidden');
            if (validIcon) validIcon.classList.remove('hidden');
        } else {
            input.classList.remove('border-emerald-500/50');
            input.classList.add('border-crimson');
            if (errorMsg) errorMsg.classList.remove('hidden');
            if (validIcon) validIcon.classList.add('hidden');
        }
        return isValid;
    }

    document.querySelectorAll('.hud-input').forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let allValid = true;
            document.querySelectorAll('.hud-input').forEach(input => {
                if (!validateField(input)) allValid = false;
            });

            if (!ieeeInterestInput.value) {
                if (ieeeError) ieeeError.classList.remove('hidden');
                allValid = false;
            }

            if (allValid) {
                AudioEngine.playGrantChime();
                if (successModal) {
                    successModal.classList.remove('hidden');
                    successModal.classList.add('flex');
                }
            } else {
                AudioEngine.playBeep(400, 'sawtooth', 0.2);
            }
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
            successModal.classList.remove('flex');
        });
    }


    // ==================== 11. SCROLL-TRIGGERED QUOTE ====================
    const quoteWords = document.querySelectorAll('.quote-word');
    if (quoteWords.length > 0) {
        window.addEventListener('scroll', () => {
            const triggerBottom = window.innerHeight * 0.85;
            quoteWords.forEach((word, idx) => {
                const wordTop = word.getBoundingClientRect().top;
                if (wordTop < triggerBottom) {
                    setTimeout(() => {
                        word.classList.remove('opacity-30');
                        word.classList.add('opacity-100', 'drop-shadow-[0_0_20px_#FF003C]');
                    }, idx * 300);
                }
            });
        });
    }

});
