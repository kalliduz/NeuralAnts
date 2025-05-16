class Ant {
    constructor(environment) {
        this.x = environment.width / 2;
        this.y = environment.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.brain = new Brain();
        this.sensors = new Sensors(this, environment);
        this.actors = new Actors(this);
        this.environment = environment;
        this.energy = 100;
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
        this.energy -= 0.1;
        let ate = false;
        this.environment.food = this.environment.food.filter(f => {
            const eat = Math.hypot(f.x - this.x, f.y - this.y) <= 5;
            if (eat) ate = true;
            return !eat;
        });
        if (ate) this.energy = Math.min(100, this.energy + 20);

        // leave pheromone
        this.environment.pheromones.push({ x: this.x, y: this.y, life: 100 });
    }

    draw(ctx) {
        const ratio = Math.max(this.energy, 0) / 100;
        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        ctx.fillStyle = `rgb(${r},${g},0)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
