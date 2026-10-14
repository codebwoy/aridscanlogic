/**
 * Personal-studio entitlements — ProofForge is for your own books.
 * No Stripe / SaaS billing. Audits are always allowed locally.
 */

export function resolveEntitlement(_opts = {}) {
  return {
    plan: 'personal',
    can_analyze: true,
    can_export: true,
    billing: false,
    note: 'Personal studio — unlimited local audits for your own manuscripts. No payment required.',
  }
}
