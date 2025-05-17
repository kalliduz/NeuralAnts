const test = require('node:test');
const assert = require('node:assert/strict');
const Brain = require('../js/brain.js');

test('Brain clones weights correctly', () => {
  const brain = new Brain(2, 2, 2);
  const clone = brain.clone();
  assert.deepStrictEqual(clone.weights1, brain.weights1);
  assert.deepStrictEqual(clone.weights2, brain.weights2);
  clone.weights1[0][0] = 999;
  assert.notStrictEqual(brain.weights1[0][0], 999);
});

test('Brain mutates weights', () => {
  const brain = new Brain(1, 1, 1);
  const original = brain.weights1[0][0];
  brain.mutate(1);
  assert.notStrictEqual(brain.weights1[0][0], original);
});

test('Brain process outputs a unit direction', () => {
  const brain = new Brain(3, 3, 2);
  const [dx, dy] = brain.process([0.2, 0.3, 1]);
  const mag = Math.hypot(dx, dy);
  assert.ok(Math.abs(mag - 1) < 1e-6);
});
