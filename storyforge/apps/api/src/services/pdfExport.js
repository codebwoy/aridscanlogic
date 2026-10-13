import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'
import {
  requiredBleedPixels,
  coverWrapLayout,
  PUBLISHING_SPECS,
  resolvePageTextLines,
  languageLabel,
  validateIsbn13,
  encodeEan13Modules,
  formatIsbnDisplay,
} from '@storyforge/shared'

/**
 * Print-ready interior PDF at bleed size.
 * - Full-bleed illustrations when present
 * - Story text in safe margin (bottom band)
 * - Bilingual: stacked / side-by-side / alternating order
 * - No decorative chrome on print pages (optional guides for proof)
 */
export async function buildInteriorPdf({
  title = 'StoryForge Book',
  trimId = 'sq_85',
  pages = [],
  pageCount,
  showGuides = false,
  showChrome = false,
  language = 'de',
  secondaryLanguage = null,
  bilingualLayout = 'stacked',
}) {
  const req = requiredBleedPixels(trimId)
  const pdf = await PDFDocument.create()
  pdf.setTitle(title)
  pdf.setProducer('StoryForge')
  pdf.setCreator('StoryForge Print Pipeline')

  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const count = pageCount || pages.length || 24
  const ptsPerInch = 72
  const pageW = req.widthIn * ptsPerInch
  const pageH = req.heightIn * ptsPerInch
  const bleedPts = (PUBLISHING_SPECS.bleedInches || 0.125) * ptsPerInch
  const safePts = (PUBLISHING_SPECS.safeMarginInches || 0.5) * ptsPerInch
  const pageNotes = []

  for (let i = 0; i < count; i++) {
    const pageData = pages[i] || {}
    const page = pdf.addPage([pageW, pageH])

    // White print base (no cream tint)
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
      color: rgb(1, 1, 1),
    })

    const assetUrl =
      pageData.asset?.url ||
      pageData.layers?.[0]?.url ||
      pageData.illustrationUrl ||
      null
    const embedded = await tryEmbedIllustration(pdf, assetUrl)
    if (embedded) {
      page.drawImage(embedded, { x: 0, y: 0, width: pageW, height: pageH })
      pageNotes.push({
        page: i + 1,
        hasArt: true,
        artWidth: embedded.width,
        artHeight: embedded.height,
      })
    } else {
      pageNotes.push({ page: i + 1, hasArt: false })
    }

    const resolved = resolvePageTextLines({
      primaryCode: language,
      secondaryCode: secondaryLanguage,
      primaryText: pageData.text_content || '',
      secondaryText: pageData.text_secondary || '',
      layout: bilingualLayout,
      pageIndex: pageData.page_index ?? i,
    })
    if (resolved.lines.length) {
      const textBandH = pageH * (secondaryLanguage ? 0.28 : 0.22)
      // Soft translucent band so text stays readable over busy art
      page.drawRectangle({
        x: safePts,
        y: safePts,
        width: pageW - safePts * 2,
        height: textBandH,
        color: rgb(1, 1, 1),
        opacity: embedded ? 0.82 : 0,
      })
      drawBilingualTextBand(page, resolved, {
        x: safePts + 4,
        y: safePts + textBandH - 14,
        width: pageW - safePts * 2 - 8,
        height: textBandH - 10,
        font,
        bold,
        color: rgb(0.08, 0.1, 0.09),
        muted: rgb(0.35, 0.38, 0.36),
      })
    } else if (!embedded) {
      page.drawText('Missing illustration — generate + 2.5× upscale before KDP upload', {
        x: safePts,
        y: pageH * 0.5,
        size: 10,
        font,
        color: rgb(0.45, 0.45, 0.45),
        maxWidth: pageW - safePts * 2,
      })
    }

    if (showChrome) {
      page.drawText(String(title).slice(0, 60), {
        x: safePts,
        y: pageH - safePts - 12,
        size: 9,
        font: bold,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: pageW - safePts * 2,
      })
      page.drawText(String(i + 1), {
        x: pageW / 2 - 6,
        y: bleedPts + 4,
        size: 8,
        font,
        color: rgb(0.35, 0.35, 0.35),
      })
    }

    if (showGuides) {
      const guide = rgb(0.85, 0.35, 0.2)
      page.drawRectangle({
        x: bleedPts,
        y: bleedPts,
        width: pageW - bleedPts * 2,
        height: pageH - bleedPts * 2,
        borderColor: guide,
        borderWidth: 0.5,
        opacity: 0.4,
      })
      page.drawRectangle({
        x: safePts,
        y: safePts,
        width: pageW - safePts * 2,
        height: pageH - safePts * 2,
        borderColor: rgb(0.2, 0.55, 0.5),
        borderWidth: 0.4,
        opacity: 0.35,
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
    bytes,
    kind: 'interior_pdf',
    trimId,
    pageCount: count,
    printReady: !showChrome && !showGuides,
    printRequirements: req,
    pageNotes,
    specsLastVerified: PUBLISHING_SPECS.lastVerified,
  }
}

/**
 * Single-page KDP paperback cover wrap PDF: BACK | SPINE | FRONT + barcode reserve.
 */
export async function buildCoverWrapPdf({
  title = 'StoryForge Book',
  author = '',
  subtitle = '',
  blurb = '',
  trimId = 'sq_85',
  pageCount = 32,
  paperTypeId = 'white',
  frontImageUrl = null,
  backImageUrl = null,
  titlePlacement = 'top',
  isbn = '',
  embedIsbnBarcode = false,
  showGuides = false,
}) {
  const layout = coverWrapLayout(trimId, pageCount, paperTypeId)
  const pdf = await PDFDocument.create()
  pdf.setTitle(`${title} — Cover Wrap`)
  pdf.setProducer('StoryForge')
  pdf.setCreator('StoryForge Print Pipeline')

  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pts = 72
  const pageW = layout.widthIn * pts
  const pageH = layout.heightIn * pts
  const page = pdf.addPage([pageW, pageH])

  const ink = (r, g, b) => rgb(r, g, b)
  const cream = ink(0.96, 0.94, 0.9)
  const teal = ink(0.16, 0.45, 0.42)
  const spineFill = ink(0.2, 0.55, 0.5)
  const guide = ink(0.75, 0.35, 0.2)
  const mute = ink(0.35, 0.4, 0.38)

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageW,
    height: pageH,
    color: cream,
  })

  const backX = layout.back.xIn * pts
  const spineX = layout.spine.xIn * pts
  const frontX = layout.front.xIn * pts
  const panelW = layout.panelWIn * pts
  const spineW = Math.max(layout.spineIn * pts, 0.5)

  page.drawRectangle({ x: backX, y: 0, width: panelW, height: pageH, color: cream })
  page.drawRectangle({ x: spineX, y: 0, width: spineW, height: pageH, color: spineFill })
  page.drawRectangle({ x: frontX, y: 0, width: panelW, height: pageH, color: cream })

  const frontLive = {
    x: layout.front.live.xIn * pts,
    y: layout.front.live.yIn * pts,
    w: layout.front.live.widthIn * pts,
    h: layout.front.live.heightIn * pts,
  }
  const backLive = {
    x: layout.back.live.xIn * pts,
    y: layout.back.live.yIn * pts,
    w: layout.back.live.widthIn * pts,
    h: layout.back.live.heightIn * pts,
  }

  const frontImg = await tryEmbedIllustration(pdf, frontImageUrl)
  if (frontImg) {
    page.drawImage(frontImg, {
      x: frontLive.x,
      y: frontLive.y,
      width: frontLive.w,
      height: frontLive.h,
    })
  } else {
    page.drawRectangle({
      x: frontLive.x + 12,
      y: frontLive.y + frontLive.h * 0.28,
      width: frontLive.w - 24,
      height: frontLive.h * 0.42,
      color: ink(0.88, 0.93, 0.92),
      borderColor: teal,
      borderWidth: 1,
    })
  }

  const backImg = await tryEmbedIllustration(pdf, backImageUrl)
  if (backImg) {
    page.drawImage(backImg, {
      x: backLive.x,
      y: backLive.y,
      width: backLive.w,
      height: backLive.h,
    })
  }

  const frontTitle = String(title).slice(0, 80)
  const frontSubtitle = String(subtitle || '').trim().slice(0, 80)
  const placeTop = titlePlacement !== 'bottom'
  // Title band — readable kids-book cover type (PDF overlay; art stays title-safe)
  const titleBandH = Math.min(
    frontSubtitle ? 88 : 72,
    frontLive.h * (frontSubtitle ? 0.22 : 0.18),
  )
  const titleBandY = placeTop
    ? frontLive.y + frontLive.h - titleBandH - 10
    : frontLive.y + 42
  page.drawRectangle({
    x: frontLive.x + 10,
    y: titleBandY,
    width: frontLive.w - 20,
    height: titleBandH,
    color: rgb(1, 1, 1),
    opacity: 0.9,
    borderColor: ink(0.12, 0.18, 0.16),
    borderWidth: 0.8,
  })
  const titleSize = frontTitle.length > 36 ? 14 : frontTitle.length > 22 ? 18 : 22
  page.drawText(frontTitle, {
    x: frontLive.x + 22,
    y: titleBandY + titleBandH - (frontSubtitle ? 28 : titleBandH * 0.42),
    size: titleSize,
    font: bold,
    color: ink(0.08, 0.12, 0.11),
    maxWidth: frontLive.w - 44,
  })
  if (frontSubtitle) {
    page.drawText(frontSubtitle, {
      x: frontLive.x + 22,
      y: titleBandY + 14,
      size: 11,
      font,
      color: mute,
      maxWidth: frontLive.w - 44,
    })
  }
  const authorBandY = placeTop ? frontLive.y + 14 : frontLive.y + frontLive.h - 38
  if (author) {
    page.drawRectangle({
      x: frontLive.x + 10,
      y: authorBandY,
      width: frontLive.w - 20,
      height: 28,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    })
    page.drawText(String(author).slice(0, 60), {
      x: frontLive.x + 22,
      y: authorBandY + 8,
      size: 12,
      font,
      color: mute,
      maxWidth: frontLive.w - 44,
    })
  }

  const blurbText =
    String(blurb || '').trim() ||
    `${frontTitle} — picture book for ages 3–7. Replace this blurb before KDP upload.`
  drawWrappedText(page, blurbText.slice(0, 700), {
    x: backLive.x + 18,
    y: backLive.y + backLive.h * 0.72,
    maxWidth: backLive.w - 36,
    size: 10,
    lineHeight: 13,
    font,
    color: ink(0.12, 0.15, 0.14),
    maxLines: 14,
  })

  const bc = layout.barcode
  page.drawRectangle({
    x: bc.xIn * pts,
    y: bc.yIn * pts,
    width: bc.widthIn * pts,
    height: bc.heightIn * pts,
    color: rgb(1, 1, 1),
    borderColor: mute,
    borderWidth: 0.75,
  })
  const isbnCheck = embedIsbnBarcode ? validateIsbn13(isbn) : { ok: false }
  let barcodeEmbedded = false
  if (isbnCheck.ok) {
    try {
      const { modules, isbn: cleanIsbn } = encodeEan13Modules(isbnCheck.isbn)
      const padX = 6
      const padY = 10
      const labelH = 12
      const barAreaW = bc.widthIn * pts - padX * 2
      const barAreaH = bc.heightIn * pts - padY * 2 - labelH
      const moduleW = barAreaW / modules.length
      const barX0 = bc.xIn * pts + padX
      const barY0 = bc.yIn * pts + padY + labelH
      for (let i = 0; i < modules.length; i++) {
        if (!modules[i]) continue
        page.drawRectangle({
          x: barX0 + i * moduleW,
          y: barY0,
          width: Math.max(moduleW, 0.4),
          height: barAreaH,
          color: ink(0, 0, 0),
        })
      }
      page.drawText(formatIsbnDisplay(cleanIsbn), {
        x: bc.xIn * pts + padX,
        y: bc.yIn * pts + 4,
        size: 8,
        font,
        color: ink(0.08, 0.08, 0.08),
        maxWidth: bc.widthIn * pts - padX * 2,
      })
      barcodeEmbedded = true
    } catch {
      barcodeEmbedded = false
    }
  }
  if (!barcodeEmbedded) {
    page.drawText('Barcode reserve (KDP)', {
      x: bc.xIn * pts + 6,
      y: bc.yIn * pts + bc.heightIn * pts * 0.45,
      size: 8,
      font,
      color: mute,
    })
  }

  if (layout.spineTextAllowed && spineW > 10) {
    const spineLabel = frontTitle.slice(0, 40)
    page.drawText(spineLabel, {
      x: spineX + spineW * 0.35,
      y: pageH * 0.2,
      size: Math.min(11, spineW * 0.55),
      font: bold,
      color: rgb(1, 1, 1),
      rotate: degrees(90),
      maxWidth: pageH * 0.6,
    })
  }

  if (showGuides) {
    for (const x of [spineX, frontX]) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: pageH },
        thickness: 0.6,
        color: guide,
        opacity: 0.55,
      })
    }
    page.drawRectangle({
      x: layout.bleedInches * pts,
      y: layout.bleedInches * pts,
      width: pageW - layout.bleedInches * pts * 2,
      height: pageH - layout.bleedInches * pts * 2,
      borderColor: guide,
      borderWidth: 0.5,
      opacity: 0.35,
    })
  }

  const bytes = await pdf.save()
  const b64 = Buffer.from(bytes).toString('base64')
  return {
    mime: 'application/pdf',
    filename: `${slugify(title)}-cover-wrap.pdf`,
    byteLength: bytes.length,
    dataUrl: `data:application/pdf;base64,${b64}`,
    bytes,
    kind: 'cover_pdf',
    trimId,
    pageCount,
    paperTypeId,
    printReady: !showGuides,
    layout: {
      widthPx: layout.widthPx,
      heightPx: layout.heightPx,
      widthIn: layout.widthIn,
      heightIn: layout.heightIn,
      spineIn: layout.spineIn,
      spineTextAllowed: layout.spineTextAllowed,
      dpi: layout.dpi,
      note: layout.note,
    },
    barcodeEmbedded,
    isbn: barcodeEmbedded ? isbnCheck.isbn : null,
    specsLastVerified: PUBLISHING_SPECS.lastVerified,
    independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
  }
}

function drawBilingualTextBand(page, resolved, opts) {
  const { x, y, width, height, font, bold, color, muted } = opts
  const lines = resolved.lines || []
  if (!lines.length) return

  if (resolved.layout === 'side_by_side' && lines.length >= 2) {
    const gap = 10
    const colW = (width - gap) / 2
    lines.slice(0, 2).forEach((line, idx) => {
      const cx = x + idx * (colW + gap)
      const label = languageLabel(line.code)
      page.drawText(label.slice(0, 28), {
        x: cx,
        y,
        size: 8,
        font: bold,
        color: muted,
        maxWidth: colW,
      })
      drawWrappedText(page, line.text.slice(0, 450), {
        x: cx,
        y: y - 12,
        maxWidth: colW,
        size: 11,
        lineHeight: 14,
        font,
        color,
        maxLines: 6,
      })
    })
    return
  }

  let cy = y
  const blockH = height / Math.max(lines.length, 1)
  for (const line of lines) {
    if (lines.length > 1) {
      page.drawText(languageLabel(line.code).slice(0, 36), {
        x,
        y: cy,
        size: 8,
        font: bold,
        color: muted,
        maxWidth: width,
      })
      cy -= 11
    }
    drawWrappedText(page, line.text.slice(0, 500), {
      x,
      y: cy,
      maxWidth: width,
      size: 12,
      lineHeight: 15,
      font,
      color,
      maxLines: Math.max(3, Math.floor(blockH / 15) - 1),
    })
    cy -= blockH - 4
  }
}

function drawWrappedText(page, text, opts) {
  const {
    x,
    y,
    maxWidth,
    size,
    lineHeight,
    font,
    color,
    maxLines = 20,
  } = opts
  const words = String(text).split(/\s+/).filter(Boolean)
  let line = ''
  let cy = y
  let lines = 0
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    const w = font.widthOfTextAtSize(next, size)
    if (w > maxWidth && line) {
      page.drawText(line, { x, y: cy, size, font, color, maxWidth })
      cy -= lineHeight
      lines += 1
      line = word
      if (lines >= maxLines) return
    } else {
      line = next
    }
  }
  if (line && lines < maxLines) {
    page.drawText(line, { x, y: cy, size, font, color, maxWidth })
  }
}

async function tryEmbedIllustration(pdf, assetUrl) {
  if (!assetUrl || typeof assetUrl !== 'string') return null
  try {
    if (assetUrl.startsWith('data:image/png')) {
      const b64 = assetUrl.split(',')[1]
      if (!b64) return null
      const buf = Buffer.from(b64, 'base64')
      if (!buf.length) return null
      return pdf.embedPng(buf)
    }
    if (assetUrl.startsWith('data:image/jpeg') || assetUrl.startsWith('data:image/jpg')) {
      const b64 = assetUrl.split(',')[1]
      if (!b64) return null
      const buf = Buffer.from(b64, 'base64')
      if (!buf.length) return null
      return pdf.embedJpg(buf)
    }
    if (assetUrl.startsWith('data:image/webp') || assetUrl.startsWith('data:image/svg')) {
      return null
    }
    if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://')) {
      const res = await fetch(assetUrl)
      if (!res.ok) return null
      const bytes = Buffer.from(await res.arrayBuffer())
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      if (ct.includes('jpeg') || ct.includes('jpg') || assetUrl.match(/\.jpe?g(\?|$)/i)) {
        return pdf.embedJpg(bytes)
      }
      return pdf.embedPng(bytes)
    }
  } catch {
    return null
  }
  return null
}

function slugify(s) {
  return (
    String(s || 'book')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'book'
  )
}
