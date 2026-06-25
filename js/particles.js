/* ============================================
   PARTICLES.JS - Animated background particles
   ============================================ */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.connections = [];
        this.connectionDistance = 120;
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#ff6b9d', '#feca57', '#48dbfb', '#bc13fe', '#ff006e'];
        this.animationId = null;
        this.isRunning = false;
    }

    init() {
        if (!this.canvas || !this.ctx) return;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }

        this.isRunning = true;
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.isRunning || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.update(this);
            p.draw(this.ctx);
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - distance / this.connectionDistance;
                    this.ctx.strokeStyle = `rgba(255, 107, 157, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Particle {
    constructor(system) {
        this.system = system;
        this.x = Math.random() * system.canvas.width;
        this.y = Math.random() * system.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 3 + 1;
        this.color = system.colors[Math.floor(Math.random() * system.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update(system) {
        // Mouse interaction
        if (system.mouse.x !== null && system.mouse.y !== null) {
            const dx = this.x - system.mouse.x;
            const dy = this.y - system.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < system.mouse.radius) {
                const force = (system.mouse.radius - distance) / system.mouse.radius;
                this.vx += (dx / distance) * force * 0.5;
                this.vy += (dy / distance) * force * 0.5;
            }
        }

        // Apply velocity with damping
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;

        // Boundary wrap
        if (this.x < 0) this.x = system.canvas.width;
        if (this.x > system.canvas.width) this.x = 0;
        if (this.y < 0) this.y = system.canvas.height;
        if (this.y > system.canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// Export
window.ParticleSystem = ParticleSystem;