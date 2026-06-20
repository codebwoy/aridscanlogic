import JSZip from 'jszip'
import { downloadTextFile } from '@/lib/pdfUtils'
import { hasWatermark } from './limits'
import {
  createBrandedPdf,
  drawBrandedHeader,
  drawBodyParagraph,
  applyBrandedFooters,
  PDF_THEME,
} from '@/lib/pdf/brandedPdf'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function exportDocumentPdf(doc, user, title) {
  const pdf = createBrandedPdf()
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const pages = doc.pages || []
  const watermark = hasWatermark(user)

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    const src = pages[i].processedImageUrl || pages[i].imageUrl
    drawBrandedHeader(pdf, {
      title: title || doc.name || 'Scan',
      subtitle: `Seite ${i + 1} von ${pages.length}`,
      module: 'ScanVault',
    })
    try {
      const img = await loadImage(src)
      const ratio = Math.min((pageW - 24) / img.width, (pageH - 55) / img.height)
      const w = img.width * ratio
      const h = img.height * ratio
      pdf.addImage(src, 'JPEG', (pageW - w) / 2, 42, w, h)
    } catch {
      drawBodyParagraph(pdf, 42, 'Seite konnte nicht eingebettet werden.')
    }
    if (watermark) {
      pdf.setFontSize(7)
      pdf.setTextColor(...PDF_THEME.slate500)
      pdf.text('ScanVault Free', pageW - 35, pageH - 8)
    }
  }
  if (doc.extractedText) {
    pdf.addPage()
    let y = drawBrandedHeader(pdf, {
      title: title || doc.name || 'Scan',
      subtitle: 'Extrahierter Text',
      module: 'ScanVault',
    })
    drawBodyParagraph(pdf, y, doc.extractedText.slice(0, 8000))
  }
  applyBrandedFooters(pdf)
  pdf.save(`${(title || doc.name || 'scan').replace(/\s+/g, '_')}.pdf`)
}

export function exportDocumentText(doc) {
  downloadTextFile(doc.extractedText || '', `${doc.name || 'scan'}.txt`)
}

export function downloadPageImages(doc) {
  ;(doc.pages || []).forEach((p, i) => {
    const a = window.document.createElement('a')
    a.href = p.processedImageUrl || p.imageUrl
    a.download = `${doc.name || 'scan'}_page_${i + 1}.jpg`
    setTimeout(() => a.click(), i * 400)
  })
}

function safeName(name) {
  return (name || 'scan').replace(/[^\w-]/g, '_').slice(0, 48)
}

async function blobFromDataUrl(url) {
  if (url.startsWith('data:')) {
    const res = await fetch(url)
    return res.blob()
  }
  const res = await fetch(url)
  return res.blob()
}

/** Batch ZIP: one folder per document with pages + optional OCR text */
export async function exportDocumentsZip(documents, user) {
  const zip = new JSZip()
  const watermark = hasWatermark(user)
  let count = 0

  for (const doc of documents) {
    const folder = zip.folder(safeName(doc.name))
    if (doc.extractedText) {
      folder.file('ocr.txt', doc.extractedText)
    }
    const pages = doc.pages || []
    for (let i = 0; i < pages.length; i++) {
      const src = pages[i].processedImageUrl || pages[i].imageUrl
      if (!src) continue
      try {
        folder.file(`page_${i + 1}.jpg`, await blobFromDataUrl(src))
        count++
      } catch {
        /* skip */
      }
    }
    if (watermark) folder.file('_watermark.txt', 'ScanVault Free — upgrade to remove watermark on PDF exports')
  }

  if (count === 0) throw new Error('No images to export')
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `scanvault_batch_${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

/** Single document as ZIP (pages + OCR + metadata) */
export async function exportDocumentZip(doc) {
  const zip = new JSZip()
  zip.file(
    'meta.json',
    JSON.stringify({
      name: doc.name,
      pageCount: doc.pageCount,
      createdAt: doc.createdAt,
    })
  )
  if (doc.extractedText) zip.file('ocr.txt', doc.extractedText)
  const pages = doc.pages || []
  for (let i = 0; i < pages.length; i++) {
    const src = pages[i].processedImageUrl || pages[i].imageUrl
    if (!src) continue
    try {
      zip.file(`page_${i + 1}.jpg`, await blobFromDataUrl(src))
    } catch {
      /* skip */
    }
  }
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName(doc.name)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}
