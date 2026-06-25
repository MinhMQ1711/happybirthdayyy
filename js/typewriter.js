/* ============================================
   TYPEWRITER.JS - Typing animation effect
   ============================================ */

class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.fullText = element.textContent.trim();
        this.speed = options.speed || 40;
        this.delay = options.delay || 0;
        this.cursor = options.cursor !== false;
        this.onComplete = options.onComplete || null;
        this.index = 0;
        this.isTyping = false;
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.element.textContent = '';

        if (this.cursor) {
            this.cursorEl = document.createElement('span');
            this.cursorEl.className = 'typewriter-cursor';
            this.element.appendChild(this.cursorEl);
        }

        setTimeout(() => this.type(), this.delay);
    }

    type() {
        if (this.index < this.fullText.length) {
            // Insert character before cursor
            const char = this.fullText.charAt(this.index);
            if (this.cursorEl) {
                this.element.insertBefore(
                    document.createTextNode(char),
                    this.cursorEl
                );
            } else {
                this.element.textContent += char;
            }
            this.index++;

            // Variable speed for natural feel
            const pause = char === '.' || char === ',' || char === '!' || char === '?'
                ? this.speed * 4
                : char === ' '
                    ? this.speed * 0.5
                    : this.speed + Math.random() * 30;

            setTimeout(() => this.type(), pause);
        } else {
            this.isTyping = false;
            if (this.onComplete) this.onComplete();
        }
    }

    reset() {
        this.index = 0;
        this.element.textContent = this.fullText;
        if (this.cursorEl && this.cursorEl.parentNode) {
            this.cursorEl.parentNode.removeChild(this.cursorEl);
        }
    }
}

// Auto-init all elements with data-typewriter
function initTypewriters() {
    const elements = document.querySelectorAll('[data-typewriter]');
    const observers = [];

    elements.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tw = new Typewriter(el, {
                        speed: 30,
                        delay: 200,
                        cursor: true,
                    });
                    tw.start();
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(el);
        observers.push(observer);
    });

    return observers;
}

window.Typewriter = Typewriter;
window.initTypewriters = initTypewewriters = initTypewriters;