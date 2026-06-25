/* ============================================
   SCROLL-LETTER.JS - Fixed version
   ============================================ */

class ScrollLetter {
    constructor() {
        this.intro = document.getElementById('scroll-intro');
        this.container = document.querySelector('.scroll-container');
        this.openBtn = document.getElementById('open-scroll-btn');
        this.isOpen = false;
        this.onOpened = null;
        
        console.log('📜 ScrollLetter initialized');
    }

    init() {
        if (!this.intro) {
            console.error('❌ Missing #scroll-intro');
            return;
        }
        if (!this.container) {
            console.error('❌ Missing .scroll-container');
            return;
        }

        console.log('✅ Scroll elements found');

        // Add click event to container
        this.container.style.cursor = 'pointer';
        
        const handleClick = (e) => {
            console.log('🖱️ Click detected!', e.target);
            if (!this.isOpen) {
                e.preventDefault();
                e.stopPropagation();
                this.open();
            }
        };

        this.container.addEventListener('click', handleClick);
        
        if (this.openBtn) {
            this.openBtn.addEventListener('click', (e) => {
                console.log('🖱️ Button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.open();
            });
        }

        // Also make entire intro clickable as fallback
        this.intro.addEventListener('click', (e) => {
            if (!this.isOpen && e.target === this.intro) {
                this.open();
            }
        });

        this.animateHint();
    }

    open() {
        if (this.isOpen) {
            console.log('Already open');
            return;
        }
        
        console.log('🎉 Opening scroll...');
        this.isOpen = true;

        // Add opened class
        this.container.classList.add('opened');

        // Trigger callback after delay
        setTimeout(() => {
            if (this.onOpened) {
                console.log('🎵 Triggering music...');
                this.onOpened();
            }
        }, 1000);

        // Auto transition after reading time
        setTimeout(() => {
            console.log('⏰ Transitioning to main...');
            this.transitionToMain();
        }, 7000);
    }

    transitionToMain() {
        this.container.classList.add('closing');
        this.container.classList.remove('opened');

        setTimeout(() => {
            this.intro.classList.add('opened');
            
            const event = new CustomEvent('scrollLetterClosed');
            window.dispatchEvent(event);
            console.log('✅ Scroll closed, main app shown');
        }, 1500);
    }

    animateHint() {
        const hint = document.querySelector('.scroll-hint');
        if (!hint) return;

        const observer = new MutationObserver(() => {
            if (this.isOpen) {
                hint.style.opacity = '0';
                hint.style.transition = 'opacity 0.5s ease';
            }
        });
        observer.observe(this.container, { attributes: true, attributeFilter: ['class'] });
    }
}

window.ScrollLetter = ScrollLetter;