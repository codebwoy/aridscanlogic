/** ScanLogic Business Suite — Free, Pro, Plus */

export const SUITE_PLAN_IDS = ['free', 'pro', 'plus']

export const SUITE_PLANS = {
  free: {
    id: 'free',
    name: { de: 'Free', en: 'Free' },
    tagline: { de: 'Grundfunktionen', en: 'Core features' },
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    recommended: false,
    highlights: {
      de: [
        'Dokumente scannen & OCR',
        'Tax Vault Belege (Basis)',
        'DocDraft Rechnungen (Basis)',
        'Lokale Speicherung',
      ],
      en: [
        'Document scan & OCR',
        'Tax Vault receipts (basic)',
        'DocDraft invoices (basic)',
        'Local storage',
      ],
    },
  },
  pro: {
    id: 'pro',
    name: { de: 'Pro', en: 'Pro' },
    tagline: { de: 'Für Selbstständige', en: 'For freelancers' },
    priceMonthly: 9.99,
    priceYearly: 79.99,
    trialDays: 14,
    recommended: false,
    highlights: {
      de: [
        'KI-Hintergrundentfernung',
        'Unbegrenzte OCR & Markdown',
        'DocDraft ohne Limits',
        'Erweiterte PDF-Exporte',
        'ScanVault Pro inklusive',
      ],
      en: [
        'AI background removal',
        'Unlimited OCR & Markdown',
        'DocDraft without limits',
        'Advanced PDF exports',
        'ScanVault Pro included',
      ],
    },
  },
  plus: {
    id: 'plus',
    name: { de: 'Plus', en: 'Plus' },
    tagline: { de: 'Volle Business Suite', en: 'Full business suite' },
    priceMonthly: 19.99,
    priceYearly: 149.99,
    trialDays: 14,
    recommended: true,
    highlights: {
      de: [
        'Alles aus Pro',
        'Erweiterte Steuer- & Vertrags-Tools',
        'Cloud-Sync & Backup',
        'ScanVault Plus inklusive',
        'Prioritäts-Support',
      ],
      en: [
        'Everything in Pro',
        'Advanced tax & contract tools',
        'Cloud sync & backup',
        'ScanVault Plus included',
        'Priority support',
      ],
    },
  },
}

export const SUITE_PLAN_COMPARISON = {
  de: [
    { label: 'KI-Hintergrundentfernung', free: '—', pro: '✓', plus: '✓' },
    { label: 'OCR & Markdown', free: 'Basis', pro: 'Unbegrenzt', plus: 'Unbegrenzt' },
    { label: 'DocDraft', free: 'Basis', pro: 'Voll', plus: 'Voll' },
    { label: 'Steuer- & Vertragstools', free: 'Basis', pro: 'Erweitert', plus: 'Premium' },
    { label: 'Cloud-Sync', free: '—', pro: '—', plus: '✓' },
    { label: 'ScanVault', free: 'Free', pro: 'Pro', plus: 'Plus' },
  ],
  en: [
    { label: 'AI background removal', free: '—', pro: '✓', plus: '✓' },
    { label: 'OCR & Markdown', free: 'Basic', pro: 'Unlimited', plus: 'Unlimited' },
    { label: 'DocDraft', free: 'Basic', pro: 'Full', plus: 'Full' },
    { label: 'Tax & contract tools', free: 'Basic', pro: 'Advanced', plus: 'Premium' },
    { label: 'Cloud sync', free: '—', pro: '—', plus: '✓' },
    { label: 'ScanVault', free: 'Free', pro: 'Pro', plus: 'Plus' },
  ],
}

export function getSuitePlan(planId) {
  if (planId === 'premium') return SUITE_PLANS.plus
  return SUITE_PLANS[planId] || SUITE_PLANS.free
}

export function formatSuitePlanPrice(planId, billing = 'yearly') {
  const plan = getSuitePlan(planId)
  if (plan.priceMonthly === 0) return '€0'
  const amount = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly
  const suffix = billing === 'yearly' ? '/Jahr' : '/Monat'
  return `€${amount.toFixed(2).replace('.00', '')}${suffix}`
}

export function suitePlanDisplayName(planId, lang = 'de') {
  const l = lang === 'en' ? 'en' : 'de'
  return getSuitePlan(planId).name[l]
}

export function suitePlanHighlights(planId, lang = 'de') {
  const l = lang === 'en' ? 'en' : 'de'
  return getSuitePlan(planId).highlights[l]
}
