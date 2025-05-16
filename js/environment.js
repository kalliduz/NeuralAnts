class Environment {
    constructor() {
        this.width = 800;
        this.height = 600;
        this.food = [];
    }

    update() {
        // environment dynamics placeholder
    }

    draw(ctx) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'green';
        this.food.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
