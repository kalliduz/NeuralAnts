import test from 'node:test';
import assert from 'node:assert/strict';
import Actors from '../js/actors.js';
import Environment from '../js/environment.js';
import Ant from '../js/ant.js';

test('Actors update ant velocity and deposit', () => {
  const env = new Environment();
  const ant = new Ant(env);
  const actors = new Actors(ant);
  actors.apply([1, 0, 1, 0.5]); // dx, dy, deposit, speed
  assert.strictEqual(ant.vx, 0.5);
  assert.strictEqual(ant.vy, 0);
  const cx = Math.floor(ant.x / env.cellSize);
  const cy = Math.floor(ant.y / env.cellSize);
  assert.ok(env.pheromoneMap[cx][cy] > 0);
});
