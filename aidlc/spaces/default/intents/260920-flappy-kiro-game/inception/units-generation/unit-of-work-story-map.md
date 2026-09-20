# Unit of Work Story Map — Flappy Kiro

## Story-to-Unit Mapping

All functional requirements from Requirements Analysis are implemented in **U1 (Flappy Kiro Game)**. There are no separate story artifacts for this project (stage 2.4 User Stories was skipped per scope), so mapping is from functional requirements (FR) to the unit.

| FR ID | Requirement | Unit | Directory | Implementation Notes |
|-------|-------------|------|-----------|----------------------|
| FR1.1 | Ghosty spawns at consistent position, moves right at constant velocity | U1 | u1-flappy-kiro-game | Player component initialization and movement |
| FR1.2 | Gravity acts on Ghosty at constant rate | U1 | u1-flappy-kiro-game | Physics component gravity simulation |
| FR1.3 | Spacebar input applies upward impulse | U1 | u1-flappy-kiro-game | Input and Physics components |
| FR1.4 | Ghosty constrained by world boundaries | U1 | u1-flappy-kiro-game | Physics boundary enforcement |
| FR1.5 | Ceiling collision ends game | U1 | u1-flappy-kiro-game | Physics collision detection, GameLoop state transition |
| FR1.6 | Ground collision ends game | U1 | u1-flappy-kiro-game | Physics collision detection, GameLoop state transition |
| FR2.1 | Walls spawn at regular intervals | U1 | u1-flappy-kiro-game | Obstacles component |
| FR2.2 | Each wall has two segments with gap | U1 | u1-flappy-kiro-game | Obstacles component geometry |
| FR2.3 | Gap position randomized vertically | U1 | u1-flappy-kiro-game | Obstacles component randomization |
| FR2.4 | Gap size consistent throughout playthrough | U1 | u1-flappy-kiro-game | Obstacles component state |
| FR2.5 | Ghosty passes through gap without collision | U1 | u1-flappy-kiro-game | Physics collision detection, implicit in FR2.6 |
| FR2.6 | Wall collision ends game | U1 | u1-flappy-kiro-game | Physics collision detection, GameLoop state transition |
| FR3.1 | One point awarded per successful pass | U1 | u1-flappy-kiro-game | Scoring component, GameLoop coordination |
| FR3.2 | Score displayed during gameplay | U1 | u1-flappy-kiro-game | Rendering component queries Scoring |
| FR3.3 | Final score displayed at game end | U1 | u1-flappy-kiro-game | Rendering end-screen display |
| FR3.4 | High score tracked and displayed | U1 | u1-flappy-kiro-game | Scoring and Persistence components |
| FR4.1 | Game starts in ready state | U1 | u1-flappy-kiro-game | GameLoop state machine |
| FR4.2 | Spacebar begins game | U1 | u1-flappy-kiro-game | Input and GameLoop coordination |
| FR4.3 | Game runs continuously until collision | U1 | u1-flappy-kiro-game | GameLoop update loop |
| FR4.4 | End screen displays final score, high score, menu | U1 | u1-flappy-kiro-game | Rendering and GameLoop |
| FR4.5 | Menu options: Play Again, Settings, Quit | U1 | u1-flappy-kiro-game | Input and GameLoop state transitions |
| FR5.1 | Sound effects on events | U1 | u1-flappy-kiro-game | Audio component event subscriptions |
| FR5.2 | Background music during gameplay | U1 | u1-flappy-kiro-game | Audio component and GameLoop state |
| FR5.3 | Sound toggle from settings | U1 | u1-flappy-kiro-game | Input and Audio components |
| FR5.4 | Game state unaffected by audio settings | U1 | u1-flappy-kiro-game | Audio independence from game logic |
| FR6.1 | High score saved to localStorage | U1 | u1-flappy-kiro-game | Persistence component |
| FR6.2 | High score persists across sessions | U1 | u1-flappy-kiro-game | Persistence component |
| FR6.3 | High score loaded on startup | U1 | u1-flappy-kiro-game | Scoring component initialization |

---

## Cross-Cutting Concerns

All functionality is contained within U1. No stories span multiple units.

---

## Coverage Verification

✓ **All 27 FRs assigned to U1**
✓ **U1 has complete story coverage (no orphaned requirements)**
✓ **No gaps or unassigned functionality**

---

## Implementation Order Within U1

During Construction, the code generator will determine the order of implementation per component. Suggested logical order (for dependency reasons):

1. Physics (foundational simulation)
2. Player (depends on Physics)
3. Obstacles (independent, but queried by Physics)
4. GameLoop (orchestrates all)
5. Scoring (used by GameLoop)
6. Rendering (depends on queries to Player, Obstacles, Scoring)
7. Persistence (used by Scoring)
8. Audio (event-driven)
9. Input (triggered early, fires events)

This order respects internal component dependencies and allows testing at each layer.
