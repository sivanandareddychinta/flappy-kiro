# Units Generation Questions — Flappy Kiro

## Unit Boundary Strategy

**Q1: How should we group the 9 logical components into deployable units?**

The 9 components (GameLoop, Player, Physics, Obstacles, Scoring, Rendering, Audio, Input, Persistence) are logically separated but need to be deployed together as a single browser-based game. Should we:
- A) Deploy as one monolithic unit (all 9 in one package)?
- B) Split by domain concern (game-engine unit + presentation unit + persistence unit)?
- C) Keep all in one unit but layer them into independent modules for testing?

[Answer]: A) Monolithic unit — all 9 components in one deployable package.

---

## Unit Granularity

**Q2: For a browser game with no service deployment requirements, what granularity makes sense?**

Given that Flappy Kiro is a client-side-only game with no backend services, should units be:
- Large (one unit = all game logic + rendering)?
- Medium (separate units for logic vs. UI)?
- Fine-grained (one unit per component)?

[Answer]: Large — one unit encompassing all 9 components as decided in Q1.

---

## Integration Points

**Q3: What are the key integration contracts between units?**

If we split units at all, what contracts must be defined between them? Examples:
- GameLoop → Physics API (apply gravity, collision detection)
- Rendering → Scoring API (query current/high score)
- Audio → Input API (listen for flap events)

[Answer]: N/A — monolithic unit, so all integration is internal. No external contracts.

---

## Deployment Model

**Q4: Deployment model for a client-side game?**

How should units deploy?
- Monolithic (bundle everything into one .js file)?
- Modular (separate .js modules loaded by an HTML entry point)?
- No preference (defer to Construction)?

[Answer]: Monolithic .js bundle. Single deployable file.

---

## Confirmation

Does the above unit strategy align with the 9-component domain design from stage 2.6?

[Answer]: Looks correct


---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

[Answer]: Looks correct
