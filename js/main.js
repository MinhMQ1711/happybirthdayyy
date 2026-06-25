/* ============================================
   MAIN.JS - Application Controller
   Quản lý toàn bộ flow của ứng dụng
   ============================================ */

class BirthdayApp {
    constructor() {
        // Core systems
        this.particles = null;
        this.confetti = null;
        this.music = null;
        this.cake = null;
        this.scrollLetter = null;

        // State
        this.isMusicPlaying = false;
        this.theme = 'dark';
        this.isMainAppShown = false;

        console.log('%c🎂 BirthdayApp constructor initialized', 'color: #ff6b9d; font-size: 14px;');
    }

    /* ==========================================
       BOOTSTRAP
       ========================================== */

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('%c🚀 App starting...', 'color: #48dbfb; font-size: 14px;');

        try {
            // 1. Init background systems (chạy ngay để đẹp)
            this.initBackgroundSystems();

            // 2. Init scroll letter (intro)
            this.initScrollLetter();

            // 3. Listen for scroll close event
            window.addEventListener('scrollLetterClosed', () => {
                console.log('%c📬 Received scrollLetterClosed event', 'color: #feca57;');
                this.showMainApp();
            });

            console.log('%c✅ App initialized successfully', 'color: #00f5ff; font-size: 14px;');
        } catch (error) {
            console.error('❌ Error during app initialization:', error);
        }
    }

    initBackgroundSystems() {
        // Particles
        try {
            this.particles = new ParticleSystem('particles-canvas');
            this.particles.init();
            console.log('✨ Particles system initialized');
        } catch (e) {
            console.warn('️ Particles failed:', e);
        }

        // Confetti
        try {
            this.confetti = new ConfettiSystem('confetti-layer');
            window.confettiSystem = this.confetti; // expose global
            console.log(' Confetti system initialized');
        } catch (e) {
            console.warn('⚠️ Confetti failed:', e);
        }

        // Music
        try {
            this.music = new BirthdayMusic();
            console.log('🎵 Music system initialized');
        } catch (e) {
            console.warn('⚠️ Music failed:', e);
        }
    }

    /* ==========================================
       SCROLL LETTER (INTRO)
       ========================================== */

    initScrollLetter() {
        try {
            this.scrollLetter = new ScrollLetter();
            this.scrollLetter.init();

            // Callback khi mở thư xong → phát nhạc
            this.scrollLetter.onOpened = () => {
                console.log('%c💌 Scroll opened! Starting music...', 'color: #ff6b9d; font-size: 14px;');
                this.startMusic();
            };

            // Expose global để debug
            window.scrollLetter = this.scrollLetter;

            console.log('📜 Scroll letter initialized');
        } catch (e) {
            console.error('❌ Scroll letter failed:', e);
        }
    }

    /* ==========================================
       MUSIC CONTROL
       ========================================== */

    startMusic() {
        if (!this.music) {
            console.warn('⚠️ Music system not available');
            return;
        }

        try {
            this.music.play();
            this.isMusicPlaying = true;
            this.updateMusicButton();
            console.log('🎵 Music started (looping)');
        } catch (e) {
            console.error(' Music start failed:', e);
        }
    }

    toggleMusic() {
        if (!this.music) return;

        if (this.isMusicPlaying) {
            this.music.pause();
            this.isMusicPlaying = false;
        } else {
            this.music.resume();
            this.isMusicPlaying = true;
        }

        this.updateMusicButton();
        console.log(`🎵 Music ${this.isMusicPlaying ? 'resumed' : 'paused'}`);
    }

    updateMusicButton() {
        const btn = document.getElementById('toggle-music-btn');
        if (!btn) return;

        const icon = btn.querySelector('.btn-icon');
        const text = btn.querySelector('.btn-text');

        if (icon) icon.textContent = this.isMusicPlaying ? '🔊' : '🔇';
        if (text) text.textContent = this.isMusicPlaying ? 'Tắt Nhạc' : 'Bật Nhạc';
    }

    /* ==========================================
       MAIN APP DISPLAY
       ========================================== */

    showMainApp() {
        if (this.isMainAppShown) return;
        this.isMainAppShown = true;

        console.log('%c🎂 Showing main app...', 'color: #feca57; font-size: 14px;');

        const app = document.getElementById('app');
        if (!app) {
            console.error('❌ #app not found');
            return;
        }

        // Remove hidden class
        app.classList.remove('hidden');

        // Init cake 3D
        try {
            this.cake = new Cake3D('cake');
            this.cake.init();
            console.log('🎂 Cake 3D initialized');
        } catch (e) {
            console.warn('⚠️ Cake 3D failed:', e);
        }

        // Init typewriters
        if (typeof initTypewriters === 'function') {
            initTypewriters();
            console.log('✍️ Typewriters initialized');
        }

        // Welcome confetti
        setTimeout(() => {
            if (this.confetti) {
                this.confetti.celebrate();
            }
        }, 500);

        // Bind all main events
        this.bindMainEvents();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('%c✅ Main app fully loaded!', 'color: #00f5ff; font-size: 14px;');
    }

    /* ==========================================
       EVENT BINDING
       ========================================== */

    bindMainEvents() {
        // 1. Music toggle button
        const musicBtn = document.getElementById('toggle-music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMusic();
            });
        }

        // 2. Surprise button
        const surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.surprise();
            });
        }

        // 3. Fireworks FAB
        const fireworksBtn = document.getElementById('fireworks-btn');
        if (fireworksBtn) {
            fireworksBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.fireworks();
            });
        }

        // 4. Theme toggle FAB
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTheme();
                themeBtn.textContent = this.theme === 'dark' ? '' : '☀️';
            });
        }

        // 5. Global click → sparkle effect
        document.addEventListener('click', (e) => {
            this.createSparkle(e.clientX, e.clientY);
        });

        // 6. Cake interaction
        const cake = document.getElementById('cake');
        if (cake) {
            cake.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCakeClick();
            });
        }

        // 7. Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        console.log('🎯 All events bound');
    }

    /* ==========================================
       INTERACTIONS
       ========================================== */

    handleCakeClick() {
        if (!this.cake) return;

        console.log('🎂 Cake clicked!');
        this.cake.blowCandles();

        if (this.confetti) {
            this.confetti.celebrate();
        }

        // Relight after 4 seconds
        setTimeout(() => {
            this.cake.relightCandles();
        }, 4000);
    }

    surprise() {
        console.log(' Surprise triggered!');

        // Big confetti burst
        if (this.confetti) {
            this.confetti.burst(200);
        }

        // Fireworks
        this.fireworks();

        // Pulse animation on special message
        const message = document.querySelector('.special-message');
        if (message) {
            message.style.animation = 'none';
            // Force reflow
            void message.offsetWidth;
            message.style.animation = 'pulse 0.6s ease';
        }

        // Show modal
        this.showModal();
    }

    fireworks() {
        const count = 5;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.6;
                this.createFirework(x, y);
            }, i * 300);
        }
    }

    createFirework(x, y) {
        const colors = ['#ff6b9d', '#feca57', '#48dbfb', '#bc13fe', '#ff006e'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particleCount = 30;
        const container = document.getElementById('confetti-layer');

        if (!container) return;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 100 + Math.random() * 80;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

            container.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            animation: sparkle 0.8s ease-out forwards;
        `;
        sparkle.innerHTML = '✨';
        document.body.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 800);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.style.transition = 'background 1s ease';

        if (this.theme === 'light') {
            document.body.style.background =
                'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)';
        } else {
            document.body.style.background = '';
        }

        console.log(`🌗 Theme changed to: ${this.theme}`);
    }

    handleKeyboard(e) {
        // Ignore if user is typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case 'm':
                this.toggleMusic();
                break;
            case 'f':
                this.fireworks();
                break;
            case 'c':
                if (this.confetti) this.confetti.celebrate();
                break;
            case 's':
                this.surprise();
                break;
        }
    }

    /* ==========================================
       MODAL SYSTEM
       ========================================== */

    showModal() {
        // Remove existing modal
        const existing = document.getElementById('birthday-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'birthday-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content glass">
                <div class="modal-emoji">🎂🎁</div>
                <h2 class="modal-title">Chúc Mừng Sinh Nhật!</h2>
                <p class="modal-text">
                    <strong>Quang Duy</strong> ơi!<br>
                    Chúc bạn có một ngày sinh nhật thật tuyệt vời,
                    tràn đầy niềm vui và những kỷ niệm đẹp! 💖
                </p>
                <button class="btn btn-primary modal-close">
                    <span class="btn-icon"></span>
                    <span class="btn-text">Cảm ơn nhiều!</span>
                </button>
            </div>
        `;

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #birthday-modal {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                animation: fadeIn 0.3s ease;
            }
            .modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
            }
            .modal-content {
                position: relative;
                max-width: 500px;
                padding: 3rem 2rem;
                text-align: center;
                animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .modal-emoji {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: bounce 1s ease-in-out infinite;
            }
            .modal-title {
                font-family: var(--font-display);
                font-size: 2.5rem;
                background: linear-gradient(135deg, #feca57, #ff6b9d);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 1rem;
            }
            .modal-text {
                font-size: 1.1rem;
                line-height: 1.8;
                color: var(--text-secondary);
                margin-bottom: 2rem;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes modalPop {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close handlers
        const closeModal = () => {
            modal.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                if (style.parentNode) style.parentNode.removeChild(style);
            }, 300);
        };

        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        // ESC to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
}

/* ==========================================
   BOOT THE APP
   ========================================== */

const app = new BirthdayApp();
app.init();

// Expose global for debugging
window.birthdayApp = app;

console.log(
    '%c🎂 Happy Birthday Quang Duy! 🎉%c\nMade with ❤️',
    'font-size: 20px; color: #ff6b9d; font-weight: bold;',
    'font-size: 12px; color: #feca57;'
);