# Contract Design Questions — Flappy Kiro

## Context

Flappy Kiro (U1) is a single, monolithic browser-based game with no inter-unit dependencies. All 9 components (GameLoop, Player, Physics, Obstacles, Scoring, Rendering, Audio, Input, Persistence) are packaged together.

**Contracts to define:**
1. **Public/External API** — the contract between the game and external consumers (browser, player)

Since U1 has no inter-unit dependencies, there are no inter-unit contracts.

---

## Questions

**Q1. Game HTML Entry Point and Bundle Structure**

How should the game be deployed to the browser? What is the structure of the public static files?

- A. Single `index.html` that includes an inline `<script>` tag with the complete bundled game code
- B. Single `index.html` that includes a `<script src="game.js">` reference to a separate bundled JavaScript file (static)
- C. HTML plus CSS plus JS (three files), with CSS for styling and JS for game logic
- D. HTML plus a modular JavaScript structure (multiple .js files loaded via separate script tags)
- E. Other (please specify)

[Answer]:

---

**Q2. Game Input Interface — User to Game Contract**

What is the formal contract for how the player sends input to the game?

- A. Keyboard-only: spacebar to flap, arrow keys for menu navigation, enter for confirmation
- B. Keyboard-only: spacebar to flap, mouse click on UI buttons for menu
- C. Keyboard + mouse: spacebar to flap, mouse click anywhere on game canvas to flap (alternative)
- D. Keyboard + touch: spacebar to flap on keyboard, touch screen to flap on mobile
- E. Other (please specify)

[Answer]:

---

**Q3. Game Output — Visual Contract (Canvas)**

What does the game render to the browser? What are the rendering modes?

- A. Single fullscreen canvas that fills the viewport; game renders at fixed logical resolution and scales to fit
- B. Fixed-size canvas (e.g., 1280x720px) centered on the page, no scaling
- C. Responsive canvas that resizes with the window and re-renders accordingly
- D. Multiple layers: background canvas, game canvas, UI canvas (stacked)
- E. Other (please specify)

[Answer]:

---

**Q4. Asset Loading and Distribution**

How are game assets (sprites, audio files) delivered to the browser?

- A. Embedded as base64 data URIs in the bundled JavaScript file (no separate asset files)
- B. Separate asset files (images in /images/, audio in /audio/) served from the same static directory as index.html
- C. Assets loaded from a CDN with CORS headers (external content delivery)
- D. Sprites generated procedurally in code; audio loaded from embedded data URIs
- E. Other (please specify)

[Answer]:

---

**Q5. Game State Persistence — High Score Contract**

How is the high score persisted and where is it stored?

- A. Browser localStorage only; game saves and loads high score from localStorage.getItem('highScore')
- B. localStorage + optional remote sync to a backend API (not implemented in MVP, placeholder for future)
- C. IndexedDB for larger storage capacity
- D. Cookies stored on the domain
- E. Other (please specify)

[Answer]:

---

**Q6. Audio Output Contract**

How does the game deliver audio to the player?

- A. Web Audio API (AudioContext) for all sounds (flap, point, collision, background music)
- B. HTML5 `<audio>` tags for background music; Web Audio API for sound effects
- C. Mute toggle stored in localStorage so muted state persists across page reloads
- D. No audio (game is silent by default; audio is optional/stretch goal)
- E. Other (please specify)

[Answer]:

---

**Q7. Game Loop Timing — Frame Rate Contract**

What is the formal timing contract for the game loop?

- A. Uses `requestAnimationFrame()` to sync with browser refresh rate (60 fps on most displays, adaptive)
- B. Fixed timestep of 16.67ms per frame (60 fps), independent of display refresh rate
- C. Variable timestep: deltaTime passed to physics and component updates to handle variable frame rates
- D. Target 30 fps minimum per NFR1.1, aim for 60 fps per NFR1.2, adaptive based on device performance
- E. Other (please specify)

[Answer]:

---

**Q8. Error Handling and Boundary Conditions**

What is the contract for handling errors, missing assets, or unsupported browsers?

- A. Fail silently if assets don't load; show "Game Not Available" message if required assets are missing
- B. Log errors to browser console; show error message to player if critical (e.g., canvas not supported)
- C. Graceful degradation: no audio if Web Audio API not available; game still playable
- D. Detailed error reporting: display JSON error object on page if game fails to initialize
- E. Other (please specify)

[Answer]:

---

**Q9. Menu and Navigation Contract**

How does the UI menu communicate with the game?

- A. Integrated canvas-based menu: all UI (ready screen, game over screen) drawn on the same canvas
- B. Separate HTML elements layered on top of canvas with CSS positioning; canvas renders game scene behind
- C. Separate modal window opened for settings/menu (new browser window or overlay)
- D. Menu state managed by GameLoop; transitions between ready/playing/ended states control UI rendering
- E. Other (please specify)

[Answer]:

---

**Q10. Deployment and Distribution**

What is the public API surface for deploying the game?

- A. Static files only: game.js + index.html served from any static web server (no backend required)
- B. Docker container with Node/Express serving static files + game
- C. Bundled .zip file containing index.html and game.js for local deployment
- D. NPM package or GitHub release with downloadable artifacts
- E. Other (please specify)

[Answer]:

---

## Consolidated Summary Confirmation

**Q1. HTML Entry Point:** Separate bundled JavaScript file (index.html + game.js)

**Q2. Input Interface:** Keyboard-only (spacebar to flap, arrow keys + enter for menu)

**Q3. Visual Output:** Single fullscreen canvas with fixed logical resolution, scales to viewport

**Q4. Asset Distribution:** Embedded as base64 data URIs in game.js (single bundle)

**Q5. High Score Persistence:** Browser localStorage only

**Q6. Audio Output:** Web Audio API for all sounds (effects + music)

**Q7. Game Loop Timing:** Variable timestep with requestAnimationFrame (adaptive frame rate)

**Q8. Error Handling:** Graceful degradation (no audio if unavailable); fail safely for critical APIs

**Q9. Menu & Navigation:** Canvas-based UI integrated with game rendering

**Q10. Deployment:** Static files only (no backend, pure static hosting)

**Does this all look correct before I generate the contract artifact?**

[Answer]: Looks correct
