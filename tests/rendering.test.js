import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Rendering } from '../src/Rendering.js'
import { createMockCanvas } from './fixtures/mockCanvas.js'
import { WORLD } from '../src/types.js'

describe('Rendering Component', () => {
  let rendering
  let canvas
  let ctx

  beforeEach(() => {
    canvas = createMockCanvas()
    ctx = canvas.getContext('2d')

    // Mock Image for ghosty sprite loading
    vi.stubGlobal('Image', class MockImage {
      constructor() {
        this.onload = null
        this.onerror = null
        this.src = ''
        this.complete = false
        this.naturalWidth = 0
      }
      set src(val) {
        this._src = val
        // Simulate load error (no real assets in test env)
        if (this.onerror) setTimeout(() => this.onerror(), 0)
      }
      get src() { return this._src }
    })

    rendering = new Rendering()
    rendering.init(canvas)
  })

  afterEach(() => {
    rendering.destroy()
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with a canvas context', () => {
      expect(rendering._ctx).toBeTruthy()
      expect(rendering._canvas).toBe(canvas)
    })

    it('should call getContext with "2d"', () => {
      expect(canvas.getContext).toHaveBeenCalledWith('2d')
    })
  })

  describe('READY State Rendering', () => {
    it('should call fillRect and fillText when drawing the READY screen', () => {
      rendering.drawReady()
      expect(ctx.fillRect).toHaveBeenCalled()
      expect(ctx.fillText).toHaveBeenCalled()
    })

    it('should render title "Flappy Kiro" text on READY screen', () => {
      rendering.drawReady()
      const calls = ctx.fillText.mock.calls.map(c => c[0])
      expect(calls.some(t => t.includes('Flappy Kiro'))).toBe(true)
    })

    it('should include instruction text on READY screen', () => {
      rendering.drawReady()
      const calls = ctx.fillText.mock.calls.map(c => c[0])
      expect(calls.some(t => t.includes('SPACE') || t.includes('Start'))).toBe(true)
    })
  })

  describe('PLAYING State Rendering', () => {
    it('should draw walls, ghosty, and score during PLAYING state', () => {
      const ghosty = { x: 80, y: 300, width: 36, height: 36, rotation: 0 }
      const walls = [
        { x: 300, width: 52, gapY: 200, gapSize: 140, topHeight: 200, bottomY: 340, bottomHeight: 300 },
      ]
      rendering.drawGame(ghosty, walls, 5)
      // Should have called fillRect for background, walls, ground
      expect(ctx.fillRect.mock.calls.length).toBeGreaterThan(3)
      // Score should be drawn
      const scoreCalls = ctx.fillText.mock.calls.map(c => c[0])
      expect(scoreCalls.some(t => String(t).includes('5'))).toBe(true)
    })

    it('should not throw when walls array is empty', () => {
      const ghosty = { x: 80, y: 300, width: 36, height: 36, rotation: 0 }
      expect(() => rendering.drawGame(ghosty, [], 0)).not.toThrow()
    })
  })

  describe('ENDED State Rendering', () => {
    it('should render "Game Over" text on ENDED screen', () => {
      rendering.drawEnded(7, 10)
      const calls = ctx.fillText.mock.calls.map(c => c[0])
      expect(calls.some(t => String(t).includes('Game Over'))).toBe(true)
    })

    it('should render current score and high score on ENDED screen', () => {
      rendering.drawEnded(7, 10)
      const calls = ctx.fillText.mock.calls.map(c => c[0])
      expect(calls.some(t => String(t).includes('7'))).toBe(true)
      expect(calls.some(t => String(t).includes('10'))).toBe(true)
    })
  })

  describe('Resize Handling', () => {
    it('should handle resize without throwing', () => {
      // handleResize calls _applyScale which uses window.innerWidth/innerHeight
      // Mock those properties instead of replacing the whole window object
      Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
      expect(() => rendering.handleResize()).not.toThrow()
    })
  })

  describe('Clear', () => {
    it('should call clearRect on clear()', () => {
      rendering.clear()
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height)
    })
  })

})
