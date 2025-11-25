# Guidelines for Contributors

This repository is a simple browser-based experiment. When adding features or
fixes, please keep the following in mind:

- The simulation uses ES Modules, so a local server is required to run it.
  Avoid complex build tools like Webpack/Vite unless necessary.
- Update `docs/architecture.md` whenever the overall design or file structure
  changes.
- Keep examples minimal and lightweight so that the demo loads quickly.
- Update `readme.md` with any new usage instructions.
- Make important simulation parameters user definable. Any future parameters
  that significantly affect the simulation should have a corresponding UI
  input so users can tweak them.
