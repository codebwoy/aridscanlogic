/** Shared voice rules for German e-commerce listing copy. */

export function germanRetailVoiceRules() {
  return `
GERMAN E-COMMERCE VOICE (mandatory):
- klar, sachlich, präzise, vertrauenswürdig, natürlich, kundenorientiert
- Professional "Sie" address only (Ihre Bestellung, Sie erhalten, Bitte beachten Sie)
- NO American hype, fake urgency, emoji storms, "Unglaublich!", "JETZT KAUFEN!!!", "BESTSELLER!!!"
- Prefer: „Überzeugt durch…“, „Geeignet für…“, „Praktisch im Alltag…“, „Das schlichte Design lässt sich…“
- Short paragraphs, meaningful headings, bullets where useful
- SEO: natural German search terms — no keyword stuffing
- Never invent dimensions, materials, certifications, CE, warranties, shipping times, stock, GPSR data, Made in Germany, or accessories
- If a fact is missing: omit it or write „Nicht angegeben“ — never guess
- Do not rewrite locked legal modules (Impressum, Widerruf, AGB, Datenschutz)
`
}

export function noHallucinationRules() {
  return `
NO-HALLUCINATION RULE (highest priority):
Only use facts present in the verified product JSON.
Unsupported evaluative claims (premium, nachhaltig, ergonomisch, wasserdicht, rostfrei, Made in Germany, CE-zertifiziert, etc.) are forbidden unless explicitly verified in the product data.
Supplier marketing fluff is NOT automatically verified — treat as unverified until confirmed.
`
}
