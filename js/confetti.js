/* ============================================
   CONFETTI.JS - Confetti celebration effect
   ============================================ */

class ConfettiSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.pieces = [];
        this.colors = ['#ff6b9d', '#feca57', '#48dbfb', '#bc13fe', '#ff006e', '#00f5ff', '#ff9f43'];
        this.shapes = ['square', 'circle', 'triangle'];
        this.isRunning = false;
    }

    burst(count = 100, originX = null, originY = null) {
        if (!this.container) return;

        const centerX = originX ?? window.innerWidth / 2;
        const centerY = originY ?? window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            const size = Math.random() * 10 + 6;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;

            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.backgroundColor = color;
            piece.style.left = `${centerX}px`;
            piece.style.top = `${centerY}px`;
            piece.style.animationDuration = `${duration}s`;
            piece.style.animationDelay = `${delay}s`;

            // Shape variations
            if (shape === 'circle') {
                piece.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                piece.style.width = '0';
                piece.style.height = '0';
                piece.style.backgroundColor = 'transparent';
                piece.style.borderLeft = `${size/2}px solid transparent`;
                piece.style.borderRight = `${size/2}px solid transparent`;
                piece.style.borderBottom = `${size}px solid ${color}`;
            }

            // Random horizontal spread
            const spread = (Math.random() - 0.5) * window.innerWidth * 0.8;
            piece.style.setProperty('--spread', `${spread}px`);
            piece.style.animation = `confettiFall ${duration}s ${delay}s linear forwards`;
            piece.style.transform = `translateX(${spread}px)`;

            this.container.appendChild(piece);

            // Remove after animation
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, (duration + delay) * 1000);
        }
    }

    // Continuous rain effect
    startRain(duration = 5000) {
        if (this.isRunning) return;
        this.isRunning = true;

        const interval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(interval);
                return;
            }
            const x = Math.random() * window.innerWidth;
            this.burst(3, x, -20);
        }, 100);

        setTimeout(() => {
            this.isRunning = false;
            clearInterval(interval);
        }, duration);
    }

    // Corner bursts
    celebrate() {
        this.burst(50, 0, 0);
        this.burst(50, window.innerWidth, 0);
        setTimeout(() => {
            this.burst(50, window.innerWidth / 2, window.innerHeight / 2);
        }, 300);
    }
}

window.ConfettiSystem = ConfettiSystem;