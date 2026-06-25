/* ============================================
   CAKE3D.JS - Interactive 3D cake effects
   ============================================ */

class Cake3D {
    constructor(cakeId) {
        this.cake = document.getElementById(cakeId);
        this.rotationX = 0;
        this.rotationY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.isHovering = false;
    }

    init() {
        if (!this.cake) return;

        this.cake.addEventListener('mousemove', (e) => {
            const rect = this.cake.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.targetRotationY = ((e.clientX - centerX) / rect.width) * 20;
            this.targetRotationX = -((e.clientY - centerY) / rect.height) * 20;
            this.isHovering = true;
        });

        this.cake.addEventListener('mouseleave', () => {
            this.targetRotationX = 0;
            this.targetRotationY = 0;
            this.isHovering = false;
        });

        this.animate();
    }

    animate() {
        // Smooth interpolation
        this.rotationX += (this.targetRotationX - this.rotationX) * 0.1;
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.1;

        if (this.cake) {
            this.cake.style.transform =
                `rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
        }

        requestAnimationFrame(() => this.animate());
    }

    // Blow out candles effect
    blowCandles() {
        const flames = this.cake.querySelectorAll('.flame');
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.style.transition = 'opacity 0.5s, transform 0.5s';
                flame.style.opacity = '0';
                flame.style.transform = 'translateX(-50%) scale(0)';

                // Smoke effect
                const smoke = document.createElement('div');
                smoke.style.cssText = `
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    width: 6px;
                    height: 20px;
                    background: linear-gradient(to top, rgba(200,200,200,0.6), transparent);
                    border-radius: 50%;
                    transform: translateX(-50%);
                    animation: smokeRise 2s ease-out forwards;
                    pointer-events: none;
                `;
                flame.parentElement.appendChild(smoke);
                setTimeout(() => smoke.remove(), 2000);
            }, index * 150);
        });
    }

    relightCandles() {
        const flames = this.cake.querySelectorAll('.flame');
        flames.forEach(flame => {
            flame.style.transition = 'opacity 0.5s, transform 0.5s';
            flame.style.opacity = '1';
            flame.style.transform = 'translateX(-50%) scale(1)';
        });
    }
}

// Add smoke animation to document
const smokeStyle = document.createElement('style');
smokeStyle.textContent = `
    @keyframes smokeRise {
        0% { opacity: 0.8; transform: translateX(-50%) translateY(0) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(2); }
    }
`;
document.head.appendChild(smokeStyle);

window.Cake3D = Cake3D;