# Neural Ants

A simple ant colony simulation that runs directly in the browser. Ants evolve
behaviours through small neural networks that mutate when food is plentiful.

## Usage

Open `main.html` in any modern browser. The page will display a canvas with a
population of ants seeking out food that appears over time. A second canvas
shows a visualisation of the neural network used by the first ant. No server
or build step is required.

## Repository Structure

- `main.html` – entry point that loads all scripts
- `css/` – style sheets
- `js/` – JavaScript source files
- `js/network_viz.js` – draws a small visualisation of the first ant's brain
- `docs/` – project documentation

See `docs/architecture.md` for a high level overview.
