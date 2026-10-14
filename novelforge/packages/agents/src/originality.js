import { ngramOverlap } from './quality.js'

export class OriginalityProvider {
  get id() {
    return 'base'
  }

  async scan(_text, _opts) {
    throw new Error('not implemented')
  }
}

/** Internal n-gram + cross-section overlap — external APIs pluggable later */
export class InternalOriginalityProvider extends OriginalityProvider {
  get id() {
    return 'internal'
  }

  async scan(text, { otherTexts = [], threshold = 0.22 } = {}) {
    const flagged = []
    const words = String(text || '').split(/\s+/)
    const window = 12
    for (let i = 0; i + window <= words.length; i += 6) {
      const span = words.slice(i, i + window).join(' ')
      for (const other of otherTexts) {
        const score = ngramOverlap(span, other, 5)
        if (score >= threshold) {
          flagged.push({
            span,
            start_word: i,
            score: Number(score.toFixed(3)),
            against: 'other_section',
          })
          break
        }
      }
    }
    // Self-repetition: repeated 6-grams inside the section
    const grams = new Map()
    const w = words.map((x) => x.toLowerCase())
    for (let i = 0; i + 6 <= w.length; i++) {
      const g = w.slice(i, i + 6).join(' ')
      grams.set(g, (grams.get(g) || 0) + 1)
    }
    for (const [g, count] of grams) {
      if (count >= 3) {
        flagged.push({ span: g, score: 1, against: 'self_repetition', count })
      }
    }
    return {
      provider: this.id,
      flagged,
      passed: flagged.length === 0,
      note: 'Internal originality scan. Connect Copyleaks/Originality.ai via NOVELFORGE_ORIGINALITY_PROVIDER when licensed.',
    }
  }
}

export function rewriteFlaggedSpan(text, span, replacement) {
  const t = String(text || '')
  const s = String(span || '')
  if (!s) return t
  return t.replace(s, replacement || '[revised — rephrase in your own words]')
}

export function createOriginalityProvider() {
  return new InternalOriginalityProvider()
}
