# Intent Statement: Flappy Kiro

## Problem Statement

This is a workshop project and demonstration initiative [Q1]. The goal is to showcase how AI-DLC methodology structures game development through a hands-on, learnable example [Q4]. By building a familiar, arcade-style game mechanic, we create an end-to-end reference implementation that can serve as both a learning tool and proof of concept for the AI-DLC workflow [Q3].

## Target Customer

Casual mobile game players [Q2] will be the primary audience, though the secondary purpose is to demonstrate the AI-DLC development lifecycle to teams and practitioners interested in how structured, agent-driven development can orchestrate game creation.

## Success Metrics

Success is measured by:
- Creating a polished, playable arcade game that faithfully implements the core Flappy Bird mechanics [Q3]
- Demonstrating clear learning outcomes: how a game project flows through ideation, design, and construction phases
- Producing artifacts (intent statements, requirements, design specs, code) that exemplify structured development practices
- Shipping a complete, testable, deployable product within the scope

## Initiative Trigger

This initiative was triggered by the desire to demonstrate and validate the AI-DLC workflow through a concrete, approachable example [Q4]. Workshop projects serve as hands-on learning vehicles; Flappy Kiro is designed to be clear enough for a first-time practitioner to follow, yet rich enough to exercise the full methodology.

## Initial Scope Signal

**Workflow-selected scope**: `flappy-kiro-game` [scope]

**User-confirmed product boundary**: The same scope matches the intended product—an arcade-style game featuring a controllable ghost character navigating procedurally-placed obstacles [Q8].

## Core Game Mechanics

Flappy Kiro is a simple but engaging arcade game with these core mechanics [desc]:
- **Player Character**: Ghosty, a ghost sprite controlled by the player
- **Movement**: Ghosty moves persistently to the right at a constant rate
- **Control Input**: Player taps the spacebar to make Ghosty ascend; when the spacebar is not held, Ghosty descends due to gravity
- **Obstacles**: Walls with equally-sized gaps positioned at random heights across the game world
- **Scoring**: Each successful passage through a wall gap awards one point
- **Failure Condition**: Collision with any wall or the ground ends the game

## Assumptions & Open Questions

None.
