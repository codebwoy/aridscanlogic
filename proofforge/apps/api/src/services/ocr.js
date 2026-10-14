/**
 * OCR fallback for scanned / thin-text PDFs.
 * Renders pages with pdfjs + @napi-rs/canvas, then tesseract.js.
 * Labels OCR-derived text; reports confidence; caps pages for cost/latency.
 */

const MAX_OCR_PAGES = Number(process.env.PROOFFORGE_OCR_MAX_PAGES || 40)

export async function ocrPdfBuffer(buf, { maxPages = MAX_OCR_PAGES } = {}) {
  const warnings = []
  let canvasMod
  let createWorker
  try {
    canvasMod = await import('@napi-rs/canvas')
    ;({ createWorker } = await import('tesseract.js'))
  } catch (err) {
    return {
      ok: false,
      text: '',
      warnings: [`OCR dependencies unavailable: ${err.message}`],
      page_count: 0,
      ocr: true,
      confidence: 0,
    }
  }

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableWorker: true,
  }).promise

  const pageCount = doc.numPages
  const limit = Math.min(pageCount, maxPages)
  if (pageCount > maxPages) {
    warnings.push(`OCR limited to first ${maxPages} of ${pageCount} pages (PROOFFORGE_OCR_MAX_PAGES).`)
  }

  const worker = await createWorker('eng')
  const pages = []
  let confSum = 0
  let confN = 0

  try {
    for (let i = 1; i <= limit; i++) {
      const page = await doc.getPage(i)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = canvasMod.createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      const png = canvas.toBuffer('image/png')
      const result = await worker.recognize(png)
      const text = String(result.data?.text || '').trim()
      const conf = Number(result.data?.confidence || 0)
      confSum += conf
      confN += 1
      pages.push(`<!-- OCR_PAGE:${i} conf:${conf.toFixed(1)} -->\n${text}`)
    }
  } finally {
    await worker.terminate()
  }

  const avgConf = confN ? confSum / confN : 0
  const text = pages.join('\n\n').trim()
  warnings.push(
    `OCR-derived text from ${limit} page(s). Avg confidence ${avgConf.toFixed(1)}%. Verify against original PDF.`
  )
  if (avgConf < 55) {
    warnings.push(
      'OCR confidence is low — prefer a better source file (text PDF or DOCX) before publication audit.'
    )
  }

  return {
    ok: Boolean(text),
    text,
    warnings,
    page_count: pageCount,
    ocr: true,
    confidence: Number(avgConf.toFixed(1)),
  }
}
