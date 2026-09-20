---
name: flappy-kiro-game
depth: Standard
keywords: []
description: "Greenfield browser game — from intent through tested implementation"
skeleton: off
review_cap: advisory
change_control: relaxed
---

# flappy-kiro-game scope

Custom scope for building the Flappy Kiro browser game from scratch. It runs a focused Ideation → Inception → Construction arc: capture the intent, define the game's requirements, design the domain (game loop, physics, entities), decompose into units, plan delivery, generate the code, and verify it. Operation stages are omitted — a client-side browser game has no deployment pipeline or server infrastructure to provision.

Change Control defaults to relaxed: an input that changes after approval is recorded and announced in one line, and the run continues.

## Why these stages, why skip those

The game is greenfield with a clear scope (Flappy Bird clone starring Kiro), so the heavy ideation discovery ceremony (market-research, feasibility, scope-definition, team-formation, rough-mockups, approval-handoff) is skipped — intent-capture resolves ambiguity cheaply. Reverse engineering is skipped because there is no existing codebase to map. Practices discovery is skipped; conventions will be established inline during code generation. NFR stages and infrastructure design are skipped — the game has no regulated non-functionals and no server infrastructure. The CI pipeline and all Operation stages are skipped; a static browser game ships without a deployment pipeline. The kept Inception stages (requirements-analysis, domain-design, units-generation, contract-design, delivery-planning) plus functional-design in Construction give the build a complete, traceable design spine before code is written.

## Membership

Initialization (3), intent-capture, requirements-analysis, domain-design, units-generation, contract-design, delivery-planning, functional-design, code-generation, build-and-test execute — 13 stages total. All other stages are SKIP.
