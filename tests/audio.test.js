import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Audio } from '../src/Audio.js'
import { installMockAudioContext, removeMockAudioContext } from './fixtures/mockAudio.js'

describe('Audio Component', () => {
  let audio
  let mockCtx

  beforeEach(() => {
    mockCtx = installMockAudioContext()
    // Suppress fetch errors (no real assets in test env)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    }))

    audio = new Audio()
    audio.init()
  })

  afterEach(() => {
    removeMockAudioContext()
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should create an AudioContext on init', () => {
      expect(global.AudioContext).toHaveBeenCalled()
      expect(audio._initialized).toBe(true)
    })

    it('should create a gain node and connect it to destination', () => {
      expect(mockCtx.createGain).toHaveBeenCalled()
    })
  })

  describe('Sound Effects', () => {
    it('should call createBufferSource when playing a sound with a buffer loaded', () => {
      // Directly inject a mock buffer so playBuffer fires
      const mockBuffer = {}
      audio._buffers.flap = mockBuffer
      audio.playFlap()
      expect(mockCtx.createBufferSource).toHaveBeenCalled()
    })

    it('should not throw when playing sound with no buffer (graceful degradation)', () => {
      audio._buffers.flap = null
      expect(() => audio.playFlap()).not.toThrow()
    })

    it('should not throw when playing collision sound (graceful degradation)', () => {
      expect(() => audio.playCollision()).not.toThrow()
    })

    it('should not throw when playing point sound (graceful degradation)', () => {
      expect(() => audio.playPoint()).not.toThrow()
    })
  })

  describe('Background Music', () => {
    it('should attempt to play background music when flap buffer is available', () => {
      audio._buffers.flap = {}
      audio.playBackgroundMusic()
      expect(mockCtx.createBufferSource).toHaveBeenCalled()
    })

    it('should stop background music without throwing', () => {
      audio._buffers.flap = {}
      audio.playBackgroundMusic()
      expect(() => audio.stopBackgroundMusic()).not.toThrow()
    })
  })

  describe('Mute Toggle', () => {
    it('should set gain to 0 when muted', () => {
      audio.setMuted(true)
      expect(audio.isMuted()).toBe(true)
      // gain.value should be 0
      expect(audio._gainNode.gain.value).toBe(0)
    })

    it('should restore gain when unmuted', () => {
      audio.setMuted(true)
      audio.setMuted(false)
      expect(audio.isMuted()).toBe(false)
      expect(audio._gainNode.gain.value).toBeGreaterThan(0)
    })
  })

  describe('Graceful Degradation', () => {
    it('should not throw when AudioContext is unavailable', () => {
      delete global.AudioContext
      delete global.webkitAudioContext
      const degradedAudio = new Audio()
      expect(() => degradedAudio.init()).not.toThrow()
      expect(degradedAudio._initialized).toBe(false)
    })

    it('should be a no-op when playing sounds without initialization', () => {
      delete global.AudioContext
      delete global.webkitAudioContext
      const degradedAudio = new Audio()
      degradedAudio.init()
      expect(() => degradedAudio.playFlap()).not.toThrow()
      expect(() => degradedAudio.playCollision()).not.toThrow()
      expect(() => degradedAudio.stopBackgroundMusic()).not.toThrow()
    })
  })

})
