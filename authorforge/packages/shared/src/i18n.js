/** EN + DE UI strings for AuthorForge studio */

export const STRINGS = {
  en: {
    appName: 'AuthorForge',
    tagline: 'Co-author adult non-fiction — guides, workbooks, parenting books — then export for KDP',
    categoryBadge: 'Non-fiction only',
    positioningLead:
      'Culturally specific non-fiction for African-heritage, bilingual, Germany-based authors. Not fiction or kids’ picture books (StoryForge).',
    hybridHint:
      'Hybrid: bilingual kids’ series in StoryForge → parenting / coaching companion here.',
    nichesHeading: 'Recommended niches for your lane',
    applyNicheHint: 'Create or open a book, then tap Use this niche to seed title, USP, and audience.',
    marketDisclaimer:
      '⚠ Strategic niche guidance — not verified Amazon sales data. Validate demand yourself.',
    assistantIdle:
      'Ask for title ideas or niche-down positioning for culturally specific non-fiction. Never invent credentials, proverbs, or stats. Picture books → StoryForge.',
    desktopRequired: 'AuthorForge needs a desktop screen (≥1024px).',
    credits: 'Credits',
    costToDate: 'Est. LLM cost',
    saveDraft: 'Save draft',
    back: 'Back',
    next: 'Next',
    newBook: 'New non-fiction book',
    openWizard: 'Continue wizard',
    offlineHint: 'Run npm run authorforge:dev from the repo root.',
  },
  de: {
    appName: 'AuthorForge',
    tagline: 'Co-Autor für Sachbücher — Ratgeber, Workbooks, Erziehung — Export für KDP',
    categoryBadge: 'Nur Sachbuch',
    positioningLead:
      'Kulturell spezifisches Sachbuch für Autor:innen mit afrikanischem Erbe, Zweisprachigkeit, Standort Deutschland. Keine Fiction / Bilderbücher (StoryForge).',
    hybridHint:
      'Hybrid: zweisprachige Kinderbuch-Serie in StoryForge → Eltern-/Coaching-Begleiter hier.',
    nichesHeading: 'Empfohlene Nischen für Ihre Spur',
    applyNicheHint: 'Buch anlegen oder öffnen, dann „Diese Nische nutzen“ — Titel, USP und Audience werden befüllt.',
    marketDisclaimer:
      '⚠ Strategische Nischen-Hinweise — keine verifizierten Amazon-Verkaufsdaten. Nachfrage selbst prüfen.',
    assistantIdle:
      'Titel oder Nischen-Positionierung für kulturell spezifisches Sachbuch. Keine erfundenen Credentials, Sprichwörter oder Stats. Bilderbücher → StoryForge.',
    desktopRequired: 'AuthorForge benötigt einen Desktop-Bildschirm (≥1024px).',
    credits: 'Credits',
    costToDate: 'Geschätzte LLM-Kosten',
    saveDraft: 'Entwurf speichern',
    back: 'Zurück',
    next: 'Weiter',
    newBook: 'Neues Sachbuch',
    openWizard: 'Assistent fortsetzen',
    offlineHint: 'Im Repo-Root: npm run authorforge:dev',
  },
}

export function t(lang, key) {
  const L = STRINGS[lang] || STRINGS.en
  return L[key] || STRINGS.en[key] || key
}
