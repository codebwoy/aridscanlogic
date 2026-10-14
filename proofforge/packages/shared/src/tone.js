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
