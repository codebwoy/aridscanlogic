import { parseLegalMarkdown } from '@/lib/legal/formatLegalDocument'
import {
  drawSectionTitle,
  drawFieldRow,
  drawBodyParagraph,
  drawDisclaimerBox,
  ensureSpace,
  PDF_THEME,
} from '@/lib/pdf/brandedPdf'

/** Render parsed legal markdown into an existing branded PDF page. */
export function renderLegalMarkdownToPdf(pdf, startY, content, { skipH1, module, docTitle } = {}) {
  const blocks = parseLegalMarkdown(content)
  let y = startY
  let fieldAlt = false

  for (const block of blocks) {
    switch (block.type) {
      case 'disclaimer':
        y = ensureSpace(pdf, y, 18, { title: docTitle, module })
        y = drawDisclaimerBox(pdf, y, block.text)
        y += 4
        break
      case 'h1':
        if (skipH1 && block.text.toLowerCase().includes(String(skipH1).toLowerCase().slice(0, 8))) {
          break
        }
        y = ensureSpace(pdf, y, 14, { title: docTitle, module })
        y = drawSectionTitle(pdf, y, block.text)
        break
      case 'h2':
        y = ensureSpace(pdf, y, 14, { title: docTitle, module })
        y = drawSectionTitle(pdf, y, block.text)
        fieldAlt = false
        break
      case 'h3':
        y = ensureSpace(pdf, y, 10, { title: docTitle, module })
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        pdf.setTextColor(...PDF_THEME.brand600)
        pdf.text(block.text.toUpperCase(), PDF_THEME.margin, y)
        y += 8
        break
      case 'field':
        y = ensureSpace(pdf, y, 12, { title: docTitle, module })
        y = drawFieldRow(pdf, y, block.label, block.value, { alt: fieldAlt })
        fieldAlt = !fieldAlt
        break
      case 'paragraph':
        y = ensureSpace(pdf, y, 10, { title: docTitle, module })
        y = drawBodyParagraph(pdf, y, block.text)
        break
      case 'list':
        for (const item of block.items) {
          y = ensureSpace(pdf, y, 8, { title: docTitle, module })
          y = drawBodyParagraph(pdf, y, `• ${item}`)
        }
        break
      case 'hint':
        y = ensureSpace(pdf, y, 12, { title: docTitle, module })
        pdf.setDrawColor(...PDF_THEME.brand200)
        pdf.setLineWidth(0.2)
        pdf.line(PDF_THEME.margin, y, PDF_THEME.margin + PDF_THEME.contentWidth, y)
        y += 6
        pdf.setFont('helvetica', 'italic')
        pdf.setFontSize(8)
        pdf.setTextColor(...PDF_THEME.slate500)
        const hintLines = pdf.splitTextToSize(block.text, PDF_THEME.contentWidth)
        pdf.text(hintLines, PDF_THEME.margin, y)
        y += hintLines.length * 4 + 4
        break
      case 'hr':
        y += 4
        pdf.setDrawColor(...PDF_THEME.slate200)
        pdf.line(PDF_THEME.margin, y, PDF_THEME.margin + PDF_THEME.contentWidth, y)
        y += 6
        break
      default:
        break
    }
  }

  return y
}
