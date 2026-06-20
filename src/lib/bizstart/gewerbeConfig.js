/** GewA 1 sub-wizard step ids */
export const GEWERBE_WIZARD_STEPS = [
  'registrationType',
  'owner',
  'personal',
  'address',
  'business',
  'summary',
]

export const REGISTRATION_TYPES = [
  { id: 'neuanmeldung', de: 'Neuanmeldung (neues Gewerbe)', en: 'New registration' },
  { id: 'ummeldung', de: 'Ummeldung (Änderung)', en: 'Change of registration' },
  { id: 'abmeldung', de: 'Abmeldung', en: 'Deregistration' },
  { id: 'wiedereroeffnung', de: 'Wiedereröffnung', en: 'Reopening' },
]

export const GEWERBE_LEGAL_FORMS = [
  { id: 'einzelunternehmen', de: 'Einzelunternehmen / Kleingewerbe', en: 'Sole proprietorship / small business' },
  { id: 'gbr', de: 'GbR (Gesellschaft bürgerlichen Rechts)', en: 'GbR (civil-law partnership)' },
  { id: 'ohg', de: 'OHG (Offene Handelsgesellschaft)', en: 'OHG (General partnership)' },
  { id: 'kg', de: 'KG (Kommanditgesellschaft)', en: 'KG (Limited partnership)' },
  { id: 'gmbh', de: 'GmbH', en: 'GmbH' },
  { id: 'ug', de: 'UG (haftungsbeschränkt)', en: 'UG (limited liability)' },
  { id: 'ag', de: 'AG (Aktiengesellschaft)', en: 'AG (public limited company)' },
  { id: 'gmbh_co_kg', de: 'GmbH & Co. KG', en: 'GmbH & Co. KG' },
  { id: 'ev', de: 'e.V. (eingetragener Verein)', en: 'e.V. (registered association)' },
  { id: 'eg', de: 'eG (eingetragene Genossenschaft)', en: 'eG (registered cooperative)' },
  { id: 'stiftung', de: 'Stiftung', en: 'Foundation' },
  { id: 'other', de: 'Sonstige', en: 'Other' },
]

export const GENDER_OPTIONS = [
  { id: 'male', de: 'Männlich', en: 'Male' },
  { id: 'female', de: 'Weiblich', en: 'Female' },
  { id: 'diverse', de: 'Divers', en: 'Diverse' },
  { id: 'none', de: 'Keine Angabe', en: 'No information' },
]

export const BUSINESS_TYPE_OPTIONS = [
  { id: 'industry', de: 'Industrie', en: 'Industry' },
  { id: 'craftsmanship', de: 'Handwerk', en: 'Craftsmanship' },
  { id: 'trade', de: 'Handel', en: 'Trade' },
  { id: 'miscellaneous', de: 'Sonstiges', en: 'Miscellaneous' },
]

const STRUCTURE_TO_GEWERBE = {
  einzelunternehmer: 'einzelunternehmen',
  kleinunternehmer: 'einzelunternehmen',
  gbr: 'gbr',
  ug: 'ug',
  gmbh: 'gmbh',
}

export function defaultGewerbeLegalForm(businessStructure) {
  return STRUCTURE_TO_GEWERBE[businessStructure] || 'einzelunternehmen'
}

export function labelForOption(options, id, lang) {
  const item = options.find((o) => o.id === id)
  if (!item) return id || '—'
  return lang === 'de' ? item.de : item.en
}
