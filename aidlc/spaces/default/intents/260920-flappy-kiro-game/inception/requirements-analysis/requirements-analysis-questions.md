# Requirements Analysis Questions

## Sources

- [desc] Initial description: "I want to build a Flappy Bird clone called Flappy Kiro. Flappy Kiro is an arcade-style game in which the player controls a ghost called Ghosty, which moves persistently to the right. They are tasked with navigating Ghosty through a series of walls that have equally sized gaps placed at random heights. Ghosty automatically descends and only ascends when the player taps the spacebar. Each successful pass through a pair of walls awards the player one point. Colliding with a wall or the ground ends the gameplay."
- [scope] Workflow-selected scope: `flappy-kiro-game`.

## Q1. Target Platform & Deployment

The intent mentions "casual mobile game players" but your core mechanic is spacebar-based (keyboard). Which deployment target is primary?

[Answer]: A. Web browser (desktop or laptop, keyboard input)

A. Web browser (desktop or laptop, keyboard input)
B. Mobile web (responsive browser on phone/tablet, tap input)
C. Native mobile app (iOS/Android, tap input)
D. Desktop standalone app (Windows/Mac, keyboard input)
E. Multiple platforms equally
X. Other (please specify)

## Q2. Display & Visual Scale

What are the target screen dimensions and aspect ratio?

[Answer]: A. Standard desktop (1920×1080 or similar landscape)

A. Standard desktop (1920×1080 or similar landscape)
B. 16:9 widescreen (laptop/desktop)
C. Mobile portrait (9:16, phone held vertically)
D. Mobile landscape (16:9, phone held horizontally)
E. Not yet decided — scale for standard desktop first
X. Other (please specify)

## Q3. Top-Boundary Behavior

The review flagged that top-boundary behavior was unspecified. Does Ghosty collide with a ceiling, or can it fly indefinitely upward?

[Answer]: A. Ghosty collides with a top boundary (ceiling) and the game ends

A. Ghosty collides with a top boundary (ceiling) and the game ends
B. There is no top boundary — Ghosty can fly upward indefinitely
C. Ghosty has a ceiling but collision does NOT end the game (warning or bounce)
D. Not yet decided
X. Other (please specify)

## Q4. Measurable Quality Targets

The review noted a lack of measurable product quality metrics. Which of these success criteria matter most?

[Answer]: A. Frame rate: game runs at ≥30 fps minimum

A. Frame rate: game runs at ≥30 fps minimum
B. Frame rate: game runs at ≥60 fps target
C. Collision accuracy: detects wall/player contact within 1 sprite width
D. First-time playability: new player can complete one run without instructions
E. No crash conditions in normal gameplay
X. Other (please specify)

## Q5. Difficulty Progression

Should the game get harder over time, or stay constant?

[Answer]: A. Constant difficulty — same obstacle speed and gap spacing throughout

A. Constant difficulty — same obstacle speed and gap spacing throughout
B. Progressive difficulty — gap size narrows or scroll speed increases over time
C. Multiple difficulty levels (easy/normal/hard) selectable at start
D. Not yet decided
X. Other (please specify)

## Q6. Scoring & Persistence

How should the game handle high scores and game state?

[Answer]: B. Scores persisted to browser local storage (survives page refresh)

A. Scores calculated but not persisted (lost when game ends or page refreshes)
B. Scores persisted to browser local storage (survives page refresh)
C. Scores submitted to a backend server (persistent across devices)
D. Not yet decided
X. Other (please specify)

## Q7. Restart & Menu Behavior

After the game ends, what should happen?

[Answer]: C. Show final score, high score, and menu options

A. Game immediately resets and can be played again (no menu)
B. Show final score and a "Play Again" button
C. Show final score, high score, and menu options
D. Not yet decided
X. Other (please specify)

## Q8. Sound & Accessibility

Should the game include sound effects and music?

[Answer]: C. Optional sound (player can toggle on/off)

## Consolidated Summary Confirmation

- Deployment: Web browser (desktop, keyboard input)
- Display: Standard desktop (1920×1080 landscape)
- Top boundary: Ghosty collides with ceiling and game ends
- Quality targets: Frame rate ≥30 fps minimum
- Difficulty: Constant throughout
- Scoring: Persisted to browser local storage
- Game end flow: Show final score, high score, and menu options
- Sound: Optional (player can toggle)

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
