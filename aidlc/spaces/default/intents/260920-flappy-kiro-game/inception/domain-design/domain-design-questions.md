# Domain Design Questions — Flappy Kiro

## Component Boundary Decisions

**Q1: How should we decompose the game into logical components?**

Given the requirements (game loop, player character, obstacles, scoring, persistence), what are the distinct building blocks with separate lifecycles and responsibilities?

[Answer]: Physics component handles movement and collision (changes when physics tuning is needed), Scoring component tracks points (changes when scoring rules change), Rendering component draws state (changes when visuals change). 

---

**Q2: What is the responsibility scope of a Physics component?**

Should physics (gravity, collision detection, impulse application) be a single component, or should we separate collision detection from motion physics?

[Answer]: Unified Physics component — handles movement (gravity, impulse, velocity), collision detection, and constraint enforcement together.

---

**Q3: Should audio be a separate component?**

Audio is optional and controllable (FR5.1-5.4). Does it warrant its own component, or should it be tightly coupled with the game core?

[Answer]: Separate Audio component — owns sound playback, mute state, and event subscriptions. Other components emit events; Audio listens and plays.

---

## Entity Ownership Decisions

**Q4: Which component owns the Player entity (Ghosty)?**

The player character has position, velocity, and collision bounds. Which component should own this entity and its lifecycle?

[Answer]: Separate Player component owns Ghosty's state (position, velocity, bounds). Player delegates physics simulation to Physics and rendering to Rendering.

---

**Q5: Which component owns the Wall/Obstacle entities?**

Walls are generated procedurally, have position and gap configuration, and may have a lifetime tied to the game session. Single owner, or split between generation and geometry?

[Answer]: Obstacles component owns all active walls, handles procedural generation, manages the active wall list, and provides collision geometry to Physics.

---

**Q6: Which component owns the Score entity?**

Score tracks current and high score. Should this be owned by the Game component, or does scoring warrant its own component?

[Answer]: Separate Scoring component owns both current and high score, exposes methods to increment and query. Rendering queries it for display; Persistence component handles save/load.

---

## Component Responsibilities

**Q7: What is the Game Loop component's exact scope?**

Should it own the timing and state machine (ready → playing → ended), or just orchestrate calls to other components?

[Answer]: GameLoop owns state machine (ready, playing, ended), frame timing, the update loop, and orchestration. It calls update on each component, handles state transitions, and coordinates collision/scoring checks.

---

**Q8: What should the Rendering component be responsible for?**

Should it only draw the current game state, or should it also handle visual asset loading and sprite management?

[Answer]: Rendering owns asset management — loads and caches sprites, sets up canvas, provides draw(gameState) method, and handles screen transitions (menu, game, game-over).

---

**Q9: Should Input Handling be a separate component?**

Or should keyboard input be read directly by the Game Loop or Player component?

[Answer]: Separate Input component owns all keyboard listeners, emits events like onFlap() and onMenuNavigate(). Other components subscribe to these events.

---

## Integration & External Dependencies

**Q10: Should local storage persistence be a separate component?**

Or should the Game component directly manage high-score persistence?

[Answer]: Separate Persistence component owns all localStorage interactions. Scoring calls Persistence.saveHighScore(score) and Persistence.loadHighScore(). Clean API, easy to mock/test, extensible for settings.

---

**Q11: What external dependencies does each component need?**

Which components depend on Canvas rendering, browser APIs, or external libraries?

[Answer]: Physics (none), Player (Physics), Obstacles (none), Scoring (Persistence), Persistence (localStorage API), Audio (Web Audio API), Rendering (Canvas API), Input (keyboard events API), GameLoop (requestAnimationFrame). No issues or surprising couplings identified.

---

## UI Component Structure

**Q12: How should the menu and UI screens be structured?**

Should the ready screen, end screen, and settings menu be part of the Game component, or separate UI components?

[Answer]: GameLoop owns game state (ready, playing, ended) and state transitions. Rendering draws based on GameLoop state. Rendering has methods like draw(gameState) that switch on state and render the appropriate screen.

---

## Validation & Completeness

Please review your answers above. 

- Are there any vague or ambiguous terms? (e.g., "handle graphics" vs. "draw sprites to canvas")
- Are responsibilities clearly assigned to exactly one component?
- Are cross-component interactions clear?
- Are all external dependencies (Canvas, localStorage, audio APIs) accounted for?

If you find any ambiguities or gaps, note them here and we'll resolve them before generating the component model:

[Answer]:

---


---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

[Answer]: Looks correct
