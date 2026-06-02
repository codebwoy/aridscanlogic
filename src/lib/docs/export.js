import { jsPDF } from 'jspdf'
import JSZip from 'jszip'

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
  const pdf = new jsPDF()
  const pages = doc.pages || []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    try {
      const img = await loadImage(pages[i])
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const ratio = Math.min((pageW - 20) / img.width, (pageH - 30) / img.height)
      const w = img.width * ratio
      const h = img.height * ratio
      pdf.addImage(pages[i], 'JPEG', (pageW - w) / 2, 15, w, h)
    } catch {
      pdf.text('Page could not be embedded', 10, 40)
    }
  }
  if (doc.ocr_text) {
    pdf.addPage()
    pdf.setFontSize(10)
    pdf.text(doc.title || 'Scan', 10, 15)
    pdf.text(pdf.splitTextToSize(doc.ocr_text.slice(0, 12000), 180), 10, 25)
  }
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
