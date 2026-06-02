/** Rich demo responses when Base44 API is not configured */

export function buildMuellerDemoResponse(prompt, userSnippet) {
  const p = prompt.toLowerCase()
  const q = (userSnippet || '').slice(0, 120)

  if (p.includes('executive summary') || p.includes('zusammenfassung')) {
    return `## Executive Summary

**Themen:** Beratung zu ${q || 'Ihrem Anliegen'}

| Datum | Ereignis | Status |
|-------|----------|--------|
| ${new Date().toISOString().slice(0, 10)} | Erstberatung Herr Müller | Abgeschlossen |

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

*Hinweis: Allgemeine Information und Coaching — kein Ersatz für Rechtsanwalt oder Steuerberater. Konfigurieren Sie VITE_BASE44_* für Live-KI-Antworten.*`
}
