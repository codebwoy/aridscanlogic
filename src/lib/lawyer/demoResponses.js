/** Rich demo responses when Anthropic API is not configured */

function executiveSummaryDemo(language, userSnippet) {
  const q = (userSnippet || '').slice(0, 120)
  const date = new Date().toISOString().slice(0, 10)

  if (language === 'en') {
    return `## Executive Summary

**Topics:** Consultation on ${q || 'your question'}

| Date | Event | Status |
|------|-------|--------|
| ${date} | Initial consultation with Herr Müller | Completed |

### Recommendations

1. Prepare documentation for the tax office
2. Schedule a meeting with your tax advisor for income/VAT questions
3. Have your contract draft reviewed by an attorney

### Open items

- Individual profit forecast not yet calculated
- Contract clauses not yet legally confirmed

### Questions for your tax advisor / attorney

- Does your legal structure fit your scaling plans?
- What is the optimal input-VAT strategy?

*Note: This guidance is for general information and coaching only.*`
  }

  return `## Executive Summary

**Themen:** Beratung zu ${q || 'Ihrem Anliegen'}

| Datum | Ereignis | Status |
|-------|----------|--------|
| ${date} | Erstberatung Herr Müller | Abgeschlossen |

### Empfehlungen

1. Dokumentation für Finanzamt vorbereiten
2. Termin mit Steuerberater für konkrete ESt/USt-Fragen
3. Vertragsentwurf vom Rechtsanwalt prüfen lassen

### Offene Punkte

- Individuelle Gewinnprognose noch nicht berechnet
- Vertragsklauseln rechtlich verbindlich bestätigen

### Fragen für Ihren Steuerberater / Rechtsanwalt

- Passt die gewählte Rechtsform zu geplanter Skalierung?
- Optimale Vorsteuerabzugs-Strategie?

*Hinweis: Diese Beratung dient ausschließlich der allgemeinen Information und Bildung.*`
}

export function buildMuellerDemoResponse(prompt, userSnippet, language = 'de') {
  const p = prompt.toLowerCase()
  const q = (userSnippet || '').slice(0, 120)
  const lang =
    language === 'en' || language === 'de'
      ? language
      : prompt.includes('**Topics:**') || prompt.includes('Write the entire summary in **English only**')
        ? 'en'
        : 'de'

  if (p.includes('executive summary') || p.includes('zusammenfassung')) {
    return executiveSummaryDemo(lang, q)
  }

  if (p.includes('document') || p.includes('vertrag') || p.includes('review') || p.includes('prüfen')) {
    return `## Vertragsprüfung — Kurzfassung

### Summary
Das vorliegende Dokument enthält typische Dienstleistungsklauseln. Im Demo-Modus ohne Live-OCR bitte vollständigen Text einfügen.

### Red flags (checklist)
- **Haftung:** Ist die Haftung auf Vorsatz/grobe Fahrlässigkeit begrenzt?
- **IP:** Wer erhält Nutzungsrechte an Arbeitsergebnissen?
- **Kündigung:** Fristen und außerordentliche Kündigung klar?
- **AGB-Einbeziehung:** Zwei-Schritt-Hinweis nach BGB?

### Nächste Schritte
1. Volltext an Rechtsanwalt senden
2. Verhandlungspunkte markieren

*Keine Rechtsberatung im engeren Sinne.*`
  }

  if (p.includes('nda') || p.includes('vertrag erstellen') || p.includes('draft')) {
    return `## NDA-Vorlage (Auszug — DE/EN)

**Vertraulichkeitsvereinbarung / Non-Disclosure Agreement**

Zwischen **Auftraggeber** und **Auftragnehmer** (Freelancer Software).

1. **Vertrauliche Informationen:** Alle nicht öffentlichen technischen und geschäftlichen Informationen.
2. **Laufzeit:** 3 Jahre ab Offenlegung.
3. **Ausnahmen:** Öffentlich bekannt, rechtmäßig von Dritten erhalten.
4. **Gerichtsstand:** Deutschland (optional: Ort des Auftraggebers).

*Mustervorlage — vor Unterzeichnung von einem Rechtsanwalt prüfen lassen.*`
  }

  if (p.includes('gmbh') || p.includes('ug') || p.includes('einzel') || p.includes('structure') || p.includes('rechtsform')) {
    return `## Rechtsformen-Vergleich (Kurz)

| | GmbH | UG | Einzelunternehmen |
|---|------|-----|-------------------|
| Haftung | Beschränkt | Beschränkt | Persönlich |
| Stammkapital | €25.000 | ab €1 | — |
| Gewerbe/HR | Ja | Ja | Gewerbe, ggf. HR |
| Steuer | KSt+GewSt+USt | wie GmbH | ESt+GewSt+USt |

### Nächste Schritte
1. Gewerbeanmeldung / Finanzamt-Fragebogen
2. Steuerberater für Prognose

*Hinweis: Bildungs- und Coaching-Zwecke.*`
  }

  if (p.includes('kleinunternehmer') || p.includes('ust') || p.includes('steuer') || p.includes('tax')) {
    return `## Steuerplanung — Überblick

### Umsatzsteuer
- **Regelsteuersatz:** 19%
- **Ermäßigt:** 7%
- **Kleinunternehmer §19 UStG:** Umsatz Vorjahr ≤ €22.000, laufend ≤ €50.000 — keine USt-Ausweisung

### Einkommensteuer
Progressiv bis ca. **45%** zuzüglich Solidaritätszuschlag.

### Abzugsfähig (typisch)
- Homeoffice (Arbeitszimmer)
- Geschäftsreisen, Bewirtung (Grenzen beachten)
- Fortbildung

### Fragen für Steuerberater
- Ist Kleinunternehmerregelung optimal?
- Gewerbesteuer-Hebesatz in Ihrer Gemeinde?

*Keine individuelle Steuerberatung.*`
  }

  if (lang === 'en') {
    return `## Summary

Regarding your question: **${q || 'your topic'}**

I structure advice across **financial fundamentals**, **tax efficiency**, and **legal protection** — always as preparation for your licensed advisors.

### Detail
- Analyse your situation (legal form, revenue, timeline)
- Document decisions in writing
- Plan reserves for tax and social contributions

### Next steps
1. Gather your numbers (revenue, costs, drawings)
2. Book a tax advisor appointment
3. For contracts: consult an attorney

*Note: General coaching only — not a substitute for licensed legal or tax advice. Set ANTHROPIC_API_KEY in .env for live AI responses.*`
  }

  return `## Kurzfassung

Zu Ihrer Frage: **${q || 'Ihr Anliegen'}**

Ich strukturiere Beratung in drei Ebenen: **finanzielle Grundlagen**, **steuerliche Effizienz** und **rechtliche Absicherung** — immer als Vorbereitung für Ihre zugelassenen Fachberater.

### Detail
- Analysieren Sie Ihre konkrete Situation (Rechtsform, Umsatz, Timeline)
- Dokumentieren Sie Entscheidungen schriftlich
- Planen Sie Puffer für Steuer- und Sozialabgaben

### Nächste Schritte
1. Zahlen zusammentragen (Umsatz, Kosten, Privatentnahmen)
2. Termin Steuerberater
3. Bei Verträgen: Rechtsanwalt

*Hinweis: Allgemeine Information und Coaching — kein Ersatz für Rechtsanwalt oder Steuerberater. Setzen Sie ANTHROPIC_API_KEY in .env für Live-KI-Antworten.*`
}
