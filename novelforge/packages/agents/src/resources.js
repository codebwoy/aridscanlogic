import { createHash } from 'node:crypto'

/** Untrusted resource ingestion — never treat content as instructions */

const INSTRUCTION_PATTERNS =
  /^\s*(ignore (all )?previous|system prompt|you are now|act as|developer message)\b/i

export function neutralizeUntrustedText(text) {
  return String(text || '')
    .split('\n')
    .map((line) => (INSTRUCTION_PATTERNS.test(line) ? `[neutralized] ${line}` : line))
    .join('\n')
}

export function chunkResource({ id, text, must_cover = false, maxChars = 700 }) {
  const clean = neutralizeUntrustedText(text)
  const parts = []
  const paras = clean.split(/\n\n+/).filter(Boolean)
  let buf = ''
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > maxChars && buf) {
      parts.push(buf.trim())
      buf = p
    } else buf = buf ? `${buf}\n\n${p}` : p
  }
  if (buf.trim()) parts.push(buf.trim())
  return parts.map((content, i) => ({
    id: `${id}:${i}`,
    resource_id: id,
    content,
    must_cover,
    embedding: hashEmbed(content),
  }))
}

/** Lightweight bag-of-words hash embedding for offline retrieval (no pgvector required) */
export function hashEmbed(text, dims = 32) {
  const vec = new Array(dims).fill(0)
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2)
  for (const t of tokens) {
    const h = createHash('sha256').update(t).digest()
    const idx = h[0] % dims
    vec[idx] += 1
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => Number((v / norm).toFixed(6)))
}

export function cosineSim(a = [], b = []) {
  const n = Math.min(a.length, b.length)
  let dot = 0
  for (let i = 0; i < n; i++) dot += a[i] * b[i]
  return dot
}

export function retrieveChunks(chunks, query, { topK = 4 } = {}) {
  const q = hashEmbed(query)
  return [...(chunks || [])]
    .map((c) => ({ ...c, score: cosineSim(q, c.embedding || []) + (c.must_cover ? 0.05 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
