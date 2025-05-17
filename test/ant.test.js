const test = require('node:test');
const assert = require('node:assert/strict');
global.Brain = require('../js/brain.js');
const Sensors = require('../js/sensors.js');
global.Sensors = Sensors;
const Actors = require('../js/actors.js');
global.Actors = Actors;
const Environment = require('../js/environment.js');
const Ant = require('../js/ant.js');

class DummySensors extends Sensors { read() { return [1,0,1,0,0,0]; } }
class DummyActors extends Actors { apply() {} }

test('Ant stops updating when out of energy', () => {
  const env = new Environment();
  const ant = new Ant(env);
  ant.sensors = new DummySensors(ant, env);
  ant.actors = new DummyActors(ant);
  ant.energy = 0;
  ant.update();
  assert.strictEqual(ant.age, 0);
});
