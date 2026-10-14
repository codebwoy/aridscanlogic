/**
 * Import plain text / Markdown manuscripts into NovelForge outline + sections.
 * Heuristic chapter detection — preview structure; never invents content.
 */

const CHAPTER_RE =
  /^(?:#{1,3}\s+|chapter\s+\d+[.:)\s-]*|teil\s+\d+[.:)\s-]*|kapitel\s+\d+[.:)\s-]*)(.+)$/i

/**
 * Split manuscript text into chapter blocks.
 * @returns {{ chapters: Array<{ title: string, writing_direction: string, target_words: number, children: [], body: string }>, warnings: string[] }}
 */
export function parseManuscriptText(raw, { defaultTargetWords = 800 } = {}) {
  const text = String(raw || '').replace(/\r\n/g, '\n').trim()
  const warnings = []
  if (!text) {
    return { chapters: [], warnings: ['Empty manuscript'] }
  }

  const lines = text.split('\n')
  const blocks = []
  let current = null

  const push = () => {
    if (!current) return
    const body = current.lines.join('\n').trim()
    if (!current.title && !body) return
    blocks.push({
      title: current.title || `Untitled section ${blocks.length + 1}`,
      body,
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const m = trimmed.match(CHAPTER_RE)
    if (m) {
      push()
      current = { title: String(m[1] || trimmed).replace(/^#+\s*/, '').trim(), lines: [] }
      continue
    }
    // All-caps short line as chapter title
    if (
      trimmed.length >= 4 &&
      trimmed.length <= 80 &&
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed) &&
      !trimmed.includes('.')
    ) {
      push()
      current = { title: trimmed.replace(/\s+/g, ' '), lines: [] }
      continue
    }
    if (!current) current = { title: 'Introduction', lines: [] }
    current.lines.push(line)
  }
  push()

  if (blocks.length === 1 && blocks[0].body.split(/\n\n+/).length > 4) {
    // No headings found — split on blank-line paragraphs into pseudo-chapters of ~3 paras
    warnings.push('No clear chapter headings found — split by paragraph groups. Review titles.')
    const paras = blocks[0].body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    const regrouped = []
    for (let i = 0; i < paras.length; i += 3) {
      const chunk = paras.slice(i, i + 3)
      const firstLine = chunk[0].split('\n')[0].slice(0, 60)
      regrouped.push({
        title: `Section ${regrouped.length + 1}: ${firstLine}${firstLine.length >= 60 ? '…' : ''}`,
        body: chunk.join('\n\n'),
      })
    }
    blocks.length = 0
    blocks.push(...regrouped)
  }

  const chapters = blocks.map((b, i) => {
    const words = b.body.split(/\s+/).filter(Boolean).length
    return {
      level: 'chapter',
      title: b.title,
      writing_direction: `Imported chapter ${i + 1}. Preserve author voice; edit rather than invent.`,
      target_words: Math.max(defaultTargetWords, words || defaultTargetWords),
      focus_tags: [],
      children: [],
      body: b.body,
      word_count: words,
    }
  })

  if (chapters.length > 40) {
    warnings.push(`Detected ${chapters.length} chapters — consider merging short ones.`)
  }

  return { chapters, warnings }
}

/** Build outline + sections map from parsed chapters. */
export function manuscriptToBookPatch(parsed, { prefix = 'import' } = {}) {
  const chapters = (parsed.chapters || []).map(({ body: _b, word_count: _w, ...outlineNode }) => outlineNode)
  const sections = {}
  ;(parsed.chapters || []).forEach((ch, i) => {
    const key = `${prefix}.c${i}`
    sections[key] = {
      outline_path: key,
      title: ch.title,
      content_md: ch.body || '',
      word_count: ch.word_count || 0,
      version: 1,
      status: 'imported',
      quality: { word_count: ch.word_count || 0, passed: true, notes: ['Imported manuscript'] },
      versions: [{ version: 1, content_md: ch.body || '', at: new Date().toISOString(), note: 'import' }],
    }
  })
  return {
    outline: {
      chapters,
      note: 'Imported from manuscript — review structure before regenerating.',
      coverage: { passed: true, uncovered: [] },
    },
    sections,
    status: 'writing',
    wizard_step: 'writing',
    chapter_count: chapters.length,
  }
}
