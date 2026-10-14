import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROMPTS_DIR = join(__dirname, '../prompts')

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
    outputSchema: z.object({
      content_md: z.string(),
      scene_goal: z.string().optional().default(''),
      characters_on_page: z.array(z.string()).default([]),
      open_loops: z.array(z.string()).default([]),
      continuity_notes: z.array(z.string()).default([]),
    }),
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
  'premise.v1': {
    name: 'premise',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `PremiseAgent: invent a compelling adult fiction premise.
Return ONLY JSON:
{"premise":"...","promise_to_reader":"...","stakes":"...","unique_hook":"...","warnings":[]}
Never claim the story is a true story about living people.`,
    outputSchema: z.object({
      premise: z.string(),
      promise_to_reader: z.string(),
      stakes: z.string(),
      unique_hook: z.string().optional().default(''),
      warnings: z.array(z.string()).optional(),
    }),
  },
  'cast.v1': {
    name: 'cast',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `CastAgent: invent adult fictional characters (18+).
Return ONLY JSON:
{"cast":[{"name":"...","role":"protagonist|antagonist|ally|love_interest|other","age":30,"want":"...","need":"...","wound":"...","voice_notes":"..."}],"relationships":["..."]}
All characters must be adults. No minors in romantic/sexual roles.`,
    outputSchema: z.object({
      cast: z.array(
        z.object({
          name: z.string(),
          role: z.string(),
          age: z.number().optional(),
          want: z.string().optional().default(''),
          need: z.string().optional().default(''),
          wound: z.string().optional().default(''),
          voice_notes: z.string().optional().default(''),
        })
      ),
      relationships: z.array(z.string()).default([]),
    }),
  },
  'plot.v1': {
    name: 'plot',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `PlotAgent: three-act beat sheet for adult fiction.
Return ONLY JSON:
{"beats":[{"act":1,"name":"...","summary":"..."}],"theme":"...","ending_type":"HEA|HFN|bittersweet|open"}`,
    outputSchema: z.object({
      beats: z.array(
        z.object({
          act: z.number().optional(),
          name: z.string(),
          summary: z.string(),
        })
      ),
      theme: z.string().optional().default(''),
      ending_type: z.string().optional().default(''),
    }),
  },
  'title.v1': {
    name: 'title',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `TitleAgent: propose adult fiction title options.
Never invent bestseller claims or trademarked franchise names.
Return ONLY JSON:
{"options":[{"title":"...","subtitle":"","risk":"low|medium|high"}],"warnings":["..."]}`,
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
  'continuity.v1': {
    name: 'continuity',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `ContinuityAgent: summarize the scene and flag continuity risks.
Return ONLY JSON:
{"summary":"...","characters_on_page":[],"timeline_notes":[],"open_loops":[],"issues":[{"severity":"low|medium|high","note":"..."}]}`,
    outputSchema: z.object({
      summary: z.string(),
      characters_on_page: z.array(z.string()).default([]),
      timeline_notes: z.array(z.string()).default([]),
      open_loops: z.array(z.string()).default([]),
      issues: z
        .array(z.object({ severity: z.string(), note: z.string() }))
        .default([]),
    }),
  },
  'description.v1': {
    name: 'description',
    version: 'v1',
    file: null,
    coauthorRules: false,
    inlineSystem: `DescriptionAgent: draft KDP product metadata for adult fiction from book fields only.
Return JSON with description_html, keywords (7), categories (3), back_cover_copy.
Never invent reviews, awards, or #1 claims.`,
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

function normalizeAgentPayload(data, schema) {
  if (data == null) return data
  const shape = schema?.shape || null
  const wantsOptions = !!(shape && 'options' in shape)
  const preferredArrayKey = wantsOptions ? 'options' : 'items'

  if (Array.isArray(data)) {
    return { [preferredArrayKey]: data }
  }
  if (typeof data !== 'object') return data

  let next = { ...data }

  if (wantsOptions && next.options == null) {
    const alt = next.titles || next.variations || next.suggestions || next.items || next.results
    if (Array.isArray(alt)) next.options = alt
  }
  if (Array.isArray(next.options)) {
    next.options = next.options
      .map((o) => {
        if (typeof o === 'string') return { title: o.trim(), subtitle: '', risk: undefined }
        if (!o || typeof o !== 'object') return null
        const title = String(o.title || o.name || '').trim()
        if (!title) return null
        return {
          title,
          subtitle: String(o.subtitle || o.tagline || '').trim(),
          risk: o.risk != null ? String(o.risk) : undefined,
        }
      })
      .filter(Boolean)
  }
  return next
}

export function parseAgentJson(text, schema) {
  let raw = String(text || '').trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) raw = fence[1].trim()
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
  throw new Error(`Agent JSON failed validation: ${result.error.message}`)
}

export function promptFilesOnDisk() {
  return ['outline.v1.md', 'writer.v1.md']
}
