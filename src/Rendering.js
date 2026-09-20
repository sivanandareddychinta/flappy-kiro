/**
 * Flappy Kiro — Rendering Component
 *
 * Draws all game states on a 2D Canvas context.
 * Handles READY, PLAYING, and ENDED screens, plus responsive scaling.
 */
import { WORLD } from './types.js'

// Colour palette
const COLORS = {
  sky: '#87CEEB',
  ground: '#8B6914',
  groundTop: '#228B22',
  wallTop: '#2d5a1b',
  wall: '#3d7a2b',
  wallHighlight: '#5aac3e',
  wallShadow: '#1e3d12',
  scoreText: '#ffffff',
  scoreShadow: '#000000',
  overlayBg: 'rgba(0, 0, 0, 0.55)',
  titleColor: '#FFD700',
  titleShadow: '#B8860B',
  menuColor: '#ffffff',
  menuHighlight: '#FFD700',
}

// Ground strip height (visual)
const GROUND_H = 60

export class Rendering {
  constructor() {
    this._ctx = null
    this._canvas = null
    this._ghostyImage = null
    this._scale = 1
    this._offsetX = 0
    this._offsetY = 0
    this._resizeHandler = null
  }

  /**
   * Initialize the renderer with the given canvas.
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    this._canvas = canvas
    this._ctx = canvas.getContext('2d')
    this._applyScale()

    this._resizeHandler = () => this.handleResize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._resizeHandler)
    }

    // Load ghosty sprite
    this._loadGhostyImage()
  }

  /**
   * Render the READY screen: background, title, and instructions.
   */
  drawReady() {
    if (!this._ctx) return
    const ctx = this._ctx
    const w = WORLD.WIDTH
    const h = WORLD.HEIGHT

    this._drawBackground()
    this._drawGround()

    // Overlay
    ctx.fillStyle = COLORS.overlayBg
    ctx.fillRect(0, h * 0.15, w, h * 0.35)

    // Title
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = `bold ${Math.floor(h * 0.1)}px "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = COLORS.titleShadow
    ctx.fillText('Flappy Kiro', w / 2 + 3, h * 0.22 + 3)
    ctx.fillStyle = COLORS.titleColor
    ctx.fillText('Flappy Kiro', w / 2, h * 0.22)

    // Instruction
    ctx.font = `${Math.floor(h * 0.04)}px "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = COLORS.menuColor
    ctx.fillText('Press SPACE or ↑ to Start', w / 2, h * 0.38)
    ctx.restore()
  }

  /**
   * Render the PLAYING screen: background, walls, ghosty, and score.
   * @param {object} ghosty - Player state { x, y, width, height, rotation }
   * @param {object[]} walls - Array of wall objects
   * @param {number} score - Current score
   */
  drawGame(ghosty, walls, score) {
    if (!this._ctx) return

    this._drawBackground()

    // Draw walls
    for (const wall of walls) {
      this._drawWall(wall)
    }

    this._drawGround()

    // Draw player
    if (ghosty) {
      this._drawGhosty(ghosty)
    }

    // Draw score
    this._drawScore(score)
  }

  /**
   * Render the ENDED screen: game-over overlay with score and restart prompt.
   * @param {number} score - Final score
   * @param {number} highScore - All-time high score
   */
  drawEnded(score, highScore) {
    if (!this._ctx) return
    const ctx = this._ctx
    const w = WORLD.WIDTH
    const h = WORLD.HEIGHT

    this._drawBackground()
    this._drawGround()

    // Dark overlay
    ctx.fillStyle = COLORS.overlayBg
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.textAlign = 'center'

    // Game Over heading
    ctx.font = `bold ${Math.floor(h * 0.09)}px "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = '#FF4444'
    ctx.fillText('Game Over', w / 2 + 3, h * 0.23 + 3)
    ctx.fillStyle = '#FF8888'
    ctx.fillText('Game Over', w / 2, h * 0.23)

    // Score
    ctx.font = `bold ${Math.floor(h * 0.055)}px "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = COLORS.menuColor
    ctx.fillText(`Score: ${score}`, w / 2, h * 0.38)

    // High score
    ctx.fillStyle = COLORS.menuHighlight
    ctx.fillText(`Best: ${highScore}`, w / 2, h * 0.46)

    // Restart prompt
    ctx.font = `${Math.floor(h * 0.04)}px "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = COLORS.menuColor
    ctx.fillText('Press SPACE to Restart', w / 2, h * 0.62)

    ctx.restore()
  }

  /**
   * Clear the entire canvas.
   */
  clear() {
    if (!this._ctx) return
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  /**
   * Handle window resize: recalculate scale to maintain 16:9-ish aspect ratio.
   */
  handleResize() {
    this._applyScale()
  }

  /**
   * Destroy the renderer, removing event listeners.
   */
  destroy() {
    if (this._resizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this._resizeHandler)
    }
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  _applyScale() {
    if (!this._canvas || typeof window === 'undefined') return

    const winW = window.innerWidth
    const winH = window.innerHeight
    const gameW = WORLD.WIDTH
    const gameH = WORLD.HEIGHT

    const scaleX = winW / gameW
    const scaleY = winH / gameH
    this._scale = Math.min(scaleX, scaleY)

    const scaledW = Math.floor(gameW * this._scale)
    const scaledH = Math.floor(gameH * this._scale)

    this._canvas.style.width = `${scaledW}px`
    this._canvas.style.height = `${scaledH}px`
  }

  _loadGhostyImage() {
    if (typeof Image === 'undefined') return
    const img = new Image()
    img.onload = () => { this._ghostyImage = img }
    img.onerror = () => { this._ghostyImage = null }
    img.src = '/assets/ghosty.png'
  }

  _drawBackground() {
    const ctx = this._ctx
    const w = WORLD.WIDTH
    const h = WORLD.HEIGHT

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#87CEEB')
    grad.addColorStop(1, '#c8e8f0')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  }

  _drawGround() {
    const ctx = this._ctx
    const w = WORLD.WIDTH
    const h = WORLD.HEIGHT

    // Grass strip
    ctx.fillStyle = COLORS.groundTop
    ctx.fillRect(0, h - GROUND_H, w, 8)
    // Dirt
    ctx.fillStyle = COLORS.ground
    ctx.fillRect(0, h - GROUND_H + 8, w, GROUND_H - 8)
  }

  _drawWall(wall) {
    const ctx = this._ctx
    const h = WORLD.HEIGHT

    // Top pillar
    if (wall.topHeight > 0) {
      ctx.fillStyle = COLORS.wallShadow
      ctx.fillRect(wall.x + 4, 0, wall.width, wall.topHeight)
      ctx.fillStyle = COLORS.wall
      ctx.fillRect(wall.x, 0, wall.width, wall.topHeight)
      ctx.fillStyle = COLORS.wallHighlight
      ctx.fillRect(wall.x, 0, 6, wall.topHeight)
      // Cap
      ctx.fillStyle = COLORS.wallShadow
      ctx.fillRect(wall.x - 4, wall.topHeight - 20, wall.width + 8, 20)
      ctx.fillStyle = COLORS.wall
      ctx.fillRect(wall.x - 4, wall.topHeight - 20, wall.width + 8, 18)
    }

    // Bottom pillar
    if (wall.bottomHeight > 0) {
      ctx.fillStyle = COLORS.wallShadow
      ctx.fillRect(wall.x + 4, wall.bottomY, wall.width, wall.bottomHeight)
      ctx.fillStyle = COLORS.wall
      ctx.fillRect(wall.x, wall.bottomY, wall.width, wall.bottomHeight)
      ctx.fillStyle = COLORS.wallHighlight
      ctx.fillRect(wall.x, wall.bottomY, 6, wall.bottomHeight)
      // Cap
      ctx.fillStyle = COLORS.wallShadow
      ctx.fillRect(wall.x - 4, wall.bottomY, wall.width + 8, 20)
      ctx.fillStyle = COLORS.wall
      ctx.fillRect(wall.x - 4, wall.bottomY + 2, wall.width + 8, 18)
    }
  }

  _drawGhosty(ghosty) {
    const ctx = this._ctx

    ctx.save()
    ctx.translate(ghosty.x + ghosty.width / 2, ghosty.y + ghosty.height / 2)
    ctx.rotate(ghosty.rotation || 0)

    if (this._ghostyImage && this._ghostyImage.complete && this._ghostyImage.naturalWidth > 0) {
      ctx.drawImage(
        this._ghostyImage,
        -ghosty.width / 2,
        -ghosty.height / 2,
        ghosty.width,
        ghosty.height
      )
    } else {
      // Fallback: draw a simple ghost shape
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, 0, ghosty.width / 2, Math.PI, 0)
      ctx.lineTo(ghosty.width / 2, ghosty.height / 2)
      // Wavy bottom
      const steps = 3
      const stepW = ghosty.width / steps
      for (let i = steps - 1; i >= 0; i--) {
        ctx.lineTo(-ghosty.width / 2 + stepW * i + stepW / 2, 0)
        ctx.lineTo(-ghosty.width / 2 + stepW * i, ghosty.height / 2)
      }
      ctx.closePath()
      ctx.fill()
      // Eyes
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(-6, -3, 4, 0, Math.PI * 2)
      ctx.arc(6, -3, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  _drawScore(score) {
    const ctx = this._ctx
    const w = WORLD.WIDTH

    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = `bold ${Math.floor(WORLD.HEIGHT * 0.07)}px "Segoe UI", Arial, sans-serif`
    // Shadow
    ctx.fillStyle = COLORS.scoreShadow
    ctx.fillText(String(score), w / 2 + 3, 58)
    // Main text
    ctx.fillStyle = COLORS.scoreText
    ctx.fillText(String(score), w / 2, 55)
    ctx.restore()
  }
}
