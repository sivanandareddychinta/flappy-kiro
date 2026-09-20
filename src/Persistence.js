/**
 * Flappy Kiro — Persistence Component
 *
 * Abstracts localStorage access for high-score and mute-state persistence.
 * Handles quota exceeded, private-mode unavailability, and corrupted data
 * gracefully — always returning sensible defaults on error.
 */

const NAMESPACE = 'flappyKiro'
const KEY_HIGH_SCORE = `${NAMESPACE}.highScore`
const KEY_MUTED = `${NAMESPACE}.muted`

export class Persistence {
  constructor() {
    this._available = false
  }

  /**
   * Check localStorage availability and initialize the namespace.
   * Must be called before any get/set operations.
   */
  init() {
    this._available = this._checkAvailability()
  }

  /**
   * Load the saved high score.
   * @returns {number} High score, or 0 if not set or corrupted
   */
  getHighScore() {
    if (!this._available) return 0
    try {
      const raw = localStorage.getItem(KEY_HIGH_SCORE)
      if (raw === null) return 0
      const parsed = parseInt(raw, 10)
      return isNaN(parsed) || parsed < 0 ? 0 : parsed
    } catch (e) {
      return 0
    }
  }

  /**
   * Save the high score.
   * Handles quota exceeded gracefully — failure is silently ignored.
   * @param {number} score
   */
  setHighScore(score) {
    if (!this._available) return
    try {
      localStorage.setItem(KEY_HIGH_SCORE, String(score))
    } catch (e) {
      // Quota exceeded or private-mode restriction — ignore
    }
  }

  /**
   * Load the saved mute state.
   * @returns {boolean} true if muted, false otherwise
   */
  getMutedState() {
    if (!this._available) return false
    try {
      const raw = localStorage.getItem(KEY_MUTED)
      if (raw === null) return false
      return raw === 'true'
    } catch (e) {
      return false
    }
  }

  /**
   * Save the mute state.
   * @param {boolean} muted
   */
  setMutedState(muted) {
    if (!this._available) return
    try {
      localStorage.setItem(KEY_MUTED, String(muted))
    } catch (e) {
      // Quota exceeded — ignore
    }
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  /**
   * Test whether localStorage is actually usable (some browsers block it
   * in private/incognito mode or when storage is disabled).
   * @returns {boolean}
   */
  _checkAvailability() {
    const testKey = `${NAMESPACE}.__test__`
    try {
      localStorage.setItem(testKey, '1')
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }
}
