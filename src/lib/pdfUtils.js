import { jsPDF } from 'jspdf'
import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { buildEpcQrPayload, epcQrImageUrl } from '@/lib/docdraft/epcQr'

export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function generateScanPdf(pages, title = 'ScanLogic Document') {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    pdf.setFontSize(10)
    pdf.text(title, 10, 10)
    try {
      const img = await loadImageData(pages[i])
      const ratio = Math.min((pageW - 20) / img.w, (pageH - 30) / img.h)
      const w = img.w * ratio
      const h = img.h * ratio
      pdf.addImage(pages[i], 'JPEG', (pageW - w) / 2, 15, w, h)
    } catch {
      pdf.text('Image could not be embedded', 10, 40)
    }
  }
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}

export async function generateInvoicePdf(doc, profile) {
  const pdf = new jsPDF()
  let y = 20
  const isKu = profile?.is_kleinunternehmer

  pdf.setFontSize(16)
  pdf.text(profile?.company_name || 'DocDraft', 20, y)
  y += 10
  pdf.setFontSize(10)
  if (profile?.steuernummer) pdf.text(`St.-Nr.: ${profile.steuernummer}`, 20, y)
  if (profile?.ust_id_nr) {
    y += 5
    pdf.text(`USt-IdNr.: ${profile.ust_id_nr}`, 20, y)
  }
  y += 15
  pdf.setFontSize(14)
  pdf.text(`${doc.document_type?.toUpperCase()} ${doc.document_number}`, 20, y)
  y += 10
  pdf.setFontSize(10)
  pdf.text(`Datum: ${doc.issue_date}`, 20, y)
  y += 15

  ;(doc.line_items || []).forEach((item) => {
    const line = `${item.description} — ${item.quantity}x ${item.unit_price}€ (netto) = ${item.total_gross ?? item.total}€`
    pdf.text(line, 20, y)
    y += 7
  })

  y += 5
  pdf.text(`Netto: ${doc.subtotal_net?.toFixed(2)} €`, 20, y)
  y += 6
  pdf.text(`MwSt: ${doc.total_vat?.toFixed(2)} €`, 20, y)
  y += 6
  pdf.text(`Brutto: ${doc.total_gross?.toFixed(2)} €`, 20, y)

  if (profile?.iban && doc.document_type === 'invoice') {
    try {
      const payload = buildEpcQrPayload({
        iban: profile.iban,
        bic: profile.bic,
        name: profile.company_name,
        amount: doc.total_gross,
        reference: doc.document_number,
      })
      const qrUrl = epcQrImageUrl(payload)
      const img = await loadImageData(qrUrl)
      pdf.addImage(qrUrl, 'PNG', 140, y, 40, 40)
      y += 45
      pdf.setFontSize(8)
      pdf.text('SEPA QR payment', 140, y)
    } catch {
      /* QR optional */
    }
  }

  if (isKu || doc.legal_footnote) {
    y += 12
    pdf.setFontSize(8)
    pdf.text(doc.legal_footnote || KLEINUNTERNEHMER_FOOTNOTE, 20, y, { maxWidth: 170 })
  }

  pdf.save(`${doc.document_number}.pdf`)
}

function loadImageData(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.width, h: img.height })
    img.onerror = reject
    img.src = src
  })
}
