import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseTrimSizeIn,
  resolvePrintPageGeometry,
  buildPrintPdf,
  buildReportPdf,
} from '../src/index.js'

test('parseTrimSizeIn reads 6x9', () => {
  assert.deepEqual(parseTrimSizeIn('6x9'), { widthIn: 6, heightIn: 9 })
  assert.deepEqual(parseTrimSizeIn('5.5 × 8.5'), { widthIn: 5.5, heightIn: 8.5 })
})

test('bleed enlarges page beyond trim', () => {
  const geo = resolvePrintPageGeometry(
    { print_config: { trim_size_in: '6x9', bleed: true, outside_margin_in: 0.5, gutter_in: 0.5 } },
    { wordCountTotal: 40000 }
  )
  assert.equal(geo.trim_width_in, 6)
  assert.ok(geo.page_width_in > 6)
  assert.ok(geo.page_height_in > 9)
})

test('buildPrintPdf returns PDF bytes with pages', async () => {
  const { bytes, page_count, geometry } = await buildPrintPdf({
    id: 't1',
    title: 'Test Book',
    author_name: 'Ada',
    subtitle: 'A subtitle',
    print_config: { trim_size_in: '6x9', outside_margin_in: 0.5, gutter_in: 0.75, bleed: false },
    sections: {
      a: {
        key: 'a',
        order: 0,
        title: 'Chapter 1',
        content_md:
          'She walked through the market at dusk. The air smelled of cardamom and rain. Words continued long enough for wrapping across the printable measure of the page.',
      },
      b: {
        key: 'b',
        order: 1,
        title: 'Chapter 2',
        content_md: 'Jonas waited by the river and watched the sky change color.',
      },
    },
  })
  assert.ok(bytes.length > 500)
  assert.equal(bytes[0], 0x25) // %
  assert.equal(bytes[1], 0x50) // P
  assert.equal(bytes[2], 0x44) // D
  assert.equal(bytes[3], 0x46) // F
  assert.ok(page_count >= 3)
  assert.equal(geometry.trim_width_in, 6)
})

test('buildReportPdf returns PDF header', async () => {
  const { bytes } = await buildReportPdf({
    id: 'r1',
    title: 'Report Book',
    scores: { overall: 80, readiness: 'ready_for_final_author_review', counts: { total_open: 1 } },
    findings: [
      {
        severity: 'major',
        title: 'Issue',
        explanation: 'Fix this',
        original_excerpt: 'bad text',
      },
    ],
  })
  assert.ok(bytes.length > 200)
  assert.equal(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]), '%PDF')
})
