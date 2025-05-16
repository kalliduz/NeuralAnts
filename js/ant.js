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
    }

    update() {
        const inputs = this.sensors.read();
        const outputs = this.brain.process(inputs);
        this.actors.apply(outputs);
        this.x += this.vx;
        this.y += this.vy;
        // check for food consumption
        this.environment.food = this.environment.food.filter(f => {
            return Math.hypot(f.x - this.x, f.y - this.y) > 5;
        });
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
