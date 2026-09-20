import { describe, it, expect } from 'vitest'

describe('Test Runner Sanity Check', () => {
  it('should run tests', () => {
    expect(true).toBe(true)
  })

  it('should support arithmetic', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have access to jsdom globals', () => {
    expect(typeof document).toBe('object')
    expect(typeof window).toBe('object')
  })

  it('should have access to localStorage via jsdom', () => {
    localStorage.setItem('test', 'value')
    expect(localStorage.getItem('test')).toBe('value')
    localStorage.clear()
  })

  it('should support canvas creation via jsdom', () => {
    const canvas = document.createElement('canvas')
    expect(canvas.tagName).toBe('CANVAS')
  })
})
