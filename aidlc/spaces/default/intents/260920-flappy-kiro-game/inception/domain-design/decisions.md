# Architecture Decision Records — Flappy Kiro Domain Design

## ADR-001: Separate Physics from Player Entity

**Context:**
The game requires motion simulation (gravity, impulse) and collision detection. Player character (Ghosty) needs position and velocity state. Two design patterns are common: (1) Physics owns all motion data, or (2) Player owns entity state and delegates physics simulation.

**Decision:**
Separate Player component owns Ghosty's entity state (position, velocity, bounds). Player delegates motion simulation to Physics component via a simulate() method.

**Consequences:**
- **Positive:** Clean entity ownership — Ghosty is a domain concept with its own component. Physics becomes a reusable service. Player can reason about entity lifecycle independently from physics tuning.
- **Positive:** Testability — Player and Physics can be tested independently.
- **Positive:** Future-proofing — if we add more entities (power-ups, enemies), each gets its own component and delegates to Physics.
- **Negative:** Slight indirection — Player → Physics call chain is one more layer.

**Alternatives Rejected:**
- **Physics owns all motion state:** Would make Physics responsible for both simulation and entity representation, violating single responsibility. Physics would be tightly coupled to Ghosty specifically.

---

## ADR-002: Unified Physics Component for Motion and Collision Detection

**Context:**
Physics simulation involves both motion (velocity, gravity, impulse) and collision detection (AABB checks, boundary checks). Separation would create two components, each small. Unification is simpler but risks complexity.

**Decision:**
Unified Physics component handles gravity, impulse, velocity integration, and collision detection. Collision results include collision type (wall, ceiling, ground) and collision object metadata.

**Consequences:**
- **Positive:** Physics stays focused — it's a single simulation service that applies forces and checks geometry.
- **Positive:** Simpler initialization and fewer components overall.
- **Positive:** Collision results are packaged with motion results, reducing API surface.
- **Negative:** Physics component is larger than a pure-motion component would be, but scope is reasonable for Flappy Kiro.

**Alternatives Rejected:**
- **Separate Collision component:** Would require careful coordination between Physics and Collision. Adds a component for a responsibility that naturally groups with physics.

---

## ADR-003: Separate Audio Component with Event-Driven Architecture

**Context:**
Audio is optional (FR5.3—5.4) and controllable by the user. Audio events (flap, point, collision) occur during gameplay. Two approaches: (1) couple audio to each event source (Scoring plays point sound, Physics plays collision sound), or (2) separate Audio component listens to events.

**Decision:**
Separate Audio component owns all sound playback and mute state. Audio subscribes to events emitted by Player (flap), Scoring (point), and GameLoop (collision, music transitions). Audio respects mute state.

**Consequences:**
- **Positive:** Audio is completely decoupled from game logic. Muting or replacing audio has zero impact on gameplay.
- **Positive:** Audio can be tested, debugged, and tuned independently.
- **Positive:** Event-driven architecture is extensible — future features (voiceover, ambient sounds) are easy to add.
- **Positive:** Audio can be mocked out for fast unit testing of game logic.
- **Negative:** Requires an event emission mechanism (simple callbacks or event bus). Slight indirection in code.

**Alternatives Rejected:**
- **Coupled audio:** Would scatter audio logic across Player, Scoring, Physics, GameLoop. Changes to audio design would touch many files. Muting would require conditionals everywhere.

---

## ADR-004: Separate Obstacles Component for Wall Management

**Context:**
Walls are procedurally generated at intervals (FR2.1—2.6). Generation logic, wall lifecycle, gap randomization, and collision geometry are intertwined. Two approaches: (1) GameLoop generates walls and tracks a list, or (2) Obstacles component owns generation and lifecycle.

**Decision:**
Separate Obstacles component owns all wall entities, procedural generation logic, gap randomization, and despawning. GameLoop calls obstacles.update() each frame; Physics queries obstacles for collision checks.

**Consequences:**
- **Positive:** Obstacle generation is a single, testable component. Changes to gap sizing, wall spacing, or difficulty are localized.
- **Positive:** Physics queries a single API for obstacle geometry, not scattered lists.
- **Positive:** Wall despawning and cleanup is owned by a single component.
- **Negative:** Adds a component. GameLoop must coordinate with Obstacles.

**Alternatives Rejected:**
- **GameLoop owns obstacles:** Would make GameLoop responsible for both game flow and obstacle generation. Too many responsibilities.

---

## ADR-005: Separate Scoring Component

**Context:**
Scoring involves tracking current and high score, detecting when Ghosty passes a wall, persisting high score to localStorage, and emitting events for audio feedback. Two approaches: (1) GameLoop handles scoring, or (2) Scoring is a component.

**Decision:**
Separate Scoring component owns current and high score state, score increment logic, and event emission (onPointEarned). Scoring coordinates with Persistence to save/load high score.

**Consequences:**
- **Positive:** Scoring logic is isolated and testable independently.
- **Positive:** Scoring rules can evolve (bonus points, combo scoring, achievements) without touching GameLoop.
- **Positive:** Scoring events (onPointEarned) are a natural hook for audio, UI feedback, and future multiplayer scoring.
- **Negative:** Adds a component; GameLoop must notify Scoring of scoring events.

**Alternatives Rejected:**
- **GameLoop owns scoring:** Would couple game flow with scoring logic. Changes to scoring rules would require GameLoop modifications.

---

## ADR-006: Rendering Component Owns Canvas Setup, Asset Loading, and Screen Transitions

**Context:**
Rendering involves canvas initialization, sprite asset loading, layered drawing, and screen state management (ready, game, end screens). Approaches: (1) Rendering is drawing-only, or (2) Rendering owns full visual presentation including assets and screen logic.

**Decision:**
Rendering component owns canvas setup, sprite asset loading/caching, draw(gameState) method that switches on game state to render the appropriate screen, and layered drawing (background, obstacles, player, UI).

**Consequences:**
- **Positive:** All visual presentation is cohesive in one component. Screen logic is centralized.
- **Positive:** Asset loading is owned by Rendering; no confusion about where sprites come from.
- **Positive:** Screen transitions (ready → game → end) are handled by a single component.
- **Negative:** Rendering component is larger than a pure-drawing component would be. However, it remains focused on visual concerns.

**Alternatives Rejected:**
- **Rendering as drawing-only:** Would require GameLoop or another component to manage assets and screen logic. Scatters visual concerns.

---

## ADR-007: Separate Input Component with Event Emission

**Context:**
Input handling (spacebar for flap, arrow keys for menu) is separate from game logic. Approaches: (1) GameLoop reads input directly, or (2) Input component emits events.

**Decision:**
Separate Input component captures keyboard events and emits onFlap() and onMenuNavigate() events. GameLoop and Audio listen to these events.

**Consequences:**
- **Positive:** Input logic is isolated and easily testable.
- **Positive:** Key bindings can be remapped or extended (controller support) without changing game logic.
- **Positive:** Event-driven input is extensible and decoupled.
- **Negative:** Adds a component; requires event subscription mechanism.

**Alternatives Rejected:**
- **GameLoop reads input directly:** Would couple game logic to keyboard API. Rebinding or adding controller support would require GameLoop changes.

---

## ADR-008: Separate Persistence Component Wrapping localStorage

**Context:**
High score must persist to browser localStorage (FR6.1—6.3). Approaches: (1) Scoring calls localStorage directly, or (2) Persistence component abstracts the API.

**Decision:**
Separate Persistence component provides a simple key-value API (save/load) wrapping browser localStorage. Scoring calls Persistence.save('high-score', value) and Persistence.load('high-score').

**Consequences:**
- **Positive:** Abstracts browser API, enabling future migration to IndexedDB, cloud storage, or other backends.
- **Positive:** Scoring is decoupled from localStorage specifics. Easy to test Scoring with a mock Persistence.
- **Positive:** Persistence is reusable for future features (settings, player progress).
- **Negative:** Adds a thin component. Overkill for a single key-value pair, but future-proofs the design.

**Alternatives Rejected:**
- **Scoring uses localStorage directly:** Would couple Scoring to a specific storage backend. Testing would require localStorage mocking. Future changes (cloud storage) would require Scoring changes.

---

## ADR-009: GameLoop Owns State Machine and Orchestration

**Context:**
Game has three states: ready (before play), playing (in progress), and ended (after collision). GameLoop must coordinate component updates each frame. Approaches: (1) GameLoop is a thin orchestrator, or (2) GameLoop owns state machine and orchestration.

**Decision:**
GameLoop owns the state machine (ready, playing, ended), frame timing via requestAnimationFrame, and orchestration sequencing: Input → Player → Physics → Obstacles → Scoring checks → Rendering. GameLoop handles state transitions.

**Consequences:**
- **Positive:** Game flow is centralized in one component, making the overall logic easy to follow.
- **Positive:** State transitions are atomic and coordinated by one component.
- **Positive:** Frame timing is owned by GameLoop, giving it natural authority over update sequencing.
- **Negative:** GameLoop is larger than a minimal orchestrator would be. However, it remains focused on game flow, not individual component logic.

**Alternatives Rejected:**
- **Thin orchestrator:** Would require state machine and transitions to live elsewhere. Scatters game flow logic.

---

## ADR-010: Entity Ownership — Player Owns Ghosty, Obstacles Owns Walls, Scoring Owns Score State

**Context:**
Flappy Kiro has three primary entities: Ghosty (player character), Walls (obstacles), and Score (game state). Clear ownership ensures no ambiguity or data duplication.

**Decision:**
- **Player component** owns Ghosty: position, velocity, bounds.
- **Obstacles component** owns Wall entities (multiple): position, gap geometry.
- **Scoring component** owns ScoreState: current score, high score.

Each entity has exactly one owning component and a clear identifier (singleton for Ghosty and ScoreState, auto-incremented ID for walls).

**Consequences:**
- **Positive:** No ambiguity about where entity state lives. Easy to reason about ownership.
- **Positive:** Entity lifecycle is tied to component lifecycle, reducing bugs from dangling references.
- **Positive:** Clear contract: other components query entities via their owning component's API.

**Alternatives Rejected:**
- **Shared entity dictionary:** Would create a "central database" owned by GameLoop. Violates component encapsulation; every component would depend on GameLoop.
- **Ambiguous ownership:** Would risk duplication, inconsistency, and bugs.

---

## Summary

The domain design establishes 9 components with clear boundaries, distinct responsibilities, and no circular dependencies. Each component is a unit of change — updating game flow, physics, visuals, audio, or scoring affects only the respective component. The architecture is testable, extensible, and well-suited for a browser game.

No significant trade-offs were made; the chosen decomposition is the natural one for Flappy Kiro's scope.
