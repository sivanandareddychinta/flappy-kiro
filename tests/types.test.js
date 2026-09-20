import { describe, it, expect } from 'vitest'
import {
  GameState,
  WORLD,
  DEFAULT_SETTINGS,
  createVector2,
  addVector2,
  createGameObject,
  createGhosty,
  createWall,
  PLAYER_DEFAULTS,
} from '../src/types.js'

describe('Data Model — Types & Constants', () => {

  describe('Vector2', () => {
    it('should create a Vector2 with correct x and y values', () => {
      const v = createVector2(3, 7)
      expect(v.x).toBe(3)
      expect(v.y).toBe(7)
    })

    it('should default to (0, 0) when no arguments given', () => {
      const v = createVector2()
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('should add two Vector2 objects correctly', () => {
      const a = createVector2(1, 2)
      const b = createVector2(3, 4)
      const result = addVector2(a, b)
      expect(result.x).toBe(4)
      expect(result.y).toBe(6)
    })

    it('should not mutate the original vectors on addition', () => {
      const a = createVector2(1, 2)
      const b = createVector2(3, 4)
      addVector2(a, b)
      expect(a.x).toBe(1)
      expect(a.y).toBe(2)
    })
  })

  describe('GameObject', () => {
    it('should create a GameObject with correct initial state', () => {
      const obj = createGameObject(10, 20, 36, 36)
      expect(obj.x).toBe(10)
      expect(obj.y).toBe(20)
      expect(obj.width).toBe(36)
      expect(obj.height).toBe(36)
      expect(obj.vx).toBe(0)
      expect(obj.vy).toBe(0)
      expect(obj.isAlive).toBe(true)
    })

    it('should be within world boundaries when initialized at default position', () => {
      const obj = createGameObject(PLAYER_DEFAULTS.startX, PLAYER_DEFAULTS.startY, 36, 36)
      expect(obj.x).toBeGreaterThanOrEqual(WORLD.LEFT)
      expect(obj.y).toBeGreaterThanOrEqual(WORLD.TOP)
      expect(obj.x + obj.width).toBeLessThanOrEqual(WORLD.RIGHT)
      expect(obj.y + obj.height).toBeLessThanOrEqual(WORLD.BOTTOM)
    })
  })

  describe('Ghosty', () => {
    it('should initialize with correct player defaults', () => {
      const ghosty = createGhosty()
      expect(ghosty.x).toBe(PLAYER_DEFAULTS.startX)
      expect(ghosty.y).toBe(PLAYER_DEFAULTS.startY)
      expect(ghosty.width).toBe(PLAYER_DEFAULTS.width)
      expect(ghosty.height).toBe(PLAYER_DEFAULTS.height)
      expect(ghosty.isAlive).toBe(true)
      expect(ghosty.rotation).toBe(0)
      expect(ghosty.mass).toBe(1.0)
    })

    it('should have flapForce matching DEFAULT_SETTINGS.impulseStrength', () => {
      const ghosty = createGhosty()
      expect(ghosty.flapForce).toBe(DEFAULT_SETTINGS.impulseStrength)
    })

    it('should initialize with zero velocities', () => {
      const ghosty = createGhosty()
      expect(ghosty.vx).toBe(0)
      expect(ghosty.vy).toBe(0)
    })
  })

  describe('Wall', () => {
    it('should create a Wall with valid gap bounds', () => {
      const wall = createWall(300, 150)
      expect(wall.gapY).toBe(150)
      expect(wall.gapSize).toBe(DEFAULT_SETTINGS.gapSize)
      expect(wall.topHeight).toBe(150)
      expect(wall.bottomY).toBe(150 + DEFAULT_SETTINGS.gapSize)
    })

    it('should have consistent gap geometry (topHeight + gapSize + bottomHeight = worldHeight)', () => {
      const wall = createWall(300, 200, 140, WORLD.HEIGHT)
      const sum = wall.topHeight + wall.gapSize + wall.bottomHeight
      expect(sum).toBe(WORLD.HEIGHT)
    })

    it('should initialize as not passed', () => {
      const wall = createWall(300, 200)
      expect(wall.passed).toBe(false)
    })
  })

  describe('GameState', () => {
    it('should have READY, PLAYING, and ENDED states', () => {
      expect(GameState.READY).toBe('READY')
      expect(GameState.PLAYING).toBe('PLAYING')
      expect(GameState.ENDED).toBe('ENDED')
    })

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(GameState)).toBe(true)
    })
  })

  describe('Physics Constants', () => {
    it('should have positive gravity constant', () => {
      expect(DEFAULT_SETTINGS.gravity).toBeGreaterThan(0)
    })

    it('should have negative-direction impulse (upward force > 0)', () => {
      // impulseStrength is applied as negative vy (upward), must be positive magnitude
      expect(DEFAULT_SETTINGS.impulseStrength).toBeGreaterThan(0)
    })

    it('should have world boundaries set correctly', () => {
      expect(WORLD.TOP).toBe(0)
      expect(WORLD.BOTTOM).toBe(WORLD.HEIGHT)
      expect(WORLD.LEFT).toBe(0)
      expect(WORLD.RIGHT).toBe(WORLD.WIDTH)
    })
  })

})
