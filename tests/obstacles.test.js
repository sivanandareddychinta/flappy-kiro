import { describe, it, expect, beforeEach } from 'vitest'
import { Obstacles } from '../src/Obstacles.js'
import { DEFAULT_SETTINGS, WORLD } from '../src/types.js'

describe('Obstacles Component', () => {
  let obstacles

  beforeEach(() => {
    obstacles = new Obstacles()
    // Use a deterministic RNG for reproducible tests
    let seed = 0
    obstacles.seedRNG(() => {
      seed = (seed + 0.3) % 1
      return seed
    })
    obstacles.init()
  })

  describe('Wall Spawning', () => {
    it('should spawn at least one wall on init', () => {
      expect(obstacles.getWalls().length).toBeGreaterThanOrEqual(1)
    })

    it('should spawn a new wall after scrolling past one wall-spacing', () => {
      const initialCount = obstacles.getWalls().length
      // Scroll far enough to trigger a new spawn
      obstacles.update(DEFAULT_SETTINGS.wallSpacing + 1)
      expect(obstacles.getWalls().length).toBeGreaterThanOrEqual(initialCount)
    })

    it('should spawn walls at correct spacing intervals', () => {
      // Scroll through multiple spacings
      for (let i = 0; i < 10; i++) {
        obstacles.update(DEFAULT_SETTINGS.wallSpacing / 2)
      }
      const walls = obstacles.getWalls()
      expect(walls.length).toBeGreaterThanOrEqual(2)

      // Each pair of adjacent walls should have the correct spacing (approximately)
      for (let i = 1; i < walls.length; i++) {
        const spacing = walls[i].x - walls[i - 1].x
        expect(spacing).toBeCloseTo(DEFAULT_SETTINGS.wallSpacing, -1)
      }
    })
  })

  describe('Gap Position', () => {
    it('should place gap within safe vertical bounds (not at ceiling or ground)', () => {
      // Generate several walls and check each gap
      for (let i = 0; i < 5; i++) {
        obstacles.update(DEFAULT_SETTINGS.wallSpacing)
      }
      const walls = obstacles.getWalls()
      for (const wall of walls) {
        expect(wall.gapY).toBeGreaterThanOrEqual(DEFAULT_SETTINGS.minGapY)
        expect(wall.gapY).toBeLessThan(DEFAULT_SETTINGS.maxGapY)
      }
    })

    it('should have consistent gap size across all walls', () => {
      for (let i = 0; i < 5; i++) {
        obstacles.update(DEFAULT_SETTINGS.wallSpacing)
      }
      const walls = obstacles.getWalls()
      for (const wall of walls) {
        expect(wall.gapSize).toBe(DEFAULT_SETTINGS.gapSize)
      }
    })
  })

  describe('Wall Culling', () => {
    it('should remove walls that have scrolled completely off the left edge', () => {
      // Scroll by a massive amount to push initial wall off screen
      obstacles.update(WORLD.WIDTH + 200)
      // Wall with x + width <= 0 should be culled
      const walls = obstacles.getWalls()
      for (const wall of walls) {
        expect(wall.x + wall.width).toBeGreaterThan(0)
      }
    })

    it('should not cull walls that are still visible or about to enter screen', () => {
      const walls = obstacles.getWalls()
      const initialCount = walls.length
      // Small scroll should not cull any walls
      obstacles.update(1)
      expect(obstacles.getWalls().length).toBeGreaterThanOrEqual(initialCount)
    })
  })

  describe('Passable Walls', () => {
    it('should return only walls not yet passed when player is at startX', () => {
      const playerX = 80
      const passable = obstacles.getPassableWalls(playerX)
      // Walls behind the player (fully to the left of playerX) should not appear
      for (const wall of passable) {
        expect(wall.x + wall.width).toBeGreaterThan(playerX)
        expect(wall.passed).toBe(false)
      }
    })

    it('should not return walls already marked as passed', () => {
      const walls = obstacles.getWalls()
      if (walls.length > 0) {
        walls[0].passed = true
      }
      const passable = obstacles.getPassableWalls(0)
      const passedWalls = passable.filter(w => w.passed)
      expect(passedWalls.length).toBe(0)
    })
  })

})
