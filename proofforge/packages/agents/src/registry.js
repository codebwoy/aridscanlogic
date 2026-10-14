import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROMPTS_DIR = join(__dirname, '../prompts')

const findingSchema = z.object({
  category: z.string(),
  subcategory: z.string().optional().default(''),
  severity: z.string(),
  title: z.string(),
  explanation: z.string(),
  original_excerpt: z.string(),
  suggested_correction: z.string().optional().default(''),
  alternatives: z.array(z.string()).optional().default([]),
  reason: z.string().optional().default(''),
  confidence: z.number().optional().default(0.5),
  objective: z.boolean().optional().default(false),
})

const REGISTRY = {
  'proofread.v1': {
    name: 'proofread',
    version: 'v1',
    file: 'proofread.v1.md',
    outputSchema: z.object({
      findings: z.array(findingSchema).default([]),
      coverage_note: z.string().optional().default(''),
    }),
  },
  'overview.v1': {
    name: 'overview',
    version: 'v1',
    file: null,
    inlineSystem: `OverviewAgent: ProWritingAid Manuscript Analysis–style whole-book overview.
Cover five sections: About My Story, Themes & Message, Plot & Structure, Characters, Setting.
For each manuscript_sections.* use level: working_well | minor_concern | concern | major_concern.
Honor author_goals if provided (fine-tune feedback).
Return ONLY JSON:
{"subject_or_story":"...","likely_genre":"...","audience_fit":"...","structure_summary":"...","themes":[],"character_notes":[],"setting_notes":[],"strengths":[],"opportunities":[],"note":"...","manuscript_sections":{"about_story":{"level":"working_well","summary":"...","competitive_landscape":"...","items":[]},"themes":{"level":"working_well","summary":"...","items":[]},"plot":{"level":"working_well","summary":"...","items":[]},"characters":{"level":"working_well","summary":"...","items":[]},"setting":{"level":"working_well","summary":"...","items":[]}}}
Never claim KDP approval or invent facts not supported by the provided summaries.`,
    outputSchema: z.object({
      subject_or_story: z.string(),
      likely_genre: z.string().optional().default(''),
      audience_fit: z.string().optional().default(''),
      structure_summary: z.string().optional().default(''),
      themes: z.array(z.string()).default([]),
      character_notes: z.array(z.string()).default([]),
      setting_notes: z.array(z.string()).default([]),
      strengths: z.array(z.string()).default([]),
      opportunities: z.array(z.string()).default([]),
      note: z.string().optional().default(''),
      manuscript_sections: z
        .object({
          about_story: z
            .object({
              level: z.string().optional().default('working_well'),
              summary: z.string().optional().default(''),
              competitive_landscape: z.string().optional().default(''),
              items: z.array(z.string()).default([]),
            })
            .optional()
            .default({}),
          themes: z
            .object({
              level: z.string().optional().default('working_well'),
              summary: z.string().optional().default(''),
              items: z.array(z.string()).default([]),
            })
            .optional()
            .default({}),
          plot: z
            .object({
              level: z.string().optional().default('working_well'),
              summary: z.string().optional().default(''),
              items: z.array(z.string()).default([]),
            })
            .optional()
            .default({}),
          characters: z
            .object({
              level: z.string().optional().default('working_well'),
              summary: z.string().optional().default(''),
              items: z.array(z.string()).default([]),
            })
            .optional()
            .default({}),
          setting: z
            .object({
              level: z.string().optional().default('working_well'),
              summary: z.string().optional().default(''),
              items: z.array(z.string()).default([]),
            })
            .optional()
            .default({}),
        })
        .optional()
        .default({}),
    }),
  },
  'fiction.v1': {
    name: 'fiction',
    version: 'v1',
    file: null,
    inlineSystem: `FictionAuditAgent: developmental fiction notes (plot holes, character consistency, POV/tense, pacing, dialogue naturalness).
Return ONLY JSON:
{"memory":{"characters":[],"timeline":[],"locations":[],"open_loops":[]},"findings":[{"category":"structure|consistency|style","subcategory":"","severity":"suggestion|moderate|major|needs_verification","title":"...","explanation":"...","original_excerpt":"...","suggested_correction":"","confidence":0.5,"objective":false}]}
original_excerpt MUST be an exact substring of the provided SECTION when citing text. Max 8 findings. Genre profiles are diagnostics, not formulas.`,
    outputSchema: z.object({
      memory: z
        .object({
          characters: z.array(z.string()).default([]),
          timeline: z.array(z.string()).default([]),
          locations: z.array(z.string()).default([]),
          open_loops: z.array(z.string()).default([]),
        })
        .default({}),
      findings: z.array(findingSchema).default([]),
    }),
  },
  'nonfiction.v1': {
    name: 'nonfiction',
    version: 'v1',
    file: null,
    inlineSystem: `NonfictionAuditAgent: clarity of purpose, argument flow, unsupported claims, repeated explanations, audience fit.
Return ONLY JSON:
{"memory":{"main_claims":[],"undefined_terms":[],"open_questions":[]},"findings":[{"category":"structure|consistency|style","subcategory":"","severity":"suggestion|moderate|major|needs_verification","title":"...","explanation":"...","original_excerpt":"...","suggested_correction":"","confidence":0.5,"objective":false}]}
Never mark a claim as factually verified just because it sounds plausible. Flag needs_verification instead. Max 8 findings.`,
    outputSchema: z.object({
      memory: z
        .object({
          main_claims: z.array(z.string()).default([]),
          undefined_terms: z.array(z.string()).default([]),
          open_questions: z.array(z.string()).default([]),
        })
        .default({}),
      findings: z.array(findingSchema).default([]),
    }),
  },
  'verify.v1': {
    name: 'verify',
    version: 'v1',
    file: null,
    inlineSystem: `VerifyAgent: challenge editorial findings. For each finding, check whether original_excerpt exists in SECTION and whether the recommendation is justified.
Return ONLY JSON:
{"verdicts":[{"finding_title":"...","keep":true,"confidence":0.5,"note":"..."}]}
Mark keep=false for hallucinated excerpts or unjustified subjective rewrites presented as errors.`,
    outputSchema: z.object({
      verdicts: z
        .array(
          z.object({
            finding_title: z.string(),
            keep: z.boolean(),
            confidence: z.number().optional().default(0.5),
            note: z.string().optional().default(''),
          })
        )
        .default([]),
    }),
  },
  'chapter_critique.v1': {
    name: 'chapter_critique',
    version: 'v1',
    file: null,
    inlineSystem: `ChapterCritiqueAgent: ProWritingAid-style chapter critique (diagnostic, not a formula).
Return ONLY JSON:
{"chapter_summary":"...","purpose":"...","tension_or_stakes":"...","opening_hook":"...","ending_drive":"...","character_focus":[],"pacing_note":"...","findings":[{"category":"structure|style|consistency","subcategory":"chapter","severity":"suggestion|moderate|major|needs_verification","title":"...","explanation":"...","original_excerpt":"...","suggested_correction":"","confidence":0.5,"objective":false}]}
original_excerpt MUST be an exact substring when citing. Max 6 findings. Never claim KDP approval.`,
    outputSchema: z.object({
      chapter_summary: z.string().optional().default(''),
      purpose: z.string().optional().default(''),
      tension_or_stakes: z.string().optional().default(''),
      opening_hook: z.string().optional().default(''),
      ending_drive: z.string().optional().default(''),
      character_focus: z.array(z.string()).default([]),
      pacing_note: z.string().optional().default(''),
      findings: z.array(findingSchema).default([]),
    }),
  },
  'cross_chapter.v1': {
    name: 'cross_chapter',
    version: 'v1',
    file: null,
    inlineSystem: `CrossChapterAgent: compare chapter summaries for contradictions, terminology drift, unresolved threads, duplicated explanations, chronology issues.
Return ONLY JSON:
{"findings":[{"category":"consistency|structure","subcategory":"cross_chapter","severity":"suggestion|moderate|major|needs_verification","title":"...","explanation":"...","original_excerpt":"...","suggested_correction":"","confidence":0.5,"objective":false}],"continuity_note":"..."}
original_excerpt should cite a short phrase from the provided summaries when possible. Max 10 findings. Never invent plot facts.`,
    outputSchema: z.object({
      findings: z.array(findingSchema).default([]),
      continuity_note: z.string().optional().default(''),
    }),
  },
  'translation.v1': {
    name: 'translation',
    version: 'v1',
    file: null,
    inlineSystem: `TranslationModeAgent: when the manuscript appears bilingual or is being prepared for another market language, flag localization, untranslated fragments, culturally mismatched idioms, and missing translator credit reminders.
Return ONLY JSON:
{"detected_languages":[],"findings":[{"category":"localization|consistency|kdp_policy","subcategory":"translation","severity":"suggestion|moderate|major|needs_verification","title":"...","explanation":"...","original_excerpt":"...","suggested_correction":"","confidence":0.5,"objective":false}],"note":"..."}
Do not invent translations. Max 8 findings. Credit translator per KDP when publishing a translation.`,
    outputSchema: z.object({
      detected_languages: z.array(z.string()).default([]),
      findings: z.array(findingSchema).default([]),
      note: z.string().optional().default(''),
    }),
  },
}

export function listAgents() {
  return Object.entries(REGISTRY).map(([key, a]) => ({
    key,
    name: a.name,
    version: a.version,
  }))
}

export function getAgent(key) {
  return REGISTRY[key] || null
}

export function loadAgentSystem(key) {
  const agent = getAgent(key)
  if (!agent) throw new Error(`Unknown agent: ${key}`)
  if (agent.inlineSystem) return agent.inlineSystem
  if (agent.file) {
    return readFileSync(join(PROMPTS_DIR, agent.file), 'utf8')
  }
  throw new Error(`Agent ${key} has no system prompt`)
}

export function parseAgentJson(text, key) {
  const agent = getAgent(key)
  if (!agent) throw new Error(`Unknown agent: ${key}`)
  let raw = String(text || '').trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) raw = fence[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start >= 0 && end > start) raw = raw.slice(start, end + 1)
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    const err = new Error('Invalid agent JSON')
    err.code = 'invalid_agent_json'
    throw err
  }
  const result = agent.outputSchema.safeParse(parsed)
  if (!result.success) {
    const err = new Error('Agent JSON failed schema validation')
    err.code = 'invalid_agent_schema'
    err.details = result.error.flatten()
    throw err
  }
  return result.data
}
