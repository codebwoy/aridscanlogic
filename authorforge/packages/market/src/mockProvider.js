import { MarketDataProvider } from './provider.js'
import { RECOMMENDED_NICHES, MARKET_DISCLAIMER } from '@authorforge/shared'

/** Mock niches aligned to AuthorForge / StoryForge recommended ladder (estimates only). */
const FIXTURES = RECOMMENDED_NICHES.map((n, i) => {
  const en = n.en
  const demand = n.priority <= 2 ? 'high' : n.priority <= 4 ? 'high' : 'medium'
  const competition = n.studio === 'storyforge' || n.id.includes('parenting') || n.id.includes('identity')
    ? 'low'
    : 'medium'
  return {
    topic: en.title,
    niche_id: n.id,
    studio: n.studio,
    priority: n.priority,
    category:
      n.studio === 'storyforge'
        ? 'Children’s Books'
        : n.id.includes('parenting')
          ? 'Parenting'
          : n.id.includes('coaching') || n.id.includes('workbook')
            ? 'Education & Teaching'
            : 'Self-Help',
    est_bsr: 25000 + i * 7000,
    est_reviews_max: 40 + i * 15,
    price_band: n.formats?.some((f) => /workbook|journal/i.test(f)) ? [14.99, 34.99] : [9.99, 18.99],
    demand,
    competition,
    angle: en.angle,
    why: en.why,
    estimated: true,
  }
})

export class MockMarketProvider extends MarketDataProvider {
  get id() {
    return 'mock'
  }

  async searchNiches(filters = {}) {
    const fetchedAt = new Date().toISOString()
    let results = [...FIXTURES]
    if (filters.maxBsr) results = results.filter((r) => r.est_bsr <= filters.maxBsr)
    if (filters.category) {
      const c = String(filters.category).toLowerCase()
      results = results.filter((r) => r.category.toLowerCase().includes(c))
    }
    if (filters.studio) {
      results = results.filter((r) => r.studio === filters.studio)
    }
    return {
      provider: this.id,
      fetchedAt,
      estimated: true,
      disclaimer: `${MARKET_DISCLAIMER} Mock fixtures — estimates only. Not live Amazon data. No scraping.`,
      results,
    }
  }

  async competitorMeta({ topic = '', asin = '' } = {}) {
    const seed = String(topic || '')
    const match =
      FIXTURES.find((f) => seed.toLowerCase().includes(String(f.topic).toLowerCase().slice(0, 12))) ||
      FIXTURES[1]
    return {
      provider: this.id,
      fetchedAt: new Date().toISOString(),
      estimated: true,
      seed: asin || topic,
      titles: [
        {
          asin: asin || 'B0MOCK001',
          title: `${match.topic} — adjacent title (metadata only)`,
          subtitle: 'Public metadata fixture — not a live Amazon scrape',
          category: match.category,
          public_metrics: { est_bsr: match.est_bsr, review_count: match.est_reviews_max },
        },
        {
          asin: 'B0MOCK002',
          title: 'Generic Parenting Guide (broad — avoid this lane)',
          subtitle: 'Fixture showing crowded middle',
          category: 'Parenting',
          public_metrics: { est_bsr: 12000, review_count: 2100 },
        },
      ],
      review_themes: [
        { theme: 'wants culturally specific advice', estimated: true },
        { theme: 'bilingual household tips', estimated: true },
        { theme: 'practical workbook exercises', estimated: true },
      ],
      disclaimer: MARKET_DISCLAIMER,
    }
  }
}

export function createMarketProvider(name = 'mock') {
  return new MockMarketProvider()
}
