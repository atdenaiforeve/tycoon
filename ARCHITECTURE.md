# BLACKSITE-01 Tycoon Architecture

## Goal

The Tycoon is now built so individual systems can be removed without leaving tutorial gates, save fields, event handlers, timers, UI locks, or startup code behind.

## Structure

- `ui.html` — markup and CSS only.
- `js/main.js` — boot sequence and game loop.
- `js/config.js` — costs, timers, versions and constants.
- `js/state.js` — one canonical state shape and serialization.
- `js/save.js` — local save/load/reset.
- `js/events.js` — communication between modules.
- `js/feature-registry.js` — feature lifecycle.
- `js/features/economy.js` — Research Point income.
- `js/features/construction.js` — buildings and staff construction.
- `js/features/research.js` — experiments and experiment files.
- `js/features/raids.js` — raid events and security consequences.
- `js/features/upgrades.js` — upgrade tree.
- `js/ui.js` — DOM rendering and input wiring.

## Feature lifecycle

A feature can expose:

- `init(context)`
- `tick(dt, context)`
- `reset(context)`
- `destroy(context)`

Features communicate through events instead of importing each other directly.

## Removing a feature

1. Remove its registration from `js/main.js`.
2. Remove its module.
3. Remove its UI block from `ui.html`.
4. Remove its state fields from `js/state.js`.
5. Remove its config constants from `js/config.js`.
6. Remove its save fields/migration only if they are feature-specific.
7. Search the repository for the feature id.
8. Confirm the removed feature id no longer appears in runtime code.

A deleted feature should never be represented by a hidden boolean that still runs code.

## Adding a tutorial later

A tutorial must be its own feature. It must observe the game and display guidance only. It must not own construction rules, save progression, or button availability.

## Debugging

Open the game with `?debug=1` to show the active feature registry, construction queue and raid state.

## Design rules

- One source of truth for state.
- No giant inline JavaScript block.
- No duplicate build constants.
- No feature-to-feature global variables.
- No hidden progression gates.
- No feature code in CSS.
- No feature code in the HTML loader.
- Local save data contains only actual game state.
