import { PUBLISHING_SPECS, getTrimSize, getPaperType } from './publishing-specs.js'

/**
 * Required pixel size for a full-bleed page at configured DPI.
 * px = (trim + 2×bleed) × dpi per axis.
 */
export function requiredBleedPixels(trimId, { dpi, bleedInches } = {}) {
  const trim = getTrimSize(trimId)
  if (!trim) throw new Error(`Unknown trim size: ${trimId}`)
  const d = dpi ?? PUBLISHING_SPECS.dpi
  const bleed = bleedInches ?? PUBLISHING_SPECS.bleedInches
  const widthIn = trim.width + 2 * bleed
  const heightIn = trim.height + 2 * bleed
  return {
    trimId,
    dpi: d,
    bleedInches: bleed,
    widthPx: Math.ceil(widthIn * d),
    heightPx: Math.ceil(heightIn * d),
    widthIn,
    heightIn,
  }
}

/** Effective DPI for a placed image covering a physical size in inches. */
export function effectiveDpi(imagePx, physicalInches) {
  if (!physicalInches || physicalInches <= 0) return 0
  return imagePx / physicalInches
}

/**
 * Spine width in inches from page count + paper type.
 * Formula lives in config (paperTypes.*.spineInchesPerPage).
 */
export function spineWidthInches(pageCount, paperTypeId) {
  const paper = getPaperType(paperTypeId)
  if (!paper) throw new Error(`Unknown paper type: ${paperTypeId}`)
  const n = Number(pageCount)
  if (!Number.isFinite(n) || n < 1) throw new Error('Invalid page count')
  return n * paper.spineInchesPerPage
}

export function spineWidthPixels(pageCount, paperTypeId, dpi = PUBLISHING_SPECS.dpi) {
  return Math.ceil(spineWidthInches(pageCount, paperTypeId) * dpi)
}

/**
 * Cover wrap = back + spine + front with outer bleed.
 * Flat layout (left→right): BACK | SPINE | FRONT.
 * Width = 2×(trimW + bleed) + spine; height = trimH + 2×bleed.
 *
 * ⚠ Spine inches/page are owner-config placeholders — re-check KDP cover calculator before upload.
 */
export function coverWrapPixels(trimId, pageCount, paperTypeId) {
  return coverWrapLayout(trimId, pageCount, paperTypeId)
}

/**
 * Full cover-wrap geometry for PDF export + Studio guides.
 */
export function coverWrapLayout(trimId, pageCount, paperTypeId = 'white') {
  const page = requiredBleedPixels(trimId)
  const trim = getTrimSize(trimId)
  if (!trim) throw new Error(`Unknown trim size: ${trimId}`)
  const paper = getPaperType(paperTypeId) || getPaperType('white')
  const bleed = PUBLISHING_SPECS.bleedInches
  const d = page.dpi
  const spineIn = spineWidthInches(pageCount, paper.id)
  const spinePx = Math.ceil(spineIn * d)
  // Front and back each: trim + outer bleed; spine has no horizontal bleed double-count
  const panelW = Math.ceil((trim.width + bleed) * d)
  const widthPx = panelW * 2 + spinePx
  const heightPx = page.heightPx
  const widthIn = widthPx / d
  const heightIn = heightPx / d
  const panelWIn = panelW / d
  const spineInExact = spineIn

  // Positions in inches from left / bottom (PDF coords use bottom-left origin)
  const back = {
    xIn: 0,
    widthIn: panelWIn,
    /** Live area (inside bleed) for back cover art/text */
    live: {
      xIn: bleed,
      yIn: bleed,
      widthIn: trim.width,
      heightIn: trim.height,
    },
  }
  const spine = {
    xIn: panelWIn,
    widthIn: spineInExact,
    live: {
      xIn: panelWIn,
      yIn: bleed,
      widthIn: spineInExact,
      heightIn: trim.height,
    },
  }
  const front = {
    xIn: panelWIn + spineInExact,
    widthIn: panelWIn,
    live: {
      xIn: panelWIn + spineInExact,
      yIn: bleed,
      widthIn: trim.width,
      heightIn: trim.height,
    },
  }

  /** KDP barcode reserve on back (approx) — keep clear of art/text */
  const barcode = {
    widthIn: 2,
    heightIn: 1.2,
    /** inset from back live right / bottom */
    insetRightIn: 0.25,
    insetBottomIn: 0.25,
  }
  barcode.xIn = back.live.xIn + back.live.widthIn - barcode.insetRightIn - barcode.widthIn
  barcode.yIn = back.live.yIn + barcode.insetBottomIn

  /** KDP commonly omits spine text on thin books; we gate by page count (verify live calculator). */
  const spineTextMinPages = 80
  const spineTextAllowed = Number(pageCount) >= spineTextMinPages

  return {
    trimId,
    pageCount: Number(pageCount),
    paperTypeId: paper.id,
    dpi: d,
    bleedInches: bleed,
    trim,
    widthPx,
    heightPx,
    widthIn,
    heightIn,
    spinePx,
    spineIn: spineInExact,
    panelW,
    panelWIn,
    back,
    spine,
    front,
    barcode,
    spineTextAllowed,
    spineTextMinPages,
    note: 'Verify final wrap size in the current Amazon KDP cover calculator before upload.',
  }
}

export function preflightImageResolution(imageWidthPx, imageHeightPx, trimId) {
  const req = requiredBleedPixels(trimId)
  const ok = imageWidthPx >= req.widthPx && imageHeightPx >= req.heightPx
  return {
    ok,
    severity: ok ? 'pass' : 'block',
    required: { widthPx: req.widthPx, heightPx: req.heightPx },
    actual: { widthPx: imageWidthPx, heightPx: imageHeightPx },
    message: ok
      ? 'Image meets minimum print resolution for trim + bleed @ configured DPI.'
      : `Image under-resolution: need at least ${req.widthPx}×${req.heightPx}px for this trim at ${req.dpi} DPI with bleed.`,
  }
}

export function validatePageCount(pageCount) {
  const { min, max, mustBeEven } = PUBLISHING_SPECS.pageCount
  const n = Number(pageCount)
  const errors = []
  if (!Number.isInteger(n)) errors.push('Page count must be an integer')
  if (n < min || n > max) errors.push(`Page count must be between ${min} and ${max}`)
  if (mustBeEven && n % 2 !== 0) errors.push('Page count must be even for print books')
  return { ok: errors.length === 0, errors }
}
