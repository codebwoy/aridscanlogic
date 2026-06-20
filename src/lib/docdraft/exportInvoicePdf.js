import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { amountToWords } from '@/lib/docdraft/amountInWords'
import { disclaimerForBranding } from '@/lib/documentBranding'
import { buildEpcQrPayload, epcQrImageUrl } from '@/lib/docdraft/epcQr'
import { applyBrandedFooters, createBrandedPdf, PDF_THEME } from '@/lib/pdf/brandedPdf'
import { BRAND_SUITE_NAME } from '@/lib/brand'
import {
  docT,
  docTypeLabels,
  formatDocumentDate,
  formatMoney,
  resolveDocumentLanguage,
  unitLabel,
} from './documentI18n'

const MARGIN = 18
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2
const FOOTER_Y = 272

const INK = [30, 41, 59]
const MUTED = [100, 116, 139]
const LINE = [226, 232, 240]
const BOX_BG = [248, 250, 252]

function recipientFrom(doc, client) {
  if (client) return client
  return {
    companyName: doc.recipient_name,
    contactName: doc.recipient_contact,
    billingAddress: doc.recipient_address,
    email: doc.recipient_email,
  }
}

function profileAddress(profile) {
  const street = [profile?.street, profile?.houseNumber].filter(Boolean).join(' ')
  const city = [profile?.plz, profile?.city].filter(Boolean).join(' ')
  return [street, city].filter(Boolean)
}

function ensureY(pdf, y, needed) {
  if (y + needed <= FOOTER_Y) return y
  pdf.addPage()
  return MARGIN + 8
}

function drawScanLogicBand(pdf, lang) {
  pdf.setFillColor(...PDF_THEME.brand900)
  pdf.rect(0, 0, PAGE_W, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.text(BRAND_SUITE_NAME, MARGIN, 6.5)
  pdf.setFont('helvetica', 'normal')
  pdf.text('DocDraft', MARGIN + 52, 6.5)
  return 16
}

function drawSenderBlock(pdf, y, profile, lang) {
  if (profile?.logoUrl) {
    try {
      pdf.addImage(profile.logoUrl, 'PNG', MARGIN, y, 28, 12)
      y += 14
    } catch {
      /* optional logo */
    }
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(...INK)
  pdf.text(profile?.businessName || profile?.company_name || '—', MARGIN, y)
  y += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...MUTED)
  profileAddress(profile).forEach((line) => {
    pdf.text(line, MARGIN, y)
    y += 4.2
  })

  if (profile?.steuernummer) {
    pdf.text(`${docT(lang, 'taxId')} ${profile.steuernummer}`, MARGIN, y)
    y += 4.2
  }
  const vatId = profile?.ustIdNr || profile?.ust_id_nr
  if (vatId) {
    pdf.text(`${docT(lang, 'vatId')} ${vatId}`, MARGIN, y)
    y += 4.2
  }

  if (profile?.email) {
    pdf.text(profile.email, MARGIN, y)
    y += 4.2
  }

  return y
}

function drawMetaBlock(pdf, y, doc, lang) {
  const type = docTypeLabels(doc.document_type, lang)
  const right = PAGE_W - MARGIN
  let metaY = y

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(...INK)
  pdf.text(type.title, right, metaY, { align: 'right' })
  metaY += 7

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...MUTED)

  const rows = [
    [docT(lang, 'number'), doc.document_number || '—'],
    [docT(lang, 'date'), formatDocumentDate(doc.issue_date, lang)],
  ]
  if (doc.delivery_date && doc.document_type !== 'receipt') {
    rows.push([docT(lang, 'deliveryDate'), formatDocumentDate(doc.delivery_date, lang)])
  }
  if (doc.due_date && !['receipt', 'delivery_note', 'quote'].includes(doc.document_type)) {
    rows.push([docT(lang, 'dueDate'), formatDocumentDate(doc.due_date, lang)])
  }
  if (doc.valid_until || doc.document_type === 'quote') {
    rows.push([docT(lang, 'validUntil'), formatDocumentDate(doc.valid_until, lang)])
  }

  rows.forEach(([label, value]) => {
    pdf.text(`${label}: ${value}`, right, metaY, { align: 'right' })
    metaY += 4.5
  })

  return Math.max(y + 18, metaY)
}

function drawRecipientBox(pdf, y, doc, client, lang) {
  y = ensureY(pdf, y, 22)
  const boxH = 20
  pdf.setFillColor(...BOX_BG)
  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, 'FD')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(...INK)
  pdf.text(docT(lang, 'recipient'), MARGIN + 4, y + 6)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...INK)
  let ty = y + 11
  const name = client?.companyName || client?.contactName || '—'
  pdf.text(name, MARGIN + 4, ty)
  ty += 4.2
  if (client?.contactName && client?.companyName) {
    pdf.text(client.contactName, MARGIN + 4, ty)
    ty += 4.2
  }
  if (client?.billingAddress) {
    const lines = pdf.splitTextToSize(client.billingAddress, CONTENT_W - 8)
    pdf.text(lines.slice(0, 2), MARGIN + 4, ty)
  }

  return y + boxH + 8
}

function drawTableHeader(pdf, y, { showPrices, showVat, lang }) {
  pdf.setDrawColor(...INK)
  pdf.setLineWidth(0.5)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 5

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(...MUTED)

  const cols = showPrices
    ? showVat
      ? [
          { label: docT(lang, 'description'), x: MARGIN, w: 78 },
          { label: docT(lang, 'quantity'), x: MARGIN + 78, w: 22, align: 'right' },
          { label: docT(lang, 'unitPrice'), x: MARGIN + 100, w: 24, align: 'right' },
          { label: docT(lang, 'vat'), x: MARGIN + 124, w: 16, align: 'right' },
          { label: docT(lang, 'total'), x: MARGIN + 140, w: 34, align: 'right' },
        ]
      : [
          { label: docT(lang, 'description'), x: MARGIN, w: 90 },
          { label: docT(lang, 'quantity'), x: MARGIN + 90, w: 24, align: 'right' },
          { label: docT(lang, 'unitPrice'), x: MARGIN + 114, w: 28, align: 'right' },
          { label: docT(lang, 'total'), x: MARGIN + 142, w: 32, align: 'right' },
        ]
    : [
        { label: docT(lang, 'description'), x: MARGIN, w: 130 },
        { label: docT(lang, 'quantity'), x: MARGIN + 130, w: 44, align: 'right' },
      ]

  cols.forEach((c) => {
    pdf.text(c.label, c.align === 'right' ? c.x + c.w : c.x, y, { align: c.align || 'left' })
  })

  y += 2
  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.25)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  return { y: y + 4, cols, showPrices, showVat }
}

function drawLineRow(pdf, y, line, layout, lang, currency) {
  const { cols, showPrices, showVat } = layout
  y = ensureY(pdf, y, 8)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...INK)

  const descLines = pdf.splitTextToSize(line.description || '—', cols[0].w - 2)
  pdf.text(descLines[0], cols[0].x, y)

  if (!showPrices) {
    const qty = `${line.quantity ?? 0} ${unitLabel(line.unit, lang)}`
    pdf.text(qty, cols[1].x + cols[1].w, y, { align: 'right' })
  } else if (showVat) {
    pdf.text(`${line.quantity ?? 0} ${unitLabel(line.unit, lang)}`, cols[1].x + cols[1].w, y, { align: 'right' })
    pdf.text(formatMoney(line.unit_price, currency, lang), cols[2].x + cols[2].w, y, { align: 'right' })
    pdf.text(`${line.vat_rate ?? 0}%`, cols[3].x + cols[3].w, y, { align: 'right' })
    pdf.text(formatMoney(line.total_gross ?? line.total, currency, lang), cols[4].x + cols[4].w, y, {
      align: 'right',
    })
  } else {
    pdf.text(`${line.quantity ?? 0} ${unitLabel(line.unit, lang)}`, cols[1].x + cols[1].w, y, { align: 'right' })
    pdf.text(formatMoney(line.unit_price, currency, lang), cols[2].x + cols[2].w, y, { align: 'right' })
    pdf.text(formatMoney(line.total_gross ?? line.total, currency, lang), cols[3].x + cols[3].w, y, {
      align: 'right',
    })
  }

  y += 5
  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.15)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  return y + 3
}

function drawTotals(pdf, y, doc, profile, lang) {
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'
  const isKu = profile?.isKleinunternehmer || profile?.is_kleinunternehmer
  const blockW = 62
  const x = MARGIN + CONTENT_W - blockW
  y = ensureY(pdf, y, 28)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...MUTED)
  pdf.text(`${docT(lang, 'net')}: ${formatMoney(doc.subtotal_net, currency, lang)}`, MARGIN + CONTENT_W, y, {
    align: 'right',
  })
  y += 5

  if (!isKu && doc.vat_breakdown) {
    Object.entries(doc.vat_breakdown).forEach(([rate, amt]) => {
      if (Number(rate) <= 0) return
      pdf.text(
        `${rate}% ${docT(lang, 'vat')}: ${formatMoney(amt, currency, lang)}`,
        MARGIN + CONTENT_W,
        y,
        { align: 'right' }
      )
      y += 4.5
    })
  } else if (!isKu && doc.total_vat != null) {
    pdf.text(
      `${docT(lang, 'vat')}: ${formatMoney(doc.total_vat, currency, lang)}`,
      MARGIN + CONTENT_W,
      y,
      { align: 'right' }
    )
    y += 4.5
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(...INK)
  pdf.text(
    `${docT(lang, 'gross')}: ${formatMoney(doc.total_gross, currency, lang)}`,
    MARGIN + CONTENT_W,
    y + 1,
    { align: 'right' }
  )
  return y + 10
}

function drawPaymentBlock(pdf, y, doc, profile, lang) {
  if (!profile?.iban) return y
  y = ensureY(pdf, y, 32)

  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.3)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 6

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(...INK)
  pdf.text(docT(lang, 'payment'), MARGIN, y)
  y += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(...MUTED)
  if (profile.bankName) {
    pdf.text(profile.bankName, MARGIN, y)
    y += 4
  }
  pdf.text(`IBAN: ${profile.iban}`, MARGIN, y)
  y += 4
  if (profile.bic) {
    pdf.text(`BIC: ${profile.bic}`, MARGIN, y)
    y += 4
  }
  pdf.text(`${docT(lang, 'reference')}: ${doc.document_number || '—'}`, MARGIN, y)
  y += 4
  const terms = doc.payment_terms || profile.defaultPaymentTerms
  if (terms) {
    pdf.text(terms, MARGIN, y)
    y += 4
  }
  return y + 4
}

async function drawSepaQr(pdf, y, doc, profile, lang, currency) {
  if (!profile?.iban || doc.document_type !== 'invoice') return y
  try {
    const company = profile.businessName || profile.company_name
    const payload = buildEpcQrPayload({
      iban: profile.iban,
      bic: profile.bic,
      name: company,
      amount: doc.total_gross,
      reference: doc.document_number,
    })
    const qrUrl = epcQrImageUrl(payload)
    await loadImage(qrUrl)
    y = ensureY(pdf, y, 48)
    pdf.addImage(qrUrl, 'PNG', MARGIN + CONTENT_W - 42, y, 38, 38)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(...MUTED)
    pdf.text(docT(lang, 'sepaQr'), MARGIN + CONTENT_W - 42, y + 42)
    return y + 46
  } catch {
    return y
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function exportInvoicePdf(doc, profile, client, { branding, lang: langOverride } = {}) {
  const lang = resolveDocumentLanguage(doc, profile, langOverride)
  const isKu = profile?.isKleinunternehmer || profile?.is_kleinunternehmer
  const isDelivery = doc.document_type === 'delivery_note'
  const isReceipt = doc.document_type === 'receipt'
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'
  const recipient = recipientFrom(doc, client)
  const pdf = createBrandedPdf()

  let y = MARGIN
  if (branding) {
    y = drawScanLogicBand(pdf, lang)
  }

  const headerStart = y
  drawMetaBlock(pdf, headerStart, doc, lang)
  y = drawSenderBlock(pdf, headerStart, profile, lang)
  y = Math.max(y, headerStart + 28) + 6

  if (doc.linked_invoice_number) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(180, 83, 9)
    pdf.text(`${docT(lang, 'linkedInvoice')} ${doc.linked_invoice_number}`, MARGIN, y)
    y += 6
  }

  y = drawRecipientBox(pdf, y, doc, recipient, lang)

  const layout = drawTableHeader(pdf, y, {
    showPrices: !isDelivery,
    showVat: !isDelivery && !isKu,
    lang,
  })
  y = layout.y

  ;(doc.line_items || []).forEach((line) => {
    y = drawLineRow(pdf, y, line, layout, lang, currency)
  })

  if (!isDelivery) {
    y = drawTotals(pdf, y, doc, profile, lang)
  }

  if (isReceipt && doc.total_gross) {
    const words = amountToWords(Math.abs(doc.total_gross))
    y = ensureY(pdf, y, 14)
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(8)
    pdf.setTextColor(...MUTED)
    pdf.text(`${docT(lang, 'amountInWords')}: ${lang === 'en' ? words.en : words.de}`, MARGIN, y)
    y += 8
  }

  y = drawPaymentBlock(pdf, y, doc, profile, lang)
  y = await drawSepaQr(pdf, y, doc, profile, lang, currency)

  if (isKu || doc.legal_footnote) {
    y = ensureY(pdf, y, 12)
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...MUTED)
    const footnote = doc.legal_footnote || (lang === 'en' ? docT('en', 'kleinunternehmer') : KLEINUNTERNEHMER_FOOTNOTE)
    const lines = pdf.splitTextToSize(footnote, CONTENT_W)
    pdf.text(lines, MARGIN, y)
    y += lines.length * 3.5 + 4
  }

  if (doc.reverse_charge_notice) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.text(docT(lang, 'reverseCharge'), MARGIN, y)
    y += 6
  }

  if (doc.notes) {
    y = ensureY(pdf, y, 10)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(...INK)
    pdf.text(pdf.splitTextToSize(doc.notes, CONTENT_W), MARGIN, y)
    y += 8
  }

  const footerText =
    doc.footer ||
    profile?.defaultFooter ||
    (lang === 'en' ? docT('en', 'thankYou') : docT('de', 'thankYou'))
  if (footerText) {
    y = ensureY(pdf, y, 8)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(...MUTED)
    pdf.text(footerText, MARGIN, y)
  }

  applyBrandedFooters(
    pdf,
    disclaimerForBranding(
      'DocDraft — Rechnungsentwurf. Steuerliche Prüfung durch Steuerberater empfohlen.',
      lang === 'en'
        ? 'Invoice draft — have your tax advisor review before sending.'
        : 'Rechnungsentwurf. Steuerliche Prüfung durch Steuerberater empfohlen.',
      branding
    ),
    { branding }
  )

  pdf.save(`${(doc.document_number || 'document').replace(/\s+/g, '_')}.pdf`)
}
