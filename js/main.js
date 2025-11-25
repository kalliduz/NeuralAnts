import Environment from './environment.js';
import Ant from './ant.js';
import NetworkViz from './network_viz.js';

export default class Simulation {
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
        this.statsEl = document.getElementById('stats');
        this.stepCount = 0;
        this.running = false;
        this.animationId = null;
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
        this.stepCount++;
        this._updateStats();
    }

    draw() {
        this.environment.draw(this.ctx);
        this.ants.forEach(ant => ant.draw(this.ctx));
        if (this.ants[0]) {
            this.networkViz.draw(this.ants[0].brain);
        }
    }

    _updateStats() {
        if (!this.statsEl) return;
        const avgEnergy = this.ants.reduce((sum, a) => sum + a.energy, 0) /
            (this.ants.length || 1);
        this.statsEl.innerHTML =
            `<div class="stat-item"><span>Ants</span> <strong>${this.ants.length}</strong></div>` +
            `<div class="stat-item"><span>Food</span> <strong>${this.environment.food.length}</strong></div>` +
            `<div class="stat-item"><span>Step</span> <strong>${this.stepCount}</strong></div>` +
            `<div class="stat-item"><span>Avg Energy</span> <strong>${avgEnergy.toFixed(1)}</strong></div>`;
    }

    step() {
        if (!this.running) return;
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.step());
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.step();
    }

    stop() {
        this.running = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}

// Entry point
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        let sim = null;

        btn.addEventListener('click', () => {
            if (sim) {
                sim.stop();
            }

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
                pheromoneDecayRate: parseFloat(document.getElementById('pheromoneDecayInput').value) || 0.01,
                pheromoneCellSize: parseInt(document.getElementById('pheromoneCellSizeInput').value, 10) || 20,
                obstacleCount: parseInt(document.getElementById('obstacleCountInput').value, 10) || 5,
                width: parseInt(document.getElementById('widthInput').value, 10) || 800,
                height: parseInt(document.getElementById('heightInput').value, 10) || 600
            };
            const canvas = document.getElementById('simulationCanvas');
            canvas.width = cfg.width;
            canvas.height = cfg.height;

            sim = new Simulation('simulationCanvas', count, cfg);
            sim.start();

            btn.textContent = 'Restart';
            stopBtn.disabled = false;
        });

        stopBtn.addEventListener('click', () => {
            if (sim) {
                if (sim.running) {
                    sim.stop();
                    stopBtn.textContent = 'Resume';
                } else {
                    sim.start();
                    stopBtn.textContent = 'Pause';
                }
            }
        });
    });
}
