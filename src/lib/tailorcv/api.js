/**
 * TailorCV LLM orchestration via appApi → /api/llm (no client API keys).
 */

import appApi from '@/lib/appApi'
import {
  CANDIDATE_CV_JSON_SCHEMA,
  JOB_PROFILE_JSON_SCHEMA,
  GAP_ANALYSIS_JSON_SCHEMA,
  TAILOR_CV_JSON_SCHEMA,
  COVER_LETTER_JSON_SCHEMA,
  normalizeCandidateCv,
  normalizeJobProfile,
  emptyGapAnalysis,
  countWords,
} from './schema'
import {
  buildParseCvPrompt,
  buildParseJobPrompt,
  buildGapAnalysisPrompt,
  buildTailorCvPrompt,
  buildCoverLetterPrompt,
} from './prompts'
import { validateNoFabrication } from './validateNoFabrication'
import { canRunGeneration, recordGenerationUse } from './store'

function unwrapParsed(res) {
  return res?.parsed || res?.data || {}
}

export async function parseCandidateCv(rawCvText, language = 'de') {
  if (!String(rawCvText || '').trim()) {
    throw new Error('CV-Text fehlt.')
  }
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildParseCvPrompt({ rawCvText, language }),
    response_json_schema: CANDIDATE_CV_JSON_SCHEMA,
  })
  return normalizeCandidateCv(unwrapParsed(res))
}

export async function parseJobProfile(jobInput, language = 'de') {
  if (!String(jobInput?.job_description || '').trim()) {
    throw new Error('Stellenbeschreibung fehlt.')
  }
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildParseJobPrompt({
      jobTitle: jobInput.job_title,
      company: jobInput.company,
      jobDescription: jobInput.job_description,
      notes: jobInput.notes,
      language,
    }),
    response_json_schema: JOB_PROFILE_JSON_SCHEMA,
  })
  const profile = normalizeJobProfile(unwrapParsed(res))
  if (!profile.job_title && jobInput.job_title) profile.job_title = jobInput.job_title
  if (!profile.company && jobInput.company) profile.company = jobInput.company
  return profile
}

export async function analyzeGaps(candidate, jobProfile, language = 'de') {
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildGapAnalysisPrompt({ candidate, jobProfile, language }),
    response_json_schema: GAP_ANALYSIS_JSON_SCHEMA,
  })
  const parsed = unwrapParsed(res)
  return {
    ...emptyGapAnalysis(),
    matches: Array.isArray(parsed.matches) ? parsed.matches : [],
    partial: Array.isArray(parsed.partial) ? parsed.partial : [],
    missing: Array.isArray(parsed.missing) ? parsed.missing : [],
    summary: String(parsed.summary || '').trim(),
  }
}

export async function tailorCandidateCv({
  candidate,
  jobProfile,
  notes = '',
  pageLength = 1,
  language = 'de',
}) {
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildTailorCvPrompt({
      candidate,
      jobProfile,
      notes,
      pageLength,
      language,
    }),
    response_json_schema: TAILOR_CV_JSON_SCHEMA,
  })
  const parsed = unwrapParsed(res)
  const tailored = normalizeCandidateCv(parsed.tailored_cv || parsed)
  const { flags } = validateNoFabrication(candidate, tailored)
  return {
    tailored_cv: tailored,
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    change_summary: String(parsed.change_summary || '').trim(),
    fabrication_flags: flags,
  }
}

export async function generateCoverLetter({
  candidate,
  jobProfile,
  notes = '',
  tone = 'formal',
  language = 'de',
}) {
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildCoverLetterPrompt({
      candidate,
      jobProfile,
      notes,
      tone,
      language,
    }),
    response_json_schema: COVER_LETTER_JSON_SCHEMA,
  })
  const parsed = unwrapParsed(res)
  const body = String(parsed.body || res?.text || '').trim()
  return {
    tone,
    body,
    word_count: parsed.word_count || countWords(body),
  }
}

/**
 * Full pipeline: parse CV → parse job → gaps → tailor → letter.
 * @param {{ onPhase?: (phase: string) => void }} opts
 */
export async function runTailorPipeline({
  rawCvText,
  jobInput,
  language = 'de',
  onPhase,
}) {
  if (!canRunGeneration()) {
    throw new Error('Tageslimit für TailorCV-Generierungen erreicht. Bitte morgen erneut versuchen.')
  }

  onPhase?.('parsing_cv')
  const candidate = await parseCandidateCv(rawCvText, language)

  onPhase?.('parsing_job')
  const job_profile = await parseJobProfile(jobInput, language)

  onPhase?.('analyzing')
  const gap_analysis = await analyzeGaps(candidate, job_profile, language)

  onPhase?.('generating_cv')
  const tailored = await tailorCandidateCv({
    candidate,
    jobProfile: job_profile,
    notes: jobInput.notes,
    pageLength: jobInput.page_length || 1,
    language,
  })

  onPhase?.('generating_letter')
  const cover_letter = await generateCoverLetter({
    candidate: tailored.tailored_cv,
    jobProfile: job_profile,
    notes: jobInput.notes,
    tone: jobInput.tone || 'formal',
    language,
  })

  recordGenerationUse(1)

  return {
    candidate,
    job_profile,
    gap_analysis,
    tailored_cv: tailored.tailored_cv,
    change_summary: tailored.change_summary,
    fabrication_flags: tailored.fabrication_flags,
    cover_letter,
  }
}
