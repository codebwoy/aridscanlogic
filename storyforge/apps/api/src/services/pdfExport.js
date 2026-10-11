import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { requiredBleedPixels, PUBLISHING_SPECS } from '@storyforge/shared'

/**
 * Build a simple interior PDF with bleed-sized pages.
 * Mock/SVG placeholders become labeled pages; real PNG/JPEG embed when provided.
 */
export async function buildInteriorPdf({
  title = 'StoryForge Book',
  trimId = 'sq_85',
  pages = [],
  pageCount,
}) {
  const req = requiredBleedPixels(trimId)
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const count = pageCount || pages.length || 24
  const ptsPerInch = 72
  const pageW = req.widthIn * ptsPerInch
  const pageH = req.heightIn * ptsPerInch

  for (let i = 0; i < count; i++) {
    const pageData = pages[i] || {}
    const page = pdf.addPage([pageW, pageH])
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
      color: rgb(0.95, 0.98, 0.97),
    })

    const assetUrl = pageData.asset?.url || pageData.layers?.[0]?.url
    if (assetUrl && typeof assetUrl === 'string' && assetUrl.startsWith('data:image/png')) {
      try {
        const b64 = assetUrl.split(',')[1]
        const bytes = Buffer.from(b64, 'base64')
        const img = await pdf.embedPng(bytes)
        page.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH })
      } catch {
        /* fall through to placeholder */
      }
    }

    const margin = PUBLISHING_SPECS.safeMarginInches * ptsPerInch
    page.drawText(title, {
      x: margin,
      y: pageH - margin - 14,
      size: 11,
      font: bold,
      color: rgb(0.12, 0.25, 0.22),
      maxWidth: pageW - margin * 2,
    })
    page.drawText(`Page ${i + 1}`, {
      x: margin,
      y: margin,
      size: 9,
      font,
      color: rgb(0.35, 0.4, 0.38),
    })
    const text = pageData.text_content || ''
    if (text) {
      page.drawText(text.slice(0, 800), {
        x: margin,
        y: pageH * 0.35,
        size: 12,
        font,
        color: rgb(0.1, 0.15, 0.14),
        maxWidth: pageW - margin * 2,
        lineHeight: 16,
      })
    } else {
      page.drawText('Illustration placeholder — mock provider', {
        x: margin,
        y: pageH * 0.5,
        size: 10,
        font,
        color: rgb(0.4, 0.45, 0.43),
        maxWidth: pageW - margin * 2,
      })
    }
  }

  const bytes = await pdf.save()
  const b64 = Buffer.from(bytes).toString('base64')
  return {
    mime: 'application/pdf',
    filename: `${slugify(title)}-interior.pdf`,
    byteLength: bytes.length,
    dataUrl: `data:application/pdf;base64,${b64}`,
    trimId,
    pageCount: count,
    printRequirements: req,
    specsLastVerified: PUBLISHING_SPECS.lastVerified,
  }
}

function slugify(s) {
  return String(s || 'book')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'book'
}
