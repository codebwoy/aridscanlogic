/**
 * Parse legal markdown drafts into structured blocks for preview, HTML, and PDF.
 */

function stripInline(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .trim()
}

export function parseLegalMarkdown(raw = '') {
  const blocks = []
  const lines = raw.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) {
      i++
      continue
    }

    if (line.startsWith('⚠') || /^Draft for preparation/i.test(line) || /^Entwurf zur Vorbereitung/i.test(line)) {
      blocks.push({ type: 'disclaimer', text: stripInline(line) })
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

    if (line === '---') {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    if (line.startsWith('_') && line.endsWith('_')) {
      blocks.push({ type: 'hint', text: stripInline(line) })
      i++
      continue
    }

    const inlineField = line.match(/^\*\*(.+?):\*\*\s*(.*)$/)
    if (inlineField) {
      blocks.push({ type: 'field', label: inlineField[1], value: inlineField[2] || '—' })
      i++
      continue
    }

    const boldOnly = line.match(/^\*\*(.+?)\*\*$/)
    if (boldOnly) {
      const label = boldOnly[1].replace(/:$/, '')
      const next = lines[i + 1]?.trim()
      if (next && !next.startsWith('#') && next !== '---') {
        blocks.push({ type: 'field', label, value: stripInline(next) })
        i += 2
        continue
      }
      blocks.push({ type: 'h3', text: label })
      i++
      continue
    }

    const kv = line.match(/^([^:]+):\s*(.+)$/)
    if (kv && kv[1].length < 40 && !line.startsWith('http')) {
      blocks.push({ type: 'field', label: kv[1].trim(), value: kv[2].trim() })
      i++
      continue
    }

    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(stripInline(lines[i].trim().slice(2)))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    blocks.push({ type: 'paragraph', text: stripInline(line) })
    i++
  }

  return blocks
}

export function legalDocumentStyles() {
  return `
    .legal-doc { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #1e293b; line-height: 1.65; }
    .legal-doc .disclaimer { background: linear-gradient(135deg, #eef2ff, #e0e7ff); border: 1px solid #c7d2fe; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #4338ca; margin-bottom: 1.5rem; }
    .legal-doc h2 { color: #4338ca; font-size: 1rem; font-weight: 700; margin: 1.25rem 0 0.75rem; padding-bottom: 0.35rem; border-bottom: 2px solid #6366f1; }
    .legal-doc h3 { color: #4f46e5; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 1rem 0 0.5rem; }
    .legal-doc .field-grid { display: grid; gap: 0.5rem; margin: 0.75rem 0; }
    .legal-doc .field { display: grid; grid-template-columns: 9rem 1fr; gap: 0.75rem; padding: 0.55rem 0.75rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; }
    .legal-doc .field:nth-child(even) { background: #eef2ff; border-color: #c7d2fe; }
    .legal-doc .field-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; }
    .legal-doc .field-value { font-size: 0.9rem; color: #1e293b; }
    .legal-doc p { margin: 0.5rem 0; font-size: 0.9rem; color: #334155; }
    .legal-doc ul { margin: 0.5rem 0; padding-left: 1.25rem; font-size: 0.9rem; color: #334155; }
    .legal-doc .hint { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px dashed #c7d2fe; font-size: 0.8rem; color: #64748b; font-style: italic; }
    .legal-doc hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.25rem 0; }
  `
}

export function blocksToHtml(blocks, { skipH1 } = {}) {
  const parts = ['<div class="legal-doc">']

  blocks.forEach((b) => {
    switch (b.type) {
      case 'disclaimer':
        parts.push(`<div class="disclaimer">${escapeHtml(b.text)}</div>`)
        break
      case 'h1':
        if (!skipH1) parts.push(`<h1 style="font-size:1.35rem;color:#312e81;margin:0 0 1rem">${escapeHtml(b.text)}</h1>`)
        break
      case 'h2':
        parts.push(`<h2>${escapeHtml(b.text)}</h2>`)
        break
      case 'h3':
        parts.push(`<h3>${escapeHtml(b.text)}</h3>`)
        break
      case 'field':
        parts.push(
          `<div class="field"><div class="field-label">${escapeHtml(b.label)}</div><div class="field-value">${escapeHtml(b.value)}</div></div>`
        )
        break
      case 'paragraph':
        parts.push(`<p>${escapeHtml(b.text)}</p>`)
        break
      case 'list':
        parts.push(`<ul>${b.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}</ul>`)
        break
      case 'hint':
        parts.push(`<p class="hint">${escapeHtml(b.text)}</p>`)
        break
      case 'hr':
        parts.push('<hr />')
        break
      default:
        break
    }
  })

  parts.push('</div>')
  return parts.join('\n')
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function legalMarkdownToHtml(content, options = {}) {
  const blocks = parseLegalMarkdown(content)
  return blocksToHtml(blocks, options)
}

/** Group consecutive field blocks for grid wrapper in HTML */
export function blocksToHtmlGrouped(blocks, options = {}) {
  const blocksWithGrids = []
  let fieldBatch = []

  const flushFields = () => {
    if (fieldBatch.length) {
      blocksWithGrids.push({ type: 'fieldGrid', fields: fieldBatch })
      fieldBatch = []
    }
  }

  blocks.forEach((b) => {
    if (b.type === 'field') {
      fieldBatch.push(b)
    } else {
      flushFields()
      blocksWithGrids.push(b)
    }
  })
  flushFields()

  const parts = ['<div class="legal-doc">']
  blocksWithGrids.forEach((b) => {
    if (b.type === 'fieldGrid') {
      parts.push('<div class="field-grid">')
      b.fields.forEach((f, i) => {
        parts.push(
          `<div class="field" style="${i % 2 ? 'background:#eef2ff;border-color:#c7d2fe' : ''}"><div class="field-label">${escapeHtml(f.label)}</div><div class="field-value">${escapeHtml(f.value)}</div></div>`
        )
      })
      parts.push('</div>')
      return
    }
    parts.push(blocksToHtml([b], options).replace(/^<div class="legal-doc">|<\/div>$/g, ''))
  })
  parts.push('</div>')
  return parts.join('\n')
}

export function legalMarkdownToHtmlGrouped(content, options = {}) {
  return blocksToHtmlGrouped(parseLegalMarkdown(content), options)
}
