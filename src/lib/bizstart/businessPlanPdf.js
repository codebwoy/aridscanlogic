import {
  createBrandedPdf,
  drawBrandedHeader,
  drawSectionTitle,
  drawBodyParagraph,
  drawFieldRow,
  drawDisclaimerBox,
  ensureSpace,
  saveBrandedPdf,
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

const DISCLAIMER =
  'Erstellt mit ScanLogic BizStart — Entwurf zur Vorbereitung. Keine Rechts- oder Steuerberatung. Vor Einreichung prüfen lassen.'

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

function drawFinanceTable(pdf, y, lang, title, lines, years) {
  y = ensureSpace(pdf, y, 20, { title: 'Businessplan', module: 'BizStart Germany' })
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
    y = ensureSpace(pdf, y, 10, { title: 'Businessplan', module: 'BizStart Germany' })
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
  y = ensureSpace(pdf, y, 10, { title: 'Businessplan', module: 'BizStart Germany' })
  pdf.setFont('helvetica', 'bold')
  pdf.text(lang === 'de' ? 'Summe' : 'Total', 22, y)
  pdf.text(fmtEuro(sumYear(lines, 'y1'), lang), 92, y)
  pdf.text(fmtEuro(sumYear(lines, 'y2'), lang), 122, y)
  pdf.text(fmtEuro(sumYear(lines, 'y3'), lang), 152, y)
  return y + 10
}

export function generateBusinessPlanPdf(formData, lang = 'de') {
  const d = mergeBusinessPlanForExport(formData)
  const years = planningYearLabels(d)
  const pdf = createBrandedPdf()
  let y = drawBrandedHeader(pdf, {
    title: d.planTitle || (lang === 'de' ? 'Businessplan' : 'Business plan'),
    subtitle:
      lang === 'de'
        ? `Planungszeitraum ${periodLabel(d, lang)} · Zielgruppe: ${audienceLabel(d.planAudience, lang)}`
        : `Planning period ${periodLabel(d, lang)} · Audience: ${audienceLabel(d.planAudience, lang)}`,
    module: 'BizStart Germany',
  })

  const sections = [
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

  for (const sec of sections) {
    if (!sec.text?.trim()) continue
    y = ensureSpace(pdf, y, 24, { title: d.planTitle, module: 'BizStart Germany' })
    y = drawSectionTitle(pdf, y, `${sec.n}  ${sec.title}`)
    y = drawBodyParagraph(pdf, y, sec.text)
  }

  if (d.financeAssumptions?.trim() || d.profitabilityNotes?.trim() || d.liquidityNotes?.trim()) {
    y = ensureSpace(pdf, y, 20, { title: 'Finanzplan', module: 'BizStart Germany' })
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
    y = drawFinanceTable(
      pdf,
      y,
      lang,
      lang === 'de' ? '11.1 Ertragsquellen / Umsatz' : '11.1 Revenue',
      d.revenueLines,
      years
    )
  }
  if (d.operatingCosts?.length) {
    y = drawFinanceTable(
      pdf,
      y,
      lang,
      lang === 'de' ? '11.2 Betriebsausgaben' : '11.2 Operating expenses',
      d.operatingCosts,
      years
    )
  }
  if (d.privateCosts?.length) {
    y = drawFinanceTable(
      pdf,
      y,
      lang,
      lang === 'de' ? '11.3 Private Ausgaben' : '11.3 Private expenses',
      d.privateCosts,
      years
    )
  }

  y = ensureSpace(pdf, y, 30, { title: 'Kapital', module: 'BizStart Germany' })
  y = drawSectionTitle(pdf, y, lang === 'de' ? '11.4 Kapitalbedarf & Finanzierung' : '11.4 Capital & financing')
  if (d.investments?.length) {
    d.investments.forEach((inv, i) => {
      y = drawFieldRow(pdf, y, lineName(inv, lang), inv.amount ? fmtEuro(inv.amount, lang) : '—', { alt: i % 2 === 0 })
    })
    y = drawFieldRow(pdf, y, lang === 'de' ? 'Summe Investitionen' : 'Total investments', fmtEuro(sumAmount(d.investments), lang), {
      alt: true,
    })
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
    y = ensureSpace(pdf, y, 20, { title: 'Kapital', module: 'BizStart Germany' })
    y = drawBodyParagraph(pdf, y, d.capitalNotes)
  }

  if (d.annexes?.trim()) {
    y = ensureSpace(pdf, y, 24, { title: d.planTitle, module: 'BizStart Germany' })
    y = drawSectionTitle(pdf, y, lang === 'de' ? '12 — Anhang' : '12 — Annexes')
    y = drawBodyParagraph(pdf, y, d.annexes)
  }

  y = ensureSpace(pdf, y + 6, 20, { title: d.planTitle, module: 'BizStart Germany' })
  drawDisclaimerBox(pdf, y, DISCLAIMER)

  const slug = (d.planTitle || 'businessplan').replace(/[^\wäöüß-]+/gi, '_').slice(0, 40)
  saveBrandedPdf(pdf, `Businessplan_${slug}.pdf`, DISCLAIMER)
}
