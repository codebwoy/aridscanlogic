import { SAFETY_DISCLAIMER_DE, SAFETY_DISCLAIMER_EN } from './herrMuellerPrompt'

const SUMMARY_RULES_EN = `**Rules:**
- Base every section ONLY on what was actually discussed in the transcript.
- Do NOT use generic placeholder advice (tax office paperwork, contract review, VAT strategy) unless those topics came up.
- Mirror the user's real question (e.g. ETFs for children → investment, custody, tax wrapper, risk, horizon).
- Timeline rows must reflect real events from the transcript with today's date where appropriate.
- If the advisor gave no answer yet, say so under Open items.`

const SUMMARY_RULES_DE = `**Regeln:**
- Jeder Abschnitt muss sich NUR auf den tatsächlichen Beratungsverlauf beziehen.
- KEINE generischen Platzhalter (Finanzamt, Vertragsprüfung, USt-Strategie), wenn das nicht besprochen wurde.
- Die echte Nutzerfrage widerspiegeln (z. B. ETFs für Kinder → Anlage, Depot, Steuer, Risiko, Zeithorizont).
- Timeline-Einträge aus dem Verlauf ableiten, aktuelles Datum wo passend.
- Wenn noch keine Antwort gegeben wurde, unter Offene Punkte vermerken.`

export function buildExecutiveSummaryPrompt(language, transcript) {
  const isEn = language === 'en'
  const disclaimer = isEn ? SAFETY_DISCLAIMER_EN : SAFETY_DISCLAIMER_DE
  const rules = isEn ? SUMMARY_RULES_EN : SUMMARY_RULES_DE

  if (isEn) {
    return `Create an **Executive Summary** of this consultation transcript.

**Important:** Write the entire summary in **English only**. Do not mix German and English.

${rules}

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

${rules}

Verwenden Sie exakt diese Markdown-Struktur:

## Zusammenfassung

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
