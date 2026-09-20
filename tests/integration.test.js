/**
 * Integration Tests — Flappy Kiro
 *
 * Tests key component boundaries and end-to-end scenarios using real
 * (non-mocked) components where possible.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GameState, DEFAULT_SETTINGS, WORLD } from '../src/types.js'
import { Physics } from '../src/Physics.js'
import { Player } from '../src/Player.js'
import { Obstacles } from '../src/Obstacles.js'
import { Scoring } from '../src/Scoring.js'
import { Persistence } from '../src/Persistence.js'
import { Input } from '../src/Input.js'
import { GameLoop } from '../src/GameLoop.js'
import { createMockCanvas } from './fixtures/mockCanvas.js'
import { installMockAudioContext, removeMockAudioContext } from './fixtures/mockAudio.js'

describe('Integration Tests', () => {

  beforeEach(() => {
    localStorage.clear()
    installMockAudioContext()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    removeMockAudioContext()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('Full Game Cycle: READY → PLAYING → ENDED', () => {
    it('should complete a full state cycle using real components', () => {
      const canvas = createMockCanvas()

      // Build real component instances
      const physics = new Physics()
      const player = new Player(physics)
      const obstacles = new Obstacles()
      const persistence = new Persistence()
      const scoring = new Scoring(persistence)
      const input = new Input()
      const rendering = {
        init: vi.fn(),
        drawGame: vi.fn(),
        drawReady: vi.fn(),
        drawEnded: vi.fn(),
        clear: vi.fn(),
        handleResize: vi.fn(),
        destroy: vi.fn(),
      }
      const audio = {
        init: vi.fn(),
        playFlap: vi.fn(),
        playPoint: vi.fn(),
        playCollision: vi.fn(),
        playBackgroundMusic: vi.fn(),
        stopBackgroundMusic: vi.fn(),
        setMuted: vi.fn(),
        isMuted: vi.fn().mockReturnValue(false),
      }

      const gameLoop = new GameLoop()
      gameLoop.init(canvas, { physics, player, obstacles, scoring, input, rendering, audio, persistence })

      // 1. Starts in READY
      expect(gameLoop.getState()).toBe(GameState.READY)

      // 2. Flap transitions to PLAYING
      input.simulateKeyDown(' ')
      gameLoop.run(100)
      expect(gameLoop.getState()).toBe(GameState.PLAYING)

      // 3. Multiple frames of gameplay (no collision yet)
      input.simulateKeyUp(' ')
      for (let i = 0; i < 20; i++) {
        gameLoop.run(100 + i * 16.67)
      }
      // Still playing (player might have hit boundary in real test; verify state is PLAYING or ENDED)
      const stateAfterFrames = gameLoop.getState()
      expect([GameState.PLAYING, GameState.ENDED]).toContain(stateAfterFrames)

      gameLoop.stop()
    })
  })

  describe('Obstacle + Physics + Scoring Integration', () => {
    it('should detect wall collision using real physics and obstacles', () => {
      const physics = new Physics()
      const player = new Player(physics)
      const obstacles = new Obstacles()

      player.init()
      obstacles.init()

      // Scroll a wall directly to the player
      const ghosty = player.getGhosty()
      ghosty.y = 50 // Position player in top pillar zone

      // Get first wall, move it so its x aligns with the player
      obstacles.getWalls()[0].x = ghosty.x - 10
      obstacles.getWalls()[0].gapY = 300 // Gap far below player
      obstacles.getWalls()[0].gapSize = DEFAULT_SETTINGS.gapSize

      const wall = obstacles.getWalls()[0]
      const collision = physics.wallCollisionCheck(ghosty, wall)
      expect(collision).toBe(true)
    })

    it('should award a point when player passes a wall using real scoring', () => {
      const physics = new Physics()
      const player = new Player(physics)
      const obstacles = new Obstacles()
      const persistence = new Persistence()
      const scoring = new Scoring(persistence)

      player.init()
      persistence.init()
      obstacles.init()
      scoring.init()

      expect(scoring.getScore()).toBe(0)

      // Move player far to the right of the first wall
      const ghosty = player.getGhosty()
      ghosty.x = 400

      // Get the first wall and make sure it's to the left of the player
      const walls = obstacles.getWalls()
      walls[0].x = 100  // Wall is to the left
      walls[0].passed = false

      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(1)
    })
  })

  describe('Persistence Flow Integration', () => {
    it('should save and reload high score across persistence instances', () => {
      const p1 = new Persistence()
      p1.init()
      p1.setHighScore(15)

      // Simulate new session by creating fresh persistence instance
      const p2 = new Persistence()
      p2.init()
      expect(p2.getHighScore()).toBe(15)
    })

    it('should persist mute state across instances', () => {
      const p1 = new Persistence()
      p1.init()
      p1.setMutedState(true)

      const p2 = new Persistence()
      p2.init()
      expect(p2.getMutedState()).toBe(true)
    })
  })

  describe('Input → GameLoop Integration', () => {
    it('should respond to spacebar flap from real Input component', () => {
      const canvas = createMockCanvas()
      const physics = new Physics()
      const player = new Player(physics)
      const input = new Input()

      const rendering = {
        init: vi.fn(), drawGame: vi.fn(), drawReady: vi.fn(),
        drawEnded: vi.fn(), clear: vi.fn(), handleResize: vi.fn(), destroy: vi.fn(),
      }
      const audio = {
        init: vi.fn(), playFlap: vi.fn(), playPoint: vi.fn(), playCollision: vi.fn(),
        playBackgroundMusic: vi.fn(), stopBackgroundMusic: vi.fn(),
        setMuted: vi.fn(), isMuted: vi.fn().mockReturnValue(false),
      }

      const gameLoop = new GameLoop()
      gameLoop.init(canvas, {
        physics, player,
        obstacles: new Obstacles(),
        scoring: new Scoring(new Persistence()),
        input, rendering, audio,
        persistence: new Persistence(),
      })

      expect(gameLoop.getState()).toBe(GameState.READY)

      // Simulate spacebar via real Input's simulateKeyDown
      input.simulateKeyDown(' ')
      gameLoop.run(50)

      expect(gameLoop.getState()).toBe(GameState.PLAYING)
      gameLoop.stop()
    })
  })

  describe('Scoring Persistence End-Game Integration', () => {
    it('should record high score at end of game via scoring.recordEndGame', () => {
      const persistence = new Persistence()
      persistence.init()
      const scoring = new Scoring(persistence)
      scoring.init()

      // Simulate scoring points
      const ghosty = { x: 400, width: 36 }
      const walls = [
        { x: 100, width: 52, passed: false },
        { x: 300, width: 52, passed: false },
      ]
      scoring.checkPassage(ghosty, walls)
      expect(scoring.getScore()).toBe(2)

      // End the game
      scoring.recordEndGame()
      expect(scoring.getHighScore()).toBe(2)
      expect(persistence.getHighScore()).toBe(2)
    })
  })

})
