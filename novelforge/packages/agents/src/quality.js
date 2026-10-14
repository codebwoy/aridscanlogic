import { DEFAULT_BANNED_PHRASES } from '@novelforge/shared'

/** Lightweight quality gates (Phase 4) — no external deps */

export function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function bannedPhraseHits(text, banned = DEFAULT_BANNED_PHRASES) {
  const lower = String(text || '').toLowerCase()
  return banned.filter((p) => lower.includes(String(p).toLowerCase()))
}

export function emDashDensity(text) {
  const t = String(text || '')
  const dashes = (t.match(/—|--/g) || []).length
  const words = wordCount(t) || 1
  return dashes / words
}

export function ngramOverlap(a, b, n = 5) {
  const grams = (text) => {
    const words = String(text || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
    const set = new Set()
    for (let i = 0; i <= words.length - n; i++) {
      set.add(words.slice(i, i + n).join(' '))
    }
    return set
  }
  const A = grams(a)
  const B = grams(b)
  if (!A.size || !B.size) return 0
  let inter = 0
  for (const g of A) if (B.has(g)) inter++
  return inter / Math.min(A.size, B.size)
}

export function sectionQualityReport({ content_md, target_words, banned_phrases }) {
  const wc = wordCount(content_md)
  const banned = bannedPhraseHits(content_md, banned_phrases)
  const dash = emDashDensity(content_md)
  const target = target_words || 800
  const wcOk = wc >= target * 0.7 && wc <= target * 1.25
  const passed = banned.length === 0 && dash < 0.03 && wcOk
  return {
    word_count: wc,
    target_words: target,
    word_count_ok: wcOk,
    banned_hits: banned,
    em_dash_density: Number(dash.toFixed(4)),
    ai_tell_score: Number(Math.min(1, banned.length * 0.2 + dash * 10).toFixed(3)),
    passed,
  }
}

export function extractStorySlots(content_md) {
  const re = /<!--\s*STORY_SLOT:\s*([\s\S]*?)-->/gi
  const slots = []
  let m
  while ((m = re.exec(content_md || ''))) {
    slots.push({ prompt_to_user: m[1].trim(), status: 'pending' })
  }
  return slots
}

export function extractClaimMarkers(content_md) {
  const re = /<!--\s*CLAIM_NEEDED:\s*([\s\S]*?)-->/gi
  const claims = []
  let m
  while ((m = re.exec(content_md || ''))) {
    claims.push({
      text: m[1].trim(),
      type: 'fact',
      verification_status: 'unverified',
    })
  }
  return claims
}
