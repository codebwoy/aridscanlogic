/**
 * TailorCV — structured CV / job / match schemas for job-targeted applications.
 * Maps to BizStart Lebenslauf + Anschreiben for editing & export.
 */

export const TONE_OPTIONS = [
  { id: 'formal', labelDe: 'Formell', labelEn: 'Formal' },
  { id: 'conversational', labelDe: 'Gesprächig', labelEn: 'Conversational' },
  { id: 'enthusiastic', labelDe: 'Enthusiastisch', labelEn: 'Enthusiastic' },
]

export const MATCH_LEVELS = ['matched', 'partial', 'missing']

export const TAILOR_PHASES = [
  'idle',
  'input',
  'parsing_cv',
  'parsing_job',
  'analyzing',
  'generating_cv',
  'generating_letter',
  'review',
  'error',
]

export function emptyContact() {
  return { name: '', email: '', phone: '', location: '', linkedin: '' }
}

export function emptyExperience() {
  return {
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    bullets: [],
  }
}

export function emptyEducation() {
  return { degree: '', institution: '', start_date: '', end_date: '' }
}

export function emptyProject() {
  return { name: '', description: '' }
}

/** Structured candidate CV (LLM parse / tailor output). */
export function emptyCandidateCv() {
  return {
    contact: emptyContact(),
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
  }
}

/** Structured job posting extract. */
export function emptyJobProfile() {
  return {
    job_title: '',
    company: '',
    seniority_level: '',
    must_have_requirements: [],
    nice_to_have_requirements: [],
    key_responsibilities: [],
    keywords_for_ats: [],
    tone_signals: '',
  }
}

export function emptyMatchItem() {
  return {
    requirement: '',
    level: 'missing', // matched | partial | missing
    evidence: '',
    kind: 'must_have', // must_have | nice_to_have
  }
}

export function emptyGapAnalysis() {
  return {
    matches: [],
    partial: [],
    missing: [],
    summary: '',
  }
}

export function emptyCoverLetter() {
  return {
    tone: 'formal',
    body: '',
    word_count: 0,
  }
}

export function emptyJobInput() {
  return {
    job_title: '',
    company: '',
    job_description: '',
    notes: '',
    tone: 'formal',
    page_length: 1,
  }
}

/** Full TailorCV session (localStorage). */
export function emptyTailorSession() {
  return {
    version: 1,
    phase: 'input',
    source: 'paste', // paste | upload | lebenslauf
    raw_cv_text: '',
    source_filename: '',
    job_input: emptyJobInput(),
    candidate: emptyCandidateCv(),
    job_profile: emptyJobProfile(),
    gap_analysis: emptyGapAnalysis(),
    tailored_cv: emptyCandidateCv(),
    cover_letter: emptyCoverLetter(),
    change_summary: '',
    fabrication_flags: [],
    privacy_acknowledged: false,
    error: '',
    updated_at: null,
  }
}

/** JSON Schema for LLM structured CV parse / tailor. */
export const CANDIDATE_CV_JSON_SCHEMA = {
  type: 'object',
  properties: {
    contact: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        location: { type: 'string' },
        linkedin: { type: 'string' },
      },
    },
    summary: { type: 'string' },
    skills: { type: 'array', items: { type: 'string' } },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          start_date: { type: 'string' },
          end_date: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          start_date: { type: 'string' },
          end_date: { type: 'string' },
        },
      },
    },
    certifications: { type: 'array', items: { type: 'string' } },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  },
  required: ['contact', 'summary', 'skills', 'experience', 'education'],
}

export const JOB_PROFILE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    job_title: { type: 'string' },
    company: { type: 'string' },
    seniority_level: { type: 'string' },
    must_have_requirements: { type: 'array', items: { type: 'string' } },
    nice_to_have_requirements: { type: 'array', items: { type: 'string' } },
    key_responsibilities: { type: 'array', items: { type: 'string' } },
    keywords_for_ats: { type: 'array', items: { type: 'string' } },
    tone_signals: { type: 'string' },
  },
  required: [
    'job_title',
    'must_have_requirements',
    'nice_to_have_requirements',
    'keywords_for_ats',
  ],
}

export const TAILOR_CV_JSON_SCHEMA = {
  type: 'object',
  properties: {
    tailored_cv: CANDIDATE_CV_JSON_SCHEMA,
    gaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirement: { type: 'string' },
          level: { type: 'string', enum: MATCH_LEVELS },
          evidence: { type: 'string' },
          kind: { type: 'string', enum: ['must_have', 'nice_to_have'] },
        },
      },
    },
    change_summary: { type: 'string' },
  },
  required: ['tailored_cv', 'gaps', 'change_summary'],
}

export const GAP_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    matches: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirement: { type: 'string' },
          evidence: { type: 'string' },
          kind: { type: 'string' },
        },
      },
    },
    partial: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirement: { type: 'string' },
          evidence: { type: 'string' },
          kind: { type: 'string' },
        },
      },
    },
    missing: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirement: { type: 'string' },
          evidence: { type: 'string' },
          kind: { type: 'string' },
        },
      },
    },
    summary: { type: 'string' },
  },
  required: ['matches', 'partial', 'missing', 'summary'],
}

export const COVER_LETTER_JSON_SCHEMA = {
  type: 'object',
  properties: {
    body: { type: 'string' },
    word_count: { type: 'number' },
  },
  required: ['body'],
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export function getMaxUploadBytes() {
  return MAX_UPLOAD_BYTES
}

export function normalizeStringList(list) {
  if (!Array.isArray(list)) return []
  return list.map((s) => String(s || '').trim()).filter(Boolean)
}

export function normalizeCandidateCv(raw = {}) {
  const base = emptyCandidateCv()
  const contact = { ...base.contact, ...(raw.contact || {}) }
  return {
    contact: {
      name: String(contact.name || '').trim(),
      email: String(contact.email || '').trim(),
      phone: String(contact.phone || '').trim(),
      location: String(contact.location || '').trim(),
      linkedin: String(contact.linkedin || '').trim(),
    },
    summary: String(raw.summary || '').trim(),
    skills: normalizeStringList(raw.skills),
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((e) => ({
          title: String(e?.title || '').trim(),
          company: String(e?.company || '').trim(),
          location: String(e?.location || '').trim(),
          start_date: String(e?.start_date || '').trim(),
          end_date: String(e?.end_date || '').trim(),
          bullets: normalizeStringList(e?.bullets),
        }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((e) => ({
          degree: String(e?.degree || '').trim(),
          institution: String(e?.institution || '').trim(),
          start_date: String(e?.start_date || '').trim(),
          end_date: String(e?.end_date || '').trim(),
        }))
      : [],
    certifications: normalizeStringList(raw.certifications),
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((p) => ({
          name: String(p?.name || '').trim(),
          description: String(p?.description || '').trim(),
        }))
      : [],
  }
}

export function normalizeJobProfile(raw = {}) {
  return {
    job_title: String(raw.job_title || '').trim(),
    company: String(raw.company || '').trim(),
    seniority_level: String(raw.seniority_level || '').trim(),
    must_have_requirements: normalizeStringList(raw.must_have_requirements),
    nice_to_have_requirements: normalizeStringList(raw.nice_to_have_requirements),
    key_responsibilities: normalizeStringList(raw.key_responsibilities),
    keywords_for_ats: normalizeStringList(raw.keywords_for_ats),
    tone_signals: String(raw.tone_signals || '').trim(),
  }
}

export function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}
