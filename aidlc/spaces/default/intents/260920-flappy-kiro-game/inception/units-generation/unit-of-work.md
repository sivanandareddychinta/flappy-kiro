# Unit of Work — Flappy Kiro

## Unit Definition

| Unit ID | Directory | Name | Description |
|---------|-----------|------|-------------|
| U1 | u1-flappy-kiro-game | Flappy Kiro Game | Complete browser-based Flappy Bird clone with game logic, rendering, audio, and persistence |

---

## Unit Responsibilities

**U1 — Flappy Kiro Game** owns and delivers:

- Game loop orchestration (ready, playing, ended states)
- Player character entity (Ghosty) lifecycle and control
- Physics simulation (gravity, impulse, collision detection)
- Obstacle generation and management
- Scoring logic and high-score persistence
- Canvas-based rendering and screen transitions
- Audio playback and sound effect management
- Keyboard input capture and event emission
- Browser local storage abstraction for high-score persistence

All 9 logical components (GameLoop, Player, Physics, Obstacles, Scoring, Rendering, Audio, Input, Persistence) are implemented within this unit.

---

## Deployment Model

**U1** deploys as a **monolithic browser bundle**:
- Single HTML entry point (`index.html`) that includes one bundled JavaScript file
- All 9 components compiled and minified into one package
- No external dependencies (runs completely in-browser)
- Single static file deployment (no backend services, no separate modules)

---

## Complexity Estimate

**U1**: Large (L)

Rationale: Covers 9 interrelated components with physics simulation, rendering, state management, and event coordination. Moderate complexity for a game; not extreme due to scope limitations (no 3D, no multiplayer, no persistence backend).

---

## Unit Kind

**U1**: `packaging`

Rationale: This unit is a complete, self-contained deliverable package (the game itself). It is not a `service` (no backend), not a `spec` (it's an executable), not `ui` alone (it includes game logic), and not a `library` (it's end-user-facing). The closest fit is `packaging` — a bundled distribution artifact ready for deployment.

---

## Implementation Notes and Constraints

1. **No external services:** All logic runs client-side. No backend communication required.
2. **Single-file deployment:** The entire game compiles into one .js file served via a static HTML page.
3. **Component encapsulation:** While all components live in one unit, code organization follows the 9-component boundaries defined in Domain Design for testability and maintainability.
4. **Browser compatibility:** Must run in all modern desktop browsers (Chrome, Firefox, Safari, Edge) per NFR2.1.
5. **Performance target:** Minimum 30 fps per NFR1.1; target 60 fps per NFR1.2.
6. **No external libraries required for core logic:** Canvas API, Web Audio API, localStorage, and keyboard events are all built-in browser APIs.
7. **High-score persistence:** Stored in browser localStorage; no network synchronization.

---

## Construction Artifacts

Unit U1 will produce the following design and implementation artifacts during Construction:

- **Functional Design** (`entities.md`, `service-specs.md`): Entity schemas, method signatures, and component APIs
- **Code** (`src/`): JavaScript implementation of all 9 components and the entry point
- **Tests** (`tests/`): Unit tests for each component plus integration tests
- **Build Output** (`dist/`): Bundled game.js and index.html ready for deployment
