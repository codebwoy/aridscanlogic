/** ScanVault subscription tiers — Free, Pro, Plus */

export const PLAN_IDS = ['free', 'pro', 'plus']

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Get started locally',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    recommended: false,
    limits: {
      scans: 50,
      pagesPerDoc: 5,
      folders: 3,
    },
    capabilities: {
      watermark: true,
      batchExport: false,
      cloudSync: false,
      ocrPriority: false,
      prioritySupport: false,
    },
    highlights: [
      '50 document scans',
      'Up to 5 pages per scan',
      '3 custom folders',
      'PDF export with watermark',
      'Local storage on device',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'For regular scanning',
    priceMonthly: 4.99,
    priceYearly: 39.99,
    trialDays: 3,
    recommended: false,
    limits: {
      scans: 500,
      pagesPerDoc: 25,
      folders: 25,
    },
    capabilities: {
      watermark: false,
      batchExport: true,
      cloudSync: false,
      ocrPriority: true,
      prioritySupport: false,
    },
    highlights: [
      '500 document scans',
      'Up to 25 pages per scan',
      '25 custom folders',
      'No watermark on exports',
      'Batch PDF & ZIP export',
      'Priority OCR processing',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    tagline: 'Unlimited & cloud-backed',
    priceMonthly: 9.99,
    priceYearly: 79.99,
    trialDays: 3,
    recommended: true,
    limits: {
      scans: Infinity,
      pagesPerDoc: Infinity,
      folders: Infinity,
    },
    capabilities: {
      watermark: false,
      batchExport: true,
      cloudSync: true,
      ocrPriority: true,
      prioritySupport: true,
    },
    highlights: [
      'Unlimited scans & storage',
      'Unlimited pages per document',
      'Unlimited folders',
      'Cloud backup & sync',
      'Batch export without limits',
      'Ad-free · priority support',
    ],
  },
}

/** Feature rows for comparison table */
export const PLAN_COMPARISON = [
  { key: 'scans', label: 'Document scans', format: (n) => (n === Infinity ? 'Unlimited' : String(n)) },
  { key: 'pagesPerDoc', label: 'Pages per scan', format: (n) => (n === Infinity ? 'Unlimited' : String(n)) },
  { key: 'folders', label: 'Custom folders', format: (n) => (n === Infinity ? 'Unlimited' : String(n)) },
  { key: 'watermark', label: 'Clean PDF exports', format: (v) => (v ? '—' : '✓'), invert: true },
  { key: 'batchExport', label: 'Batch PDF / ZIP', format: (v) => (v ? '✓' : '—') },
  { key: 'cloudSync', label: 'Cloud backup & sync', format: (v) => (v ? '✓' : '—') },
  { key: 'prioritySupport', label: 'Priority support', format: (v) => (v ? '✓' : '—') },
]

export function getPlan(planId) {
  if (planId === 'premium') return PLANS.plus
  return PLANS[planId] || PLANS.free
}

export function formatPlanPrice(planId, billing = 'yearly') {
  const plan = getPlan(planId)
  if (plan.priceMonthly === 0) return '€0'
  const amount = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly
  const suffix = billing === 'yearly' ? '/year' : '/month'
  return `€${amount.toFixed(2).replace('.00', '')}${suffix}`
}

export function planDisplayName(planId) {
  return getPlan(planId).name
}
