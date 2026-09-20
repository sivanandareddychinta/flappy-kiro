/**
 * Flappy Kiro — Entry Point
 * Exports the Game API: init() and destroy()
 */
import { GameLoop } from './GameLoop.js'

let gameLoop = null

export const Game = {
  /**
   * Initialize and start the game on the given canvas element.
   * @param {HTMLCanvasElement} canvas - The target canvas element
   */
  init(canvas) {
    if (gameLoop) {
      gameLoop.stop()
    }
    gameLoop = new GameLoop()
    gameLoop.init(canvas)
  },

  /**
   * Stop the game loop and release all resources.
   */
  destroy() {
    if (gameLoop) {
      gameLoop.stop()
      gameLoop = null
    }
  },
}

// Auto-start if running in browser with the default canvas
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('[Flappy Kiro] DOMContentLoaded fired')
    const canvas = document.getElementById('gameCanvas')
    console.log('[Flappy Kiro] Canvas found:', canvas ? 'YES' : 'NO')
    if (canvas) {
      try {
        console.log('[Flappy Kiro] Initializing game...')
        Game.init(canvas)
        console.log('[Flappy Kiro] Game initialized successfully')
      } catch (err) {
        console.error('[Flappy Kiro] Initialization error:', err)
      }
    } else {
      console.error('[Flappy Kiro] Canvas element not found!')
    }
  })
}
