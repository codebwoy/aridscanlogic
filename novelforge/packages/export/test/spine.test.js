import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spineWidthInches, coverWrapLayout, buildInteriorPdf } from '../src/index.js'

test('spine and wrap layout', () => {
  const s = spineWidthInches(220, 'white')
  assert.ok(s > 0.4 && s < 1)
  const layout = coverWrapLayout({ trimId: '6x9', pageCount: 220 })
  assert.ok(layout.widthPt > layout.trimWidthPt * 2)
})

test('interior pdf builds', async () => {
  const { bytes, pageCount } = await buildInteriorPdf({
    title: 'Test Book',
    author: 'Tester',
    chapters: [{ title: 'Chapter 1', content_md: 'Hello world. '.repeat(40) }],
  })
  assert.ok(bytes.byteLength > 500)
  assert.ok(pageCount >= 3)
})
