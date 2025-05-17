class Actors {
    constructor(ant) {
        this.ant = ant;
    }

    apply(outputs) {
        // modify ant direction and speed, optionally deposit pheromone
        const [dx, dy, speed, deposit] = outputs;
        this.ant.vx = dx * speed;
        this.ant.vy = dy * speed;
        if (deposit > 0.5) {
            this.ant.environment.deposit(this.ant.x, this.ant.y);
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Actors;
}
