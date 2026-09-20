# Integration Test Instructions — Flappy Kiro Game

## Overview

This document specifies cross-unit integration tests for Flappy Kiro Game. Integration tests validate interactions between multiple components and the end-to-end gameplay flow.

**Test Strategy:** Standard (5–8 tests per component + 3–4 integration tests)

**Integration Test Framework:** Vitest with jsdom environment

**Total Integration Tests:** 3–4 tests covering key workflows

---

## Integration Test Scope

Integration tests validate:

1. **Gameplay flow** — Ready → Playing → Ended state transitions
2. **Component interactions** — Physics × Input → Player movement
3. **Physics × Obstacles** — Collision detection and game end
4. **Scoring × Persistence** — Score updates and high-score save
5. **Audio × Game state** — Sound effects correlate with game events
6. **Full game loop** — One complete game cycle (start to game-over)

### Out of Scope (Unit Tests Only)

- Individual component behavior (covered by unit tests)
- Visual rendering accuracy (covered by rendering unit tests)
- Canvas pixel-perfect output (not testable in jsdom)
- Browser compatibility (manual testing required)

---

## Setup & Configuration

### Test Environment

Integration tests run in `jsdom` (simulated DOM) with mocked:
- Web Audio API (graceful degradation)
- Canvas 2D API (verified without pixel output)
- localStorage (in-memory mock)
- requestAnimationFrame (controlled timing)

### Fixtures & Utilities

All mocks are located in `tests/fixtures/`:

- **`mockAudio.js`** — Mocked Web Audio API
- **`mockCanvas.js`** — Mocked Canvas 2D context
- **`testData.js`** — Constant test values (gravity, velocities, positions)

---

## Integration Test Scenarios

### Test 1: Game Ready → Playing → Ended

**File:** `tests/integration.test.js`

**Purpose:** Validate complete game state machine

**Setup:**
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { GameLoop } from '../src/GameLoop'
import { Input } from '../src/Input'
import { Rendering } from '../src/Rendering'

describe('Game State Flow (Ready → Playing → Ended)', () => {
  let gameLoop, input, canvas

  beforeEach(() => {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    
    gameLoop = new GameLoop(canvas)
    input = new Input()
  })
})
```

**Test Steps:**

1. **Initial state is Ready:**
   ```javascript
   it('should start in Ready state', () => {
     expect(gameLoop.getState()).toBe('ready')
   })
   ```

2. **Spacebar triggers transition to Playing:**
   ```javascript
   it('should transition to Playing when spacebar pressed', () => {
     input.emit('flap')
     gameLoop.update()
     expect(gameLoop.getState()).toBe('playing')
   })
   ```

3. **Game collision ends game and transitions to Ended:**
   ```javascript
   it('should end game when collision detected', () => {
     // Manually set player position to floor boundary
     gameLoop.player.setPosition(100, gameLoop.worldHeight - 10)
     gameLoop.update()
     
     expect(gameLoop.getState()).toBe('ended')
     expect(gameLoop.getFinalScore()).toBeGreaterThan(0)
   })
   ```

4. **End state displays final score and high score:**
   ```javascript
   it('should display end screen with scores', () => {
     // Move to ended state
     gameLoop.setState('ended')
     gameLoop.setFinalScore(50)
     
     const rendered = Rendering.renderEnded(gameLoop.getFinalScore(), gameLoop.getHighScore())
     
     expect(rendered).toBeDefined()
     // Verify rendering called without throwing
   })
   ```

**Expected Coverage:** Ready → Playing, Playing → Ended, score capture

---

### Test 2: Player Physics × Input × Collision

**Purpose:** Validate physics response to input and collision boundaries

**Test Steps:**

1. **Spacebar input applies upward impulse:**
   ```javascript
   it('should apply upward impulse on spacebar press', () => {
     const player = new Player(100, 300)
     const physics = new Physics()
     physics.setVelocity(0, 0)
     
     input.emit('flap')
     const beforeVelocity = physics.getVelocityY()
     physics.applyImpulse() // Flap effect
     const afterVelocity = physics.getVelocityY()
     
     expect(afterVelocity).toBeLessThan(beforeVelocity) // More negative = upward
   })
   ```

2. **Gravity continuously acts on player:**
   ```javascript
   it('should apply gravity every frame', () => {
     const physics = new Physics()
     physics.setVelocity(0, 0)
     physics.setPosition(100, 300)
     
     const initialY = physics.getPositionY()
     physics.update(100) // 100ms
     const newY = physics.getPositionY()
     
     expect(newY).toBeGreaterThan(initialY) // Moved down
   })
   ```

3. **Ceiling collision triggers game end:**
   ```javascript
   it('should detect collision with ceiling', () => {
     const player = new Player(100, 10) // Near top
     expect(gameLoop.checkCollision(player)).toBe(true)
     expect(gameLoop.getState()).toBe('ended')
   })
   ```

4. **Ground collision triggers game end:**
   ```javascript
   it('should detect collision with ground', () => {
     const player = new Player(100, worldHeight - 10) // Near bottom
     expect(gameLoop.checkCollision(player)).toBe(true)
     expect(gameLoop.getState()).toBe('ended')
   })
   ```

**Expected Coverage:** Input → Physics → Collision detection → Game end

---

### Test 3: Obstacles × Collision × Scoring

**Purpose:** Validate obstacle generation, collision, and score award

**Test Steps:**

1. **Walls spawn at regular intervals:**
   ```javascript
   it('should spawn walls at regular intervals', () => {
     const initialWallCount = gameLoop.obstacles.getWallCount()
     
     // Simulate 200 frames (approx 3.3 seconds at 60fps)
     for (let i = 0; i < 200; i++) {
       gameLoop.update()
     }
     
     const finalWallCount = gameLoop.obstacles.getWallCount()
     expect(finalWallCount).toBeGreaterThan(initialWallCount)
   })
   ```

2. **Gap position is within valid bounds:**
   ```javascript
   it('should spawn walls with valid gap positions', () => {
     const walls = gameLoop.obstacles.getAllWalls()
     
     walls.forEach(wall => {
       const gapY = wall.gapPositionY
       expect(gapY).toBeGreaterThanOrEqual(100) // Top margin
       expect(gapY).toBeLessThanOrEqual(600) // Bottom margin
     })
   })
   ```

3. **Passing through gap awards point:**
   ```javascript
   it('should award one point when passing through gap', () => {
     const initialScore = gameLoop.scoring.getCurrentScore()
     
     // Set player at gap position
     gameLoop.player.setPosition(500, gameLoop.getGapPosition())
     gameLoop.obstacles.update()
     gameLoop.scoring.update(gameLoop.player, gameLoop.obstacles)
     
     const newScore = gameLoop.scoring.getCurrentScore()
     expect(newScore).toBe(initialScore + 1)
   })
   ```

4. **Wall collision triggers game end:**
   ```javascript
   it('should end game on wall collision', () => {
     // Move player into wall
     gameLoop.player.setPosition(500, 50) // Position that hits wall
     const collision = gameLoop.physics.checkWallCollision(
       gameLoop.player,
       gameLoop.obstacles
     )
     
     expect(collision).toBe(true)
     expect(gameLoop.getState()).toBe('ended')
   })
   ```

**Expected Coverage:** Obstacle generation → Gap detection → Score award → Collision

---

### Test 4: Persistence × Scoring

**Purpose:** Validate high-score persistence across game sessions

**Test Steps:**

1. **High score saved after game ends:**
   ```javascript
   it('should save high score on game end', () => {
     gameLoop.setFinalScore(150)
     gameLoop.setState('ended')
     
     const savedScore = Persistence.getHighScore()
     expect(savedScore).toBeGreaterThanOrEqual(150)
   })
   ```

2. **High score persists when game restarts:**
   ```javascript
   it('should load high score on new game', () => {
     // Set high score
     Persistence.setHighScore(200)
     
     // Create new game instance
     const newGame = new GameLoop(canvas)
     const loaded = newGame.getHighScore()
     
     expect(loaded).toBe(200)
   })
   ```

3. **High score not overwritten by lower score:**
   ```javascript
   it('should not overwrite high score with lower score', () => {
     Persistence.setHighScore(300)
     gameLoop.setFinalScore(150)
     gameLoop.setState('ended')
     
     const saved = Persistence.getHighScore()
     expect(saved).toBe(300)
   })
   ```

4. **Multiple game sessions maintain history:**
   ```javascript
   it('should maintain high score across multiple sessions', () => {
     // Session 1: Score 100
     gameLoop.setFinalScore(100)
     gameLoop.setState('ended')
     let high1 = Persistence.getHighScore()
     
     // Session 2: Score 200
     gameLoop = new GameLoop(canvas) // Reset game
     gameLoop.setFinalScore(200)
     gameLoop.setState('ended')
     let high2 = Persistence.getHighScore()
     
     // Session 3: Score 150 (should not overwrite)
     gameLoop = new GameLoop(canvas)
     gameLoop.setFinalScore(150)
     gameLoop.setState('ended')
     let high3 = Persistence.getHighScore()
     
     expect(high1).toBe(100)
     expect(high2).toBe(200)
     expect(high3).toBe(200) // Still 200, not overwritten by 150
   })
   ```

**Expected Coverage:** Score persistence, high-score logic

---

## Test Execution Commands

### Run All Integration Tests

```bash
npm test tests/integration.test.js
```

**Expected output:**
```
✓ tests/integration.test.js (12 tests)
  ✓ Game State Flow (Ready → Playing → Ended)
    ✓ should start in Ready state
    ✓ should transition to Playing on spacebar
    ✓ should end game on collision
    ✓ should display end screen
  ✓ Physics × Input × Collision
    ✓ should apply upward impulse on flap
    ✓ should apply gravity continuously
    ✓ should detect ceiling collision
    ✓ should detect ground collision
  ✓ Obstacles × Collision × Scoring
    ✓ should spawn walls at intervals
    ✓ should spawn with valid gap position
    ✓ should award point on gap passage
    ✓ should end game on wall collision
  ✓ Persistence × Scoring
    ✓ should save high score on end
    ✓ should load high score on init
    ✓ should not overwrite with lower score
    ✓ should maintain across sessions

Test Files  1 passed (1)
     Tests  16 passed (16)
Duration   1.5s
```

### Run Integration Tests with Coverage

```bash
npm run test:coverage -- tests/integration.test.js
```

### Run Integration Tests in Watch Mode

```bash
npm run test:unit:watch -- tests/integration.test.js
```

---

## Coverage Targets for Integration Tests

Integration tests validate:

| Component | Coverage |
|-----------|----------|
| GameLoop state machine | ≥90% (critical orchestration) |
| Physics × Input interactions | ≥85% |
| Obstacles × Collision | ≥85% |
| Scoring × Persistence | ≥80% |
| **Total Integration** | ≥3–4 tests covering all workflows |

---

## Debugging Failed Integration Tests

### Verbose Output

```bash
npm test -- --reporter=verbose tests/integration.test.js
```

### Run Single Test

```bash
npm test -- --grep "should transition to Playing"
```

### Interactive Test UI

```bash
npm run test:ui
```

Then select `tests/integration.test.js` and click on specific tests to debug.

---

## Manual Smoke Testing (Outside Vitest)

After integration tests pass, perform manual smoke testing in a real browser:

1. **Open game in browser:**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

2. **Test scenarios:**
   - [ ] Press spacebar: Ghosty flaps and ascends
   - [ ] Release spacebar: Ghosty descends due to gravity
   - [ ] Rapid spacebar: Multiple flaps work correctly
   - [ ] Pass through wall gap: Score increases (point sound plays)
   - [ ] Hit wall: Game ends, end screen shows score and high score
   - [ ] Hit ceiling: Game ends
   - [ ] Hit ground: Game ends
   - [ ] Play again: Game restarts with score reset to 0, but high score preserved
   - [ ] Toggle sound: Audio mutes/unmutes without affecting gameplay

---

## Continuous Integration Integration

### GitHub Actions CI Configuration

Add to `.github/workflows/build-test.yml`:

```yaml
- name: Run integration tests
  run: npm test tests/integration.test.js
  
- name: Generate coverage
  run: npm run test:coverage -- tests/integration.test.js
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

---

## Summary

**Integration Test Command:** `npm test tests/integration.test.js`

**Test Count:** 3–4 scenarios covering ~12–16 individual test cases

**Coverage Target:** ≥85% for critical paths (state machine, physics, collisions, scoring)

**Expected Duration:** ~1–2 seconds

**Key Workflows Validated:**
1. Ready → Playing → Ended state machine
2. Input physics applied correctly
3. Collision detection and game end
4. Obstacle generation and scoring
5. Persistence of high score

**Next Steps:** Execute build and unit tests (see test-results.md)
