/**
 * Mock Canvas 2D context for testing rendering without a real browser.
 */

/**
 * Creates a mock HTMLCanvasElement with a mocked 2D context.
 * @returns {HTMLCanvasElement}
 */
export function createMockCanvas() {
  const canvas = document.createElement('canvas')
  canvas.id = 'gameCanvas'
  canvas.width = 480
  canvas.height = 640

  // Patch getContext to return a fully-mocked 2D context
  const ctx = {
    canvas,
    fillStyle: '#000',
    strokeStyle: '#000',
    font: '16px sans-serif',
    textAlign: 'left',
    textBaseline: 'top',
    globalAlpha: 1,
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 100 }),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
    createRadialGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
  }

  canvas.getContext = vi.fn().mockReturnValue(ctx)

  return canvas
}
