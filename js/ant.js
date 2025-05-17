class Ant {
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
        this.environment.food = this.environment.food.filter(f => {
            const eat = Math.hypot(f.x - this.x, f.y - this.y) <= 5;
            if (eat) ate = true;
            return !eat;
        });
        if (ate) this.energy = Math.min(this.initialEnergy, this.energy + this.foodEnergyGain);
    }

    draw(ctx) {
        const ratio = Math.max(this.energy, 0) / this.initialEnergy;
        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        ctx.fillStyle = `rgb(${r},${g},0)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

if (typeof module !== 'undefined') {
    module.exports = Ant;
}
