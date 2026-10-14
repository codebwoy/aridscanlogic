import { createOriginalityProvider } from './originality.js'
import { ngramOverlap } from './quality.js'

/**
 * Book-wide “Finish” repetition scan (CoAuthor-style).
 * Flags light self-duplication vs sections that need a real rewrite.
 */

export async function finishRepetitionScan(book = {}, { provider } = {}) {
  const sections = Object.entries(book.sections || {}).map(([key, s]) => ({
    key,
    title: s.title || key,
    content_md: s.content_md || '',
    word_count: s.word_count || String(s.content_md || '').split(/\s+/).filter(Boolean).length,
  }))

  if (!sections.length) {
    return {
      passed: true,
      sections: [],
      pairs: [],
      light_fixes: [],
      rewrite_flags: [],
      note: 'No written sections yet — draft content before running Finish scan.',
    }
  }

  const orig = provider || createOriginalityProvider()
  const perSection = []
  for (const sec of sections) {
    const others = sections.filter((o) => o.key !== sec.key).map((o) => o.content_md)
    const report = await orig.scan(sec.content_md, { otherTexts: others, threshold: 0.2 })
    const selfFlags = (report.flagged || []).filter((f) => f.against === 'self_repetition')
    const crossFlags = (report.flagged || []).filter((f) => f.against === 'other_section')
    let severity = 'ok'
    if (crossFlags.length >= 4 || selfFlags.length >= 6) severity = 'rewrite'
    else if (crossFlags.length >= 1 || selfFlags.length >= 2) severity = 'light'
    perSection.push({
      key: sec.key,
      title: sec.title,
      word_count: sec.word_count,
      severity,
      self_hits: selfFlags.length,
      cross_hits: crossFlags.length,
      sample_spans: (report.flagged || []).slice(0, 4).map((f) => f.span),
      action:
        severity === 'rewrite'
          ? 'Regenerate this section from Write (real rewrite needed).'
          : severity === 'light'
            ? 'Light duplication — trim repeated phrases in the editor.'
            : 'OK',
    })
  }

  // Pairwise chapter overlap for explicit “where repetition occurs”
  const pairs = []
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const score = ngramOverlap(sections[i].content_md, sections[j].content_md, 5)
      if (score >= 0.18) {
        pairs.push({
          a: sections[i].key,
          a_title: sections[i].title,
          b: sections[j].key,
          b_title: sections[j].title,
          score: Number(score.toFixed(3)),
        })
      }
    }
  }
  pairs.sort((x, y) => y.score - x.score)

  const light_fixes = perSection.filter((s) => s.severity === 'light')
  const rewrite_flags = perSection.filter((s) => s.severity === 'rewrite')

  return {
    passed: rewrite_flags.length === 0 && pairs.length === 0,
    sections: perSection,
    pairs: pairs.slice(0, 20),
    light_fixes,
    rewrite_flags,
    note: 'Internal n-gram Finish scan — not a plagiarism API. Light = trim; rewrite = regenerate from Write.',
  }
}
