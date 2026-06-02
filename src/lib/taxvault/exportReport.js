import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import { downloadTextFile } from '@/lib/pdfUtils'
import { getTaxYearLabel } from './stats'

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

export async function exportTaxReportPdf(receipts, stats, profile, taxYear) {
  const pdf = new jsPDF()
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency
  const startMonth = profile.taxYearStartMonth || 1

  let y = 20
  pdf.setFontSize(18)
  pdf.text('Tax Vault — Annual Report', 20, y)
  y += 10
  pdf.setFontSize(11)
  pdf.text(profile.businessName || '', 20, y)
  y += 6
  pdf.text(profile.ownerName || '', 20, y)
  y += 6
  if (profile.taxId) {
    pdf.text(`Tax ID: ${profile.taxId}`, 20, y)
    y += 6
  }
  if (profile.vatNumber) {
    pdf.text(`VAT: ${profile.vatNumber}`, 20, y)
    y += 6
  }
  if (profile.address) {
    const lines = pdf.splitTextToSize(profile.address, 170)
    pdf.text(lines, 20, y)
    y += lines.length * 5
  }
  y += 4
  pdf.text(getTaxYearLabel(taxYear, startMonth), 20, y)
  y += 12

  pdf.setFontSize(10)
  pdf.text(`Total gross expenses: ${sym}${stats.totalExpenses.toFixed(2)}`, 20, y)
  y += 6
  pdf.text(`Total VAT paid: ${sym}${stats.totalVat.toFixed(2)}`, 20, y)
  y += 6
  pdf.text(`Total deductible (incl. mileage): ${sym}${stats.totalDeductible.toFixed(2)}`, 20, y)
  y += 6
  pdf.text(`Non-deductible (personal): ${sym}${stats.personalPortion.toFixed(2)}`, 20, y)
  y += 6
  pdf.text(`Receipts: ${stats.count}`, 20, y)
  if (stats.mileageTrips > 0) {
    y += 6
    pdf.text(`Mileage: ${stats.mileageKm.toFixed(1)} km — ${sym}${stats.mileageDeductible.toFixed(2)} deductible`, 20, y)
  }
  y += 10

  pdf.setFontSize(12)
  pdf.text('Summary by category', 20, y)
  y += 8
  pdf.setFontSize(9)
  Object.entries(stats.byCategory).forEach(([cat, d]) => {
    if (y > 270) {
      pdf.addPage()
      y = 20
    }
    pdf.text(
      `${cat} | ${d.count} rcpt | Gross ${sym}${d.gross.toFixed(2)} | VAT ${sym}${d.vat.toFixed(2)} | Ded. ${sym}${d.deductible.toFixed(2)}`,
      20,
      y
    )
    y += 5
  })

  if (stats.mileage?.length) {
    y += 8
    if (y > 250) {
      pdf.addPage()
      y = 20
    }
    pdf.setFontSize(12)
    pdf.text('Mileage log', 20, y)
    y += 8
    pdf.setFontSize(9)
    stats.mileage.forEach((m) => {
      if (y > 275) {
        pdf.addPage()
        y = 20
      }
      pdf.text(
        `${m.trip_date} ${m.start_location} → ${m.end_location} | ${m.distance_km} km | ${sym}${m.deductible_amount?.toFixed(2)} | ${m.purpose || ''}`,
        20,
        y,
        { maxWidth: 170 }
      )
      y += 5
    })
  }

  pdf.addPage()
  y = 20
  pdf.setFontSize(14)
  pdf.text('Receipt detail (all items)', 20, y)
  y += 10

  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i]
    if (y > 240) {
      pdf.addPage()
      y = 20
    }
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.text(`${r.vendor_name} — ${r.purchase_date}`, 20, y)
    y += 6
    pdf.setFont(undefined, 'normal')
    pdf.setFontSize(9)
    pdf.text(
      `Total: ${sym}${r.total_amount?.toFixed(2)} | VAT: ${sym}${r.vat_amount?.toFixed(2)} | Category: ${r.category} | Ded.: ${sym}${r.deductible_amount?.toFixed(2)}`,
      20,
      y
    )
    y += 5
    if (r.currency && r.currency !== profile.homeCurrency) {
      pdf.text(`Original: ${r.currency} ${r.total_amount} → ${profile.homeCurrency} ${r.converted_amount || r.total_amount}`, 20, y)
      y += 5
    }
    if (r.note) {
      const noteLines = pdf.splitTextToSize(`Note: ${r.note}`, 170)
      pdf.text(noteLines, 20, y)
      y += noteLines.length * 4
    }
    pdf.text(`Type: ${r.expense_type} | Business use: ${r.business_use_pct ?? 100}%`, 20, y)
    y += 6
    if (r.image_url) {
      try {
        const img = await loadImage(r.image_url)
        const maxW = 90
        const maxH = 55
        const ratio = Math.min(maxW / img.width, maxH / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        if (y + h > 280) {
          pdf.addPage()
          y = 20
        }
        pdf.addImage(r.image_url, 'JPEG', 20, y, w, h)
        y += h + 8
      } catch {
        pdf.text('(image unavailable)', 20, y)
        y += 6
      }
    } else {
      pdf.setTextColor(180, 100, 0)
      pdf.text('⚠ No receipt scan attached', 20, y)
      pdf.setTextColor(0, 0, 0)
      y += 6
    }
    y += 4
  }

  pdf.addPage()
  y = 20
  pdf.setFontSize(14)
  pdf.text('Grand total', 20, y)
  y += 10
  pdf.setFontSize(11)
  pdf.text(`Total deductible for tax year ${taxYear}: ${sym}${stats.totalDeductible.toFixed(2)}`, 20, y)

  pdf.save(`Tax_Report_${taxYear}_${(profile.businessName || 'business').replace(/\s+/g, '_')}.pdf`)
}

export async function exportReceiptPdf(receipt, profile) {
  const pdf = new jsPDF()
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency
  let y = 15
  pdf.setFontSize(14)
  pdf.text('Tax Vault — Receipt', 15, y)
  y += 10
  pdf.setFontSize(10)
  if (profile.businessName) {
    pdf.text(profile.businessName, 15, y)
    y += 6
  }
  pdf.text(`Vendor: ${receipt.vendor_name}`, 15, y)
  y += 6
  pdf.text(`Date: ${receipt.purchase_date}`, 15, y)
  y += 6
  pdf.text(`Total: ${sym}${receipt.total_amount?.toFixed(2)}`, 15, y)
  y += 6
  pdf.text(`VAT: ${sym}${receipt.vat_amount?.toFixed(2)}`, 15, y)
  y += 6
  pdf.text(`Category: ${receipt.category}`, 15, y)
  y += 6
  pdf.text(`Deductible: ${sym}${receipt.deductible_amount?.toFixed(2)}`, 15, y)
  y += 6
  pdf.text(`Tax year: ${receipt.tax_year}`, 15, y)
  if (receipt.note) {
    y += 8
    pdf.text(pdf.splitTextToSize(`Note: ${receipt.note}`, 180), 15, y)
    y += 12
  }
  if (receipt.image_url) {
    try {
      const img = await loadImage(receipt.image_url)
      const w = 180
      const h = Math.min((img.height / img.width) * w, 200)
      if (y + h > 270) pdf.addPage()
      pdf.addImage(receipt.image_url, 'JPEG', 15, y, w, h)
    } catch {
      pdf.text('(Receipt image could not be embedded)', 15, y + 10)
    }
  }
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
