/**
 * NovelForge product positioning — adult fiction studio.
 * AuthorForge = adult non-fiction; StoryForge = children’s picture books.
 *
 * ⚠ Niche guidance is strategic — not verified Amazon sales data.
 */

export const NOVELFORGE_PRODUCT = {
  id: 'novelforge',
  category: 'fiction',
  audience: 'adult_readers',
  siblings: ['authorforge', 'storyforge'],
  strategy:
    'Adult commercial fiction with culturally specific diaspora lanes (African-heritage, bilingual, Germany-based) beating generic middle.',
}

export const MARKET_DISCLAIMER =
  '⚠ Strategic niche guidance for this studio — not verified Amazon sales data. Validate demand yourself before publishing.'

export const RECOMMENDED_NICHES = [
  {
    id: 'diaspora_contemporary',
    studio: 'novelforge',
    priority: 1,
    formats: ['novel', 'novella'],
    seed: { target_words: 80000, trim_size: '5.5x8.5', genre: 'contemporary' },
    en: {
      title: 'Diaspora contemporary',
      angle: 'Immigrant / first-gen life in Germany or Europe — identity, belonging, family.',
      why: 'Underserved literary-commercial lane with real lived texture.',
      exampleTitles: ['Two Homes, One Heart', 'The Year We Learned German'],
      audience: 'Adult readers of culturally specific contemporary fiction',
      tone: 'Intimate, clear, emotionally honest',
    },
    de: {
      title: 'Diaspora-Contemporary',
      angle: 'Einwanderer- / First-Gen-Leben in Deutschland — Identität, Zugehörigkeit, Familie.',
      why: 'Unterversorgte literarisch-kommerzielle Nische.',
      exampleTitles: ['Zwei Zuhause', 'Das Jahr, in dem wir Deutsch lernten'],
      audience: 'Erwachsene Leser kulturell spezifischer Gegenwartsromane',
      tone: 'Nah, klar, emotional ehrlich',
    },
  },
  {
    id: 'romance_cross_cultural',
    studio: 'novelforge',
    priority: 2,
    formats: ['novel', 'novella'],
    seed: { target_words: 70000, trim_size: '5x8', genre: 'romance' },
    en: {
      title: 'Cross-cultural romance',
      angle: 'Love across cultures/languages in Europe — heat + heart, adult leads only.',
      why: 'Romance readers seek specific tropes; diaspora settings differentiate.',
      exampleTitles: ['Letters Between Accents', 'Berlin Soft Landing'],
      audience: 'Adult romance readers who want culturally grounded HEA/HFN',
      tone: 'Warm, witty, emotionally satisfying',
    },
    de: {
      title: 'Interkulturelle Romance',
      angle: 'Liebe über Kulturen/Sprachen in Europa — Herz und Wärme, nur erwachsene Figuren.',
      why: 'Romance-Leser wollen Tropes; Diaspora-Settings differenzieren.',
      exampleTitles: ['Briefe zwischen Akzenten', 'Weiche Landung Berlin'],
      audience: 'Erwachsene Romance-Leser mit kulturell geerdeten HEA/HFN',
      tone: 'Warm, witzig, emotional befriedigend',
    },
  },
  {
    id: 'thriller_europe',
    studio: 'novelforge',
    priority: 3,
    formats: ['novel'],
    seed: { target_words: 90000, trim_size: '6x9', genre: 'thriller' },
    en: {
      title: 'European thriller',
      angle: 'Suspense set in DE/EU cities with immigrant or dual-identity protagonists.',
      why: 'Thriller + place specificity travels well in translation.',
      exampleTitles: ['The Rhine Clock', 'Passport Ghost'],
      audience: 'Adult thriller readers',
      tone: 'Tense, precise, cinematic',
    },
    de: {
      title: 'Europa-Thriller',
      angle: 'Suspense in DE/EU-Städten mit Einwanderer- oder Doppelidentitäts-Protagonisten.',
      why: 'Thriller + Ortsspezifität funktioniert gut in Übersetzung.',
      exampleTitles: ['Die Rheinuhr', 'Passgeist'],
      audience: 'Erwachsene Thriller-Leser',
      tone: 'Angespannt, präzise, filmisch',
    },
  },
  {
    id: 'literary_family_saga',
    studio: 'novelforge',
    priority: 4,
    formats: ['novel'],
    seed: { target_words: 95000, trim_size: '5.5x8.5', genre: 'literary' },
    en: {
      title: 'Literary family saga',
      angle: 'Multi-generation African-heritage family stories across continents.',
      why: 'Literary readers reward voice + cultural depth.',
      exampleTitles: ['The Compound Years', 'What We Carried Over'],
      audience: 'Adult literary fiction readers',
      tone: 'Lyrical but clear, character-driven',
    },
    de: {
      title: 'Literarische Familiensaga',
      angle: 'Mehrgenerationen-Geschichten afrikanischer Herkunft über Kontinente hinweg.',
      why: 'Literarische Leser belohnen Stimme und kulturelle Tiefe.',
      exampleTitles: ['Die Compound-Jahre', 'Was wir mitbrachten'],
      audience: 'Erwachsene Leser literarischer Fiction',
      tone: 'Ly risch aber klar, figurengetrieben',
    },
  },
  {
    id: 'authorforge_parenting',
    studio: 'authorforge',
    priority: 90,
    formats: ['howto_guide'],
    seed: {},
    en: {
      title: 'Parenting / coaching non-fiction',
      angle: 'Guides and workbooks — build in AuthorForge, not here.',
      why: 'Wrong studio for non-fiction.',
      exampleTitles: [],
    },
    de: {
      title: 'Erziehungs- / Coaching-Sachbuch',
      angle: 'Ratgeber und Workbooks — in AuthorForge bauen, nicht hier.',
      why: 'Falsches Studio für Sachbuch.',
      exampleTitles: [],
    },
  },
  {
    id: 'storyforge_kids',
    studio: 'storyforge',
    priority: 91,
    formats: ['picture_book_series'],
    seed: {},
    en: {
      title: 'Children’s picture books',
      angle: 'Illustrated kids series — build in StoryForge.',
      why: 'Wrong studio for picture books.',
      exampleTitles: [],
    },
    de: {
      title: 'Kinderbilderbücher',
      angle: 'Illustrierte Kinderserien — in StoryForge bauen.',
      why: 'Falsches Studio für Bilderbücher.',
      exampleTitles: [],
    },
  },
]

export function nichesForStudio(studio = 'novelforge') {
  return RECOMMENDED_NICHES.filter((n) => n.studio === studio)
}

export function nicheLocalized(niche, lang = 'en') {
  if (!niche) return null
  const loc = lang === 'de' ? niche.de : niche.en
  return { ...niche, ...loc }
}

export function productCopy(lang = 'en') {
  if (lang === 'de') {
    return {
      categoryLabel: 'Nur Fiction',
      strategyLine: NOVELFORGE_PRODUCT.strategy,
      forLabel: 'Für',
      forLines: [
        'Erwachsene Romane & Novellen',
        'Romance, Thriller, Contemporary, Literary',
        'Kulturell spezifische Diaspora-Geschichten',
      ],
      notLabel: 'Nicht für',
      notLines: ['Sachbuch → AuthorForge', 'Kinderbilderbücher → StoryForge', 'Fanfiction mit Markenrechten'],
    }
  }
  return {
    categoryLabel: 'Fiction only',
    strategyLine: NOVELFORGE_PRODUCT.strategy,
    forLabel: 'For',
    forLines: [
      'Adult novels & novellas',
      'Romance, thriller, contemporary, literary',
      'Culturally specific diaspora stories',
    ],
    notLabel: 'Not for',
    notLines: ['Non-fiction → AuthorForge', 'Kids picture books → StoryForge', 'Trademarked fanfiction'],
  }
}

export function applyRecommendedNiche(nicheId, lang = 'en') {
  const niche = RECOMMENDED_NICHES.find((n) => n.id === nicheId && n.studio === 'novelforge')
  if (!niche) return null
  const loc = nicheLocalized(niche, lang)
  return {
    genre: niche.seed?.genre || 'contemporary',
    topic: loc.angle,
    target_words: niche.seed?.target_words || 80000,
    trim_size: niche.seed?.trim_size || '5.5x8.5',
    working_title: loc.exampleTitles?.[0] || 'Untitled novel',
    bible: {
      recommended_niche_id: niche.id,
      genre: niche.seed?.genre || 'contemporary',
      premise: loc.angle,
      audience: loc.audience || '',
      tone: loc.tone || '',
      usp: loc.angle,
    },
  }
}

export function nicheContextForBook(book) {
  const id = book?.bible?.recommended_niche_id
  const niche = RECOMMENDED_NICHES.find((n) => n.id === id) || null
  return {
    product: NOVELFORGE_PRODUCT,
    niche: niche ? nicheLocalized(niche, book?.language === 'de' ? 'de' : 'en') : null,
    disclaimer: MARKET_DISCLAIMER,
  }
}

export function productPositioningPayload(lang = 'en') {
  return {
    product: NOVELFORGE_PRODUCT,
    disclaimer: MARKET_DISCLAIMER,
    copy: productCopy(lang),
    niches: nichesForStudio('novelforge').map((n) => ({
      id: n.id,
      priority: n.priority,
      ...nicheLocalized(n, lang),
      seed: n.seed,
    })),
  }
}

/** AuthorForge compatibility aliases used by some tests/helpers */
export const AUTHORFORGE_PRODUCT = NOVELFORGE_PRODUCT
