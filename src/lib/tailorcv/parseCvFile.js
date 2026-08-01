/**
 * Extract plain text from uploaded CV files (client-side).
 * PDF: best-effort binary string scan + clear failure for scanned/image PDFs.
 * DOCX: mammoth when available; otherwise clear error.
 */

import { getMaxUploadBytes } from './schema'

const TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'text/csv'])

export class CvParseError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CvParseError'
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

function looksLikeDoc(file) {
  return file.type === 'application/msword' || /\.doc$/i.test(file.name)
}

/** Pull readable strings from PDF content streams (no full PDF.js dependency). */
function extractTextFromPdfBuffer(buffer) {
  const latin1 = new TextDecoder('latin1').decode(buffer)
  const chunks = []

  // Common literal strings in ( ... ) operators
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
      .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    if (s.trim().length > 1) chunks.push(s)
  }

  // Tj / TJ style fragments often appear as (... )Tj
  const tjRe = /\((?:\\.|[^\\)])+\)\s*Tj/gi
  while ((m = tjRe.exec(latin1))) {
    const inner = m[0].replace(/\)\s*Tj$/i, '').slice(1)
    if (inner.trim().length > 1) chunks.push(inner)
  }

  const text = chunks
    .join(' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Heuristic: too short → likely scanned / compressed streams only
  const letterCount = (text.match(/[A-Za-zÄÖÜäöüß]/g) || []).length
  if (letterCount < 40) return ''
  return text
}

async function extractDocx(buffer) {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return String(result?.value || '').trim()
  } catch (err) {
    if (err?.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find module|Failed to fetch/.test(String(err))) {
      throw new CvParseError(
        'DOCX_UNSUPPORTED',
        'DOCX-Unterstützung ist noch nicht installiert. Bitte Text einfügen oder als .txt speichern.'
      )
    }
    throw new CvParseError(
      'DOCX_PARSE_FAILED',
      'DOCX konnte nicht gelesen werden. Bitte Text manuell einfügen.'
    )
  }
}

/**
 * @param {File} file
 * @returns {Promise<{ text: string, filename: string, format: string }>}
 */
export async function extractTextFromCvFile(file) {
  if (!file) {
    throw new CvParseError('NO_FILE', 'Keine Datei ausgewählt.')
  }
  if (file.size > getMaxUploadBytes()) {
    throw new CvParseError(
      'FILE_TOO_LARGE',
      'Datei zu groß (max. 5 MB). Bitte eine kleinere Datei wählen.'
    )
  }

  if (looksLikeDoc(file) && !looksLikeDocx(file)) {
    throw new CvParseError(
      'DOC_UNSUPPORTED',
      'Altes .doc-Format wird nicht unterstützt. Bitte als .docx, PDF oder Text speichern.'
    )
  }

  const buffer = await file.arrayBuffer()

  if (TEXT_TYPES.has(file.type) || /\.(txt|md|csv)$/i.test(file.name)) {
    const text = new TextDecoder('utf-8').decode(buffer).trim()
    if (!text) {
      throw new CvParseError('EMPTY_TEXT', 'Die Datei enthält keinen Text.')
    }
    return { text, filename: file.name, format: 'text' }
  }

  if (looksLikeDocx(file)) {
    const text = await extractDocx(buffer)
    if (!text || text.length < 20) {
      throw new CvParseError(
        'DOCX_EMPTY',
        'Aus der DOCX konnte kaum Text gelesen werden. Bitte Text manuell einfügen.'
      )
    }
    return { text, filename: file.name, format: 'docx' }
  }

  if (looksLikePdf(file, buffer)) {
    const text = extractTextFromPdfBuffer(buffer)
    if (!text) {
      throw new CvParseError(
        'PDF_NO_TEXT',
        'PDF ohne extrahierbaren Text (z. B. Scan). Bitte textbasiertes PDF, DOCX, oder Text einfügen — alternativ Docs-OCR nutzen.'
      )
    }
    return { text, filename: file.name, format: 'pdf' }
  }

  throw new CvParseError(
    'UNSUPPORTED_FORMAT',
    'Nicht unterstütztes Format. Erlaubt: PDF, DOCX, TXT.'
  )
}
