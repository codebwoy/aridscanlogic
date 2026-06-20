import { jsPDF } from 'jspdf'
import {
  anschreibenDisplayName,
  anschreibenSlug,
  buildAnrede,
  defaultBetreff,
  normalizeEinleitung,
} from './schema'

const MARGIN = 18
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2

function drawRule(pdf, y) {
  pdf.setDrawColor(180, 180, 180)
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y)
  return y + 5
}

function bodyParagraph(pdf, y, text, opts = {}) {
  if (!text?.trim()) return y
  pdf.setFont('helvetica', opts.bold ? 'bold' : opts.italic ? 'italic' : 'normal')
  pdf.setFontSize(opts.size || 11)
  pdf.setTextColor(...(opts.color || [30, 30, 30]))
  const lines = pdf.splitTextToSize(text.trim(), opts.width || CONTENT_W)
  for (const line of lines) {
    if (y > 272) return y
    const x = opts.align === 'right' ? PAGE_W - MARGIN : MARGIN
    pdf.text(line, x, y, { align: opts.align === 'right' ? 'right' : 'left' })
    y += opts.lineHeight || 5
  }
  return y + (opts.gapAfter ?? 3)
}

export function buildAnschreibenPdfDocument(a) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const name = anschreibenDisplayName(a)
  const sig = a.unterschriftName?.trim() || name
  let y = MARGIN

  // Header — matches Lebenslauf
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.setTextColor(20, 20, 20)
  pdf.text(name || 'Anschreiben', MARGIN, y + 6)

  if (a.berufsbezeichnung?.trim()) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(80, 80, 80)
    pdf.text(a.berufsbezeichnung.trim(), MARGIN, y + 13)
    y += 4
  }
  y += a.berufsbezeichnung?.trim() ? 14 : 10

  y = drawRule(pdf, y)

  // Absender (DIN — klein)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(85, 85, 85)
  const senderLines = [
    [a.strasse, `${a.plz || ''} ${a.stadt || ''}`.trim()].filter(Boolean).join(', '),
    [a.telefon, a.email].filter(Boolean).join(' · '),
  ].filter(Boolean)
  for (const line of senderLines) {
    pdf.text(line, MARGIN, y)
    y += 3.5
  }
  y += 10

  // Empfänger
  pdf.setFontSize(10)
  pdf.setTextColor(26, 26, 26)
  const recipient = [
    a.firma,
    a.abteilung,
    a.ansprechpartnerNachname
      ? `${a.ansprechpartnerAnrede === 'frau' ? 'Frau' : a.ansprechpartnerAnrede === 'herr' ? 'Herr' : ''} ${a.ansprechpartnerNachname}`.trim()
      : '',
    a.firmaStrasse,
    `${a.firmaPlz || ''} ${a.firmaStadt || ''}`.trim(),
  ].filter(Boolean)
  for (const line of recipient) {
    pdf.text(line, MARGIN, y)
    y += 4.8
  }
  y += 4

  // Ort, Datum
  if (a.ortDatum?.trim()) {
    y = bodyParagraph(pdf, y, a.ortDatum.trim(), { align: 'right', size: 10, gapAfter: 6 })
  }

  // Betreff
  const betreff = defaultBetreff(a)
  if (betreff) {
    y = drawRule(pdf, y)
    y = bodyParagraph(pdf, y, betreff, { bold: true, size: 11, gapAfter: 6 })
  }

  // Anrede & body
  y = bodyParagraph(pdf, y, buildAnrede(a), { gapAfter: 4 })
  if (a.einleitung?.trim()) {
    y = bodyParagraph(pdf, y, normalizeEinleitung(a.einleitung), { gapAfter: 5 })
  }
  if (a.hauptteil?.trim()) {
    y = bodyParagraph(pdf, y, a.hauptteil, { gapAfter: 5 })
  }
  if (a.motivation?.trim()) {
    y = bodyParagraph(pdf, y, a.motivation, { gapAfter: 5 })
  }
  if (a.schlussteil?.trim()) {
    y = bodyParagraph(pdf, y, a.schlussteil, { gapAfter: 8 })
  }

  const gruss = a.grussformel?.trim() || 'Mit freundlichen Grüßen'
  y = bodyParagraph(pdf, y, gruss, { gapAfter: 14 })

  // Signature block — matches Lebenslauf footer
  if (sig) {
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(11)
    pdf.setTextColor(26, 26, 26)
    pdf.text(sig, MARGIN, y)
    y += 5
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(136, 136, 136)
    pdf.text('Unterschrift', MARGIN, y)
  }

  pdf.setFontSize(9)
  pdf.setTextColor(85, 85, 85)
  pdf.text(a.anlagenHinweis?.trim() || 'Anlagen', MARGIN, 285)

  return pdf
}

export function anschreibenPdfBlob(a) {
  return buildAnschreibenPdfDocument(a).output('blob')
}

export function downloadAnschreibenPdf(a) {
  buildAnschreibenPdfDocument(a).save(`Anschreiben_${anschreibenSlug(a)}.pdf`)
}
