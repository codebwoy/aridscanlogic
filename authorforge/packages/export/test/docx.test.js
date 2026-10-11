import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDocx, buildCoverSvg, buildAPlusModuleSvg } from '../src/index.js'

test('buildDocx produces zip/docx bytes', async () => {
  const { bytes } = await buildDocx({
    title: 'Demo',
    author: 'A',
    chapters: [{ title: 'One', content_md: 'Hello world paragraph.' }],
  })
  assert.ok(bytes.byteLength > 1000)
  // DOCX is a zip — starts with PK
  assert.equal(bytes[0], 0x50)
  assert.equal(bytes[1], 0x4b)
})

test('cover svg includes exact title', () => {
  const { bytes, typography_ok } = buildCoverSvg({ title: 'Exact Title', author: 'Ada' })
  const text = new TextDecoder().decode(bytes)
  assert.ok(text.includes('Exact Title'))
  assert.equal(typography_ok, true)
})

test('aplus module svg builds', () => {
  const m = buildAPlusModuleSvg({ type: 'checklist', title: 'Book', points: ['A', 'B'] })
  assert.ok(new TextDecoder().decode(m.bytes).includes('A+ MODULE'))
})
