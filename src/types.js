/**
 * Flappy Kiro — Data Model & Type Definitions
 *
 * Defines all game state types, interfaces, and default constants.
 */

// ─── Game State Enum ─────────────────────────────────────────────────────────

/** Possible states for the game state machine */
export const GameState = Object.freeze({
  READY: 'READY',
  PLAYING: 'PLAYING',
  ENDED: 'ENDED',
})

// ─── World Constants ──────────────────────────────────────────────────────────

export const WORLD = Object.freeze({
  WIDTH: 480,
  HEIGHT: 640,
  TOP: 0,
  BOTTOM: 640,
  LEFT: 0,
  RIGHT: 480,
  GROUND_HEIGHT: 60,   // Pixel height of the ground zone at the bottom
})

// ─── Default Game Settings ────────────────────────────────────────────────────

/**
 * Default physics and gameplay constants.
 * All values are tuned for a 480×640 canvas at target 60 fps.
 *
 * Physics are delta-time based (gravity in units/ms², velocities in units/ms)
 * so the game runs correctly at any frame rate.
 */
export const DEFAULT_SETTINGS = Object.freeze({
  gravity: 0.0008,          // Downward acceleration (units per ms²)
  impulseStrength: 0.35,    // Upward velocity applied on flap (units per ms)
  scrollSpeed: 0.15,        // Horizontal scroll speed (units per ms)
  wallSpacing: 200,         // Horizontal distance between wall x-centers (px)
  gapSize: 140,             // Vertical height of the navigable gap (px)
  wallWidth: 52,            // Width of each wall pillar (px)
  minGapY: 80,              // Minimum y-position of gap top edge (px from top)
  maxGapY: 400,             // Maximum y-position of gap top edge (px from top)
  terminalVelocity: 0.8,    // Maximum downward velocity (units/ms)
})

// ─── Player Defaults ─────────────────────────────────────────────────────────

export const PLAYER_DEFAULTS = Object.freeze({
  startX: 80,
  startY: 280,
  width: 36,
  height: 36,
})

// ─── Type Factory Functions ───────────────────────────────────────────────────

/**
 * Creates a Vector2 { x, y } value object.
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number, y: number }}
 */
export function createVector2(x = 0, y = 0) {
  return { x, y }
}

/**
 * Adds two Vector2 objects and returns a new Vector2.
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {{ x: number, y: number }}
 */
export function addVector2(a, b) {
  return { x: a.x + b.x, y: a.y + b.y }
}

/**
 * Creates a base GameObject with position, velocity, size, and alive flag.
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {object}
 */
export function createGameObject(x = 0, y = 0, width = 0, height = 0) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    width,
    height,
    isAlive: true,
  }
}

/**
 * Creates a Ghosty player entity extending the base GameObject.
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */
export function createGhosty(x = PLAYER_DEFAULTS.startX, y = PLAYER_DEFAULTS.startY) {
  return {
    ...createGameObject(x, y, PLAYER_DEFAULTS.width, PLAYER_DEFAULTS.height),
    rotation: 0,         // Radians; tilt based on vertical velocity
    flapForce: DEFAULT_SETTINGS.impulseStrength,
    mass: 1.0,
  }
}

/**
 * Creates a Wall obstacle with top/bottom segments and a gap.
 * @param {number} x         - Left edge x position
 * @param {number} gapY      - Y position of the gap's top edge
 * @param {number} gapSize   - Height of the navigable gap
 * @param {number} worldH    - Total world height
 * @returns {object}
 */
export function createWall(x, gapY, gapSize = DEFAULT_SETTINGS.gapSize, worldH = WORLD.HEIGHT) {
  return {
    x,
    gapY,              // Top of the gap
    gapSize,           // Height of the passable gap
    width: DEFAULT_SETTINGS.wallWidth,
    topHeight: gapY,                        // Height of the top pillar
    bottomY: gapY + gapSize,               // Y where the bottom pillar starts
    bottomHeight: worldH - (gapY + gapSize), // Height of the bottom pillar
    passed: false,     // Set to true once the player clears this wall
  }
}
