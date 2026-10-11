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
 * Cover wrap width = back + spine + front, each with bleed on outer edges.
 * Simplified: (trimW + bleed)*2 + spine, height = trimH + 2*bleed.
 */
export function coverWrapPixels(trimId, pageCount, paperTypeId) {
  const page = requiredBleedPixels(trimId)
  const spinePx = spineWidthPixels(pageCount, paperTypeId, page.dpi)
  const trim = getTrimSize(trimId)
  const bleed = PUBLISHING_SPECS.bleedInches
  const d = page.dpi
  // Front and back each: trim + outer bleed; spine has no horizontal bleed double-count
  const panelW = Math.ceil((trim.width + bleed) * d)
  return {
    widthPx: panelW * 2 + spinePx,
    heightPx: page.heightPx,
    spinePx,
    panelW,
    dpi: d,
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
