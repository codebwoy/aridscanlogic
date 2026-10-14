/**
 * Manuscript ingestion — TXT / MD / DOCX / PDF (text layer + OCR fallback) / EPUB.
 * Never trust client MIME alone. Thin/empty PDF text → optional OCR (tesseract).
 */

import { createHash } from 'node:crypto'
import mammoth from 'mammoth'
import JSZip from 'jszip'
import { ocrPdfBuffer } from './ocr.js'

const MAX_BYTES = 12_000_000
const OCR_CHARS_PER_PAGE = 40

export function sniffFormat(filename = '', mime = '', bytes) {
  const name = String(filename || '').toLowerCase()
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.txt') || name.endsWith('.md')) return 'txt'
  if (name.endsWith('.epub')) return 'epub'
  if (name.endsWith('.pdf')) return 'pdf'
  if (mime.includes('wordprocessingml')) return 'docx'
  if (mime.includes('epub')) return 'epub'
  if (mime.includes('pdf')) return 'pdf'
  if (mime.includes('text/')) return 'txt'
  if (bytes && bytes.length >= 5) {
    const head = bytes.slice(0, 5).toString('utf8')
    if (head.startsWith('%PDF')) return 'pdf'
    if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
      // zip — could be docx or epub; prefer filename else docx
      return name.includes('epub') ? 'epub' : 'docx'
    }
  }
  return 'txt'
}

async function extractPdf(buf, { enableOcr = true } = {}) {
  const warnings = []
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const doc = await pdfjs.getDocument({
      data: new Uint8Array(buf),
      useSystemFonts: true,
      disableWorker: true,
    }).promise
    const pages = []
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const line = content.items.map((it) => it.str).join(' ')
      pages.push(line)
    }
    let text = pages.join('\n\n').replace(/[ \t]+/g, ' ').trim()
    const charsPerPage = text.length / Math.max(1, doc.numPages)
    const thin = charsPerPage < OCR_CHARS_PER_PAGE || !text

    if (thin && enableOcr) {
      warnings.push(
        'PDF text layer is thin or empty — running OCR fallback (tesseract). Prefer DOCX/text PDF when possible.'
      )
      const ocr = await ocrPdfBuffer(buf)
      warnings.push(...(ocr.warnings || []))
      if (ocr.ok && ocr.text) {
        return {
          text: ocr.text,
          warnings,
          page_count: ocr.page_count || doc.numPages,
          ocr: true,
          ocr_confidence: ocr.confidence,
        }
      }
      if (!text) {
        return {
          text: '',
          warnings,
          page_count: doc.numPages,
          ocr: true,
          ocr_confidence: ocr.confidence || 0,
          unsupported: true,
        }
      }
    } else if (thin) {
      warnings.push(
        'PDF text layer is very thin — file may be scanned. Pass enable_ocr:true (default) or upload DOCX/TXT.'
      )
    }
    warnings.push(
      `Extracted selectable text from ${doc.numPages} PDF page(s). Layout/reading-order may differ from visual pages.`
    )
    return { text, warnings, page_count: doc.numPages, ocr: false }
  } catch (err) {
    warnings.push(`PDF extraction failed: ${err.message}`)
    if (enableOcr) {
      try {
        const ocr = await ocrPdfBuffer(buf)
        warnings.push(...(ocr.warnings || []))
        if (ocr.ok && ocr.text) {
          return {
            text: ocr.text,
            warnings,
            page_count: ocr.page_count,
            ocr: true,
            ocr_confidence: ocr.confidence,
          }
        }
      } catch (ocrErr) {
        warnings.push(`OCR fallback failed: ${ocrErr.message}`)
      }
    }
    return { text: '', warnings, page_count: 0, ocr: false, unsupported: true }
  }
}

async function extractEpub(buf) {
  const warnings = []
  const zip = await JSZip.loadAsync(buf)
  const names = Object.keys(zip.files).filter((n) => /\.(xhtml|html|htm)$/i.test(n))
  names.sort()
  const chunks = []
  for (const name of names.slice(0, 200)) {
    const raw = await zip.files[name].async('string')
    const text = raw
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length > 20) chunks.push(text)
  }
  if (!chunks.length) warnings.push('EPUB contained no extractable XHTML text.')
  else warnings.push(`Extracted text from ${chunks.length} EPUB HTML documents.`)
  return { text: chunks.join('\n\n'), warnings }
}

/**
 * @param {{ filename?: string, mime?: string, base64?: string, text?: string, enable_ocr?: boolean }} input
 */
export async function extractManuscript(input = {}) {
  if (input.text && String(input.text).trim()) {
    const text = String(input.text)
    return {
      format: 'txt',
      text,
      warnings: [],
      bytes: Buffer.byteLength(text, 'utf8'),
      sha256: createHash('sha256').update(text, 'utf8').digest('hex'),
    }
  }

  if (!input.base64) {
    const err = new Error('Provide manuscript text or base64 file')
    err.status = 400
    throw err
  }

  const buf = Buffer.from(String(input.base64), 'base64')
  if (buf.length > MAX_BYTES) {
    const err = new Error('File too large (max 12MB)')
    err.status = 413
    throw err
  }

  const sha256 = createHash('sha256').update(buf).digest('hex')
  const format = sniffFormat(input.filename, input.mime, buf)
  let warnings = []
  let text = ''
  let meta = {}
  const enableOcr = input.enable_ocr !== false && process.env.PROOFFORGE_OCR !== '0'

  if (format === 'pdf') {
    const r = await extractPdf(buf, { enableOcr })
    text = r.text
    warnings = r.warnings
    meta = {
      page_count: r.page_count,
      ocr: Boolean(r.ocr),
      ocr_confidence: r.ocr_confidence,
    }
    if (!text) {
      return { format, text: '', warnings, bytes: buf.length, sha256, unsupported: true, ...meta }
    }
    return { format, text, warnings, bytes: buf.length, sha256, ...meta }
  }

  if (format === 'epub') {
    const r = await extractEpub(buf)
    text = r.text
    warnings = r.warnings
    if (!text) return { format, text: '', warnings, bytes: buf.length, sha256, unsupported: true }
    return { format, text, warnings, bytes: buf.length, sha256 }
  }

  if (format === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer: buf })
      text = String(result.value || '').trim()
      if (result.messages?.length) {
        warnings.push(...result.messages.map((m) => m.message).slice(0, 10))
      }
      if (!text) warnings.push('DOCX produced empty text — check file integrity.')
      return { format: 'docx', text, warnings, bytes: buf.length, sha256 }
    } catch (err) {
      const e = new Error(`DOCX extraction failed: ${err.message}`)
      e.status = 400
      throw e
    }
  }

  text = buf.toString('utf8')
  if (text.includes('\u0000')) warnings.push('Binary nulls detected — file may not be plain text.')
  return { format: 'txt', text, warnings, bytes: buf.length, sha256 }
}
