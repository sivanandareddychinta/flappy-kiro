/**
 * Flappy Kiro — Obstacles Component
 *
 * Manages wall generation, horizontal scrolling, gap randomization,
 * off-screen culling, and passage detection for scoring.
 */
import { createWall, DEFAULT_SETTINGS, WORLD } from './types.js'

export class Obstacles {
  /**
   * @param {object} [settings] - Overrides for DEFAULT_SETTINGS
   */
  constructor(settings = {}) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings }
    this.walls = []
    this.worldWidth = WORLD.WIDTH
    this.worldHeight = WORLD.HEIGHT
    this._nextWallX = 0
    this._rng = Math.random  // Replaceable for deterministic testing
  }

  /**
   * Initialize obstacle generation.
   * Pre-seeds first wall just off the right edge of the screen.
   *
   * @param {number} [worldWidth] - World width in pixels
   * @param {number} [worldHeight] - World height in pixels
   */
  init(worldWidth = WORLD.WIDTH, worldHeight = WORLD.HEIGHT) {
    this.walls = []
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
    // First wall spawns just off the right edge
    this._nextWallX = worldWidth
    this._spawnWall()
  }

  /**
   * Seed the random-number generator with a deterministic function.
   * Used in tests to produce repeatable gap positions.
   *
   * @param {function} rng - Zero-argument function returning [0, 1)
   */
  seedRNG(rng) {
    this._rng = rng
  }

  /**
   * Update obstacles: scroll all walls left and spawn new ones as needed.
   *
   * @param {number} scrollDistance - Pixels to scroll this frame
   */
  update(scrollDistance) {
    // Move all walls left
    for (const wall of this.walls) {
      wall.x -= scrollDistance
    }

    // Spawn a new wall when _nextWallX (tracking spawn position) moves into view
    // We track the next spawn x as an absolute world-x that also scrolls
    this._nextWallX -= scrollDistance
    if (this._nextWallX <= this.worldWidth) {
      this._spawnWall()
    }

    // Cull walls that are fully off the left edge
    this.walls = this.walls.filter(w => w.x + w.width > 0)
  }

  /**
   * Return the current array of walls (read-only reference).
   * @returns {object[]}
   */
  getWalls() {
    return this.walls
  }

  /**
   * Return walls the player has not yet passed (used for scoring checks).
   * @param {number} playerX - The player's x position
   * @returns {object[]}
   */
  getPassableWalls(playerX) {
    return this.walls.filter(w => !w.passed && (w.x + w.width) > playerX)
  }

  /**
   * Reset obstacles to initial state.
   */
  reset() {
    this.init(this.worldWidth, this.worldHeight)
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  /**
   * Spawn a new wall at the current _nextWallX position with a randomized gap.
   * Advances _nextWallX by wallSpacing for the following spawn.
   */
  _spawnWall() {
    const gapY = this._randomGapY()
    const x = this._nextWallX
    const wall = createWall(x, gapY, this.settings.gapSize, this.worldHeight)
    this.walls.push(wall)
    // Schedule the next wall wallSpacing pixels after this one
    this._nextWallX = x + this.settings.wallSpacing
  }

  /**
   * Calculate a random gap Y position within safe bounds.
   * Ensures the gap never clips the ceiling or the ground zone.
   *
   * @returns {number} Y position of the gap's top edge
   */
  _randomGapY() {
    const minY = this.settings.minGapY
    const maxY = this.settings.maxGapY
    return Math.floor(minY + this._rng() * (maxY - minY))
  }
}
