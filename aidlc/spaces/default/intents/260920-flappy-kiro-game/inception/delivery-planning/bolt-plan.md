# Bolt Plan — Flappy Kiro

## Summary

**Total Bolts:** 1

**Skeleton Mode:** Off (per scope configuration; no bootstrap Bolt needed)

**Construction Autonomy Mode:** Not yet decided (decided after Bolt 1 ships)

---

## Bolt Definitions

### Bolt 1: Complete Game Implementation

**Bolt ID:** b1-flappy-kiro-complete

**Units Delivered:** U1 (Flappy Kiro Game)

**Scope:** All 9 components, all 27 functional requirements, all 6 NFRs

**Complexity:** Large

**Estimated Duration:** 3–4 weeks (typical for a large monolithic game with 9 components, physics, rendering, audio)

**Delivery Gates:** 
1. Code Generation complete (all 9 components coded and unit-tested)
2. Build and Test green (full integration test suite passing, 30+ fps verified, all 27 FRs verified)
3. Artifact bundled: index.html + game.js ready for static deployment

**Acceptance Criteria:**
- ✅ All 27 FRs verified and passing
- ✅ All 6 NFRs satisfied (30+ fps min, 60 fps target; browser compatibility; collision detection)
- ✅ Game bundled and deployable to static hosting
- ✅ High-score persistence via localStorage verified
- ✅ Audio graceful degradation verified
- ✅ All component unit tests passing (80%+ code coverage per test strategy)

**Release Artifacts:**
- `index.html` — Single static HTML entry point
- `game.js` — Bundled, minified game code with all 9 components
- `README.md` — Deployment and playing instructions
- `TESTING.md` — Test suite documentation and manual test guide

**Successor:** None (single-unit game; Bolt 1 is the complete delivery)

---

## Sequencing Rationale

Since there is only one unit (U1) with no external dependencies, there is **only one possible Bolt sequence**: deliver the complete game as a single monolithic package.

This sequence is **optimal** for this scope because:

1. **No parallelization overhead:** No inter-unit boundaries to coordinate; maximum developer focus on quality
2. **Monolithic simplicity:** All 9 components compiled into one .js file; no module loading or versioning complexity
3. **Single deployment target:** Static files only; no staging pipeline configuration needed
4. **Risk concentration is acceptable:** Single-unit means no cascading deployment failures; all-or-nothing deployment is appropriate

---

## Construction Autonomy Decision Point

**Question:** After Bolt 1 is complete and ready to ship, how should any potential follow-up bolts run?

Since there is only one Bolt in this plan, this decision point is **not yet relevant**. If the project scope later expands (e.g., new features, additional game modes, multiplayer, backend integration), the team will make an autonomy decision at that time.

**For now:** Bolt 1 is gated (user approval before shipping) since it is the single, complete delivery.

---

## Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Physics simulation accuracy (collision detection) | High | Medium | Extensive unit tests for physics component; manual playtesting of collision scenarios |
| Canvas rendering performance at 60 fps | High | Medium | Profiling and optimization during Build & Test; target 60 fps, degrade gracefully to 30 fps |
| Web Audio API compatibility issues | Medium | Low | Graceful degradation already contracted (game playable without audio) |
| Asset embedding (base64 data URIs) bloats bundle | Medium | Low | Profile bundle size; consider lazy-loading if > 1 MB (not expected for MVP) |
| Cross-browser rendering inconsistencies | Medium | Low | Test matrix covers Chrome, Firefox, Safari, Edge; use standard Canvas 2D API only |

---

## External Dependency Map

**Third-party services required:** None

**External APIs used:** 
- Browser Canvas 2D API (no external service)
- Web Audio API (no external service)
- localStorage (browser-local, no external service)
- requestAnimationFrame (no external service)

**Build tools needed:**
- JavaScript bundler (webpack, esbuild, Rollup recommended)
- Minifier (included with bundler)
- Test framework (Jest recommended for 9 component unit tests)
- Linter (ESLint recommended)

**Deployment infrastructure:**
- Static file hosting (GitHub Pages, Netlify, Vercel, S3, or any HTTP server)
- No backend required
- No database required
- No CI/CD pipeline required (optional; improves code quality)

---

## Team Allocation & Roles

**Assumed team size:** 1–2 developers

**Core roles during Construction:**
1. **Developer 1 (Lead):** Implement all 9 components (split ~3 components per 1.5 weeks)
2. **Developer 2 (Optional, if available):** Parallel implementation of remaining components; testing

**Key activities:**
- **Weeks 1–2:** Implement GameLoop, Player, Physics, Input, Rendering, and basic integration
- **Week 3:** Implement Obstacles, Scoring, Audio, Persistence; integration testing
- **Week 4:** Optimization, cross-browser testing, performance tuning, final bundle prep

**Decision gate:** At end of week 4, review results and decide if the Bolt ships or requires revision.

---

## Success Criteria & Handoff

**Definition of Done for Bolt 1:**
- All 27 FRs implemented and verified (FR1–FR6 pass acceptance tests)
- All 6 NFRs met (FR Performance, Compatibility)
- Code coverage ≥ 80% per test strategy
- Build green: no ESLint errors, all unit tests passing, integration tests green
- Bundle size < 500 KB (minified + gzipped)
- Playable game deployed to temporary test URL; manual QA sign-off
- Documentation complete: README, TESTING guide, API docs for each component

**Handoff to Operation phase (if scope expands):**
- Bolt 1 shipped; game live
- Team evaluates: Ship now, or add more Bolts?
- If more work: Team decides on Construction Autonomy Mode (autonomous or gated)
- If done: Game enters maintenance/operation (outside scope of current plan)
