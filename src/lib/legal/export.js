import { jsPDF } from 'jspdf'
import JSZip from 'jszip'

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

function escapeHtml(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function exportLegalDraftMarkdown(type, content, businessName = 'legal') {
  downloadTextFile(`${type}_${safeName(businessName)}.md`, content, 'text/markdown;charset=utf-8')
}

export function exportLegalDraftHtml(type, content, businessName = 'legal') {
  const html = buildSingleHtmlPage(type, content)
  downloadTextFile(`${type}_${safeName(businessName)}.html`, html, 'text/html;charset=utf-8')
}

function buildSingleHtmlPage(title, content) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1e293b; }
    h1 { font-size: 1.5rem; } h2 { font-size: 1.1rem; margin-top: 1.5rem; }
    pre { white-space: pre-wrap; font-family: inherit; }
  </style>
</head>
<body>
<pre>${escapeHtml(content)}</pre>
</body>
</html>`
}

export function exportLegalDraftPdf(type, content, businessName = 'legal') {
  const pdf = buildPdfFromSections([{ title: type, content }])
  pdf.save(`${type}_${safeName(businessName)}.pdf`)
}

function buildPdfFromSections(sections) {
  const pdf = new jsPDF()
  sections.forEach((sec, idx) => {
    if (idx > 0) pdf.addPage()
    pdf.setFontSize(14)
    pdf.text(sec.title, 20, 20)
    pdf.setFontSize(9)
    const lines = pdf.splitTextToSize(sec.content, 170)
    let y = 30
    lines.forEach((line) => {
      if (y > 280) {
        pdf.addPage()
        y = 20
      }
      pdf.text(line, 20, y)
      y += 5
    })
  })
  return pdf
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
          `<section style="margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid #e2e8f0"><h1>${s.title}</h1><pre>${escapeHtml(s.content)}</pre></section>`
      )
      .join('\n')
    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Website-Rechtliches — ${name}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1e293b; }
    h1 { font-size: 1.35rem; } pre { white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; }
  </style>
</head>
<body>
<h1 style="font-size:1.75rem;margin-bottom:2rem">Website-Rechtliches</h1>
${body}
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
