/**
 * Flappy Kiro — Audio Component
 *
 * Manages all game audio via the Web Audio API: sound effects (flap, point,
 * collision) and background music. Gracefully degrades when Web Audio API
 * is unavailable.
 */

export class Audio {
  constructor() {
    this._ctx = null          // AudioContext
    this._gainNode = null     // Master gain node
    this._bgSource = null     // Background music buffer source
    this._muted = false
    this._initialized = false

    // Audio buffers — loaded from assets
    this._buffers = {
      flap: null,
      point: null,
      collision: null,
      background: null,
    }
  }

  /**
   * Initialize the AudioContext and load audio assets.
   * Fails gracefully if Web Audio API is unavailable.
   */
  init() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) {
        this._initialized = false
        return
      }

      this._ctx = new AudioCtx()
      this._gainNode = this._ctx.createGain()
      this._gainNode.connect(this._ctx.destination)
      this._gainNode.gain.value = this._muted ? 0 : 0.5
      this._initialized = true

      // Load assets asynchronously; game runs silently until they are ready
      this._loadAssets()
    } catch (e) {
      // Web Audio API unavailable or restricted (e.g. private browsing)
      this._initialized = false
    }
  }

  /**
   * Play the flap sound effect.
   */
  playFlap() {
    this._playBuffer(this._buffers.flap)
  }

  /**
   * Play the point/score sound effect.
   */
  playPoint() {
    this._playBuffer(this._buffers.point)
  }

  /**
   * Play the collision sound effect.
   */
  playCollision() {
    this._playBuffer(this._buffers.collision)
  }

  /**
   * Start looping the background music.
   */
  playBackgroundMusic() {
    if (!this._initialized || !this._ctx || !this._buffers.flap) return
    this._stopBgSource()

    try {
      const source = this._ctx.createBufferSource()
      source.buffer = this._buffers.flap // Use flap sound looped as placeholder music
      source.loop = true
      source.connect(this._gainNode)
      source.start(0)
      this._bgSource = source
    } catch (e) {
      // Ignore audio errors; game continues silently
    }
  }

  /**
   * Stop background music.
   */
  stopBackgroundMusic() {
    this._stopBgSource()
  }

  /**
   * Set the muted state. When muted, master gain is 0.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._muted = muted
    if (this._gainNode) {
      this._gainNode.gain.value = muted ? 0 : 0.5
    }
  }

  /**
   * Return whether audio is currently muted.
   * @returns {boolean}
   */
  isMuted() {
    return this._muted
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  /**
   * Play a buffer once. No-op when audio is uninitialized or buffer is null.
   * @param {AudioBuffer|null} buffer
   */
  _playBuffer(buffer) {
    if (!this._initialized || !this._ctx || !buffer) return
    try {
      // Resume AudioContext if it was suspended (browser autoplay policy)
      if (this._ctx.state === 'suspended') {
        this._ctx.resume()
      }
      const source = this._ctx.createBufferSource()
      source.buffer = buffer
      source.connect(this._gainNode)
      source.start(0)
    } catch (e) {
      // Ignore playback errors
    }
  }

  /**
   * Stop and detach the current background music source node.
   */
  _stopBgSource() {
    if (this._bgSource) {
      try {
        this._bgSource.stop()
      } catch (e) {
        // Ignore stop errors (source may have already ended)
      }
      try {
        this._bgSource.disconnect()
      } catch (e) {
        // Ignore disconnect errors
      }
      this._bgSource = null
    }
  }

  /**
   * Load audio assets from the /assets/ directory.
   * Uses fetch + decodeAudioData; failures are silently ignored.
   */
  async _loadAssets() {
    if (!this._ctx) return

    const assets = [
      { key: 'flap', path: '/assets/jump.wav' },
      { key: 'collision', path: '/assets/game_over.wav' },
    ]

    for (const { key, path } of assets) {
      try {
        const resp = await fetch(path)
        if (!resp.ok) continue
        const arrayBuffer = await resp.arrayBuffer()
        this._buffers[key] = await this._ctx.decodeAudioData(arrayBuffer)
      } catch (e) {
        // Asset unavailable — game continues silently
      }
    }

    // Generate a simple beep for the point sound using oscillator
    try {
      this._buffers.point = this._createBeepBuffer(880, 0.1)
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Generate a short beep AudioBuffer at the given frequency.
   * @param {number} frequency - Hz
   * @param {number} duration - Seconds
   * @returns {AudioBuffer}
   */
  _createBeepBuffer(frequency, duration) {
    const sampleRate = this._ctx.sampleRate || 44100
    const frameCount = Math.floor(sampleRate * duration)
    const buffer = this._ctx.createBuffer(1, frameCount, sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frameCount; i++) {
      // Sine wave with linear fade-out
      const envelope = 1 - i / frameCount
      data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * envelope * 0.3
    }
    return buffer
  }
}
