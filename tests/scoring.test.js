import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scoring } from '../src/Scoring.js'

describe('Scoring Component', () => {
  let scoring
  let mockPersistence

  beforeEach(() => {
    mockPersistence = {
      getHighScore: vi.fn().mockReturnValue(5),
      setHighScore: vi.fn(),
    }
    scoring = new Scoring(mockPersistence)
    scoring.init()
  })

  describe('Initialization', () => {
    it('should initialize score to 0', () => {
      expect(scoring.getScore()).toBe(0)
    })

    it('should load high score from persistence on init', () => {
      expect(scoring.getHighScore()).toBe(5)
      expect(mockPersistence.getHighScore).toHaveBeenCalled()
    })

    it('should default high score to 0 when no persistence provided', () => {
      const noPersistScoring = new Scoring()
      noPersistScoring.init()
      expect(noPersistScoring.getHighScore()).toBe(0)
    })
  })

  describe('checkPassage — Point Award', () => {
    it('should award a point when player has fully passed a wall', () => {
      const ghosty = { x: 300, width: 36 }
      const walls = [{ x: 200, width: 52, passed: false }]
      // playerRight = 336, wallRight = 252; player is past the wall
      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(1)
    })

    it('should not award a point when player has not yet passed the wall', () => {
      const ghosty = { x: 100, width: 36 }
      const walls = [{ x: 200, width: 52, passed: false }]
      // playerRight = 136, wallRight = 252; player has NOT passed
      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(0)
    })

    it('should not award a point when wall has already been marked as passed', () => {
      const ghosty = { x: 300, width: 36 }
      const walls = [{ x: 200, width: 52, passed: true }]
      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(0)
    })

    it('should prevent double-scoring (wall marked as passed after first award)', () => {
      const ghosty = { x: 300, width: 36 }
      const walls = [{ x: 200, width: 52, passed: false }]
      scoring.checkPassage(ghosty, walls)
      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(1) // Only one point despite two calls
      expect(walls[0].passed).toBe(true)
    })
  })

  describe('High Score', () => {
    it('should update high score when current score exceeds it', () => {
      // Score current run higher than persisted high score (5)
      scoring.score = 10
      scoring.recordEndGame()
      expect(scoring.getHighScore()).toBe(10)
      expect(mockPersistence.setHighScore).toHaveBeenCalledWith(10)
    })

    it('should not update high score when current score does not exceed it', () => {
      scoring.score = 3 // Less than high score of 5
      scoring.recordEndGame()
      expect(scoring.getHighScore()).toBe(5) // Unchanged
      expect(mockPersistence.setHighScore).not.toHaveBeenCalled()
    })
  })

})
