/**
 * AuthorForge product positioning — single source of truth for agents, UI, and prompts.
 * StoryForge owns children’s picture books; AuthorForge owns adult non-fiction.
 *
 * Niche list = strategic focus for African-heritage / bilingual / Germany-based authors.
 * ⚠ Not verified Amazon sales rankings — validate demand yourself before publishing.
 */

export const AUTHORFORGE_PRODUCT = {
  id: 'authorforge',
  category: 'non_fiction',
  audience: 'adult_readers',
  sibling: 'storyforge',
  strategy:
    'Niche down hard: culturally specific voices (African heritage, bilingual, Germany-based) beat generic middle.',
}

export const MARKET_DISCLAIMER =
  '⚠ Strategic niche guidance for this studio — not verified Amazon sales data. Validate demand yourself before publishing.'

/**
 * Priority niches. `studio: 'storyforge'` items are sibling brand work — not drafted in AuthorForge.
 * @type {ReadonlyArray<{
 *   id: string
 *   studio: 'authorforge' | 'storyforge'
 *   priority: number
 *   formats: string[]
 *   en: object
 *   de: object
 *   seed: { target_words?: number, trim_size?: string, focus_tags?: string[] }
 * }>}
 */
export const RECOMMENDED_NICHES = [
  {
    id: 'bilingual_childrens_books',
    studio: 'storyforge',
    priority: 1,
    formats: ['picture_book_series'],
    seed: {},
    en: {
      title: 'Bilingual children’s picture books',
      angle: 'Twi/English, Twi/German (or other African language + DE/EN) series — same character, life lessons.',
      why: 'Strongest brand asset; open lane on Amazon.de for your language pair. Build in StoryForge.',
      exampleTitles: ['The Little Brave Heart (Twi / English)', 'Kofi Learns Two Homes (Twi / German)'],
    },
    de: {
      title: 'Zweisprachige Kinderbilderbücher',
      angle: 'Twi/Englisch, Twi/Deutsch (oder andere afrikanische Sprache + DE/EN) — gleiche Figur, Lebenslektionen.',
      why: 'Stärkstes Marken-Asset; freier Raum auf Amazon.de. In StoryForge bauen.',
      exampleTitles: ['Das kleine mutige Herz (Twi / Englisch)', 'Kofi lernt zwei Zuhause (Twi / Deutsch)'],
    },
  },
  {
    id: 'culturally_specific_parenting',
    studio: 'authorforge',
    priority: 2,
    formats: ['howto_guide', 'companion_workbook'],
    seed: {
      target_words: 32000,
      trim_size: '6x9',
      focus_tags: ['bilingual', 'identity', 'parenting_germany', 'immigrant_family'],
    },
    en: {
      title: 'Culturally specific parenting guide',
      angle:
        'Workbook / how-to for African immigrant parents in Germany: bilingual education, identity, confident kids.',
      why: 'Hungry, underserved audience; companion to your kids’ series. Print + digital.',
      exampleTitles: [
        'How to Raise a Bilingual Child: An African Parent’s Guide in Germany',
        'Raising Confident Kids Between Two Cultures — a parent workbook',
      ],
      audience: 'African immigrant and mixed-heritage parents raising children in Germany',
      usp: 'Practical, culturally specific parenting for bilingual African / immigrant families in Germany — not generic Western parenting advice.',
      tone: 'Warm, direct, respectful — expert peer, not lecture',
    },
    de: {
      title: 'Kulturell spezifischer Erziehungsratgeber',
      angle:
        'Workbook / How-to für afrikanische Einwanderer-Eltern in Deutschland: Zweisprachigkeit, Identität, selbstbewusste Kinder.',
      why: 'Unterversorgte Zielgruppe; Begleiter zur Kinderbuch-Serie. Print + Digital.',
      exampleTitles: [
        'Zweisprachig großziehen: Ratgeber für afrikanische Eltern in Deutschland',
        'Selbstbewusste Kinder zwischen zwei Kulturen — Eltern-Workbook',
      ],
      audience: 'Afrikanische Einwanderer- und Mixed-Heritage-Eltern mit Kindern in Deutschland',
      usp: 'Praktische, kulturell spezifische Erziehung für zweisprachige afrikanische / migrantische Familien in Deutschland — kein generischer West-Ratgeber.',
      tone: 'Warm, klar, respektvoll — erfahrene Peer-Stimme, keine Belehrung',
    },
  },
  {
    id: 'cultural_journals_planners',
    studio: 'authorforge',
    priority: 3,
    formats: ['journal', 'planner', 'tracker'],
    seed: {
      target_words: 12000,
      trim_size: '6x9',
      focus_tags: ['journal', 'proverbs', 'bilingual_home', 'habits'],
    },
    en: {
      title: 'Journals & planners with cultural theme',
      angle: 'Gratitude journals with African proverbs; bilingual parenting trackers; immigrant entrepreneur planners.',
      why: 'Evergreen repurchase; faster path to a first KDP listing. Keep prompts authentic — no invented proverbs.',
      exampleTitles: [
        'Proverbs & Gratitude — 90 days for the African diaspora in Europe',
        'Bilingual Home Tracker — 12 weeks for parents in Germany',
      ],
      audience: 'African diaspora families and immigrant entrepreneurs in Europe',
      usp: 'Culturally themed prompts and trackers for diaspora life in Germany/Europe — not a blank generic journal.',
      tone: 'Encouraging, grounded, culturally proud',
    },
    de: {
      title: 'Journale & Planner mit kulturellem Thema',
      angle: 'Dankbarkeitsjournale mit afrikanischen Sprichwörtern; Tracker für zweisprachige Haushalte; Business-Planner.',
      why: 'Evergreen; schneller erster KDP-Titel. Sprichwörter nur authentisch — nichts erfinden.',
      exampleTitles: [
        'Sprichwörter & Dankbarkeit — 90 Tage für die afrikanische Diaspora in Europa',
        'Tracker Zweisprachiges Zuhause — 12 Wochen für Eltern in Deutschland',
      ],
      audience: 'Afrikanische Diaspora-Familien und Einwanderer-Unternehmer:innen in Europa',
      usp: 'Kulturell geprägte Prompts und Tracker für Diaspora-Leben in DE/Europa — kein leeres Standard-Journal.',
      tone: 'Ermutigend, geerdet, kulturell stolz',
    },
  },
  {
    id: 'coaching_workbooks_immigrant_pros',
    studio: 'authorforge',
    priority: 4,
    formats: ['workbook', 'fillable_pdf_export'],
    seed: {
      target_words: 28000,
      trim_size: '8.5x11',
      focus_tags: ['coaching', 'business_europe', 'immigrant_professionals', 'exercises'],
    },
    en: {
      title: 'Coaching workbooks for immigrant professionals',
      angle: 'Workbooks African immigrant professionals use to build businesses / careers in Europe — coaches can resell.',
      why: 'High perceived value (€18–€35 class pricing is common for workbooks — verify your own comps).',
      exampleTitles: [
        'Build Your Practice in Europe — workbook for African coaches & consultants',
        'Client Breakthrough Sessions — facilitator workbook',
      ],
      audience: 'African immigrant coaches, consultants, and professionals building in Europe',
      usp: 'Exercise-heavy workbook for immigrant professionals in Europe — culturally fluent, coach-ready.',
      tone: 'Practical, structured, coach-facilitator voice',
    },
    de: {
      title: 'Coaching-Workbooks für Einwanderer-Profis',
      angle: 'Workbooks für afrikanische Fachkräfte, die in Europa Business/Karriere aufbauen — auch zum Weiterverkauf durch Coaches.',
      why: 'Hoher wahrgenommener Wert (Workbook-Preise oft €18–€35 — eigene Comps prüfen).',
      exampleTitles: [
        'Praxis aufbauen in Europa — Workbook für afrikanische Coaches & Berater:innen',
        'Client Breakthrough Sessions — Facilitator-Workbook',
      ],
      audience: 'Afrikanische Einwanderer-Coaches, Berater:innen und Professionals in Europa',
      usp: 'Übungsstarkes Workbook für Einwanderer-Professionals in Europa — kulturell treffend, coach-tauglich.',
      tone: 'Praktisch, strukturiert, Facilitator-Stimme',
    },
  },
  {
    id: 'childrens_activity_workbooks',
    studio: 'storyforge',
    priority: 6,
    formats: ['activity_book', 'coloring', 'alphabet'],
    seed: {
      language: 'tw',
      secondary_language: 'en',
      page_count: 32,
      format_id: 'activity',
      emotional_core: 'pride and play in two languages',
    },
    en: {
      title: 'Children’s activity & culture workbooks',
      angle: 'African culture colouring / activity / Twi–English alphabet books beside your picture series.',
      why: 'Parents who buy your story books also buy the activity book. Build art consistency in StoryForge.',
      exampleTitles: ['Twi ABC Playbook (Twi / English)', 'Colours of Home — activity book'],
    },
    de: {
      title: 'Kinder-Activity- & Kultur-Workbooks',
      angle: 'Afrikanische Kultur-Mal-/Activity-/Twi–Englisch-Alphabetbücher neben der Bilderbuchserie.',
      why: 'Eltern kaufen zur Geschichte oft auch das Activity-Buch. Kunst-Konsistenz in StoryForge.',
      exampleTitles: ['Twi-ABC-Spielbuch (Twi / Englisch)', 'Farben der Heimat — Activity-Buch'],
    },
  },
  {
    id: 'identity_self_help',
    studio: 'authorforge',
    priority: 5,
    formats: ['ebook', 'paperback_series'],
    seed: {
      target_words: 40000,
      trim_size: '5.5x8.5',
      focus_tags: ['mindset', 'identity', 'first_generation', 'europe_career'],
    },
    en: {
      title: 'Identity-specific self-help / mindset',
      angle: 'Niched hard: confidence, immigrant mindset, first-generation professional playbooks — not generic self-help.',
      why: 'Broad self-help is crowded; identity-specific series still has room.',
      exampleTitles: [
        'Confidence for African Women in Corporate Europe',
        'The Immigrant Mindset: Building Success in a New Country',
        "From Africa to Europe: A First-Generation Professional's Playbook",
      ],
      audience: 'First-generation African professionals and women building careers in Europe',
      usp: 'Identity-specific mindset guidance for the African diaspora in Europe — never generic hustle clichés.',
      tone: 'Clear, ambitious, compassionate — no toxic positivity',
    },
    de: {
      title: 'Identitätsbezogenes Self-Help / Mindset',
      angle: 'Hart genicht: Selbstvertrauen, Immigrant Mindset, First-Gen-Playbooks — kein generisches Self-Help.',
      why: 'Breites Self-Help ist voll; identitätsspezifische Serien haben Raum.',
      exampleTitles: [
        'Selbstvertrauen für afrikanische Frauen in Corporate Europe',
        'The Immigrant Mindset: Erfolg im neuen Land',
        'Von Afrika nach Europa: Playbook für First-Generation Professionals',
      ],
      audience: 'First-Generation afrikanische Professionals und Frauen mit Karriere in Europa',
      usp: 'Identitätsspezifisches Mindset für die afrikanische Diaspora in Europa — keine generischen Hustle-Floskeln.',
      tone: 'Klar, ambitioniert, mitfühlend — keine toxische Positivität',
    },
  },
]

/** Short EN/DE blurbs for studio chrome and Amazon Hub. */
export const PRODUCT_COPY = {
  en: {
    categoryLabel: 'Non-fiction only',
    forLabel: 'For',
    notLabel: 'Not for',
    nichesLabel: 'Recommended niches for your lane',
    applyNiche: 'Use this niche',
    storyforgeOnly: 'Build in StoryForge',
    forLines: [
      'Culturally specific parenting guides & workbooks (bilingual / African immigrant families in Germany)',
      'Coaching workbooks and identity-niched self-help for African professionals in Europe',
      'Cultural journals & planners — plus companion parent guides beside your StoryForge kids’ series',
    ],
    notLines: [
      'Fiction novels or short stories',
      'Children’s picture books or illustrated bedtime stories (use StoryForge)',
      'Generic middle-of-market self-help with no cultural niche',
    ],
    hybridHint:
      'Hybrid brand: StoryForge for bilingual kids’ series → AuthorForge for the parent / coaching companion.',
    strategyLine:
      'Niche down: your African heritage, bilingual voice, and Germany base are the strategy — not a side note.',
    exampleTitles: [
      'How to Raise a Bilingual Child: An African Parent’s Guide in Germany',
      'Build Your Practice in Europe — workbook for African coaches',
      'The Immigrant Mindset: Building Success in a New Country',
    ],
  },
  de: {
    categoryLabel: 'Nur Sachbuch',
    forLabel: 'Für',
    notLabel: 'Nicht für',
    nichesLabel: 'Empfohlene Nischen für Ihre Spur',
    applyNiche: 'Diese Nische nutzen',
    storyforgeOnly: 'In StoryForge bauen',
    forLines: [
      'Kulturell spezifische Erziehungsratgeber & Workbooks (zweisprachige / afrikanische Einwanderer-Familien in DE)',
      'Coaching-Workbooks und identitätsbezogenes Self-Help für afrikanische Professionals in Europa',
      'Kulturelle Journale & Planner — plus Eltern-Begleiter neben der StoryForge-Kinderbuchserie',
    ],
    notLines: [
      'Romane oder Kurzgeschichten',
      'Kinderbilderbücher oder illustrierte Gute-Nacht-Geschichten (dafür StoryForge)',
      'Generisches Mid-Market-Self-Help ohne kulturelle Nische',
    ],
    hybridHint:
      'Hybrid-Marke: StoryForge für zweisprachige Kinderbuch-Serie → AuthorForge für Eltern-/Coaching-Begleiter.',
    strategyLine:
      'Niche down: afrikanisches Erbe, Zweisprachigkeit und Standort Deutschland sind die Strategie — kein Nebensatz.',
    exampleTitles: [
      'Zweisprachig großziehen: Ratgeber für afrikanische Eltern in Deutschland',
      'Praxis aufbauen in Europa — Workbook für afrikanische Coaches',
      'The Immigrant Mindset: Erfolg im neuen Land',
    ],
  },
}

export function productCopy(lang = 'en') {
  return PRODUCT_COPY[lang] || PRODUCT_COPY.en
}

export function nichesForStudio(studio = 'authorforge') {
  return RECOMMENDED_NICHES.filter((n) => n.studio === studio).sort((a, b) => a.priority - b.priority)
}

export function nicheById(id) {
  return RECOMMENDED_NICHES.find((n) => n.id === id) || null
}

export function nicheLocalized(niche, lang = 'en') {
  if (!niche) return null
  const L = niche[lang] || niche.en
  return { ...niche, ...L }
}

/** Patch fields when the author picks a recommended niche in Book Basics. */
export function applyRecommendedNiche(nicheId, lang = 'en') {
  const niche = nicheById(nicheId)
  if (!niche || niche.studio !== 'authorforge') return null
  const L = niche[lang] || niche.en
  const title = L.exampleTitles?.[0] || L.title
  const wantsWorkbook = (niche.formats || []).some((f) => /workbook|journal|planner|tracker/i.test(f))
  return {
    working_title: String(title).slice(0, 200),
    subtitle: String(L.angle || '').slice(0, 300),
    topic: String(L.title).slice(0, 200),
    target_words: niche.seed?.target_words || 28000,
    trim_size: niche.seed?.trim_size || '6x9',
    formatting: wantsWorkbook ? { preset: 'workbook' } : { preset: 'modern' },
    bible: {
      usp: L.usp || L.angle || '',
      audience: L.audience || '',
      ideal_reader: L.audience || '',
      tone: L.tone || '',
      focus_tags: niche.seed?.focus_tags || [],
      key_selling_points: [L.why, L.angle].filter(Boolean),
      recommended_niche_id: niche.id,
    },
  }
}

/** Compact niche context for LLM jobs (never claim Amazon-verified demand). */
export function nicheContextForBook(book, lang = 'en') {
  const id = book?.bible?.recommended_niche_id
  const niche = id ? nicheById(id) : null
  const L = niche ? niche[lang] || niche.en : null
  return {
    strategy: AUTHORFORGE_PRODUCT.strategy,
    market_disclaimer: MARKET_DISCLAIMER,
    recommended_niche_id: id || null,
    niche: L
      ? {
          id: niche.id,
          title: L.title,
          angle: L.angle,
          audience: L.audience,
          usp: L.usp,
          example_titles: L.exampleTitles,
          formats: niche.formats,
        }
      : null,
    ladder: RECOMMENDED_NICHES.map((n) => ({
      id: n.id,
      priority: n.priority,
      studio: n.studio,
      title: (n[lang] || n.en).title,
    })),
  }
}

/** Public payload for /v1/specs and Amazon Hub mirrors. */
export function productPositioningPayload(lang = 'en') {
  return {
    product: AUTHORFORGE_PRODUCT,
    market_disclaimer: MARKET_DISCLAIMER,
    copy: productCopy(lang),
    niches: RECOMMENDED_NICHES.map((n) => {
      const L = n[lang] || n.en
      return {
        id: n.id,
        studio: n.studio,
        priority: n.priority,
        formats: n.formats,
        title: L.title,
        angle: L.angle,
        why: L.why,
        exampleTitles: L.exampleTitles,
      }
    }),
  }
}
