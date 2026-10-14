/**
 * POV / tense consistency heuristics (BookReady fiction craft — soft flags).
 */

const FIRST = /\b(I|me|my|mine|we|us|our)\b/g
const SECOND = /\b(you|your|yours)\b/gi
const THIRD = /\b(he|she|they|him|her|them|his|hers|their)\b/gi

const PAST = /\b\w+(ed|t)\b|\b(was|were|had|did|said|went|came|saw|thought)\b/gi
const PRESENT = /\b(is|are|am|says|goes|comes|sees|thinks|walks|runs)\b/gi

function countMatches(text, re) {
  const m = String(text || '').match(re)
  return m ? m.length : 0
}

/**
 * Flag sections that flip dominant POV or tense vs manuscript majority.
 */
export function narrativeConsistencyFindings(sections = []) {
  if (!Array.isArray(sections) || sections.length < 2) return []
  const stats = sections.map((s) => {
    const t = s.content_md || ''
    const first = countMatches(t, FIRST)
    const second = countMatches(t, SECOND)
    const third = countMatches(t, THIRD)
    const past = countMatches(t, PAST)
    const present = countMatches(t, PRESENT)
    let pov = 'mixed'
    if (first >= second && first >= third && first >= 8) pov = 'first'
    else if (third >= first && third >= second && third >= 8) pov = 'third'
    else if (second >= first && second >= third && second >= 6) pov = 'second'
    let tense = 'mixed'
    if (past > present * 1.4 && past >= 10) tense = 'past'
    else if (present > past * 1.4 && present >= 10) tense = 'present'
    return { key: s.key, title: s.title, pov, tense, first, third, past, present }
  })

  const povCounts = {}
  const tenseCounts = {}
  for (const s of stats) {
    if (s.pov !== 'mixed') povCounts[s.pov] = (povCounts[s.pov] || 0) + 1
    if (s.tense !== 'mixed') tenseCounts[s.tense] = (tenseCounts[s.tense] || 0) + 1
  }
  const dominantPov = Object.entries(povCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const dominantTense = Object.entries(tenseCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const out = []

  if (dominantPov) {
    for (const s of stats) {
      if (s.pov === 'mixed' || s.pov === dominantPov) continue
      out.push({
        category: 'consistency',
        subcategory: 'pov',
        severity: 'moderate',
        title: `Possible POV shift (${s.pov} vs dominant ${dominantPov})`,
        explanation: `Section “${s.title || s.key}” leans ${s.pov}-person while most of the manuscript leans ${dominantPov}. Intentional POV chapters are fine — confirm.`,
        original_excerpt: String(
          sections.find((x) => x.key === s.key)?.content_md || ''
        )
          .slice(0, 80)
          .trim() || s.title || 'section',
        suggested_correction: '',
        reason: 'narrative_pov_consistency',
        confidence: 0.5,
        objective: false,
        section_key: s.key,
        chapter: s.title || '',
      })
      if (out.length >= 4) break
    }
  }

  if (dominantTense && out.length < 8) {
    for (const s of stats) {
      if (s.tense === 'mixed' || s.tense === dominantTense) continue
      out.push({
        category: 'consistency',
        subcategory: 'tense',
        severity: 'suggestion',
        title: `Possible tense shift (${s.tense} vs dominant ${dominantTense})`,
        explanation: `Section “${s.title || s.key}” leans ${s.tense} tense while most of the manuscript leans ${dominantTense}. Soft heuristic — dialogue and flashbacks often differ.`,
        original_excerpt: String(
          sections.find((x) => x.key === s.key)?.content_md || ''
        )
          .slice(0, 80)
          .trim() || s.title || 'section',
        suggested_correction: '',
        reason: 'narrative_tense_consistency',
        confidence: 0.45,
        objective: false,
        section_key: s.key,
        chapter: s.title || '',
      })
      if (out.length >= 8) break
    }
  }

  return out
}
