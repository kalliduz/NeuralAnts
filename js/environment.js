export default class Environment {
    constructor(config = {}) {
        this.width = config.width || 800;
        this.height = config.height || 600;
        this.maxFood = config.maxFood || 50;
        this.initialFood = config.initialFood || 10;
        this.foodSpawnChance = config.foodSpawnChance || 0.02;
        this.obstacleCount = config.obstacleCount || 5;
        this.pheromoneDecayRate = config.pheromoneDecayRate || 0.01;
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
        // decay pheromone map
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (this.pheromoneMap[x][y] > 0) {
                    this.pheromoneMap[x][y] = Math.max(0, this.pheromoneMap[x][y] - this.pheromoneDecayRate);
                }
            }
        }
    }

    draw(ctx) {
        // Clear with a nice dark background handled by CSS/Main, but here we draw game elements
        // Actually, let's make the background transparent so CSS handles the color, or draw a specific color
        // The original drew #fafafa. Let's stick to drawing nothing for bg if we want CSS to handle it, 
        // or draw a dark bg. Let's draw a dark bg for the "premium" feel.
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, this.width, this.height);

        // nest
        ctx.fillStyle = '#4a90e2'; // Blueish nest
        ctx.beginPath();
        ctx.arc(this.nest.x, this.nest.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // obstacles
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#555';
        this.obstacles.forEach(o => {
            ctx.fillRect(o.x, o.y, o.w, o.h);
            ctx.strokeRect(o.x, o.y, o.w, o.h);
        });

        // pheromone map
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const val = this.pheromoneMap[x][y];
                if (val > 0.05) { // Threshold to avoid drawing invisible
                    ctx.fillStyle = `rgba(64, 224, 208, ${val * 0.5})`; // Turquoise pheromones
                    ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        // food
        ctx.fillStyle = '#e74c3c'; // Red food
        this.food.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#e74c3c';
        });
        ctx.shadowBlur = 0;
    }

    deposit(x, y, strength = 1) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        if (cx >= 0 && cx < this.mapWidth && cy >= 0 && cy < this.mapHeight) {
            this.pheromoneMap[cx][cy] = Math.min(1, this.pheromoneMap[cx][cy] + strength);
        }
    }
}
