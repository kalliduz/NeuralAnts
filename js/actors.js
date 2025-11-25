export default class Actors {
    constructor(ant) {
        this.ant = ant;
    }

    apply(outputs) {
        // modify ant direction and speed, optionally deposit pheromone
        // outputs is now a Float32Array or array
        const dx = outputs[0];
        const dy = outputs[1];
        const deposit = outputs[2];
        const speed = outputs[3];

        this.ant.vx = dx * speed;
        this.ant.vy = dy * speed;
        if (deposit > 0.5) {
            this.ant.environment.deposit(this.ant.x, this.ant.y);
        }
    }
}
