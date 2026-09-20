/**
 * Flappy Kiro — Player Component
 *
 * Manages the Ghosty player entity: initialization, frame update,
 * flap mechanics, and state queries.
 */
import { createGhosty, DEFAULT_SETTINGS, WORLD, PLAYER_DEFAULTS } from './types.js'
import { Physics } from './Physics.js'

export class Player {
  /**
   * @param {Physics} physics - Physics instance to use for motion calculations
   * @param {object} [settings] - Optional overrides for game settings
   */
  constructor(physics, settings = {}) {
    this.physics = physics || new Physics(settings)
    this.settings = { ...DEFAULT_SETTINGS, ...settings }
    this.ghosty = null
  }

  /**
   * Initialize the player at the given starting position.
   *
   * @param {number} [startX] - Starting x position
   * @param {number} [startY] - Starting y position
   */
  init(startX = PLAYER_DEFAULTS.startX, startY = PLAYER_DEFAULTS.startY) {
    this.ghosty = createGhosty(startX, startY)
  }

  /**
   * Update the player's state for one frame.
   * Applies gravity, updates position, checks boundaries, and updates rotation.
   *
   * @param {number} deltaTime - Frame duration in milliseconds
   * @param {object} [bounds] - World bounds to check (defaults to WORLD)
   * @returns {{ hitTop: boolean, hitBottom: boolean }} boundary collision result
   */
  update(deltaTime, bounds = WORLD) {
    if (!this.ghosty || !this.ghosty.isAlive) {
      return { hitTop: false, hitBottom: false }
    }

    this.physics.applyGravity(this.ghosty, deltaTime)
    this.physics.updatePosition(this.ghosty, deltaTime)
    this.physics.updateRotation(this.ghosty)

    const boundaryResult = this.physics.boundaryCheck(this.ghosty, bounds)

    if (boundaryResult.hitTop || boundaryResult.hitBottom) {
      this.ghosty.isAlive = false
    }

    return boundaryResult
  }

  /**
   * Apply a flap impulse to make Ghosty jump upward.
   * Only effective when the player is alive.
   */
  flap() {
    if (!this.ghosty || !this.ghosty.isAlive) return
    this.physics.applyImpulse(this.ghosty)
  }

  /**
   * Mark the player as dead (e.g., on wall collision).
   */
  kill() {
    if (this.ghosty) {
      this.ghosty.isAlive = false
    }
  }

  /**
   * Return a snapshot of the current player state.
   * @returns {{ x: number, y: number, vx: number, vy: number, width: number, height: number, isAlive: boolean, rotation: number } | null}
   */
  getState() {
    if (!this.ghosty) return null
    return {
      x: this.ghosty.x,
      y: this.ghosty.y,
      vx: this.ghosty.vx,
      vy: this.ghosty.vy,
      width: this.ghosty.width,
      height: this.ghosty.height,
      isAlive: this.ghosty.isAlive,
      rotation: this.ghosty.rotation,
    }
  }

  /**
   * Convenience accessor for the raw ghosty object (used by other components).
   * @returns {object|null}
   */
  getGhosty() {
    return this.ghosty
  }
}
