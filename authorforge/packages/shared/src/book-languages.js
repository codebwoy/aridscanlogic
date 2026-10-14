/** Primary manuscript languages + audience culture/tone profiles for AuthorForge. */

export const BOOK_LANGUAGE_CODES = Object.freeze(['en', 'de', 'es', 'fr', 'it', 'nl'])

/**
 * Culture / market undertones for each primary language.
 * Injected into agent prompts so prose fits reader expectations — not stereotypes.
 * Studio lane (diaspora / bilingual / DE–EU) still applies on top via product-positioning.
 */
export const BOOK_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    audience: 'International / US–UK–EU English readers of commercial non-fiction',
    register: 'Clear and direct; coaching or storytelling voice over academic padding',
    structure: 'Strong early hook; short–medium paragraphs; chapter promises paid off',
    tone: 'Warm-professional; concrete examples; emotional clarity without hype',
    defaultVariety: 'us',
    varieties: [
      { code: 'us', label: 'US English', note: 'US spelling and idiom (color, organize, gotten)' },
      { code: 'uk', label: 'UK English', note: 'UK spelling and idiom (colour, organise, got)' },
    ],
    norms: [
      'Pick one English variety (US or UK) and keep spelling/idiom consistent',
      'Pace and payoff matter more than ornate style',
      'Peer-expert voice beats lecture or corporate brochure',
    ],
    avoid: [
      'Purple prose and empty self-help clichés',
      'Unexplained culture jumps',
      'Fake urgency / hustle-bro cadence',
    ],
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    audience: 'DACH readers of practical, credible non-fiction',
    register: 'Precise and readable; Sie/du locked to Book Bible and kept consistent',
    structure: 'Logical Aufbau; clear Nutzen per Kapitel; controlled argument arc',
    tone: 'Sachlich-warm; credibility over hype; respectful peer, not Belehrung',
    defaultVariety: 'de',
    varieties: [
      { code: 'de', label: 'Germany (DE)', note: 'Standard German (Germany)' },
      { code: 'at', label: 'Austria (AT)', note: 'Austrian German preferences where they differ' },
      { code: 'ch', label: 'Switzerland (CH)', note: 'Swiss Standard German; avoid unnecessary ß where CH prefers ss' },
    ],
    norms: [
      'Klarheit and honest sourcing cues matter (no invented stats)',
      'Prefer concrete Schritte over motivational slogans',
      'DACH taste: competent, grounded, culturally specific when niche demands it',
    ],
    avoid: [
      'Anglicism overload',
      'Fake Gemütlichkeit',
      'Invented “immigrant statistics” or proverbs',
    ],
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    audience: 'Spanish-language readers (LatAm or Spain — pick one variety)',
    register: 'Warm and relational; tú/usted + lexicon locked to chosen variety',
    structure: 'Narrative flow with family/community texture when relevant; clear chapter goals',
    tone: 'Emotive but concrete; trusted peer guide, not a translated US workbook',
    defaultVariety: 'latam',
    varieties: [
      { code: 'latam', label: 'Latin America', note: 'LatAm lexicon; avoid vosotros; ustedes plural' },
      { code: 'es', label: 'Spain', note: 'Peninsular Spanish; vosotros OK when natural' },
    ],
    norms: [
      'Declare and keep one variety (LatAm vs Spain) for spelling, vosotros, and idioms',
      'Connection and dignidad matter in advice voice',
      'Spoken rhythm in examples and dialogue-like coaching lines',
    ],
    avoid: [
      'Mixing Peninsular and LatAm casually',
      'Stiff English calques',
      'Generic US self-help tone in Spanish clothes',
    ],
  },
  {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    audience: 'Francophone readers who value nuance and style',
    register: 'Elegant but modern; tu/vous locked to audience',
    structure: 'Developed pensée over listicles; controlled argument and transitions',
    tone: 'Intellectual warmth without snobbery; finesse over shouty persuasion',
    defaultVariety: 'fr',
    varieties: [
      { code: 'fr', label: 'France', note: 'Metropolitan French' },
      { code: 'be', label: 'Belgium', note: 'Belgian French preferences where they differ' },
      { code: 'ca', label: 'Canada', note: 'Canadian French; keep consistent if chosen' },
    ],
    norms: [
      'Style and précision rewarded; avoid flat Google-Translate French',
      'Raisonné guidance: explain why, then how',
      'Titles and blurbs should feel native, not anglicized spam',
    ],
    avoid: [
      'Direct US self-help cadence',
      'Anglicized title spam',
      'Stiff calques and empty corporate French',
    ],
  },
  {
    code: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    audience: 'Italian readers who expect human, place-rooted prose',
    register: 'Musical conversational-literary balance; human and concrete',
    structure: 'Story and relationship before rigid templates; chapters that breathe',
    tone: 'Warm, expressive, amico competente — not cold coach',
    defaultVariety: 'it',
    varieties: [{ code: 'it', label: 'Standard Italian', note: 'Standard Italian for commercial non-fiction' }],
    norms: [
      'Famiglia, place, and spoken cadence matter when culturally relevant',
      'Concrete life texture over abstract slogans',
      'Keep register natural Italian, not translated English structure',
    ],
    avoid: [
      'Melodrama stacked on melodrama',
      'English skeleton with Italian words only',
      'Cold corporate coaching voice',
    ],
  },
  {
    code: 'nl',
    label: 'Dutch',
    nativeLabel: 'Nederlands',
    audience: 'Dutch / Flemish readers who prefer nuchter, practical prose',
    register: 'Direct, plain, egalitarian; light dry wit allowed',
    structure: 'Practical beats; short clear sections; concrete how-to before inspiration',
    tone: 'Honest and understated; no overselling',
    defaultVariety: 'nl',
    varieties: [
      { code: 'nl', label: 'Netherlands', note: 'Netherlandic Dutch' },
      { code: 'be', label: 'Flanders (BE)', note: 'Belgian Dutch / Flemish preferences where they differ' },
    ],
    norms: [
      'Readers distrust fake expertise and hype',
      'Concrete stappen beat soft inspiration slogans',
      'Keep voice egalitarian and clear',
    ],
    avoid: [
      'Overblown claims and heavy pathos',
      'German-calque stiffness',
      'Toxic positivity or hustle language',
    ],
  },
]

export const DEFAULT_BOOK_LANGUAGE = 'en'

export function isBookLanguage(code) {
  return BOOK_LANGUAGE_CODES.includes(String(code || '').toLowerCase())
}

export function normalizeBookLanguage(code, fallback = DEFAULT_BOOK_LANGUAGE) {
  const c = String(code || '').toLowerCase().trim()
  return isBookLanguage(c) ? c : fallback
}

export function bookLanguageProfile(code) {
  const normalized = normalizeBookLanguage(code)
  return BOOK_LANGUAGES.find((l) => l.code === normalized) || BOOK_LANGUAGES[0]
}

export function bookLanguageLabel(code) {
  return bookLanguageProfile(code).label
}

export function bookLanguageVarieties(code) {
  const row = bookLanguageProfile(code)
  return Array.isArray(row.varieties) ? row.varieties : []
}

export function normalizeBookLanguageVariety(langCode, varietyCode) {
  const row = bookLanguageProfile(langCode)
  const varieties = bookLanguageVarieties(langCode)
  const fallback = row.defaultVariety || varieties[0]?.code || row.code
  const v = String(varietyCode || '').toLowerCase().trim()
  if (varieties.some((x) => x.code === v)) return v
  return fallback
}

export function bookLanguageVarietyLabel(langCode, varietyCode) {
  const v = normalizeBookLanguageVariety(langCode, varietyCode)
  const hit = bookLanguageVarieties(langCode).find((x) => x.code === v)
  return hit?.label || v
}

/**
 * Instruction injected into agent prompts: write in the language AND match audience culture/tone.
 */
export function bookLanguageAgentInstruction(code, varietyCode) {
  const row = bookLanguageProfile(code)
  const variety = normalizeBookLanguageVariety(code, varietyCode)
  const varietyRow = bookLanguageVarieties(code).find((x) => x.code === variety)
  const norms = (row.norms || []).map((n) => `- ${n}`).join('\n')
  const avoid = (row.avoid || []).map((n) => `- ${n}`).join('\n')
  return [
    `Manuscript language: ${row.label} (${row.code}) — native label: ${row.nativeLabel}.`,
    `Language variety: ${varietyRow?.label || variety} (${variety}). ${varietyRow?.note || ''}`.trim(),
    `Audience fit: ${row.audience}.`,
    `Write ALL book prose — titles, subtitles, chapter text, examples, descriptions, metadata blurbs — in ${row.label} using the chosen variety consistently.`,
    `Keep JSON keys in English. Do not mix languages unless a brief intentional phrase is required.`,
    `Register: ${row.register}`,
    `Structure: ${row.structure}`,
    `Tone: ${row.tone}`,
    `Audience norms:\n${norms}`,
    `Avoid:\n${avoid}`,
    'Honor the Book Bible tone/persona on top of these language-market norms. Prefer culturally specific diaspora texture when the niche calls for it — never invent credentials, stats, or proverbs.',
  ].join('\n')
}

/** Short UI blurb under the language picker. */
export function bookLanguageCultureHint(code) {
  const row = bookLanguageProfile(code)
  return `${row.tone} · ${row.audience}`
}

/** Exposed on GET /v1/specs so API + UI stay single-source. */
export function bookLanguagesPayload() {
  return {
    codes: [...BOOK_LANGUAGE_CODES],
    default: DEFAULT_BOOK_LANGUAGE,
    languages: BOOK_LANGUAGES.map((l) => ({
      code: l.code,
      label: l.label,
      nativeLabel: l.nativeLabel,
      audience: l.audience,
      register: l.register,
      structure: l.structure,
      tone: l.tone,
      defaultVariety: l.defaultVariety || l.code,
      varieties: (l.varieties || []).map((v) => ({ ...v })),
      norms: [...(l.norms || [])],
      avoid: [...(l.avoid || [])],
    })),
  }
}
