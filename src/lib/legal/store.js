/** Shared legal-page questionnaire, profile & drafts — Impressum, Datenschutz, AVV */

const LEGAL_KEY = 'scanlogic_legal_pages'

export const DEFAULT_LEGAL_PROFILE = {
  firstName: '',
  lastName: '',
  businessName: '',
  legalStructure: 'einzelunternehmer',
  street: '',
  houseNumber: '',
  plz: '',
  city: '',
  country: 'Deutschland',
  email: '',
  phone: '',
  website: '',
  steuernummer: '',
  ustIdNr: '',
  handelsregister: '',
  activityDescription: '',
}

export const DEFAULT_LEGAL_QUESTIONNAIRE = {
  websiteUrl: '',
  hasContactForm: false,
  hasNewsletter: false,
  hasAnalytics: false,
  analyticsProvider: '',
  hasCookies: false,
  cookieTypes: [],
  hostingProvider: '',
  emailProvider: '',
  usesAiApi: false,
  aiApiProvider: '',
  usesPaymentProcessor: false,
  paymentProvider: '',
  isWebAgency: false,
  clientCompanyName: '',
  clientContactName: '',
  clientEmail: '',
  clientAddress: '',
  processingPurpose: 'Website hosting and maintenance',
  subProcessors: [],
}

export const DEFAULT_LEGAL_DRAFTS = {
  impressum: '',
  datenschutz: '',
  avv: '',
  impressumConfirmed: false,
  datenschutzConfirmed: false,
  avvConfirmed: false,
  lastGeneratedAt: null,
}

function read() {
  try {
    const v = localStorage.getItem(LEGAL_KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

function write(data) {
  localStorage.setItem(LEGAL_KEY, JSON.stringify(data))
}

export function loadLegalData() {
  const existing = read()
  return {
    profile: { ...DEFAULT_LEGAL_PROFILE, ...existing?.profile },
    questionnaire: { ...DEFAULT_LEGAL_QUESTIONNAIRE, ...existing?.questionnaire },
    drafts: { ...DEFAULT_LEGAL_DRAFTS, ...existing?.drafts },
    lastUpdatedAt: existing?.lastUpdatedAt || null,
  }
}

export function saveLegalData(patch) {
  const current = loadLegalData()
  const merged = {
    ...current,
    ...patch,
    profile: { ...current.profile, ...patch.profile },
    questionnaire: { ...current.questionnaire, ...patch.questionnaire },
    drafts: { ...current.drafts, ...patch.drafts },
    lastUpdatedAt: new Date().toISOString(),
  }
  write(merged)
  return merged
}

export function saveLegalProfile(profile) {
  return saveLegalData({ profile })
}

export function saveQuestionnaire(questionnaire) {
  return saveLegalData({ questionnaire })
}

export function saveDrafts(drafts) {
  return saveLegalData({ drafts })
}
