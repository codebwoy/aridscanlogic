import JSZip from 'jszip'
import { downloadTextFile } from '@/lib/pdfUtils'
import { disclaimerForBranding } from '@/lib/documentBranding'
import { getTaxYearLabel } from './stats'
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function imageFilename(receipt, index) {
  const vendor = (receipt.vendor_name || 'receipt').replace(/[^\w-]/g, '_').slice(0, 40)
  return `${receipt.purchase_date || 'nodate'}_${vendor}_${index + 1}.jpg`
}

export function exportReceiptsCsv(receipts, profile, taxYear) {
  const header =
    'date,vendor,category,total,vat,deductible,currency,original_currency,converted_amount,note,expense_type,business_use_pct,manual_entry,image_filename,has_image'
  const rows = receipts.map((r, i) =>
    [
      r.purchase_date,
      `"${(r.vendor_name || '').replace(/"/g, '""')}"`,
      r.category,
      r.total_amount,
      r.vat_amount,
      r.deductible_amount,
      r.currency,
      r.currency !== r.home_currency ? r.currency : '',
      r.converted_amount || '',
      `"${(r.note || '').replace(/"/g, '""')}"`,
      r.expense_type,
      r.business_use_pct ?? 100,
      r.manual_entry ? 'yes' : 'no',
      r.image_url ? imageFilename(r, i) : '',
      r.image_url ? 'yes' : 'no',
    ].join(',')
  )
  downloadTextFile(
    [header, ...rows].join('\n'),
    `tax_vault_${taxYear}_${(profile.businessName || 'export').replace(/\s+/g, '_')}.csv`
  )
}

export async function exportTaxReportPdf(receipts, stats, profile, taxYear, { branding } = {}) {
  const pdf = createBrandedPdf()
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency
  const startMonth = profile.taxYearStartMonth || 1
  const pdfOpts = { branding, module: 'Tax Vault' }

  let y = drawBrandedHeader(pdf, {
    title: 'Tax Vault — Jahresbericht',
    subtitle: getTaxYearLabel(taxYear, startMonth),
    ...pdfOpts,
  })

  y = drawFieldRow(pdf, y, 'Unternehmen', profile.businessName, { alt: true })
  y = drawFieldRow(pdf, y, 'Inhaber', profile.ownerName)
  if (profile.taxId) y = drawFieldRow(pdf, y, 'St.-Nr.', profile.taxId, { alt: true })
  if (profile.vatNumber) y = drawFieldRow(pdf, y, 'USt-IdNr.', profile.vatNumber)
  if (profile.address) y = drawFieldRow(pdf, y, 'Adresse', profile.address, { alt: true })

  y = drawSectionTitle(pdf, y + 4, 'Zusammenfassung')
  y = drawFieldRow(pdf, y, 'Brutto-Ausgaben', `${sym}${stats.totalExpenses.toFixed(2)}`, { alt: true })
  y = drawFieldRow(pdf, y, 'Vorsteuer', `${sym}${stats.totalVat.toFixed(2)}`)
  y = drawFieldRow(pdf, y, 'Abzugsfähig', `${sym}${stats.totalDeductible.toFixed(2)}`, { alt: true })
  y = drawFieldRow(pdf, y, 'Privatanteil', `${sym}${stats.personalPortion.toFixed(2)}`)
  y = drawFieldRow(pdf, y, 'Belege', String(stats.count), { alt: true })
  if (stats.mileageTrips > 0) {
    y = drawFieldRow(
      pdf,
      y,
      'Fahrtenbuch',
      `${stats.mileageKm.toFixed(1)} km — ${sym}${stats.mileageDeductible.toFixed(2)}`
    )
  }

  y = drawSectionTitle(pdf, y + 4, 'Nach Kategorie')
  Object.entries(stats.byCategory).forEach(([cat, d], i) => {
    y = ensureSpace(pdf, y, 10, { title: 'Jahresbericht', ...pdfOpts })
    y = drawFieldRow(
      pdf,
      y,
      cat,
      `${d.count} Belege · Brutto ${sym}${d.gross.toFixed(2)} · Abz. ${sym}${d.deductible.toFixed(2)}`,
      { alt: i % 2 === 0 }
    )
  })

  if (stats.mileage?.length) {
    y += 6
    y = drawSectionTitle(pdf, y, 'Fahrtenbuch')
    stats.mileage.forEach((m, i) => {
      y = ensureSpace(pdf, y, 10, pdfOpts)
      y = drawFieldRow(
        pdf,
        y,
        m.trip_date,
        `${m.start_location} → ${m.end_location} · ${m.distance_km} km · ${sym}${m.deductible_amount?.toFixed(2)}`,
        { alt: i % 2 === 0 }
      )
    })
  }

  pdf.addPage()
  y = drawBrandedHeader(pdf, { title: 'Belegdetails', subtitle: getTaxYearLabel(taxYear, startMonth), ...pdfOpts })

  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i]
    y = ensureSpace(pdf, y, 20, { title: 'Belegdetails', ...pdfOpts })
    y = drawSectionTitle(pdf, y, `${r.vendor_name} — ${r.purchase_date}`)
    y = drawFieldRow(
      pdf,
      y,
      'Betrag',
      `${sym}${r.total_amount?.toFixed(2)} · MwSt ${sym}${r.vat_amount?.toFixed(2)} · ${r.category}`,
      { alt: true }
    )
    y = drawFieldRow(pdf, y, 'Abzugsfähig', `${sym}${r.deductible_amount?.toFixed(2)}`)
    if (r.currency && r.currency !== profile.homeCurrency) {
      y = drawFieldRow(
        pdf,
        y,
        'Original',
        `${r.currency} ${r.total_amount} → ${profile.homeCurrency} ${r.converted_amount || r.total_amount}`,
        { alt: true }
      )
    }
    if (r.note) y = drawBodyParagraph(pdf, y, `Notiz: ${r.note}`)
    y = drawFieldRow(pdf, y, 'Typ', `${r.expense_type} · ${r.business_use_pct ?? 100}% geschäftlich`)
    if (r.image_url) {
      try {
        const img = await loadImage(r.image_url)
        const maxW = 90
        const maxH = 55
        const ratio = Math.min(maxW / img.width, maxH / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        if (y + h > PDF_THEME.footerY) {
          pdf.addPage()
          y = drawBrandedHeader(pdf, { title: 'Belegdetails', ...pdfOpts })
        }
        pdf.addImage(r.image_url, 'JPEG', PDF_THEME.margin, y, w, h)
        y += h + 8
      } catch {
        y = drawBodyParagraph(pdf, y, '(Bild nicht verfügbar)')
      }
    } else {
      y = drawBodyParagraph(pdf, y, '⚠ Kein Belegscan angehängt')
    }
    y += 4
  }

  pdf.addPage()
  y = drawBrandedHeader(pdf, { title: 'Gesamtsumme', ...pdfOpts })
  drawFieldRow(pdf, y + 4, 'Abzugsfähig', `${sym}${stats.totalDeductible.toFixed(2)} (Steuerjahr ${taxYear})`, { alt: true })

  applyBrandedFooters(
    pdf,
    disclaimerForBranding(
      'Tax Vault — Schätzungen, keine Steuerberatung. Export für Steuerberater prüfen lassen.',
      'Schätzungen, keine Steuerberatung. Export für Steuerberater prüfen lassen.',
      branding
    ),
    { branding }
  )
  pdf.save(`Tax_Report_${taxYear}_${(profile.businessName || 'business').replace(/\s+/g, '_')}.pdf`)
}

export async function exportReceiptPdf(receipt, profile, { branding } = {}) {
  const pdf = createBrandedPdf()
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency

  let y = drawBrandedHeader(pdf, {
    title: 'Tax Vault — Beleg',
    subtitle: receipt.vendor_name,
    module: 'Tax Vault',
    branding,
  })

  if (profile.businessName) y = drawFieldRow(pdf, y, 'Unternehmen', profile.businessName, { alt: true })
  y = drawFieldRow(pdf, y, 'Datum', receipt.purchase_date)
  y = drawFieldRow(pdf, y, 'Betrag', `${sym}${receipt.total_amount?.toFixed(2)}`, { alt: true })
  y = drawFieldRow(pdf, y, 'MwSt', `${sym}${receipt.vat_amount?.toFixed(2)}`)
  y = drawFieldRow(pdf, y, 'Kategorie', receipt.category, { alt: true })
  y = drawFieldRow(pdf, y, 'Abzugsfähig', `${sym}${receipt.deductible_amount?.toFixed(2)}`)
  y = drawFieldRow(pdf, y, 'Steuerjahr', String(receipt.tax_year), { alt: true })
  if (receipt.note) y = drawBodyParagraph(pdf, y, `Notiz: ${receipt.note}`)

  if (receipt.image_url) {
    try {
      const img = await loadImage(receipt.image_url)
      const w = 180
      const h = Math.min((img.height / img.width) * w, 200)
      if (y + h > PDF_THEME.footerY) pdf.addPage()
      pdf.addImage(receipt.image_url, 'JPEG', PDF_THEME.margin, y, w, h)
    } catch {
      drawBodyParagraph(pdf, y + 10, '(Belegbild konnte nicht eingebettet werden)')
    }
  }

  applyBrandedFooters(pdf, undefined, { branding })
  pdf.save(`receipt_${(receipt.vendor_name || 'scan').replace(/\s+/g, '_')}.pdf`)
}

export async function exportReceiptImagesZip(receipts, taxYear) {
  const zip = new JSZip()
  let count = 0
  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i]
    if (!r.image_url) continue
    const cat = (r.category || 'Other').replace(/[/\\]/g, '_')
    const folder = zip.folder(cat)
    try {
      const res = await fetch(r.image_url)
      const blob = await res.blob()
      folder.file(imageFilename(r, i), blob)
      count++
    } catch {
      /* skip */
    }
  }
  if (count === 0) throw new Error('No receipt images to export')
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `tax_vault_images_${taxYear}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportBulkReceiptsPdf(receipts, profile) {
  const stats = {
    totalDeductible: receipts.reduce((s, r) => s + (r.deductible_amount || 0), 0),
    totalExpenses: receipts.reduce((s, r) => s + (r.total_amount || 0), 0),
    totalVat: receipts.reduce((s, r) => s + (r.vat_amount || 0), 0),
    personalPortion: 0,
    count: receipts.length,
    byCategory: {},
    mileage: [],
    mileageTrips: 0,
    mileageKm: 0,
    mileageDeductible: 0,
  }
  await exportTaxReportPdf(receipts, stats, profile, receipts[0]?.tax_year || new Date().getFullYear())
}

export async function buildTaxYearBundleBlobs(receipts, stats, profile, taxYear) {
  await exportTaxReportPdf(receipts, stats, profile, taxYear)
  const pdfBlob = null

  const csv = [
    'date,vendor,category,total,vat,deductible,note',
    ...receipts.map((r) =>
      [r.purchase_date, r.vendor_name, r.category, r.total_amount, r.vat_amount, r.deductible_amount, r.note].join(',')
    ),
  ].join('\n')
  const csvBlob = new Blob([csv], { type: 'text/csv' })

  const zip = new JSZip()
  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i]
    if (!r.image_url) continue
    const cat = (r.category || 'Other').replace(/[/\\]/g, '_')
    try {
      const res = await fetch(r.image_url)
      zip.folder(cat).file(imageFilename(r, i), await res.blob())
    } catch {
      /* skip */
    }
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  return { csvBlob, zipBlob, pdfBlob }
}

export async function exportTaxYearBundle(receipts, stats, profile, taxYear) {
  await exportTaxReportPdf(receipts, stats, profile, taxYear)
  exportReceiptsCsv(receipts, profile, taxYear)
  await exportReceiptImagesZip(receipts, taxYear)
}

export async function shareAccountantPackage(receipts, stats, profile, taxYear) {
  await exportTaxYearBundle(receipts, stats, profile, taxYear)
  const subject = `Tax Vault Report ${taxYear} — ${profile.businessName}`
  const body = `Tax year ${taxYear} export package downloaded (PDF, CSV, ZIP). Please attach files from your Downloads folder.\n\n${profile.ownerName}\n${profile.businessName}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: subject,
        text: body,
      })
      return
    } catch {
      /* fall through */
    }
  }
  window.location.href = `mailto:${profile.accountantEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function emailAccountant(profile, taxYear, onExportsReady) {
  onExportsReady?.()
  const subject = encodeURIComponent(`Tax Vault Report ${taxYear} — ${profile.businessName}`)
  const body = encodeURIComponent(
    `Please find the Tax Vault exports for tax year ${taxYear} (PDF, CSV, and images ZIP — downloaded to your device, please attach).\n\n${profile.ownerName}\n${profile.businessName}`
  )
  window.location.href = `mailto:${profile.accountantEmail || ''}?subject=${subject}&body=${body}`
}
