/**
 * Branded HTML rendering for legal document drafts.
 */

import { BRAND_SUITE_NAME } from '@/lib/brand'
import { parseLegalMarkdown } from '@/lib/legal/parseLegalMarkdown'

export function brandedHtmlStyles() {
  return `
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 720px; margin: 0 auto; padding: 0 0 2.5rem;
      line-height: 1.55; color: #1e293b; background: #f1f5f9;
    }
    .brand-header {
      background: linear-gradient(135deg, #312e81 0%, #4338ca 55%, #4f46e5 100%);
      color: #fff; padding: 1.35rem 1.75rem; margin-bottom: 0;
    }
    .brand-header .suite { margin: 0; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.92; }
    .brand-header .module { margin: 0.15rem 0 0; font-size: 0.8rem; opacity: 0.85; }
    .brand-header .date { float: right; font-size: 0.75rem; opacity: 0.9; margin-top: -2.2rem; }
    .doc-sheet {
      background: #fff; margin: 0 1rem; padding: 1.75rem 1.75rem 2rem;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 24px rgba(49, 46, 129, 0.08);
      border: 1px solid #e2e8f0; border-top: 3px solid #6366f1;
    }
    .doc-title { margin: 0 0 1rem; font-size: 1.5rem; font-weight: 700; color: #312e81; letter-spacing: -0.02em; }
    .disclaimer {
      background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px;
      padding: 0.75rem 1rem; font-size: 0.8rem; color: #4338ca; margin-bottom: 1.25rem;
    }
    .section-title {
      margin: 1.25rem 0 0.65rem; padding-bottom: 0.35rem;
      font-size: 0.85rem; font-weight: 700; color: #4338ca;
      text-transform: uppercase; letter-spacing: 0.04em;
      border-bottom: 2px solid #6366f1; display: inline-block; min-width: 40%;
    }
    .field-grid { display: grid; gap: 0.5rem; margin: 0.5rem 0 1rem; }
    .field-row {
      display: grid; grid-template-columns: 9.5rem 1fr; gap: 0.75rem; align-items: start;
      padding: 0.55rem 0.75rem; border-radius: 6px; font-size: 0.9rem;
    }
    .field-row:nth-child(odd) { background: #f8fafc; }
    .field-row:nth-child(even) { background: #eef2ff; }
    .field-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em; padding-top: 0.1rem; }
    .field-value { color: #1e293b; font-weight: 500; word-break: break-word; }
    p.body { margin: 0.5rem 0; font-size: 0.9rem; color: #334155; }
    ul.legal-list { margin: 0.5rem 0 1rem; padding-left: 1.25rem; color: #334155; font-size: 0.9rem; }
    ul.legal-list li { margin: 0.25rem 0; }
    hr.divider { border: none; border-top: 1px solid #c7d2fe; margin: 1.25rem 0; }
    .note { font-size: 0.8rem; color: #64748b; font-style: italic; margin-top: 1rem; }
    .footer {
      margin: 1.5rem 1rem 0; font-size: 0.72rem; color: #64748b;
      border-top: 1px solid #c7d2fe; padding-top: 0.75rem; text-align: center;
    }
    @media print { body { background: #fff; } .doc-sheet { box-shadow: none; margin: 0; border-radius: 0; } }
  `
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function legalMarkdownToHtml(title, markdown, { module } = {}) {
  const blocks = parseLegalMarkdown(markdown)
  const h1 = blocks.find((b) => b.type === 'h1')
  const docTitle = title || h1?.text || 'Document'
  const parts = []
  let fieldBuffer = []

  const flushFields = () => {
    if (!fieldBuffer.length) return
    parts.push('<div class="field-grid">')
    fieldBuffer.forEach(({ label, value }) => {
      parts.push(
        `<div class="field-row"><div class="field-label">${escapeHtml(label)}</div><div class="field-value">${escapeHtml(value).replace(/\n/g, '<br/>')}</div></div>`
      )
    })
    parts.push('</div>')
    fieldBuffer = []
  }

  blocks.forEach((block) => {
    if (block.type === 'h1' && block.text === docTitle) return

    switch (block.type) {
      case 'disclaimer':
        flushFields()
        parts.push(`<div class="disclaimer">${escapeHtml(block.text)}</div>`)
        break
      case 'h1':
      case 'h2':
        flushFields()
        parts.push(`<h2 class="section-title">${escapeHtml(block.text)}</h2>`)
        break
      case 'field':
        fieldBuffer.push(block)
        break
      case 'list':
        flushFields()
        parts.push(`<ul class="legal-list">${block.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}</ul>`)
        break
      case 'hr':
        flushFields()
        parts.push('<hr class="divider" />')
        break
      case 'note':
        flushFields()
        parts.push(`<p class="note">${escapeHtml(block.text)}</p>`)
        break
      case 'p':
      default:
        flushFields()
        parts.push(`<p class="body">${escapeHtml(block.text)}</p>`)
        break
    }
  })
  flushFields()

  const date = new Date().toLocaleDateString('de-DE')
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(docTitle)} — ${BRAND_SUITE_NAME}</title>
  <style>${brandedHtmlStyles()}</style>
</head>
<body>
  <div class="brand-header">
    <span class="date">${date}</span>
    <p class="suite">${BRAND_SUITE_NAME}</p>
    <p class="module">${escapeHtml(module || 'Website-Rechtliches')}</p>
  </div>
  <div class="doc-sheet">
    <h1 class="doc-title">${escapeHtml(docTitle)}</h1>
    ${parts.join('\n')}
  </div>
  <p class="footer">Entwurf zur Vorbereitung — keine Rechtsberatung. ${BRAND_SUITE_NAME}</p>
</body>
</html>`
}

export function legalMarkdownToBodyFragment(markdown) {
  const blocks = parseLegalMarkdown(markdown)
  const h1 = blocks.find((b) => b.type === 'h1')
  const parts = []
  let fieldBuffer = []

  const flushFields = () => {
    if (!fieldBuffer.length) return
    parts.push('<div class="field-grid">')
    fieldBuffer.forEach(({ label, value }) => {
      parts.push(
        `<div class="field-row"><div class="field-label">${escapeHtml(label)}</div><div class="field-value">${escapeHtml(value).replace(/\n/g, '<br/>')}</div></div>`
      )
    })
    parts.push('</div>')
    fieldBuffer = []
  }

  blocks.forEach((block) => {
    if (block.type === 'h1' && block.text === h1?.text) return
    switch (block.type) {
      case 'disclaimer':
        flushFields()
        parts.push(`<div class="disclaimer">${escapeHtml(block.text)}</div>`)
        break
      case 'h1':
      case 'h2':
        flushFields()
        parts.push(`<h2 class="section-title">${escapeHtml(block.text)}</h2>`)
        break
      case 'field':
        fieldBuffer.push(block)
        break
      case 'list':
        flushFields()
        parts.push(`<ul class="legal-list">${block.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}</ul>`)
        break
      case 'hr':
        flushFields()
        parts.push('<hr class="divider" />')
        break
      case 'note':
        flushFields()
        parts.push(`<p class="note">${escapeHtml(block.text)}</p>`)
        break
      default:
        flushFields()
        parts.push(`<p class="body">${escapeHtml(block.text)}</p>`)
        break
    }
  })
  flushFields()
  return parts.join('\n')
}

export function legalMarkdownToCombinedHtml(sections, bundleTitle = 'Website-Rechtliches') {
  const date = new Date().toLocaleDateString('de-DE')
  const bodyParts = sections.map((sec) => {
    const fragment = legalMarkdownToBodyFragment(sec.content)
    return `<section style="margin-bottom:2.5rem;padding-bottom:2rem;border-bottom:1px solid #c7d2fe"><h1 class="doc-title">${escapeHtml(sec.title)}</h1>${fragment}</section>`
  })

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(bundleTitle)} — ${BRAND_SUITE_NAME}</title>
  <style>${brandedHtmlStyles()}</style>
</head>
<body>
  <div class="brand-header">
    <span class="date">${date}</span>
    <p class="suite">${BRAND_SUITE_NAME}</p>
    <p class="module">${escapeHtml(bundleTitle)}</p>
  </div>
  <div class="doc-sheet">
    ${bodyParts.join('\n')}
  </div>
  <p class="footer">Entwurf zur Vorbereitung — keine Rechtsberatung. ${BRAND_SUITE_NAME}</p>
</body>
</html>`
}
