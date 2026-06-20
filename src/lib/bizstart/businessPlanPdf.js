import {
  createBrandedPdf,
  drawBrandedHeader,
  drawSectionTitle,
  drawBodyParagraph,
  drawFieldRow,
  drawDisclaimerBox,
  ensureSpace,
  saveBrandedPdf,
  finalizeBrandedPdf,
  brandedPdfToBlob,
} from '@/lib/pdf/brandedPdf'
import {
  planningYearLabels,
  lineName,
  sumYear,
  sumAmount,
  fmtEuro,
} from '@/lib/bizstart/businessPlanConfig'
import { mergeBusinessPlanForExport } from '@/lib/bizstart/businessPlanDraft'
import { PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'

const DISCLAIMER_BRANDED_DE =
  'Erstellt mit ScanLogic BizStart — Entwurf zur Vorbereitung. Keine Rechts- oder Steuerberatung. Vor Einreichung prüfen lassen.'
const DISCLAIMER_BRANDED_EN =
  'Created with ScanLogic BizStart — draft for preparation only, not legal or tax advice. Have it reviewed before submission.'
const DISCLAIMER_CLEAN_DE =
  'Entwurf zur Vorbereitung — keine Rechts- oder Steuerberatung. Vor Einreichung prüfen lassen.'
const DISCLAIMER_CLEAN_EN =
  'Draft for preparation only — not legal or tax advice. Have it reviewed before submission.'

function pdfBranding(draft) {
  return draft.planPdfBranding === 'branded' ? 'full' : 'clean'
}

function pdfDisclaimer(draft, lang) {
  const branded = draft.planPdfBranding === 'branded'
  if (lang === 'de') return branded ? DISCLAIMER_BRANDED_DE : DISCLAIMER_CLEAN_DE
  return branded ? DISCLAIMER_BRANDED_EN : DISCLAIMER_CLEAN_EN
}

function periodLabel(draft, lang) {
  const sm = draft.planStartMonth || '01'
  const sy = draft.planStartYear || ''
  const em = draft.planEndMonth || '12'
  const ey = draft.planEndYear || ''
  if (lang === 'de') return `${sm}/${sy} – ${em}/${ey}`
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const sn = months[Number(sm) - 1] || sm
  const en = months[Number(em) - 1] || em
  return `${sn} ${sy} – ${en} ${ey}`
}

function audienceLabel(id, lang) {
  const a = PLAN_AUDIENCES.find((x) => x.id === id)
  if (!a) return id || '—'
  return lang === 'de' ? a.de : a.en
}

function spaceOpts(d, lang, title) {
  return {
    title: title || d.planTitle,
    module: 'BizStart Germany',
    branding: pdfBranding(d),
    lang,
  }
}

function drawFinanceTable(pdf, y, lang, title, lines, years, d) {
  const opts = spaceOpts(d, lang)
  y = ensureSpace(pdf, y, 20, opts)
  y = drawSectionTitle(pdf, y, title)
  const headers = [lang === 'de' ? 'Position' : 'Item', ...years.map(String)]
  const colW = [70, 30, 30, 30]
  let x = 20
  pdf.setFillColor(49, 46, 129)
  pdf.rect(20, y - 4, 170, 8, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  headers.forEach((h, i) => {
    pdf.text(h, x + 2, y)
    x += colW[i]
  })
  y += 8
  ;(lines || []).forEach((row, ri) => {
    y = ensureSpace(pdf, y, 10, opts)
    if (ri % 2 === 0) {
      pdf.setFillColor(238, 242, 255)
      pdf.rect(20, y - 4, 170, 7, 'F')
    }
    pdf.setTextColor(30, 41, 59)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    x = 20
    const cells = [lineName(row, lang), row.y1 || '—', row.y2 || '—', row.y3 || '—']
    cells.forEach((cell, i) => {
      const val = i > 0 && cell !== '—' ? fmtEuro(cell, lang) : String(cell)
      pdf.text(String(val).slice(0, 28), x + 2, y)
      x += colW[i]
    })
    y += 7
  })
  y = ensureSpace(pdf, y, 10, opts)
  pdf.setFont('helvetica', 'bold')
  pdf.text(lang === 'de' ? 'Summe' : 'Total', 22, y)
  pdf.text(fmtEuro(sumYear(lines, 'y1'), lang), 92, y)
  pdf.text(fmtEuro(sumYear(lines, 'y2'), lang), 122, y)
  pdf.text(fmtEuro(sumYear(lines, 'y3'), lang), 152, y)
  return y + 10
}

function textSections(d, lang) {
  return [
    { n: '1', title: lang === 'de' ? 'Zusammenfassung' : 'Executive summary', text: d.summary },
    { n: '2', title: lang === 'de' ? 'Produktion (Kernaktivitäten)' : 'Core activities', text: d.production },
    { n: '3', title: lang === 'de' ? 'Kunden' : 'Customers', text: d.customers },
    {
      n: '4',
      title: lang === 'de' ? 'Geschäftsidee' : 'Business idea',
      text: [d.offer && `4.1 ${lang === 'de' ? 'Angebot' : 'Offer'}\n${d.offer}`, d.benefit && `4.2 ${lang === 'de' ? 'Nutzen' : 'Benefits'}\n${d.benefit}`]
        .filter(Boolean)
        .join('\n\n'),
    },
    { n: '4.3', title: lang === 'de' ? 'Markt & Wettbewerb' : 'Market & competition', text: d.market },
    { n: '5', title: lang === 'de' ? 'Werte' : 'Values', text: d.values },
    { n: '6', title: lang === 'de' ? 'Marketing & Vertrieb' : 'Marketing & sales', text: d.sales },
    { n: '6b', title: lang === 'de' ? 'Organisation' : 'Organisation', text: d.organization },
    { n: '7', title: lang === 'de' ? 'Gründerqualifikation' : 'Founder qualifications', text: d.competencies },
    { n: '8', title: lang === 'de' ? 'Schlüsselpartner' : 'Key partners', text: d.partners },
    {
      n: '9',
      title: lang === 'de' ? 'Unternehmen' : 'Company',
      text: [
        d.foundersTeam && `9.1 ${lang === 'de' ? 'Gründer & Team' : 'Founders'}\n${d.foundersTeam}`,
        d.location && `9.2 ${lang === 'de' ? 'Standort' : 'Location'}\n${d.location}`,
        d.legalFormNotes && `9.3 ${lang === 'de' ? 'Rechtsform' : 'Legal form'}\n${d.legalFormNotes}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
    },
    { n: '10', title: lang === 'de' ? 'Chancen & Risiken' : 'Opportunities & risks', text: d.risks },
  ]
}

function headerMeta(d, lang) {
  const docTitle = d.planTitle || (lang === 'de' ? 'Businessplan' : 'Business plan')
  const subtitle =
    lang === 'de'
      ? `Planungszeitraum ${periodLabel(d, lang)} · Zielgruppe: ${audienceLabel(d.planAudience, lang)}`
      : `Planning period ${periodLabel(d, lang)} · Audience: ${audienceLabel(d.planAudience, lang)}`
  return { docTitle, subtitle }
}

function drawFinanceSections(pdf, y, d, lang, years, opts) {
  if (d.financeAssumptions?.trim() || d.profitabilityNotes?.trim() || d.liquidityNotes?.trim()) {
    y = ensureSpace(pdf, y, 20, { ...opts, title: lang === 'de' ? 'Finanzplan' : 'Finance plan' })
    y = drawSectionTitle(pdf, y, lang === 'de' ? '11 — Finanzplan' : '11 — Finance plan')
    if (d.financeAssumptions?.trim()) {
      y = drawBodyParagraph(pdf, y, `${lang === 'de' ? 'Annahmen' : 'Assumptions'}\n${d.financeAssumptions}`)
    }
    if (d.profitabilityNotes?.trim()) {
      y = drawBodyParagraph(pdf, y, `${lang === 'de' ? 'Rentabilitätsvorschau' : 'Profitability forecast'}\n${d.profitabilityNotes}`)
    }
    if (d.liquidityNotes?.trim()) {
      y = drawBodyParagraph(pdf, y, `${lang === 'de' ? 'Liquiditätsplanung' : 'Liquidity planning'}\n${d.liquidityNotes}`)
    }
  }
  if (d.revenueLines?.length) {
    y = drawFinanceTable(pdf, y, lang, lang === 'de' ? '11.1 Ertragsquellen / Umsatz' : '11.1 Revenue', d.revenueLines, years, d)
  }
  if (d.operatingCosts?.length) {
    y = drawFinanceTable(pdf, y, lang, lang === 'de' ? '11.2 Betriebsausgaben' : '11.2 Operating expenses', d.operatingCosts, years, d)
  }
  if (d.privateCosts?.length) {
    y = drawFinanceTable(pdf, y, lang, lang === 'de' ? '11.3 Private Ausgaben' : '11.3 Private expenses', d.privateCosts, years, d)
  }
  y = ensureSpace(pdf, y, 30, { ...opts, title: lang === 'de' ? 'Kapital' : 'Capital' })
  y = drawSectionTitle(pdf, y, lang === 'de' ? '11.4 Kapitalbedarf & Finanzierung' : '11.4 Capital & financing')
  if (d.investments?.length) {
    d.investments.forEach((inv, i) => {
      y = drawFieldRow(pdf, y, lineName(inv, lang), inv.amount ? fmtEuro(inv.amount, lang) : '—', { alt: i % 2 === 0 })
    })
    y = drawFieldRow(pdf, y, lang === 'de' ? 'Summe Investitionen' : 'Total investments', fmtEuro(sumAmount(d.investments), lang), { alt: true })
  }
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Gründungskosten' : 'Startup costs', d.foundingCosts ? fmtEuro(d.foundingCosts, lang) : '—')
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Eigenkapital' : 'Equity', d.equityCapital ? fmtEuro(d.equityCapital, lang) : '—', { alt: true })
  y = drawFieldRow(
    pdf,
    y,
    lang === 'de' ? 'Fremdkapital / Kredit' : 'Loan',
    d.loanAmount ? `${fmtEuro(d.loanAmount, lang)}${d.loanInterest ? ` @ ${d.loanInterest}%` : ''}` : '—'
  )
  if (d.capitalNotes?.trim()) {
    y = ensureSpace(pdf, y, 20, { ...opts, title: lang === 'de' ? 'Kapital' : 'Capital' })
    y = drawBodyParagraph(pdf, y, d.capitalNotes)
  }
  return y
}

/** @param {'full'|'summary'|'finance'} variant */
export function buildBusinessPlanPdfDocument(formData, lang = 'de', { variant = 'full' } = {}) {
  const d = mergeBusinessPlanForExport(formData)
  const years = planningYearLabels(d)
  const branding = pdfBranding(d)
  const disclaimer = pdfDisclaimer(d, lang)
  const { docTitle, subtitle } = headerMeta(d, lang)
  const opts = spaceOpts(d, lang)
  const pdf = createBrandedPdf()

  const summarySubtitle =
    variant === 'summary'
      ? lang === 'de'
        ? 'Executive Summary — Kurzfassung'
        : 'Executive summary — one-page overview'
      : variant === 'finance'
        ? lang === 'de'
          ? 'Finanzübersicht'
          : 'Finance overview'
        : subtitle

  let y = drawBrandedHeader(pdf, {
    title: docTitle,
    subtitle: summarySubtitle,
    module: 'BizStart Germany',
    branding,
    lang,
  })

  if (variant === 'summary') {
    if (d.summary?.trim()) {
      y = drawSectionTitle(pdf, y, lang === 'de' ? '1 — Zusammenfassung' : '1 — Executive summary')
      y = drawBodyParagraph(pdf, y, d.summary)
    } else {
      y = drawBodyParagraph(pdf, y, lang === 'de' ? '(Noch keine Zusammenfassung eingetragen.)' : '(No executive summary entered yet.)')
    }
  } else if (variant === 'finance') {
    y = drawFinanceSections(pdf, y, d, lang, years, opts)
  } else {
    for (const sec of textSections(d, lang)) {
      if (!sec.text?.trim()) continue
      y = ensureSpace(pdf, y, 24, opts)
      y = drawSectionTitle(pdf, y, `${sec.n}  ${sec.title}`)
      y = drawBodyParagraph(pdf, y, sec.text)
    }
    y = drawFinanceSections(pdf, y, d, lang, years, opts)
    if (d.annexes?.trim()) {
      y = ensureSpace(pdf, y, 24, opts)
      y = drawSectionTitle(pdf, y, lang === 'de' ? '12 — Anhang' : '12 — Annexes')
      y = drawBodyParagraph(pdf, y, d.annexes)
    }
  }

  y = ensureSpace(pdf, y + 6, 20, opts)
  drawDisclaimerBox(pdf, y, disclaimer)

  const slug = (d.planTitle || 'businessplan').replace(/[^\wäöüß-]+/gi, '_').slice(0, 40)
  return { pdf, disclaimer, branding, docTitle, slug }
}

export function businessPlanPdfBlob(formData, lang = 'de', options = {}) {
  const { pdf, disclaimer, branding } = buildBusinessPlanPdfDocument(formData, lang, options)
  return brandedPdfToBlob(finalizeBrandedPdf(pdf, disclaimer, { branding }))
}

export function generateBusinessPlanPdf(formData, lang = 'de') {
  const { pdf, disclaimer, branding, slug } = buildBusinessPlanPdfDocument(formData, lang, { variant: 'full' })
  saveBrandedPdf(pdf, `Businessplan_${slug}.pdf`, disclaimer, { branding })
}

export function buildFinanceSnapshotText(formData, lang = 'de') {
  const d = mergeBusinessPlanForExport(formData)
  const years = planningYearLabels(d)
  const lines = []
  const L = (de, en) => (lang === 'de' ? de : en)
  lines.push(`${d.planTitle || L('Businessplan', 'Business plan')}`)
  lines.push(`${L('Planungszeitraum', 'Planning period')}: ${periodLabel(d, lang)}`)
  lines.push(`${L('Zielgruppe', 'Audience')}: ${audienceLabel(d.planAudience, lang)}`)
  lines.push('')
  if (d.revenueLines?.length) {
    lines.push(`=== ${L('Umsatz', 'Revenue')} ===`)
    d.revenueLines.forEach((row) => {
      lines.push(`${lineName(row, lang)}: ${years[0]} ${fmtEuro(row.y1, lang)} | ${years[1]} ${fmtEuro(row.y2, lang)} | ${years[2]} ${fmtEuro(row.y3, lang)}`)
    })
    lines.push(`${L('Summe', 'Total')}: ${fmtEuro(sumYear(d.revenueLines, 'y1'), lang)} (${years[0]})`)
    lines.push('')
  }
  if (d.operatingCosts?.length) {
    lines.push(`=== ${L('Betriebsausgaben', 'Operating costs')} ===`)
    lines.push(`${L('Summe', 'Total')}: ${fmtEuro(sumYear(d.operatingCosts, 'y1'), lang)} (${years[0]})`)
    lines.push('')
  }
  if (d.equityCapital || d.loanAmount) {
    lines.push(`=== ${L('Finanzierung', 'Financing')} ===`)
    if (d.equityCapital) lines.push(`${L('Eigenkapital', 'Equity')}: ${fmtEuro(d.equityCapital, lang)}`)
    if (d.loanAmount) lines.push(`${L('Kredit', 'Loan')}: ${fmtEuro(d.loanAmount, lang)}`)
  }
  return lines.join('\n')
}
