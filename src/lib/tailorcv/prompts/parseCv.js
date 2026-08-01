import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { CANDIDATE_CV_JSON_SCHEMA } from '../schema'
import { germanLebenslaufFormatRules } from './germanFormat'

/** Versioned prompt: extract structured CV from raw text. Never invent facts. */
export function buildParseCvPrompt({ rawCvText, language = 'de' }) {
  return `${aiLanguageInstruction(language)}

You are ScanLogic TailorCV — parser for a German tabular Lebenslauf (or any CV to be mapped into that format).

Extract the candidate's CV into the JSON schema below.
${germanLebenslaufFormatRules(language)}

Rules:
1. Do NOT add, infer, or invent any information not present in the source text.
2. If a field is missing, leave it empty ("" or []).
3. Keep dates, employers, titles, degrees, and metrics exactly as written (normalize formatting only toward DE tabular use).
4. Split bullet lists into the bullets array; one Aufgabe/Ergebnis per item.
5. Do not invent LinkedIn URLs, emails, or phone numbers.
6. Put the professional profile / Kurzprofil into "summary" (not a US objective).
7. Order experience reverse-chronologically if dates allow; otherwise keep source order.
8. Map education degrees/institutions as written (e.g. Bachelor, Ausbildung, Meister — do not translate into US GPA systems).

JSON schema shape:
${JSON.stringify(CANDIDATE_CV_JSON_SCHEMA, null, 2)}

--- RAW CV TEXT ---
${String(rawCvText || '').trim()}
`
}
