class Sensors {
    constructor(ant, environment) {
        this.ant = ant;
        this.environment = environment;
    }

    read() {
        const food = this.environment.food;
        if (food.length === 0) {
            return [0, 0, 0];
        }
        // find nearest food
        let nearest = food[0];
        let minDist = Infinity;
        for (const f of food) {
            const dx = f.x - this.ant.x;
            const dy = f.y - this.ant.y;
            const d = Math.hypot(dx, dy);
            if (d < minDist) {
                minDist = d;
                nearest = f;
            }
        }
        const dirX = (nearest.x - this.ant.x) / (minDist || 1);
        const dirY = (nearest.y - this.ant.y) / (minDist || 1);
        const distNorm = Math.min(minDist / 100, 1);
        return [dirX, dirY, distNorm];
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined') {
    module.exports = Sensors;
}
