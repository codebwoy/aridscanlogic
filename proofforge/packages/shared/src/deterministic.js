/** Deterministic repetition / stats — no LLM */

export function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function ngramOverlap(a, b, n = 5) {
  const grams = (text) => {
    const words = String(text || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
    const set = new Set()
    for (let i = 0; i <= words.length - n; i++) {
      set.add(words.slice(i, i + n).join(' '))
    }
    return set
  }
  const A = grams(a)
  const B = grams(b)
  if (!A.size || !B.size) return 0
  let inter = 0
  for (const g of A) if (B.has(g)) inter++
  return inter / Math.min(A.size, B.size)
}

export function sentenceLengths(text) {
  const parts = String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.map((s) => s.split(/\s+/).filter(Boolean).length)
}

export function repeatedPhrases(text, { n = 3, minHits = 3 } = {}) {
  const words = String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const counts = new Map()
  for (let i = 0; i <= words.length - n; i++) {
    const gram = words.slice(i, i + n).join(' ')
    counts.set(gram, (counts.get(gram) || 0) + 1)
  }
  return [...counts.entries()]
    .filter(([, c]) => c >= minHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([phrase, count]) => ({ phrase, count }))
}

/**
 * Build suggestion-level findings for heavy repetition (deterministic).
 */
export function repetitionFindings(section) {
  const text = section?.content_md || ''
  const phrases = repeatedPhrases(text, { n: 4, minHits: 4 })
  return phrases.slice(0, 8).map((p) => ({
    category: 'repetition',
    subcategory: 'repeated_phrase',
    severity: p.count >= 8 ? 'moderate' : 'suggestion',
    title: `Repeated phrase (${p.count}×)`,
    explanation: `The phrase “${p.phrase}” appears ${p.count} times in this section. Intentional refrain is fine; otherwise vary wording.`,
    original_excerpt: p.phrase,
    suggested_correction: '',
    reason: 'Deterministic n-gram frequency',
    confidence: 0.9,
    objective: true,
    section_key: section.key,
    chapter: section.title,
  }))
}

export function sectionStats(section) {
  const text = section?.content_md || ''
  const lengths = sentenceLengths(text)
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  return {
    word_count: wordCount(text),
    sentence_count: lengths.length,
    avg_sentence_length: Number(avg.toFixed(1)),
    repeated_phrases: repeatedPhrases(text).slice(0, 5),
  }
}
