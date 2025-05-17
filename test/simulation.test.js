const test = require('node:test');
const assert = require('node:assert/strict');

// Globals required by Ant
global.Brain = require('../js/brain.js');
global.Sensors = require('../js/sensors.js');
global.Actors = require('../js/actors.js');
global.Environment = require('../js/environment.js');
global.Ant = require('../js/ant.js');
global.NetworkViz = require('../js/network_viz.js');
const Simulation = require('../js/main.js');

// minimal DOM stubs
global.document = {
  getElementById: () => ({ getContext: () => ({}) })
};

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


