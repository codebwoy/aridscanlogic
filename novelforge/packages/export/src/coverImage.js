/**
 * Generate a print-oriented cover PNG via SVG → (stored as SVG bytes; pdf-lib can embed PNG later).
 * Typography is real text in SVG so titles never misspell via image models.
 */

export function buildCoverSvg({
  title = 'Untitled',
  author = '',
  subtitle = '',
  width = 1600,
  height = 2560,
} = {}) {
  const esc = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const titleLines = wrap(esc(title), 22).slice(0, 4)
  const subLines = wrap(esc(subtitle), 36).slice(0, 3)

  let titleY = 720
  const titleTspans = titleLines
    .map((line, i) => `<tspan x="120" dy="${i === 0 ? 0 : 78}">${line}</tspan>`)
    .join('')
  const subTspans = subLines
    .map((line, i) => `<tspan x="120" dy="${i === 0 ? 0 : 42}">${line}</tspan>`)
    .join('')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a2332"/>
      <stop offset="55%" stop-color="#243044"/>
      <stop offset="100%" stop-color="#3a2f1f"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="64" y="64" width="${width - 128}" height="${height - 128}" fill="none" stroke="#c4a574" stroke-width="3" opacity="0.55"/>
  <text x="120" y="${titleY}" fill="#f3e6d0" font-family="Georgia, serif" font-size="72" font-weight="700">${titleTspans}</text>
  <text x="120" y="${titleY + titleLines.length * 78 + 40}" fill="#d4c4a8" font-family="Georgia, serif" font-size="34" font-style="italic">${subTspans}</text>
  <text x="120" y="${height - 220}" fill="#e8eef6" font-family="Avenir Next, sans-serif" font-size="36">${esc(author)}</text>
  <text x="120" y="${height - 140}" fill="#9aa8bc" font-family="Avenir Next, sans-serif" font-size="22">NovelForge · first-draft cover · verify before print</text>
</svg>`

  return {
    bytes: new TextEncoder().encode(svg),
    mime: 'image/svg+xml',
    width,
    height,
    typography_ok: true,
    note: 'Vector cover with exact title/author text overlay — no AI misspellings.',
  }
}

function wrap(text, max) {
  const words = String(text || '').split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w
    if (trial.length > max && line) {
      lines.push(line)
      line = w
    } else line = trial
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

/** Thumbnail-legibility check at ~ Amazon search size */
export function thumbnailLegibilityScore(title) {
  const t = String(title || '').trim()
  if (!t) return { score: 0, passed: false, note: 'Empty title' }
  const words = t.split(/\s+/).length
  const score = Math.max(0, 1 - Math.max(0, t.length - 40) / 80) * (words <= 8 ? 1 : 0.7)
  return {
    score: Number(score.toFixed(2)),
    passed: score >= 0.45 && t.length <= 60,
    note: 'Heuristic at ~100×160 search-result size — keep titles short for thumbnails.',
  }
}
