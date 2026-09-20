import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Persistence } from '../src/Persistence.js'

describe('Persistence Component', () => {
  let persistence

  beforeEach(() => {
    localStorage.clear()
    persistence = new Persistence()
    persistence.init()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('High Score', () => {
    it('should return 0 as default when no high score is saved', () => {
      expect(persistence.getHighScore()).toBe(0)
    })

    it('should save and load a high score correctly', () => {
      persistence.setHighScore(42)
      expect(persistence.getHighScore()).toBe(42)
    })

    it('should return 0 when high score data is corrupted', () => {
      localStorage.setItem('flappyKiro.highScore', 'not-a-number')
      expect(persistence.getHighScore()).toBe(0)
    })

    it('should not save negative scores (return 0 for negative stored value)', () => {
      localStorage.setItem('flappyKiro.highScore', '-5')
      expect(persistence.getHighScore()).toBe(0)
    })

    it('should overwrite an existing high score with a higher one', () => {
      persistence.setHighScore(10)
      persistence.setHighScore(25)
      expect(persistence.getHighScore()).toBe(25)
    })
  })

  describe('Mute State', () => {
    it('should return false as default when no mute state is saved', () => {
      expect(persistence.getMutedState()).toBe(false)
    })

    it('should save and load mute state = true correctly', () => {
      persistence.setMutedState(true)
      expect(persistence.getMutedState()).toBe(true)
    })

    it('should save and load mute state = false correctly', () => {
      persistence.setMutedState(true)
      persistence.setMutedState(false)
      expect(persistence.getMutedState()).toBe(false)
    })
  })

  describe('Quota Exceeded Handling', () => {
    it('should handle localStorage.setItem throwing QuotaExceededError gracefully', () => {
      const originalSetItem = localStorage.setItem.bind(localStorage)
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new DOMException('QuotaExceededError')
      })
      expect(() => persistence.setHighScore(100)).not.toThrow()
    })
  })

  describe('Corrupted Data Recovery', () => {
    it('should return default (false) for mute state when value is corrupted', () => {
      localStorage.setItem('flappyKiro.muted', 'corrupted')
      // 'corrupted' !== 'true', so returns false (correct default)
      expect(persistence.getMutedState()).toBe(false)
    })
  })

})
