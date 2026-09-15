/* DOMAIN EXPANSION // AI COMMAND CENTER APPLICATION ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== 0. SCI-FI SOUND SYNTHESIZER (WEB AUDIO API) ====================
    const AudioEngine = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },
        playBeep(freq = 800, type = 'sine', duration = 0.08) {
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
            } catch (e) {
                // Ignore audio restriction errors
            }
        },
        playGrantChime() {
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

    // Attach click SFX to interactive elements
    document.querySelectorAll('button, a, input').forEach(el => {
        el.addEventListener('click', () => AudioEngine.playBeep(900, 'sine', 0.05));
    });


    // ==================== 1. CINEMATIC INTRO ENGINE ====================
    const introEl = document.getElementById('cinematic-intro');
    const skipBtn = document.getElementById('skip-intro-btn');
    const stage1 = document.getElementById('intro-stage-1');
    const stage2 = document.getElementById('intro-stage-2');
    const stage3 = document.getElementById('intro-stage-3');
    const stage4 = document.getElementById('intro-stage-4');
    
    let introEnded = false;

    // Intro Particle Canvas
    const introCanvas = document.getElementById('intro-canvas');
    if (introCanvas) {
        const ctx = introCanvas.getContext('2d');
        let width = introCanvas.width = window.innerWidth;
        let height = introCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = introCanvas.width = window.innerWidth;
            height = introCanvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedY: -Math.random() * 1.5 - 0.5,
            alpha: Math.random() * 0.8 + 0.2
        }));

        function drawIntroCanvas() {
            if (introEnded) return;
            ctx.clearRect(0, 0, width, height);

            // Red scanning laser lines
            const scanY = (Date.now() * 0.15) % height;
            ctx.strokeStyle = 'rgba(255, 0, 60, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();

            // Particles
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

    // Timed Intro Sequence (5-7s)
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
        if (!introEnded) {
            endIntro();
        }
    }, 6200);

    if (skipBtn) {
        skipBtn.addEventListener('click', endIntro);
    }


    // ==================== 2. INTERACTIVE 3D THREE.JS AI CORE ====================
    const coreContainer = document.getElementById('ai-core-container');
    let coreMouseX = 0, coreMouseY = 0;

    if (coreContainer && typeof Three !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        coreContainer.appendChild(renderer.domElement);

        // Core Glowing Energy Orb
        const sphereGeo = new THREE.IcosahedronGeometry(1.6, 3);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0xFF003C,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });
        const coreOrb = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(coreOrb);

        // Inner Dense Crimson Core
        const innerGeo = new THREE.SphereGeometry(1.0, 32, 32);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xff1a4f,
            transparent: true,
            opacity: 0.9
        });
        const innerOrb = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerOrb);

        // Holographic Concentric Rings
        function createTechRing(radius, tube, color, opacity) {
            const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: opacity
            });
            return new THREE.Mesh(ringGeo, ringMat);
        }

        const ring1 = createTechRing(2.3, 0.02, 0xFF003C, 0.7);
        const ring2 = createTechRing(2.7, 0.015, 0xE2E8F0, 0.5);
        const ring3 = createTechRing(3.1, 0.02, 0xFF003C, 0.4);

        ring1.rotation.x = Math.PI / 3;
        ring2.rotation.y = Math.PI / 4;
        ring3.rotation.x = -Math.PI / 6;

        scene.add(ring1);
        scene.add(ring2);
        scene.add(ring3);

        // 3D Particle Cloud
        const partGeo = new THREE.BufferGeometry();
        const partCount = 180;
        const posArray = new Float32Array(partCount * 3);

        for (let i = 0; i < partCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }

        partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const partMat = new THREE.PointsMaterial({
            size: 0.03,
            color: 0xFF003C,
            transparent: true,
            opacity: 0.8
        });
        const particles3D = new THREE.Points(partGeo, partMat);
        scene.add(particles3D);

        // Responsive Resizing for Core Canvas
        function resizeCore() {
            const size = Math.min(coreContainer.clientWidth, 450);
            renderer.setSize(size, size);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resizeCore);
        resizeCore();

        // Core Mouse Parallax Track
        document.addEventListener('mousemove', (e) => {
            coreMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
            coreMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
        });

        // Render Loop
        function animateCore() {
            requestAnimationFrame(animateCore);

            const time = Date.now() * 0.001;

            // Orb Pulse & Rotation
            coreOrb.rotation.x += 0.004;
            coreOrb.rotation.y += 0.006;
            
            const scalePulse = 1 + Math.sin(time * 3) * 0.05;
            innerOrb.scale.set(scalePulse, scalePulse, scalePulse);

            // Ring Rotations
            ring1.rotation.z += 0.01;
            ring2.rotation.x += 0.008;
            ring3.rotation.y += 0.012;

            particles3D.rotation.y += 0.002;

            // Parallax Inertia
            scene.rotation.y += (coreMouseX - scene.rotation.y) * 0.05;
            scene.rotation.x += (coreMouseY - scene.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }
        animateCore();
    }


    // ==================== 3. BACKGROUND CANVAS PARTICLES & GRID ====================
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
        });

        const bgParticles = Array.from({ length: 60 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        }));

        function drawBgCanvas() {
            ctx.clearRect(0, 0, width, height);

            bgParticles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.fillStyle = `rgba(255, 0, 60, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(drawBgCanvas);
        }
        drawBgCanvas();
    }


    // ==================== 4. CURSOR RED GLOW TRACKER ====================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(255, 0, 60, 0.12), transparent 80%)`;
        });
    }


    // ==================== 5. 3D CARD PERSPECTIVE TILT EFFECT ====================
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 15;
            const rotateY = (x - centerX) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });


    // ==================== 6. FLOATING HUD NAVBAR & SECTION OBSERVER ====================
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
    }, { threshold: 0.4 });

    sections.forEach(sec => sectionObserver.observe(sec));

    // Navbar Scroll Background Change
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.querySelector('.hud-glass').classList.add('bg-black/90', 'border-crimson/30');
        } else {
            navbar.querySelector('.hud-glass').classList.remove('bg-black/90', 'border-crimson/30');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }


    // ==================== 7. REGISTRATION FORM VALIDATION & MODAL ====================
    const regForm = document.getElementById('registration-form');
    const ieeeYes = document.getElementById('ieee-yes');
    const ieeeNo = document.getElementById('ieee-no');
    const ieeeInterestInput = document.getElementById('ieeeInterest');
    const ieeeError = document.getElementById('ieee-error');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // IEEE Toggle Logic
    if (ieeeYes && ieeeNo && ieeeInterestInput) {
        ieeeYes.addEventListener('click', () => {
            ieeeInterestInput.value = 'YES';
            ieeeYes.classList.add('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeNo.classList.remove('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeError.classList.add('hidden');
        });

        ieeeNo.addEventListener('click', () => {
            ieeeInterestInput.value = 'NO';
            ieeeNo.classList.add('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeYes.classList.remove('bg-crimson', 'text-white', 'border-crimson', 'shadow-[0_0_15px_#FF003C]');
            ieeeError.classList.add('hidden');
        });
    }

    // Live Field Validation
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

    // Form Submission Handler
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let allValid = true;
            document.querySelectorAll('.hud-input').forEach(input => {
                if (!validateField(input)) allValid = false;
            });

            if (!ieeeInterestInput.value) {
                ieeeError.classList.remove('hidden');
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


    // ==================== 8. SCROLL-TRIGGERED WORD REVEAL ====================
    const quoteWords = document.querySelectorAll('.quote-word');
    if (quoteWords.length > 0) {
        window.addEventListener('scroll', () => {
            const triggerBottom = window.innerHeight * 0.85;
            quoteWords.forEach((word, idx) => {
                const wordTop = word.getBoundingClientRect().top;
                if (wordTop < triggerBottom) {
                    setTimeout(() => {
                        word.classList.remove('opacity-30');
                        word.classList.add('opacity-100', 'drop-shadow-[0_0_15px_#FF003C]');
                    }, idx * 300);
                }
            });
        });
    }

});
