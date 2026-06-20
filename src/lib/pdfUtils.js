import { exportInvoicePdf } from '@/lib/docdraft/exportInvoicePdf'
import {
  createBrandedPdf,
  drawBrandedHeader,
  drawBodyParagraph,
  applyBrandedFooters,
} from '@/lib/pdf/brandedPdf'

export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function generateScanPdf(pages, title = 'ScanLogic Document', { branding } = {}) {
  const pdf = createBrandedPdf()
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    drawBrandedHeader(pdf, {
      title: title,
      subtitle: `Seite ${i + 1} von ${pages.length}`,
      module: 'Docs',
      branding,
    })
    try {
      const img = await loadImageData(pages[i])
      const ratio = Math.min((pageW - 24) / img.w, (pageH - 55) / img.h)
      const w = img.w * ratio
      const h = img.h * ratio
      pdf.addImage(pages[i], 'JPEG', (pageW - w) / 2, 42, w, h)
    } catch {
      drawBodyParagraph(pdf, 42, 'Bild konnte nicht eingebettet werden.')
    }
  }
  applyBrandedFooters(pdf, undefined, { branding })
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}

export async function generateInvoicePdf(doc, profile, client, options = {}) {
  return exportInvoicePdf(doc, profile, client, options)
}

function loadImageData(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.width, h: img.height })
    img.onerror = reject
    img.src = src
  })
}
