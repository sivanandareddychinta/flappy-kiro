import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GameLoop } from '../src/GameLoop.js'
import { GameState } from '../src/types.js'
import { createMockCanvas } from './fixtures/mockCanvas.js'

// ─── Mock factory helpers ────────────────────────────────────────────────────

function makePhysicsMock() {
  return {
    applyGravity: vi.fn(),
    applyImpulse: vi.fn(),
    updatePosition: vi.fn(),
    updateRotation: vi.fn(),
    boundaryCheck: vi.fn().mockReturnValue({ hitTop: false, hitBottom: false }),
    wallCollisionCheck: vi.fn().mockReturnValue(false),
    scrollWalls: vi.fn(),
  }
}

function makeGhostyObj() {
  return { x: 80, y: 300, vx: 0, vy: 0, width: 36, height: 36, isAlive: true }
}

function makePlayerMock(ghosty) {
  return {
    init: vi.fn(),
    update: vi.fn().mockReturnValue({ hitTop: false, hitBottom: false }),
    flap: vi.fn(),
    kill: vi.fn(),
    getState: vi.fn().mockReturnValue({ ...ghosty, rotation: 0 }),
    getGhosty: vi.fn().mockReturnValue(ghosty),
  }
}

function makeObstaclesMock() {
  return {
    init: vi.fn(),
    update: vi.fn(),
    getWalls: vi.fn().mockReturnValue([]),
    getPassableWalls: vi.fn().mockReturnValue([]),
    reset: vi.fn(),
  }
}

function makeScoringMock() {
  return {
    init: vi.fn(),
    reset: vi.fn(),
    score: 0,
    checkPassage: vi.fn().mockReturnValue(0),
    getScore: vi.fn().mockReturnValue(0),
    getHighScore: vi.fn().mockReturnValue(0),
    recordEndGame: vi.fn(),
  }
}

function makeInputMock() {
  return {
    init: vi.fn(),
    destroy: vi.fn(),
    pollInput: vi.fn().mockReturnValue({ flap: false }),
    simulateKeyDown: vi.fn(),
    simulateKeyUp: vi.fn(),
  }
}

function makeAudioMock() {
  return {
    init: vi.fn(),
    playFlap: vi.fn(),
    playPoint: vi.fn(),
    playCollision: vi.fn(),
    playBackgroundMusic: vi.fn(),
    stopBackgroundMusic: vi.fn(),
    setMuted: vi.fn(),
    isMuted: vi.fn().mockReturnValue(false),
  }
}

function makePersistenceMock() {
  return {
    init: vi.fn(),
    getHighScore: vi.fn().mockReturnValue(0),
    setHighScore: vi.fn(),
    getMutedState: vi.fn().mockReturnValue(false),
    setMutedState: vi.fn(),
  }
}

function makeRenderingMock() {
  return {
    init: vi.fn(),
    drawGame: vi.fn(),
    drawReady: vi.fn(),
    drawEnded: vi.fn(),
    clear: vi.fn(),
    handleResize: vi.fn(),
    destroy: vi.fn(),
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('GameLoop Component', () => {
  let gameLoop
  let canvas
  let mocks
  let ghosty

  beforeEach(() => {
    canvas = createMockCanvas()
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    ghosty = makeGhostyObj()

    mocks = {
      physics: makePhysicsMock(),
      player: makePlayerMock(ghosty),
      obstacles: makeObstaclesMock(),
      scoring: makeScoringMock(),
      input: makeInputMock(),
      audio: makeAudioMock(),
      persistence: makePersistenceMock(),
      rendering: makeRenderingMock(),
    }

    gameLoop = new GameLoop()
    gameLoop.init(canvas, mocks)
  })

  afterEach(() => {
    gameLoop.stop()
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should start in READY state after init', () => {
      expect(gameLoop.getState()).toBe(GameState.READY)
    })
  })

  describe('State Transitions', () => {
    it('should transition READY → PLAYING when flap input received', () => {
      expect(gameLoop.getState()).toBe(GameState.READY)

      mocks.input.pollInput.mockReturnValue({ flap: true })
      gameLoop.run(100)

      expect(gameLoop.getState()).toBe(GameState.PLAYING)
    })

    it('should transition PLAYING → ENDED when player collides with wall', () => {
      gameLoop.state = GameState.PLAYING

      const wall = { x: 75, width: 52, gapY: 200, gapSize: 140 }
      mocks.obstacles.getWalls.mockReturnValue([wall])
      mocks.physics.wallCollisionCheck.mockReturnValue(true)

      gameLoop.run(100)

      expect(gameLoop.getState()).toBe(GameState.ENDED)
    })

    it('should transition PLAYING → ENDED when player hits bottom boundary', () => {
      gameLoop.state = GameState.PLAYING

      mocks.player.update.mockReturnValue({ hitTop: false, hitBottom: true })
      const deadGhosty = { x: 80, y: 620, width: 36, height: 36, isAlive: false }
      mocks.player.getGhosty.mockReturnValue(deadGhosty)

      gameLoop.run(100)

      expect(gameLoop.getState()).toBe(GameState.ENDED)
    })

    it('should transition ENDED → READY when flap received in ENDED state', () => {
      gameLoop.state = GameState.ENDED

      mocks.input.pollInput.mockReturnValue({ flap: true })
      gameLoop.run(300)

      expect(gameLoop.getState()).toBe(GameState.READY)
    })
  })

  describe('Scoring', () => {
    it('should call checkPassage on scoring during PLAYING state', () => {
      gameLoop.state = GameState.PLAYING
      gameLoop.run(100)
      expect(mocks.scoring.checkPassage).toHaveBeenCalled()
    })
  })

  describe('Cleanup', () => {
    it('should set isRunning to false on stop()', () => {
      expect(gameLoop.isRunning).toBe(true)
      gameLoop.stop()
      expect(gameLoop.isRunning).toBe(false)
    })
  })

})
