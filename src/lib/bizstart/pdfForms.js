import {
  createBrandedPdf,
  drawBrandedHeader,
  drawFieldRow,
  drawDisclaimerBox,
  saveBrandedPdf,
  drawSectionTitle,
  drawBodyParagraph,
  ensureSpace,
} from '@/lib/pdf/brandedPdf'

const BIZSTART_DISCLAIMER =
  'Vorab ausgefüllt von ScanLogic BizStart — bitte prüfen und beim zuständigen Amt einreichen. Keine Rechts- oder Steuerberatung.'

export function generateGewerbePdf(form) {
  const pdf = createBrandedPdf()
  let y = drawBrandedHeader(pdf, {
    title: 'Gewerbeanmeldung (Voranmeldung)',
    subtitle: 'Handels- / Gewerbeamt — Entwurf zur Einreichung',
    module: 'BizStart Germany',
  })

  y = drawSectionTitle(pdf, y, 'Antragsteller')
  y = drawFieldRow(pdf, y, 'Name', `${form.firstName || ''} ${form.lastName || ''}`.trim(), { alt: true })
  y = drawFieldRow(pdf, y, 'Geburtsdatum', form.dateOfBirth)
  y = drawFieldRow(pdf, y, 'Anschrift', `${form.street || ''} ${form.houseNumber || ''}, ${form.plz || ''} ${form.city || ''}`.trim(), { alt: true })
  y = drawFieldRow(pdf, y, 'Telefon', form.phone)
  y = drawFieldRow(pdf, y, 'E-Mail', form.email, { alt: true })

  y = drawSectionTitle(pdf, y + 4, 'Gewerbe')
  y = drawFieldRow(pdf, y, 'Tätigkeit', form.businessActivityDescription, { alt: true })
  y = drawFieldRow(pdf, y, 'Betriebseröffnung', form.businessStartDate)
  if (form.intendedBusinessName || form.businessName) {
    y = drawFieldRow(pdf, y, 'Geschäftsname', form.intendedBusinessName || form.businessName, { alt: true })
  }

  y = ensureSpace(pdf, y + 6, 20, { title: 'Gewerbeanmeldung', module: 'BizStart Germany' })
  drawDisclaimerBox(pdf, y, BIZSTART_DISCLAIMER)

  saveBrandedPdf(pdf, `Gewerbeanmeldung_${form.plz || 'draft'}.pdf`, BIZSTART_DISCLAIMER)
}

export function generateFragebogenPdf(form) {
  const pdf = createBrandedPdf()
  let y = drawBrandedHeader(pdf, {
    title: 'Fragebogen zur steuerlichen Erfassung',
    subtitle: 'Finanzamt — Vorbereitung für ELSTER / Papierformular',
    module: 'BizStart Germany',
  })

  y = drawSectionTitle(pdf, y, 'Persönliche Angaben')
  y = drawFieldRow(pdf, y, 'Name', `${form.firstName || ''} ${form.lastName || ''}`.trim(), { alt: true })
  y = drawFieldRow(pdf, y, 'Adresse', `${form.street || ''} ${form.houseNumber || ''}, ${form.plz || ''} ${form.city || ''}`.trim())
  y = drawFieldRow(pdf, y, 'Steuer-ID', form.taxId, { alt: true })

  y = drawSectionTitle(pdf, y + 4, 'Betrieb & Steuern')
  y = drawFieldRow(pdf, y, 'Tätigkeit', form.businessActivityDescription, { alt: true })
  y = drawFieldRow(pdf, y, 'Beginn', form.businessStartDate)
  y = drawFieldRow(pdf, y, 'Umsatz Jahr 1', form.expectedRevenueYear1 ? `${form.expectedRevenueYear1} EUR` : '—', { alt: true })
  y = drawFieldRow(pdf, y, 'Gewinn Jahr 1', form.expectedProfitYear1 ? `${form.expectedProfitYear1} EUR` : '—')
  y = drawFieldRow(
    pdf,
    y,
    'USt-Schema',
    form.vatScheme === 'kleinunternehmer' ? 'Kleinunternehmer §19 UStG' : 'Regelbesteuerung',
    { alt: true }
  )
  y = drawFieldRow(pdf, y, 'USt-Voranmeldung', form.vatFilingFrequency || 'quarterly')
  y = drawFieldRow(pdf, y, 'Bank', form.bankName)
  y = drawFieldRow(pdf, y, 'IBAN', form.iban, { alt: true })
  y = drawFieldRow(pdf, y, 'Wirtschaftsjahr', 'Januar – Dezember')

  y = ensureSpace(pdf, y + 6, 20, { title: 'Fragebogen steuerliche Erfassung', module: 'BizStart Germany' })
  drawDisclaimerBox(pdf, y, BIZSTART_DISCLAIMER)

  saveBrandedPdf(pdf, `Fragebogen_stErfassung_${form.lastName || 'draft'}.pdf`, BIZSTART_DISCLAIMER)
}
