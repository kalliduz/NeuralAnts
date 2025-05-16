class Simulation {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.environment = new Environment();
        this.ants = [new Ant(this.environment)];
    }

    update() {
        this.environment.update();
        this.ants.forEach(ant => ant.update());
    }

    draw() {
        this.environment.draw(this.ctx);
        this.ants.forEach(ant => ant.draw(this.ctx));
    }

    step() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.step());
    }

    start() {
        this.step();
    }
}

window.addEventListener('load', () => {
    const sim = new Simulation('simulationCanvas');
    sim.start();
});
