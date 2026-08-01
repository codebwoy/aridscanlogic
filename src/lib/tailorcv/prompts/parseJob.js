import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { JOB_PROFILE_JSON_SCHEMA } from '../schema'

/** Versioned prompt: extract structured job requirements from a posting. */
export function buildParseJobPrompt({
  jobTitle = '',
  company = '',
  jobDescription = '',
  notes = '',
  language = 'de',
}) {
  return `${aiLanguageInstruction(language)}

You are ScanLogic TailorCV — analyst for German Stellenanzeigen / Bewerbungsportale.

Extract the job posting into the JSON schema below for a German application (Lebenslauf + Anschreiben).
Distinguish clearly between must-have and nice-to-have requirements based on language
(e.g. "required", "must have", "obligatorisch", "zwingend" vs "preferred", "a plus", "wünschenswert", "von Vorteil").
Pull ATS / Bewerbungsportal keywords (tools, skills, methods, soft skills as stated) that appear in the posting.
Infer seniority_level only when clearly stated or strongly implied by title (z. B. Junior / Senior / Leitung).
Keep German requirement wording when the posting is German.

Hints from the user form (prefer posting text if they conflict):
- Job title: ${jobTitle || '(not provided)'}
- Company: ${company || '(not provided)'}
- Extra notes: ${notes || '(none)'}

JSON schema shape:
${JSON.stringify(JOB_PROFILE_JSON_SCHEMA, null, 2)}

--- JOB DESCRIPTION ---
${String(jobDescription || '').trim()}
`
}
