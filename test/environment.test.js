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

test('Environment places nest at canvas centre', () => {
  const env = new Environment({width: 200, height: 100});
  assert.strictEqual(env.nest.x, 100);
  assert.strictEqual(env.nest.y, 50);
});

test('Environment decays pheromones', () => {
  const env = new Environment({pheromoneDecayRate: 0.5});
  env.deposit(10, 10, 1);
  env.updatePheromones();
  const cx = Math.floor(10 / env.cellSize);
  const cy = Math.floor(10 / env.cellSize);
  assert.ok(env.pheromoneMap[cx][cy] < 1);
});

test('Pheromone decay is multiplicative', () => {
  const env = new Environment({pheromoneDecayRate: 0.5});
  env.deposit(20, 20, 1);
  env.updatePheromones();
  const cx = Math.floor(20 / env.cellSize);
  const cy = Math.floor(20 / env.cellSize);
  assert.ok(Math.abs(env.pheromoneMap[cx][cy] - 0.5) < 1e-6);
});

