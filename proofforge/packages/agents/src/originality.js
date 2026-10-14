import { ngramOverlap } from '@proofforge/shared'

/**
 * Internal originality / duplication scan.
 * External plagiarism vendors require informed consent + licensed API — never auto-upload.
 */
export function createOriginalityProvider() {
  return {
    id: 'internal',
    async scan(text, { otherTexts = [], threshold = 0.22 } = {}) {
      const flagged = []
      const words = String(text || '').split(/\s+/).filter(Boolean)
      const window = 12
      for (let i = 0; i + window <= words.length; i += 6) {
        const span = words.slice(i, i + window).join(' ')
        for (const other of otherTexts) {
          const score = ngramOverlap(span, other, 5)
          if (score >= threshold) {
            flagged.push({
              span,
              score: Number(score.toFixed(3)),
              against: 'other_section',
            })
            break
          }
        }
      }
      const grams = new Map()
      const w = words.map((x) => x.toLowerCase())
      for (let i = 0; i + 6 <= w.length; i++) {
        const g = w.slice(i, i + 6).join(' ')
        grams.set(g, (grams.get(g) || 0) + 1)
      }
      for (const [g, count] of grams) {
        if (count >= 3) flagged.push({ span: g, score: 1, against: 'self_repetition', count })
      }
      return {
        provider: 'internal',
        flagged: flagged.slice(0, 30),
        passed: flagged.length === 0,
        note: 'Internal n-gram scan only. External plagiarism APIs require author consent and a licensed provider.',
        external_upload: false,
      }
    },
  }
}

export function originalityFindings(scan, section) {
  return (scan.flagged || []).slice(0, 10).map((f) => ({
    category: 'consistency',
    subcategory: f.against === 'self_repetition' ? 'self_repetition' : 'cross_section_overlap',
    severity: f.against === 'self_repetition' ? 'suggestion' : 'moderate',
    title:
      f.against === 'self_repetition' ? 'Self-repetition span' : 'Overlap with another section',
    explanation:
      f.against === 'self_repetition'
        ? `Phrase repeats ${f.count || 'multiple'}× in this section.`
        : `High n-gram overlap (score ${f.score}) with another section — review for accidental duplication.`,
    original_excerpt: f.span,
    suggested_correction: '',
    reason: 'originality_internal',
    confidence: Math.min(0.95, 0.5 + (f.score || 0.3)),
    objective: true,
    section_key: section.key,
    chapter: section.title,
  }))
}
