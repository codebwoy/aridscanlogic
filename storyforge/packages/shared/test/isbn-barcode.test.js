import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ean13CheckDigit,
  encodeEan13Modules,
  formatIsbnDisplay,
  isbn10To13,
  normalizeIsbn,
  validateIsbn13,
} from '../src/isbn-barcode.js'

describe('ISBN / EAN-13 barcode (S72)', () => {
  it('validates a known ISBN-13', () => {
    const v = validateIsbn13('978-3-16-148410-0')
    assert.equal(v.ok, true)
    assert.equal(v.isbn, '9783161484100')
  })

  it('rejects bad check digit', () => {
    const v = validateIsbn13('9783161484101')
    assert.equal(v.ok, false)
    assert.match(v.error, /check digit/i)
  })

  it('converts ISBN-10 to ISBN-13', () => {
    const isbn13 = isbn10To13('316148410X')
    assert.equal(isbn13.length, 13)
    assert.equal(validateIsbn13(isbn13).ok, true)
    assert.equal(normalizeIsbn('3-16-148410-X'), isbn13)
  })

  it('encodes 95 EAN modules', () => {
    const { modules, isbn } = encodeEan13Modules('9783161484100')
    assert.equal(isbn, '9783161484100')
    assert.equal(modules.length, 95)
    assert.deepEqual(modules.slice(0, 3), [1, 0, 1])
    assert.deepEqual(modules.slice(-3), [1, 0, 1])
  })

  it('formats display hyphens', () => {
    assert.match(formatIsbnDisplay('9783161484100'), /^978-/)
  })

  it('check digit helper', () => {
    assert.equal(ean13CheckDigit('978316148410'), '0')
  })
})
