/**
 * Formality / register heuristics (BookReady multilingual engine + Grammarly formality idea).
 * Soft flags only — author voice wins.
 */

const INFORMAL_EN = [
  "gonna",
  "wanna",
  "gotta",
  "kinda",
  "sorta",
  "ain't",
  "yeah",
  "yep",
  "nope",
  "okey",
  "lol",
  "btw",
]

const FORMAL_MARKERS_EN = [
  'therefore',
  'furthermore',
  'consequently',
  'nevertheless',
  'herein',
  'aforementioned',
]

/**
 * @param {string} text
 * @param {{ formality?: string, language?: string, sectionKey?: string, chapter?: string }} opts
 * formality: 'casual' | 'neutral' | 'formal' | ''
 */
export function formalityFindingsFromText(text, opts = {}) {
  const formality = String(opts.formality || 'neutral').toLowerCase()
  const language = opts.language || 'en'
  const out = []
  const body = String(text || '')
  if (body.length < 80) return out
  const lower = body.toLowerCase()

  if (language === 'en' || !language) {
    const informalHits = INFORMAL_EN.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))
    const formalHits = FORMAL_MARKERS_EN.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))

    if (formality === 'formal' && informalHits.length) {
      out.push({
        category: 'style',
        subcategory: 'formality',
        severity: 'suggestion',
        title: `Informal wording vs formal target (${informalHits.slice(0, 3).join(', ')})`,
        explanation:
          'Project formality is formal, but informal contractions/slang appear. Soften only if unintentional (dialogue may keep voice).',
        original_excerpt: informalHits[0],
        suggested_correction: '',
        reason: 'formality_mismatch_informal',
        confidence: 0.55,
        objective: false,
        section_key: opts.sectionKey || '',
        chapter: opts.chapter || '',
      })
    }
    if (formality === 'casual' && formalHits.length >= 2) {
      out.push({
        category: 'style',
        subcategory: 'formality',
        severity: 'suggestion',
        title: 'Formal markers vs casual target',
        explanation:
          'Project formality is casual, but several formal connectives appear. May feel stiff for the intended register.',
        original_excerpt: formalHits[0],
        suggested_correction: '',
        reason: 'formality_mismatch_formal',
        confidence: 0.5,
        objective: false,
        section_key: opts.sectionKey || '',
        chapter: opts.chapter || '',
      })
    }
  }

  if (language === 'de') {
    const hasDu = /\b(du|dich|dir|dein|deine)\b/i.test(body)
    const hasSie = /\b(Sie|Ihnen|Ihr)\b/.test(body)
    if (formality === 'formal' && hasDu && !hasSie) {
      out.push({
        category: 'localization',
        subcategory: 'formality',
        severity: 'moderate',
        title: 'du-Anrede vs formal target',
        explanation:
          'Formalität ist formal, aber du-Formen dominieren. Prüfen Sie, ob Sie/Ihr für die Zielgruppe passt (Register).',
        original_excerpt: (body.match(/\bdu\b/i) || ['du'])[0],
        suggested_correction: '',
        reason: 'formality_de_du_vs_formal',
        confidence: 0.6,
        objective: false,
        section_key: opts.sectionKey || '',
        chapter: opts.chapter || '',
      })
    }
    if (formality === 'casual' && hasSie && !hasDu) {
      out.push({
        category: 'localization',
        subcategory: 'formality',
        severity: 'suggestion',
        title: 'Sie-Anrede vs casual target',
        explanation:
          'Formalität ist casual, aber Sie-Formen erscheinen. Dialog kann bewusst höflich bleiben.',
        original_excerpt: 'Sie',
        suggested_correction: '',
        reason: 'formality_de_sie_vs_casual',
        confidence: 0.55,
        objective: false,
        section_key: opts.sectionKey || '',
        chapter: opts.chapter || '',
      })
    }
  }

  return out.slice(0, 4)
}

/**
 * Check character list / glossary terms for presence and spelling drift.
 */
export function referenceDocFindings(text, { characterList = [], glossary = [], sectionKey = '', chapter = '' } = {}) {
  const out = []
  const body = String(text || '')
  if (!body) return out

  for (const name of (characterList || []).slice(0, 40)) {
    const n = String(name || '').trim()
    if (n.length < 2) continue
    if (!body.includes(n)) {
      // Only flag absence at manuscript level — caller should pass full text for that
      continue
    }
    // Variant casing: e.g. "Maria" vs "maria" mid-sentence is fine; flag "MARIA" all-caps spam
    const caps = body.match(new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []
    const allCaps = body.match(
      new RegExp(`\\b${n.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    )
    if (allCaps && allCaps.length >= 2 && n !== n.toUpperCase()) {
      out.push({
        category: 'consistency',
        subcategory: 'character_list',
        severity: 'suggestion',
        title: `Character name all-caps: ${n}`,
        explanation: 'Name appears in ALL CAPS more than once — confirm intentional emphasis vs typo.',
        original_excerpt: allCaps[0],
        suggested_correction: n,
        reason: 'character_list_all_caps',
        confidence: 0.45,
        objective: false,
        section_key: sectionKey,
        chapter,
      })
    }
    void caps
  }

  for (const term of (glossary || []).slice(0, 40)) {
    const entry = typeof term === 'string' ? { term, preferred: term } : term
    const preferred = String(entry.preferred || entry.term || '').trim()
    const aliases = (entry.aliases || []).map(String)
    if (!preferred) continue
    for (const bad of aliases) {
      if (!bad || bad.toLowerCase() === preferred.toLowerCase()) continue
      if (body.includes(bad) && !body.includes(preferred)) {
        out.push({
          category: 'consistency',
          subcategory: 'glossary',
          severity: 'moderate',
          title: `Glossary: prefer “${preferred}” over “${bad}”`,
          explanation: 'Author glossary lists a preferred term; alias appears without the preferred form nearby.',
          original_excerpt: bad,
          suggested_correction: preferred,
          reason: 'glossary_preferred_term',
          confidence: 0.7,
          objective: false,
          section_key: sectionKey,
          chapter,
        })
      }
    }
  }

  return out.slice(0, 12)
}

/**
 * Manuscript-level: characters listed but never appearing in text.
 */
export function missingCharacterFindings(fullText, characterList = []) {
  const body = String(fullText || '')
  const out = []
  for (const name of (characterList || []).slice(0, 30)) {
    const n = String(name || '').trim()
    if (n.length < 2) continue
    if (!body.includes(n)) {
      out.push({
        category: 'consistency',
        subcategory: 'character_list',
        severity: 'suggestion',
        title: `Character list unused: ${n}`,
        explanation:
          'Name is on the project character list but was not found in the manuscript text. Confirm spelling or remove from list.',
        original_excerpt: n,
        suggested_correction: '',
        reason: 'character_list_missing_in_ms',
        confidence: 0.65,
        objective: false,
        section_key: '',
        chapter: 'Character list',
      })
    }
  }
  return out.slice(0, 10)
}
