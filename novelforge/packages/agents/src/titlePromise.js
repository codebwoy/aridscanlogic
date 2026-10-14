/**
 * If a title promises a countable deliverable (“50 recipes”, “7 habits”),
 * check outline titles + body for evidence the book delivers that count.
 * Heuristic only — never invents missing items.
 */

const PROMISE_RE =
  /\b(\d{1,3})\s+([A-Za-z][A-Za-z-]{2,}(?:\s+[A-Za-z][A-Za-z-]{2,}){0,2})\b/g

const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'your',
  'our',
  'new',
  'best',
  'top',
  'day',
  'days',
  'week',
  'weeks',
  'month',
  'months',
  'year',
  'years',
  'page',
  'pages',
  'step',
  'steps', // handled separately when paired with numbered list
])

export function extractTitlePromises(title = '', subtitle = '') {
  const text = `${title || ''} ${subtitle || ''}`.trim()
  const out = []
  let m
  const re = new RegExp(PROMISE_RE.source, 'gi')
  while ((m = re.exec(text))) {
    const count = Number(m[1])
    const noun = String(m[2] || '')
      .trim()
      .toLowerCase()
    if (!count || count < 2 || count > 500) continue
    const head = noun.split(/\s+/)[0]
    if (STOP.has(head)) continue
    out.push({
      count,
      noun,
      phrase: m[0],
      source: 'title_or_subtitle',
    })
  }
  // Dedupe by noun
  const seen = new Set()
  return out.filter((p) => {
    const k = `${p.count}:${p.noun}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function collectText(book = {}) {
  const parts = []
  const walk = (nodes) => {
    for (const n of nodes || []) {
      if (n?.title) parts.push(String(n.title))
      if (n?.writing_direction) parts.push(String(n.writing_direction))
      if (n?.children?.length) walk(n.children)
    }
  }
  walk(book.outline?.chapters || [])
  for (const s of Object.values(book.sections || {})) {
    if (s?.title) parts.push(String(s.title))
    if (s?.content_md) parts.push(String(s.content_md))
  }
  if (book.bible?.key_selling_points) {
    parts.push(...(book.bible.key_selling_points || []).map(String))
  }
  return parts.join('\n')
}

/** Count rough occurrences of the noun (singular/plural tolerant). */
export function countNounHits(corpus, noun) {
  const base = String(noun || '')
    .trim()
    .toLowerCase()
    .replace(/s$/, '')
  if (base.length < 3) return 0
  const re = new RegExp(`\\b${escapeRe(base)}s?\\b`, 'gi')
  const matches = String(corpus || '').match(re)
  return matches ? matches.length : 0
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * @returns {{ promises: object[], results: object[], passed: boolean, note: string }}
 */
export function checkTitlePromises(book = {}) {
  const title = book.working_title || book.bible?.title || ''
  const subtitle = book.subtitle || ''
  const promises = extractTitlePromises(title, subtitle)
  if (!promises.length) {
    return {
      promises: [],
      results: [],
      passed: true,
      note: 'No numeric count promise detected in title/subtitle.',
    }
  }
  const corpus = collectText(book)
  const results = promises.map((p) => {
    const hits = countNounHits(corpus, p.noun)
    const ratio = p.count ? hits / p.count : 0
    let status = 'short'
    if (hits >= p.count) status = 'met'
    else if (hits >= Math.ceil(p.count * 0.6)) status = 'partial'
    return {
      ...p,
      hits,
      status,
      message:
        status === 'met'
          ? `Found ~${hits} mentions of “${p.noun}” (≥ ${p.count} promised).`
          : status === 'partial'
            ? `Only ~${hits} of ${p.count} “${p.noun}” evidenced in outline/body — strengthen delivery.`
            : `Title promises ${p.count} ${p.noun}, but outline/body only show ~${hits}. Add missing items before publish.`,
    }
  })
  return {
    promises,
    results,
    passed: results.every((r) => r.status === 'met'),
    note: 'Heuristic count check — verify manually that each promised item is a real deliverable, not just a word mention.',
  }
}
