# Neural Ants Architecture

This project is a browser-based simulation of ants that use simple neural
networks as their brains. The aim is to create a playground for evolving
agents and a dynamic environment. The code is intentionally lightweight and
runs without any build step; simply open `main.html` in a browser.

## Components

- **Environment**: Holds global state such as food locations and terrain
  information. It spawns food items over time and exposes update and draw
  methods.
- **Ant**: Represents an individual ant with a position, sensors and actors.
- **Brain**: Processes sensor data and returns movement commands. The current
  implementation simply moves the ant toward sensed food.
- **Sensors**: Collect information from the environment for an ant. They
  currently return the direction and distance to the nearest food source.
- **Actors**: Modify the ant or environment based on brain outputs.
- **Simulation**: Manages the environment and the set of ants. Responsible for
  updating and rendering everything each frame.

Each component is implemented as a plain JavaScript class in the `js/`
folder. The classes are minimal stubs to make extension easy.

## Running

Open `main.html` in any modern browser. No server is required. For local
experiments, you can also run `python -m http.server` and navigate to the
served page.
