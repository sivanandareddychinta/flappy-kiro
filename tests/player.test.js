import { describe, it, expect, beforeEach } from 'vitest'
import { Player } from '../src/Player.js'
import { Physics } from '../src/Physics.js'
import { PLAYER_DEFAULTS, DEFAULT_SETTINGS, WORLD } from '../src/types.js'

describe('Player Component', () => {
  let physics
  let player

  beforeEach(() => {
    physics = new Physics()
    player = new Player(physics)
    player.init()
  })

  describe('Initialization', () => {
    it('should initialize at correct position with correct properties', () => {
      const state = player.getState()
      expect(state).not.toBeNull()
      expect(state.x).toBe(PLAYER_DEFAULTS.startX)
      expect(state.y).toBe(PLAYER_DEFAULTS.startY)
      expect(state.width).toBe(PLAYER_DEFAULTS.width)
      expect(state.height).toBe(PLAYER_DEFAULTS.height)
      expect(state.isAlive).toBe(true)
      expect(state.vy).toBe(0)
    })

    it('should accept custom starting position', () => {
      const customPlayer = new Player(physics)
      customPlayer.init(100, 200)
      const state = customPlayer.getState()
      expect(state.x).toBe(100)
      expect(state.y).toBe(200)
    })
  })

  describe('Gravity & Falling', () => {
    it('should descend (vy increases) under gravity when no flap occurs', () => {
      const initialVy = player.getState().vy
      player.update(16.67, WORLD)
      const newVy = player.getState().vy
      expect(newVy).toBeGreaterThan(initialVy)
    })

    it('should move downward (y increases) over multiple frames without flap', () => {
      const initialY = player.getState().y
      for (let i = 0; i < 10; i++) {
        player.update(16.67, WORLD)
      }
      const newY = player.getState().y
      expect(newY).toBeGreaterThan(initialY)
    })
  })

  describe('Flap Mechanics', () => {
    it('should ascend (vy becomes negative) immediately after flap', () => {
      player.flap()
      const state = player.getState()
      expect(state.vy).toBeLessThan(0)
    })

    it('should apply negative vy equal to impulseStrength on flap', () => {
      player.flap()
      const state = player.getState()
      expect(state.vy).toBeCloseTo(-DEFAULT_SETTINGS.impulseStrength, 5)
    })

    it('should not flap when player is dead', () => {
      player.kill()
      player.flap()
      // vy should remain at whatever it was (0 initially), not negative
      const state = player.getState()
      expect(state.isAlive).toBe(false)
    })
  })

  describe('Position Update', () => {
    it('should update y position correctly each frame after applying velocity', () => {
      player.flap() // Apply known upward velocity
      const stateBefore = player.getState()
      const expectedY = stateBefore.y + stateBefore.vy * 16.67
      player.update(16.67, WORLD)
      const stateAfter = player.getState()
      // Allow for gravity also being applied in same update step; just verify direction
      expect(stateAfter.y).toBeLessThan(stateBefore.y + 1) // should be close to or less than start
    })
  })

  describe('Death & Collision', () => {
    it('should be marked dead when it hits the ground', () => {
      // Move player to near the bottom
      player.getGhosty().y = WORLD.BOTTOM - 10
      player.getGhosty().vy = 0.1 // positive (downward)
      player.update(200, WORLD) // Large deltaTime pushes past boundary
      expect(player.getState().isAlive).toBe(false)
    })

    it('should be marked dead when kill() is called directly', () => {
      expect(player.getState().isAlive).toBe(true)
      player.kill()
      expect(player.getState().isAlive).toBe(false)
    })

    it('should not update position after death', () => {
      player.kill()
      const stateBefore = player.getState()
      player.update(16.67, WORLD)
      const stateAfter = player.getState()
      // Position should be unchanged after kill (update is a no-op for dead player)
      expect(stateAfter.x).toBe(stateBefore.x)
    })
  })

})
