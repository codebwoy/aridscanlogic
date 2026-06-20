import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { buildEpcQrPayload, epcQrImageUrl } from '@/lib/docdraft/epcQr'
import {
  createBrandedPdf,
  drawBrandedHeader,
  drawSectionTitle,
  drawFieldRow,
  drawBodyParagraph,
  ensureSpace,
  applyBrandedFooters,
  PDF_THEME,
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

export async function generateScanPdf(pages, title = 'ScanLogic Document') {
  const pdf = createBrandedPdf()
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage()
    drawBrandedHeader(pdf, {
      title: title,
      subtitle: `Seite ${i + 1} von ${pages.length}`,
      module: 'Docs',
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
  applyBrandedFooters(pdf)
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}

export async function generateInvoicePdf(doc, profile) {
  const pdf = createBrandedPdf()
  const isKu = profile?.is_kleinunternehmer || profile?.isKleinunternehmer
  const company = profile?.company_name || profile?.businessName || 'DocDraft'

  let y = drawBrandedHeader(pdf, {
    title: `${doc.document_type?.toUpperCase() || 'DOCUMENT'} ${doc.document_number}`,
    subtitle: company,
    module: 'DocDraft',
  })

  if (profile?.steuernummer) y = drawFieldRow(pdf, y, 'St.-Nr.', profile.steuernummer, { alt: true })
  if (profile?.ust_id_nr || profile?.ustIdNr) {
    y = drawFieldRow(pdf, y, 'USt-IdNr.', profile.ust_id_nr || profile.ustIdNr)
  }
  y = drawFieldRow(pdf, y, 'Datum', doc.issue_date, { alt: true })

  y = drawSectionTitle(pdf, y + 4, 'Positionen')
  ;(doc.line_items || []).forEach((item, i) => {
    y = ensureSpace(pdf, y, 10, { title: doc.document_number, module: 'DocDraft' })
    y = drawFieldRow(
      pdf,
      y,
      `${item.quantity}×`,
      `${item.description} — ${item.unit_price}€ netto = ${item.total_gross ?? item.total}€`,
      { alt: i % 2 === 0 }
    )
  })

  y = drawSectionTitle(pdf, y + 4, 'Summen')
  y = drawFieldRow(pdf, y, 'Netto', `${doc.subtotal_net?.toFixed(2)} €`, { alt: true })
  y = drawFieldRow(pdf, y, 'MwSt', `${doc.total_vat?.toFixed(2)} €`)
  y = drawFieldRow(pdf, y, 'Brutto', `${doc.total_gross?.toFixed(2)} €`, { alt: true })

  if (profile?.iban && doc.document_type === 'invoice') {
    try {
      const payload = buildEpcQrPayload({
        iban: profile.iban,
        bic: profile.bic,
        name: company,
        amount: doc.total_gross,
        reference: doc.document_number,
      })
      const qrUrl = epcQrImageUrl(payload)
      await loadImageData(qrUrl)
      if (y + 48 > PDF_THEME.footerY) {
        pdf.addPage()
        y = drawBrandedHeader(pdf, { title: 'SEPA-Zahlung', module: 'DocDraft' })
      }
      pdf.addImage(qrUrl, 'PNG', PDF_THEME.margin + 100, y, 40, 40)
      drawBodyParagraph(pdf, y + 42, 'SEPA QR-Zahlung')
      y += 50
    } catch {
      /* QR optional */
    }
  }

  if (isKu || doc.legal_footnote) {
    y = ensureSpace(pdf, y, 16, { module: 'DocDraft' })
    drawBodyParagraph(pdf, y, doc.legal_footnote || KLEINUNTERNEHMER_FOOTNOTE)
  }

  applyBrandedFooters(pdf, 'DocDraft — Rechnungsentwurf. Steuerliche Prüfung durch Steuerberater empfohlen.')
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
