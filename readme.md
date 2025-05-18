# Neural Ants

A simple ant colony simulation that runs directly in the browser. Ants evolve
behaviours through small neural networks that mutate when food is plentiful.

## Usage

Open `main.html` in any modern browser. The page will display a canvas with a
population of ants seeking out food that appears over time. Before starting you
can set how many ants to spawn and tweak advanced parameters using the input
fields at the top of the page. One of these options, **Initial food**, controls
how many food items are placed in the environment when the simulation begins.
Another option, **Pheromone decay**, defines how quickly deposited pheromones
fade from the map.
A second canvas shows a visualisation of the neural network used by the first
ant. Neuron activations and labels are displayed so you can see how inputs
translate to outputs. A small stats line under the start button shows how many
ants are alive, how much food exists and the average energy as the simulation
runs. Each ant also displays a tiny blue bar above it representing its current
energy level. No server or build step is required.

## Repository Structure

- `main.html` – entry point that loads all scripts
- `css/` – style sheets
- `js/` – JavaScript source files
- `js/network_viz.js` – draws a visualisation of the first ant's brain with activation values and labels
- `docs/` – project documentation

See `docs/architecture.md` for a high level overview.

## Running Tests

The repository includes a suite of unit tests that exercise the core
JavaScript classes. Run them with Node's built-in test runner:

```bash
npm test
```
