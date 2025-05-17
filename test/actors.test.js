const test = require('node:test');
const assert = require('node:assert/strict');
global.Brain = require('../js/brain.js');
global.Sensors = require('../js/sensors.js');
const Actors = require('../js/actors.js');
global.Actors = Actors;
const Environment = require('../js/environment.js');
const Ant = require('../js/ant.js');

test('Actors update ant velocity and deposit', () => {
  const env = new Environment();
  const ant = new Ant(env);
  const actors = new Actors(ant);
  actors.apply([1, 0, 0.5, 1]);
  assert.strictEqual(ant.vx, 0.5);
  assert.strictEqual(ant.vy, 0);
  const cx = Math.floor(ant.x / env.cellSize);
  const cy = Math.floor(ant.y / env.cellSize);
  assert.ok(env.pheromoneMap[cx][cy] > 0);
});
