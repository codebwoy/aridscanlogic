/** Product positioning — manuscript audit after AuthorForge / NovelForge / StoryForge */

export const PRODUCT_NAME = 'ProofForge'
export const PRODUCT_TAGLINE = 'AI manuscript audit & humanoid proofreader'

export const PRODUCT_COPY = {
  en: {
    title: 'ProofForge',
    subtitle: 'Whole-manuscript audit before KDP upload',
    blurb:
      'After you finish a book in NovelForge, AuthorForge, or StoryForge, run a structured proofread and localization pass. Accept or reject each suggestion. Scores are guides — not Amazon approval.',
    disclaimer:
      'Not affiliated with Amazon. Does not guarantee KDP acceptance or replace human editors for high-stakes claims.',
  },
  de: {
    title: 'ProofForge',
    subtitle: 'Manuskript-Audit vor dem KDP-Upload',
    blurb:
      'Nach dem Schreiben in NovelForge, AuthorForge oder StoryForge: strukturiertes Korrekturlesen und Lokalisierung. Jeden Vorschlag annehmen oder ablehnen. Scores sind Orientierung — keine Amazon-Freigabe.',
    disclaimer:
      'Nicht mit Amazon verbunden. Keine Garantie für KDP-Annahme; ersetzt keine menschliche Prüfung bei heiklen Aussagen.',
  },
}

export function productPayload(lang = 'en') {
  const copy = PRODUCT_COPY[lang] || PRODUCT_COPY.en
  return {
    name: PRODUCT_NAME,
    tagline: PRODUCT_TAGLINE,
    ...copy,
  }
}
