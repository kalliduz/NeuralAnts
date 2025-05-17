const test = require('node:test');
const assert = require('node:assert/strict');
global.Brain = require('../js/brain.js');
const Sensors = require('../js/sensors.js');
global.Sensors = Sensors;
const Actors = require('../js/actors.js');
global.Actors = Actors;
const Environment = require('../js/environment.js');
const Ant = require('../js/ant.js');

function createEnv(foods) {
  const env = new Environment();
  env.food = foods;
  env.pheromones = [];
  env.obstacles = [];
  return env;
}

test('Sensors returns zeros when no food', () => {
  const env = createEnv([]);
  const ant = new Ant(env);
  const sensors = new Sensors(ant, env);
  assert.deepStrictEqual(sensors.read(), [0, 0, 0]);
});

test('Sensors detects nearest food direction', () => {
  const env = createEnv([{x: 100, y: 0}, {x: 10, y: 0}]);
  const ant = new Ant(env);
  ant.x = 50; ant.y = 0;
  const sensors = new Sensors(ant, env);
  const [dx] = sensors.read();
  assert.ok(dx < 0);
});
