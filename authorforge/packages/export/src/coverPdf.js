import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { coverWrapLayout } from '@authorforge/shared'

export async function buildCoverWrapPdf({
  title = 'Untitled',
  author = '',
  backCopy = '',
  pageCount = 200,
  trimId = '6x9',
  paperType = 'white',
} = {}) {
  const layout = coverWrapLayout({ trimId, pageCount, paperType })
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([layout.widthPt, layout.heightPt])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const { bleedPt: b, spinePt: s, trimWidthPt: tw, trimHeightPt: th } = layout
  // Regions: BACK | SPINE | FRONT
  page.drawRectangle({
    x: b,
    y: b,
    width: tw,
    height: th,
    borderColor: rgb(0.7, 0.7, 0.75),
    borderWidth: 0.5,
  })
  page.drawRectangle({
    x: b + tw,
    y: b,
    width: s,
    height: th,
    borderColor: rgb(0.6, 0.6, 0.65),
    borderWidth: 0.5,
    color: rgb(0.95, 0.95, 0.96),
  })
  page.drawRectangle({
    x: b + tw + s,
    y: b,
    width: tw,
    height: th,
    borderColor: rgb(0.2, 0.25, 0.4),
    borderWidth: 1,
    color: rgb(0.12, 0.16, 0.28),
  })

  // Front title
  const frontX = b + tw + s + 36
  page.drawText(title.slice(0, 48), {
    x: frontX,
    y: b + th - 80,
    size: 22,
    font: fontBold,
    color: rgb(0.98, 0.98, 1),
  })
  page.drawText(author.slice(0, 48), {
    x: frontX,
    y: b + th - 110,
    size: 12,
    font,
    color: rgb(0.85, 0.88, 0.95),
  })

  // Back copy
  const backLines = String(backCopy || 'First draft — edit before print.')
    .split(/\s+/)
    .reduce((lines, w) => {
      const last = lines[lines.length - 1] || ''
      if ((last + ' ' + w).trim().length > 42) lines.push(w)
      else lines[lines.length - 1] = (last + ' ' + w).trim()
      return lines
    }, [''])
  let y = b + th - 60
  for (const line of backLines.slice(0, 18)) {
    page.drawText(line, { x: b + 28, y, size: 10, font, color: rgb(0.15, 0.15, 0.18) })
    y -= 14
  }

  // Barcode reserve
  page.drawRectangle({
    x: b + tw - layout.barcodeReserve.widthPt - 18,
    y: b + 24,
    width: layout.barcodeReserve.widthPt,
    height: layout.barcodeReserve.heightPt,
    borderColor: rgb(0.5, 0.5, 0.55),
    borderWidth: 0.75,
  })
  page.drawText('BARCODE', {
    x: b + tw - layout.barcodeReserve.widthPt - 10,
    y: b + 40,
    size: 8,
    font,
    color: rgb(0.45, 0.45, 0.5),
  })

  if (pageCount >= 80 && s > 10) {
    page.drawText(title.slice(0, 24), {
      x: b + tw + 4,
      y: b + th / 2,
      size: 8,
      font,
      color: rgb(0.2, 0.2, 0.25),
      rotate: { type: 'degrees', angle: 90 },
    })
  }

  const bytes = await pdf.save()
  return { bytes, layout, pageCount: 1 }
}
