/** Primary manuscript languages + audience culture/tone profiles for NovelForge. */

export const BOOK_LANGUAGE_CODES = Object.freeze(['en', 'de', 'es', 'fr', 'it', 'nl'])

/**
 * Culture / market undertones for each primary language.
 * Injected into agent prompts so fiction prose fits reader expectations — not stereotypes.
 * Studio lane (diaspora / bilingual / DE–EU) still applies on top via product-positioning.
 */
export const BOOK_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    audience: 'International / US–UK–EU readers of commercial adult fiction',
    register: 'Clear and direct; commercial-readable voice over ornate padding',
    structure: 'Strong early hook; scene goals; chapter promises paid off',
    tone: 'Emotionally clear; paced; intimate or cinematic as the bible requires',
    defaultVariety: 'us',
    varieties: [
      { code: 'us', label: 'US English', note: 'US spelling and idiom (color, organize, gotten)' },
      { code: 'uk', label: 'UK English', note: 'UK spelling and idiom (colour, organise, got)' },
    ],
    norms: [
      'Pick one English variety (US or UK) and keep spelling/idiom consistent',
      'Pace, stakes, and character voice matter more than purple prose',
      'Dialogue should sound spoken, not essay-like',
    ],
    avoid: [
      'Formulaic AI-isms and info-dumps',
      'Unexplained culture jumps',
      'Flat “as you know” exposition',
    ],
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    audience: 'DACH readers of commercial / literary-leaning adult fiction',
    register: 'Precise and readable; Sie/du in dialogue locked to character and setting',
    structure: 'Controlled Spannung; clear scene beats; place and social texture',
    tone: 'Klar, emotionally honest; credibility over melodrama',
    defaultVariety: 'de',
    varieties: [
      { code: 'de', label: 'Germany (DE)', note: 'Standard German (Germany)' },
      { code: 'at', label: 'Austria (AT)', note: 'Austrian German preferences where they differ' },
      { code: 'ch', label: 'Switzerland (CH)', note: 'Swiss Standard German; avoid unnecessary ß where CH prefers ss' },
    ],
    norms: [
      'Klarheit and concrete sensory detail over vague lyric fog',
      'DACH settings and diaspora texture welcome when niche demands it',
      'Keep character address (Sie/du) consistent with relationships',
    ],
    avoid: [
      'Anglicism overload in dialogue',
      'Fake Gemütlichkeit',
      'Invented “true story” claims or living-person libel',
    ],
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    audience: 'Spanish-language fiction readers (LatAm or Spain — pick one variety)',
    register: 'Warm and relational; tú/usted + lexicon locked to chosen variety',
    structure: 'Narrative flow with family/community texture; clear scene goals',
    tone: 'Emotive but concrete; spoken rhythm in dialogue',
    defaultVariety: 'latam',
    varieties: [
      { code: 'latam', label: 'Latin America', note: 'LatAm lexicon; avoid vosotros; ustedes plural' },
      { code: 'es', label: 'Spain', note: 'Peninsular Spanish; vosotros OK when natural' },
    ],
    norms: [
      'Declare and keep one variety (LatAm vs Spain) for spelling, vosotros, and idioms',
      'Connection, dignidad, and place matter in character voice',
      'Dialogue should feel native, not translated',
    ],
    avoid: [
      'Mixing Peninsular and LatAm casually',
      'Stiff English calques',
      'Generic US romance/thriller cadence in Spanish clothes only',
    ],
  },
  {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    audience: 'Francophone readers who value voix, nuance, and atmosphere',
    register: 'Elegant but modern; tu/vous locked to characters and social context',
    structure: 'Atmosphere and controlled intrigue; developed scène over list-like beats',
    tone: 'Intellectual warmth without snobbery; finesse over shouty drama',
    defaultVariety: 'fr',
    varieties: [
      { code: 'fr', label: 'France', note: 'Metropolitan French' },
      { code: 'be', label: 'Belgium', note: 'Belgian French preferences where they differ' },
      { code: 'ca', label: 'Canada', note: 'Canadian French; keep consistent if chosen' },
    ],
    norms: [
      'Style and nuance rewarded; avoid flat Google-Translate French',
      'Voix and place texture matter as much as plot mechanics',
      'Titles and blurbs should feel native, not anglicized spam',
    ],
    avoid: [
      'Direct US commercial cadence with French words only',
      'Anglicized title spam',
      'Stiff calques and empty corporate phrasing in fiction',
    ],
  },
  {
    code: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    audience: 'Italian readers who expect human, place-rooted fiction',
    register: 'Musical conversational-literary balance; human and concrete',
    structure: 'Relationship and place before rigid beat templates; scenes that breathe',
    tone: 'Warm, expressive; life texture over abstract emotion labels',
    defaultVariety: 'it',
    varieties: [{ code: 'it', label: 'Standard Italian', note: 'Standard Italian for commercial fiction' }],
    norms: [
      'Famiglia, place, and spoken cadence matter when culturally relevant',
      'Concrete sensory detail over slogans',
      'Keep Italian natural — not an English plot skeleton with Italian labels',
    ],
    avoid: [
      'Melodrama stacked on melodrama',
      'English structure with Italian words only',
      'Flat tourist-postcard Italy without character truth',
    ],
  },
  {
    code: 'nl',
    label: 'Dutch',
    nativeLabel: 'Nederlands',
    audience: 'Dutch / Flemish readers who prefer nuchter, grounded fiction',
    register: 'Direct, plain, egalitarian; light dry wit allowed',
    structure: 'Understated tension; clear scene goals; concrete action over speechifying',
    tone: 'Honest and understated; emotional truth without overselling',
    defaultVariety: 'nl',
    varieties: [
      { code: 'nl', label: 'Netherlands', note: 'Netherlandic Dutch' },
      { code: 'be', label: 'Flanders (BE)', note: 'Belgian Dutch / Flemish preferences where they differ' },
    ],
    norms: [
      'Readers distrust melodrama and fake profundity',
      'Concrete behavior shows feeling better than declarations',
      'Keep voice egalitarian and clear',
    ],
    avoid: [
      'Overblown pathos and purple claims',
      'German-calque stiffness',
      'Hustle or self-help cadence leaking into fiction',
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
    `Write ALL book prose — titles, chapter/scene text, dialogue, descriptions, metadata blurbs — in ${row.label} using the chosen variety consistently.`,
    `Keep JSON keys in English. Do not mix languages unless a brief in-world phrase is intentional.`,
    `Register: ${row.register}`,
    `Structure: ${row.structure}`,
    `Tone: ${row.tone}`,
    `Audience norms:\n${norms}`,
    `Avoid:\n${avoid}`,
    'Honor the Book Bible (premise, cast, POV, tense, tone) on top of these language-market norms. Prefer culturally specific diaspora texture when the niche calls for it — never invent living-person libel or “true story” claims.',
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
