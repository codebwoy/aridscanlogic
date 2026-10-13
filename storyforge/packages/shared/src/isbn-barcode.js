/**
 * ISBN-13 / EAN-13 helpers for KDP cover barcodes.
 * Generates module patterns StoryForge draws into the wrap PDF.
 * Not affiliated with Amazon. Always verify your ISBN with your registrar (e.g. MVB).
 */

export const ISBN_BARCODE_META = {
  id: 'isbn_barcode',
  title: 'ISBN barcode on cover wrap',
  sourceIds: ['S72'],
  disclaimer:
    'StoryForge can draw an EAN-13 barcode from a valid ISBN-13. KDP may still place its own barcode if you leave the reserve empty — only embed your own when you supply a valid ISBN and understand KDP Print Options. Not affiliated with Amazon.',
}

/** Strip spaces/hyphens; accept ISBN-13 or ISBN-10 (converted). */
export function normalizeIsbn(raw) {
  const s = String(raw || '')
    .replace(/[^0-9Xx]/g, '')
    .toUpperCase()
  if (!s) return ''
  if (s.length === 10) return isbn10To13(s)
  if (s.length === 13) return s
  return s
}

export function isbn10To13(isbn10) {
  const core = String(isbn10).slice(0, 9)
  if (!/^\d{9}$/.test(core)) return ''
  const withPrefix = `978${core}`
  return withPrefix + ean13CheckDigit(withPrefix)
}

export function ean13CheckDigit(first12) {
  const d = String(first12).replace(/\D/g, '')
  if (d.length !== 12) return ''
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const n = Number(d[i])
    sum += i % 2 === 0 ? n : n * 3
  }
  return String((10 - (sum % 10)) % 10)
}

export function validateIsbn13(raw) {
  const isbn = normalizeIsbn(raw)
  if (!/^\d{13}$/.test(isbn)) {
    return { ok: false, isbn: '', error: 'ISBN must be 13 digits (or convertible ISBN-10)' }
  }
  const expected = ean13CheckDigit(isbn.slice(0, 12))
  if (isbn[12] !== expected) {
    return { ok: false, isbn, error: `Invalid check digit (expected ${expected})` }
  }
  if (!isbn.startsWith('978') && !isbn.startsWith('979')) {
    return { ok: false, isbn, error: 'Book ISBNs usually start with 978 or 979' }
  }
  return { ok: true, isbn, error: null }
}

// EAN-13 left/right digit encodings (L / G / R patterns as binary strings: 1=bar)
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']
const FIRST_DIGIT_PARITY = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL',
]

/**
 * Encode ISBN-13 to EAN-13 modules: array of 0/1 (1 = black bar).
 * Includes start/center/end guards. Total modules = 95.
 */
export function encodeEan13Modules(isbn13) {
  const v = validateIsbn13(isbn13)
  if (!v.ok) throw new Error(v.error || 'Invalid ISBN')
  const d = v.isbn.split('').map(Number)
  const parity = FIRST_DIGIT_PARITY[d[0]]
  const modules = []
  // start guard 101
  modules.push(1, 0, 1)
  for (let i = 0; i < 6; i++) {
    const pattern = parity[i] === 'L' ? L[d[i + 1]] : G[d[i + 1]]
    for (const ch of pattern) modules.push(Number(ch))
  }
  // center 01010
  modules.push(0, 1, 0, 1, 0)
  for (let i = 7; i < 13; i++) {
    for (const ch of R[d[i]]) modules.push(Number(ch))
  }
  // end guard 101
  modules.push(1, 0, 1)
  return { isbn: v.isbn, modules }
}

/** Format ISBN-13 with hyphens for display (simple 978-… grouping). */
export function formatIsbnDisplay(isbn13) {
  const v = validateIsbn13(isbn13)
  if (!v.ok) return String(isbn13 || '')
  const s = v.isbn
  return `${s.slice(0, 3)}-${s.slice(3, 4)}-${s.slice(4, 9)}-${s.slice(9, 12)}-${s.slice(12)}`
}

export function isbnBarcodePayload() {
  return { meta: ISBN_BARCODE_META }
}
