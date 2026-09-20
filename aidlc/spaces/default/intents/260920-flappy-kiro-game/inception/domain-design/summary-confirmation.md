# Domain Design — Summary Confirmation

Before I finalize the component catalogue and architecture decisions, does this decomposition look correct?

## Component Structure

**Five Components Identified:**

1. **GameEngine** — Monolithic orchestrator; owns all game state (Ghosty, walls, score, UI phase, audio toggle). Manages the game loop, physics, collision detection, scoring, and audio signaling.

2. **ObstacleManager** — Generates walls at regular intervals with randomized gap positions. Maintains active wall list and provides collision/passage detection interface to GameEngine.

3. **InputHandler** — Listens for spacebar keydown/keyup events. Exposes spacebar pressed state for GameEngine to poll each frame.

4. **Renderer** — Receives game state from GameEngine each frame and draws to canvas. Renders Ghosty, walls, score displays, and UI screens (Ready, GameOver).

5. **AudioSystem** — Plays sound effects and music on game events. Receives audio event signals from GameEngine. Respects mute toggle managed by GameEngine.

## Key Design Decisions

- **Monolithic GameEngine**: One unified engine for simplicity; separable later if complexity grows.
- **Synchronous Communication**: Components interact via direct method calls, not events.
- **Unified ObstacleManager**: Wall generation and management are co-located.
- **GameEngine Owns Score**: Score and high-score persistence handled by GameEngine.
- **GameEngine Owns Audio Toggle**: Audio is managed from the game state layer.

## Traceability

All 27 functional requirements mapped to components with 100% coverage. No gaps identified.

---

## Confirmation Question

Does this component decomposition match your vision for the architecture?

[Answer]: Looks correct

---

**Confirmation Receipt**: Approved by user at 2026-09-20 15:20:33 UTC. Components, decisions, and traceability artifacts are ready for review.
