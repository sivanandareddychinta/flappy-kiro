/**
 * Flappy Kiro — Physics Component
 *
 * Responsible for applying gravity, impulse, position updates,
 * boundary checks, and collision detection. All calculations are
 * delta-time based for frame-rate independence.
 */
import { DEFAULT_SETTINGS, WORLD } from './types.js'

export class Physics {
  /**
   * @param {object} [settings] - Overrides for DEFAULT_SETTINGS
   */
  constructor(settings = {}) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings }
  }

  /**
   * Apply gravity to a game object, clamped to terminal velocity.
   * Increases vy (downward is positive) proportional to deltaTime.
   *
   * @param {object} obj - Game object with { vy }
   * @param {number} deltaTime - Frame duration in milliseconds
   */
  applyGravity(obj, deltaTime) {
    obj.vy += this.settings.gravity * deltaTime
    // Clamp to terminal velocity
    if (obj.vy > this.settings.terminalVelocity) {
      obj.vy = this.settings.terminalVelocity
    }
  }

  /**
   * Apply an upward impulse (flap) to a game object.
   * Sets vy to negative impulseStrength (upward).
   *
   * @param {object} obj - Game object with { vy }
   * @param {number} [impulseStrength] - Override impulse magnitude
   */
  applyImpulse(obj, impulseStrength) {
    const force = impulseStrength !== undefined ? impulseStrength : this.settings.impulseStrength
    obj.vy = -force
  }

  /**
   * Update the game object's position based on its velocity and deltaTime.
   * The x position is not affected by scrollSpeed here — the world scrolls
   * through wall movement; the player's x is fixed.
   *
   * @param {object} obj - Game object with { x, y, vx, vy }
   * @param {number} deltaTime - Frame duration in milliseconds
   */
  updatePosition(obj, deltaTime) {
    obj.y += obj.vy * deltaTime
    obj.x += obj.vx * deltaTime
  }

  /**
   * Update player rotation to tilt with velocity (cosmetic).
   * Tilts down when falling, tilts up briefly when flapping.
   *
   * @param {object} obj - Ghosty with { vy, rotation }
   */
  updateRotation(obj) {
    // Map vy to rotation: -0.35 (max up) → -0.4 rad, +0.8 (terminal) → +0.5 rad
    const targetRotation = obj.vy * 0.8
    const maxRotation = Math.PI / 3  // 60 degrees downward max
    const minRotation = -Math.PI / 6 // 30 degrees upward max
    obj.rotation = Math.max(minRotation, Math.min(maxRotation, targetRotation))
  }

  /**
   * Check if a game object has crossed the world boundaries.
   *
   * Accepts bounds with either uppercase keys (TOP/BOTTOM as exported by WORLD)
   * or lowercase keys (top/bottom for compatibility with test fixtures).
   *
   * @param {object} obj - Game object with { x, y, width, height }
   * @param {object} [bounds] - World bounds ({ TOP, BOTTOM } or { top, bottom })
   * @returns {{ hitTop: boolean, hitBottom: boolean }}
   */
  boundaryCheck(obj, bounds = WORLD) {
    // Support both uppercase (WORLD constants) and lowercase (test fixtures) keys
    const top = bounds.TOP !== undefined ? bounds.TOP : (bounds.top !== undefined ? bounds.top : 0)
    const bottom = bounds.BOTTOM !== undefined ? bounds.BOTTOM : (bounds.bottom !== undefined ? bounds.bottom : 640)
    const hitTop = obj.y < top
    const hitBottom = (obj.y + obj.height) > bottom
    return { hitTop, hitBottom }
  }

  /**
   * Perform AABB collision detection between a game object and a wall.
   * Checks against both top pillar and bottom pillar rectangles.
   *
   * @param {object} obj - Game object with { x, y, width, height }
   * @param {object} wall - Wall with { x, width, gapY, gapSize, topHeight, bottomY, bottomHeight }
   * @returns {boolean} true if the object overlaps with either wall segment
   */
  wallCollisionCheck(obj, wall) {
    // Horizontal overlap (AABB x-axis)
    const objRight = obj.x + obj.width
    const wallRight = wall.x + wall.width
    const horizontalOverlap = obj.x < wallRight && objRight > wall.x

    if (!horizontalOverlap) {
      return false
    }

    // Vertical: check if the object is OUTSIDE the gap
    const objBottom = obj.y + obj.height

    // Hit top pillar: object top is above gap top, or object overlaps the top pillar
    const hitTopPillar = obj.y < wall.gapY

    // Hit bottom pillar: object bottom is below gap bottom
    const hitBottomPillar = objBottom > (wall.gapY + wall.gapSize)

    return hitTopPillar || hitBottomPillar
  }

  /**
   * Move all walls to the left by scrollDistance pixels.
   * Used to scroll the world.
   *
   * @param {object[]} walls - Array of wall objects
   * @param {number} scrollDistance - Pixels to scroll left
   */
  scrollWalls(walls, scrollDistance) {
    for (const wall of walls) {
      wall.x -= scrollDistance
    }
  }
}
