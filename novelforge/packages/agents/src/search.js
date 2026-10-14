/**
 * SearchProvider for fact-check — mock by default; Tavily/Brave when keys set.
 * Never invents supporting evidence.
 */

export class SearchProvider {
  get id() {
    return 'base'
  }

  /** @returns {Promise<{ results: { title: string, url: string, snippet: string }[], provider: string, fetchedAt: string }>} */
  async search(_query) {
    throw new Error('not implemented')
  }
}

export class MockSearchProvider extends SearchProvider {
  get id() {
    return 'mock'
  }

  async search(query) {
    const q = String(query || '').trim()
    return {
      provider: this.id,
      fetchedAt: new Date().toISOString(),
      estimated: true,
      disclaimer:
        'Mock search — does not verify claims. Connect TAVILY_API_KEY or BRAVE_API_KEY for live checks. Never treat results as proof without reading the source.',
      results: q
        ? [
            {
              title: `Reference listing related to: ${q.slice(0, 80)}`,
              url: 'https://example.com/reference-not-a-real-source',
              snippet:
                'Placeholder snippet for offline UI. NovelForge will not mark claims verified from mock results.',
            },
          ]
        : [],
    }
  }
}

export class TavilySearchProvider extends SearchProvider {
  constructor({ apiKey, fetchImpl } = {}) {
    super()
    this.apiKey = (apiKey || '').trim()
    this.fetchImpl = fetchImpl || globalThis.fetch
  }

  get id() {
    return 'tavily'
  }

  get ready() {
    return this.apiKey.length > 8
  }

  async search(query) {
    if (!this.ready) throw Object.assign(new Error('TAVILY_API_KEY missing'), { code: 'search_not_configured' })
    const res = await this.fetchImpl('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: this.apiKey,
        query: String(query || '').slice(0, 400),
        max_results: 5,
        include_answer: false,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw Object.assign(new Error(data?.detail || `Tavily HTTP ${res.status}`), { code: 'search_upstream' })
    }
    return {
      provider: this.id,
      fetchedAt: new Date().toISOString(),
      estimated: false,
      results: (data.results || []).map((r) => ({
        title: r.title || '',
        url: r.url || '',
        snippet: r.content || r.snippet || '',
      })),
    }
  }
}

export function createSearchProvider(cfg = {}) {
  const name = (cfg.provider || process.env.NOVELFORGE_SEARCH_PROVIDER || 'mock').toLowerCase()
  if (name === 'tavily') {
    return new TavilySearchProvider({ apiKey: cfg.apiKey || process.env.TAVILY_API_KEY })
  }
  return new MockSearchProvider()
}
