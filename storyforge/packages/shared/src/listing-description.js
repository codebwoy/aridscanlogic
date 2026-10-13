/**
 * 5-part Amazon KDP book description builder for children’s picture books.
 * Uses project facts (emotional core, premise, character, ages).
 * Social proof is never invented — only a quote the author pastes.
 * Not affiliated with Amazon. Edit before upload.
 */

import { BOOK_FORMATS } from './launchpad-seed.js'

export const LISTING_DESCRIPTION_META = {
  id: 'listing_description',
  title: 'KDP book description (5-part)',
  sourceIds: ['S67'],
  disclaimer:
    'Draft listing copy from your story facts — not Amazon Ads advice. Never invent reviews. Edit before pasting into KDP. Not affiliated with Amazon.',
}

/** @typedef {{ id: string, label: string, role: string }} ListingPartDef */

/** @type {ListingPartDef[]} */
export const LISTING_DESCRIPTION_PARTS = [
  { id: 'hook', label: 'Hook', role: 'Child problem / emotion (1 sentence)' },
  { id: 'promise', label: 'Story promise', role: 'What happens — no spoiler (2–3 sentences)' },
  { id: 'sel', label: 'SEL benefit', role: 'What child + parent gain (1–2 sentences)' },
  { id: 'social', label: 'Social proof', role: 'Real review only — leave blank until you have one' },
  { id: 'cta', label: 'Call to action', role: 'Tell the parent to buy (1 sentence)' },
]

const SEL_BY_CORE = {
  belonging: {
    en: 'belonging and feeling safe with people who care',
    de: 'Zugehörigkeit und das Gefühl, bei lieben Menschen sicher zu sein',
  },
  courage: {
    en: 'that feeling scared is normal — and courage is not the absence of fear',
    de: 'dass Angst normal ist — und Mut nicht die Abwesenheit von Angst bedeutet',
  },
  curiosity: {
    en: 'gentle curiosity and asking questions about the world',
    de: 'sanfte Neugier und das Stellen von Fragen über die Welt',
  },
  kindness: {
    en: 'kindness toward others and toward themselves',
    de: 'Freundlichkeit gegenüber anderen und sich selbst',
  },
  love: {
    en: 'love, connection, and being held through big feelings',
    de: 'Liebe, Verbindung und Halt bei großen Gefühlen',
  },
  bravery_change: {
    en: 'facing change with small brave steps',
    de: 'Veränderung mit kleinen mutigen Schritten anzugehen',
  },
  pride: {
    en: 'pride in who they are and where they come from',
    de: 'Stolz darauf, wer sie sind und woher sie kommen',
  },
}

function ageRangeForFormat(formatId) {
  const f = BOOK_FORMATS.find((x) => x.id === formatId)
  return f?.ageRange || '3–7'
}

function normalizeCoreKey(emotionalCore) {
  const raw = String(emotionalCore || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
  if (SEL_BY_CORE[raw]) return raw
  // fuzzy map common phrases
  if (/belong|zugehör/.test(raw)) return 'belonging'
  if (/courage|mut|brave|furcht/.test(raw)) return 'courage'
  if (/curios|neugier/.test(raw)) return 'curiosity'
  if (/kind|freundlich|güte/.test(raw)) return 'kindness'
  if (/love|liebe/.test(raw)) return 'love'
  if (/change|wechsel|neu/.test(raw)) return 'bravery_change'
  if (/pride|stolz/.test(raw)) return 'pride'
  return 'courage'
}

function langIsDe(language) {
  return String(language || 'en').toLowerCase().startsWith('de')
}

/**
 * Build structured 5-part description from project facts.
 * @returns {{ parts: Record<string,string>, plain: string, html: string, meta: object }}
 */
export function buildListingDescription({
  title = '',
  characterName = 'Hero',
  emotionalCore = 'courage',
  premise = '',
  refrain = '',
  formatId = 'picture',
  language = 'en',
  reviewQuote = '',
  agesOverride = '',
} = {}) {
  const de = langIsDe(language)
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const ages = String(agesOverride || ageRangeForFormat(formatId)).trim() || '3–7'
  const coreKey = normalizeCoreKey(emotionalCore)
  const selPhrase = (SEL_BY_CORE[coreKey] || SEL_BY_CORE.courage)[de ? 'de' : 'en']
  const coreLabel = String(emotionalCore || coreKey).trim() || (de ? 'Mut' : 'courage')
  const premiseClean = String(premise || '').trim()
  const quote = String(reviewQuote || '').trim()

  const refrainClean = String(refrain || '')
    .trim()
    .replace(/^[„"“]|[“"”]$/g, '')
  const selBase = de
    ? `Ideal, um Kindern im Alter von ${ages} zu zeigen: ${selPhrase}.`
    : `Perfect for helping children aged ${ages} understand ${selPhrase}.`
  const selRefrain = refrainClean
    ? de
      ? ` Ein wiederkehrender Satz begleitet euch: „${refrainClean}“.`
      : ` A gentle refrain walks with you: “${refrainClean}”.`
    : ''

  const parts = de
    ? {
        hook: `Macht sich Ihr Kind Sorgen um neue Orte, neue Menschen oder neue Dinge — und braucht Geschichten über ${coreLabel}?`,
        promise: premiseClean
          ? `In dieser warm illustrierten Geschichte begegnet ${name} einer großen Herausforderung. ${premiseClean.replace(/\.\s*$/, '')} — und entdeckt dabei etwas Überraschendes über ${coreLabel}.`
          : `In dieser warm illustrierten Geschichte stellt sich ${name} der größten Herausforderung — und entdeckt etwas Überraschendes über ${coreLabel}.`,
        sel: selBase + selRefrain,
        social: quote
          ? (quote.startsWith('"') || quote.startsWith('„') ? quote : `„${quote}“`) +
            ' — verifizierte Amazon-Rezension'
          : '',
        cta: 'Jetzt nach oben scrollen und in den Warenkorb legen.',
      }
    : {
        hook: `Does your child worry about new places, new people, or new things — and need stories about ${coreLabel}?`,
        promise: premiseClean
          ? `In this warmly illustrated story, ${name} faces a big challenge. ${premiseClean.replace(/\.\s*$/, '')} — and discovers something surprising about ${coreLabel}.`
          : `In this warmly illustrated story, ${name} faces the biggest challenge yet — and discovers something surprising about ${coreLabel}.`,
        sel: selBase + selRefrain,
        social: quote
          ? (quote.startsWith('"') || quote.startsWith('“') ? quote : `"${quote}"`) +
            ' — verified Amazon reviewer'
          : '',
        cta: 'Scroll up and add to your basket today.',
      }

  const bookLine = title
    ? de
      ? `${title} — ein Bilderbuch mit ${name}.`
      : `${title} — a picture book starring ${name}.`
    : ''

  return {
    parts,
    plain: composeListingPlain(parts, { bookLine }),
    html: composeListingHtml(parts, { bookLine }),
    meta: {
      characterName: name,
      ages,
      coreKey,
      language: de ? 'de' : 'en',
      hasSocialProof: Boolean(quote),
      title: title || null,
    },
  }
}

export function composeListingPlain(parts, { bookLine = '' } = {}) {
  const lines = []
  if (bookLine) lines.push(bookLine, '')
  const order = ['hook', 'promise', 'sel', 'social', 'cta']
  for (const id of order) {
    const text = String(parts?.[id] || '').trim()
    if (!text) continue
    lines.push(text, '')
  }
  return lines.join('\n').trim() + '\n'
}

export function composeListingHtml(parts, { bookLine = '' } = {}) {
  const blocks = []
  if (bookLine) blocks.push(`<p><strong>${escapeHtml(bookLine)}</strong></p>`)
  const order = ['hook', 'promise', 'sel', 'social', 'cta']
  for (const id of order) {
    const text = String(parts?.[id] || '').trim()
    if (!text) continue
    if (id === 'social') blocks.push(`<p><em>${escapeHtml(text)}</em></p>`)
    else if (id === 'cta') blocks.push(`<p><strong>${escapeHtml(text)}</strong></p>`)
    else blocks.push(`<p>${escapeHtml(text)}</p>`)
  }
  return blocks.join('\n')
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function emptyListingDescription() {
  return {
    parts: { hook: '', promise: '', sel: '', social: '', cta: '' },
    plain: '',
    html: '',
    review_quote: '',
    language: 'en',
    updated_at: null,
  }
}

export function normalizeListingDescription(raw) {
  const base = emptyListingDescription()
  if (!raw || typeof raw !== 'object') return base
  const parts = { ...base.parts }
  for (const id of Object.keys(parts)) {
    parts[id] = String(raw.parts?.[id] ?? raw[id] ?? '').slice(0, 800)
  }
  const review = String(raw.review_quote || '').slice(0, 500)
  const plain =
    String(raw.plain || '').trim() ||
    composeListingPlain(parts)
  const html =
    String(raw.html || '').trim() ||
    composeListingHtml(parts)
  return {
    parts,
    plain: plain.slice(0, 6000),
    html: html.slice(0, 8000),
    review_quote: review,
    language: raw.language === 'de' ? 'de' : 'en',
    updated_at: raw.updated_at || null,
  }
}

/** Rebuild plain/html from edited parts (keeps social empty if blank). */
export function refreshListingFromParts(listing, { bookLine = '' } = {}) {
  const n = normalizeListingDescription(listing)
  return {
    ...n,
    plain: composeListingPlain(n.parts, { bookLine }),
    html: composeListingHtml(n.parts, { bookLine }),
    updated_at: new Date().toISOString(),
  }
}

export function listingDescriptionPayload() {
  return {
    meta: LISTING_DESCRIPTION_META,
    parts: LISTING_DESCRIPTION_PARTS,
    empty: emptyListingDescription(),
  }
}
