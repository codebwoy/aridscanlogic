/**
 * Shared German Lebenslauf / Bewerbung conventions for TailorCV prompts.
 * Structure is always DE-format; wording language follows aiLanguageInstruction.
 */

export function germanLebenslaufFormatRules(language = 'de') {
  const de = language !== 'en'
  return de
    ? `
GERMAN FORMAT (verbindlich — kein US-Résumé):
- Ziel ist ein tabellarischer deutscher Lebenslauf für Bewerbungen in Deutschland (Arbeitgeber, Behörden, Förderung).
- Struktur der Inhalte: Kurzprofil → Berufserfahrung (rückwärts chronologisch) → Ausbildung → Weiterbildungen/Zertifikate → Kenntnisse/Projekte.
- Berufserfahrung: neueste Position zuerst. Pro Stelle knappe Aufzählungspunkte (Aufgaben/Ergebnisse), keine Fließtext-Erzählung wie im US-Résumé.
- Kurzprofil (summary): 3–5 sachliche Sätze, kein "Career Objective" / "References available upon request".
- Formulierungen: professionelles Berufsdeutsch (klar, faktisch, höflich) — geeignet für deutsche Personalabteilungen.
- Datumsangaben möglichst MM/JJJJ oder MM.JJJJ bzw. wie in der Quelle; keine US-Monatsnamen erzwingen.
- Keine US-Résumé-Floskeln: "leveraged", "synergies", "rockstar", "passionate about", Objective-Absatz, "References on request".
- Keine erfundenen Soft-Skill-Absätze ohne Beleg in der Quelle.
- Skills als klare Liste (Tools, Sprachen, Methoden) — nicht als Marketing-Buzzword-Wolke.
- Die App mappt das Ergebnis in den tabellarischen Lebenslauf-Builder (DIN-orientierte Darstellung beim Export).
`
    : `
GERMAN FORMAT (mandatory structure — not a US-style résumé):
- Target format: German tabular Lebenslauf for applications in Germany (employers, agencies, funding).
- Content order: short profile → work experience (reverse chronological) → education → training/certs → skills/projects.
- Experience: most recent first. Concise duty/achievement bullets per role — not a US résumé narrative.
- Summary: 3–5 factual sentences — no "Career Objective", no "References available upon request".
- Avoid US résumé clichés ("leveraged", "rockstar", "passionate about", synergy fluff).
- Skills as a clear list (tools, languages, methods).
- The app maps output into the tabular Lebenslauf builder for DE-style export.
`
}

export function germanAnschreibenFormatRules(language = 'de') {
  const de = language !== 'en'
  return de
    ? `
GERMAN ANSCHREIBEN (Bewerbung, kein US Cover Letter):
- Deutscher Bewerbungsstil: Einleitung mit Bezug zur Stelle/Firma → Qualifikation mit 2–3 konkreten Belegen → Motivation → höflicher Schluss mit Verfügbarkeit.
- Keine US-Floskeln: "I am writing to express my interest", "I believe I would be a great fit", "Please find my résumé attached".
- Keine DIN-Adressblöcke im Fließtext (Absender/Empfänger setzt die App).
- Anrede-Satz weglassen (App ergänzt „Sehr geehrte…“).
- Ton: Telc B2 Beruf / Arbeitsplatzdeutsch — sachlich, überzeugend, ohne Übertreibung.
- 250–400 Wörter, Absätze durch Leerzeilen getrennt.
`
    : `
GERMAN COVER LETTER STRUCTURE (Bewerbung-style, not US cover letter):
- Structure: role/company-specific opening → 2–3 evidenced qualifications → motivation → polite close with availability.
- Avoid US clichés ("I am writing to express my interest", "great fit", "attached résumé").
- Do not include DIN address blocks or salutation (the app adds those).
- 250–400 words, paragraphs separated by blank lines.
`
}
