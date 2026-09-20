# Flappy Kiro — Source Architecture

## Overview

Flappy Kiro is a browser-based arcade game implemented in vanilla JavaScript with no external runtime dependencies. All game logic, rendering, audio, input handling, and persistence are contained in 9 components plus an entry point.

## Component Architecture

```
src/
├── index.js          Entry point; exports Game API (init, destroy)
├── types.js          Data model: GameState enum, Vector2, GameObject, Ghosty, Wall, constants
├── Physics.js        Gravity, impulse, position update, boundary & wall collision
├── Player.js         Ghosty entity management: init, update, flap, kill
├── Obstacles.js      Wall generation, scrolling, gap randomization, culling
├── Scoring.js        Point award logic, high-score tracking
├── Input.js          Keyboard event capture, edge-triggered flap polling
├── Audio.js          Web Audio API: SFX, background music, mute toggle
├── Persistence.js    localStorage abstraction: high score, mute state
├── Rendering.js      Canvas 2D drawing: READY, PLAYING, ENDED screens
└── GameLoop.js       Orchestrator: RAF loop, state machine, component wiring
```

## Data Flow

```
Window keydown/keyup → Input.pollInput()
                           ↓
                     GameLoop.run(timestamp)
                           ↓
              ┌────────────┴────────────────┐
              ↓                             ↓
     Player.update()               Obstacles.update()
     Physics (gravity, position)   Wall scroll & spawn
              ↓                             ↓
     Physics.wallCollisionCheck() ←─── walls[]
              ↓
     Scoring.checkPassage()
              ↓
     Rendering.draw*()  →  Canvas
```

## Module Boundaries

- **Physics** is a stateless service — it operates on objects passed in, never stores state.
- **Player** owns the Ghosty entity; other components receive it via `getGhosty()`.
- **GameLoop** owns and wires all components. Tests can inject mock components via the `overrides` argument to `init()`.
- **Audio** is always optional — all sound operations are wrapped in try/catch and degrade gracefully.

## Constants & Tuning

All physics constants are in `src/types.js` under `DEFAULT_SETTINGS`:

| Constant | Value | Notes |
|---|---|---|
| `gravity` | 0.0008 | Units/ms² — applied each frame proportional to deltaTime |
| `impulseStrength` | 0.35 | Units/ms — upward velocity on flap |
| `scrollSpeed` | 0.15 | Units/ms — wall scroll speed |
| `wallSpacing` | 200 | px between wall centers |
| `gapSize` | 140 | px height of navigable gap |
| `terminalVelocity` | 0.8 | Max downward velocity (units/ms) |

## Tests

Tests live in `tests/` mirroring `src/`. Run with:

```bash
npm run test:unit
```

Total: ~126 tests across 12 test files.
