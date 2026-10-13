/**
 * Picture-book manuscript generator — age-appropriate lines from emotional arc.
 * Local / deterministic (0 credits). Not affiliated with third-party studios.
 * Authors should edit before KDP; bilingual secondary is a parallel scaffold.
 */

import { buildEscalatingBeatBriefs, defaultRefrainForHook } from './picture-book.js'

export const MANUSCRIPT_META = {
  id: 'manuscript_generator',
  title: 'Manuscript generator',
  sourceIds: ['S64'],
  note:
    'Builds short picture-book lines from your emotional core + character. Edit every page before KDP — AI/local drafts are scaffolding, not final copy.',
}

/** Primary-language line templates by phase (English base, then localized lightly). */
const PHASE_LINES_EN = {
  meet: [
    '{name} woke up ready for a new day.',
    'This is {name}. Today feels special.',
    '{name} held {object} close and smiled.',
  ],
  bond: [
    'Someone kind was nearby. {name} felt safer.',
    '{name} shared the moment with a friend.',
    'Together felt better than alone.',
  ],
  escalate: [
    '{name} tried something bigger.',
    '“{refrain},” whispered {name}.',
    '{name} kept going, even when it was hard.',
  ],
  peak: [
    '{name} reached the biggest moment yet!',
    'Everything felt huge — and {name} was brave.',
    '{name} held {object} and did not give up.',
  ],
  resolve: [
    'A warm answer came back. {name} belonged.',
    '{name} felt the kindness grow.',
    '“{refrain},” said someone who cared.',
  ],
  close: [
    '{name} rested, safe and proud.',
    'Goodnight, {name}. You are enough.',
    '{name} and {object} slept under soft stars.',
  ],
}

const PHASE_LINES_DE = {
  meet: [
    '{name} wachte bereit für einen neuen Tag auf.',
    'Das ist {name}. Heute fühlt sich besonders an.',
    '{name} hielt {object} fest und lächelte.',
  ],
  bond: [
    'Jemand Liebes war nah. {name} fühlte sich sicherer.',
    '{name} teilte den Moment mit einem Freund.',
    'Zusammen fühlte sich besser an als allein.',
  ],
  escalate: [
    '{name} versuchte etwas Größeres.',
    '„{refrain},“ flüsterte {name}.',
    '{name} machte weiter, auch wenn es schwer war.',
  ],
  peak: [
    '{name} erreichte den größten Moment!',
    'Alles fühlte sich riesig an — und {name} war mutig.',
    '{name} hielt {object} und gab nicht auf.',
  ],
  resolve: [
    'Eine warme Antwort kam zurück. {name} gehörte dazu.',
    '{name} spürte, wie die Güte wuchs.',
    '„{refrain},“ sagte jemand, dem {name} wichtig war.',
  ],
  close: [
    '{name} ruhte sich aus, sicher und stolz.',
    'Gute Nacht, {name}. Du bist genug.',
    '{name} und {object} schliefen unter sanften Sternen.',
  ],
}

/** Lightweight secondary scaffolds (not certified translations). */
const SECONDARY_HINT = {
  tw: '({name} · {core})',
  ig: '({name} · {core})',
  sw: '({name} · {core})',
  ee: '({name} · {core})',
  zu: '({name} · {core})',
  ar: '({name} · {core})',
  fr: '{name} — {core}.',
  es: '{name} — {core}.',
  en: '{name} — {core}.',
  de: '{name} — {core}.',
}

function fill(template, vars) {
  return String(template || '')
    .replace(/\{name\}/g, vars.name)
    .replace(/\{object\}/g, vars.object)
    .replace(/\{refrain\}/g, vars.refrain)
    .replace(/\{core\}/g, vars.core)
}

function pickLine(bank, phase, index, vars) {
  const list = bank[phase] || bank.meet
  return fill(list[index % list.length], vars)
}

function primaryBank(language) {
  return language === 'de' ? PHASE_LINES_DE : PHASE_LINES_EN
}

/**
 * Build full manuscript pages (primary + optional secondary scaffold).
 */
export function buildManuscriptPages({
  pageCount = 32,
  characterName = 'Hero',
  emotionalCore = 'belonging',
  signatureObject = 'favorite toy',
  refrain = '',
  language = 'en',
  secondaryLanguage = null,
  speechBubbles = false,
} = {}) {
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const core = String(emotionalCore || 'belonging').trim() || 'belonging'
  const object = String(signatureObject || 'favorite toy').trim() || 'favorite toy'
  const hook = String(refrain || defaultRefrainForHook(core)).trim()
  const vars = { name, object, refrain: hook, core }
  const beats = buildEscalatingBeatBriefs({
    pageCount,
    characterName: name,
    emotionalCore: core,
    signatureObject: object,
    refrain: hook,
  })
  const bank = primaryBank(language)
  const secHint = secondaryLanguage ? SECONDARY_HINT[secondaryLanguage] || SECONDARY_HINT.en : null

  return beats.map((beat, i) => {
    const text = pickLine(bank, beat.phase, i, vars)
    const textSecondary = secHint
      ? fill(secHint, vars) + (i % 3 === 0 ? ` ${hook}` : '')
      : ''
    const speech_bubble =
      speechBubbles && (beat.phase === 'escalate' || beat.phase === 'peak' || beat.phase === 'resolve')
        ? fill('“{refrain}!”', vars)
        : ''
    return {
      page_index: i,
      phase: beat.phase,
      illustration_brief: beat.illustration_brief,
      text_content: text,
      text_secondary: textSecondary,
      speech_bubble,
      word_count: text.split(/\s+/).filter(Boolean).length,
    }
  })
}

export function estimateManuscriptWords(pages) {
  return (pages || []).reduce((n, p) => n + (p.word_count || 0), 0)
}

export function manuscriptPayload() {
  return {
    meta: MANUSCRIPT_META,
    ageBands: [
      { ages: '3–5', words: 'about 200–500', note: 'Minimal text; images carry half the story' },
      { ages: '5–8', words: 'about 500–1000', note: 'Still picture-led; clearer plot beats' },
    ],
  }
}
