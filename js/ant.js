import Brain from './brain.js';
import Sensors from './sensors.js';
import Actors from './actors.js';

export default class Ant {
    constructor(environment, config = {}) {
        this.x = environment.width / 2;
        this.y = environment.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.brain = new Brain();
        this.sensors = new Sensors(this, environment);
        this.actors = new Actors(this);
        this.environment = environment;
        this.initialEnergy = config.initialEnergy || 100;
        this.energy = this.initialEnergy;
        this.energyDecayRate = config.energyDecayRate || 0.1;
        this.foodEnergyGain = config.foodEnergyGain || 20;
        this.pheromoneLife = config.pheromoneLife || 100; // unused with map but kept for compatibility
        this.age = 0;
        this.carryingFood = false;
    }

    update() {
        if (this.energy <= 0) return;
        this.age++;
        const inputs = this.sensors.read();
        const outputs = this.brain.process(inputs);
        this.actors.apply(outputs);
        this.x = Math.min(Math.max(this.x + this.vx, 0), this.environment.width);
        this.y = Math.min(Math.max(this.y + this.vy, 0), this.environment.height);

        // obstacle collision simple bounce
        this.environment.obstacles.forEach(o => {
            if (this.x > o.x && this.x < o.x + o.w && this.y > o.y && this.y < o.y + o.h) {
                this.x -= this.vx;
                this.y -= this.vy;
                this.vx = -this.vx;
                this.vy = -this.vy;
            }
        });

        // energy usage and food consumption
        this.energy -= this.energyDecayRate;
        let ate = false;

        // Optimization: Iterate backwards to remove
        for (let i = this.environment.food.length - 1; i >= 0; i--) {
            const f = this.environment.food[i];
            const distSq = (f.x - this.x) ** 2 + (f.y - this.y) ** 2;
            if (distSq <= 25) { // 5^2
                ate = true;
                // Remove food efficiently
                this.environment.food[i] = this.environment.food[this.environment.food.length - 1];
                this.environment.food.pop();
            }
        }

        if (ate) this.carryingFood = true;

        if (this.carryingFood) {
            const dNestSq = (this.x - this.environment.nest.x) ** 2 + (this.y - this.environment.nest.y) ** 2;
            if (dNestSq <= 100) { // 10^2
                this.energy = Math.min(this.initialEnergy,
                    this.energy + this.foodEnergyGain);
                this.carryingFood = false;
            }
        }
    }

    draw(ctx) {
        if (this.energy <= 0) return;

        const ratio = Math.max(this.energy, 0) / this.initialEnergy;
        // Color based on energy: Green (high) -> Red (low)
        // Or maybe White -> Darker?
        // Let's go with a nice gradient or solid color.
        // High energy: White/Yellow. Low energy: Red.

        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        const b = 100;

        ctx.fillStyle = `rgb(${r + 50},${g + 50},${b})`;

        ctx.save();
        ctx.translate(this.x, this.y);
        // Rotate in direction of movement if moving
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        // Draw ant as a small triangle
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-3, -3);
        ctx.closePath();
        ctx.fill();

        if (this.carryingFood) {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(2, 0, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // small energy bar above the ant (optional, maybe too cluttered? Let's keep it minimal)
        // Only show if energy is low?
        if (ratio < 0.3) {
            const barWidth = 10;
            const barHeight = 2;
            const barX = this.x - barWidth / 2;
            const barY = this.y - 8;
            ctx.fillStyle = `rgb(255, 0, 0)`;
            ctx.fillRect(barX, barY, barWidth * ratio, barHeight);
        }
    }
}
