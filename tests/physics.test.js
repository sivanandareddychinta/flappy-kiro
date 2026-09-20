import { describe, it, expect, beforeEach } from 'vitest'
import { Physics } from '../src/Physics.js'
import { DEFAULT_SETTINGS, WORLD, createGhosty, createWall } from '../src/types.js'
import { DEFAULT_GAME_SETTINGS, WORLD_BOUNDS } from './fixtures/testData.js'

describe('Physics Component', () => {
  let physics

  beforeEach(() => {
    physics = new Physics()
  })

  describe('applyGravity', () => {
    it('should increase downward velocity (vy) over one frame at 60fps', () => {
      const obj = { vy: 0 }
      physics.applyGravity(obj, 16.67)
      expect(obj.vy).toBeGreaterThan(0)
    })

    it('should apply gravity proportional to deltaTime', () => {
      const obj1 = { vy: 0 }
      const obj2 = { vy: 0 }
      physics.applyGravity(obj1, 16.67)
      physics.applyGravity(obj2, 33.33)
      // Double deltaTime should yield approximately double vy (before terminal velocity clamp)
      expect(obj2.vy).toBeCloseTo(obj1.vy * 2, 1)
    })

    it('should clamp vy to terminal velocity', () => {
      const obj = { vy: 0 }
      // Apply gravity for a very long time
      physics.applyGravity(obj, 100000)
      expect(obj.vy).toBe(DEFAULT_SETTINGS.terminalVelocity)
    })

    it('should accumulate velocity across multiple frames', () => {
      const obj = { vy: 0 }
      const dt = 16.67
      physics.applyGravity(obj, dt)
      const vy1 = obj.vy
      physics.applyGravity(obj, dt)
      expect(obj.vy).toBeGreaterThan(vy1)
    })
  })

  describe('applyImpulse', () => {
    it('should set vy to negative impulseStrength (upward)', () => {
      const obj = { vy: 0 }
      physics.applyImpulse(obj)
      expect(obj.vy).toBe(-DEFAULT_SETTINGS.impulseStrength)
    })

    it('should override velocity regardless of current vy', () => {
      const obj = { vy: 0.5 }
      physics.applyImpulse(obj)
      expect(obj.vy).toBe(-DEFAULT_SETTINGS.impulseStrength)
    })

    it('should accept a custom impulse strength override', () => {
      const obj = { vy: 0 }
      physics.applyImpulse(obj, 0.5)
      expect(obj.vy).toBe(-0.5)
    })
  })

  describe('updatePosition', () => {
    it('should update y position based on vy and deltaTime', () => {
      const obj = { x: 0, y: 100, vx: 0, vy: 0.1 }
      physics.updatePosition(obj, 16.67)
      expect(obj.y).toBeCloseTo(100 + 0.1 * 16.67, 2)
    })

    it('should update x position based on vx and deltaTime', () => {
      const obj = { x: 50, y: 100, vx: 0.05, vy: 0 }
      physics.updatePosition(obj, 16.67)
      expect(obj.x).toBeCloseTo(50 + 0.05 * 16.67, 2)
    })

    it('should not move when velocity is zero', () => {
      const obj = { x: 10, y: 20, vx: 0, vy: 0 }
      physics.updatePosition(obj, 16.67)
      expect(obj.x).toBe(10)
      expect(obj.y).toBe(20)
    })
  })

  describe('boundaryCheck', () => {
    it('should detect ceiling collision when y < top', () => {
      const obj = { x: 80, y: -10, width: 36, height: 36 }
      const result = physics.boundaryCheck(obj, WORLD)
      expect(result.hitTop).toBe(true)
      expect(result.hitBottom).toBe(false)
    })

    it('should detect ground collision when bottom edge exceeds world bottom', () => {
      const obj = { x: 80, y: 620, width: 36, height: 36 }
      const result = physics.boundaryCheck(obj, WORLD)
      expect(result.hitBottom).toBe(true)
      expect(result.hitTop).toBe(false)
    })

    it('should not detect collision when object is within bounds', () => {
      const obj = { x: 80, y: 300, width: 36, height: 36 }
      const result = physics.boundaryCheck(obj, WORLD)
      expect(result.hitTop).toBe(false)
      expect(result.hitBottom).toBe(false)
    })

    it('should detect ground collision exactly at boundary', () => {
      // y + height = WORLD.BOTTOM exactly → hitBottom
      const obj = { x: 80, y: WORLD.BOTTOM - 36, width: 36, height: 36 }
      const result = physics.boundaryCheck(obj, WORLD)
      expect(result.hitBottom).toBe(false) // exactly at boundary, not past it

      const obj2 = { x: 80, y: WORLD.BOTTOM - 35, width: 36, height: 36 }
      const result2 = physics.boundaryCheck(obj2, WORLD)
      expect(result2.hitBottom).toBe(true)
    })
  })

  describe('wallCollisionCheck', () => {
    it('should return true when object overlaps the top pillar', () => {
      // Wall at x=200, gap at y=200–340
      const wall = createWall(200, 200, 140, WORLD.HEIGHT)
      // Object fully inside top pillar (above gap)
      const obj = { x: 210, y: 100, width: 36, height: 36 }
      expect(physics.wallCollisionCheck(obj, wall)).toBe(true)
    })

    it('should return true when object overlaps the bottom pillar', () => {
      const wall = createWall(200, 200, 140, WORLD.HEIGHT)
      // Object fully inside bottom pillar (below gap)
      const obj = { x: 210, y: 400, width: 36, height: 36 }
      expect(physics.wallCollisionCheck(obj, wall)).toBe(true)
    })

    it('should return false when object passes through the gap', () => {
      const wall = createWall(200, 200, 140, WORLD.HEIGHT)
      // Object centered in the gap (y=200 to y=340; obj at y=250, h=36 → bottom at 286)
      const obj = { x: 210, y: 250, width: 36, height: 36 }
      expect(physics.wallCollisionCheck(obj, wall)).toBe(false)
    })

    it('should return false when object has no horizontal overlap with wall', () => {
      const wall = createWall(200, 200, 140, WORLD.HEIGHT)
      // Object is to the left of the wall
      const obj = { x: 50, y: 100, width: 36, height: 36 }
      expect(physics.wallCollisionCheck(obj, wall)).toBe(false)
    })

    it('should return false when object has passed completely past the wall', () => {
      const wall = createWall(200, 200, 140, WORLD.HEIGHT)
      // Object is fully to the right of the wall
      const obj = { x: 260, y: 250, width: 36, height: 36 }
      expect(physics.wallCollisionCheck(obj, wall)).toBe(false)
    })
  })

})
