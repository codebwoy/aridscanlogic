import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { trimToPoints, interiorMargins } from '@novelforge/shared'

/**
 * Simple interior PDF for KDP trim — text flow with page numbers.
 * Not a full typesetting engine; good enough for first-draft KDP package.
 */
export async function buildInteriorPdf({
  title = 'Untitled',
  author = '',
  chapters = [],
  trimId = '6x9',
} = {}) {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const trim = trimToPoints(trimId)
  const margins = interiorMargins({ pageCount: 200 })
  const pageWidth = trim.width
  const pageHeight = trim.height
  const left = margins.gutterIn * 72
  const right = margins.outerIn * 72
  const top = margins.topIn * 72
  const bottom = margins.bottomIn * 72
  const maxWidth = pageWidth - left - right
  const fontSize = 11
  const lineHeight = 16

  // Title page
  {
    const page = pdf.addPage([pageWidth, pageHeight])
    page.drawText(title.slice(0, 80), {
      x: left,
      y: pageHeight / 2 + 20,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.12),
    })
    if (author) {
      page.drawText(author.slice(0, 80), {
        x: left,
        y: pageHeight / 2 - 10,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.25),
      })
    }
  }

  // Copyright
  {
    const page = pdf.addPage([pageWidth, pageHeight])
    const year = new Date().getFullYear()
    page.drawText(`Copyright © ${year} ${author || 'Author'}`.slice(0, 100), {
      x: left,
      y: pageHeight / 2,
      size: 10,
      font,
    })
    page.drawText('First draft — verify facts and rights before publishing.', {
      x: left,
      y: pageHeight / 2 - 20,
      size: 9,
      font,
    })
  }

  let pageNum = 0
  function newContentPage() {
    pageNum += 1
    const page = pdf.addPage([pageWidth, pageHeight])
    page.drawText(String(pageNum), {
      x: pageWidth / 2 - 6,
      y: bottom / 2,
      size: 9,
      font,
      color: rgb(0.3, 0.3, 0.35),
    })
    return { page, y: pageHeight - top }
  }

  function wrapLines(text, size) {
    const words = String(text || '').split(/\s+/)
    const lines = []
    let line = ''
    for (const w of words) {
      const trial = line ? `${line} ${w}` : w
      if (font.widthOfTextAtSize(trial, size) > maxWidth) {
        if (line) lines.push(line)
        line = w
      } else line = trial
    }
    if (line) lines.push(line)
    return lines
  }

  let ctx = newContentPage()
  for (const ch of chapters) {
    if (ctx.y < bottom + 80) ctx = newContentPage()
    ctx.page.drawText(String(ch.title || 'Chapter').slice(0, 90), {
      x: left,
      y: ctx.y,
      size: 14,
      font: fontBold,
    })
    ctx.y -= 28
    const body = ch.content_md || ch.body || ''
    for (const para of body.split(/\n\n+/)) {
      const clean = para.replace(/<!--[\s\S]*?-->/g, '').trim()
      if (!clean) continue
      for (const line of wrapLines(clean, fontSize)) {
        if (ctx.y < bottom + 24) ctx = newContentPage()
        ctx.page.drawText(line.slice(0, 200), {
          x: left,
          y: ctx.y,
          size: fontSize,
          font,
          color: rgb(0.08, 0.08, 0.1),
        })
        ctx.y -= lineHeight
      }
      ctx.y -= 8
    }
    ctx.y -= 16
  }

  const bytes = await pdf.save()
  return { bytes, pageCount: pdf.getPageCount() }
}
