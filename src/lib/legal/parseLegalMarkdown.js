/**
 * Parse legal draft markdown into structured blocks for preview, PDF, and HTML.
 */

function stripInline(md) {
  return String(md || '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .trim()
}

function isBlockStart(line) {
  const t = line.trim()
  if (!t) return false
  return (
    t.startsWith('#') ||
    t.startsWith('**') ||
    t.startsWith('---') ||
    t.startsWith('- ') ||
    t.startsWith('* ') ||
    /^⚠/.test(t) ||
    /entwurf/i.test(t) && /rechtsberatung|legal advice/i.test(t)
  )
}

function parseFieldLine(line) {
  const bold = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/)
  if (bold) {
    return { label: bold[1].replace(/:$/, '').trim(), value: bold[2].trim() }
  }
  const plain = line.match(/^([^:]{2,40}):\s*(.+)$/)
  if (plain && !plain[1].includes('http')) {
    return { label: plain[1].trim(), value: plain[2].trim() }
  }
  return null
}

export function parseLegalMarkdown(text) {
  if (!text) return []
  const blocks = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()
    if (!line) {
      i++
      continue
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: stripInline(line.slice(2)) })
      i++
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: stripInline(line.slice(3)) })
      i++
      continue
    }

    const boldHeading = line.match(/^\*\*(.+?)\*\*$/)
    if (boldHeading) {
      blocks.push({ type: 'h2', text: stripInline(boldHeading[1]) })
      i++
      continue
    }

    if (line.startsWith('---')) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    if (/^⚠/.test(line) || (/entwurf|draft/i.test(line) && /rechtsberatung|legal advice/i.test(line))) {
      blocks.push({ type: 'disclaimer', text: stripInline(line) })
      i++
      continue
    }

    const field = parseFieldLine(line)
    if (field) {
      if (!field.value && i + 1 < lines.length && lines[i + 1].trim() && !isBlockStart(lines[i + 1])) {
        const valueLines = []
        i++
        while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
          valueLines.push(stripInline(lines[i]))
          i++
        }
        field.value = valueLines.join('\n')
      }
      blocks.push({ type: 'field', ...field })
      i++
      continue
    }

    if (line.startsWith('_') && line.endsWith('_') && line.length > 2) {
      blocks.push({ type: 'note', text: stripInline(line) })
      i++
      continue
    }

    if (line.startsWith('(') && line.endsWith(')')) {
      blocks.push({ type: 'note', text: stripInline(line) })
      i++
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(stripInline(lines[i].trim().replace(/^[-*]\s+/, '')))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    const paraLines = [stripInline(line)]
    i++
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      const next = parseFieldLine(lines[i].trim())
      if (next) break
      paraLines.push(stripInline(lines[i]))
      i++
    }
    blocks.push({ type: 'p', text: paraLines.join(' ') })
  }

  return blocks
}

export function legalBlocksToPlainText(blocks) {
  return blocks
    .map((b) => {
      if (b.type === 'field') return `${b.label}: ${b.value}`
      if (b.type === 'list') return b.items.map((it) => `• ${it}`).join('\n')
      return b.text || b.items?.join(', ') || ''
    })
    .filter(Boolean)
    .join('\n\n')
}
