import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { GAP_ANALYSIS_JSON_SCHEMA } from '../schema'

/** Versioned prompt: honest match / gap analysis for German applications. */
export function buildGapAnalysisPrompt({ candidate, jobProfile, language = 'de' }) {
  return `${aiLanguageInstruction(language)}

You are ScanLogic TailorCV — analyst for German job applications (Bewerbung / Stellenanzeige).

Compare the candidate's structured Lebenslauf data to the job profile.
Classify each requirement honestly:
- matches: clearly supported by CV evidence
- partial: transferable or only partly covered
- missing: not evidenced in the CV (never invent coverage)

Rules:
1. Use ONLY facts from the candidate JSON.
2. Prefer must_have items; still list important nice_to_have gaps.
3. evidence must quote or paraphrase real CV content (or "" if missing).
4. summary: 2–4 sentences for the applicant — transparent and actionable for a German Bewerbung; no false reassurance.
5. Phrase requirements/evidence in the response language; keep employer/tool names as in the posting.

JSON schema shape:
${JSON.stringify(GAP_ANALYSIS_JSON_SCHEMA, null, 2)}

--- CANDIDATE CV (JSON) ---
${JSON.stringify(candidate, null, 2)}

--- JOB PROFILE (JSON) ---
${JSON.stringify(jobProfile, null, 2)}
`
}
