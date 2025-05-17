class Environment {
    constructor(config = {}) {
        this.width = config.width || 800;
        this.height = config.height || 600;
        this.maxFood = config.maxFood || 50;
        this.initialFood = config.initialFood || 10;
        this.foodSpawnChance = config.foodSpawnChance || 0.02;
        this.obstacleCount = config.obstacleCount || 5;
        this.food = [];
        this.pheromones = [];
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
    }

    draw(ctx) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, this.width, this.height);

        // obstacles
        ctx.fillStyle = '#888';
        this.obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

        // pheromones
        this.pheromones.forEach(p => {
            p.life -= 1;
        });
        this.pheromones = this.pheromones.filter(p => p.life > 0);
        ctx.fillStyle = 'rgba(255,0,0,0.3)';
        this.pheromones.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = 'green';
        this.food.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

if (typeof module !== 'undefined') {
    module.exports = Environment;
}
