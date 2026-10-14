/**
 * KDP print-interior PDF export — trim size, margins, optional bleed.
 * Uses embedded standard fonts via pdf-lib. Validate in Amazon Print Previewer
 * before upload. Not a full InDesign replacement; typography is manuscript-grade.
 *
 * Sources: KDP trim/bleed/margins (GVBQ3CMEQW3W2VL6), fonts embed (G201834260).
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { gutterForPageCount } from './kdpRules.js'
import { wordCount } from './deterministic.js'

/** Parse "6x9" / "6×9" / "6 x 9" → inches */
export function parseTrimSizeIn(trim) {
  const m = String(trim || '6x9')
    .toLowerCase()
    .replace(/×/g, 'x')
    .match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/)
  if (!m) return { widthIn: 6, heightIn: 9 }
  return { widthIn: Number(m[1]), heightIn: Number(m[2]) }
}

function inchesToPoints(n) {
  return Number(n) * 72
}

/**
 * Resolve print page geometry from project.print_config.
 */
export function resolvePrintPageGeometry(project, { wordCountTotal = 0 } = {}) {
  const cfg = project?.print_config || {}
  const bleed = Boolean(cfg.bleed)
  const { widthIn, heightIn } = parseTrimSizeIn(cfg.trim_size_in || '6x9')
  // KDP: with bleed, page size = trim + 0.125" width, + 0.25" height
  const pageWidthIn = bleed ? widthIn + 0.125 : widthIn
  const pageHeightIn = bleed ? heightIn + 0.25 : heightIn

  const estimatedPages = Math.max(24, Math.ceil((wordCountTotal || 25000) / 250))
  const outsideMin = bleed ? 0.375 : 0.25
  const gutterMin = gutterForPageCount(estimatedPages)

  const outside = Number(cfg.outside_margin_in)
  const gutter = Number(cfg.gutter_in)
  const outsideIn = Number.isFinite(outside) && outside > 0 ? Math.max(outside, outsideMin) : Math.max(0.5, outsideMin)
  const gutterIn = Number.isFinite(gutter) && gutter > 0 ? Math.max(gutter, gutterMin) : Math.max(0.5, gutterMin)
  const topIn = Number(cfg.top_margin_in) > 0 ? Number(cfg.top_margin_in) : outsideIn
  const bottomIn = Number(cfg.bottom_margin_in) > 0 ? Number(cfg.bottom_margin_in) : outsideIn

  return {
    trim_width_in: widthIn,
    trim_height_in: heightIn,
    page_width_in: pageWidthIn,
    page_height_in: pageHeightIn,
    page_width_pt: inchesToPoints(pageWidthIn),
    page_height_pt: inchesToPoints(pageHeightIn),
    bleed,
    outside_in: outsideIn,
    gutter_in: gutterIn,
    top_in: topIn,
    bottom_in: bottomIn,
    estimated_pages: estimatedPages,
    // Mirror margins: odd pages gutter on left, even on right
    odd: {
      left: inchesToPoints(gutterIn),
      right: inchesToPoints(outsideIn),
      top: inchesToPoints(topIn),
      bottom: inchesToPoints(bottomIn),
    },
    even: {
      left: inchesToPoints(outsideIn),
      right: inchesToPoints(gutterIn),
      top: inchesToPoints(topIn),
      bottom: inchesToPoints(bottomIn),
    },
  }
}

function wrapLines(text, font, size, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const w of words) {
    const trial = current ? `${current} ${w}` : w
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      current = trial
    } else {
      if (current) lines.push(current)
      current = w
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

function paragraphsFromMarkdown(md) {
  return String(md || '')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
}

/**
 * Build a print-ready interior PDF for KDP paperback/hardcover upload.
 */
export async function buildPrintPdf(project) {
  const sections = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const totalWords = sections.reduce((n, s) => n + wordCount(s.content_md), 0)
  const geo = resolvePrintPageGeometry(project, { wordCountTotal: totalWords })

  const pdf = await PDFDocument.create()
  pdf.setTitle(project.title || 'Manuscript')
  pdf.setAuthor(project.author_name || 'Author')
  pdf.setCreator('ProofForge — KDP print interior export')
  pdf.setProducer('ProofForge (not affiliated with Amazon)')
  pdf.setSubject(
    `Trim ${geo.trim_width_in}×${geo.trim_height_in} in` +
      (geo.bleed ? ' with bleed' : ' no bleed') +
      '; validate in Print Previewer'
  )

  // Standard fonts are embedded as Type1 references — widely print-safe for text books
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const fontItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic)

  const bodySize = 11
  const leading = 15
  const titleSize = 18
  const headingSize = 14

  let page = null
  let pageIndex = 0
  let y = 0
  let margins = geo.odd

  const newPage = () => {
    pageIndex += 1
    page = pdf.addPage([geo.page_width_pt, geo.page_height_pt])
    margins = pageIndex % 2 === 1 ? geo.odd : geo.even
    y = geo.page_height_pt - margins.top
    // Folio (page number) centered in bottom margin
    const folio = String(pageIndex)
    const fw = font.widthOfTextAtSize(folio, 9)
    page.drawText(folio, {
      x: (geo.page_width_pt - fw) / 2,
      y: margins.bottom / 2 - 3,
      size: 9,
      font,
      color: rgb(0.25, 0.25, 0.25),
    })
  }

  const ensureSpace = (needed) => {
    if (!page || y - needed < margins.bottom) newPage()
  }

  const drawWrapped = (text, { size = bodySize, bold = false, italic = false, gapAfter = leading } = {}) => {
    const f = bold ? fontBold : italic ? fontItalic : font
    const maxW = geo.page_width_pt - margins.left - margins.right
    const lines = wrapLines(text, f, size, maxW)
    for (const line of lines) {
      ensureSpace(size + 2)
      page.drawText(line, {
        x: margins.left,
        y: y - size,
        size,
        font: f,
        color: rgb(0.05, 0.05, 0.05),
        maxWidth: maxW,
      })
      y -= leading * (size / bodySize)
    }
    y -= gapAfter * 0.35
  }

  // Title page
  newPage()
  y = geo.page_height_pt * 0.55
  {
    const t = project.title || 'Manuscript'
    const tw = fontBold.widthOfTextAtSize(t, titleSize)
    page.drawText(t, {
      x: Math.max(margins.left, (geo.page_width_pt - tw) / 2),
      y,
      size: titleSize,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    })
    y -= 28
    if (project.subtitle) {
      const st = String(project.subtitle)
      const sw = fontItalic.widthOfTextAtSize(st, 12)
      page.drawText(st, {
        x: Math.max(margins.left, (geo.page_width_pt - sw) / 2),
        y,
        size: 12,
        font: fontItalic,
        color: rgb(0.2, 0.2, 0.2),
      })
      y -= 24
    }
    if (project.author_name) {
      const a = String(project.author_name)
      const aw = font.widthOfTextAtSize(a, 12)
      page.drawText(a, {
        x: Math.max(margins.left, (geo.page_width_pt - aw) / 2),
        y,
        size: 12,
        font,
        color: rgb(0.15, 0.15, 0.15),
      })
    }
  }

  // Copyright / export note page
  newPage()
  drawWrapped(project.title || 'Manuscript', { size: 12, bold: true })
  if (project.author_name) drawWrapped(`© ${new Date().getFullYear()} ${project.author_name}`)
  drawWrapped(
    `Print interior exported by ProofForge for KDP review. Trim ${geo.trim_width_in}×${geo.trim_height_in} in` +
      (geo.bleed ? ' (bleed enabled)' : '') +
      `. Outside margin ${geo.outside_in}" · Gutter ${geo.gutter_in}". Not affiliated with Amazon — validate in Print Previewer before publish.`
  )

  // Body
  for (const s of sections) {
    newPage()
    drawWrapped(s.title || s.key || 'Chapter', { size: headingSize, bold: true, gapAfter: 18 })
    for (const para of paragraphsFromMarkdown(s.content_md)) {
      const isHeading = /^#{1,3}\s+/.test(para)
      const clean = para.replace(/^#{1,6}\s+/, '').replace(/\*\*/g, '')
      if (isHeading) {
        y -= 8
        drawWrapped(clean, { size: 12, bold: true, gapAfter: 10 })
      } else {
        drawWrapped(clean, { size: bodySize })
        y -= 6
      }
    }
  }

  const bytes = await pdf.save({ useObjectStreams: false })
  return {
    bytes: Uint8Array.from(bytes),
    filename: `manuscript-print-${project.id || 'export'}.pdf`,
    geometry: geo,
    page_count: pdf.getPageCount(),
    note:
      'KDP print PDF: Times Roman body at trim size with mirror margins. Embed-check in Print Previewer; for custom commercial fonts, export DOCX → Word “Embed fonts” → Save as PDF.',
  }
}

/**
 * Lightweight PDF of the editorial report (not the print interior).
 */
export async function buildReportPdf(project) {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`ProofForge report — ${project.title || 'Manuscript'}`)
  pdf.setCreator('ProofForge')
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize = [612, 792] // US Letter for reading the report
  let page = pdf.addPage(pageSize)
  let y = 750
  const left = 54
  const maxW = 504

  const line = (text, { size = 10, bold = false } = {}) => {
    const f = bold ? fontBold : font
    const wrapped = wrapLines(String(text || ''), f, size, maxW)
    for (const w of wrapped) {
      if (y < 54) {
        page = pdf.addPage(pageSize)
        y = 750
      }
      page.drawText(w, { x: left, y, size, font: f, color: rgb(0.1, 0.1, 0.1) })
      y -= size + 4
    }
    y -= 4
  }

  line(`ProofForge audit — ${project.title || 'Manuscript'}`, { size: 16, bold: true })
  line('Scores are guides. Not Amazon-affiliated. No KDP acceptance guarantee.')
  line(`Overall: ${project.scores?.overall ?? '—'} · Readiness: ${project.scores?.readiness ?? '—'}`)
  line(`Open findings: ${project.scores?.counts?.total_open ?? 0}`)
  y -= 8
  line('Critical & major findings', { size: 12, bold: true })
  const important = (project.findings || []).filter((f) =>
    ['critical', 'major'].includes(f.severity)
  )
  if (!important.length) line('None')
  for (const f of important.slice(0, 40)) {
    line(`[${f.severity}] ${f.title}`, { bold: true })
    line(f.explanation)
    if (f.original_excerpt) line(`> ${f.original_excerpt}`)
  }

  const bytes = await pdf.save({ useObjectStreams: false })
  return {
    bytes: Uint8Array.from(bytes),
    filename: `report-${project.id || 'export'}.pdf`,
  }
}
