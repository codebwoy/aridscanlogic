function e(e,t){let n=(t||``).slice(0,120),r=new Date().toISOString().slice(0,10);return e===`en`?`## Executive Summary

**Topics:** Consultation on ${n||`your question`}

| Date | Event | Status |
|------|-------|--------|
| ${r} | Initial consultation with Herr Müller | Completed |

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

*Note: This guidance is for general information and coaching only.*`:`## Executive Summary

**Themen:** Beratung zu ${n||`Ihrem Anliegen`}

| Datum | Ereignis | Status |
|-------|----------|--------|
| ${r} | Erstberatung Herr Müller | Abgeschlossen |

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

*Hinweis: Diese Beratung dient ausschließlich der allgemeinen Information und Bildung.*`}function t(t,n,r=`de`){let i=t.toLowerCase(),a=(n||``).slice(0,120),o=r===`en`||r===`de`?r:t.includes(`**Topics:**`)||t.includes(`Write the entire summary in **English only**`)?`en`:`de`;return i.includes(`executive summary`)||i.includes(`zusammenfassung`)?e(o,a):i.includes(`document`)||i.includes(`vertrag`)||i.includes(`review`)||i.includes(`prüfen`)?`## Vertragsprüfung — Kurzfassung

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

*Keine Rechtsberatung im engeren Sinne.*`:i.includes(`nda`)||i.includes(`vertrag erstellen`)||i.includes(`draft`)?`## NDA-Vorlage (Auszug — DE/EN)

**Vertraulichkeitsvereinbarung / Non-Disclosure Agreement**

Zwischen **Auftraggeber** und **Auftragnehmer** (Freelancer Software).

1. **Vertrauliche Informationen:** Alle nicht öffentlichen technischen und geschäftlichen Informationen.
2. **Laufzeit:** 3 Jahre ab Offenlegung.
3. **Ausnahmen:** Öffentlich bekannt, rechtmäßig von Dritten erhalten.
4. **Gerichtsstand:** Deutschland (optional: Ort des Auftraggebers).

*Mustervorlage — vor Unterzeichnung von einem Rechtsanwalt prüfen lassen.*`:i.includes(`gmbh`)||i.includes(`ug`)||i.includes(`einzel`)||i.includes(`structure`)||i.includes(`rechtsform`)?`## Rechtsformen-Vergleich (Kurz)

| | GmbH | UG | Einzelunternehmen |
|---|------|-----|-------------------|
| Haftung | Beschränkt | Beschränkt | Persönlich |
| Stammkapital | €25.000 | ab €1 | — |
| Gewerbe/HR | Ja | Ja | Gewerbe, ggf. HR |
| Steuer | KSt+GewSt+USt | wie GmbH | ESt+GewSt+USt |

### Nächste Schritte
1. Gewerbeanmeldung / Finanzamt-Fragebogen
2. Steuerberater für Prognose

*Hinweis: Bildungs- und Coaching-Zwecke.*`:i.includes(`kleinunternehmer`)||i.includes(`ust`)||i.includes(`steuer`)||i.includes(`tax`)?`## Steuerplanung — Überblick

### Umsatzsteuer
- **Regelsteuersatz:** 19%
- **Ermäßigt:** 7%
- **Kleinunternehmer §19 UStG:** Umsatz Vorjahr ≤ €25.000 netto, laufend ≤ €100.000 netto (seit 2025) — keine USt-Ausweisung, kein Vorsteuerabzug

### Einkommensteuer
Progressiv bis ca. **45%** zuzüglich Solidaritätszuschlag.

### Abzugsfähig (typisch)
- Homeoffice (Arbeitszimmer)
- Geschäftsreisen, Bewirtung (Grenzen beachten)
- Fortbildung

### Fragen für Steuerberater
- Ist Kleinunternehmerregelung optimal?
- Gewerbesteuer-Hebesatz in Ihrer Gemeinde?

*Keine individuelle Steuerberatung.*`:o===`en`?`## Summary

Regarding your question: **${a||`your topic`}**

I structure advice across **financial fundamentals**, **tax efficiency**, and **legal protection** — always as preparation for your licensed advisors.

### Detail
- Analyse your situation (legal form, revenue, timeline)
- Document decisions in writing
- Plan reserves for tax and social contributions

### Next steps
1. Gather your numbers (revenue, costs, drawings)
2. Book a tax advisor appointment
3. For contracts: consult an attorney

*Note: General coaching only — not a substitute for licensed legal or tax advice. Set ANTHROPIC_API_KEY in .env for live AI responses.*`:`## Kurzfassung

Zu Ihrer Frage: **${a||`Ihr Anliegen`}**

Ich strukturiere Beratung in drei Ebenen: **finanzielle Grundlagen**, **steuerliche Effizienz** und **rechtliche Absicherung** — immer als Vorbereitung für Ihre zugelassenen Fachberater.

### Detail
- Analysieren Sie Ihre konkrete Situation (Rechtsform, Umsatz, Timeline)
- Dokumentieren Sie Entscheidungen schriftlich
- Planen Sie Puffer für Steuer- und Sozialabgaben

### Nächste Schritte
1. Zahlen zusammentragen (Umsatz, Kosten, Privatentnahmen)
2. Termin Steuerberater
3. Bei Verträgen: Rechtsanwalt

*Hinweis: Allgemeine Information und Coaching — kein Ersatz für Rechtsanwalt oder Steuerberater. Setzen Sie ANTHROPIC_API_KEY in .env für Live-KI-Antworten.*`}export{t as buildMuellerDemoResponse};