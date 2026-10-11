/**
 * Mirror of AuthorForge RECOMMENDED_NICHES for Amazon Hub (ScanLogic cannot import @authorforge/shared).
 * Keep in sync with authorforge/packages/shared/src/product-positioning.js
 */

export const MARKET_DISCLAIMER =
  '⚠ Strategic niche guidance — not verified Amazon sales data. Validate demand yourself before publishing.'

export const HUB_NICHE_LADDER = {
  en: [
    {
      priority: 1,
      studio: 'StoryForge',
      title: 'Bilingual children’s picture books',
      detail: 'Twi/English or Twi/German series — same character, life lessons.',
    },
    {
      priority: 2,
      studio: 'AuthorForge',
      title: 'Culturally specific parenting guide',
      detail: 'African immigrant parents in Germany — bilingual education, identity, confident kids.',
    },
    {
      priority: 3,
      studio: 'AuthorForge',
      title: 'Cultural journals & planners',
      detail: 'Proverbs, bilingual home trackers, immigrant entrepreneur planners.',
    },
    {
      priority: 4,
      studio: 'AuthorForge',
      title: 'Coaching workbooks',
      detail: 'For African immigrant professionals building businesses in Europe.',
    },
    {
      priority: 5,
      studio: 'AuthorForge',
      title: 'Identity-specific self-help',
      detail: 'Niched mindset books — not generic self-help.',
    },
    {
      priority: 6,
      studio: 'StoryForge',
      title: 'Children’s activity & culture workbooks',
      detail: 'Alphabet / colouring companions beside your picture series.',
    },
  ],
  de: [
    {
      priority: 1,
      studio: 'StoryForge',
      title: 'Zweisprachige Kinderbilderbücher',
      detail: 'Twi/Englisch oder Twi/Deutsch — gleiche Figur, Lebenslektionen.',
    },
    {
      priority: 2,
      studio: 'AuthorForge',
      title: 'Kulturell spezifischer Erziehungsratgeber',
      detail: 'Afrikanische Einwanderer-Eltern in Deutschland — Zweisprachigkeit, Identität.',
    },
    {
      priority: 3,
      studio: 'AuthorForge',
      title: 'Kulturelle Journale & Planner',
      detail: 'Sprichwörter, Tracker für zweisprachige Haushalte, Business-Planner.',
    },
    {
      priority: 4,
      studio: 'AuthorForge',
      title: 'Coaching-Workbooks',
      detail: 'Für afrikanische Fachkräfte, die in Europa Business aufbauen.',
    },
    {
      priority: 5,
      studio: 'AuthorForge',
      title: 'Identitätsbezogenes Self-Help',
      detail: 'Hart genicht — kein generisches Self-Help.',
    },
    {
      priority: 6,
      studio: 'StoryForge',
      title: 'Kinder-Activity- & Kultur-Workbooks',
      detail: 'Alphabet-/Malbücher als Begleiter zur Bilderbuchserie.',
    },
  ],
}

export function hubNicheLadder(lang = 'en') {
  return HUB_NICHE_LADDER[lang] || HUB_NICHE_LADDER.en
}
