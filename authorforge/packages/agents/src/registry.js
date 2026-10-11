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
    inlineSystem: `PositioningAgent: differentiated angles from public metadata only.
Return ONLY JSON shaped exactly as:
{"angles":[{"name":"...","rationale":"...","confidence":"low|medium|high"}],"disclaimer":"..."}
Never invent sales ranks, review counts, or Amazon scrape claims. Use estimates/fixtures only.`,
    outputSchema: z.object({
      angles: z.array(
        z.object({
          name: z.string(),
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
    next.angles = next.angles.map((a) => {
      if (!a || typeof a !== 'object') return a
      return {
        name: a.name || a.title || a.angle || 'Angle',
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
