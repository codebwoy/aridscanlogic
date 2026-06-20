import appApi from '@/lib/appApi'
import { capImageDataUrl } from '@/lib/imageProcessing'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'

export const DOCUMENT_TYPES = [
  'Invoice',
  'Receipt',
  'Contract',
  'Letter',
  'Note',
  'Other',
]

/** JSON schema for structured OCR + classification + markdown */
export const SCAN_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    ocr_text: { type: 'string', description: 'Full extracted plain text' },
    document_type: {
      type: 'string',
      enum: DOCUMENT_TYPES,
      description: 'Classified document type',
    },
    title: { type: 'string', description: 'Suggested document title' },
    markdown_result: {
      type: 'string',
      description: 'Formatted markdown with headings, lists, tables',
    },
  },
  required: ['ocr_text', 'document_type', 'markdown_result'],
}

/**
 * Upload finalized canvas JPEG DataURLs as File objects → permanent storage URLs.
 */
export async function uploadScanPages(dataUrlPages) {
  const urls = []
  for (let i = 0; i < dataUrlPages.length; i++) {
    urls.push(await capImageDataUrl(dataUrlPages[i]))
  }
  return urls
}

/**
 * AI analysis: page URLs → OCR, document type, markdown (response_json_schema).
 */
export async function analyzeScannedDocument(pageUrls, language = 'de') {
  const prompt = `${aiLanguageInstruction(language)}

You are a German document OCR and classification system.
Analyze ALL provided scanned page images.
1. Extract complete OCR text (preserve German umlauts).
2. Classify document_type as one of: ${DOCUMENT_TYPES.join(', ')}.
3. Suggest a concise title.
4. Produce markdown_result with proper Markdown structure (headings, lists, tables if applicable).

Return structured JSON matching the schema.`

  const res = await appApi.integrations.Core.InvokeLLM({
    prompt,
    file_urls: pageUrls,
    response_json_schema: SCAN_ANALYSIS_SCHEMA,
  })

  const parsed = res?.parsed || res?.data || {}
  return {
    ocr_text: parsed.ocr_text || res?.text || '',
    document_type: parsed.document_type || 'Other',
    title: parsed.title || 'Scan',
    markdown_result:
      parsed.markdown_result ||
      res?.text ||
      `# Scan\n\n${parsed.ocr_text || ''}`,
  }
}
