# Unit Test Instructions — Flappy Kiro Game

## Overview

This document specifies the test framework, commands, and coverage expectations for Flappy Kiro game development (Unit U1). All tests are scoped to this unit and run in isolation from any workspace-wide test suite.

**Test Framework**: Vitest  
**Test Strategy**: Standard (5-8 tests per component)  
**Coverage Target**: 80% line coverage (MVP scope floor)  
**Test Organization**: Unit tests per component + integration tests for key boundaries  

---

## Test Framework Setup

### Installation

The following dependencies are already configured in `package.json`:

```json
{
  "devDependencies": {
    "typescript": "^5.0",
    "vitest": "^1.0",
    "@vitest/ui": "^1.0",
    "vite": "^5.0"
  }
}
```

Install all dependencies:
```bash
npm install
```

### Configuration

**`vitest.config.ts`:**
- Test root: `tests/`
- Include pattern: `tests/**/*.test.ts`
- Environment: `jsdom` (browser DOM simulation)
- Coverage threshold: 80% lines

**`tests/setup.ts`:** Bootstrap file for test utilities and mocks

---

## Running Tests for This Unit

### Exact Command (Unit-Scoped)

**Run all tests for Flappy Kiro:**
```bash
npm run test:unit
```

This command runs **only** tests in `tests/` directory, scoped to this unit. It will NOT run workspace-wide tests or tests for other units.

### Alternative Commands

**Watch mode (for development):**
```bash
npm run test:unit -- --watch
```

**With coverage report:**
```bash
npm run test:unit -- --coverage
```

**UI dashboard:**
```bash
npm run test:unit -- --ui
```

**Single test file:**
```bash
npm run test:unit -- tests/Physics.test.ts
```

---

## Test File Structure

### Organization

```
tests/
├── setup.ts                    # Test utilities, mocks, test helpers
├── types.test.ts               # Type system and interfaces
├── Persistence.test.ts         # localStorage abstraction
├── AssetLoader.test.ts         # Asset caching and retrieval
├── Physics.test.ts             # Physics simulation and collision
├── Scoring.test.ts             # Point tracking and high-score
├── Obstacles.test.ts           # Wall generation and management
├── Player.test.ts              # Player entity and lifecycle
├── Input.test.ts               # Keyboard event handling
├── GameLoop.test.ts            # Game orchestration and state machine
├── Audio.test.ts               # Sound effects and music
├── Rendering.test.ts           # Canvas drawing and screen state
└── GameLoop.integration.test.ts # Full game loop integration
```

### Test File Naming Convention

- Unit test: `<Component>.test.ts`
- Integration test: `<Component>.integration.test.ts`
- Each file tests ONE component or integration boundary

---

## Coverage Expectations

### Per-Component Coverage

| Component | File | Expected Tests | Scope |
|-----------|------|----------------|-------|
| Types | `types.test.ts` | 2-3 | TypeScript interfaces |
| Persistence | `Persistence.test.ts` | 6-7 | localStorage save/load, graceful degradation |
| AssetLoader | `AssetLoader.test.ts` | 3-4 | Asset caching, sprite/audio retrieval |
| Physics | `Physics.test.ts` | 7-8 | Gravity, impulse, collision (highest priority) |
| Scoring | `Scoring.test.ts` | 5-6 | Point addition, high-score persistence |
| Obstacles | `Obstacles.test.ts` | 6-7 | Spawning, randomization, despawning |
| Player | `Player.test.ts` | 5-6 | Entity state, flap, bounds |
| Input | `Input.test.ts` | 5-6 | Keyboard event capture |
| GameLoop | `GameLoop.test.ts` | 6-7 | State machine, orchestration |
| Audio | `Audio.test.ts` | 4-5 | Graceful degradation, playback |
| Rendering | `Rendering.test.ts` | 5-6 | Canvas drawing, screen states |
| **Integration** | `GameLoop.integration.test.ts` | 3-4 | Full game loop flow |
| **Total** | — | **47-55 tests** | ~80% line coverage |

### Critical Paths (Highest Priority)

1. **Physics.test.ts** (7-8 tests) — collision detection and gravity are safety-critical; test thoroughly
2. **GameLoop.test.ts** (6-7 tests) — state machine correctness is essential
3. **Scoring.test.ts** (5-6 tests) — high-score persistence must work reliably
4. **Obstacles.test.ts** (6-7 tests) — procedural generation must be predictable and fair

---

## Mocking Strategy

### Canvas API Mock

Vitest runs tests in `jsdom` environment. Canvas 2D context is mocked:

```typescript
// tests/setup.ts
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  fillText: vi.fn(),
  // ... other canvas methods
}));
```

### localStorage Mock

```typescript
// tests/setup.ts
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

### Web Audio API Mock

```typescript
// tests/setup.ts
global.AudioContext = vi.fn(() => ({
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  destination: {},
})) as any;
```

### requestAnimationFrame Mock

```typescript
// tests/setup.ts
global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 16));
```

---

## Test Data Management

### Fixtures

Define reusable test data in `tests/setup.ts`:

```typescript
export const defaultPlayer = {
  x: 640,
  y: 360,
  vx: 0,
  vy: 0,
  width: 34,
  height: 24,
};

export const defaultWall = {
  wallId: 1,
  x: 1280,
  gapCenter: 360,
  gapSize: 120,
  width: 80,
  height: 720,
};

export const defaultGameState = {
  game_state: 'playing',
  currentScore: 0,
  highScore: 100,
};
```

### Test Data Builders

For complex objects, use builder pattern:

```typescript
export function createPlayer(overrides = {}) {
  return { ...defaultPlayer, ...overrides };
}
```

---

## Happy Path Example

### Physics Test (Gravity)

```typescript
import { describe, it, expect } from 'vitest';
import { Physics } from '../src/components/Physics';

describe('Physics.simulate - Gravity', () => {
  it('should apply gravity when no impulse', () => {
    const physics = new Physics();
    const player = createPlayer({ vy: 0 });
    const deltaTime = 0.016; // 60 fps
    
    const result = physics.simulate(player, deltaTime, [], { top: 0, bottom: 720 });
    
    expect(result.vy).toBeGreaterThan(0); // velocity increased downward
  });

  it('should accumulate gravity over multiple frames', () => {
    const physics = new Physics();
    let player = createPlayer({ vy: 0 });
    
    player = physics.simulate(player, 0.016, [], { top: 0, bottom: 720 }).player;
    const vy1 = player.vy;
    
    player = physics.simulate(player, 0.016, [], { top: 0, bottom: 720 }).player;
    const vy2 = player.vy;
    
    expect(vy2).toBeGreaterThan(vy1); // gravity accumulates
  });

  // ... additional tests
});
```

---

## Error Cases and Edge Cases

### Physics Edge Cases

- **Collision at boundary**: Player collides with wall within ±0.5 sprite width
- **Rapid flaps**: Multiple flap inputs in one frame
- **Off-screen player**: Player moves outside world bounds (ceiling, ground)

### Scoring Edge Cases

- **Score overflow**: Large score values (test number limits)
- **High-score update**: Current score exceeds high score
- **localStorage quota exceeded**: Graceful degradation when save fails

### Obstacles Edge Cases

- **Gap at world boundary**: Gap positioned near top or bottom edge
- **Wall overlap**: Two walls spawned in quick succession
- **Off-screen wall removal**: Wall leaves viewport and is despawned

### Input Edge Cases

- **Multiple simultaneous keys**: Spacebar + arrow key pressed together
- **Key repeat**: OS key repeat triggered by held key
- **Event on wrong game state**: Spacebar pressed in ready state (should be ignored)

---

## Continuous Integration

### Pre-Commit Hook

All tests must pass before commit:

```bash
npm run test:unit -- --run  # Exit with non-zero on failure
```

### CI Command

For automated test runs (GitHub Actions, Jenkins, etc.):

```bash
npm run test:unit -- --run --coverage
```

This command:
- Runs all tests
- Exits with non-zero status if any test fails
- Generates coverage report
- Fails if coverage drops below 80%

---

## Debugging Tests

### VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:unit", "--", "--inspect-brk", "--run"],
  "console": "integratedTerminal"
}
```

### CLI Debugging

Run single test with verbose output:

```bash
npm run test:unit -- tests/Physics.test.ts --reporter=verbose
```

### Test UI

Interactive test dashboard (great for live development):

```bash
npm run test:unit -- --ui
```

---

## Coverage Report

### Generate Coverage

```bash
npm run test:unit -- --coverage
```

Output locations:
- Console summary
- `coverage/` directory with HTML report
- Open `coverage/index.html` in browser for detailed visualization

### Target Coverage

- **Lines**: 80% (MVP scope floor)
- **Functions**: 80%
- **Branches**: 75% (not all code branches are critical)
- **Statements**: 80%

Coverage is verified during `npm run test:unit`; tests fail if any metric drops below target.

---

## Test Categories

### Unit Tests (Component Isolation)

Each component tested independently with mocked dependencies:

- Physics alone (mocked Obstacles)
- Scoring alone (mocked Persistence)
- etc.

**Approximate tests**: 35-40 unit tests

### Integration Tests (Component Boundaries)

Key integration points tested together:

- GameLoop + Input + Player + Physics (state machine + physics interaction)
- Scoring + Persistence (high-score save/load)
- GameLoop + Rendering (frame drawing)

**Approximate tests**: 8-12 integration tests

### Coverage Distribution

- Unit tests: 70-75% of test count
- Integration tests: 25-30% of test count

---

## Maintenance and Refactoring

### When Tests Break

1. Identify which test(s) failed
2. Read test name for expected behavior
3. Check component implementation for deviations
4. Update either test (if requirement changed) or implementation (if bug)
5. Re-run: `npm run test:unit`
6. Commit fix with clear message

### Test Naming Convention

Test names should clearly state what is being tested:

```typescript
it('should apply gravity when no impulse is applied', () => { ... })
it('should detect collision within sprite width tolerance', () => { ... })
it('should update high score when current score exceeds stored high score', () => { ... })
```

NOT:
```typescript
it('works', () => { ... })
it('test gravity', () => { ... })
```

---

## Summary

**Test Command**: `npm run test:unit`  
**Framework**: Vitest in jsdom environment  
**Expected Test Count**: 47-55 tests  
**Coverage Target**: 80% line coverage  
**Organization**: Unit tests per component + integration tests  
**Critical Paths**: Physics, GameLoop, Scoring, Obstacles  

All tests are automatically discovered and run by Vitest. No manual test registration is required. Tests must pass before code can be committed and before Build-and-Test stage verification.
