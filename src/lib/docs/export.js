import JSZip from 'jszip'
import {
  createBrandedPdf,
  drawBrandedHeader,
  drawBodyParagraph,
  applyBrandedFooters,
} from '@/lib/pdf/brandedPdf'

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function exportDocumentPdf(doc) {
  const pdf = createBrandedPdf()
  const pages = doc.pages || []
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    drawBrandedHeader(pdf, {
      title: doc.title || 'Scan',
      subtitle: `Seite ${i + 1} von ${pages.length}`,
      module: 'Docs',
    })
    try {
      const img = await loadImage(pages[i])
      const ratio = Math.min((pageW - 24) / img.width, (pageH - 55) / img.height)
      const w = img.width * ratio
      const h = img.height * ratio
      pdf.addImage(pages[i], 'JPEG', (pageW - w) / 2, 42, w, h)
    } catch {
      drawBodyParagraph(pdf, 42, 'Seite konnte nicht eingebettet werden.')
    }
  }
  if (doc.ocr_text) {
    pdf.addPage()
    let y = drawBrandedHeader(pdf, { title: doc.title || 'Scan', subtitle: 'OCR-Text', module: 'Docs' })
    drawBodyParagraph(pdf, y, doc.ocr_text.slice(0, 12000))
  }
  applyBrandedFooters(pdf)
  pdf.save(`${(doc.title || 'document').replace(/\s+/g, '_')}.pdf`)
}

export async function exportDocumentsZip(documents) {
  const zip = new JSZip()
  for (const doc of documents) {
    const folder = zip.folder((doc.title || 'doc').replace(/[^\w-]/g, '_').slice(0, 40))
    if (doc.ocr_text) folder.file('ocr.txt', doc.ocr_text)
    if (doc.markdown_result) folder.file('content.md', doc.markdown_result)
    ;(doc.pages || []).forEach((p, i) => {
      if (p.startsWith('data:')) {
        const base64 = p.split(',')[1]
        folder.file(`page_${i + 1}.jpg`, base64, { base64: true })
      }
    })
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `scanlogic_docs_${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}
