/**
 * ProWritingAid Reports catalog — original engines for Summary / Overused /
 * Sticky / Readability / Sentence Structure / Grammar / Dialogue density.
 */

const STOP = new Set(
  `the a an and or but if in on at to for of as is was were be been being it this that these those with from by not no yes he she they we you i my your his her their our me him them us what which who when where how all each every both few more most other some such than too very can will just about into through during before after above below between under again further then once here there when where why how all any both each few more most other some such no nor not only own same so than too very s t can will just don should now`.split(
    /\s+/
  )
)

/** Small built-in thesaurus for overused-word alternatives (PWA Thesaurus Report concept). */
const THESAURUS = Object.freeze({
  look: ['glance', 'gaze', 'peer', 'regard', 'observe'],
  said: ['replied', 'asked', 'murmured', 'answered', 'noted'],
  walked: ['strode', 'paced', 'wandered', 'stepped', 'marched'],
  felt: ['sensed', 'noticed', 'registered', 'experienced'],
  saw: ['noticed', 'spotted', 'glimpsed', 'observed'],
  just: ['simply', 'merely', 'only'],
  really: ['truly', 'genuinely', 'indeed'],
  very: ['deeply', 'highly', 'especially'],
  got: ['received', 'became', 'obtained', 'reached'],
  went: ['moved', 'headed', 'traveled', 'left'],
  nice: ['pleasant', 'kind', 'fine', 'lovely'],
  good: ['solid', 'fine', 'strong', 'sound'],
  bad: ['poor', 'harsh', 'grim', 'rough'],
  big: ['large', 'vast', 'huge', 'great'],
  small: ['slight', 'modest', 'tiny', 'narrow'],
  suddenly: ['abruptly', 'all at once', 'without warning'],
  somehow: ['in some way', 'by some means'],
  seemed: ['appeared', 'looked', 'felt'],
  thought: ['wondered', 'considered', 'realized', 'figured'],
  knew: ['understood', 'realized', 'recognized'],
  started: ['began', 'set out', 'commenced'],
  turned: ['spun', 'faced', 'shifted', 'pivoted'],
})

/**
 * Overused Words Report — frequency of content words (PWA concept).
 * Includes thesaurus-style alternatives for common verbs/adverbs (original mini-lexicon).
 */
export function overusedWordsReport(text, { top = 25, minCount = 4 } = {}) {
  const counts = new Map()
  const words = String(text || '')
    .toLowerCase()
    .replace(/[^a-zäöüßàâéèêëîïôùûüçñ0-9'\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)
  for (const w of words) {
    if (w.length < 3 || STOP.has(w)) continue
    counts.set(w, (counts.get(w) || 0) + 1)
  }
  const ranked = [...counts.entries()]
    .filter(([, c]) => c >= minCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([word, count]) => ({
      word,
      count,
      per_thousand: Number(((count / Math.max(1, words.length)) * 1000).toFixed(1)),
      alternatives: THESAURUS[word] ? [...THESAURUS[word]] : [],
    }))
  return {
    total_words: words.length,
    items: ranked,
    thesaurus_note:
      'Alternatives are a tiny built-in thesaurus for common overused words (PWA Thesaurus Report idea) — not a full synonym dictionary. Character names and motifs often repeat on purpose.',
    note: 'Overused-word frequencies are guides — intentional motifs and character names often repeat (PWA Overused Words concept).',
  }
}

/**
 * Sentence Structure Report — how sentences start (PWA concept).
 */
export function sentenceStructureReport(text) {
  const sents = String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const buckets = {
    subject_pronoun: 0,
    article_noun: 0,
    adverb: 0,
    conjunction: 0,
    gerund_or_ing: 0,
    preposition: 0,
    other: 0,
  }
  const examples = {
    subject_pronoun: [],
    article_noun: [],
    adverb: [],
    conjunction: [],
    gerund_or_ing: [],
    preposition: [],
    other: [],
  }
  const pronouns = /^(i|you|he|she|it|we|they|ich|du|er|sie|es|wir|ihr|je|tu|il|elle|nous|vous|yo|tú|él|ella|nosotros)\b/i
  const articles = /^(the|a|an|der|die|das|ein|eine|le|la|les|un|une|el|la|los|las|il|lo|gli)\b/i
  const adverbs = /^(suddenly|quickly|slowly|then|now|here|there|never|always|plötzlich|dann|alors|luego)\b/i
  const conj = /^(and|but|or|so|yet|because|although|und|aber|oder|mais|et|y|pero)\b/i
  const prep = /^(in|on|at|with|from|by|after|before|under|over|mit|von|bei|dans|avec|en|con)\b/i

  for (const s of sents) {
    const first = s.split(/\s+/)[0] || ''
    let key = 'other'
    if (pronouns.test(first)) key = 'subject_pronoun'
    else if (articles.test(first)) key = 'article_noun'
    else if (adverbs.test(first) || /ly$/i.test(first)) key = 'adverb'
    else if (conj.test(first)) key = 'conjunction'
    else if (/ing$/i.test(first)) key = 'gerund_or_ing'
    else if (prep.test(first)) key = 'preposition'
    buckets[key] += 1
    if (examples[key].length < 3) examples[key].push(s.slice(0, 100))
  }
  const n = Math.max(1, sents.length)
  const percents = Object.fromEntries(
    Object.entries(buckets).map(([k, v]) => [k, Number(((v / n) * 100).toFixed(1))])
  )
  return {
    sentence_count: sents.length,
    percents,
    examples,
    note: 'Sentence-start mix is a craft diagnostic vs genre norms — not a grammar rule (PWA Sentence Structure).',
  }
}

/**
 * Readability paragraph bands (PWA Summary pie-chart concept; English heuristic).
 */
export function readabilityBands(text, language = 'en') {
  const paras = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (language !== 'en') {
    return {
      easy: null,
      slightly_difficult: null,
      very_difficult: null,
      note: 'Paragraph readability bands are English-oriented; skipped for other languages.',
    }
  }
  let easy = 0
  let mid = 0
  let hard = 0
  for (const p of paras) {
    const words = p.split(/\s+/).filter(Boolean)
    const sents = Math.max(1, (p.match(/[.!?]+/g) || []).length)
    const avg = words.length / sents
    if (avg <= 14) easy += 1
    else if (avg <= 22) mid += 1
    else hard += 1
  }
  const t = Math.max(1, paras.length)
  return {
    paragraph_count: paras.length,
    easy_pct: Number(((easy / t) * 100).toFixed(1)),
    slightly_difficult_pct: Number(((mid / t) * 100).toFixed(1)),
    very_difficult_pct: Number(((hard / t) * 100).toFixed(1)),
    note: 'Bands approximate PWA Summary readability pie — guides only.',
  }
}

/**
 * Grammar Report rollup from findings.
 */
export function grammarReportFromFindings(findings = []) {
  const grammar = findings.filter((f) =>
    ['grammar', 'spelling', 'punctuation'].includes(f.category)
  )
  const open = grammar.filter((f) => !f.resolution || f.resolution === 'open')
  const bySub = {}
  for (const f of open) {
    const k = f.subcategory || f.category
    bySub[k] = (bySub[k] || 0) + 1
  }
  const spellingOpen = open.filter((f) => f.category === 'spelling').length
  const spellingScore = Math.max(0, 100 - spellingOpen * 5)
  return {
    spelling_score: spellingScore,
    open_count: open.length,
    by_subcategory: bySub,
    items: open.slice(0, 40).map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      subcategory: f.subcategory,
      excerpt: f.original_excerpt,
      severity: f.severity,
    })),
    note: 'Grammar Report aggregates objective mechanics findings. Author decides each suggestion (Grammarly principle).',
  }
}

/**
 * Summary Report hub — looks great / needs work + attribute navigation.
 */
export function buildSummaryReport({
  categoryScores = {},
  styleReports = {},
  findings = [],
  tone = null,
  genreComparison = null,
} = {}) {
  const attrs = [
    { id: 'pacing', label: 'Pacing & Momentum', score: categoryScores.pacing_and_momentum },
    { id: 'dialogue', label: 'Dialogue', score: categoryScores.dialogue },
    { id: 'strong_writing', label: 'Strong Writing', score: categoryScores.strong_writing },
    { id: 'word_choice', label: 'Word Choice', score: categoryScores.word_choice },
    { id: 'repetition', label: 'Repetition', score: categoryScores.repetition },
  ]
  const looksGreat = attrs.filter((a) => typeof a.score === 'number' && a.score >= 75)
  const needsWork = attrs.filter((a) => typeof a.score === 'number' && a.score < 65)
  const fullText = '' // caller may attach overused from style
  return {
    key_scores: attrs,
    looks_great: looksGreat,
    needs_work: needsWork,
    genre_comparison: genreComparison || categoryScores.genre_comparison || null,
    tone: tone?.overall || null,
    passive_pct: styleReports.passive?.percent_of_sentences ?? null,
    sticky_count: styleReports.sticky?.length ?? 0,
    adverb_types: styleReports.adverbs?.length ?? 0,
    cliche_count: styleReports.cliches?.length ?? 0,
    open_findings: (findings || []).filter((f) => !f.resolution || f.resolution === 'open').length,
    note: 'Summary Report is a navigation map (PWA/AutoCrit). Do not chase 100%.',
    _fullTextHint: fullText,
  }
}

export function reportCatalogPayload() {
  return {
    reports: [
      { id: 'summary', label: 'Summary Report' },
      { id: 'style', label: 'Writing Style' },
      { id: 'grammar', label: 'Grammar' },
      { id: 'overused', label: 'Overused Words' },
      { id: 'sticky', label: 'Sticky Sentences' },
      { id: 'sentence_structure', label: 'Sentence Structure' },
      { id: 'readability', label: 'Readability' },
      { id: 'dialogue', label: 'Dialogue Density' },
      { id: 'pacing', label: 'Pacing' },
    ],
  }
}
