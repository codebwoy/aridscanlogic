/**
 * Pull locked legal modules from BizStart Website-Rechtliches + session overrides.
 * AI must never rewrite these strings silently.
 */

import { loadLegalData } from '@/lib/legal/store'
import { emptyLegalModules } from './schema'

export function loadLockedLegalModules(sessionLegal = {}) {
  const legalData = loadLegalData()
  const drafts = legalData.drafts || {}
  const profile = legalData.profile || {}

  const impressumFromProfile = [
    profile.businessName || [profile.firstName, profile.lastName].filter(Boolean).join(' '),
    [profile.street, profile.houseNumber].filter(Boolean).join(' '),
    [profile.plz, profile.city].filter(Boolean).join(' '),
    profile.country || 'Deutschland',
    profile.email ? `E-Mail: ${profile.email}` : '',
    profile.phone ? `Tel.: ${profile.phone}` : '',
    profile.ustIdNr ? `USt-IdNr.: ${profile.ustIdNr}` : '',
    profile.handelsregister ? `Register: ${profile.handelsregister}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    ...emptyLegalModules(),
    impressum: sessionLegal.impressum || drafts.impressum || impressumFromProfile || '',
    widerrufsbelehrung: sessionLegal.widerrufsbelehrung || '',
    widerrufsformular: sessionLegal.widerrufsformular || '',
    rueckgabebedingungen: sessionLegal.rueckgabebedingungen || '',
    agb: sessionLegal.agb || '',
    datenschutz: sessionLegal.datenschutz || drafts.datenschutz || '',
    locked: true,
  }
}

export function legalModulesReady(legal) {
  return !!(legal?.impressum && String(legal.impressum).trim().length > 20)
}
