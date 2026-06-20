/**
 * German VAT (Umsatzsteuer) reference data for BizStart, DocDraft, and Tax Vault.
 * Based on § 19, § 14, § 15, § 18 UStG — educational only, not tax advice.
 * Thresholds updated per rules effective 1 Jan 2025 (25k / 100k net).
 */

export const ELSTER_URL = 'https://www.elster.de/eportal/'
export const BZST_URL = 'https://www.bzst.de/DE/Home/home_node.html'

/** § 19 UStG Kleinunternehmer — net turnover limits (since 1.1.2025) */
export const KLEINUNTERNEHMER_LIMITS = {
  priorYearNetMax: 25_000,
  currentYearForecastNetMax: 100_000,
  /** @deprecated Old limit before 2025 reform */
  legacyPriorYearMax: 22_000,
  optInBindingYears: 5,
}

export const VAT_STANDARD_RATE = 19
export const VAT_REDUCED_RATE = 7

/** § 18 UStG — Voranmeldung frequency thresholds (Steuerschuld, not revenue) */
export const UST_VA_RULES = {
  monthlyIfPriorYearTaxOver: 9_000,
  mayExemptIfPriorYearTaxUpTo: 2_000,
  defaultPeriod: 'quarterly',
  filingDeadlineDay: 10,
  filingDeadlineNoteDe:
    'Frist: 10. Tag nach Ablauf des Voranmeldungszeitraums (mit Dauerfristverlängerung +1 Monat).',
  filingDeadlineNoteEn:
    'Deadline: 10th day after the pre-return period (extended deadline +1 month if approved).',
}

export const KLEINUNTERNEHMER_INVOICE_RULES = {
  footnoteDe:
    'Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.',
  footnoteEn:
    'Pursuant to § 19 para. 1 UStG, no VAT is charged.',
  prohibitedDe: [
    'Keinen USt-Betrag gesondert ausweisen',
    'Keinen USt-Satz (19 % / 7 %) ausweisen',
    'Keine Formulierung wie „enthält 19 % Umsatzsteuer“ oder „inkl. gesetzl. USt“',
  ],
  prohibitedEn: [
    'Do not show VAT as a separate euro amount',
    'Do not show a VAT rate (19% / 7%)',
    'Avoid phrases like “includes 19% VAT” or “incl. statutory VAT”',
  ],
  penaltyRef: '§ 14c UStG — fälschlich ausgewiesene USt muss abgeführt werden, ohne Vorsteuerabzug.',
}

/** § 14 Abs. 4 UStG — Pflichtangaben auf Rechnungen */
export const INVOICE_MANDATORY_FIELDS = [
  { id: 'supplierName', de: 'Vollständiger Name und Anschrift des leistenden Unternehmers', en: 'Full name and address of supplier' },
  { id: 'customerName', de: 'Vollständiger Name und Anschrift des Leistungsempfängers', en: 'Full name and address of customer' },
  { id: 'taxId', de: 'Steuernummer oder USt-IdNr. des leistenden Unternehmers', en: 'Supplier tax number or VAT ID' },
  { id: 'issueDate', de: 'Ausstellungsdatum', en: 'Issue date' },
  { id: 'invoiceNumber', de: 'Fortlaufende Rechnungsnummer', en: 'Sequential invoice number' },
  { id: 'description', de: 'Menge und Art der Leistung / handelsübliche Bezeichnung', en: 'Quantity and description of goods/services' },
  { id: 'serviceDate', de: 'Zeitpunkt der Lieferung/Leistung (ggf. Anzahlungszeitpunkt)', en: 'Date of supply/service (or advance payment date)' },
  { id: 'netAmount', de: 'Netto-Entgelt nach Steuersätzen aufgeschlüsselt', en: 'Net amount broken down by tax rate' },
  { id: 'taxAmount', de: 'Steuersatz und Steuerbetrag oder Steuerbefreiungshinweis', en: 'Tax rate and amount, or exemption note' },
  { id: 'retention', de: 'Hinweis auf Aufbewahrungspflichten (falls relevant)', en: 'Retention notice if applicable' },
  { id: 'creditNote', de: 'Bei Gutschrift: Vermerk „Gutschrift“', en: 'For credit notes: label “Gutschrift”' },
]

/** Kleinbetragsrechnung § 33 UStDV — up to €250 gross */
export const KLEINBETRAG_INVOICE_MAX_GROSS = 250

export const COMMON_UST_ERRORS = [
  {
    id: 'scheme',
    de: 'Falsche Einordnung Kleinunternehmer vs. Regelbesteuerung',
    en: 'Wrong classification: Kleinunternehmer vs standard VAT',
  },
  {
    id: 'privateUse',
    de: 'Private Kfz-Nutzung oder Entnahmen in der Jahreserklärung vergessen',
    en: 'Private car use or withdrawals omitted from annual return',
  },
  {
    id: 'preReturns',
    de: 'Voranmeldungsbeträge weichen von der Jahreserklärung ab',
    en: 'Pre-return amounts inconsistent with annual VAT return',
  },
  {
    id: 'wrongLines',
    de: 'Steuerfreie Umsätze oder Vorsteuer in falschen Zeilen',
    en: 'Tax-exempt sales or input VAT in wrong form lines',
  },
  {
    id: 'lateFiling',
    de: 'Verspätete Abgabe — Verspätungszuschlag und schlechtere Prüfungsbilanz',
    en: 'Late filing — penalties and negative compliance record',
  },
]

export const REGELBESTEUERUNG_EFFECTS = [
  {
    de: 'Lieferungen und Leistungen unterliegen der regulären Umsatzbesteuerung (19 % / 7 %).',
    en: 'Supplies and services are subject to standard VAT (19% / 7%).',
  },
  {
    de: 'Umsatzsteuer muss in Rechnungen gesondert ausgewiesen werden.',
    en: 'VAT must be shown separately on invoices.',
  },
  {
    de: 'Vorsteuer aus Eingangsrechnungen für das Unternehmen kann abgezogen werden (§ 15 UStG).',
    en: 'Input VAT on business purchases can be deducted (§ 15 UStG).',
  },
  {
    de: 'Umsatzsteuer-Jahreserklärung und ggf. Umsatzsteuervoranmeldungen über ELSTER.',
    en: 'Annual VAT return and possibly pre-returns via ELSTER.',
  },
]

export const VORSTEUER_REQUIREMENTS = [
  {
    de: 'Leistung wurde erbracht (nicht nur Rechnung oder Zahlung).',
    en: 'Service was performed (not just invoiced or paid).',
  },
  {
    de: 'Ordnungsgemäße Rechnung mit allen Pflichtangaben (§ 14 UStG).',
    en: 'Proper invoice with all mandatory fields (§ 14 UStG).',
  },
  {
    de: 'Leistender ist Unternehmer und schuldet die ausgewiesene USt tatsächlich.',
    en: 'Supplier is a business and actually owes the VAT shown.',
  },
  {
    de: 'Leistung ist dem Unternehmen zugeordnet (objektiver Zusammenhang).',
    en: 'Service is allocated to the business (objective business link).',
  },
]

export function isKleinunternehmerEligible(priorYearNet = 0, currentYearForecastNet = 0) {
  return (
    priorYearNet <= KLEINUNTERNEHMER_LIMITS.priorYearNetMax &&
    currentYearForecastNet <= KLEINUNTERNEHMER_LIMITS.currentYearForecastNetMax
  )
}

/** Extrapolate partial-year revenue to 12 months (founders mid-year). */
export function extrapolateAnnualRevenue(partialNet, monthsActive) {
  if (!monthsActive || monthsActive <= 0) return partialNet
  return Math.round((partialNet / monthsActive) * 12)
}

/**
 * Simple decision helper: recommend Regelbesteuerung if planned investment VAT
 * likely exceeds output VAT on forecast revenue.
 */
export function recommendVatScheme({
  priorYearNet = 0,
  currentYearForecastNet = 0,
  plannedInvestmentNet = 0,
  vatRate = VAT_STANDARD_RATE,
  isNewFounder = false,
  monthsActive = 12,
}) {
  const forecast = isNewFounder
    ? extrapolateAnnualRevenue(currentYearForecastNet, monthsActive)
    : currentYearForecastNet

  const eligible = isNewFounder
    ? forecast <= KLEINUNTERNEHMER_LIMITS.currentYearForecastNetMax
    : isKleinunternehmerEligible(priorYearNet, forecast)

  if (!eligible) {
    return {
      scheme: 'standard',
      reasonDe: 'Umsatzgrenzen (25.000 € Vorjahr / 100.000 € laufend netto) werden voraussichtlich überschritten — Regelbesteuerung.',
      reasonEn: 'Turnover limits (€25k prior year / €100k current year net) likely exceeded — standard VAT applies.',
    }
  }

  const outputVat = (forecast * vatRate) / 100
  const inputVat = (plannedInvestmentNet * vatRate) / 100
  const refundPotential = inputVat - outputVat

  if (plannedInvestmentNet > 0 && refundPotential > 500) {
    return {
      scheme: 'standard',
      reasonDe: `Geplante Investitionen (~${Math.round(inputVat)} € Vorsteuer) übersteigen voraussichtliche Umsatzsteuer (~${Math.round(outputVat)} €). Option zur Regelbesteuerung kann Vorsteuererstattung bringen — 5 Jahre bindend.`,
      reasonEn: `Planned investments (~€${Math.round(inputVat)} input VAT) exceed expected output VAT (~€${Math.round(outputVat)}). Opting into standard VAT may yield a refund — binding for 5 years.`,
      refundEstimate: Math.round(refundPotential),
    }
  }

  return {
    scheme: 'kleinunternehmer',
    reasonDe: 'Kleinunternehmerregelung § 19 UStG voraussichtlich möglich — keine USt auf Rechnungen, keine Voranmeldungen, kein Vorsteuerabzug.',
    reasonEn: 'Kleinunternehmer § 19 UStG likely available — no VAT on invoices, no pre-returns, no input VAT deduction.',
  }
}

export function vatPreReturnFrequency(priorYearTaxPaid = 0) {
  if (priorYearTaxPaid > UST_VA_RULES.monthlyIfPriorYearTaxOver) return 'monthly'
  return UST_VA_RULES.defaultPeriod
}
