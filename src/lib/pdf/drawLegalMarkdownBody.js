/**
 * Draw parsed legal markdown blocks onto a branded PDF page.
 */

import {
  PDF_THEME,
  PDF_FONTS,
  drawBrandedHeader,
  drawSectionTitle,
  drawFieldRow,
  drawBodyParagraph,
  drawDisclaimerBox,
  ensureSpace,
  pageWidth,
} from '@/lib/pdf/brandedPdf'
import { parseLegalMarkdown } from '@/lib/legal/parseLegalMarkdown'

export function drawLegalMarkdownBody(
  pdf,
  startY,
  markdown,
  { module, docTitle, forceTitle, fragment = false, branding } = {}
) {
  const blocks = parseLegalMarkdown(markdown)
  let y = startY
  let fieldAlt = false
  let headerDrawn = startY > 0 || fragment

  const h1 = blocks.find((b) => b.type === 'h1')
  const title = forceTitle || docTitle || h1?.text || 'Document'

  if (!headerDrawn) {
    y = drawBrandedHeader(pdf, {
      title,
      module: module || 'Website-Rechtliches',
      branding,
    })
    headerDrawn = true
  }

  for (const block of blocks) {
    if (fragment && (block.type === 'disclaimer' || block.type === 'h1')) continue
    if (block.type === 'h1' && block.text === title) continue

    y = ensureSpace(pdf, y, 14, { title, module, branding })

    switch (block.type) {
      case 'disclaimer':
        y = drawDisclaimerBox(pdf, y, block.text)
        y += 4
        break
      case 'h1':
      case 'h2':
        y = drawSectionTitle(pdf, y, block.text)
        break
      case 'field':
        y = drawFieldRow(pdf, y, block.label, block.value, { alt: fieldAlt })
        fieldAlt = !fieldAlt
        break
      case 'list':
        block.items.forEach((item) => {
          y = ensureSpace(pdf, y, 8, { module, title, branding })
          pdf.setFont(PDF_FONTS.family, 'normal')
          pdf.setFontSize(PDF_FONTS.bodySize)
          pdf.setTextColor(...PDF_THEME.slate800)
          const lines = pdf.splitTextToSize(`•  ${item}`, PDF_THEME.contentWidth - 4)
          pdf.text(lines, PDF_THEME.margin + 2, y)
          y += lines.length * 4.8 + 2
        })
        break
      case 'hr':
        y += 3
        pdf.setDrawColor(...PDF_THEME.brand200)
        pdf.setLineWidth(0.3)
        pdf.line(PDF_THEME.margin, y, pageWidth(pdf) - PDF_THEME.margin, y)
        y += 6
        break
      case 'note':
        pdf.setFont(PDF_FONTS.family, 'italic')
        pdf.setFontSize(PDF_FONTS.labelSize)
        pdf.setTextColor(...PDF_THEME.slate500)
        y = drawBodyParagraph(pdf, y, block.text)
        break
      case 'p':
      default:
        y = drawBodyParagraph(pdf, y, block.text)
        break
    }
  }

  return y
}
