/** EN + DE UI strings for AuthorForge studio */

export const STRINGS = {
  en: {
    appName: 'AuthorForge',
    tagline: 'Co-author your non-fiction book — then export for KDP and your storefront',
    desktopRequired: 'AuthorForge needs a desktop screen (≥1024px).',
    credits: 'Credits',
    costToDate: 'Est. LLM cost',
    saveDraft: 'Save draft',
    back: 'Back',
    next: 'Next',
    newBook: 'New book',
    openWizard: 'Continue wizard',
    offlineHint: 'Run npm run authorforge:dev from the repo root.',
  },
  de: {
    appName: 'AuthorForge',
    tagline: 'Co-Autor für Ihr Sachbuch — Export für KDP und Ihren eigenen Shop',
    desktopRequired: 'AuthorForge benötigt einen Desktop-Bildschirm (≥1024px).',
    credits: 'Credits',
    costToDate: 'Geschätzte LLM-Kosten',
    saveDraft: 'Entwurf speichern',
    back: 'Zurück',
    next: 'Weiter',
    newBook: 'Neues Buch',
    openWizard: 'Assistent fortsetzen',
    offlineHint: 'Im Repo-Root: npm run authorforge:dev',
  },
}

export function t(lang, key) {
  const L = STRINGS[lang] || STRINGS.en
  return L[key] || STRINGS.en[key] || key
}
