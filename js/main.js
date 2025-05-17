class Simulation {
    constructor(canvasId, initialAnts = 10, config = {}) {
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.environment = new Environment(config);
        this.ants = [];
        for (let i = 0; i < initialAnts; i++) {
            this.ants.push(new Ant(this.environment, config));
        }
        this.maxAnts = config.maxAnts || 20;
        this.reproEnergy = config.reproductionEnergyThreshold || 120;
        this.reproCost = config.reproductionEnergyCost || 40;
        this.mutationRate = config.mutationRate || 0.2;
        this.networkViz = new NetworkViz('networkCanvas');
    }

    update() {
        this.environment.update();
        this.ants.forEach(ant => ant.update());
        // remove dead ants
        this.ants = this.ants.filter(a => a.energy > 0);
        // reproduction
        const newAnts = [];
        this.ants.forEach(ant => {
            if (ant.energy > this.reproEnergy && this.ants.length + newAnts.length < this.maxAnts) {
                ant.energy -= this.reproCost;
                const child = new Ant(this.environment, this.config);
                child.x = ant.x;
                child.y = ant.y;
                child.brain = ant.brain.clone();
                child.brain.mutate(this.mutationRate);
                newAnts.push(child);
            }
        });
        this.ants.push(...newAnts);
    }

    draw() {
        this.environment.draw(this.ctx);
        this.ants.forEach(ant => ant.draw(this.ctx));
        if (this.ants[0]) {
            this.networkViz.draw(this.ants[0].brain);
        }
    }

    step() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.step());
    }

    start() {
        this.step();
    }
}

if (typeof window !== 'undefined') {
window.addEventListener('load', () => {
    const btn = document.getElementById('startBtn');
    btn.addEventListener('click', () => {
        const input = document.getElementById('antCountInput');
        const count = parseInt(input.value, 10) || 1;
        const cfg = {
            maxAnts: parseInt(document.getElementById('maxAntsInput').value, 10) || 20,
            foodSpawnChance: parseFloat(document.getElementById('foodSpawnInput').value) || 0.02,
            maxFood: parseInt(document.getElementById('maxFoodInput').value, 10) || 50,
            initialFood: parseInt(document.getElementById('initialFoodInput').value, 10) || 10,
            reproductionEnergyThreshold: parseInt(document.getElementById('reproEnergyInput').value, 10) || 120,
            reproductionEnergyCost: parseInt(document.getElementById('reproCostInput').value, 10) || 40,
            energyDecayRate: parseFloat(document.getElementById('energyDecayInput').value) || 0.1,
            foodEnergyGain: parseInt(document.getElementById('foodEnergyInput').value, 10) || 20,
            pheromoneLife: parseInt(document.getElementById('pheromoneLifeInput').value, 10) || 100,
            obstacleCount: parseInt(document.getElementById('obstacleCountInput').value, 10) || 5,
            width: parseInt(document.getElementById('widthInput').value, 10) || 800,
            height: parseInt(document.getElementById('heightInput').value, 10) || 600
        };
        const canvas = document.getElementById('simulationCanvas');
        canvas.width = cfg.width;
        canvas.height = cfg.height;
        btn.disabled = true;
        input.disabled = true;
        const sim = new Simulation('simulationCanvas', count, cfg);
        sim.start();
    });
});
}

if (typeof module !== 'undefined') {
    module.exports = Simulation;
}
