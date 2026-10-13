import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildColoringPagePrompt,
  buildBackCoverArtPrompt,
  assessColoringPages,
  resolveJobCost,
  CREDIT_COSTS,
  TRACEABILITY,
  NAMED_TOOLS,
} from '../src/index.js'

describe('coloring pages + back cover', () => {
  it('builds a line-art coloring prompt', () => {
    const p = buildColoringPagePrompt({
      characterName: 'Luna',
      pageBrief: 'Luna waves at the moon',
      pageIndex: 2,
    })
    assert.match(p, /COLORING PAGE/)
    assert.match(p, /Luna/)
    assert.match(p, /black outlines|white background/i)
    assert.match(p, /no text/i)
  })

  it('builds barcode-safe back cover prompt', () => {
    const p = buildBackCoverArtPrompt({
      characterName: 'Luna',
      emotionalCore: 'belonging',
    })
    assert.match(p, /BACK COVER/i)
    assert.match(p, /LOWER-RIGHT|barcode/i)
    assert.match(p, /no text/i)
  })

  it('assesses missing coloring pages', () => {
    const a = assessColoringPages({
      pinned_anchor: { heroUrl: 'data:image/png;base64,x' },
      pages: [{ asset: { url: 'x' } }, { asset: null }],
    })
    assert.equal(a.withArt, 1)
    assert.equal(a.withColoring, 0)
    assert.ok(a.issues.some((i) => /No coloring/i.test(i.message)))
  })

  it('cover studio warns when back art is missing', async () => {
    const { assessCoverStudio } = await import('../src/index.js')
    const a = assessCoverStudio(
      { trim_id: 'sq_85', page_count: 32, pinned_anchor: { heroUrl: 'x' } },
      { front_art_url: 'front.png' },
    )
    assert.equal(a.hasFront, true)
    assert.equal(a.hasBack, false)
    assert.ok(a.issues.some((i) => /back cover art/i.test(i.message)))
  })

  it('prices coloring_all_pages dynamically', () => {
    assert.equal(CREDIT_COSTS.coloring_page, 3)
    assert.equal(CREDIT_COSTS.generate_back_cover_art, 4)
    assert.equal(
      resolveJobCost('coloring_all_pages', { pagesWithArt: 4, pagesWithColoring: 1, skipExisting: false }),
      12,
    )
    assert.equal(
      resolveJobCost('coloring_all_pages', { pagesWithArt: 4, pagesWithColoring: 1, skipExisting: true }),
      9,
    )
  })

  it('traceability S70–S71 + tools', () => {
    assert.ok(TRACEABILITY.some((t) => t.id === 'S70' && t.status === 'done'))
    assert.ok(TRACEABILITY.some((t) => t.id === 'S71' && t.status === 'done'))
    assert.equal(NAMED_TOOLS.coloring_pages?.jobType, 'coloring_all_pages')
  })
})
