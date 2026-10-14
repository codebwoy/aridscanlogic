/**
 * Deterministic manuscript reports inspired by ProWritingAid / AutoCrit categories.
 * Original implementation — no proprietary engines.
 */

import { wordCount, sentenceLengths, repeatedPhrases } from './deterministic.js'
import {
  FILLER_WORDS,
  WEAK_ADVERBS,
  GENERIC_DESCRIPTORS,
  DIALOGUE_TAG_VERBS,
  EMOTION_TELLS,
  HIDDEN_VERB_PATTERNS,
  clichesForLanguage,
} from './styleLexicon.js'
import { applyGenreComparison } from './manuscriptAnalysis.js'

function sentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function countWordHits(text, words) {
  const lower = String(text || '').toLowerCase()
  const hits = []
  for (const w of words) {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const m = lower.match(re)
    if (m?.length) hits.push({ word: w, count: m.length })
  }
  return hits.sort((a, b) => b.count - a.count)
}

function dialogueStats(text) {
  const quotes = String(text || '').match(/"[^"]{2,}"|'[^']{2,}'|„[^“]+“|«[^»]+»/g) || []
  const dialogueChars = quotes.reduce((n, q) => n + q.length, 0)
  const total = Math.max(1, String(text || '').length)
  const tagHits = countWordHits(text, DIALOGUE_TAG_VERBS)
  return {
    quote_spans: quotes.length,
    dialogue_char_ratio: Number((dialogueChars / total).toFixed(3)),
    top_tags: tagHits.slice(0, 8),
  }
}

/** Heuristic: paragraphs with many commas / long sentences / no dialogue ≈ slow (AutoCrit pacing idea). */
function pacingReport(text, { firstChapter = false } = {}) {
  const paras = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const slow = []
  // First chapter: stricter — AutoCrit: keep first chapter relatively fast
  const wcMin = firstChapter ? 55 : 80
  const longMin = firstChapter ? 1 : 2
  paras.forEach((p, i) => {
    const wc = wordCount(p)
    const hasDialogue = /["„«']/.test(p)
    const longSents = sentenceLengths(p).filter((n) => n >= 28).length
    if (wc >= wcMin && !hasDialogue && longSents >= longMin) {
      slow.push({
        paragraph_index: i,
        word_count: wc,
        preview: p.slice(0, 140),
        reason: firstChapter
          ? 'First-chapter slow paragraph — AutoCrit recommends sparse backstory in chapter 1'
          : 'Long narrative paragraph with little/no dialogue (possible slow pacing)',
        first_chapter: firstChapter,
      })
    }
  })
  return {
    slow_paragraphs: slow.slice(0, 20),
    slow_count: slow.length,
    first_chapter_strict: firstChapter,
    note: firstChapter
      ? 'First chapter pacing is stricter (AutoCrit: save slow sections for later). Heuristic only.'
      : 'Pacing flags are heuristics — intentional reflection is valid (AutoCrit principle).',
  }
}

function emotionTellHits(text) {
  const lower = String(text || '').toLowerCase()
  const hits = []
  for (const phrase of EMOTION_TELLS) {
    if (lower.includes(phrase)) {
      const idx = lower.indexOf(phrase)
      const excerpt = String(text).slice(Math.max(0, idx), idx + phrase.length + 40)
      hits.push({ phrase, excerpt: excerpt.slice(0, 120) })
    }
  }
  return hits.slice(0, 12)
}

function hiddenVerbHits(text) {
  const hits = []
  const raw = String(text || '')
  for (const pat of HIDDEN_VERB_PATTERNS) {
    pat.re.lastIndex = 0
    let m
    while ((m = pat.re.exec(raw)) !== null && hits.length < 15) {
      hits.push({ match: m[0], label: pat.label })
    }
  }
  return hits
}

function stickySentences(text) {
  // "Sticky" ≈ high glue-word density (simplified original heuristic)
  const glue = ['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'with', 'and', 'that', 'as']
  const sticky = []
  for (const s of sentences(text)) {
    const words = s.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length < 8) continue
    const glueCount = words.filter((w) => glue.includes(w.replace(/[^a-z]/g, ''))).length
    const ratio = glueCount / words.length
    if (ratio >= 0.45) {
      sticky.push({ sentence: s.slice(0, 200), glue_ratio: Number(ratio.toFixed(2)) })
    }
  }
  return sticky.slice(0, 15)
}

function repeatedSentenceStarts(text) {
  const starts = {}
  for (const s of sentences(text)) {
    const first = s.split(/\s+/)[0]?.toLowerCase().replace(/[^a-zäöüßàâéèêëîïôùûüçñ]/gi, '')
    if (!first || first.length < 2) continue
    starts[first] = (starts[first] || 0) + 1
  }
  return Object.entries(starts)
    .filter(([, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
}

/** Paragraph length extremes (BookReady / PWA readability adjacent). */
function paragraphLengthReport(text) {
  const paras = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const lengths = paras.map((p) => wordCount(p))
  const veryLong = []
  const veryShort = []
  paras.forEach((p, i) => {
    const wc = lengths[i]
    if (wc >= 180) {
      veryLong.push({ paragraph_index: i, word_count: wc, preview: p.slice(0, 140) })
    } else if (wc <= 3 && !/^#{1,6}\s/.test(p) && !/^\*\*.+\*\*$/.test(p)) {
      veryShort.push({ paragraph_index: i, word_count: wc, preview: p.slice(0, 80) })
    }
  })
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  return {
    paragraph_count: paras.length,
    average_words: Number(avg.toFixed(1)),
    very_long: veryLong.slice(0, 12),
    very_short: veryShort.slice(0, 12),
    note: 'Very long paragraphs can fatigue readers; stacks of tiny paragraphs can feel abrupt (heuristic).',
  }
}

const TRANSITION_PHRASES = Object.freeze([
  'however',
  'therefore',
  'meanwhile',
  'suddenly',
  'then',
  'next',
  'after that',
  'in addition',
  'furthermore',
  'on the other hand',
  'as a result',
  'in conclusion',
  'needless to say',
  'at that moment',
  'before long',
])

/** Overused / abrupt transitions (BookReady natural-writing engine). */
function transitionReport(text) {
  const lower = String(text || '').toLowerCase()
  const hits = []
  for (const phrase of TRANSITION_PHRASES) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const m = lower.match(re)
    if (m?.length >= 3) hits.push({ phrase, count: m.length })
  }
  hits.sort((a, b) => b.count - a.count)

  // Abrupt: short sentence then hard jump ("Then." / "Suddenly." alone-ish)
  const abrupt = []
  for (const s of sentences(text)) {
    if (/^(then|suddenly|meanwhile|however)[.!]?$/i.test(s.trim())) {
      abrupt.push({ sentence: s.slice(0, 80) })
    }
  }
  return {
    overused: hits.slice(0, 10),
    abrupt: abrupt.slice(0, 8),
    note: 'Transition flags are style guides — intentional rhythm is valid.',
  }
}

function passiveApprox(text) {
  // English-oriented heuristic: was/were/been + past participle-ish
  const re = /\b(?:was|were|been|being|is|are|am)\s+\w+ed\b/gi
  const hits = String(text || '').match(re) || []
  const sents = Math.max(1, sentences(text).length)
  const pct = Number(((hits.length / sents) * 100).toFixed(1))
  return { hits: hits.length, percent_of_sentences: pct, guide: 'Style guides often aim under ~25% (PWA Style Report note).' }
}

function readabilityEn(text) {
  // Flesch-ish (English only) — never claim validity for DE/FR/ES/IT/NL
  const words = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sents = Math.max(1, sentences(text).length)
  const syllables = words.reduce((n, w) => n + Math.max(1, w.replace(/[^aeiouy]/gi, '').length || 1), 0)
  const W = Math.max(1, words.length)
  const flesch = 206.835 - 1.015 * (W / sents) - 84.6 * (syllables / W)
  return {
    metric: 'flesch_reading_ease_approx',
    score: Number(flesch.toFixed(1)),
    words: W,
    sentences: sents,
    limitation: 'English-oriented approximation only. Do not use as quality for German/French/Spanish/Italian/Dutch.',
  }
}

/**
 * Build AutoCrit-style category scores 0–100 (guides, not literary judgment).
 */
export function categoryScoresFromReports(reports, findings = []) {
  const open = findings.filter((f) => !f.resolution || f.resolution === 'open')
  const byCat = (c) => open.filter((f) => f.category === c).length
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

  const pacingPenalty = Math.min(40, (reports.pacing?.slow_count || 0) * 4)
  const dialogueRatio = reports.dialogue?.dialogue_char_ratio || 0
  const dialogueScore = clamp(70 + (dialogueRatio - 0.15) * 100 - byCat('style') * 2)
  const strongWriting = clamp(
    100 - (reports.sticky?.length || 0) * 3 - (reports.adverbs?.length || 0) * 2 - byCat('naturalness') * 3
  )
  const wordChoice = clamp(
    100 - (reports.filler?.length || 0) * 2 - (reports.cliches?.length || 0) * 5 - (reports.generic?.length || 0) * 2
  )
  const repetition = clamp(100 - (reports.repeated_phrases?.length || 0) * 4 - byCat('repetition') * 5)

  return {
    pacing_and_momentum: clamp(100 - pacingPenalty),
    dialogue: dialogueScore,
    strong_writing: strongWriting,
    word_choice: wordChoice,
    repetition,
    note: 'Category scores are estimated guides (AutoCrit principle) — not proof of quality or KDP readiness.',
  }
}

/**
 * Full style/report bundle for one section or whole manuscript text.
 */
export function buildStyleReports(
  text,
  { language = 'en', sectionKey = '', chapter = '', firstChapter = false } = {}
) {
  const lengths = sentenceLengths(text)
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  const variance =
    lengths.length > 1
      ? lengths.reduce((s, n) => s + (n - avg) ** 2, 0) / lengths.length
      : 0

  const adverbs = countWordHits(text, WEAK_ADVERBS).filter((h) => h.count >= 2)
  const filler = countWordHits(text, FILLER_WORDS).filter((h) => h.count >= 3)
  const generic = countWordHits(text, GENERIC_DESCRIPTORS).filter((h) => h.count >= 3)
  const clicheList = clichesForLanguage(language)
  const cliches = []
  const lower = String(text || '').toLowerCase()
  for (const c of clicheList) {
    if (lower.includes(c)) cliches.push({ phrase: c })
  }
  const emotion_tells = emotionTellHits(text)
  const hidden_verbs = hiddenVerbHits(text)

  const reports = {
    readability: language === 'en' ? readabilityEn(text) : {
      metric: 'unavailable_for_language',
      score: null,
      limitation: `No English Flesch formula applied for language=${language}. Use human judgment + LLM naturalness pass.`,
    },
    sentence_length: {
      counts: lengths.slice(0, 200),
      average: Number(avg.toFixed(1)),
      variance: Number(variance.toFixed(1)),
      note: 'Vary sentence length for rhythm (PWA Sentence Length report concept).',
    },
    dialogue: dialogueStats(text),
    pacing: pacingReport(text, { firstChapter }),
    sticky: stickySentences(text),
    repeated_sentence_starts: repeatedSentenceStarts(text),
    repeated_phrases: repeatedPhrases(text, { n: 3, minHits: 3 }).slice(0, 15),
    adverbs,
    filler,
    generic,
    cliches,
    emotion_tells,
    hidden_verbs,
    paragraph_length: paragraphLengthReport(text),
    transitions: transitionReport(text),
    passive: language === 'en' ? passiveApprox(text) : { hits: 0, percent_of_sentences: null, guide: 'Passive heuristic is English-oriented.' },
    word_count: wordCount(text),
  }

  const findings = styleFindingsFromReports(reports, { sectionKey, chapter, language, firstChapter })
  return { reports, findings }
}

function styleFindingsFromReports(reports, ctx) {
  const out = []
  for (const c of reports.cliches || []) {
    out.push({
      category: 'style',
      subcategory: 'cliche',
      severity: 'suggestion',
      title: 'Possible cliché',
      explanation: `“${c.phrase}” is a common cliché. Fresh wording may strengthen the line — keep if intentional.`,
      original_excerpt: c.phrase,
      suggested_correction: '',
      reason: 'deterministic_cliche_lexicon',
      confidence: 0.7,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const a of (reports.adverbs || []).slice(0, 6)) {
    out.push({
      category: 'style',
      subcategory: 'adverb',
      severity: 'suggestion',
      title: `Frequent adverb: ${a.word} (${a.count}×)`,
      explanation: 'Weak adverbs can dilute verbs (PWA Style / AutoCrit Strong Writing). Prefer stronger verbs when natural.',
      original_excerpt: a.word,
      suggested_correction: '',
      reason: 'deterministic_adverb_count',
      confidence: 0.6,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const s of (reports.repeated_sentence_starts || []).slice(0, 4)) {
    out.push({
      category: 'style',
      subcategory: 'repeated_sentence_start',
      severity: 'suggestion',
      title: `Repeated sentence start: “${s.word}” (${s.count}×)`,
      explanation: 'Many sentences begin the same way (PWA Style Report). Vary openings when it helps rhythm.',
      original_excerpt: s.word,
      suggested_correction: '',
      reason: 'deterministic_sentence_starts',
      confidence: 0.65,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const p of (reports.pacing?.slow_paragraphs || []).slice(0, 5)) {
    out.push({
      category: 'structure',
      subcategory: 'pacing',
      severity: p.first_chapter ? 'moderate' : 'suggestion',
      title: p.first_chapter ? 'First-chapter pacing drag' : 'Possibly slow-paced paragraph',
      explanation: p.reason,
      original_excerpt: p.preview.slice(0, 120),
      suggested_correction: '',
      reason: 'deterministic_pacing_heuristic',
      confidence: p.first_chapter ? 0.6 : 0.5,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const e of (reports.emotion_tells || []).slice(0, 6)) {
    out.push({
      category: 'style',
      subcategory: 'emotion_tell',
      severity: 'suggestion',
      title: 'Possible emotion tell',
      explanation:
        'PWA Style Report concept: “telling” a feeling — consider showing with concrete sensory detail (keep if intentional).',
      original_excerpt: e.excerpt || e.phrase,
      suggested_correction: '',
      reason: 'deterministic_emotion_tell',
      confidence: 0.55,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const h of (reports.hidden_verbs || []).slice(0, 6)) {
    out.push({
      category: 'style',
      subcategory: 'hidden_verb',
      severity: 'suggestion',
      title: `Hidden verb (${h.label})`,
      explanation:
        'PWA Style Report: weak verb + noun may hide a stronger verb (e.g. “make a decision” → “decide”).',
      original_excerpt: h.match,
      suggested_correction: '',
      reason: 'deterministic_hidden_verb',
      confidence: 0.6,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const p of (reports.paragraph_length?.very_long || []).slice(0, 4)) {
    out.push({
      category: 'style',
      subcategory: 'paragraph_length',
      severity: 'suggestion',
      title: `Very long paragraph (~${p.word_count} words)`,
      explanation:
        'Long unbroken paragraphs can tire readers. Consider a break if pacing allows (heuristic — keep intentional blocks).',
      original_excerpt: p.preview.slice(0, 120),
      suggested_correction: '',
      reason: 'deterministic_paragraph_length',
      confidence: 0.5,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const t of (reports.transitions?.overused || []).slice(0, 5)) {
    out.push({
      category: 'style',
      subcategory: 'transition',
      severity: 'suggestion',
      title: `Overused transition: “${t.phrase}” (${t.count}×)`,
      explanation:
        'BookReady / natural-writing: repeated transition phrases can feel formulaic. Vary or cut when clear without them.',
      original_excerpt: t.phrase,
      suggested_correction: '',
      reason: 'deterministic_overused_transition',
      confidence: 0.55,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const a of (reports.transitions?.abrupt || []).slice(0, 3)) {
    out.push({
      category: 'style',
      subcategory: 'transition',
      severity: 'suggestion',
      title: 'Abrupt one-word transition',
      explanation: 'A lone transition sentence may feel abrupt — expand or cut if unintended.',
      original_excerpt: a.sentence,
      suggested_correction: '',
      reason: 'deterministic_abrupt_transition',
      confidence: 0.5,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  for (const s of (reports.sticky || []).slice(0, 5)) {
    out.push({
      category: 'style',
      subcategory: 'sticky',
      severity: 'suggestion',
      title: 'Sticky sentence (high glue-word density)',
      explanation:
        'PWA Sticky Sentences: many glue words (the/a/of/to…) can make prose drag. Tighten if unintentional.',
      original_excerpt: s.sentence.slice(0, 120),
      suggested_correction: '',
      reason: 'deterministic_sticky',
      confidence: 0.5,
      objective: false,
      section_key: ctx.sectionKey,
      chapter: ctx.chapter,
    })
  }
  return out
}

/**
 * Aggregate manuscript-level reports from all sections.
 */
export function aggregateManuscriptReports(
  sectionReportsMap,
  findings,
  language,
  { genreComparison = 'general_fiction' } = {}
) {
  const allText = Object.values(sectionReportsMap)
    .map((r) => r._text || '')
    .join('\n\n')
  const whole = buildStyleReports(allText, { language })
  let category_scores = categoryScoresFromReports(whole.reports, findings)
  category_scores = applyGenreComparison(category_scores, genreComparison)
  return {
    manuscript: whole.reports,
    category_scores,
    per_section: Object.fromEntries(
      Object.entries(sectionReportsMap).map(([k, v]) => [k, v.reports])
    ),
  }
}
