import JSZip from 'jszip'
import { buildBrandedLegalSectionsPdf, buildLegalDocumentPdf } from '@/lib/pdf/renderLegalMarkdown'
import { legalMarkdownToHtml, legalMarkdownToCombinedHtml } from '@/lib/legal/legalHtml'

export const LEGAL_DOC_TYPES = [
  { key: 'impressum', label: 'Impressum', labelDe: 'Impressum' },
  { key: 'datenschutz', label: 'Datenschutzerklaerung', labelDe: 'Datenschutzerklaerung' },
  { key: 'avv', label: 'AVV', labelDe: 'AVV' },
]

const LEGAL_DISCLAIMER =
  'Entwurf zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung Rechtsanwalt konsultieren.'

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

export function exportLegalDraftMarkdown(type, content, businessName = 'legal') {
  downloadTextFile(`${type}_${safeName(businessName)}.md`, content, 'text/markdown;charset=utf-8')
}

export function exportLegalDraftHtml(type, content, businessName = 'legal') {
  downloadTextFile(
    `${type}_${safeName(businessName)}.html`,
    legalMarkdownToHtml(type, content),
    'text/html;charset=utf-8'
  )
}

export function exportLegalDraftPdf(type, content, businessName = 'legal') {
  buildLegalDocumentPdf(type, content, {
    module: 'Website-Rechtliches',
    disclaimer: LEGAL_DISCLAIMER,
  }).save(`${type}_${safeName(businessName)}.pdf`)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

export function exportAllLegalDraftsCombined(drafts, businessName, format = 'md') {
  const sections = LEGAL_DOC_TYPES.filter(({ key }) => drafts[key]).map(({ key, label }) => ({
    title: label,
    content: drafts[key],
  }))
  if (!sections.length) return

  const name = safeName(businessName)

  if (format === 'html') {
    downloadTextFile(
      `Website_Rechtliches_${name}.html`,
      legalMarkdownToCombinedHtml(sections),
      'text/html;charset=utf-8'
    )
    return
  }

  if (format === 'pdf') {
    buildBrandedLegalSectionsPdf(sections, { module: 'Website-Rechtliches', disclaimer: LEGAL_DISCLAIMER }).save(
      `Website_Rechtliches_${name}.pdf`
    )
    return
  }

  const md = sections.map((s) => `# ${s.title}\n\n${s.content}`).join('\n\n---\n\n')
  downloadTextFile(`Website_Rechtliches_${name}.md`, md, 'text/markdown;charset=utf-8')
}

export async function exportAllLegalDraftsZip(drafts, businessName, format = 'md') {
  const zip = new JSZip()
  const folder = zip.folder('Website_Rechtliches')
  const ext = format === 'html' ? 'html' : format === 'pdf' ? 'pdf' : 'md'

  for (const { key, label } of LEGAL_DOC_TYPES) {
    const content = drafts[key]
    if (!content) continue
    const filename = `${label}_${safeName(businessName)}.${ext}`
    if (format === 'html') {
      folder.file(filename, legalMarkdownToHtml(label, content))
    } else if (format === 'pdf') {
      const pdf = buildLegalDocumentPdf(label, content, { disclaimer: LEGAL_DISCLAIMER })
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
