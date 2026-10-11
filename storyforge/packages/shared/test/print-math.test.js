import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  requiredBleedPixels,
  spineWidthInches,
  preflightImageResolution,
  validatePageCount,
  coverWrapPixels,
} from '../src/print-math.js'

describe('requiredBleedPixels', () => {
  it('computes 8.5×8.5 with 0.125" bleed at 300 DPI', () => {
    // (8.5 + 0.25) * 300 = 2625
    const r = requiredBleedPixels('sq_85')
    assert.equal(r.widthPx, 2625)
    assert.equal(r.heightPx, 2625)
    assert.equal(r.dpi, 300)
  })

  it('computes 8×8 with bleed', () => {
    // (8 + 0.25) * 300 = 2475
    const r = requiredBleedPixels('sq_8')
    assert.equal(r.widthPx, 2475)
    assert.equal(r.heightPx, 2475)
  })

  it('blocks under-resolution images (Neolemon 2560 cap is insufficient for 8.5")', () => {
    const check = preflightImageResolution(2560, 2560, 'sq_85')
    assert.equal(check.ok, false)
    assert.equal(check.severity, 'block')
  })

  it('passes exact minimum', () => {
    const check = preflightImageResolution(2625, 2625, 'sq_85')
    assert.equal(check.ok, true)
  })
})

describe('spineWidthInches', () => {
  it('scales with page count', () => {
    const a = spineWidthInches(24, 'white')
    const b = spineWidthInches(48, 'white')
    assert.ok(Math.abs(b - a * 2) < 1e-9)
  })
})

describe('coverWrapPixels', () => {
  it('is wider than a single page', () => {
    const page = requiredBleedPixels('sq_85')
    const wrap = coverWrapPixels('sq_85', 32, 'white')
    assert.ok(wrap.widthPx > page.widthPx)
    assert.equal(wrap.heightPx, page.heightPx)
    assert.ok(wrap.back && wrap.spine && wrap.front)
    assert.ok(wrap.barcode?.widthIn >= 2)
  })
})

describe('validatePageCount', () => {
  it('requires even counts in range', () => {
    assert.equal(validatePageCount(32).ok, true)
    assert.equal(validatePageCount(25).ok, false)
    assert.equal(validatePageCount(10).ok, false)
  })
})
