# Neural Ants

A simple ant colony simulation that runs directly in the browser. Ants evolve
behaviours through small neural networks that mutate when food is plentiful.

## Usage

To run the simulation, you need to serve the files using a local web server because the project uses ES Modules, which are blocked by CORS when opening `file://` URLs directly in some browsers.

You can use `npx` (included with Node.js) or Python:

```bash
# Node.js
npx serve .

# Python
python -m http.server
```

Then open the URL (usually `http://localhost:3000` or `http://localhost:8000`) in your browser.

The page will display a canvas with a population of ants seeking out food. You can tweak parameters using the sidebar controls.
A second canvas shows a visualisation of the neural network used by the first ant.
Stats are displayed at the top of the simulation area.

Ants now carry food back to a grey nest in the centre of the canvas. The
neural network receives an extra input representing the direction to this nest
so that learned behaviours can include returning home.

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
