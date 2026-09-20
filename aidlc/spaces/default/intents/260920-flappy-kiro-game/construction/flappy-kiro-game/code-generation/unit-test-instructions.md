# Unit Test Instructions — Flappy Kiro Game (U1)

## Overview

This document specifies how to run, configure, and validate tests for the **Flappy Kiro Game** unit (U1). All tests are scoped to this unit only using exact test file paths or unit-specific filters.

---

## Test Framework Setup

### Framework: Vitest (recommended)

Vitest is a unit test framework for JavaScript/TypeScript with fast execution, built-in coverage, and excellent TypeScript support.

### Installation

```bash
npm install --save-dev vitest @vitest/ui vitest-environment-jsdom
npm install --save-dev @types/node
```

### Configuration File: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/index.ts', // Entry point, integration tested separately
      ],
    },
  },
})
```

### Test Script in `package.json`

```json
{
  "scripts": {
    "test": "vitest run --coverage",
    "test:watch": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## Unit-Scoped Test Execution

### Run All Tests for This Unit

```bash
npm run test
```

This command:
- Executes all `.test.ts` and `.spec.ts` files in `src/`
- Generates coverage report (HTML in `coverage/`)
- Enforces minimum 80% line coverage
- Exits with non-zero status if coverage threshold not met
- Fails if any test fails

### Expected Output

```
✓ src/Input.test.ts (4 tests)
✓ src/Persistence.test.ts (4 tests)
✓ src/Physics.test.ts (6 tests)
✓ src/Scoring.test.ts (4 tests)
✓ src/Audio.test.ts (5 tests)
✓ src/Rendering.test.ts (5 tests)
✓ src/Obstacles.test.ts (5 tests)
✓ src/Player.test.ts (4 tests)
✓ src/GameLoop.test.ts (6 tests)
✓ tests/integration.test.ts (3 tests)

Test Files  10 passed (10)
     Tests  46 passed (46)
Start at   19:30:45
Duration   2.31s

---------- Coverage summary -----------
Statements   : 85.2% ( 520/610 )
Branches     : 82.1% ( 147/179 )
Functions    : 86.5% ( 84/97 )
Lines        : 84.8% ( 518/610 )
```

### Run Tests in Watch Mode (Development)

```bash
npm run test:watch
```

This command:
- Runs tests in watch mode (re-runs on file change)
- Useful during development for rapid feedback
- Shows live coverage updates

### Run Specific Test File

```bash
npm test src/Physics.test.ts
```

Run tests from a single component (e.g., only Physics tests).

### Run Tests Matching a Pattern

```bash
npm test -- --grep "collision"
```

Run all tests whose name contains "collision" (case-insensitive).

### View Coverage Report

After running `npm run test`, open the HTML report:

```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

---

## Test Coverage Targets

### Minimum Coverage Requirements

- **Lines:** 80% (80% of all executable lines covered by tests)
- **Branches:** 80% (80% of conditional branches covered)
- **Functions:** 80% (80% of all functions called by tests)
- **Statements:** 80% (80% of all statements executed)

### Components & Expected Test Counts

**Standard test strategy for greenfield Flappy Kiro scope:**

| Component | Type | Tests | Coverage Target |
|-----------|------|-------|-----------------|
| Input | Business Logic | 4–5 | ≥ 80% |
| Persistence | Data Access | 4–5 | ≥ 80% |
| Physics | Business Logic | 6–8 | ≥ 85% (critical) |
| Scoring | Business Logic | 4–5 | ≥ 80% |
| Audio | Business Logic | 5–6 | ≥ 80% |
| Rendering | Frontend | 5–6 | ≥ 75% (visual) |
| Obstacles | Business Logic | 5–6 | ≥ 80% |
| Player | Frontend/Logic | 4–5 | ≥ 85% (critical) |
| GameLoop | Orchestration | 6–8 | ≥ 85% (critical) |
| Integration | End-to-End | 3–4 | ≥ N/A (validates flow) |

**Total:** 46–52 tests across all components

---

## Test File Organization

### Directory Structure

```
src/
  Input.ts
  Input.test.ts
  Persistence.ts
  Persistence.test.ts
  Physics.ts
  Physics.test.ts
  Scoring.ts
  Scoring.test.ts
  Audio.ts
  Audio.test.ts
  Rendering.ts
  Rendering.test.ts
  Obstacles.ts
  Obstacles.test.ts
  Player.ts
  Player.test.ts
  GameLoop.ts
  GameLoop.test.ts
  index.ts

tests/
  integration.test.ts
```

### Test File Naming Convention

Each source file `Component.ts` has a corresponding test file `Component.test.ts` in the same directory. Integration tests are in `tests/integration.test.ts`.

---

## Mocking & Test Utilities

### Mocking Web Audio API

Since tests run in jsdom (a simulated DOM environment without real audio), the Web Audio API is mocked:

```typescript
// In src/Audio.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Audio } from './Audio'

describe('Audio', () => {
  beforeEach(() => {
    // Mock AudioContext
    global.AudioContext = vi.fn(() => ({
      createBufferSource: vi.fn(),
      createGain: vi.fn(),
      destination: {},
      createOscillator: vi.fn(),
    }))
  })

  it('should initialize without throwing when AudioContext is available', () => {
    expect(() => Audio.init()).not.toThrow()
  })

  it('should gracefully degrade when AudioContext is unavailable', () => {
    global.AudioContext = undefined
    expect(() => Audio.init()).not.toThrow()
    // Audio should silently disable
  })
})
```

### Mocking Canvas API

Canvas rendering is tested by verifying that the rendering methods are called without errors, not by validating pixel output:

```typescript
// In src/Rendering.test.ts
describe('Rendering', () => {
  let canvasElement: HTMLCanvasElement

  beforeEach(() => {
    canvasElement = document.createElement('canvas')
    canvasElement.id = 'gameCanvas'
    document.body.appendChild(canvasElement)
  })

  afterEach(() => {
    document.body.removeChild(canvasElement)
  })

  it('should render the ready state without throwing', () => {
    expect(() => Rendering.renderReady()).not.toThrow()
  })
})
```

### Mocking localStorage

localStorage is mocked for tests to avoid state pollution between test runs:

```typescript
// In src/Persistence.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('Persistence', () => {
  it('should save and retrieve high score from localStorage', () => {
    Persistence.setHighScore(100)
    expect(Persistence.getHighScore()).toBe(100)
  })

  it('should return default value when key is missing', () => {
    expect(Persistence.getHighScore()).toBe(0)
  })

  it('should handle localStorage quota exceeded gracefully', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => Persistence.setHighScore(100)).not.toThrow()
  })
})
```

---

## Test Data Management

### Static Test Data

For physics tests, use fixed values:

```typescript
// In src/Physics.test.ts
const TEST_GRAVITY = 300 // px/s²
const TEST_IMPULSE = -400 // px/s (upward)
const TEST_INITIAL_Y = 200 // px

describe('Physics', () => {
  it('should apply gravity correctly over 1 second', () => {
    const physics = new Physics(TEST_GRAVITY, TEST_IMPULSE)
    physics.setPosition(0, TEST_INITIAL_Y)
    physics.update(1000) // 1 second

    expect(physics.getVelocityY()).toBeCloseTo(TEST_GRAVITY, 1)
    expect(physics.getPositionY()).toBeCloseTo(
      TEST_INITIAL_Y + (TEST_GRAVITY * 1000) / 2,
      1
    )
  })
})
```

### Random Data (Obstacles)

For obstacle tests, seed random number generation or use deterministic test sequences:

```typescript
// In src/Obstacles.test.ts
describe('Obstacles', () => {
  it('should spawn walls with gap positions within valid bounds', () => {
    const minGapY = 100 // Top boundary + margin
    const maxGapY = 600 // Bottom boundary - gap size - margin

    for (let i = 0; i < 100; i++) {
      const wall = Obstacles.spawnWall()
      expect(wall.gapPositionY).toBeGreaterThanOrEqual(minGapY)
      expect(wall.gapPositionY).toBeLessThanOrEqual(maxGapY)
    }
  })
})
```

---

## Performance & Timing Tests

### Delta-Time Accuracy

Physics tests must validate delta-time handling:

```typescript
// In src/Physics.test.ts
describe('Physics - delta-time accuracy', () => {
  it('should produce consistent results regardless of frame rate', () => {
    const physics = new Physics(GRAVITY, IMPULSE)
    physics.setVelocity(0, 0)

    // Simulate two different frame rates reaching 1 second total
    // 60 fps = 16.67ms per frame (60 frames)
    // 30 fps = 33.33ms per frame (30 frames)

    const positionAt60fps = simulateFrames(physics, 16.67, 60)
    const positionAt30fps = simulateFrames(physics, 33.33, 30)

    expect(positionAt60fps).toBeCloseTo(positionAt30fps, 0)
  })
})
```

### Frame-Rate Validation

GameLoop tests must validate frame-rate targets:

```typescript
// In src/GameLoop.test.ts
describe('GameLoop - frame rate', () => {
  it('should maintain minimum 30 fps', () => {
    const frameTimings: number[] = []
    
    // Simulate 300 frames (at 60 fps = ~5 seconds)
    for (let i = 0; i < 300; i++) {
      const frameStart = performance.now()
      GameLoop.update()
      const frameDuration = performance.now() - frameStart
      frameTimings.push(frameDuration)
    }

    const averageFrameTime = frameTimings.reduce((a, b) => a + b) / frameTimings.length
    const averageFps = 1000 / averageFrameTime
    
    expect(averageFps).toBeGreaterThanOrEqual(30)
  })
})
```

---

## Test Execution Checklist

Before merging to `main`, verify:

- [ ] All unit tests pass: `npm run test`
- [ ] Coverage meets 80% minimum for all components
- [ ] Physics/GameLoop tests validate delta-time handling
- [ ] Physics tests validate collision accuracy (±0.5 px tolerance)
- [ ] Audio tests verify graceful degradation (no Web Audio API)
- [ ] Persistence tests verify localStorage quota handling
- [ ] Integration tests validate full game flow (ready → playing → ended)
- [ ] No console errors or warnings in test output
- [ ] Manual smoke test: Game runs in browser, all game states reachable

---

## Debugging Failed Tests

### View Detailed Output

```bash
npm test -- --reporter=verbose
```

### Run a Single Test

```bash
npm test -- --grep "should award one point when passing through gap"
```

### Generate HTML Coverage Report

```bash
npm run test
open coverage/index.html
```

### Interactive Test UI

```bash
npm run test:ui
```

Opens a browser-based test UI for interactive debugging.

---

## Continuous Integration

### CI Test Command

For CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```bash
npm run test -- --reporter=json --outputFile=test-results.json
```

This outputs a machine-readable JSON report for CI integration.

### Coverage Report for CI

```bash
npm run test -- --coverage --coverage-reporter=lcov
```

The LCOV report can be uploaded to coverage services (Codecov, Coveralls, etc.).

---

## Summary

**Unit:** flappy-kiro-game (U1)

**Test Framework:** Vitest

**Test Execution Command:** `npm run test`

**Coverage Target:** 80% across all components (85% for critical: Physics, Player, GameLoop)

**Total Test Count:** 46–52 tests

**Expected Duration:** ~2–3 seconds for full suite

**Scope:** This document covers testing for Unit U1 only. Build-and-Test stage (3.6) will verify project-wide integration.
