/**
 * Flappy Kiro — GameLoop Component
 *
 * Orchestrates the entire game: initializes all components, runs the
 * requestAnimationFrame loop, manages the READY → PLAYING → ENDED state
 * machine, and handles state transitions.
 *
 * Components are created internally by default, but can be injected via
 * the second argument to init() for testing.
 */
import { GameState, DEFAULT_SETTINGS, WORLD } from './types.js'
import { Physics } from './Physics.js'
import { Player } from './Player.js'
import { Obstacles } from './Obstacles.js'
import { Scoring } from './Scoring.js'
import { Input } from './Input.js'
import { Audio } from './Audio.js'
import { Persistence } from './Persistence.js'
import { Rendering } from './Rendering.js'

export class GameLoop {
  constructor() {
    this.state = GameState.READY
    this.canvas = null
    this.lastTimestamp = null
    this.rafId = null
    this.isRunning = false

    // Components (initialized in init())
    this.physics = null
    this.player = null
    this.obstacles = null
    this.scoring = null
    this.input = null
    this.audio = null
    this.persistence = null
    this.rendering = null
  }

  /**
   * Initialize all components and start the game loop.
   * @param {HTMLCanvasElement} canvas
   * @param {object} [overrides] - Optional component overrides for testing
   */
  init(canvas, overrides = {}) {
    this.canvas = canvas

    // Initialize components (use injected overrides if provided)
    this.physics    = overrides.physics    || new Physics()
    this.player     = overrides.player     || new Player(this.physics)
    this.obstacles  = overrides.obstacles  || new Obstacles()
    this.persistence = overrides.persistence || new Persistence()
    this.scoring    = overrides.scoring    || new Scoring(this.persistence)
    this.input      = overrides.input      || new Input()
    this.audio      = overrides.audio      || new Audio()
    this.rendering  = overrides.rendering  || new Rendering()

    // Set up each component
    this.persistence.init()
    this.player.init()
    this.obstacles.init()
    this.scoring.init()
    this.input.init()
    this.audio.init()
    this.rendering.init(canvas)

    // Start in READY state
    this.state = GameState.READY
    this.isRunning = true
    this.lastTimestamp = null

    // Start the RAF loop
    this._scheduleFrame()
  }

  /**
   * The main game loop frame callback.
   * @param {number} timestamp - DOMHighResTimeStamp from requestAnimationFrame
   */
  run(timestamp) {
    if (!this.isRunning) return

    // Calculate delta time, capped at 50ms to prevent spiral-of-death on tab focus
    const deltaTime = this.lastTimestamp !== null
      ? Math.min(timestamp - this.lastTimestamp, 50)
      : 16.67
    this.lastTimestamp = timestamp

    // Poll input
    const inputState = this.input.pollInput()

    // Handle flap / state transitions
    if (inputState.flap) {
      this._handleFlapInput()
    }

    // Per-state update
    switch (this.state) {
      case GameState.READY:
        // Nothing to update in READY (waiting for spacebar)
        break

      case GameState.PLAYING:
        this._updatePlaying(deltaTime)
        break

      case GameState.ENDED:
        // Waiting for restart input (handled in _handleFlapInput above)
        break
    }

    // Render
    this._render()

    // Schedule next frame
    this._scheduleFrame()
  }

  /**
   * Stop the game loop and detach input handlers.
   */
  stop() {
    this.isRunning = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.input) {
      this.input.destroy()
    }
    if (this.audio) {
      this.audio.stopBackgroundMusic()
    }
  }

  /**
   * Return the current game state string.
   * @returns {string}
   */
  getState() {
    return this.state
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  _scheduleFrame() {
    if (!this.isRunning) return
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame((ts) => this.run(ts))
    }
  }

  _handleFlapInput() {
    switch (this.state) {
      case GameState.READY:
        this._startGame()
        break

      case GameState.PLAYING:
        this.player.flap()
        this.audio.playFlap()
        break

      case GameState.ENDED:
        this._resetGame()
        break
    }
  }

  _startGame() {
    this.state = GameState.PLAYING
    // Give the player an immediate flap on start
    this.player.flap()
    this.audio.playFlap()
    this.audio.playBackgroundMusic()
  }

  _resetGame() {
    this.player.init()
    this.obstacles.init()
    this.scoring.reset()
    this.scoring.init()
    this.state = GameState.READY
    this.lastTimestamp = null
  }

  _updatePlaying(deltaTime) {
    const scrollDistance = DEFAULT_SETTINGS.scrollSpeed * deltaTime

    // Update player physics
    const boundaryResult = this.player.update(deltaTime, WORLD)

    // Update obstacles
    this.obstacles.update(scrollDistance)

    // Check wall collisions
    const ghosty = this.player.getGhosty()
    const walls = this.obstacles.getWalls()

    let wallHit = false
    for (const wall of walls) {
      if (this.physics.wallCollisionCheck(ghosty, wall)) {
        wallHit = true
        break
      }
    }

    // Check scoring (player passing walls)
    this.scoring.checkPassage(ghosty, walls)

    // Transition to ENDED on any collision
    if (!ghosty.isAlive || wallHit || boundaryResult.hitBottom || boundaryResult.hitTop) {
      this._endGame()
    }
  }

  _endGame() {
    this.state = GameState.ENDED
    this.player.kill()
    this.audio.stopBackgroundMusic()
    this.audio.playCollision()
    this.scoring.recordEndGame()
  }

  _render() {
    const ghosty = this.player ? this.player.getGhosty() : null
    const walls = this.obstacles ? this.obstacles.getWalls() : []
    const score = this.scoring ? this.scoring.getScore() : 0
    const highScore = this.scoring ? this.scoring.getHighScore() : 0

    switch (this.state) {
      case GameState.READY:
        this.rendering.drawReady()
        break
      case GameState.PLAYING:
        this.rendering.drawGame(ghosty, walls, score)
        break
      case GameState.ENDED:
        this.rendering.drawEnded(score, highScore)
        break
    }
  }
}
