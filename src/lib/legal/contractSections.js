/**
 * Build Contract Safe sections from legal profile data.
 */

import { generateImpressum, generateDatenschutz, generateAvv } from './generators'
import { buildLegalProfile } from './profile'

export const LEGAL_TEMPLATE_KEYS = ['impressum', 'datenschutz', 'avv']

export function isLegalTemplateKey(key) {
  return LEGAL_TEMPLATE_KEYS.includes(key)
}

export function buildLegalContractSections(templateKey, lang = 'de', profileOverrides = {}) {
  const profile = buildLegalProfile(profileOverrides)

  if (templateKey === 'impressum') {
    const body = generateImpressum(profile, lang)
    return [
      { heading: 'Impressum — Vorbereitungsentwurf', body },
      {
        heading: 'Footer-Hinweis',
        body: 'Diese Seite im Website-Footer verlinken. Kein Postfach — physische Anschrift erforderlich. Vor Veröffentlichung Rechtsanwalt konsultieren.',
      },
    ]
  }

  if (templateKey === 'datenschutz') {
    const body = generateDatenschutz(profile, lang)
    return [
      { heading: 'Datenschutzerklärung — Vorbereitungsentwurf', body },
      {
        heading: 'Cookie-Banner',
        body: profile.questionnaire?.hasAnalytics || profile.questionnaire?.hasCookies
          ? 'Cookie-Einwilligungsbanner vor Live-Schaltung einrichten (TTDSG §25).'
          : 'Nur technisch notwendige Cookies — dennoch in der Datenschutzerklärung dokumentieren.',
      },
    ]
  }

  if (templateKey === 'avv') {
    const body = generateAvv(profile, lang)
    return [
      { heading: 'Auftragsverarbeitungsvertrag (AVV) — Vorbereitungsentwurf', body },
      {
        heading: 'Verwendung',
        body: 'AVV ist ein Vertrag zwischen Auftraggeber (Verantwortlicher) und Auftragsverarbeiter — nicht für den öffentlichen Website-Footer. Beide Parteien unterschreiben. Rechtsanwalt prüfen lassen.',
      },
    ]
  }

  return []
}

export function buildPopulatedLegalTemplate(templateKey, lang = 'de') {
  const sections = buildLegalContractSections(templateKey, lang)
  const titles = {
    impressum: 'Impressum (Website-Footer)',
    datenschutz: 'Datenschutzerklärung (DSGVO)',
    avv: 'Auftragsverarbeitungsvertrag (AVV)',
  }
  return {
    title: titles[templateKey] || templateKey,
    template_type: templateKey,
    sections,
    _fromLegalProfile: true,
  }
}
