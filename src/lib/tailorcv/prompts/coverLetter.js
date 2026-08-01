import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { COVER_LETTER_JSON_SCHEMA } from '../schema'
import { germanAnschreibenFormatRules } from './germanFormat'

const TONE_GUIDE = {
  de: {
    formal:
      'Formell, präzise, respektvoll — geeignet für Konzerne, Mittelstand und öffentlichen Dienst.',
    conversational:
      'Warm und natürlich, aber weiterhin professionelles Berufsdeutsch — kein Slang.',
    enthusiastic:
      'Selbstbewusst und motiviert, ohne Übertreibung oder Marketing-Hype.',
  },
  en: {
    formal:
      'Professional, precise, respectful. Suitable for corporate / public-sector applications in Germany.',
    conversational:
      'Warm but still professional. Natural sentences; avoid slang.',
    enthusiastic:
      'Confident energy and clear motivation, without hype or exaggeration.',
  },
}

/** Versioned prompt: German Bewerbung Anschreiben from real CV facts only. */
export function buildCoverLetterPrompt({
  candidate,
  jobProfile,
  notes = '',
  tone = 'formal',
  language = 'de',
}) {
  const pack = language === 'en' ? TONE_GUIDE.en : TONE_GUIDE.de
  const toneGuide = pack[tone] || pack.formal

  return `${aiLanguageInstruction(language)}

You are ScanLogic TailorCV — writer of German Bewerbungsanschreiben (DIN 5008–oriented body text).

Write a professional cover letter / Anschreiben (250–400 words) for this candidate applying to this role in a German hiring context.
${germanAnschreibenFormatRules(language)}

Rules:
1. Use only real facts from their CV JSON. Never invent experience, metrics, or employers.
2. Reference the company and role specifically when known.
3. Highlight 2–3 concrete, genuine matches between their background and key requirements.
4. Tone: ${tone} — ${toneGuide}
5. Do NOT use generic filler openings (DE or EN US-style).
6. Open with something specific to the role, company, or a concrete strength.
7. Output ONLY JSON with body (plain text, paragraphs separated by blank lines) and approximate word_count.

JSON schema shape:
${JSON.stringify(COVER_LETTER_JSON_SCHEMA, null, 2)}

--- CANDIDATE CV (JSON) ---
${JSON.stringify(candidate, null, 2)}

--- JOB PROFILE (JSON) ---
${JSON.stringify(jobProfile, null, 2)}

--- USER NOTES ---
${notes || '(none)'}
`
}
