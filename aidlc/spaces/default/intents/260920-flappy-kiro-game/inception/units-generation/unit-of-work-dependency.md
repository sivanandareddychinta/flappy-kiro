# Unit of Work Dependency — Flappy Kiro

## Dependency DAG

**U1 (Flappy Kiro Game)** has no external unit dependencies. All 9 components are contained within U1 and communicate internally.

**Internal component dependencies (documented in Domain Design for reference):**
- GameLoop orchestrates all components
- Player delegates to Physics
- Physics queries Obstacles for collision checks
- Scoring delegates to Persistence
- Rendering queries Player, Obstacles, and Scoring for state
- Audio subscribes to events from Input and Scoring
- Input has no internal dependencies

All dependencies are internal to U1. There are no inter-unit dependencies, no parallel work streams, and no external contracts between units.

---

## Integration Points

Since U1 is monolithic, all integration is internal:

- **GameLoop ↔ Player:** GameLoop calls Player.update(); Player exposes position/bounds queries
- **Player ↔ Physics:** Player delegates motion simulation to Physics
- **Physics ↔ Obstacles:** Physics queries obstacle geometry for collision detection
- **GameLoop ↔ Scoring:** GameLoop notifies Scoring of pass-through events
- **Rendering ↔ Player/Obstacles/Scoring:** Rendering queries each for current state and renders accordingly
- **Audio ↔ Input/Scoring:** Audio subscribes to event streams
- **Scoring ↔ Persistence:** Scoring calls Persistence.save/load for high-score persistence

---

## Parallel Development

**No parallelism opportunities:** U1 is a single unit. All 9 components must be built together.

This does not constrain future decomposition; if the game grows and teams want to work in parallel, the unit boundary can be revisited. For the current scope and team size, monolithic is optimal.

---

## Machine-Readable Dependency Edge Block

```yaml
units:
  - name: flappy-kiro-game
    kind: packaging
    depends_on: []
```

This represents the complete unit topology for Flappy Kiro: one unit with no external dependencies.

---

## Topological Orderings

Since there is only one unit and it has no dependencies, there is exactly one valid build order: U1.

No multi-unit sequencing decisions are needed. Delivery Planning (Stage 2.9) will have no dependency-driven constraints on order; economic factors (value, risk, effort) will drive the Bolt sequence if multiple delivery cycles are planned.
