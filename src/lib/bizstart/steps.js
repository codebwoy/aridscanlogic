/** Registration steps — visibility per business structure */

export const ALL_STEPS = [
  { id: 'structure', key: 'structure', estMin: 5 },
  { id: 'info', key: 'info', estMin: 15 },
  { id: 'gewerbe', key: 'gewerbe', estMin: 10, skipFor: ['freiberufler'] },
  { id: 'finanzamt', key: 'finanzamt', estMin: 20 },
  { id: 'krankenkasse', key: 'krankenkasse', estMin: 15 },
  { id: 'vat', key: 'vat', estMin: 10, skipFor: ['kleinunternehmer'], skipIfKlein: true },
  { id: 'handelsregister', key: 'handelsregister', estMin: 30, onlyFor: ['gmbh', 'ug'] },
  { id: 'ihk', key: 'ihk', estMin: 5, skipFor: ['freiberufler'] },
  { id: 'bank', key: 'bank', estMin: 5 },
  { id: 'websiteLegal', key: 'websiteLegal', estMin: 25 },
  { id: 'complete', key: 'complete', estMin: 0 },
]

export const STRUCTURES = [
  {
    id: 'freiberufler',
    icon: 'briefcase',
    nameEn: 'Freiberufler (Freelancer)',
    nameDe: 'Freiberufler',
    descEn:
      'Creative professionals, consultants, developers, doctors, lawyers. No Gewerbeanmeldung — register directly with Finanzamt only.',
    descDe:
      'Kreative, Berater, Entwickler, Ärzte, Anwälte. Keine Gewerbeanmeldung — nur Finanzamt.',
    forWho: 'developers, designers, journalists, coaches, therapists',
  },
  {
    id: 'einzelunternehmer',
    icon: 'store',
    nameEn: 'Einzelunternehmer (Sole Trader)',
    nameDe: 'Einzelunternehmer',
    descEn: 'Trade or services independently. Gewerbeanmeldung required. Full personal liability.',
    descDe: 'Gewerbe oder Dienstleistungen. Gewerbeanmeldung erforderlich.',
    forWho: 'shop owners, tradespeople, online sellers',
  },
  {
    id: 'kleinunternehmer',
    icon: 'sparkles',
    nameEn: 'Kleinunternehmer (§19 UStG)',
    nameDe: 'Kleinunternehmer (§19 UStG)',
    descEn: 'Under €22,000 revenue in year 1. No VAT charged, no VAT returns.',
    descDe: 'Unter 22.000 € Umsatz im 1. Jahr. Keine USt auf Rechnungen.',
    forWho: 'side businesses, micro-businesses',
  },
  {
    id: 'gbr',
    icon: 'users',
    nameEn: 'GbR (Partnership)',
    nameDe: 'GbR (Personengesellschaft)',
    descEn: 'Two or more partners, personally liable. Gewerbeanmeldung per partner.',
    descDe: 'Zwei oder mehr Partner, persönlich haftend.',
    forWho: 'co-founders, friends starting together',
  },
  {
    id: 'ug',
    icon: 'building',
    nameEn: 'UG (haftungsbeschränkt)',
    nameDe: 'UG (haftungsbeschränkt)',
    descEn: 'Mini-GmbH from €1 capital. Notary + Handelsregister required.',
    descDe: 'Mini-GmbH ab 1 € Stammkapital. Notar + Handelsregister.',
    forWho: 'founders wanting liability protection',
  },
  {
    id: 'gmbh',
    icon: 'landmark',
    nameEn: 'GmbH',
    nameDe: 'GmbH',
    descEn: '€25,000 capital (€12,500 upfront). Notary, Handelsregister, shareholders agreement.',
    descDe: '25.000 € Stammkapital. Notar, Handelsregister, Gesellschaftsvertrag.',
    forWho: 'serious businesses, investors',
  },
]

export function getApplicableSteps(structureId, formData = {}) {
  const isKlein =
    structureId === 'kleinunternehmer' || formData.vatScheme === 'kleinunternehmer'
  return ALL_STEPS.filter((step) => {
    if (step.skipFor?.includes(structureId)) return false
    if (step.onlyFor && !step.onlyFor.includes(structureId)) return false
    if (step.skipIfKlein && isKlein) return false
    return true
  })
}

export function getNextStepId(currentId, structureId, formData = {}) {
  const steps = getApplicableSteps(structureId, formData)
  const idx = steps.findIndex((s) => s.id === currentId)
  return steps[idx + 1]?.id || 'complete'
}

export const STEP_LABELS = {
  en: {
    structure: 'Choose business structure',
    info: 'Personal & business information',
    gewerbe: 'Gewerbeanmeldung (Trade office)',
    finanzamt: 'Fragebogen zur steuerlichen Erfassung',
    krankenkasse: 'Health insurance (Krankenkasse)',
    vat: 'VAT registration (USt-IdNr.)',
    handelsregister: 'Handelsregister',
    ihk: 'IHK / HWK membership',
    bank: 'Business bank account',
    websiteLegal: 'Website legal pages (Impressum, Privacy, AVV)',
    complete: 'Done — Tax Vault activated',
  },
  de: {
    structure: 'Rechtsform wählen',
    info: 'Persönliche & geschäftliche Daten',
    gewerbe: 'Gewerbeanmeldung',
    finanzamt: 'Fragebogen zur steuerlichen Erfassung',
    krankenkasse: 'Krankenkasse / Krankenversicherung',
    vat: 'Umsatzsteuer / USt-IdNr.',
    handelsregister: 'Handelsregister',
    ihk: 'IHK / HWK Mitgliedschaft',
    bank: 'Geschäftskonto',
    websiteLegal: 'Website-Rechtliches (Impressum, Datenschutz, AVV)',
    complete: 'Fertig — Tax Vault aktiv',
  },
}
