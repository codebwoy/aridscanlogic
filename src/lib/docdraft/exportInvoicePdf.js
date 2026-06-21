import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { amountToWords } from '@/lib/docdraft/amountInWords'
import { disclaimerForBranding } from '@/lib/documentBranding'
import { buildEpcQrPayload, epcQrImageUrl } from '@/lib/docdraft/epcQr'
import { buildInvoiceBarcodeDataUrl, shouldShowInvoiceBarcode } from '@/lib/docdraft/invoiceBarcode'
import {
  buildTableColumns,
  customerNumber,
  INVOICE_LAYOUT,
  invoiceContentWidth,
  formatVatRateLabel,
  invoiceTotalsRows,
  lineItemsHaveProductMeta,
  profileAddressLines,
  profileOneLineAddress,
  recipientDisplayName,
  recipientFrom,
  resolveProcessor,
} from '@/lib/docdraft/invoiceLayout'
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

const { margin: MARGIN, pageWidth: PAGE_W, footerY: FOOTER_Y, companyFooterY: COMPANY_FOOTER_Y } = INVOICE_LAYOUT
const CONTENT_W = invoiceContentWidth()

const INK = [15, 23, 42]
const MUTED = [71, 85, 105]
const LINE = [203, 213, 225]

function ensureY(pdf, y, needed) {
  if (y + needed <= FOOTER_Y) return y
  pdf.addPage()
  return drawContinuationHeader(pdf) + 4
}

function drawContinuationHeader(pdf) {
  const page = pdf.internal.getCurrentPageInfo().pageNumber
  const total = pdf.internal.getNumberOfPages()
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7.5)
  pdf.setTextColor(...MUTED)
  pdf.text(`${docT('de', 'page')}: ${page} / ${total}`, PAGE_W - MARGIN, MARGIN, { align: 'right' })
  return MARGIN + 6
}

function drawScanLogicBand(pdf) {
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

function drawReturnAddress(pdf, y, profile) {
  const line = profileOneLineAddress(profile)
  if (!line) return y
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6.5)
  pdf.setTextColor(...MUTED)
  pdf.text(pdf.splitTextToSize(line, CONTENT_W), MARGIN, y)
  return y + 5
}

async function drawDocumentBarcode(pdf, y, doc, profile) {
  if (!shouldShowInvoiceBarcode(doc, profile)) return y
  try {
    const url = buildInvoiceBarcodeDataUrl(doc.document_number)
    if (!url) return y
    await loadImage(url)
    pdf.addImage(url, 'PNG', MARGIN, y, 74, 13)
    return y + 15
  } catch {
    return y
  }
}

function drawLogoAndMeta(pdf, y, doc, profile, client, lang) {
  const right = PAGE_W - MARGIN
  let metaY = y

  if (profile?.logoUrl) {
    try {
      pdf.addImage(profile.logoUrl, 'PNG', right - 36, y - 2, 36, 14)
      metaY = y + 16
    } catch {
      /* optional logo */
    }
  } else {
    pdf.setFont('helvetica', 'bolditalic')
    pdf.setFontSize(11)
    pdf.setTextColor(...INK)
    pdf.text(profile?.businessName || profile?.company_name || '—', right, metaY, { align: 'right' })
    metaY += 6
  }

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...MUTED)

  const page = pdf.internal.getCurrentPageInfo().pageNumber
  const total = pdf.internal.getNumberOfPages()
  const metaRows = [[`${docT(lang, 'page')}:`, `${page} / ${total}`]]

  const custNo = customerNumber(client)
  if (custNo) metaRows.push([`${docT(lang, 'customerNo')}`, custNo])

  const processor = resolveProcessor(doc, profile)
  if (processor) metaRows.push([`${docT(lang, 'processor')}`, processor])

  metaRows.push([`${docT(lang, 'date')}`, formatDocumentDate(doc.issue_date, lang)])

  if (doc.delivery_date && doc.document_type !== 'receipt') {
    metaRows.push([`${docT(lang, 'deliveryDate')}:`, formatDocumentDate(doc.delivery_date, lang)])
  } else if (doc.delivery_date) {
    metaRows.push([`${docT(lang, 'serviceDate')}:`, formatDocumentDate(doc.delivery_date, lang)])
  }

  if (doc.due_date && !['receipt', 'delivery_note', 'quote'].includes(doc.document_type)) {
    metaRows.push([`${docT(lang, 'dueDate')}:`, formatDocumentDate(doc.due_date, lang)])
  }

  metaRows.forEach(([label, value]) => {
    pdf.text(`${label} ${value}`, right, metaY, { align: 'right' })
    metaY += 4.2
  })

  return Math.max(y + 18, metaY)
}

async function drawHeaderBlock(pdf, y, doc, profile, client, lang) {
  const headerStart = y
  const barcodeBottom = await drawDocumentBarcode(pdf, headerStart, doc, profile)
  const metaBottom = drawLogoAndMeta(pdf, headerStart, doc, profile, client, lang)
  y = Math.max(barcodeBottom, metaBottom) + 3
  y = drawReturnAddress(pdf, y, profile)
  return y + 4
}

function drawRecipientAddress(pdf, y, recipient) {
  y = ensureY(pdf, y, 28)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...INK)

  const name = recipientDisplayName(recipient)
  pdf.text(name, MARGIN, y)
  y += 5

  if (recipient?.contactName && recipient?.companyName) {
    pdf.text(recipient.contactName, MARGIN, y)
    y += 5
  }

  if (recipient?.billingAddress) {
    const lines = pdf.splitTextToSize(recipient.billingAddress, 90)
    lines.forEach((line) => {
      pdf.text(line, MARGIN, y)
      y += 4.5
    })
  }

  return y + 10
}

function drawDocumentTitle(pdf, y, doc, lang) {
  y = ensureY(pdf, y, 16)
  const type = docTypeLabels(doc.document_type, lang)
  const right = PAGE_W - MARGIN

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(...INK)
  pdf.text(`${type.label} ${doc.document_number || ''}`.trim(), MARGIN, y)

  if (doc.linked_invoice_number || doc.reference_number) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(...MUTED)
    const ref = doc.reference_number || doc.linked_invoice_number
    const refDate = doc.reference_date ? formatDocumentDate(doc.reference_date, lang) : ''
    const refText = refDate
      ? `${docT(lang, 'orderRef')}: ${ref} ${docT(lang, 'orderFrom')} ${refDate}`
      : `${docT(lang, 'linkedInvoice')} ${ref}`
    pdf.text(refText, right, y - 1, { align: 'right' })
  }

  return y + 10
}

function drawDeliveryAddress(pdf, y, recipient, lang) {
  if (!recipient?.shippingAddress || recipient.shippingAddress === recipient.billingAddress) return y
  y = ensureY(pdf, y, 14)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(...INK)
  pdf.text(`${docT(lang, 'deliveryTo')}: ${recipientDisplayName(recipient)}`, MARGIN, y)
  y += 5
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text(pdf.splitTextToSize(recipient.shippingAddress, CONTENT_W), MARGIN, y)
  return y + 10
}

function drawTableHeader(pdf, y, { showPrices, showVat, showProductMeta, lang }) {
  y = ensureY(pdf, y, 12)
  const cols = buildTableColumns({
    showPrices,
    showVat,
    showProductMeta,
    lang,
    margin: MARGIN,
    contentWidth: CONTENT_W,
  })

  pdf.setDrawColor(...INK)
  pdf.setLineWidth(0.4)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 5

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7.5)
  pdf.setTextColor(...MUTED)
  cols.forEach((c) => {
    pdf.text(c.label, c.align === 'right' ? c.x + c.w : c.x, y, { align: c.align || 'left' })
  })

  y += 2
  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.25)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  return { y: y + 5, cols, showPrices, showVat }
}

function colByKey(cols, key) {
  return cols.find((c) => c.key === key)
}

function drawLineRow(pdf, y, line, layout, lang, currency, index) {
  const { cols, showPrices } = layout
  const descCol = colByKey(cols, 'desc')
  const mainLines = pdf.splitTextToSize(line.description || '—', descCol.w - 2)
  const skuLine = line.sku ? `${docT(lang, 'articleNo')} ${line.sku}` : null
  const skuLines = skuLine ? pdf.splitTextToSize(skuLine, descCol.w - 2) : []
  const rowH = Math.max(6, (mainLines.length + skuLines.length) * 4 + 2)
  y = ensureY(pdf, y, rowH)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...INK)

  const posCol = colByKey(cols, 'pos')
  pdf.text(String(index + 1), posCol.x, y)
  pdf.text(mainLines, descCol.x, y)

  if (skuLines.length) {
    pdf.setFontSize(7)
    pdf.setTextColor(...MUTED)
    pdf.text(skuLines, descCol.x, y + mainLines.length * 4)
    pdf.setFontSize(9)
    pdf.setTextColor(...INK)
  }

  const lotCol = colByKey(cols, 'lot')
  if (lotCol) {
    pdf.setFontSize(7.5)
    pdf.text(line.lot_number || '', lotCol.x, y)
    pdf.setFontSize(9)
  }

  const eanCol = colByKey(cols, 'ean')
  if (eanCol) {
    pdf.setFontSize(7)
    pdf.text(line.ean || '', eanCol.x, y)
    pdf.setFontSize(9)
  }

  const expiryCol = colByKey(cols, 'expiry')
  if (expiryCol) {
    pdf.setFontSize(7.5)
    pdf.text(line.expiry_date ? formatDocumentDate(line.expiry_date, lang) : '', expiryCol.x, y)
    pdf.setFontSize(9)
  }

  const qtyCol = colByKey(cols, 'qty')
  pdf.text(`${line.quantity ?? 0} ${unitLabel(line.unit, lang)}`, qtyCol.x + qtyCol.w, y, { align: 'right' })

  if (showPrices) {
    const priceCol = colByKey(cols, 'price')
    pdf.text(formatMoney(line.unit_price, currency, lang), priceCol.x + priceCol.w, y, { align: 'right' })

    const vatCol = colByKey(cols, 'vat')
    if (vatCol) {
      pdf.text(`${line.vat_rate ?? 0}%`, vatCol.x + vatCol.w, y, { align: 'right' })
    }

    const totalCol = colByKey(cols, 'total')
    pdf.text(formatMoney(line.total_gross ?? line.total, currency, lang), totalCol.x + totalCol.w, y, {
      align: 'right',
    })
  }

  y += rowH
  pdf.setDrawColor(...LINE)
  pdf.setLineWidth(0.15)
  pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
  return y + 2
}

function drawTotals(pdf, y, doc, profile, lang) {
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'
  const isKu = profile?.isKleinunternehmer || profile?.is_kleinunternehmer
  const rows = invoiceTotalsRows(doc, { isKu })
  y = ensureY(pdf, y, 8 + rows.length * 5)

  pdf.setDrawColor(...INK)
  pdf.setLineWidth(0.35)
  pdf.line(MARGIN + CONTENT_W - 72, y, MARGIN + CONTENT_W, y)
  y += 6

  const right = MARGIN + CONTENT_W

  rows.forEach((row, index) => {
    const isFinal = row.key === 'total'
    if (isFinal) {
      y += 1
      pdf.setDrawColor(...INK)
      pdf.setLineWidth(0.35)
      pdf.line(MARGIN + CONTENT_W - 72, y, MARGIN + CONTENT_W, y)
      y += 5
    }

    const label =
      row.rate != null && row.key === 'net'
        ? `${docT(lang, 'net')} ${formatVatRateLabel(row.rate)}`
        : row.rate != null && row.key === 'vat'
          ? `${docT(lang, 'vat')} ${formatVatRateLabel(row.rate)}`
          : docT(lang, row.labelKey)

    pdf.setFont('helvetica', row.bold ? 'bold' : 'normal')
    pdf.setFontSize(row.key === 'total' ? 10 : row.bold ? 9 : 8.5)
    pdf.setTextColor(...(row.bold ? INK : MUTED))
    pdf.text(`${label}: ${formatMoney(row.amount, currency, lang)}`, right, y, { align: 'right' })
    y += row.key === 'total' ? 6 : 4.5

    if (index === 0 && !isKu) {
      pdf.setTextColor(...INK)
    }
  })

  return y + 6
}

function drawClosingBlock(pdf, y, doc, profile, lang) {
  y = ensureY(pdf, y, 24)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(...INK)

  const terms = doc.payment_terms || profile?.defaultPaymentTerms
  if (terms) {
    pdf.text(`${docT(lang, 'paymentTermsLabel')}: ${terms}`, MARGIN, y)
    y += 5
  }

  if (profile?.iban) {
    pdf.setTextColor(...MUTED)
    pdf.setFontSize(8)
    const bankParts = [
      profile.bankName,
      profile.iban ? `IBAN ${profile.iban}` : null,
      profile.bic ? `BIC ${profile.bic}` : null,
      `${docT(lang, 'reference')}: ${doc.document_number || '—'}`,
    ].filter(Boolean)
    pdf.text(bankParts.join(' · '), MARGIN, y)
    y += 5
  }

  const footerText =
    doc.footer ||
    profile?.defaultFooter ||
    `${docT(lang, 'thankYouTeam')} ${profile?.businessName || profile?.company_name || ''} Team`.trim()

  pdf.setTextColor(...INK)
  pdf.setFontSize(8.5)
  pdf.text(footerText, MARGIN, y)
  return y + 8
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
    y = ensureY(pdf, y, 44)
    pdf.addImage(qrUrl, 'PNG', MARGIN + CONTENT_W - 40, y, 36, 36)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(...MUTED)
    pdf.text(docT(lang, 'sepaQr'), MARGIN + CONTENT_W - 40, y + 40)
    return y + 44
  } catch {
    return y
  }
}

function drawCompanyFooter(pdf, profile, lang) {
  const total = pdf.internal.getNumberOfPages()
  const colW = CONTENT_W / 4
  const startX = MARGIN
  const baseY = COMPANY_FOOTER_Y

  for (let i = 1; i <= total; i++) {
    pdf.setPage(i)
    pdf.setDrawColor(...LINE)
    pdf.setLineWidth(0.3)
    pdf.line(MARGIN, baseY - 4, MARGIN + CONTENT_W, baseY - 4)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(6)
    pdf.setTextColor(...INK)

    const headers = [docT(lang, 'company'), docT(lang, 'contact'), docT(lang, 'bank'), docT(lang, 'legal')]
    headers.forEach((h, idx) => {
      pdf.text(h, startX + idx * colW, baseY)
    })

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6)
    pdf.setTextColor(...MUTED)

    const companyLines = [
      profile?.businessName || profile?.company_name,
      ...profileAddressLines(profile),
      profile?.country,
    ].filter(Boolean)

    const contactLines = [
      profile?.phone ? `${docT(lang, 'phone')} ${profile.phone}` : null,
      profile?.email ? `${docT(lang, 'email')} ${profile.email}` : null,
      profile?.website ? `${docT(lang, 'web')} ${profile.website}` : null,
    ].filter(Boolean)

    const bankLines = [
      profile?.bankName,
      profile?.iban ? `IBAN ${profile.iban}` : null,
      profile?.bic ? `BIC ${profile.bic}` : null,
    ].filter(Boolean)

    const legalLines = [
      profile?.legalStructure,
      profile?.ustIdNr || profile?.ust_id_nr ? `${docT(lang, 'vatId')} ${profile.ustIdNr || profile.ust_id_nr}` : null,
      profile?.steuernummer ? `${docT(lang, 'taxId')} ${profile.steuernummer}` : null,
    ].filter(Boolean)

    const columns = [companyLines, contactLines, bankLines, legalLines]
    columns.forEach((lines, idx) => {
      let lineY = baseY + 3.5
      lines.slice(0, 4).forEach((line) => {
        const wrapped = pdf.splitTextToSize(line, colW - 2)
        pdf.text(wrapped, startX + idx * colW, lineY)
        lineY += wrapped.length * 2.8
      })
    })
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
    y = drawScanLogicBand(pdf)
  }

  y = await drawHeaderBlock(pdf, y, doc, profile, client, lang)
  y = drawRecipientAddress(pdf, y, recipient)
  y = drawDocumentTitle(pdf, y, doc, lang)
  y = drawDeliveryAddress(pdf, y, recipient, lang)

  const showProductMeta = lineItemsHaveProductMeta(doc.line_items)
  const layout = drawTableHeader(pdf, y, {
    showPrices: !isDelivery,
    showVat: !isDelivery && !isKu,
    showProductMeta,
    lang,
  })
  y = layout.y

  ;(doc.line_items || []).forEach((line, index) => {
    y = drawLineRow(pdf, y, line, layout, lang, currency, index)
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

  y = drawClosingBlock(pdf, y, doc, profile, lang)
  y = await drawSepaQr(pdf, y, doc, profile, lang, currency)

  if (isKu || doc.legal_footnote) {
    y = ensureY(pdf, y, 12)
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(7)
    pdf.setTextColor(...MUTED)
    const footnote = doc.legal_footnote || (lang === 'en' ? docT('en', 'kleinunternehmer') : KLEINUNTERNEHMER_FOOTNOTE)
    const lines = pdf.splitTextToSize(footnote, CONTENT_W)
    pdf.text(lines, MARGIN, y)
    y += lines.length * 3.2 + 4
  }

  if (doc.reverse_charge_notice) {
    y = ensureY(pdf, y, 8)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...INK)
    pdf.text(docT(lang, 'reverseCharge'), MARGIN, y)
    y += 6
  }

  if (doc.notes) {
    y = ensureY(pdf, y, 10)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...INK)
    pdf.text(pdf.splitTextToSize(doc.notes, CONTENT_W), MARGIN, y)
  }

  drawCompanyFooter(pdf, profile, lang)

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
