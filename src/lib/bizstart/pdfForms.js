import {
  createBrandedPdf,
  drawBrandedHeader,
  drawFieldRow,
  drawDisclaimerBox,
  saveBrandedPdf,
  drawSectionTitle,
  ensureSpace,
  PDF_THEME,
} from '@/lib/pdf/brandedPdf'
import {
  REGISTRATION_TYPES,
  GEWERBE_LEGAL_FORMS,
  GENDER_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  labelForOption,
} from '@/lib/bizstart/gewerbeConfig'

const BIZSTART_DISCLAIMER =
  'Vorab ausgefüllt von ScanLogic BizStart — bitte prüfen und beim zuständigen Gewerbeamt einreichen. Keine Rechts- oder Steuerberatung.'

function fmtAddress(street, nr, plz, city) {
  return `${street || ''} ${nr || ''}, ${plz || ''} ${city || ''}`.replace(/\s+,/g, ',').trim()
}

function yesNo(val, lang) {
  if (val === true) return lang === 'de' ? 'Ja' : 'Yes'
  if (val === false) return lang === 'de' ? 'Nein' : 'No'
  return '—'
}

export function generateGewerbePdf(form, lang = 'de') {
  const pdf = createBrandedPdf()
  let y = drawBrandedHeader(pdf, {
    title: 'Gewerbeanmeldung (GewA 1)',
    subtitle: 'Handels- / Gewerbeamt — Entwurf zur Einreichung',
    module: 'BizStart Germany',
  })

  y = drawSectionTitle(pdf, y, lang === 'de' ? 'Art der Anmeldung' : 'Type of registration')
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Anmeldungsart' : 'Registration type', labelForOption(REGISTRATION_TYPES, form.gewerbeRegistrationType, lang), { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Rechtsform' : 'Legal form', labelForOption(GEWERBE_LEGAL_FORMS, form.gewerbeLegalForm, lang))

  y = drawSectionTitle(pdf, y + 4, lang === 'de' ? 'Persönliche Angaben' : 'Personal information')
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Name' : 'Name', `${form.firstName || ''} ${form.lastName || ''}`.trim(), { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Geschlecht' : 'Gender', labelForOption(GENDER_OPTIONS, form.gender, lang))
  if (form.birthNameDiffers && form.birthName) {
    y = drawFieldRow(pdf, y, lang === 'de' ? 'Geburtsname' : 'Birth name', form.birthName, { alt: true })
  }
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Geburtsdatum' : 'Date of birth', form.dateOfBirth)
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Geburtsort' : 'Place of birth', form.birthplace, { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Staatsangehörigkeit' : 'Nationality', form.nationality)

  y = drawSectionTitle(pdf, y + 4, lang === 'de' ? 'Adressen und Kontakt' : 'Addresses & contact')
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Wohnanschrift' : 'Home address', fmtAddress(form.street, form.houseNumber, form.plz, form.city), { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Telefon' : 'Phone', form.phone)
  y = drawFieldRow(pdf, y, 'E-Mail', form.email, { alt: true })
  const bizAddr =
    form.businessAddressSameAsHome !== false
      ? fmtAddress(form.street, form.houseNumber, form.plz, form.city)
      : fmtAddress(form.businessStreet, form.businessHouseNumber, form.businessPlz, form.businessCity)
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Betriebsstätte' : 'Business premises', bizAddr)

  y = drawSectionTitle(pdf, y + 4, lang === 'de' ? 'Angaben zum Betrieb' : 'Business details')
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Tätigkeit' : 'Activity', form.businessActivityDescription, { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Nebengewerbe' : 'Secondary occupation', yesNo(form.isSecondaryOccupation, lang))
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Beginn' : 'Start date', form.businessStartDate, { alt: true })
  y = drawFieldRow(pdf, y, lang === 'de' ? 'Gewerbeart' : 'Business type', labelForOption(BUSINESS_TYPE_OPTIONS, form.businessTypeCategory, lang))
  if (form.intendedBusinessName || form.businessName) {
    y = drawFieldRow(pdf, y, lang === 'de' ? 'Geschäftsname' : 'Business name', form.intendedBusinessName || form.businessName, { alt: true })
  }
  const emp = [form.employeesFullTime != null && `${form.employeesFullTime} VZ`, form.employeesPartTime != null && `${form.employeesPartTime} TZ`]
    .filter(Boolean)
    .join(', ')
  if (emp) y = drawFieldRow(pdf, y, lang === 'de' ? 'Mitarbeiter' : 'Employees', emp)

  if (form.gewerbeSignatureDataUrl) {
    y = ensureSpace(pdf, y + 6, 30, { module: 'BizStart Germany' })
    y = drawSectionTitle(pdf, y, lang === 'de' ? 'Unterschrift' : 'Signature')
    try {
      pdf.addImage(form.gewerbeSignatureDataUrl, 'JPEG', PDF_THEME.margin, y, 70, 24)
      y += 30
    } catch {
      y += 4
    }
  }

  y = ensureSpace(pdf, y + 6, 20, { title: 'Gewerbeanmeldung', module: 'BizStart Germany' })
  drawDisclaimerBox(pdf, y, BIZSTART_DISCLAIMER)

  saveBrandedPdf(pdf, `GewA1_${form.plz || 'draft'}_${form.lastName || 'anmeldung'}.pdf`, BIZSTART_DISCLAIMER)
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
  y = drawFieldRow(pdf, y, 'Adresse', fmtAddress(form.street, form.houseNumber, form.plz, form.city))
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
