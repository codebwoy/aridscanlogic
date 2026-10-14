import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROMPTS_DIR = join(__dirname, '../prompts')

const writerOutput = z.object({
  content_md: z.string(),
  story_slots: z.array(z.object({ prompt_to_user: z.string() })).default([]),
  claims_needed: z.array(z.object({ text: z.string() })).default([]),
  terms_introduced: z.array(z.string()).default([]),
  open_loops: z.array(z.string()).default([]),
})

const outlineNode = z.lazy(() =>
  z.object({
    level: z.enum(['chapter', 'section', 'subsection']).optional(),
    title: z.string(),
    writing_direction: z.string(),
    target_words: z.number().int().positive(),
    focus_tags: z.array(z.string()).default([]),
    children: z.array(outlineNode).default([]),
  })
)

const REGISTRY = {
  'writer.v1': {
    name: 'writer',
    version: 'v1',
    file: 'writer.v1.md',
    coauthorRules: true,
    outputSchema: writerOutput,
  },
  'outline.v1': {
    name: 'outline',
    version: 'v1',
    file: 'outline.v1.md',
    coauthorRules: true,
    outputSchema: z.object({
      chapters: z.array(outlineNode),
      note: z.string().optional(),
    }),
  },
  'title.v1': {
    name: 'title',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `TitleAgent: propose non-fiction title + subtitle variations.
Never invent bestseller claims, ranks, or trademarked brand names.
Return ONLY JSON shaped exactly as:
{"options":[{"title":"...","subtitle":"...","risk":"low|medium|high"}],"warnings":["..."]}
Provide 4-6 options. subtitle may be an empty string.`,
    outputSchema: z.object({
      options: z.array(
        z.object({
          title: z.string().min(1),
          subtitle: z.string().default(''),
          risk: z.string().optional(),
        })
      ),
      warnings: z.array(z.string()).optional(),
    }),
  },
  'positioning.v1': {
    name: 'positioning',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `PositioningAgent: produce 3–5 DISTINCT competitive-advantage angles from public/mock metadata only.
Each angle must differ in audience, promise, or approach — not superficial rewrites.
Prefer culturally specific, niched-down non-fiction (African-heritage / bilingual / Germany-based) when the product lane fits.
Return ONLY JSON:
{"angles":[{
  "strategy_kind":"more_value|niche_end_goal|simpler_faster",
  "strategy_label":"MORE VALUE|NICHE END GOAL|SIMPLER / FASTER",
  "name":"short label",
  "proposed_title":"optional title idea",
  "proposed_subtitle":"optional",
  "target_audience":"who",
  "reader_problem":"pain",
  "unique_value":"promise",
  "differentiation":"why it stands apart",
  "evidence":["metadata-backed note only"],
  "risks":["honest weakness"],
  "must_contain":["what the finished book must deliver"],
  "toc_direction":"outline direction in one sentence",
  "rationale":"summary",
  "confidence":"low|medium|high"
}],"disclaimer":"..."}
Never invent sales ranks, review counts, royalties, or Amazon scrape claims. Label estimates clearly.`,
    outputSchema: z.object({
      angles: z.array(
        z.object({
          strategy_kind: z.string().optional(),
          strategy_label: z.string().optional(),
          name: z.string(),
          proposed_title: z.string().optional().default(''),
          proposed_subtitle: z.string().optional().default(''),
          target_audience: z.string().optional().default(''),
          reader_problem: z.string().optional().default(''),
          unique_value: z.string().optional().default(''),
          differentiation: z.string().optional().default(''),
          evidence: z.array(z.string()).optional().default([]),
          risks: z.array(z.string()).optional().default([]),
          must_contain: z.array(z.string()).optional().default([]),
          toc_direction: z.string().optional().default(''),
          rationale: z.string(),
          confidence: z.string().optional(),
        })
      ),
      disclaimer: z.string().optional(),
    }),
  },
  'persona.v1': {
    name: 'persona',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: 'PersonaAgent: voice descriptor from samples; honest bio only from user facts.',
    outputSchema: z.object({
      voice_descriptor: z.record(z.any()),
      style_guide: z.string(),
      bio_draft: z.string(),
    }),
  },
  'continuity.v1': {
    name: 'continuity',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `ContinuityAgent: summarize the section in 40-80 words.
Return ONLY JSON:
{"summary":"...","key_claims":[],"terms_introduced":[],"examples_used":[],"open_loops":[]}
Do not invent credentials or statistics.`,
    outputSchema: z.object({
      summary: z.string(),
      key_claims: z.array(z.any()).default([]),
      terms_introduced: z.array(z.string()).default([]),
      examples_used: z.array(z.string()).default([]),
      open_loops: z.array(z.string()).default([]),
    }),
  },
  'description.v1': {
    name: 'description',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `DescriptionAgent: draft Amazon KDP product metadata from the provided book fields only.
Return JSON with:
- description_html: short HTML (<p>, <b>, <br> only) matching THIS book's title/topic/USP/audience — not a generic template
- keywords: exactly 7 short keyword phrases derived from the book (no trademarked brands, no invented stats)
- categories: exactly 3 browse-style category labels that fit the book
Never invent credentials, reviews, #1 claims, or sales figures. Mark anything uncertain as editable draft.`,
    outputSchema: z.object({
      description_html: z.string(),
      keywords: z.array(z.string()),
      categories: z.array(z.string()),
      back_cover_copy: z.string().optional(),
    }),
  },
}

export function listPrompts() {
  return Object.keys(REGISTRY)
}

export function getPromptEntry(key) {
  const entry = REGISTRY[key]
  if (!entry) throw new Error(`Unknown prompt: ${key}`)
  let template = entry.inlineSystem || ''
  if (entry.file) {
    template = readFileSync(join(PROMPTS_DIR, entry.file), 'utf8')
  }
  return { ...entry, template, key }
}

export function renderPrompt(template, vars = {}) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] != null ? String(vars[k]) : ''
  )
}

/** Coerce common LLM shapes into the registered Zod schema before parse. */
function normalizeAgentPayload(data, schema) {
  if (data == null) return data
  const shape = schema?.shape || null
  const wantsOptions = !!(shape && 'options' in shape)
  const wantsAngles = !!(shape && 'angles' in shape)
  const preferredArrayKey = wantsOptions ? 'options' : wantsAngles ? 'angles' : 'items'

  // Root array → wrap
  if (Array.isArray(data)) {
    return { [preferredArrayKey]: data }
  }
  if (typeof data !== 'object') return data

  let next = { ...data }

  // TitleAgent aliases: titles / variations / suggestions → options
  if (wantsOptions && next.options == null) {
    const alt =
      next.titles || next.variations || next.suggestions || next.title_options || next.items || next.results
    if (Array.isArray(alt)) next.options = alt
  }
  if (Array.isArray(next.options)) {
    next.options = next.options
      .map((o) => {
        if (typeof o === 'string') return { title: o.trim(), subtitle: '', risk: undefined }
        if (!o || typeof o !== 'object') return null
        const title = String(o.title || o.name || o.working_title || '').trim()
        if (!title) return null
        return {
          title,
          subtitle: String(o.subtitle || o.tagline || o.sub_title || '').trim(),
          risk: o.risk != null ? String(o.risk) : undefined,
        }
      })
      .filter(Boolean)
  }

  // Positioning aliases — do not steal `options` when the schema is title-shaped
  if (wantsAngles && next.angles == null) {
    const alt =
      next.positioning ||
      next.competitive_angles ||
      next.differentiators ||
      next.items ||
      (!wantsOptions ? next.options : null)
    if (Array.isArray(alt)) next.angles = alt
  }
  if (Array.isArray(next.angles)) {
    next.angles = next.angles.map((a, i) => {
      if (!a || typeof a !== 'object') return a
      const evidence = Array.isArray(a.evidence)
        ? a.evidence.map(String)
        : Array.isArray(a.evidence_points)
          ? a.evidence_points.map(String)
          : []
      const risks = Array.isArray(a.risks)
        ? a.risks.map(String)
        : Array.isArray(a.weaknesses)
          ? a.weaknesses.map(String)
          : []
      const must = Array.isArray(a.must_contain)
        ? a.must_contain.map(String)
        : Array.isArray(a.must_deliver)
          ? a.must_deliver.map(String)
          : []
      return {
        strategy_kind: a.strategy_kind || a.kind || undefined,
        strategy_label: a.strategy_label || undefined,
        name: a.name || a.title || a.angle || `Angle ${i + 1}`,
        proposed_title: String(a.proposed_title || a.title_option || '').trim(),
        proposed_subtitle: String(a.proposed_subtitle || a.subtitle || '').trim(),
        target_audience: String(a.target_audience || a.audience || a.ideal_reader || '').trim(),
        reader_problem: String(a.reader_problem || a.problem || '').trim(),
        unique_value: String(a.unique_value || a.uvp || a.usp || '').trim(),
        differentiation: String(
          a.differentiation || a.why_different || a.stand_apart || a.rationale || a.reason || ''
        ).trim(),
        evidence,
        risks,
        must_contain: must,
        toc_direction: String(a.toc_direction || a.outline_direction || a.toc || '').trim(),
        rationale: a.rationale || a.reason || a.description || a.summary || '',
        confidence: a.confidence,
      }
    })
  }
  return next
}

export function parseAgentJson(text, schema) {
  let raw = String(text || '').trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) raw = fence[1].trim()
  // Prefer object; fall back to array JSON
  const objStart = raw.indexOf('{')
  const objEnd = raw.lastIndexOf('}')
  const arrStart = raw.indexOf('[')
  const arrEnd = raw.lastIndexOf(']')
  if (objStart >= 0 && objEnd > objStart && (arrStart < 0 || objStart <= arrStart)) {
    raw = raw.slice(objStart, objEnd + 1)
  } else if (arrStart >= 0 && arrEnd > arrStart) {
    raw = raw.slice(arrStart, arrEnd + 1)
  }
  let data = JSON.parse(raw)
  data = normalizeAgentPayload(data, schema)
  const result = schema.safeParse(data)
  if (result.success) return result.data
  const issue = result.error.issues?.[0]
  const hint = issue ? `${issue.path.join('.') || 'root'}: ${issue.message}` : 'invalid JSON shape'
  throw new Error(`Agent output failed validation (${hint}). Try again.`)
}

export function promptFilesOnDisk() {
  try {
    return readdirSync(PROMPTS_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
}
