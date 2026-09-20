# External Dependency Map — Flappy Kiro

## Summary

**External services required:** None

**External APIs used:** Browser built-ins only (Canvas, Web Audio, localStorage, requestAnimationFrame, Keyboard events)

**Third-party npm packages:** Optionally bundler + test framework (not required for game logic)

**Build-time dependencies:** Bundler, test framework, linter (optional but recommended)

---

## External APIs Used (All Browser Built-in)

| API | Purpose | Required? | Fallback Strategy | Browser Support |
|-----|---------|-----------|-------------------|-----------------|
| Canvas 2D Context | Game rendering | YES | None; game cannot run without it | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| requestAnimationFrame | Frame timing and event loop scheduling | YES | None; game loop requires it | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Web Audio API | Sound effects and background music | NO | Graceful degradation; game plays without audio | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| localStorage | High-score persistence | NO | Graceful degradation; high score not persisted | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (disabled in private mode) |
| Keyboard Events (keydown, keyup) | Player input (spacebar, arrow keys) | YES | Menu becomes non-functional; game playable if remapped | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Image API | Sprite asset loading (embedded data URIs) | YES | None; critical for rendering | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

---

## No External Services

**Flappy Kiro is fully client-side; no backend, no APIs, no databases.**

### Decision Rationale

1. **Scope (express game):** Simple arcade mechanics don't require server-side state
2. **High-score persistence:** localStorage sufficient for single-device play
3. **Deployment:** Static file hosting is simpler and cheaper than running a backend
4. **Scalability:** No backend bottleneck; can host on CDN
5. **Privacy:** All game data stays on player's device

### Future Expansion Points (Out of Scope)

If future versions need cloud features:
- **Leaderboards:** HTTP POST to backend API to save score
- **Multiplayer:** WebSocket to game server
- **Analytics:** Beacon API to track play sessions
- **Account sync:** OAuth login + database

**None of these are in current scope.**

---

## Build-Time Dependencies

### Strongly Recommended

**Bundler (esbuild, webpack, or Rollup)**
- Purpose: Bundle 9 component files + embedded assets into single game.js
- Estimated install & setup time: 2–4 hours
- Suggested: esbuild (simplest, fastest for single-file output)

```bash
npm install --save-dev esbuild
# OR
npm install --save-dev webpack webpack-cli

# Result: game.js (minified, ready for deployment)
```

**Test Framework (Jest)**
- Purpose: Unit tests for each component (40–60 test cases recommended)
- Estimated install & setup time: 1–2 hours
- Suggested: Jest (pairs well with esbuild, great snapshot testing)

```bash
npm install --save-dev jest
# OR
npm install --save-dev vitest

# Runs: npm test → all component tests green before shipping
```

**Linter (ESLint)**
- Purpose: Enforce code quality, catch common errors
- Estimated install & setup time: 1–2 hours
- Suggested: ESLint with recommended config

```bash
npm install --save-dev eslint
npm run lint # Must pass before merge/ship
```

### Optional but Recommended

**TypeScript (if preferred over JavaScript)**
- Purpose: Type safety during development
- Trade-off: Adds 2–4 hours of setup; adds transpilation step
- Suggestion: Use TypeScript if team prefers; JSDoc if not

**Prettier (code formatter)**
- Purpose: Consistent code style automatically
- Trade-off: Adds 30 minutes setup; enforces style without discussion
- Suggestion: Use if team wants automated formatting

---

## No Runtime npm Dependencies

**Game code has ZERO npm package dependencies.**

Why? 
- All rendering, audio, timing, storage use browser built-ins
- No framework (React, Vue, Angular) needed for simple arcade game
- Physics simulation is pure math (no physics engine like Cannon.js or Babylon.js needed)
- Single-file bundle is simplest deployment model

**Result:**
- No dependency tree bloat
- No version conflicts
- No supply-chain security risk
- Smaller bundle size
- Faster loading

---

## Network & Connectivity

### During Gameplay

**No network calls.** Game is fully playable offline:
- Sprites are embedded as base64 data URIs (no HTTP requests)
- Audio is embedded as base64 data URIs (no HTTP requests)
- Game state is local only (no API calls)
- High-score saved to localStorage (no backend sync)

### Initial Page Load

**Single network request:** 
- Browser requests `index.html` from static host
- HTML includes `<script src="game.js">`
- Browser fetches `game.js` (< 500 KB, typically < 2 seconds on 4G)
- Game loads and plays

**No third-party CDNs or external assets.**

### Deployment Scenario

```
Player clicks link → Browser requests index.html from static host
                  ↓
                  Static host serves index.html (< 1 KB)
                  ↓
                  Browser parses HTML, sees <script src="game.js">
                  ↓
                  Static host serves game.js (< 500 KB)
                  ↓
                  Browser parses and executes game.js
                  ↓
                  Game renders and is playable
                  
Total initial load: ~500 KB, ~2–3 seconds on 4G
Thereafter: All gameplay is local (no network)
```

---

## Hosting & Deployment Options

Since there are no backend dependencies, any static file host works:

| Host | Setup Time | Cost | Notes |
|------|-----------|------|-------|
| GitHub Pages | 10 min | Free | Built into GitHub; one `git push` to deploy |
| Netlify | 15 min | Free tier | Continuous deployment on git push; very smooth |
| Vercel | 15 min | Free tier | Optimized for static files; great DX |
| AWS S3 + CloudFront | 30 min | ~$0.50/month | Manual setup; most control |
| Apache/nginx server | 20 min | Your own server | Any traditional web host works |
| Anywhere HTTP | Varies | Varies | Any URL that serves static files |

**Recommendation:** GitHub Pages or Netlify for simplicity; no additional steps.

---

## Security Considerations

### No Security Vulnerabilities from External Dependencies

Since there are no runtime npm dependencies:
- ✅ No dependency tree to audit
- ✅ No transitive vulnerabilities
- ✅ No package supply-chain risk
- ✅ No code injection via compromised packages

### Potential Security Exposure (Negligible Risk)

| Exposure | Risk | Mitigation |
|----------|------|-----------|
| Data stored in localStorage | Low (single-device game) | localStorage data is per-origin and encrypted by browser |
| High-score manipulation | Low (local play only) | localStorage accessible to console; not a security risk for arcade game |
| Canvas rendering XSS | Negligible (all code is ours) | No user-supplied HTML rendered; all drawing is programmatic |
| Audio data injection | Negligible (all audio is embedded) | No streaming from untrusted sources |

### Deployment Security

- **Static hosting is inherently secure:** No code execution on server
- **HTTPS recommended:** Use HTTPS to prevent man-in-the-middle attacks on game.js download
- **CSP (Content Security Policy):** Optional; can set strict CSP since no external scripts loaded

---

## Scalability & Performance

### Client-Side Only = Unlimited Scalability

**No backend bottleneck.**
- 1 player or 1 million players: no server load
- Deploy to CDN: no infrastructure scaling needed
- Concurrent players: unlimited (each client is independent)

### Network Scalability

**Bandwidth required:**
- Per player: ~500 KB (one-time download of game.js)
- Per host (1000 concurrent players): ~500 MB/hour typical
- CDN handles automatic geographic distribution and caching

**Cost per 1000 players:** ~$1–5/month (typical CDN rates)

### Local Performance

**Frame rate targets (per NFR1.1, NFR1.2):**
- Target: 60 fps (requestAnimationFrame adaptive)
- Minimum: 30 fps (acceptable degradation on slow devices)
- Typical 2018+ device: easily maintains 60 fps (simple 2D graphics)
- Optimization focus: Physics loop (component bottleneck), not rendering

---

## Operational Dependencies

### No Operational Monitoring Required

Since there's no backend:
- ✅ No error tracking (client logs to console)
- ✅ No performance monitoring
- ✅ No uptime monitoring (CDN uptime is monitored separately)
- ✅ No database backups
- ✅ No capacity planning

### Minimal Operational Overhead

**Post-launch tasks:**
1. Monitor static host uptime (CDN provider handles this)
2. Review any error reports from players (captured in console)
3. Plan next feature release (if scope expands)

---

## Dependency Graph Summary

```
┌─────────────────────────────────────────────────────────────┐
│                   Flappy Kiro (Browser Game)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Browser Built-in APIs (100% reliable)       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Canvas 2D Context (rendering)                     │  │
│  │  • requestAnimationFrame (timing)                    │  │
│  │  • Web Audio API (optional audio)                    │  │
│  │  • localStorage (optional persistence)               │  │
│  │  • Keyboard Events (input)                           │  │
│  │  • Image API (sprite loading)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Build Tools (dev-time only, not shipped)       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Bundler (esbuild/webpack) → game.js              │  │
│  │  • Test Framework (Jest) → verification              │  │
│  │  • Linter (ESLint) → quality gates                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   (No dependencies!)
         Perfect for static hosting deployment
```

**Bottom line:** Flappy Kiro has ZERO runtime dependencies and depends only on browser-standard APIs. Perfect for a self-contained arcade game.
