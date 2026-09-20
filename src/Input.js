/**
 * Flappy Kiro — Input Component
 *
 * Captures keyboard events and provides a polled input state each frame.
 * Designed to be instantiated once and polled via pollInput() each frame.
 */

/** Keys we care about */
const TRACKED_KEYS = new Set([' ', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape'])

export class Input {
  constructor() {
    this._pressedKeys = new Set()
    this._consumedKeys = new Set()
    this._keyDownHandler = null
    this._keyUpHandler = null
  }

  /**
   * Attach keyboard event listeners to the window.
   * Must be called before the first pollInput().
   */
  init() {
    this._keyDownHandler = (e) => {
      if (TRACKED_KEYS.has(e.key)) {
        e.preventDefault()
        this._pressedKeys.add(e.key)
      }
    }

    this._keyUpHandler = (e) => {
      if (TRACKED_KEYS.has(e.key)) {
        this._pressedKeys.delete(e.key)
        this._consumedKeys.delete(e.key) // Allow re-press after release
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this._keyDownHandler)
      window.addEventListener('keyup', this._keyUpHandler)
    }
  }

  /**
   * Remove event listeners. Call on game destroy.
   */
  destroy() {
    if (typeof window !== 'undefined') {
      if (this._keyDownHandler) {
        window.removeEventListener('keydown', this._keyDownHandler)
      }
      if (this._keyUpHandler) {
        window.removeEventListener('keyup', this._keyUpHandler)
      }
    }
    this._pressedKeys.clear()
    this._consumedKeys.clear()
  }

  /**
   * Query whether a specific key is currently held down.
   * @param {string} key - Key value (e.g. ' ', 'ArrowUp')
   * @returns {boolean}
   */
  isKeyPressed(key) {
    return this._pressedKeys.has(key)
  }

  /**
   * Poll the current input state and return a structured snapshot.
   * The `flap` flag is true only on the first poll after a spacebar press
   * (edge-triggered, not level-triggered) to prevent holding the key
   * from firing continuous flaps.
   *
   * @returns {{ flap: boolean, up: boolean, down: boolean, enter: boolean, escape: boolean }}
   */
  pollInput() {
    const spaceHeld = this._pressedKeys.has(' ')
    const upHeld = this._pressedKeys.has('ArrowUp')

    // Edge-trigger: flap fires once per key-press, not continuously
    const flapKey = spaceHeld || upHeld ? (spaceHeld ? ' ' : 'ArrowUp') : null
    let flap = false
    if (flapKey && !this._consumedKeys.has(flapKey)) {
      flap = true
      this._consumedKeys.add(flapKey)
    }

    return {
      flap,
      up: this._pressedKeys.has('ArrowUp'),
      down: this._pressedKeys.has('ArrowDown'),
      enter: this._pressedKeys.has('Enter'),
      escape: this._pressedKeys.has('Escape'),
    }
  }

  /**
   * Programmatically simulate a key press (used in tests and integration scenarios).
   * @param {string} key
   */
  simulateKeyDown(key) {
    this._pressedKeys.add(key)
    this._consumedKeys.delete(key)
  }

  /**
   * Programmatically simulate a key release.
   * @param {string} key
   */
  simulateKeyUp(key) {
    this._pressedKeys.delete(key)
    this._consumedKeys.delete(key)
  }
}
