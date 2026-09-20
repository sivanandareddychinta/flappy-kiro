/**
 * Shared test constants and fixtures for Flappy Kiro tests.
 */

export const DEFAULT_GAME_SETTINGS = {
  gravity: 0.0008,        // Gravity per ms² (units/ms²)
  impulseStrength: 0.35,  // Upward velocity applied on flap (units/ms)
  scrollSpeed: 0.15,      // Horizontal scroll speed (units/ms)
  wallSpacing: 200,       // Pixels between wall centers
  gapSize: 140,           // Pixel height of the gap
}

export const WORLD_BOUNDS = {
  top: 0,
  bottom: 640,
  left: 0,
  right: 480,
}

export const CANVAS_WIDTH = 480
export const CANVAS_HEIGHT = 640

export const PLAYER_DEFAULTS = {
  startX: 80,
  startY: 320,
  width: 36,
  height: 36,
}
