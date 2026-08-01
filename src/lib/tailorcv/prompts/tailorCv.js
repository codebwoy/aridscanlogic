import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { TAILOR_CV_JSON_SCHEMA } from '../schema'
import { germanLebenslaufFormatRules } from './germanFormat'

/** Versioned prompt: rewrite CV as German tabular Lebenslauf for a target role. */
export function buildTailorCvPrompt({
  candidate,
  jobProfile,
  notes = '',
  pageLength = 1,
  language = 'de',
}) {
  return `${aiLanguageInstruction(language)}

You are a professional German Lebenslauf writer for ScanLogic TailorCV (tabellarischer Lebenslauf — NOT a US-style résumé).

Using ONLY the facts in the candidate's structured CV, rewrite it to target the job below.
${germanLebenslaufFormatRules(language)}

Rules:
1. Never invent employers, titles, dates, degrees, certifications, or metrics not present in the source.
2. You may reorder, re-prioritize, and rephrase bullets to foreground relevant experience — always reverse chronological for experience/education.
3. Mirror the job description's terminology ONLY where the candidate's experience genuinely matches (ATS / Bewerbungsportal keyword alignment for Germany).
4. Quantify achievements only if numbers already exist in the source.
5. Keep the Lebenslauf suitable for about ${pageLength} page(s) (typical DE applications: 1–2 pages).
6. Flag any job requirement the candidate does not appear to meet in the gaps array — do not paper over gaps in the CV body.
7. change_summary: short bullet-style explanation (in the response language) of what you emphasized for a German application.
8. summary field = deutsches Kurzprofil (or English equivalent if language=en), not a US career objective.
9. Prefer concise duty bullets suitable for a tabular layout (Berufserfahrung / Ausbildung).

Output JSON matching the schema (tailored_cv + gaps + change_summary).

JSON schema shape:
${JSON.stringify(TAILOR_CV_JSON_SCHEMA, null, 2)}

--- CANDIDATE CV (JSON) ---
${JSON.stringify(candidate, null, 2)}

--- JOB PROFILE (JSON) ---
${JSON.stringify(jobProfile, null, 2)}

--- USER NOTES ---
${notes || '(none)'}
`
}
