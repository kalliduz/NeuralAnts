class Simulation {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.environment = new Environment();
        this.ants = [new Ant(this.environment)];
        this.maxAnts = 20;
        this.networkViz = new NetworkViz('networkCanvas');
    }

    update() {
        this.environment.update();
        this.ants.forEach(ant => ant.update());
        // reproduction
        const newAnts = [];
        this.ants.forEach(ant => {
            if (ant.energy > 120 && this.ants.length + newAnts.length < this.maxAnts) {
                ant.energy -= 40;
                const child = new Ant(this.environment);
                child.x = ant.x;
                child.y = ant.y;
                child.brain = ant.brain.clone();
                child.brain.mutate(0.2);
                newAnts.push(child);
            }
        });
        this.ants.push(...newAnts);
    }

    draw() {
        this.environment.draw(this.ctx);
        this.ants.forEach(ant => ant.draw(this.ctx));
        if (this.ants[0]) {
            this.networkViz.draw(this.ants[0].brain);
        }
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
