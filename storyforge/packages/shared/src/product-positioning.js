/**
 * StoryForge product positioning — bilingual kids’ books + activity companions.
 * Adult non-fiction / parenting guides → AuthorForge.
 * ⚠ Strategic guidance — not verified Amazon sales data.
 */

export const STORYFORGE_PRODUCT = {
  id: 'storyforge',
  category: 'childrens_picture_books',
  sibling: 'authorforge',
  strategy:
    'Lead with bilingual African-language + EN/DE picture-book series; activity books as companions. Parent guides live in AuthorForge.',
}

export const MARKET_DISCLAIMER =
  '⚠ Strategic niche guidance for this studio — not verified Amazon sales data. Validate demand yourself before publishing.'

export const STORYFORGE_NICHES = [
  {
    id: 'bilingual_childrens_books',
    priority: 1,
    seed: {
      title: 'The Little Brave Heart',
      language: 'tw',
      secondary_language: 'en',
      bilingual_layout: 'stacked',
      page_count: 32,
      format_id: 'picture',
      emotional_core: 'courage and belonging in two languages',
      premise: 'A child learns bravery at home and at school across two languages and cultures.',
      recommended_niche_id: 'bilingual_childrens_books',
    },
    en: {
      title: 'Bilingual children’s picture books',
      angle: 'Twi/English or Twi/German series — same character, life lessons.',
      why: 'Open lane for African-language bilingual books on Amazon.de.',
      cta: 'Use this niche',
    },
    de: {
      title: 'Zweisprachige Kinderbilderbücher',
      angle: 'Twi/Englisch oder Twi/Deutsch — gleiche Figur, Lebenslektionen.',
      why: 'Offener Raum für afrikanischsprachige Bilderbücher auf Amazon.de.',
      cta: 'Diese Nische nutzen',
    },
  },
  {
    id: 'bilingual_childrens_books_de',
    priority: 1,
    seed: {
      title: 'Das kleine mutige Herz',
      language: 'tw',
      secondary_language: 'de',
      bilingual_layout: 'stacked',
      page_count: 32,
      format_id: 'picture',
      emotional_core: 'Mut und Zugehörigkeit in zwei Sprachen',
      premise: 'Ein Kind lernt Mut zu Hause und in der Schule — in zwei Sprachen und Kulturen.',
      recommended_niche_id: 'bilingual_childrens_books',
    },
    en: {
      title: 'Bilingual picture books (Twi / German)',
      angle: 'Same series strategy with German as the secondary language.',
      why: 'Germany-market bilingual pair for African diaspora families.',
      cta: 'Use Twi–German',
    },
    de: {
      title: 'Zweisprachige Bilderbücher (Twi / Deutsch)',
      angle: 'Gleiche Serien-Strategie mit Deutsch als Zweitsprache.',
      why: 'Deutschland-Markt für afrikanische Diaspora-Familien.',
      cta: 'Twi–Deutsch nutzen',
    },
  },
  {
    id: 'childrens_activity_workbooks',
    priority: 6,
    seed: {
      title: 'Twi ABC Playbook',
      language: 'tw',
      secondary_language: 'en',
      bilingual_layout: 'stacked',
      page_count: 40,
      format_id: 'picture',
      emotional_core: 'pride and play in two languages',
      premise: 'Activity and alphabet play that matches the picture-book character world.',
      recommended_niche_id: 'childrens_activity_workbooks',
    },
    en: {
      title: 'Children’s activity & culture workbooks',
      angle: 'Colouring / activity / alphabet books beside your picture series.',
      why: 'Companion purchase for parents who bought the story books.',
      cta: 'Use this niche',
    },
    de: {
      title: 'Kinder-Activity- & Kultur-Workbooks',
      angle: 'Mal-/Activity-/Alphabetbücher neben der Bilderbuchserie.',
      why: 'Begleitkauf für Eltern der Geschichtenbücher.',
      cta: 'Diese Nische nutzen',
    },
  },
]

export function storyforgeNicheLocalized(niche, lang = 'en') {
  if (!niche) return null
  return { ...niche, ...(niche[lang] || niche.en) }
}

export function applyStoryforgeNiche(nicheId) {
  const niche = STORYFORGE_NICHES.find((n) => n.id === nicheId)
  if (!niche?.seed) return null
  return { ...niche.seed }
}
