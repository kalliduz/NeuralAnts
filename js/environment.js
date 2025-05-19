class Environment {
    constructor(config = {}) {
        this.width = config.width || 800;
        this.height = config.height || 600;
        this.maxFood = config.maxFood || 50;
        this.initialFood = config.initialFood || 10;
        this.foodSpawnChance = config.foodSpawnChance || 0.02;
        this.obstacleCount = config.obstacleCount || 5;
        this.pheromoneDecayRate = config.pheromoneDecayRate || 0.01;
        this.pheromoneBlur = config.pheromoneBlur || 0;
        this.cellSize = config.pheromoneCellSize || 20;
        this.mapWidth = Math.ceil(this.width / this.cellSize);
        this.mapHeight = Math.ceil(this.height / this.cellSize);
        this.food = [];
        this.pheromoneMap = Array.from({ length: this.mapWidth }, () =>
            Array.from({ length: this.mapHeight }, () => 0)
        );
        this.nest = {
            x: this.width / 2,
            y: this.height / 2
        };
        this.obstacles = [];
        for (let i = 0; i < this.obstacleCount; i++) {
            this.obstacles.push({
                x: Math.random() * (this.width - 40),
                y: Math.random() * (this.height - 40),
                w: 20 + Math.random() * 20,
                h: 20 + Math.random() * 20
            });
        }
        for (let i = 0; i < this.initialFood && this.food.length < this.maxFood; i++) {
            this.food.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height
            });
        }
    }

    update() {
        // spawn new food occasionally
        if (this.food.length < this.maxFood && Math.random() < this.foodSpawnChance) {
            this.food.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height
            });
        }

        this.updatePheromones();
    }

    updatePheromones() {
        const decayFactor = 1 - this.pheromoneDecayRate;
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                this.pheromoneMap[x][y] = Math.max(0, this.pheromoneMap[x][y] * decayFactor);
            }
        }

        if (this.pheromoneBlur > 0) {
            const newMap = Array.from({ length: this.mapWidth }, () =>
                Array.from({ length: this.mapHeight }, () => 0)
            );
            for (let x = 0; x < this.mapWidth; x++) {
                for (let y = 0; y < this.mapHeight; y++) {
                    let sum = 0;
                    let count = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.mapWidth && ny >= 0 && ny < this.mapHeight) {
                                sum += this.pheromoneMap[nx][ny];
                                count++;
                            }
                        }
                    }
                    const avg = sum / count;
                    newMap[x][y] = (1 - this.pheromoneBlur) * this.pheromoneMap[x][y] +
                        this.pheromoneBlur * avg;
                }
            }
            this.pheromoneMap = newMap;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, this.width, this.height);

        // nest
        ctx.fillStyle = '#bbb';
        ctx.beginPath();
        ctx.arc(this.nest.x, this.nest.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // obstacles
        ctx.fillStyle = '#888';
        this.obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

        // pheromone map
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const val = this.pheromoneMap[x][y];
                if (val > 0) {
                    ctx.fillStyle = `rgba(255,0,0,${val})`;
                    ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        ctx.fillStyle = 'green';
        this.food.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    deposit(x, y, strength = 1) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        if (cx >= 0 && cx < this.mapWidth && cy >= 0 && cy < this.mapHeight) {
            this.pheromoneMap[cx][cy] = Math.min(1, this.pheromoneMap[cx][cy] + strength);
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Environment;
}
