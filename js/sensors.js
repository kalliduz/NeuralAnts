export default class Sensors {
    constructor(ant, environment) {
        this.ant = ant;
        this.environment = environment;
    }

    read() {
        const food = this.environment.food;
        let dirX = 0, dirY = 0, distNorm = 0;
        if (food.length > 0) {
            // find nearest food
            // Optimization: Don't create new objects/arrays if possible, but for now logic is fine
            let nearest = null;
            let minDist = Infinity;

            // Simple optimization: avoid sqrt if possible, but we need actual dist for normalization
            for (let i = 0; i < food.length; i++) {
                const f = food[i];
                const dx = f.x - this.ant.x;
                const dy = f.y - this.ant.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < minDist) {
                    minDist = dSq;
                    nearest = f;
                }
            }

            if (nearest) {
                const d = Math.sqrt(minDist);
                dirX = (nearest.x - this.ant.x) / (d || 1);
                dirY = (nearest.y - this.ant.y) / (d || 1);
                distNorm = Math.min(d / 100, 1);
            }
        }

        // strongest pheromone direction
        let maxVal = 0;
        let pDirX = 0, pDirY = 0;

        // Optimization: Don't scan the whole map! Only scan local area.
        // The original code scanned the ENTIRE map for every ant? That's O(MapSize * AntCount). Terrible.
        // Let's scan a 3x3 or 5x5 grid around the ant.

        const cx = Math.floor(this.ant.x / this.environment.cellSize);
        const cy = Math.floor(this.ant.y / this.environment.cellSize);
        const range = 2; // Check 2 cells radius

        for (let x = cx - range; x <= cx + range; x++) {
            for (let y = cy - range; y <= cy + range; y++) {
                if (x >= 0 && x < this.environment.mapWidth && y >= 0 && y < this.environment.mapHeight) {
                    const val = this.environment.pheromoneMap[x][y];
                    if (val > maxVal) {
                        maxVal = val;
                        const cellCenterX = x * this.environment.cellSize + this.environment.cellSize / 2;
                        const cellCenterY = y * this.environment.cellSize + this.environment.cellSize / 2;
                        const dx = cellCenterX - this.ant.x;
                        const dy = cellCenterY - this.ant.y;
                        const d = Math.hypot(dx, dy) || 1;
                        pDirX = dx / d;
                        pDirY = dy / d;
                    }
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
