import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Input } from '../src/Input.js'

describe('Input Component', () => {
  let input

  beforeEach(() => {
    input = new Input()
    input.init()
  })

  afterEach(() => {
    input.destroy()
  })

  describe('Spacebar (Flap)', () => {
    it('should register a spacebar press and return flap=true on next poll', () => {
      input.simulateKeyDown(' ')
      const state = input.pollInput()
      expect(state.flap).toBe(true)
    })

    it('should only trigger flap once per key press (edge-triggered, not level-triggered)', () => {
      input.simulateKeyDown(' ')
      const first = input.pollInput()
      const second = input.pollInput() // Still held, no new press
      expect(first.flap).toBe(true)
      expect(second.flap).toBe(false)
    })

    it('should allow flap again after key is released and re-pressed', () => {
      input.simulateKeyDown(' ')
      input.pollInput() // Consume first flap
      input.simulateKeyUp(' ')
      input.simulateKeyDown(' ') // Re-press
      const state = input.pollInput()
      expect(state.flap).toBe(true)
    })
  })

  describe('Arrow Keys', () => {
    it('should register ArrowUp press correctly', () => {
      input.simulateKeyDown('ArrowUp')
      const state = input.pollInput()
      expect(state.up).toBe(true)
    })

    it('should register ArrowDown press correctly', () => {
      input.simulateKeyDown('ArrowDown')
      const state = input.pollInput()
      expect(state.down).toBe(true)
    })

    it('should trigger flap on ArrowUp press', () => {
      input.simulateKeyDown('ArrowUp')
      const state = input.pollInput()
      expect(state.flap).toBe(true)
    })
  })

  describe('Enter Key', () => {
    it('should register Enter key press correctly', () => {
      input.simulateKeyDown('Enter')
      const state = input.pollInput()
      expect(state.enter).toBe(true)
    })
  })

  describe('Multiple Keys', () => {
    it('should track multiple keys simultaneously', () => {
      input.simulateKeyDown('ArrowUp')
      input.simulateKeyDown('ArrowDown')
      const state = input.pollInput()
      expect(state.up).toBe(true)
      expect(state.down).toBe(true)
    })

    it('should show released keys as false after simulateKeyUp', () => {
      input.simulateKeyDown(' ')
      input.pollInput() // consume flap
      input.simulateKeyUp(' ')
      const state = input.pollInput()
      expect(state.flap).toBe(false)
    })
  })

})
