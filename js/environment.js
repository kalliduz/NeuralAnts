class Environment {
    constructor() {
        this.width = 800;
        this.height = 600;
        this.food = [];
        this.pheromones = [];
        this.obstacles = [];
        for (let i = 0; i < 5; i++) {
            this.obstacles.push({
                x: Math.random() * (this.width - 40),
                y: Math.random() * (this.height - 40),
                w: 20 + Math.random() * 20,
                h: 20 + Math.random() * 20
            });
        }
    }

    update() {
        // spawn new food occasionally
        if (this.food.length < 50 && Math.random() < 0.02) {
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
