import test from 'node:test';
import assert from 'node:assert/strict';
import Simulation from '../js/main.js';

// minimal DOM stubs
global.document = {
  getElementById: (id) => {
    if (id === 'stats') return { innerHTML: '', textContent: '' };
    return { getContext: () => ({}) };
  },
  addEventListener: () => { }
};
global.window = {
  addEventListener: () => { }
};
global.requestAnimationFrame = () => { };

test('Simulation reproduces when energy threshold exceeded', () => {
  const sim = new Simulation('canvas', 1, {
    maxAnts: 2,
    reproductionEnergyThreshold: 50,
    reproductionEnergyCost: 5,
    energyDecayRate: 0
  });
  sim.ants[0].energy = 60;
  sim.update();
  assert.strictEqual(sim.ants.length, 2);
  assert.strictEqual(Math.round(sim.ants[0].energy), 55);
});

test('Simulation respects maximum ant count', () => {
  const sim = new Simulation('canvas', 2, {
    maxAnts: 2,
    reproductionEnergyThreshold: 10,
    reproductionEnergyCost: 0,
    energyDecayRate: 0
  });
  sim.ants.forEach(a => a.energy = 20);
  sim.update();
  assert.strictEqual(sim.ants.length, 2);
});

test('Simulation removes ants with no energy', () => {
  const sim = new Simulation('canvas', 2, {
    maxAnts: 5,
    reproductionEnergyThreshold: 100,
    energyDecayRate: 0
  });
  sim.ants[0].energy = 0;
  sim.ants[1].energy = 10;
  sim.update();
  assert.strictEqual(sim.ants.length, 1);
  assert.ok(sim.ants[0].energy > 0);
});


