const test = require('node:test');
const assert = require('node:assert/strict');
const Environment = require('../js/environment.js');

test('Environment spawns food when random condition met', () => {
  const env = new Environment();
  env.food = [];
  const origRandom = Math.random;
  Math.random = () => 0.0;
  env.update();
  Math.random = origRandom;
  assert.strictEqual(env.food.length, 1);
});

test('Environment creates initial food items', () => {
  const env = new Environment({initialFood: 5});
  assert.strictEqual(env.food.length, 5);
});

test('Environment decays pheromones', () => {
  const env = new Environment({pheromoneDecayRate: 0.5});
  env.deposit(10, 10, 1);
  env.updatePheromones();
  const cx = Math.floor(10 / env.cellSize);
  const cy = Math.floor(10 / env.cellSize);
  assert.ok(env.pheromoneMap[cx][cy] < 1);
});

