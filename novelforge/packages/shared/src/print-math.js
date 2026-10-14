import { PUBLISHING_SPECS, spineWidthInches } from './publishing-specs.js'

export function trimToPoints(trimId = PUBLISHING_SPECS.defaultTrimId) {
  const t = PUBLISHING_SPECS.trimSizes[trimId] || PUBLISHING_SPECS.trimSizes['6x9']
  return { width: t.widthIn * 72, height: t.heightIn * 72, inches: t }
}

export function coverWrapLayout({ trimId, pageCount, paperType = 'white' }) {
  const trim = trimToPoints(trimId)
  const bleed = PUBLISHING_SPECS.bleedInches * 72
  const spine = spineWidthInches(pageCount, paperType) * 72
  const width = bleed + trim.width + spine + trim.width + bleed
  const height = bleed + trim.height + bleed
  return {
    widthPt: width,
    heightPt: height,
    bleedPt: bleed,
    spinePt: spine,
    trimWidthPt: trim.width,
    trimHeightPt: trim.height,
    barcodeReserve: { widthPt: 2 * 72, heightPt: 1.2 * 72 },
    note: PUBLISHING_SPECS.spineFormulaNote,
  }
}

export function interiorMargins({ pageCount = 200 } = {}) {
  const gutterExtra = pageCount > 300 ? 0.25 : pageCount > 150 ? 0.15 : 0.1
  return {
    outerIn: 0.5,
    topIn: 0.75,
    bottomIn: 0.75,
    gutterIn: 0.75 + gutterExtra,
    note: 'Gutter increases with page count — verify against KDP manuscript guidelines.',
  }
}
