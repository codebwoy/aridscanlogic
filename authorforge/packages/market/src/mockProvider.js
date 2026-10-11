import { MarketDataProvider } from './provider.js'

const FIXTURES = [
  {
    topic: 'habit systems for freelancers',
    category: 'Business & Money',
    est_bsr: 45000,
    est_reviews_max: 120,
    price_band: [9.99, 16.99],
    demand: 'medium',
    competition: 'medium',
    estimated: true,
  },
  {
    topic: 'calm productivity for parents',
    category: 'Self-Help',
    est_bsr: 62000,
    est_reviews_max: 80,
    price_band: [8.99, 14.99],
    demand: 'medium',
    competition: 'low',
    estimated: true,
  },
  {
    topic: 'first non-fiction book for experts',
    category: 'Reference',
    est_bsr: 38000,
    est_reviews_max: 200,
    price_band: [12.99, 19.99],
    demand: 'high',
    competition: 'high',
    estimated: true,
  },
]

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
    return {
      provider: this.id,
      fetchedAt,
      estimated: true,
      disclaimer: 'Mock fixtures — estimates only. Not live Amazon data. No scraping.',
      results,
    }
  }

  async competitorMeta({ topic = '', asin = '' } = {}) {
    return {
      provider: this.id,
      fetchedAt: new Date().toISOString(),
      estimated: true,
      seed: asin || topic,
      titles: [
        {
          asin: asin || 'B0MOCK001',
          title: 'Comparable Title A (metadata only)',
          subtitle: 'Public metadata fixture',
          category: 'Business',
          public_metrics: { est_bsr: 22000, review_count: 340 },
        },
        {
          asin: 'B0MOCK002',
          title: 'Comparable Title B (metadata only)',
          subtitle: 'Another fixture',
          category: 'Self-Help',
          public_metrics: { est_bsr: 51000, review_count: 90 },
        },
      ],
      review_themes: [
        { theme: 'wants more templates', sentiment: 'gap' },
        { theme: 'too generic examples', sentiment: 'gap' },
        { theme: 'clear structure', sentiment: 'praise' },
      ],
      disclaimer: 'Metadata + synthetic review themes for offline UI. Not scraped book text.',
    }
  }
}

export function createMarketProvider(name = 'mock') {
  return new MockMarketProvider()
}
