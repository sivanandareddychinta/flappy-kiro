# Contract Summary — Flappy Kiro

## Overview

Flappy Kiro (Unit U1) is a single, monolithic browser-based game with no inter-unit boundaries. This contract document defines the **public/external API** — the agreement between the game and external consumers (web browsers and players).

**Contract Count:** 1 public/external API boundary

**Mechanisms:** HTML + JavaScript (static files), Keyboard Input, Canvas Rendering, Web Audio API, Browser localStorage

**Ownership:** U1 (Flappy Kiro Game) owns the entire contract surface.

---

## Contracts Table

| # | Provider | Consumer | Mechanism | Owner |
|----|----------|----------|-----------|-------|
| 1 | U1 (Flappy Kiro) | External: Browser/Player | HTML5 Canvas + Keyboard Input + Web Audio + localStorage | U1 |

---

## Contract 1: Flappy Kiro Public Game API

**Provider Unit:** U1 (Flappy Kiro Game)

**External Consumer:** Web Browser (player interaction surface)

**Mechanism:** Multi-protocol (HTML/JavaScript, Canvas 2D, Keyboard Events, Web Audio API, localStorage)

---

### 1.1 Static File Deployment

```yaml
delivery:
  format: Static HTML + JavaScript
  files:
    - index.html: Entry point, minimal HTML page that loads game.js
    - game.js: Bundled, minified JavaScript containing all 9 components and assets
  hosting: Any static HTTP/HTTPS server (GitHub Pages, S3, Netlify, nginx, etc.)
  dependencies: None (no backend required)
  
index.html_contract:
  structure: Minimal HTML5 page with single <canvas> element and <script src="game.js"> tag
  viewport: meta viewport for responsive scaling; initial-scale=1.0
  canvas_id: "gameCanvas" (or equivalent identifier for game rendering target)
  asset_embedding: All assets (sprites, audio) are embedded as base64 data URIs within game.js
  
game.js_contract:
  content: Complete bundled game code
  exports: Global object exposing game lifecycle
    - Game.init(canvasElement): Initialize and start game
    - Game.destroy(): Cleanup and stop game
  bundle_size: Target < 500 KB (minified + gzipped for production)
  browser_support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (ES6 support required)
```

---

### 1.2 Player Input Interface (Keyboard)

```yaml
keyboard_contract:
  input_device: Keyboard only (no mouse or touch in MVP)
  
  gameplay_input:
    spacebar:
      event: keydown (spacebar / space)
      action: Flap (apply upward impulse to Ghosty)
      context: Accepted in playing state only
      effect: Immediate; registered within the same frame
    
  menu_input:
    arrow_up:
      event: keydown (up arrow)
      action: Navigate menu up (cycle through options)
      context: Ready and ended states
    
    arrow_down:
      event: keydown (down arrow)
      action: Navigate menu down (cycle through options)
      context: Ready and ended states
    
    enter:
      event: keydown (return / enter)
      action: Select highlighted menu option (start game, restart, etc.)
      context: Ready and ended states
  
  event_timing: Input events are polled each frame; multiple key presses in one frame are coalesced
  key_repeat: Standard OS key repeat applies; game does not distinguish between key press and hold
```

---

### 1.3 Game Rendering (Canvas Output)

```yaml
canvas_rendering_contract:
  target_element: HTML5 Canvas element (id="gameCanvas")
  rendering_api: Canvas 2D Context (CanvasRenderingContext2D)
  
  logical_resolution:
    width: 1280 px (logical game coordinates)
    height: 720 px (logical game coordinates)
    aspect_ratio: 16:9 (landscape)
  
  scaling_strategy:
    algorithm: Fit to viewport with aspect ratio maintained
    scaling_factor: calculated as min(window.innerWidth / 1280, window.innerHeight / 720)
    letterboxing: Black bars may appear on ultrawide or portrait displays
    responsive: Canvas scales on window resize; game loop handles scaling automatically
  
  screen_states:
    ready:
      content: Title screen with "Flappy Kiro" and "Press Spacebar to Start"
      background: Game background sprite
      sprites_rendered: Static (no animation in ready state)
    
    playing:
      content: Ghosty (player character), walls with gaps, score display, background
      background: Scrolling/parallax game background
      sprites_rendered:
        - Ghosty at current position and rotation (if applicable)
        - Walls (top and bottom segments with centered gap)
        - Score in top-center or corner
      frame_rate: 60 fps target (adaptive; min 30 fps per NFR1.1)
    
    ended:
      content: Final score, high score, "Game Over" text, menu (Restart or Menu)
      background: Game background sprite (darkened or overlay)
      sprites_rendered: Final score, high score, restart/menu buttons
  
  frame_timing:
    sync: requestAnimationFrame (syncs with browser refresh rate)
    adaptive_frame_rate: Automatically scales to device capabilities (30–60 fps)
    delta_time: Each frame receives elapsed time (deltaTime) for physics accuracy
  
  color_space: sRGB (standard web color space)
  antialiasing: Browser default (typically enabled for scaled content)
```

---

### 1.4 Game State & Asset Loading

```yaml
asset_loading_contract:
  asset_format: Base64 data URIs embedded in game.js
  
  sprites:
    ghosty: PNG sprite sheet (character sprite, animations)
    walls: PNG sprite (wall segments for top/bottom obstacles with gap)
    background: PNG sprite (parallax background)
    ui_elements: PNG sprites (buttons, score display, title text)
  
  audio:
    flap_sound: WAV or MP3 (short, ~100ms) embedded as base64 URI
    point_sound: WAV or MP3 (short, ~200ms) embedded as base64 URI
    collision_sound: WAV or MP3 (short, ~150ms) embedded as base64 URI
    background_music: MP3 (loop-ready) embedded as base64 URI
  
  loading_behavior:
    timing: All assets loaded during game.js parsing (before game.init() is called)
    blocking: Asset loading is synchronous; game starts only after all assets are ready
    error_handling: If any asset fails to load, game displays error message and does not initialize
  
  caching: Browser caches entire game.js file; assets persist in memory for duration of session
```

---

### 1.5 Audio Output (Web Audio API)

```yaml
web_audio_api_contract:
  api: Web Audio API (AudioContext)
  fallback: None (game requires Web Audio API support)
  
  sound_effects:
    flap:
      trigger: Input.onFlap() or Player.flap() called
      timing: Plays immediately (< 10ms latency target)
      duration: ~100ms
      volume: 0.6 (configurable via mute toggle)
    
    point:
      trigger: Scoring.addPoint() called (Ghosty passes through wall gap)
      timing: Plays immediately
      duration: ~200ms
      volume: 0.5 (configurable via mute toggle)
    
    collision:
      trigger: GameLoop detects collision (Ghosty hits wall or ground)
      timing: Plays immediately
      duration: ~150ms
      volume: 0.7 (configurable via mute toggle)
  
  background_music:
    trigger: Game enters playing state (after first flap)
    looping: true (continuous loop during gameplay)
    volume: 0.3 (background; lower than effects)
    fade_out: Stops gracefully when game ends
  
  mute_toggle:
    trigger: Settings menu or hotkey (if exposed; default unmuted)
    behavior: Stops all playback immediately when muted; resumes when unmuted
    persistence: Mute state saved to localStorage key "gameMuted" (true/false)
    
  error_handling:
    missing_web_audio_api: Game still playable; audio silently skipped (graceful degradation)
    speaker_unavailable: Game continues; no playback (OS/browser level)
```

---

### 1.6 Game State Persistence (localStorage)

```yaml
local_storage_contract:
  storage_backend: Browser localStorage (not IndexedDB, not cookies, not remote)
  namespace: "flappyKiro" (prefix for all keys to avoid conflicts)
  
  persisted_data:
    high_score:
      key: "flappyKiro.highScore"
      value_type: JSON number
      default_value: 0
      persistence_timing: Written when current score exceeds high score at game end
      read_timing: Loaded at game initialization
      scope: Persists across browser sessions and page reloads
    
    mute_toggle_state:
      key: "flappyKiro.gameMuted"
      value_type: JSON boolean
      default_value: false
      persistence_timing: Written when player toggles mute
      read_timing: Loaded at game initialization
  
  storage_limits:
    typical_quota: 5–10 MB per origin (browser dependent)
    flappy_kiro_usage: < 1 KB (only two small values stored)
    quota_exceeded_behavior: Game continues; score not persisted (warning logged to console)
  
  recovery:
    corrupted_data: Parse errors treated as missing; default values used
    missing_keys: Treated as first play; default values applied
    privacy_mode: Storage may be unavailable in private/incognito windows (graceful degradation)
```

---

### 1.7 Game Loop & Timing

```yaml
game_loop_contract:
  orchestrator: GameLoop component
  
  frame_scheduling:
    method: window.requestAnimationFrame (callback scheduled before next repaint)
    frame_rate: Adaptive (syncs with browser refresh rate, typically 60 fps)
    frame_rate_range: 30–60 fps (per NFR1.1 and NFR1.2)
    
  frame_callback_sequence:
    1. Input polling (keyboard state captured)
    2. Player update (position, velocity, flap response to input)
    3. Physics simulation (gravity, collision detection)
    4. Obstacles update (spawning, positioning)
    5. Scoring checks (pass-through detection, point awarding)
    6. Rendering (draw current frame to canvas)
    7. Audio emission (sound effects triggered by events)
  
  state_machine:
    ready:
      description: Waiting for player to start (initial state)
      transitions:
        - on spacebar press → playing
        - on enter (menu) → ready (no action)
    
    playing:
      description: Active gameplay
      transitions:
        - on collision (wall/ground) → ended
        - on manual pause (if implemented) → paused
    
    ended:
      description: Game over; score and high score displayed
      transitions:
        - on enter (Restart) → ready
        - on enter (Menu) → ready
  
  delta_time_semantics: Each frame receives elapsed time since previous frame (in milliseconds)
    - physics integrators receive delta_time for accurate motion simulation
    - allows game logic to work correctly even if frame rate varies
  
  frame_rate_independence: All motion and timing is delta_time aware; frame rate can fluctuate without breaking physics
```

---

### 1.8 Error Handling & Browser Compatibility

```yaml
error_handling_contract:
  critical_failures:
    canvas_unsupported:
      detection: canvas element not supported or context creation fails
      behavior: Game does not initialize; error message displayed to user
      message: "Your browser does not support Canvas. Please use a modern browser (Chrome, Firefox, Safari, Edge)."
      user_action: Upgrade browser
    
    requestAnimationFrame_unsupported:
      detection: browser does not support requestAnimationFrame
      behavior: Game does not initialize
      message: "Your browser does not support requestAnimationFrame. Please upgrade to a modern browser."
    
    assets_fail_to_load:
      detection: Sprite or audio asset fails to parse (corrupted data URI)
      behavior: Game init fails; error logged
      message: "Failed to load game assets. Please reload the page."
  
  graceful_degradations:
    web_audio_api_unavailable:
      behavior: Game starts normally; audio is silently skipped
      impact: No sound effects or background music; gameplay unaffected
      detection: AudioContext constructor throws or is unavailable
      user_visible: No error message; game plays silently
    
    local_storage_unavailable:
      behavior: Game plays normally; high score not persisted
      impact: High score resets on page reload
      detection: localStorage.setItem() throws (quota exceeded or disabled)
      user_visible: Warning logged to console (not user-visible)
    
    speaker_unavailable_or_muted:
      behavior: Game continues; no audio output
      detection: OS/browser level; not detected by game
      impact: No sound effects or music
  
  logging:
    console_errors: All detected failures logged to browser console
    error_level: console.error() for critical failures; console.warn() for degradations
    format: "[Flappy Kiro] <error message>"
    retention: Logs visible only in browser DevTools (not persisted)
```

---

### 1.9 Browser Compatibility Matrix

```yaml
supported_browsers:
  chrome:
    minimum_version: 90
    apis_required: Canvas 2D, requestAnimationFrame, Web Audio API, localStorage, ES6
    tested_platforms: Windows, macOS, Linux
  
  firefox:
    minimum_version: 88
    apis_required: Canvas 2D, requestAnimationFrame, Web Audio API, localStorage, ES6
    tested_platforms: Windows, macOS, Linux
  
  safari:
    minimum_version: 14
    apis_required: Canvas 2D, requestAnimationFrame, Web Audio API, localStorage, ES6
    tested_platforms: macOS, iOS
  
  edge:
    minimum_version: 90
    apis_required: Canvas 2D, requestAnimationFrame, Web Audio API, localStorage, ES6
    tested_platforms: Windows, macOS
  
  mobile_browsers:
    ios_safari: Version 14+
    chrome_mobile: Version 90+
    firefox_mobile: Version 88+
    edge_mobile: Version 90+
  
  unsupported_browsers:
    ie: Internet Explorer (all versions) — Canvas 2D limited; no Web Audio API
    legacy_safari: < 14 — Incomplete ES6 support
    legacy_chrome: < 90 — Legacy API surfaces
  
  responsiveness:
    approach: Fullscreen canvas scales to viewport; responsive design automatic
    portrait_mode: Game renders in letterbox (black bars on sides) to maintain 16:9 aspect
    mobile_input: Touch/gestures NOT supported (keyboard-only input contract)
```

---

## Contract Ownership & Change Policy

### Contract Ownership

**U1 (Flappy Kiro Game)** owns the entire public API contract. The contract is owned and maintained by the development team building U1.

### Breaking Changes

A breaking change is any modification that invalidates existing players' sessions or requires environment reconfiguration. Examples:
- Changing the canvas element ID (breaks HTML integrations)
- Removing spacebar input support (breaks player expectations)
- Changing localStorage keys (loses existing high scores)
- Removing Web Audio API graceful degradation (breaks private-mode play)

Breaking changes are avoided whenever possible. If unavoidable, they are:
1. Announced in release notes with migration guidance
2. Versioned (e.g., game.v2.js if backward compatibility cannot be maintained)
3. Considered only for major version releases (not patches)

### Additive Changes (Safe)

Additive changes are always safe and require no coordination:
- Adding new sound effects or audio options
- Adding new visual themes or background images
- Improving error messages
- Adding new menu options or settings
- Expanding localStorage to store additional optional data

Consumers ignore unknown fields and features gracefully.

### Versioning

The contract version is embedded in the game.js bundle as a constant:
```javascript
GAME_VERSION = "1.0.0"
```

Version format: MAJOR.MINOR.PATCH (semantic versioning)
- MAJOR: Breaking changes to the contract
- MINOR: Additive changes (new features, new optional state)
- PATCH: Bug fixes and internal improvements (no contract changes)

---

## Open Questions & Resolutions

No open questions remain. All contract surfaces have been pinned:

| Contract Surface | Question | Resolution |
|------------------|----------|-----------|
| HTML entry point | Inline vs. separate JS? | **Separate game.js (decided Q1)** |
| Input interface | Keyboard only or multi-modal? | **Keyboard-only (decided Q2)** |
| Canvas rendering | Fixed or responsive? | **Responsive with fixed logical resolution (decided Q3)** |
| Asset embedding | Separate or bundled? | **Bundled as data URIs (decided Q4)** |
| Persistence | localStorage or backend? | **localStorage only (decided Q5)** |
| Audio API | Web Audio or HTML5 Audio? | **Web Audio API (decided Q6)** |
| Frame timing | Fixed or adaptive? | **Adaptive with requestAnimationFrame and variable deltaTime (decided Q7)** |
| Error handling | Fail or degrade? | **Graceful degradation for optional features (decided Q8)** |
| Menu UI | Canvas or HTML overlay? | **Canvas-based (decided Q9)** |
| Deployment | Static or containerized? | **Static files only (decided Q10)** |

---

## Implementation Notes

### For Code Generation (Stage 3.5)

1. **Bundle entry point:** Create a `src/index.ts` or `src/index.js` that exports a `Game` object with `init(canvasElement)` and `destroy()` methods
2. **Asset embedding:** Use a build tool (webpack, Rollup, esbuild) to convert image and audio files to base64 data URIs
3. **Canvas setup:** In `Rendering.init()`, expect a canvas element passed from HTML and store a 2D context reference
4. **Keyboard setup:** In `Input.init()`, attach listeners to `window.keydown` and `window.keyup` events
5. **Web Audio setup:** In `Audio.init()`, create an `AudioContext` and handle initialization delay (user gesture required on some browsers)
6. **localStorage setup:** In `Persistence.init()`, wrap calls to `localStorage.getItem/setItem` with try/catch to handle quota exceeded and private mode

### For Testing (Stage 3.6)

1. **Contract validation tests:** Verify that `Game.init(canvasElement)` successfully initializes and returns without errors
2. **Input contract tests:** Verify that spacebar keydown triggers flap events; arrow keys trigger menu navigation
3. **Rendering contract tests:** Verify that canvas rendering completes each frame without errors; DOM structure matches expected
4. **Audio contract tests:** Verify that Web Audio API graceful degradation works (game starts even if AudioContext fails)
5. **Persistence contract tests:** Verify that high score is saved to and loaded from localStorage; mute state persists
6. **Timing contract tests:** Verify that frame timing is adaptive and respects deltaTime for physics

### For Deployment (Stage 4.1+)

1. **Static hosting setup:** Ensure index.html and game.js are served with correct MIME types (`text/html` and `application/javascript`)
2. **CORS headers:** If assets are hosted on a CDN, ensure CORS headers allow cross-origin loading
3. **Cache headers:** Set appropriate `Cache-Control` headers for versioned bundles (game.v1.0.0.js can have long TTL; index.html should have short TTL)
4. **HTTPS:** Serve over HTTPS (required for Web Audio API on some browsers)

---

## Summary

The Flappy Kiro public API contract defines a complete, standalone browser game delivered as static HTML and JavaScript files. The contract spans deployment, input, rendering, audio, persistence, timing, and error handling. All contracts are owned by U1 and have been formally pinned with no ambiguities remaining.

**Status:** ✅ COMPLETE

**Handoff:** Ready for Functional Design (Stage 3.1) and Code Generation (Stage 3.5)
