# Flappy Kiro — Requirements

## Intent Analysis

Flappy Kiro is a workshop project designed to demonstrate and validate the AI-DLC methodology through a concrete, hands-on example. The primary goal is to build a polished, playable arcade game that implements the familiar Flappy Bird mechanics (player-controlled character navigating through procedurally-placed obstacles). The secondary goal is to produce exemplar artifacts (intent statements, requirements, design specs, code) that serve as a reference implementation for structured, agent-driven development.

**Success Criteria:**
- Playable game with core Flappy Bird mechanics working reliably
- Meets measurable quality targets (≥30 fps frame rate)
- Complete end-to-end workflow demonstration through ideation, design, and construction phases
- Artifacts that exemplify structured development practices

---

## Functional Requirements

### FR1. Game Core Mechanics

The game implements the basic Flappy Bird-style arcade mechanic:

- **FR1.1**: Ghosty (the player character) spawns at a consistent starting position and moves persistently to the right at a constant velocity (no acceleration or deceleration on the horizontal axis)
- **FR1.2**: Gravity acts on Ghosty at a constant rate, causing vertical descent when no input is provided
- **FR1.3**: Player presses the spacebar to apply an upward impulse to Ghosty, counteracting gravity and causing ascent
- **FR1.4**: Ghosty is constrained by world boundaries: top boundary (ceiling) and bottom boundary (ground)
- **FR1.5**: Collision with the ceiling ends the game immediately
- **FR1.6**: Collision with the ground ends the game immediately

### FR2. Obstacles

The game presents a series of randomly-placed wall obstacles:

- **FR2.1**: Walls appear at regular horizontal intervals as the game progresses
- **FR2.2**: Each wall consists of two vertical segments with an equally-sized gap between them
- **FR2.3**: The gap position is randomized vertically within valid bounds (not touching top or bottom boundary)
- **FR2.4**: Gap size is consistent across all walls in a single playthrough
- **FR2.5**: Ghosty must pass through the gap without colliding with either wall segment
- **FR2.6**: Collision with any wall segment ends the game immediately

### FR3. Scoring

Players earn points for navigating obstacles:

- **FR3.1**: One point is awarded when Ghosty successfully passes completely through a wall gap
- **FR3.2**: Points are displayed during gameplay
- **FR3.3**: Final score is displayed when the game ends
- **FR3.4**: High score (maximum score achieved) is tracked and displayed on the game-end screen

### FR4. Gameplay Flow

The game follows a clear play/end/menu cycle:

- **FR4.1**: Game starts in an initial ready state (not playing yet)
- **FR4.2**: Player can begin the game (spacebar input or menu button)
- **FR4.3**: Game runs continuously until a collision ends it
- **FR4.4**: When the game ends, the end screen displays: final score, high score, and menu options
- **FR4.5**: Menu options include: "Play Again" (restart), "Settings", "Quit/Back"

### FR5. Sound & Accessibility

Audio is optional and user-controllable:

- **FR5.1**: Sound effects play on events: spacebar input (flap), successful passage (point), collision (game over)
- **FR5.2**: Background music plays during gameplay
- **FR5.3**: Player can toggle sound on/off from the settings menu
- **FR5.4**: Game state and progress are not affected by audio settings

### FR6. Persistence

Player state persists within browser:

- **FR6.1**: High score is saved to browser local storage
- **FR6.2**: High score persists across page refreshes and browser sessions (until local storage is cleared)
- **FR6.3**: High score is loaded when the game initializes

---

## Non-Functional Requirements

### NFR1. Performance

- **NFR1.1**: Game runs at a minimum of 30 frames per second (30 fps) on standard desktop browsers
- **NFR1.2**: Frame rate should target 60 fps where achievable without compromising feature completion
- **NFR1.3**: Input latency (spacebar press to Ghosty response) must be imperceptible (<50ms)

### NFR2. Compatibility

- **NFR2.1**: Game runs in all modern desktop web browsers (Chrome, Firefox, Safari, Edge)
- **NFR2.2**: No external backend required (all game logic runs client-side in the browser)
- **NFR2.3**: Game works without network connectivity (offline playable)

### NFR3. Collision Detection

- **NFR3.1**: Collision detection is accurate within one sprite width (±tolerance of one-half sprite width maximum)
- **NFR3.2**: No false negatives (game should never fail to detect a collision that visually appears to occur)
- **NFR3.3**: Collisions are reported immediately when they occur

### NFR4. Stability & Reliability

- **NFR4.1**: Game does not crash or throw unhandled exceptions during normal gameplay
- **NFR4.2**: Game recovers gracefully from edge cases (rapid spacebar input, extreme ghost positions, etc.)
- **NFR4.3**: No memory leaks during extended play sessions (multiple rounds)

### NFR5. Playability

- **NFR5.1**: A first-time player can understand the controls and objective within the first 30 seconds of play
- **NFR5.2**: Controls are responsive and feel natural (spacebar for ascent)
- **NFR5.3**: Game difficulty is consistent (not random difficulty spikes)

### NFR6. Visual Presentation

- **NFR6.1**: Game renders at 1920×1080 resolution (standard desktop landscape)
- **NFR6.2**: Graphics are clear and readable
- **NFR6.3**: Ghosty sprite and obstacles are visually distinct from the background
- **NFR6.4**: Score and high-score displays are always visible during gameplay

---

## Constraints

- **C1**: Game must be web-based (runs in a browser)
- **C2**: Keyboard input only (spacebar); no mouse or touch controls required
- **C3**: No backend services required (single-file or simple static-serve deployment)
- **C4**: No user authentication or account system
- **C5**: All data is ephemeral except high score (which is local to the browser)

---

## Assumptions

- **A1**: The player is familiar with Flappy Bird or similar arcade games
- **A2**: Target player has a keyboard available
- **A3**: Desktop display is the primary form factor (1920×1080 or larger)
- **A4**: Browser local storage is available and not disabled
- **A5**: All gameplay timings (gravity, impulse, scroll speed) will be tuned during development to feel "fair" and fun

---

## Out of Scope

- Mobile touch controls (keyboard only)
- Multiplayer or network play
- User accounts or leaderboards
- Difficulty levels or game modes
- Power-ups or special items
- Advanced graphics (animations, particle effects, or 3D rendering beyond requirement)
- Story, narrative, or character dialogue
- Accessibility features beyond optional sound toggle (e.g., screen reader support, colorblind modes)

---

## Open Questions

- **Q1**: What visual style and color scheme should be used? (e.g., retro pixel art, flat modern, themed around Halloween/ghosts)
- **Q2**: What should be the exact scroll speed and gravity values? (Will be tuned for playability during design phase)
- **Q3**: Should there be a "pause" button during gameplay?
- **Q4**: What should the menu options beyond "Play Again" contain? (Settings for sound is confirmed; what else?)

---

## Traceability

| Source | Requirement | Details |
|--------|-------------|---------|
| Intent Statement | Problem | Workshop demonstration of AI-DLC |
| Q1–Q8 | Platform | Web browser, desktop, keyboard |
| Q3 | Top-Boundary | Collision ends game |
| Q4 | Quality Metrics | ≥30 fps minimum |
| Q5 | Difficulty | Constant throughout |
| Q6 | Persistence | Browser local storage |
| Q7 | Menu | Final score + high score display |
| Q8 | Audio | Optional, toggle-able |
