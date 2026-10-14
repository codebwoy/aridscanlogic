import { extractClaimMarkers } from './quality.js'
import { createSearchProvider } from './search.js'

const STAT_RE =
  /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:percent|million|billion|thousand))\b/gi
const YEAR_FACT_RE =
  /\b((?:in|since|by)\s+(?:19|20)\d{2}\b[^.]{0,80})/gi
const STUDY_RE = /\b((?:study|research|survey|report)\s+(?:by|from|in)\s+[A-Z][^.]{0,100})/g

/**
 * Extract atomic claim candidates from prose (heuristics — LLM may add more).
 * Never invents citations.
 */
export function extractClaimsFromText(content_md, sectionKey = '') {
  const text = String(content_md || '')
  const found = []
  const push = (raw, type) => {
    const t = String(raw || '').trim()
    if (t.length < 12) return
    if (found.some((c) => c.text === t)) return
    found.push({
      text: t,
      type,
      section_key: sectionKey,
      verification_status: 'unverified',
      evidence: [],
      source_url: null,
    })
  }

  for (const m of extractClaimMarkers(text)) {
    push(m.text, m.type || 'fact')
  }
  let m
  while ((m = STAT_RE.exec(text))) {
    const start = Math.max(0, m.index - 40)
    const end = Math.min(text.length, m.index + m[0].length + 60)
    push(text.slice(start, end).replace(/\s+/g, ' '), 'statistic')
  }
  while ((m = YEAR_FACT_RE.exec(text))) push(m[1], 'historical')
  while ((m = STUDY_RE.exec(text))) push(m[1], 'study')

  return found
}

/**
 * Run search per claim. Mock provider NEVER upgrades status to verified.
 */
export async function factCheckClaims(claims, { searchProvider, resolveUrls = true } = {}) {
  const search = searchProvider || createSearchProvider()
  const out = []
  for (const claim of claims) {
    const hit = await search.search(claim.text)
    const evidence = (hit.results || []).slice(0, 3).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      quoted: false,
    }))
    let status = 'unverified'
    if (search.id !== 'mock' && evidence.length) {
      // Live search only suggests candidates — still requires user confirm or span match
      status = 'unverified'
    }
    let resolved = []
    if (resolveUrls && search.id !== 'mock') {
      resolved = await Promise.all(
        evidence.map(async (e) => ({
          ...e,
          http_ok: await headOk(e.url),
        }))
      )
    } else {
      resolved = evidence.map((e) => ({ ...e, http_ok: null }))
    }
    out.push({
      ...claim,
      verification_status: status,
      evidence: resolved,
      search_provider: hit.provider,
      fetched_at: hit.fetchedAt,
      note:
        search.id === 'mock'
          ? 'UNVERIFIED — mock search cannot confirm claims. Confirm manually or connect Tavily/Brave.'
          : 'UNVERIFIED — review evidence spans; mark user_confirmed only if you verified the source.',
    })
  }
  return {
    claims: out,
    passed: out.every((c) => c.verification_status === 'verified' || c.verification_status === 'user_confirmed'),
    provider: search.id,
  }
}

async function headOk(url) {
  try {
    const u = new URL(url)
    if (!['http:', 'https:'].includes(u.protocol)) return false
    if (['localhost', '127.0.0.1'].includes(u.hostname)) return false
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return res.ok
  } catch {
    return false
  }
}

/** Qualitative rewrite helper (no fabricated numbers) */
export function rewriteClaimQualitatively(claimText) {
  const t = String(claimText || '').replace(/\d+(?:\.\d+)?%?/g, 'a meaningful share')
  return `Many practitioners report that ${t.replace(/^(in|since|by)\s+/i, '').trim()} — verify with a primary source before stating a precise figure.`
}

const SWEEPING_RE =
  /\b(always|never|everyone|nobody|guaranteed|proven to|scientifically proven|outperforms?\s+all|the\s+only\s+way|must\s+always)\b/i

/**
 * Flag absolute / sweeping claims and suggest milder wording (no invented stats).
 */
export function flagSweepingClaims(content_md = '') {
  const text = String(content_md || '')
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20)
  const flagged = []
  for (const s of sentences) {
    if (!SWEEPING_RE.test(s)) continue
    const milder = s
      .replace(/\balways\b/gi, 'often')
      .replace(/\bnever\b/gi, 'rarely')
      .replace(/\beveryone\b/gi, 'many people')
      .replace(/\bnobody\b/gi, 'few people')
      .replace(/\bguaranteed\b/gi, 'more likely')
      .replace(/\bscientifically proven\b/gi, 'widely discussed in research (verify)')
      .replace(/\bproven to\b/gi, 'associated with')
      .replace(/\boutperforms?\s+all\b/gi, 'can outperform many')
      .replace(/\bthe\s+only\s+way\b/gi, 'one effective way')
      .replace(/\bmust\s+always\b/gi, 'usually should')
    flagged.push({
      text: s.trim(),
      type: 'sweeping',
      milder: milder.trim(),
      note: 'Sweeping absolute — soften unless you have a primary source.',
    })
  }
  return flagged
}
