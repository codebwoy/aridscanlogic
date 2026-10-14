/**
 * External plagiarism adapter — ONLY runs with informed consent.
 * Default: mock provider for tests. Real vendors need PROOFFORGE_PLAGIARISM_PROVIDER + API key.
 */

export function createPlagiarismProvider() {
  const name = String(process.env.PROOFFORGE_PLAGIARISM_PROVIDER || 'off')
    .toLowerCase()
    .trim()
  if (name === 'mock') return new MockPlagiarismProvider()
  if (name === 'http' && process.env.PROOFFORGE_PLAGIARISM_URL) {
    return new HttpPlagiarismProvider({
      url: process.env.PROOFFORGE_PLAGIARISM_URL,
      apiKey: process.env.PROOFFORGE_PLAGIARISM_API_KEY || '',
    })
  }
  return null
}

class MockPlagiarismProvider {
  get id() {
    return 'mock'
  }

  async scan(text) {
    const words = String(text || '').split(/\s+/).filter(Boolean).length
    return {
      provider: 'mock',
      matches: [],
      coverage_note: 'Mock plagiarism provider — no external corpus. Configure a licensed vendor for real checks.',
      words_scanned: words,
      uploaded_externally: false,
    }
  }
}

class HttpPlagiarismProvider {
  constructor({ url, apiKey }) {
    this.url = url
    this.apiKey = apiKey
  }

  get id() {
    return 'http'
  }

  async scan(text) {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ text: String(text || '').slice(0, 200_000) }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data.error || `Plagiarism HTTP ${res.status}`)
      err.code = 'plagiarism_upstream'
      throw err
    }
    return {
      provider: 'http',
      matches: data.matches || [],
      coverage_note: data.coverage_note || 'External plagiarism scan',
      words_scanned: data.words_scanned,
      uploaded_externally: true,
    }
  }
}

export function plagiarismFindings(report) {
  return (report.matches || []).slice(0, 20).map((m, i) => ({
    category: 'consistency',
    subcategory: 'similarity',
    severity: 'needs_verification',
    title: `Possible similar text (${m.score || '?'}%)`,
    explanation: `${m.note || 'Similarity hit from consented plagiarism provider.'} Source: ${m.source || 'unknown'}. Does not prove plagiarism.`,
    original_excerpt: String(m.excerpt || '').slice(0, 200),
    suggested_correction: '',
    reason: `plagiarism:${report.provider}`,
    confidence: Math.min(0.9, Number(m.score || 50) / 100),
    objective: false,
    section_key: m.section_key || '',
    chapter: m.chapter || '',
    id: `plag-${i}`,
  }))
}
