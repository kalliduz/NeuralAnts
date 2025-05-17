class Actors {
    constructor(ant) {
        this.ant = ant;
    }

    apply(outputs) {
        // simple placeholder: modify ant direction and speed
        const [dx, dy, speed] = outputs;
        this.ant.vx = dx * speed;
        this.ant.vy = dy * speed;
    }
}

if (typeof module !== 'undefined') {
    module.exports = Actors;
}
