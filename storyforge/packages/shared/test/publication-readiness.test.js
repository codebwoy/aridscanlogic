import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  assessPublicationReadiness,
  normalizePublicationSignoff,
  emptyPublicationSignoff,
  bannedPhraseHits,
  CONTINUITY_SIGNOFF_ITEMS,
  PUBLICATION_READINESS_META,
} from '../src/publication-readiness.js'
import { requiredBleedPixels } from '../src/print-math.js'

function makePages(n, { art = true, text = true, badge = 'pass', dims = true } = {}) {
  const req = requiredBleedPixels('sq_85')
  return Array.from({ length: n }, (_, i) => ({
    page_index: i,
    text_content: text ? `Page ${i + 1} Luna finds courage.` : '',
    text_secondary: '',
    asset: art
      ? {
          url: `data:image/svg+xml,page${i}`,
          width: dims ? req.widthPx : undefined,
          height: dims ? req.heightPx : undefined,
        }
      : null,
    consistencyBadge: art ? badge : null,
  }))
}

describe('publication readiness', () => {
  it('exposes continuity signoff items from craft checklist', () => {
    assert.ok(CONTINUITY_SIGNOFF_ITEMS.length >= 6)
    assert.ok(PUBLICATION_READINESS_META.disclaimer.includes('not a guarantee'))
  })

  it('flags empty draft as blocked', () => {
    const report = assessPublicationReadiness({
      page_count: 24,
      trim_id: 'sq_85',
      pages: makePages(24, { art: false, text: false }),
    })
    assert.equal(report.level, 'blocked')
    assert.ok(report.score < 40)
    assert.ok(report.issues.some((i) => i.gate === 'print'))
    assert.equal(report.publishClaimAllowed, false)
  })

  it('scores a complete book high when signoff is filled', () => {
    const signoff = emptyPublicationSignoff()
    for (const item of CONTINUITY_SIGNOFF_ITEMS) signoff.continuity[item.id] = true
    signoff.kdp_previewer_reviewed = true
    signoff.kdp_previewer_reviewed_at = new Date().toISOString()

    const report = assessPublicationReadiness(
      {
        page_count: 24,
        trim_id: 'sq_85',
        language: 'de',
        pinned_anchor: { heroUrl: 'data:image/svg+xml,hero', assetId: 'a1' },
        pinned_anchor_asset_id: 'a1',
        ip_character: { locked_at: new Date().toISOString() },
        pages: makePages(24),
        publication_signoff: signoff,
      },
      { signoff },
    )
    assert.ok(report.score >= 90, `expected >=90 got ${report.score}`)
    assert.equal(report.level, 'ready_for_preview')
    assert.equal(report.gates.print.status, 'pass')
    assert.equal(report.gates.human.status, 'pass')
    assert.equal(report.publishClaimAllowed, false)
  })

  it('blocks banned AI-tell phrases in page copy', () => {
    const pages = makePages(24)
    pages[0].text_content = 'Let us delve into the moon adventure'
    const report = assessPublicationReadiness({
      page_count: 24,
      trim_id: 'sq_85',
      pinned_anchor: { heroUrl: 'x', assetId: 'a' },
      pages,
    })
    assert.ok(report.issues.some((i) => i.gate === 'copy' && /delve/i.test(i.message)))
    assert.ok(bannedPhraseHits('as an AI I think').includes('as an ai'))
  })

  it('warns on bilingual secondary gaps', () => {
    const pages = makePages(24)
    pages[0].text_secondary = 'Luna'
    const report = assessPublicationReadiness({
      page_count: 24,
      trim_id: 'sq_85',
      language: 'de',
      secondary_language: 'en',
      pinned_anchor: { heroUrl: 'x', assetId: 'a' },
      pages,
    })
    assert.ok(report.warnings.some((w) => w.gate === 'copy' && /secondary/i.test(w.message)))
  })

  it('normalizes partial signoff objects', () => {
    const n = normalizePublicationSignoff({
      continuity: { [CONTINUITY_SIGNOFF_ITEMS[0].id]: true },
      kdp_previewer_reviewed: 1,
      notes: 'ok',
    })
    assert.equal(n.continuity[CONTINUITY_SIGNOFF_ITEMS[0].id], true)
    assert.equal(n.continuity[CONTINUITY_SIGNOFF_ITEMS[1].id], false)
    assert.equal(n.kdp_previewer_reviewed, true)
  })
})
