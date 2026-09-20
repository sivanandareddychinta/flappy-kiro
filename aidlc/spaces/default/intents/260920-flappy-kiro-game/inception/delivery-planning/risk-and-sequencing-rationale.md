# Risk and Sequencing Rationale — Flappy Kiro

## Bolt Sequencing Rationale

### Why Only One Bolt?

Flappy Kiro (U1) is a **monolithic, single-unit game** with **no inter-unit dependencies and no internal work parallelization boundaries**. Consequently:

1. **No value in splitting work across multiple Bolts**
   - All 9 components are tightly coupled (GameLoop orchestrates all others)
   - No feature can be shipped independently without others
   - Splitting would add artificial handoff overhead without delivery parallelization

2. **Single Bolt is the natural delivery unit**
   - Entire game is one distribution package (game.js + index.html)
   - No phased rollout or staged feature gating needed
   - Monolithic deployment means binary shipping: complete or not shipped

3. **Single-unit game → single delivery increment**
   - Contrast with a multi-service backend where you can ship Service A, then Service B, then Service C incrementally
   - Here, there's only U1; it's either done or it's not
   - No intermediate partially-working state adds user value

### Architectural Justification

**Domain Design Decision (2.6):** 9 components defined as internal to U1, not as separately deployable units
**Units Generation Decision (2.7):** Single unit (U1) chosen for simplicity; no external services or backends
**Contract Design Decision (2.8):** Single public API (browser ↔ game); no inter-unit contracts

**Result:** Natural Bolt sequence is **one monolithic delivery** of U1.

---

## Work Breakdown & Sequencing

### Recommended Implementation Sequence

**Phase 1: Foundation (Week 1)**
1. **Build tooling & test infrastructure** (1–2 days)
   - Set up bundler, test framework, linter
   - Create project structure matching 9 component boundaries
   
2. **GameLoop component** (2–3 days)
   - Game state machine (ready/playing/ended)
   - Frame timing via requestAnimationFrame
   - Component orchestration skeleton (placeholder calls to other components)
   
3. **Player component** (1–2 days)
   - Ghosty entity (position, velocity)
   - Flap action handling
   - Collision bounds calculation

4. **Physics component** (2–3 days)
   - Gravity + impulse simulation
   - AABB collision detection
   - Boundary checks (ceiling, ground)

**Rationale for Phase 1 order:**
- GameLoop first because it's the orchestrator; other components depend on being called from it
- Player next because it's stateful; physics depends on Player having position/velocity to update
- Physics third because it's pure simulation; can be unit-tested independently before integration

---

**Phase 2: Visual & Interaction (Week 2)**
5. **Rendering component** (3–4 days)
   - Canvas setup and 2D context
   - Sprite loading (embedded data URIs)
   - Screen rendering: ready, playing, ended states
   - Integration: render Player, Obstacles, score
   
6. **Input component** (1–2 days)
   - Keyboard listeners (spacebar, arrows, enter)
   - Event emission
   - Integration: trigger flap, menu navigation

7. **Obstacles component** (2–3 days)
   - Wall generation and gap randomization
   - Position updates and lifecycle
   - Integration: collision detection via Physics

**Rationale for Phase 2 order:**
- Rendering depends on Player + Obstacles existing (has position to render)
- Input is independent but needed for player interaction
- Obstacles depends on Player collision detection (Physics)

---

**Phase 3: Game Logic & Audio (Week 3)**
8. **Scoring component** (1–2 days)
   - Current + high score tracking
   - Event emission on points
   - Integration: Persistence for high-score save

9. **Audio component** (2–3 days)
   - Web Audio API setup
   - Sound effect + music playback
   - Mute toggle
   - Integration: event listeners on Input, Scoring

10. **Persistence component** (1–2 days)
    - localStorage abstraction
    - Save/load for high score
    - Graceful degradation for private mode

**Rationale for Phase 3 order:**
- Scoring can be built once Player + Obstacles are integrated (collision/pass-through events exist)
- Audio depends on Input (flap events) and Scoring (point events)
- Persistence is independent; last because it's lowest risk

---

**Phase 4: Integration & Polish (Week 4)**
11. **Full integration testing** (2–3 days)
    - All components talking to each other
    - Game flow: ready → playing → ended → ready
    - Cross-browser testing (Chrome, Firefox, Safari, Edge)
    
12. **Performance optimization** (1–2 days)
    - Profile frame rate (target 60 fps, min 30 fps per NFR1.1)
    - Bundle size analysis (target < 500 KB)
    - Canvas rendering optimization if needed
    
13. **Documentation & final polish** (1–2 days)
    - Component API documentation
    - Test suite documentation
    - README + deployment instructions

**Rationale for Phase 4:**
- Late integration catches cross-component issues (timings, event ordering)
- Performance work depends on having full code to profile
- Documentation last because it's stable once code is done

---

## Risk Assessment

### High-Risk Items

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Physics collision detection bugs | Gameplay-breaking | Medium (15%) | Early implementation (Week 1); extensive unit tests; manual play-testing throughout |
| Frame rate misses 30 fps target | Unplayable | Low (10%) | Profile early and often; Canvas 2D is fast; focus on physics loop optimization; graceful degradation acceptable |
| Web Audio API cross-browser issues | Audio missing | Low (5%) | Graceful degradation already contracted; game playable without audio |
| Bundle size exceeds 500 KB | Slow loading | Low (5%) | Profile assets (sprites, audio); minify aggressively; consider lazy-loading if needed |

### Medium-Risk Items

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Component API mismatches during integration | Rework | Medium (20%) | Define APIs clearly in Functional Design (3.1) before coding; daily integration builds |
| Sprite rendering performance | Visual artifacts | Low (10%) | Use canvas transform matrix for scaling; avoid excessive redrawing |
| Cross-browser CSS/canvas quirks | Rendering inconsistencies | Medium (15%) | Test on target browsers by Week 2; avoid browser-specific hacks; use standard APIs only |
| localStorage unavailable in private mode | Data loss | Low (5%) | Graceful degradation already designed; game works without persistence |

### Low-Risk Items

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Keyboard event capture issues | Input non-responsive | Low (5%) | Standard Web API; minimal risk; unit-test event listeners |
| Time zone issues with high score | Score corruption | Negligible (1%) | No time-dependent data; localStorage stores JSON number only |
| Game loop synchronization | Frame drops | Low (5%) | requestAnimationFrame handles timing; delta-time approach tolerates variance |

---

## Dependency Constraints

### Internal Component Dependencies

**Strict ordering required:**
- GameLoop must exist before other components (it calls them)
- Physics must exist before Player is fully integrated (Player delegates to Physics)
- Obstacles must exist before Physics (Physics queries obstacle geometry for collision)
- Rendering must exist before GameLoop integration (GameLoop calls render each frame)

**Can be parallel:**
- Input and Persistence (no shared dependencies)
- Audio and Scoring (loose coupling via events)
- Early iterations of Player + Obstacles (can mock out other components)

### External Dependencies

**None.** All required APIs are built into modern browsers:
- Canvas 2D (all modern browsers)
- Web Audio (all modern browsers, graceful degrade if unavailable)
- requestAnimationFrame (all modern browsers)
- localStorage (all modern browsers, disabled in private mode)
- Keyboard events (all modern browsers)

### Build Tool Dependencies

Required before starting:
- JavaScript bundler (esbuild, webpack, Rollup) — recommend esbuild for speed
- Test framework (Jest) — recommend for snapshot and coverage reporting
- Linter (ESLint) — recommend for code quality gates

---

## Handoff Criteria (End of Bolt 1)

**Artifact deliverables:**
- ✅ index.html (static entry point)
- ✅ game.js (bundled, minified code)
- ✅ README.md (deployment instructions)
- ✅ TESTING.md (test suite documentation)

**Verification gates:**
- ✅ All 27 FRs passing manual acceptance tests
- ✅ All 6 NFRs validated (30 fps min, browser matrix)
- ✅ Code coverage ≥ 80% (per test strategy)
- ✅ ESLint clean (no warnings or errors)
- ✅ All unit tests passing
- ✅ Bundle < 500 KB (minified + gzipped)
- ✅ Cross-browser manual QA sign-off

**Ship approval:** Lead Developer signs off; Bolt 1 ready for production deployment

---

## Post-Bolt-1 Decision: Construction Autonomy

**Question:** If the project scope expands (new features, additional bolts), should remaining bolts be gated individually or continue autonomously?

**At Bolt 1 completion, the team will decide:**

1. **Gate mode (default if uncertain):** Each subsequent Bolt gets human approval before shipping
   - Advantages: Full visibility into each delivery increment; opportunity to adjust scope
   - Disadvantages: Slower iteration if many bolts planned

2. **Autonomous mode:** Remaining Bolts auto-deliver if tests pass
   - Advantages: Fast iteration; trust in testing gates
   - Disadvantages: Less control; harder to course-correct mid-delivery

**For current plan (single Bolt):** Question is deferred. Bolt 1 ships gated (user approval required).

---

## Summary

**Single Bolt is optimal for Flappy Kiro because:**
1. Monolithic architecture with no separable work units
2. No inter-unit parallelization opportunities
3. All features dependent on all components (must ship together)
4. Single public API (browser ↔ game) = single deployment artifact

**Sequencing (Phase 1-4) follows dependency DAG:**
- Foundation (GameLoop, Player, Physics) first
- Visual layer (Rendering, Input, Obstacles) second
- Game logic (Scoring, Audio, Persistence) third
- Integration & polish last

**Estimated completion: 3–4 weeks, 1–2 developers, 40–50 person-days of effort**

**No external dependencies; all risk is internal code quality and performance tuning.**
