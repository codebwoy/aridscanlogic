import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  assessCoverStudio,
  buildCoverArtPrompt,
  COVER_KDP_CHECKLIST,
  COVER_LAYOUT_PRESETS,
  normalizeCoverStudioState,
  CREDIT_COSTS,
  TRACEABILITY,
  NAMED_TOOLS,
} from '../src/index.js'

describe('cover studio', () => {
  it('builds title-safe cover prompts without baked text', () => {
    const prompt = buildCoverArtPrompt({
      characterName: 'Luna',
      emotionalCore: 'belonging',
      layoutId: 'bedtime_soft',
      premise: 'A fox finds home under moonlight',
    })
    assert.match(prompt, /Luna/)
    assert.match(prompt, /title-safe/i)
    assert.match(prompt, /no text/i)
    assert.ok(!/write the title/i.test(prompt))
  })

  it('normalizes unknown layout to hero_centered', () => {
    const s = normalizeCoverStudioState({ layout_id: 'nope', finish: 'matte' })
    assert.equal(s.layout_id, 'hero_centered')
    assert.equal(s.finish, 'matte')
  })

  it('assesses wrap geometry and checklist', () => {
    const a = assessCoverStudio(
      { trim_id: 'sq_85', page_count: 32, paper_type: 'white', format_id: 'picture' },
      { layout_id: 'hero_centered' },
    )
    assert.ok(a.layout.widthIn > a.layout.trim.width)
    assert.equal(a.layout.spineTextAllowed, false)
    assert.ok(COVER_KDP_CHECKLIST.length >= 8)
    assert.equal(COVER_LAYOUT_PRESETS.length, 4)
    assert.ok(a.issues.some((i) => i.severity === 'block'))
  })

  it('prices generate_cover_art', () => {
    assert.equal(CREDIT_COSTS.generate_cover_art, 5)
  })

  it('traceability S68 + tool map', () => {
    assert.ok(TRACEABILITY.some((t) => t.id === 'S68' && t.status === 'done'))
    assert.ok(TRACEABILITY.some((t) => t.id === 'S72' && t.status === 'done'))
    assert.ok(TRACEABILITY.some((t) => t.id === 'S73' && t.status === 'done'))
    assert.ok(TRACEABILITY.some((t) => t.id === 'S74' && t.status === 'done'))
    assert.equal(NAMED_TOOLS.cover_studio?.jobType, 'generate_cover_art')
    assert.equal(NAMED_TOOLS.series_manager?.id, 'series_manager')
  })

  it('blocks embed when ISBN invalid', () => {
    const a = assessCoverStudio(
      { trim_id: 'sq_85', page_count: 32, pinned_anchor: { heroUrl: 'x' } },
      { embed_isbn_barcode: true, isbn: '123' },
    )
    assert.ok(a.issues.some((i) => i.severity === 'block' && /ISBN/i.test(i.message)))
  })

  it('normalizes isbn + embed flags', () => {
    const s = normalizeCoverStudioState({
      isbn: '978-3-16-148410-0',
      embed_isbn_barcode: true,
    })
    assert.equal(s.isbn, '978-3-16-148410-0')
    assert.equal(s.embed_isbn_barcode, true)
  })
})
