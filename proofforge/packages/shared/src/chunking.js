/** Context-aware manuscript chunking for long books */

const DEFAULT_MAX_CHARS = 6_000

/**
 * Split a section into overlapping chunks without cutting mid-sentence when possible.
 * @param {string} text
 * @param {{ maxChars?: number, overlap?: number }} [opts]
 */
export function chunkText(text, opts = {}) {
  const maxChars = opts.maxChars || DEFAULT_MAX_CHARS
  const overlap = opts.overlap ?? 200
  const raw = String(text || '')
  if (!raw.trim()) return []
  if (raw.length <= maxChars) {
    return [{ index: 0, text: raw, start: 0, end: raw.length }]
  }

  const chunks = []
  let start = 0
  let index = 0
  while (start < raw.length) {
    let end = Math.min(raw.length, start + maxChars)
    if (end < raw.length) {
      const window = raw.slice(start, end)
      const lastBreak = Math.max(
        window.lastIndexOf('\n\n'),
        window.lastIndexOf('. '),
        window.lastIndexOf('! '),
        window.lastIndexOf('? '),
        window.lastIndexOf('.\n')
      )
      if (lastBreak > maxChars * 0.4) {
        end = start + lastBreak + 1
      }
    }
    const slice = raw.slice(start, end)
    chunks.push({ index, text: slice, start, end })
    index += 1
    if (end >= raw.length) break
    start = Math.max(0, end - overlap)
  }
  return chunks
}

/**
 * Build sections from freeform manuscript (split on chapter headings when present).
 * @param {string} manuscript
 */
export function detectSections(manuscript) {
  const text = String(manuscript || '').replace(/\r\n/g, '\n')
  if (!text.trim()) return []

  const headingRe = /^(?:#{1,3}\s+|(?:chapter|kapitel|chapitre|capítulo|capitolo|hoofdstuk)\s+\d+[:.\s-]|teil\s+\d+)/im
  const lines = text.split('\n')
  const sections = []
  let current = { key: 'section_1', title: 'Section 1', lines: [] }
  let sectionNum = 1

  for (const line of lines) {
    if (headingRe.test(line.trim()) && current.lines.join('\n').trim().length > 80) {
      sections.push({
        key: current.key,
        title: current.title,
        content_md: current.lines.join('\n').trim(),
      })
      sectionNum += 1
      current = {
        key: `section_${sectionNum}`,
        title: line.replace(/^#+\s*/, '').trim().slice(0, 120) || `Section ${sectionNum}`,
        lines: [line],
      }
    } else {
      if (!current.lines.length && line.trim()) {
        const t = line.replace(/^#+\s*/, '').trim()
        if (t.length < 80) current.title = t
      }
      current.lines.push(line)
    }
  }
  if (current.lines.join('\n').trim()) {
    sections.push({
      key: current.key,
      title: current.title,
      content_md: current.lines.join('\n').trim(),
    })
  }
  return sections.map((s) => ({
    ...s,
    word_count: s.content_md.split(/\s+/).filter(Boolean).length,
  }))
}
