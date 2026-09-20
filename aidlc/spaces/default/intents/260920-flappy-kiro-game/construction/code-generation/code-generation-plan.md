# Code Generation Plan — Flappy Kiro Game (U1)

## Overview

This plan covers complete implementation of Flappy Kiro, a browser-based Flappy Bird-style arcade game. The game runs client-side with no backend services required, delivers as static HTML+JavaScript, and implements 9 core components:

1. **GameLoop** — orchestration and frame timing
2. **Player** — Ghosty entity lifecycle and state
3. **Physics** — gravity, impulse, collision detection
4. **Obstacles** — procedural wall generation and management
5. **Scoring** — point tracking and high-score persistence
6. **Rendering** — canvas drawing and screen state
7. **Audio** — sound effects and background music (graceful degradation)
8. **Input** — keyboard event handling and event emission
9. **Persistence** — localStorage abstraction for high-score persistence

**Scope**: MVP (feature-complete browser game)  
**Test Strategy**: Standard (5-8 tests per component, unit + integration tests)  
**Project Type**: Greenfield  
**Testing Methodology**: Test-after (implement layer, then test layer)  

---

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run",
  "scope": "flappy-kiro-game",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific methodology (TDD, BDD, ATDD, or classic test-after) is affirmed at practices-discovery and recorded in `team.md` under this heading with explicit `Methodology` and `Ordering` fields; Code Generation resolves those fields independently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per requirement, with a happy-path floor per component); existing tests remain green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test volume/types. Scope floors are additive; they never reduce or replace the selected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets; they may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:b64e7546d452ae5fc701023d9a807e5643cef91342e9bc8ab4b9dfc90ef1a695",
  "contract_sha256": "sha256:ebe9d56b9a57c4d5b2cd7d54130eec1f62d2968813a2d19af46eae186b3753c4"
}
```

---

## Implementation Steps

### Step 1: Project Structure and Build Configuration Skeleton
- [ ] Initialize workspace structure:
  - `src/` — production TypeScript/JavaScript code
  - `src/components/` — 9 component modules
  - `src/assets/` — sprite and audio assets
  - `dist/` — build output (bundled game.js, index.html)
  - `tests/` — unit and integration test files
- [ ] Create `package.json` with dependencies:
  - `typescript` — TypeScript compiler
  - `vite` or `esbuild` — bundler for static output
  - `vitest` — test runner
  - `@types/node` — TypeScript types
- [ ] Create `tsconfig.json` for TypeScript configuration
- [ ] Create `vite.config.ts` (or `esbuild` config) for bundling with asset embedding (base64 data URIs)
- [ ] Create `vitest.config.ts` for test runner configuration

### Step 2: Bootstrap Test Runner and Record Command
- [ ] Set up minimal Vitest configuration
- [ ] Create test bootstrap file (`tests/setup.ts`)
- [ ] Install test dependencies (`vitest`, `@vitest/ui` optional)
- [ ] Record exact unit-scoped test command: `npm run test:unit` (runs tests in `tests/` only, not workspace-wide)
  - Command must be scoped to this unit only and run before first test-after cycle

### Step 3: Entity/Data Model — Implement
- [ ] `src/components/types.ts` — TypeScript interfaces and types:
  - `Player` interface (x, y, vx, vy, width, height)
  - `Wall` interface (wallId, x, gapCenter, gapSize, width, height)
  - `GameState` enum (ready, playing, ended)
  - `CollisionInfo` interface (type, wallId, etc.)
  - `ScoreState` interface (currentScore, highScore)
- [ ] Asset definitions (sprite/audio identifiers)

### Step 4: Entity/Data Model — Write and Run Tests
- [ ] Unit tests for type safety and entity definitions
- [ ] `tests/types.test.ts` — verify types and interfaces
- [ ] Run: `npm run test:unit`

### Step 5: Repository/Data Access Layer — Implement
- [ ] `src/components/Persistence.ts`:
  - `load(key: string): any` — retrieve from localStorage
  - `save(key: string, value: any): void` — persist to localStorage
  - Error handling for quota exceeded / private mode
- [ ] `src/components/AssetLoader.ts`:
  - Asset registry (sprites and audio data URIs)
  - `getSprite(name): HTMLImageElement` — return cached sprite
  - `getAudio(name): AudioBuffer` — return cached audio

### Step 6: Repository/Data Access Layer — Write and Run Tests
- [ ] `tests/Persistence.test.ts`:
  - Test save/load cycle (5-8 tests)
  - Test JSON serialization
  - Test missing keys (returns null/default)
  - Test quota-exceeded graceful degradation
- [ ] `tests/AssetLoader.test.ts`:
  - Test asset registry and caching
- [ ] Run: `npm run test:unit`

### Step 7: Business Logic Layer — Implement
- [ ] `src/components/Physics.ts`:
  - `simulate(entity, deltaTime, obstacles, boundaries)` — gravity, impulse, collision detection
  - AABB collision checks
  - Boundary checks (ceiling, ground)
  - Return CollisionInfo
  - Accurate collision detection within one sprite width (per NFR3.1)
- [ ] `src/components/Scoring.ts`:
  - `addPoint()` — increment currentScore
  - `getHighScore()` — load from Persistence on init
  - `setHighScore(score)` — persist via Persistence
  - `onPointEarned()` — event emitter
- [ ] `src/components/Obstacles.ts`:
  - `update(deltaTime)` — advance walls, spawn new ones
  - `getWalls()` — return active walls
  - `removePassedWall(wallId)` — despawn off-screen
  - Randomized gap positioning within safe bounds
  - Gap size and spacing constants
- [ ] `src/components/Player.ts`:
  - Constructor initializes position, velocity
  - `flap()` — apply upward impulse
  - `update(deltaTime, physics)` — delegate to physics.simulate()
  - `getPosition()`, `getBounds()` — query methods

### Step 8: Business Logic Layer — Write and Run Tests
- [ ] `tests/Physics.test.ts` (7-8 tests):
  - Gravity accumulation over deltaTime
  - Impulse (flap) application and velocity change
  - AABB collision detection (wall hit, ceiling, ground)
  - Edge case: collision at boundary (tolerance ±sprite/2)
  - Edge case: rapid successive flaps
- [ ] `tests/Scoring.test.ts` (5-6 tests):
  - Point addition
  - High-score tracking and update
  - Persistence load/save integration
  - onPointEarned event emission
- [ ] `tests/Obstacles.test.ts` (6-7 tests):
  - Wall spawning at regular intervals
  - Gap randomization within bounds
  - Wall position updates
  - Off-screen wall removal
  - Gap geometry correctness
- [ ] `tests/Player.test.ts` (5-6 tests):
  - Initialization
  - Flap application
  - State queries
  - Physics delegation
- [ ] Run: `npm run test:unit`

### Step 9: API/Endpoint Layer — Implement
- [ ] `src/components/Input.ts`:
  - `init()` — attach window.keydown/keyup listeners
  - Poll keyboard state each frame
  - Emit `onFlap` event (spacebar in playing state)
  - Emit menu navigation events (arrow up/down, enter in ready/ended states)
  - `destroy()` — cleanup listeners
- [ ] `src/components/GameLoop.ts`:
  - Constructor takes canvas element
  - `init()` — initialize all components, attach event listeners
  - `update(deltaTime)` — orchestrate frame update (Input → Player → Physics → Obstacles → Scoring → Rendering)
  - State machine: ready → playing (on flap) → ended (on collision) → ready (on restart)
  - Call `Rendering.draw(gameState)` each frame
  - `destroy()` — cleanup and stop loop
  - Frame timing via requestAnimationFrame (adaptive 30–60 fps per NFR1.1, NFR1.2)
- [ ] `src/components/Audio.ts`:
  - `init()` — create AudioContext (graceful degradation if unavailable)
  - `playFlap()`, `playPoint()`, `playCollision()` — play sound effects
  - `playBackgroundMusic()` — loop background music in playing state
  - `stopMusic()` — stop on game end
  - `setMuted(bool)` — toggle mute (persist via Persistence)
  - Web Audio API setup with graceful fallback

### Step 10: API/Endpoint Layer — Write and Run Tests
- [ ] `tests/Input.test.ts` (5-6 tests):
  - Keyboard event capture
  - Spacebar triggers flap in playing state only
  - Arrow keys and enter in menu states
  - Event emission verification
- [ ] `tests/GameLoop.test.ts` (6-7 tests):
  - Initialization and component setup
  - State machine transitions (ready → playing → ended)
  - Frame update sequencing
  - Collision detection integration
  - Scoring integration
  - Frame timing accuracy (adaptive frame rate)
- [ ] `tests/Audio.test.ts` (4-5 tests):
  - Web Audio API graceful degradation
  - Sound effect playback (muted/unmuted)
  - Background music lifecycle
  - Mute state persistence
- [ ] Run: `npm run test:unit`

### Step 11: Frontend/Rendering Layer — Implement
- [ ] `src/components/Rendering.ts`:
  - Constructor takes canvas element
  - `init()` — load sprites via AssetLoader
  - `draw(gameState)` — render current state:
    - Ready screen: title, instructions
    - Playing screen: Ghosty, walls, score, background
    - Ended screen: final score, high score, menu options
  - Layered drawing: background → obstacles → player → UI → score
  - Responsive canvas scaling (maintain 16:9 aspect ratio, 1280×720 logical resolution)
  - Handle window resize

### Step 12: Frontend/Rendering Layer — Write and Run Tests
- [ ] `tests/Rendering.test.ts` (5-6 tests):
  - Canvas element setup
  - Sprite loading and caching
  - Screen rendering per game state (ready, playing, ended)
  - Canvas scaling and aspect ratio maintenance
  - Z-order correctness (layering)
- [ ] Integration test `tests/GameLoop.integration.test.ts` (3-4 tests):
  - Full game loop: ready → playing → collision → ended
  - Input triggers actions
  - Scoring updates reflect in rendered output
  - Canvas rendering with all components
- [ ] Run: `npm run test:unit`

### Step 13: Build Configuration and Asset Embedding
- [ ] Create build script in `package.json`: `build` target
  - Bundle all components into single `dist/game.js`
  - Embed sprite and audio assets as base64 data URIs
  - Minify output
  - Target bundle size < 500 KB (gzipped per contract)
- [ ] Create `dist/index.html`:
  - Minimal HTML5 page
  - Single `<canvas id="gameCanvas">` element
  - Load `<script src="game.js">` tag
  - Viewport meta for responsive scaling
  - Global `Game` object with `init(canvasElement)` and `destroy()` methods
- [ ] Create entry point `src/index.ts`:
  - Export `Game` object
  - `Game.init(canvasElement)` — create GameLoop and start
  - `Game.destroy()` — cleanup

### Step 14: Documentation and Traceability
- [ ] Create `ARCHITECTURE.md` in project root:
  - 9-component overview
  - Component responsibilities and dependencies
  - Data flow diagram (text or ASCII art)
  - Integration points and contracts
- [ ] Create `API.md`:
  - Public `Game` object API (`init`, `destroy`)
  - Contract: canvas element ID, global `Game` namespace
  - Deployment: static HTML+JS hosting
  - Browser compatibility (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- [ ] Create `TESTING.md`:
  - Test command: `npm run test:unit`
  - Coverage target: 80% line coverage (per MVP scope floor)
  - Test organization: unit tests per component, integration tests for key boundaries
  - Running tests during development

---

## Test Coverage Summary

| Component | Test Count | Coverage Target |
|-----------|-----------|-----------------|
| Physics | 7-8 | Gravity, impulse, collision logic (critical path) |
| Scoring | 5-6 | Point addition, high-score persistence |
| Obstacles | 6-7 | Spawning, randomization, despawning |
| Player | 5-6 | Flap, position, bounds queries |
| Input | 5-6 | Keyboard event handling |
| GameLoop | 6-7 | State machine, update sequencing, frame timing |
| Audio | 4-5 | Graceful degradation, mute state |
| Rendering | 5-6 | Screen drawing, scaling, layering |
| **Integration** | 3-4 | Full game loop, input→action→render |
| **Total** | **47-55 tests** | ~80% line coverage (MVP floor) |

---

## Quality Targets

- **Frame Rate**: Minimum 30 fps on standard desktop browsers (per NFR1.1); target 60 fps (per NFR1.2)
- **Input Latency**: Spacebar press to Ghosty response < 50ms (per NFR1.3)
- **Collision Detection**: Accurate within one sprite width (per NFR3.1, NFR3.2, NFR3.3)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (per NFR2.1, NFR2.2)
- **Code Quality**: No console errors or exceptions during normal gameplay (per NFR4.1, NFR4.2)
- **Test Coverage**: 80% line coverage (per MVP scope floor)
- **Memory**: No memory leaks during extended play sessions (per NFR4.3)

---

## Dependencies

- **Browser APIs** (all built-in, no external libraries required):
  - Canvas 2D Context
  - requestAnimationFrame
  - Web Audio API
  - localStorage
  - Keyboard events (keydown, keyup)
- **Build Tools**:
  - Node.js 16+
  - npm or yarn
  - TypeScript
  - Vite or esbuild
  - Vitest

---

## Implementation Notes

1. **Asset Embedding**: All sprites and audio are embedded as base64 data URIs in the bundled `game.js` to enable static-file deployment with no external asset requests.

2. **Graceful Degradation**: Audio playback fails gracefully if Web Audio API is unavailable; game remains playable without sound.

3. **Responsive Scaling**: Canvas maintains 16:9 aspect ratio (1280×720 logical) and scales to fill viewport; letterboxing applied on non-16:9 displays.

4. **No External Services**: All game logic runs client-side; no backend required.

5. **localStorage Handling**: High score and mute state persisted locally; gracefully degrades if localStorage unavailable (e.g., private mode).

6. **Physics Accuracy**: All motion uses delta-time to ensure frame-rate-independent physics.

---

## Traceability to Requirements

| Requirement | Step(s) | Component |
|-----------|---------|-----------|
| FR1 (Game mechanics) | 3, 7, 9, 10 | Player, Physics, GameLoop |
| FR2 (Obstacles) | 3, 7, 8 | Obstacles, Physics |
| FR3 (Scoring) | 3, 7, 8 | Scoring, GameLoop |
| FR4 (Gameplay flow) | 9, 10, 13 | GameLoop, Input, Rendering |
| FR5 (Audio) | 9, 10 | Audio |
| FR6 (Persistence) | 5, 6 | Persistence, Scoring |
| NFR1 (Performance) | 1, 2, 9, 10, 13 | GameLoop, Rendering (60 fps target) |
| NFR2 (Compatibility) | 1, 9, 13 | All (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) |
| NFR3 (Collision) | 7, 8 | Physics |
| NFR4 (Stability) | All | All (no unhandled exceptions) |
| NFR5 (Playability) | 11, 12 | Rendering, Input (clear UI, responsive controls) |
| NFR6 (Visual) | 11, 12 | Rendering (1920×1080 target, clear graphics) |

---

## Approval Fingerprint

Once human approves this plan, the following fingerprints bind the plan, unit test instructions, and testing contract to this code generation attempt. Do not proceed with generation until both are recorded:

```
[Approval Fingerprint]: <to be generated>
[Planned Source]: <to be generated>
```

---

## Review

This plan implements the complete Flappy Kiro game as specified in Requirements and Contract Design, following the Standard test strategy with 80% line-coverage floor (MVP scope). All 9 components are covered, with test-after methodology and 47-55 unit/integration tests across all layers. The implementation targets 30–60 fps frame rate, responsive canvas rendering, graceful audio degradation, and localStorage persistence. Generated code will bundle to a single static `game.js` file suitable for immediate browser deployment.
