# Neural Ants Architecture

This project is a browser-based simulation of ants that use small neural
networks as their brains. The aim is to create a playground for evolving
agents and a dynamic environment. The code is intentionally lightweight and
runs without any build step; simply open `main.html` in a browser.

## Components

- **Environment**: Holds global state such as food locations and terrain
  information. It spawns food items over time and exposes update and draw
  methods.
- **Ant**: Represents an individual ant with a position, sensors and actors.
- **Brain**: Processes sensor data through a tiny feed-forward network and
  returns movement commands. Networks are mutated when ants reproduce.
- **Sensors**: Collect information from the environment for an ant. They
  currently return the direction and distance to the nearest food source.
- **Actors**: Modify the ant or environment based on brain outputs (velocity
  updates).
- **Simulation**: Manages the environment and the set of ants. It accepts a
  starting ant count and a configuration object so multiple ants can compete
  from the beginning of the simulation. Responsible for updating and rendering
  everything each frame.
- **NetworkViz**: Renders the neural network of the first ant onto a small
  canvas so that weights and topology can be observed.

Each component is implemented as a plain JavaScript class in the `js/`
folder. The classes are intentionally lightweight so that the demo loads
quickly.

A simple configuration object is passed to `Simulation`, `Environment` and
`Ant` to control parameters like canvas size, food spawn rate and energy
behaviour. These parameters are exposed in `main.html` so users can tweak the
simulation without modifying the code.
Any future parameters that meaningfully change the simulation should also be
added to this configuration so they remain user controllable.

## Additional Features

- **Energy**: Ants lose energy as they move and regain it when eating food. The
  colour of each ant reflects its current energy level.
- **Pheromones**: Ants leave short-lived pheromone dots that allow trails to be
  visualised.
- **Obstacles**: The environment spawns a few random rectangular obstacles that
  ants must navigate around.
- **Evolution**: When an ant has high energy it creates a mutated offspring,
  giving rise to a simple genetic algorithm.

## Running

Open `main.html` in any modern browser. No server is required. For local
experiments, you can also run `python -m http.server` and navigate to the
served page.

## Testing

Unit tests live in the `test/` directory and can be executed with Node's
built-in test runner:

```bash
npm test
```

The tests load the same JavaScript classes used by the browser, so no build
step is required.
