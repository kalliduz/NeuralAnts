class Sensors {
    constructor(ant, environment) {
        this.ant = ant;
        this.environment = environment;
    }

    read() {
        const food = this.environment.food;
        let dirX = 0, dirY = 0, distNorm = 0;
        if (food.length > 0) {
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
            dirX = (nearest.x - this.ant.x) / (minDist || 1);
            dirY = (nearest.y - this.ant.y) / (minDist || 1);
            distNorm = Math.min(minDist / 100, 1);
        }

        // strongest pheromone direction
        let maxVal = 0;
        let pDirX = 0, pDirY = 0;
        for (let x = 0; x < this.environment.mapWidth; x++) {
            for (let y = 0; y < this.environment.mapHeight; y++) {
                const val = this.environment.pheromoneMap[x][y];
                if (val > maxVal) {
                    maxVal = val;
                    const cx = x * this.environment.cellSize + this.environment.cellSize / 2;
                    const cy = y * this.environment.cellSize + this.environment.cellSize / 2;
                    const dx = cx - this.ant.x;
                    const dy = cy - this.ant.y;
                    const d = Math.hypot(dx, dy) || 1;
                    pDirX = dx / d;
                    pDirY = dy / d;
                }
            }
        }

        const ndx = this.environment.nest.x - this.ant.x;
        const ndy = this.environment.nest.y - this.ant.y;
        const nd = Math.hypot(ndx, ndy) || 1;
        const nestX = ndx / nd;
        const nestY = ndy / nd;

        return [dirX, dirY, distNorm, pDirX, pDirY, maxVal, nestX, nestY];
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined') {
    module.exports = Sensors;
}
