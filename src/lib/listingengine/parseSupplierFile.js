/**
 * Extract plain text from supplier PDF / DOCX / TXT / CSV (client-side).
 */

import { getMaxUploadBytes } from './schema'

const TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'text/csv'])

export class SupplierParseError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'SupplierParseError'
    this.code = code
  }
}

function looksLikePdf(file, buffer) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return true
  if (!buffer || buffer.byteLength < 5) return false
  const head = new TextDecoder('latin1').decode(buffer.slice(0, 5))
  return head === '%PDF-'
}

function looksLikeDocx(file) {
  return (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    /\.docx$/i.test(file.name)
  )
}

function extractTextFromPdfBuffer(buffer) {
  const latin1 = new TextDecoder('latin1').decode(buffer)
  const chunks = []
  const parenRe = /\((?:\\.|[^\\)])+\)/g
  let m
  while ((m = parenRe.exec(latin1))) {
    let s = m[0].slice(1, -1)
    s = s
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
    if (s.trim().length > 1) chunks.push(s)
  }
  const text = chunks.join(' ').replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  const letterCount = (text.match(/[A-Za-zÄÖÜäöüß]/g) || []).length
  if (letterCount < 40) return ''
  return text
}

async function extractDocx(buffer) {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return String(result?.value || '').trim()
  } catch {
    throw new SupplierParseError(
      'DOCX_UNSUPPORTED',
      'DOCX konnte nicht gelesen werden. Bitte als TXT/PDF speichern oder Text einfügen.'
    )
  }
}

export async function extractTextFromSupplierFile(file) {
  if (!file) throw new SupplierParseError('NO_FILE', 'Keine Datei ausgewählt.')
  if (file.size > getMaxUploadBytes()) {
    throw new SupplierParseError('TOO_LARGE', 'Datei zu groß (max. 5 MB).')
  }

  const buffer = await file.arrayBuffer()

  if (TEXT_TYPES.has(file.type) || /\.(txt|md|csv)$/i.test(file.name)) {
    const text = new TextDecoder('utf-8').decode(buffer).trim()
    if (text.length < 20) {
      throw new SupplierParseError('TOO_SHORT', 'Datei enthält zu wenig Text.')
    }
    return { text, filename: file.name }
  }

  if (looksLikeDocx(file)) {
    const text = await extractDocx(buffer)
    if (text.length < 20) {
      throw new SupplierParseError('TOO_SHORT', 'DOCX enthält zu wenig Text.')
    }
    return { text, filename: file.name }
  }

  if (looksLikePdf(file, buffer)) {
    const text = extractTextFromPdfBuffer(buffer)
    if (!text) {
      throw new SupplierParseError(
        'PDF_SCANNED',
        'PDF scheint gescannt/bildbasiert — bitte Text manuell einfügen oder OCR nutzen (Docs).'
      )
    }
    return { text, filename: file.name }
  }

  throw new SupplierParseError(
    'UNSUPPORTED',
    'Nicht unterstütztes Format. Bitte TXT, CSV, PDF oder DOCX verwenden.'
  )
}
