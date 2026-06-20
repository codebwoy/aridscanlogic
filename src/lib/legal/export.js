import JSZip from 'jszip'
import { buildBrandedSectionsPdf } from '@/lib/pdf/brandedPdf'
import { BRAND_SUITE_NAME } from '@/lib/brand'

export const LEGAL_DOC_TYPES = [
  { key: 'impressum', label: 'Impressum', labelDe: 'Impressum' },
  { key: 'datenschutz', label: 'Datenschutzerklaerung', labelDe: 'Datenschutzerklaerung' },
  { key: 'avv', label: 'AVV', labelDe: 'AVV' },
]

function safeName(businessName = 'legal') {
  return businessName.replace(/\s+/g, '_').slice(0, 40)
}

export function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function brandedHtmlStyles() {
  return `
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem 3rem; line-height: 1.6; color: #1e293b; background: #f8fafc; }
    .brand-header { background: linear-gradient(135deg, #312e81 0%, #4338ca 50%, #4f46e5 100%); color: #fff; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0; margin: -1rem -1rem 1.5rem; }
    .brand-header h2 { margin: 0; font-size: 0.75rem; font-weight: 600; opacity: 0.9; letter-spacing: 0.04em; text-transform: uppercase; }
    .brand-header h1 { margin: 0.35rem 0 0; font-size: 1.35rem; font-weight: 700; }
    h1.doc-title { color: #4338ca; font-size: 1.25rem; border-bottom: 2px solid #6366f1; padding-bottom: 0.35rem; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #64748b; border-top: 1px solid #c7d2fe; padding-top: 0.75rem; }
  `
}

export function exportLegalDraftMarkdown(type, content, businessName = 'legal') {
  downloadTextFile(`${type}_${safeName(businessName)}.md`, content, 'text/markdown;charset=utf-8')
}

export function exportLegalDraftHtml(type, content, businessName = 'legal') {
  const html = buildSingleHtmlPage(type, content)
  downloadTextFile(`${type}_${safeName(businessName)}.html`, html, 'text/html;charset=utf-8')
}

function escapeHtml(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildSingleHtmlPage(title, content) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${BRAND_SUITE_NAME}</title>
  <style>${brandedHtmlStyles()}</style>
</head>
<body>
  <div class="brand-header">
    <h2>${BRAND_SUITE_NAME}</h2>
    <h1>${title}</h1>
  </div>
  <pre>${escapeHtml(content)}</pre>
  <p class="footer">Entwurf zur Vorbereitung — keine Rechtsberatung. ${BRAND_SUITE_NAME}</p>
</body>
</html>`
}

export function exportLegalDraftPdf(type, content, businessName = 'legal') {
  const pdf = buildBrandedSectionsPdf([{ title: type, content }], {
    module: 'Website-Rechtliches',
    disclaimer: 'Entwurf zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung Rechtsanwalt konsultieren.',
  })
  pdf.save(`${type}_${safeName(businessName)}.pdf`)
}

function buildPdfFromSections(sections) {
  return buildBrandedSectionsPdf(
    sections.map((s) => ({ title: s.title, content: s.content })),
    { module: 'Website-Rechtliches' }
  )
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Download each document as its own file (staggered to avoid browser blocking). */
export async function exportAllLegalDraftsSeparate(drafts, businessName, format = 'md') {
  const items = LEGAL_DOC_TYPES.filter(({ key }) => drafts[key])
  for (let i = 0; i < items.length; i++) {
    const { key, label } = items[i]
    const content = drafts[key]
    if (format === 'html') exportLegalDraftHtml(label, content, businessName)
    else if (format === 'pdf') exportLegalDraftPdf(label, content, businessName)
    else exportLegalDraftMarkdown(label, content, businessName)
    if (i < items.length - 1) await delay(400)
  }
}

/** One file containing all three documents. */
export function exportAllLegalDraftsCombined(drafts, businessName, format = 'md') {
  const sections = LEGAL_DOC_TYPES.filter(({ key }) => drafts[key]).map(({ key, label }) => ({
    title: label,
    content: drafts[key],
  }))
  if (!sections.length) return

  const name = safeName(businessName)

  if (format === 'html') {
    const body = sections
      .map(
        (s) =>
          `<section style="margin-bottom:2.5rem"><h1 class="doc-title">${s.title}</h1><pre>${escapeHtml(s.content)}</pre></section>`
      )
      .join('\n')
    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Website-Rechtliches — ${name}</title>
  <style>${brandedHtmlStyles()}</style>
</head>
<body>
  <div class="brand-header">
    <h2>${BRAND_SUITE_NAME}</h2>
    <h1>Website-Rechtliches</h1>
  </div>
${body}
  <p class="footer">Entwurf zur Vorbereitung — keine Rechtsberatung.</p>
</body>
</html>`
    downloadTextFile(`Website_Rechtliches_${name}.html`, html, 'text/html;charset=utf-8')
    return
  }

  if (format === 'pdf') {
    const pdf = buildPdfFromSections(sections)
    pdf.save(`Website_Rechtliches_${name}.pdf`)
    return
  }

  const md = sections.map((s) => `# ${s.title}\n\n${s.content}`).join('\n\n---\n\n')
  downloadTextFile(`Website_Rechtliches_${name}.md`, md, 'text/markdown;charset=utf-8')
}

/** ZIP archive with one file per document. */
export async function exportAllLegalDraftsZip(drafts, businessName, format = 'md') {
  const zip = new JSZip()
  const folder = zip.folder('Website_Rechtliches')
  const ext = format === 'html' ? 'html' : format === 'pdf' ? 'pdf' : 'md'

  for (const { key, label } of LEGAL_DOC_TYPES) {
    const content = drafts[key]
    if (!content) continue
    const filename = `${label}_${safeName(businessName)}.${ext}`
    if (format === 'html') {
      folder.file(filename, buildSingleHtmlPage(label, content))
    } else if (format === 'pdf') {
      const pdf = buildPdfFromSections([{ title: label, content }])
      folder.file(filename, pdf.output('arraybuffer'))
    } else {
      folder.file(filename, content)
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(`Website_Rechtliches_${safeName(businessName)}.zip`, blob)
}

/** @deprecated use exportAllLegalDraftsSeparate */
export function exportAllLegalDrafts(drafts, businessName, format = 'md') {
  exportAllLegalDraftsSeparate(drafts, businessName, format)
}
