# Team Allocation — Flappy Kiro

## Team Composition

**Project:** Flappy Kiro Game (U1 — monolithic implementation)

**Estimated team size:** 1–2 developers

**Duration:** 3–4 weeks to Bolt 1 completion

---

## Role Definitions

### Lead Developer (Primary Implementation Role)

**Responsibilities:**
- Implement 3–4 core components (recommended: GameLoop, Player, Physics, Rendering)
- Set up build tooling, bundler configuration, test framework
- Coordinate daily integration; resolve blockers
- Lead code review for Bolt 1
- Optimize bundle size and performance

**Skills required:**
- JavaScript/TypeScript proficiency (ES6+)
- Canvas 2D rendering knowledge (or willingness to learn)
- Test framework familiarity (Jest or similar)
- Git workflow
- Bundler experience (webpack, esbuild, Rollup) or ability to learn quickly

**Estimated allocation:** 100% (4 weeks full-time to complete all work if solo)

---

### Support Developer (Optional, if available)

**Responsibilities:**
- Implement remaining 4–5 components (recommended: Obstacles, Scoring, Audio, Input, Persistence)
- Write component-level unit tests (test-after methodology)
- Integration testing and cross-browser validation
- Performance profiling and optimization
- Documentation (TESTING guide, component APIs)

**Skills required:**
- JavaScript/TypeScript proficiency
- Understanding of game loop patterns (or ability to learn)
- Web Audio API familiarity (or willingness to learn)
- Testing and QA mindset

**Estimated allocation:** 100% (4 weeks full-time) or 50% (8 weeks part-time)

---

## Component-to-Developer Assignment

If 2 developers are available:

| Component | Complexity | Lead | Support | Est. Effort |
|-----------|-----------|------|---------|------------|
| GameLoop | Medium | Lead | — | 4–5 days |
| Player | Low | Lead | — | 2–3 days |
| Physics | High | Lead | — | 5–7 days |
| Rendering | High | Lead | Support review | 5–7 days |
| Obstacles | Medium | Support | — | 4–5 days |
| Scoring | Low | Support | — | 2–3 days |
| Audio | Medium | Support | Lead review | 3–4 days |
| Input | Low | Support | — | 2–3 days |
| Persistence | Low | Support | — | 1–2 days |
| Integration & Testing | High | Lead + Support | — | 5–7 days |
| **Total** | — | — | — | **40–50 days** |

**If solo developer (Lead only):**
- Sequence same components in order; estimated 40–50 person-days of work
- Full-time delivery: 3–4 weeks (accounting for context switching and integration work)
- Part-time delivery: 2–3 months at 50% allocation

---

## Collaboration Practices

### Code Review Gates

- **Every component:** Lead developer (or paired reviewer) reviews Support's code before merge
- **Integration points:** Both developers review cross-component interactions before integration testing
- **Final bundle:** Both developers sign off on minified output and performance metrics before Bolt 1 completes

### Daily Sync

- **15-minute standup:** Status, blockers, priorities
- **Problem-solving:** Pair programming for complex physics simulation, rendering optimization
- **Testing:** Shared manual QA on different browsers (if available)

### Knowledge Sharing

- **Component ownership is temporary:** Both developers understand all 9 components to reduce bus factor
- **Documentation:** Each component documented with inline code comments + component API spec
- **Test suite:** Both developers can run and understand the test suite for all components

---

## Workload Estimation

### Effort Breakdown (Solo Developer, Full-Time)

| Phase | Duration | Activity |
|-------|----------|----------|
| **Week 1** | 5 days | Setup: build tooling, bundler, test framework, project structure; implement GameLoop, Player, initial Physics |
| **Week 2** | 5 days | Complete Physics, Rendering (canvas setup + sprite loading), Input, basic integration testing |
| **Week 3** | 5 days | Implement Obstacles, Scoring, Audio, Persistence; integration testing and bug fixes |
| **Week 4** | 5 days | Optimization (bundle size, frame rate), cross-browser testing, final polish, documentation |
| **Total** | 20 days (4 weeks) | **Complete game ready for ship** |

### Effort Breakdown (Two Developers, Full-Time)

| Phase | Duration | Lead | Support |
|-------|----------|------|---------|
| **Week 1** | 5 days | Setup, GameLoop, Player, Physics | Learning, input framework, test setup |
| **Week 2** | 5 days | Physics finish, Rendering, integration | Obstacles, Scoring, Audio (parallel) |
| **Week 3** | 5 days | Integration testing, rendering optimization | Persistence, Input polish, cross-browser testing |
| **Week 4** | 5 days | Performance tuning, final bundle, docs | QA sign-off, documentation, final validation |
| **Total** | 20 person-days (10 days elapsed) | **Complete game ready for ship** |

---

## Risk Factors & Mitigation

### Skill Gaps

**Risk:** Developer unfamiliar with Canvas 2D or Web Audio API

**Mitigation:** 
- MDN documentation is sufficient for learning
- Allocate 1–2 days upfront for API exploration
- Simpler components (Input, Persistence) are good for learning JS APIs

### Performance Pressure

**Risk:** Physics/rendering may not hit 60 fps target

**Mitigation:**
- Profile early and often (Week 2, daily in Weeks 3–4)
- Canvas rendering is inherently fast; focus optimization on physics loop
- Graceful degradation to 30 fps is acceptable per NFR1.1
- Pair programming on physics simulation if stuck

### Integration Complexity

**Risk:** Components don't integrate smoothly at Week 3

**Mitigation:**
- Define component APIs (method signatures, event contracts) by end of Week 1
- Functional Design stage (3.1) will finalize API contracts before coding starts
- Daily integration builds in Week 2 to catch mismatches early

---

## Tools & Environment Setup

**Recommended tech stack:**

- **Bundler:** esbuild or webpack
- **Test framework:** Jest
- **Linter:** ESLint with recommended config
- **Source control:** Git (GitHub recommended)
- **Documentation:** Markdown (inline code comments + README)
- **Manual testing:** Cross-browser testing on Chrome, Firefox, Safari, Edge (BrowserStack or local VMs if available)

**Estimated setup time:** 1–2 days (solo developer) or 1 day (pair, parallel)

---

## Approval & Sign-Off

**Deliverable owners:**
- **Lead Developer:** Accountable for complete delivery of Bolt 1
- **Support Developer (if exists):** Responsible for quality and testing

**Gate approval:**
- All 27 FRs verified by developer + QA review
- All 6 NFRs validated (frame rate, browser compatibility)
- Build green: linter clean, tests passing, bundle < 500 KB
- Manual playtesting sign-off: game is fun and performant

**Bolt 1 ships when:** All criteria met + Lead Developer approves for release
