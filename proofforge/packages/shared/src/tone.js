/**
 * Lightweight tone detector (Grammarly-inspired concept — original heuristics).
 * Overall tone label for a passage; not per-sentence rewrites.
 */

const POSITIVE = [
  'hope',
  'love',
  'joy',
  'glad',
  'warm',
  'grateful',
  'proud',
  'brave',
  'kind',
  'thank',
  'delight',
  'peace',
]
const NEGATIVE = [
  'hate',
  'anger',
  'fear',
  'dread',
  'cruel',
  'bitter',
  'rage',
  'despair',
  'grief',
  'panic',
  'hurt',
  'lonely',
]
const CONFIDENT = ['will', 'must', 'know', 'certain', 'clearly', 'definitely', 'sure']
const TENTATIVE = ['maybe', 'perhaps', 'might', 'could', 'seem', 'possibly', 'somewhat', 'probably']

function hitCount(text, words) {
  const lower = String(text || '').toLowerCase()
  let n = 0
  for (const w of words) {
    const re = new RegExp(`\\b${w}\\b`, 'gi')
    const m = lower.match(re)
    if (m) n += m.length
  }
  return n
}

export function detectTone(text) {
  const sample = String(text || '').slice(0, 20_000)
  const pos = hitCount(sample, POSITIVE)
  const neg = hitCount(sample, NEGATIVE)
  const conf = hitCount(sample, CONFIDENT)
  const tent = hitCount(sample, TENTATIVE)
  const words = sample.split(/\s+/).filter(Boolean).length || 1

  const valence =
    pos === neg ? 'neutral' : pos > neg + 1 ? 'warmer / more positive' : 'heavier / more negative'
  const assertiveness =
    conf === tent ? 'balanced' : conf > tent ? 'more confident' : 'more tentative / hedging'

  const labels = [valence]
  if (assertiveness !== 'balanced') labels.push(assertiveness)
  if (neg >= 4 && neg > pos) labels.push('emotionally charged')

  return {
    overall: labels.join('; '),
    valence,
    assertiveness,
    signals: {
      positive_hits: pos,
      negative_hits: neg,
      confident_hits: conf,
      tentative_hits: tent,
      words_sampled: Math.min(words, 20_000),
    },
    note:
      'Tone detector is a heuristic overview (Grammarly-style concept). Sentence-level tone rewrites are optional via findings — author decides.',
  }
}

/**
 * Cross-section tone consistency (BookReady style: tone consistency report).
 * Soft flag when chapter valence swings hard without intentional framing.
 */
export function toneConsistencyFindings(sections = []) {
  if (!Array.isArray(sections) || sections.length < 3) return []
  const tones = sections.map((s) => ({
    key: s.key,
    title: s.title,
    tone: detectTone(s.content_md || ''),
  }))
  const valences = tones.map((t) => t.tone.valence)
  const warm = valences.filter((v) => /warmer|positive/i.test(v)).length
  const heavy = valences.filter((v) => /heavier|negative/i.test(v)).length
  if (warm < 1 || heavy < 1) return []
  // Swing: majority warm then one heavy chapter (or reverse) — soft note only
  const outlier = tones.find((t) => {
    if (warm > heavy) return /heavier|negative/i.test(t.tone.valence)
    if (heavy > warm) return /warmer|positive/i.test(t.tone.valence)
    return false
  })
  if (!outlier) return []
  return [
    {
      category: 'style',
      subcategory: 'tone_consistency',
      severity: 'suggestion',
      title: `Tone swing in “${outlier.title || outlier.key}”`,
      explanation: `Most sections read ${warm >= heavy ? 'warmer' : 'heavier'}; this section reads ${outlier.tone.valence}. Intentional contrast is fine — confirm it matches your plan.`,
      original_excerpt: String(sections.find((s) => s.key === outlier.key)?.content_md || '')
        .slice(0, 80)
        .trim() || outlier.title || 'section',
      suggested_correction: '',
      reason: 'tone_consistency_heuristic',
      confidence: 0.4,
      objective: false,
      section_key: outlier.key || '',
      chapter: outlier.title || 'Tone',
    },
  ]
}
