const test = require('node:test');
const assert = require('node:assert/strict');

const NetworkViz = require('../js/network_viz.js');

global.document = { getElementById: () => ({ getContext: () => ({}) }) };

test('NetworkViz node positions are evenly spaced', () => {
  const viz = new NetworkViz('c');
  const pos = viz._nodePositions(4, 100);
  assert.deepStrictEqual(pos, [20, 40, 60, 80]);
});

