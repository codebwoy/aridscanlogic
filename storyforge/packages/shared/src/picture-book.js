/**
 * Amazon-style picture-book blueprint helpers (structure only — original text).
 * Escalating emotional beats for ~24–40 page books.
 */

import { BOOK_FORMATS } from './launchpad-seed.js'

export const PICTURE_BOOK_META = {
  id: 'picture_book_blueprint',
  title: 'Picture-book blueprint',
  sourceIds: ['S59'],
  note:
    'Models bestsellers’ structure (one emotion, escalation, refrain) — never copy protected text or art.',
}

/**
 * Build per-page illustration briefs for an escalating emotional arc.
 * Does not write final manuscript lines — scene guidance only.
 */
export function buildEscalatingBeatBriefs({
  pageCount = 32,
  characterName = 'Hero',
  emotionalCore = 'belonging',
  signatureObject = 'favorite toy',
  refrain = '',
} = {}) {
  const n = Math.max(4, Number(pageCount) || 32)
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const core = String(emotionalCore || 'belonging').trim() || 'belonging'
  const obj = String(signatureObject || 'favorite toy').trim() || 'favorite toy'
  const hook = String(refrain || '').trim()

  const phases = [
    { start: 0, end: 0.12, label: 'meet', brief: `${name} appears full-body; introduce world; calm warm light; show ${obj}` },
    { start: 0.12, end: 0.28, label: 'bond', brief: `${name} with caring adult/friend; soft expressions; ${core} begins` },
    { start: 0.28, end: 0.55, label: 'escalate', brief: `${name} tries a bigger declaration/action of ${core}; keep outfit + ${obj} locked` },
    { start: 0.55, end: 0.78, label: 'peak', brief: `${name} at the biggest imaginative stretch of ${core}; clear silhouette pose` },
    { start: 0.78, end: 0.92, label: 'resolve', brief: `Caring figure answers with greater warmth; ${name} feels safe; ${obj} visible` },
    { start: 0.92, end: 1.01, label: 'close', brief: `Quiet bedtime/hug close-up; ${name} secure; merch-readable face` },
  ]

  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1)
    const phase = phases.find((p) => t >= p.start && t < p.end) || phases[phases.length - 1]
    const refrainNote = hook ? ` Refrain cue: “${hook}”.` : ''
    return {
      page_index: i,
      phase: phase.label,
      illustration_brief: `Beat ${i + 1}/${n} (${phase.label}): ${phase.brief}.${refrainNote}`,
    }
  })
}

export function defaultRefrainForHook(emotionalHook) {
  const map = {
    belonging: 'I belong here with you',
    courage: 'I can try one more time',
    curiosity: 'I want to know more',
    kindness: 'I can help',
    love: 'I love you this much',
    bravery_change: 'New things can be okay',
    pride: 'I am proud of who I am',
  }
  return map[emotionalHook] || 'I am here with you'
}

export function pictureBookPayload() {
  return {
    meta: PICTURE_BOOK_META,
    formats: BOOK_FORMATS,
    pagePresets: [24, 32, 40],
  }
}
