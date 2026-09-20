/**
 * Mock Web Audio API for testing Audio component without real audio.
 */

/**
 * Creates a mock AudioContext with all required methods stubbed.
 * @returns {object} Mock AudioContext-like object
 */
export function createMockAudioContext() {
  const destination = { connect: vi.fn() }

  const gainNode = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1.0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
  }

  const bufferSource = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    buffer: null,
    loop: false,
    onended: null,
  }

  const buffer = {
    duration: 1.0,
    numberOfChannels: 1,
    sampleRate: 44100,
    getChannelData: vi.fn().mockReturnValue(new Float32Array(44100)),
  }

  return {
    destination,
    currentTime: 0,
    state: 'running',
    createBufferSource: vi.fn().mockReturnValue({ ...bufferSource }),
    createGain: vi.fn().mockReturnValue(gainNode),
    createBuffer: vi.fn().mockReturnValue(buffer),
    decodeAudioData: vi.fn().mockResolvedValue(buffer),
    resume: vi.fn().mockResolvedValue(undefined),
    suspend: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  }
}

/**
 * Installs a mock AudioContext constructor on the global window object.
 * Call this in beforeEach; call removeMockAudioContext in afterEach.
 */
export function installMockAudioContext() {
  const mockCtx = createMockAudioContext()
  global.AudioContext = vi.fn().mockImplementation(() => mockCtx)
  global.webkitAudioContext = vi.fn().mockImplementation(() => mockCtx)
  return mockCtx
}

/**
 * Removes the mock AudioContext constructor from global scope.
 */
export function removeMockAudioContext() {
  delete global.AudioContext
  delete global.webkitAudioContext
}
