/**
 * KDP listing metadata builder — subtitle, age range, ≤7 backend keywords, category guidance.
 * Complements the 5-part book description (listing-description.js).
 * Not affiliated with Amazon. Keywords are drafts — edit before upload; never stuff or claim trademarks.
 */

import { BOOK_FORMATS } from './launchpad-seed.js'

export const LISTING_METADATA_META = {
  id: 'listing_metadata',
  title: 'KDP listing metadata',
  sourceIds: ['S69', 'S67'],
  disclaimer:
    'Draft subtitle, age range, up to 7 backend keywords, and category ideas from your story facts. Edit before pasting into KDP. Do not stuff keywords or use brands/trademarks you do not own. Not affiliated with Amazon.',
  keywordMax: 7,
  keywordMaxChars: 50,
}

/** Suggested browse paths — guidance only; Amazon’s picker is authoritative. */
export const CATEGORY_SUGGESTIONS = [
  {
    id: 'pic_feelings',
    label: 'Children’s Books › Growing Up & Facts of Life › Emotions & Feelings',
    formats: ['picture', 'board'],
    cores: ['belonging', 'courage', 'kindness', 'love', 'bravery_change'],
  },
  {
    id: 'pic_friendship',
    label: 'Children’s Books › Growing Up & Facts of Life › Friendship',
    formats: ['picture', 'early_reader'],
    cores: ['belonging', 'kindness', 'love'],
  },
  {
    id: 'pic_values',
    label: 'Children’s Books › Growing Up & Facts of Life › Values',
    formats: ['picture', 'early_reader', 'chapter'],
    cores: ['courage', 'kindness', 'pride', 'bravery_change'],
  },
  {
    id: 'pic_bedtime',
    label: 'Children’s Books › Literature & Fiction › Bedtime & Dreams',
    formats: ['board', 'picture'],
    cores: ['belonging', 'love', 'curiosity'],
  },
  {
    id: 'pic_multicultural',
    label: 'Children’s Books › Geography & Cultures › Multicultural Stories',
    formats: ['picture', 'early_reader', 'board'],
    cores: ['pride', 'belonging', 'curiosity'],
  },
  {
    id: 'early_readers',
    label: 'Children’s Books › Literature & Fiction › Chapter Books & Readers › Beginner Readers',
    formats: ['early_reader'],
    cores: [],
  },
  {
    id: 'chapter_general',
    label: 'Children’s Books › Literature & Fiction › Chapter Books & Readers',
    formats: ['chapter'],
    cores: [],
  },
]

const CORE_KEYWORD_PHRASES = {
  belonging: ['belonging', 'feeling accepted', 'finding home'],
  courage: ['courage for kids', 'overcoming fear', 'being brave'],
  curiosity: ['curiosity', 'asking questions', 'discovering'],
  kindness: ['kindness', 'empathy for kids', 'helping others'],
  love: ['family love', 'unconditional love', 'big feelings'],
  bravery_change: ['new beginnings', 'coping with change', 'moving house'],
  pride: ['cultural pride', 'identity for kids', 'heritage story'],
}

function langIsDe(language) {
  return String(language || 'en').toLowerCase().startsWith('de')
}

function normalizeCoreKey(emotionalCore) {
  const raw = String(emotionalCore || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
  if (CORE_KEYWORD_PHRASES[raw]) return raw
  if (/belong|zugehör/.test(raw)) return 'belonging'
  if (/courage|mut|brave|furcht/.test(raw)) return 'courage'
  if (/curios|neugier/.test(raw)) return 'curiosity'
  if (/kind|freundlich|güte/.test(raw)) return 'kindness'
  if (/love|liebe/.test(raw)) return 'love'
  if (/change|wechsel|neu/.test(raw)) return 'bravery_change'
  if (/pride|stolz/.test(raw)) return 'pride'
  return 'courage'
}

export function ageRangeForFormat(formatId) {
  const f = BOOK_FORMATS.find((x) => x.id === formatId)
  return f?.ageRange || '3–7'
}

export function formatLabelForId(formatId) {
  const f = BOOK_FORMATS.find((x) => x.id === formatId)
  return f?.format || 'Picture Book'
}

function cleanPhrase(s, max = LISTING_METADATA_META.keywordMaxChars) {
  return String(s || '')
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function dedupeKeywords(list) {
  const seen = new Set()
  const out = []
  for (const raw of list) {
    const k = cleanPhrase(raw)
    if (!k) continue
    const key = k.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(k)
    if (out.length >= LISTING_METADATA_META.keywordMax) break
  }
  return out
}

/**
 * Suggest browse categories from format + emotional core.
 * @returns {{ id: string, label: string }[]}
 */
export function suggestCategories({ formatId = 'picture', emotionalCore = 'courage' } = {}) {
  const core = normalizeCoreKey(emotionalCore)
  const format = formatId || 'picture'
  const scored = CATEGORY_SUGGESTIONS.map((c) => {
    let score = 0
    if (c.formats.includes(format)) score += 2
    if (!c.cores.length) score += 0.5
    if (c.cores.includes(core)) score += 3
    return { ...c, score }
  })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
  const top = scored.slice(0, 3).map(({ id, label }) => ({ id, label }))
  return top.length ? top : [{ id: 'pic_feelings', label: CATEGORY_SUGGESTIONS[0].label }]
}

/**
 * Build ≤7 backend keyword phrases from project facts.
 */
export function buildKeywords({
  characterName = 'Hero',
  emotionalCore = 'courage',
  formatId = 'picture',
  premise = '',
  language = 'en',
  bilingualSecondary = null,
} = {}) {
  const de = langIsDe(language)
  const name = cleanPhrase(characterName) || (de ? 'Held' : 'Hero')
  const ages = ageRangeForFormat(formatId)
  const core = normalizeCoreKey(emotionalCore)
  const corePhrases = CORE_KEYWORD_PHRASES[core] || CORE_KEYWORD_PHRASES.courage
  const formatLabel = formatLabelForId(formatId).toLowerCase()
  const premiseBit = cleanPhrase(premise, 40)

  const candidates = de
    ? [
        `bilderbuch ${ages}`,
        `${name} kinderbuch`,
        ...corePhrases.map((p) => (p.includes('kids') ? p.replace(/kids/i, 'kinder') : p)),
        `${formatLabel} ${ages}`,
        premiseBit,
        bilingualSecondary ? `zweisprachig ${bilingualSecondary}` : 'kinderbuch gefühle',
        'vorlesen abend',
      ]
    : [
        `picture book ages ${ages.replace(/–/g, '-')}`,
        `${name} children's book`,
        ...corePhrases,
        `${formatLabel} ${ages}`,
        premiseBit,
        bilingualSecondary ? `bilingual ${bilingualSecondary}` : 'kids social emotional',
        'bedtime read aloud',
      ]

  return dedupeKeywords(candidates)
}

/**
 * Draft a subtitle (optional on KDP) — short, benefits-led, no keyword stuffing.
 */
export function buildSubtitle({
  characterName = 'Hero',
  emotionalCore = 'courage',
  formatId = 'picture',
  language = 'en',
} = {}) {
  const de = langIsDe(language)
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const ages = ageRangeForFormat(formatId)
  const core = normalizeCoreKey(emotionalCore)
  const coreLabel = String(emotionalCore || core).trim() || (de ? 'Mut' : 'courage')
  if (de) {
    return `Eine Geschichte über ${coreLabel} für Kinder von ${ages} — mit ${name}`
  }
  return `A ${coreLabel} story for ages ${ages} — starring ${name}`
}

/**
 * Full metadata draft from project facts.
 */
export function buildListingMetadata({
  title = '',
  characterName = 'Hero',
  emotionalCore = 'courage',
  premise = '',
  formatId = 'picture',
  language = 'en',
  secondaryLanguage = null,
  agesOverride = '',
  subtitleOverride = '',
  keywordsOverride = null,
  categoriesOverride = null,
} = {}) {
  const ages = String(agesOverride || ageRangeForFormat(formatId)).trim() || '3–7'
  const keywords = Array.isArray(keywordsOverride)
    ? dedupeKeywords(keywordsOverride)
    : buildKeywords({
        characterName,
        emotionalCore,
        formatId,
        premise,
        language,
        bilingualSecondary: secondaryLanguage,
      })
  const categories = Array.isArray(categoriesOverride) && categoriesOverride.length
    ? categoriesOverride.slice(0, 3).map((c) =>
        typeof c === 'string' ? { id: 'custom', label: c } : { id: c.id || 'custom', label: c.label },
      )
    : suggestCategories({ formatId, emotionalCore })
  const subtitle =
    String(subtitleOverride || '').trim() ||
    buildSubtitle({ characterName, emotionalCore, formatId, language })

  return {
    title: String(title || '').slice(0, 200),
    subtitle: subtitle.slice(0, 200),
    age_range: ages.slice(0, 32),
    format_id: formatId || 'picture',
    format_label: formatLabelForId(formatId),
    keywords,
    categories,
    language: langIsDe(language) ? 'de' : 'en',
    secondary_language: secondaryLanguage || null,
    notes: [
      'Paste keywords into KDP “Keywords” (up to 7). Prefer multi-word phrases readers search.',
      'Pick categories in the KDP browser — suggestions below are starting points only.',
      'Title + subtitle on the listing should match the cover (Cover Studio).',
    ],
    meta: LISTING_METADATA_META,
  }
}

export function composeListingMetadataPlain(meta) {
  const keywords = dedupeKeywords(meta?.keywords || [])
  const categories = Array.isArray(meta?.categories) ? meta.categories : []
  const title = String(meta?.title || '').trim() || '(set in project)'
  const subtitle = String(meta?.subtitle || '').trim()
  const age = String(meta?.age_range || '').trim() || '3–7'
  const formatId = meta?.format_id || 'picture'
  const formatLabel = meta?.format_label || formatLabelForId(formatId)
  const notes = Array.isArray(meta?.notes) ? meta.notes : []
  const lines = [
    `Title: ${title}`,
    `Subtitle: ${subtitle}`,
    `Age range: ${age}`,
    `Format: ${formatLabel} (${formatId})`,
    '',
    'Keywords (up to 7 — paste into KDP):',
    ...(keywords.length
      ? keywords.map((k, i) => `${i + 1}. ${k}`)
      : ['(none yet — Build from story facts)']),
    '',
    'Category ideas (verify in KDP picker):',
    ...(categories.length
      ? categories.map((c, i) => `${i + 1}. ${typeof c === 'string' ? c : c.label}`)
      : ['(none yet)']),
    '',
    ...notes,
    '',
    LISTING_METADATA_META.disclaimer,
  ]
  return lines.join('\n')
}

export function emptyListingMetadata() {
  return {
    title: '',
    subtitle: '',
    age_range: '3–7',
    format_id: 'picture',
    format_label: 'Picture Book',
    keywords: ['', '', '', '', '', '', ''],
    categories: [],
    language: 'en',
    secondary_language: null,
    notes: [],
    plain: '',
    updated_at: null,
  }
}

export function normalizeListingMetadata(raw) {
  const base = emptyListingMetadata()
  if (!raw || typeof raw !== 'object') return base
  const keywordsRaw = Array.isArray(raw.keywords) ? raw.keywords : []
  const filled = dedupeKeywords(keywordsRaw)
  const keywords = keywordsForForm(filled)
  const categories = Array.isArray(raw.categories)
    ? raw.categories.slice(0, 3).map((c) =>
        typeof c === 'string'
          ? { id: 'custom', label: String(c).slice(0, 200) }
          : { id: String(c.id || 'custom').slice(0, 64), label: String(c.label || '').slice(0, 200) },
      )
    : []
  const normalized = {
    title: String(raw.title || '').slice(0, 200),
    subtitle: String(raw.subtitle || '').slice(0, 200),
    age_range: String(raw.age_range || base.age_range).slice(0, 32),
    format_id: String(raw.format_id || 'picture').slice(0, 32),
    format_label: String(raw.format_label || formatLabelForId(raw.format_id)).slice(0, 80),
    keywords,
    categories,
    language: raw.language === 'de' ? 'de' : 'en',
    secondary_language: raw.secondary_language || null,
    notes: Array.isArray(raw.notes) ? raw.notes.map((n) => String(n).slice(0, 300)) : [],
    updated_at: raw.updated_at || null,
  }
  // plain uses non-empty keywords only
  const forPlain = {
    ...normalized,
    keywords: filled,
  }
  const plain = String(raw.plain || '').trim() || composeListingMetadataPlain(forPlain)
  return {
    ...normalized,
    plain: plain.slice(0, 8000),
  }
}

/** Pad keywords to 7 slots for the form UI. */
export function keywordsForForm(keywords) {
  const list = Array.isArray(keywords) ? [...keywords] : []
  while (list.length < LISTING_METADATA_META.keywordMax) list.push('')
  return list.slice(0, LISTING_METADATA_META.keywordMax)
}

export function listingMetadataPayload() {
  return {
    meta: LISTING_METADATA_META,
    categories: CATEGORY_SUGGESTIONS,
    formats: BOOK_FORMATS.map((f) => ({ id: f.id, format: f.format, ageRange: f.ageRange })),
    empty: emptyListingMetadata(),
  }
}
