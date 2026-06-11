import { SAFETY_DISCLAIMER_DE, SAFETY_DISCLAIMER_EN } from './herrMuellerPrompt'

export function buildExecutiveSummaryPrompt(language, transcript) {
  const isEn = language === 'en'
  const disclaimer = isEn ? SAFETY_DISCLAIMER_EN : SAFETY_DISCLAIMER_DE

  if (isEn) {
    return `Create an **Executive Summary** of this consultation transcript.

**Important:** Write the entire summary in **English only**. Do not mix German and English.

Use this exact markdown structure:

## Executive Summary

**Topics:** one-line overview of what was discussed

| Date | Event | Status |
|------|-------|--------|
| YYYY-MM-DD | … | … |

### Recommendations

1. …
2. …

### Open items

- …

### Questions for your tax advisor / attorney

- …

${disclaimer}

TRANSCRIPT:
${transcript}`
  }

  return `Erstellen Sie eine **Executive Summary** dieses Beratungsverlaufs.

**Wichtig:** Schreiben Sie die gesamte Zusammenfassung **ausschließlich auf Deutsch**. Keine englischen Überschriften oder Mischsprache.

Verwenden Sie exakt diese Markdown-Struktur:

## Executive Summary

**Themen:** Kurzüberblick in einem Satz

| Datum | Ereignis | Status |
|-------|----------|--------|
| JJJJ-MM-TT | … | … |

### Empfehlungen

1. …
2. …

### Offene Punkte

- …

### Fragen für Ihren Steuerberater / Rechtsanwalt

- …

${disclaimer}

VERLAUF:
${transcript}`
}
