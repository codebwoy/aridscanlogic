/**
 * Render parsed legal markdown blocks to branded PDF.
 */

import { createBrandedPdf, applyBrandedFooters } from '@/lib/pdf/brandedPdf'
import { drawLegalMarkdownBody } from '@/lib/pdf/drawLegalMarkdownBody'

export function buildLegalDocumentPdf(title, markdown, { module, disclaimer } = {}) {
  const pdf = createBrandedPdf()
  drawLegalMarkdownBody(pdf, 0, markdown, { module, docTitle: title, forceTitle: title })
  applyBrandedFooters(
    pdf,
    disclaimer ||
      'Entwurf zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung Rechtsanwalt konsultieren.'
  )
  return pdf
}

export function buildBrandedLegalSectionsPdf(sections, { module, disclaimer } = {}) {
  const pdf = createBrandedPdf()
  let first = true

  sections.forEach((sec) => {
    if (!first) pdf.addPage()
    first = false
    drawLegalMarkdownBody(pdf, 0, sec.content, {
      module: module || 'Website-Rechtliches',
      docTitle: sec.title,
      forceTitle: sec.title,
    })
  })

  applyBrandedFooters(pdf, disclaimer)
  return pdf
}
