/**
 * Writer replies often break strict JSON because dialogue uses raw " quotes.
 * Prefer delimited prose; fall back to repaired JSON extraction.
 */

export const NF_META = '<<<NF_META>>>'
export const NF_PROSE = '<<<NF_PROSE>>>'
export const NF_END = '<<<NF_END>>>'

const META_KEYS = ['scene_goal', 'characters_on_page', 'open_loops', 'continuity_notes']

function stripFences(text) {
  let raw = String(text || '').trim()
  if (raw.startsWith('```')) {
    const nl = raw.indexOf('\n')
    raw = (nl >= 0 ? raw.slice(nl + 1) : raw.replace(/^```(?:json)?\s*/i, '')).trim()
  }
  if (raw.endsWith('```')) raw = raw.slice(0, -3).trim()
  return raw
}

function lightUnescape(s) {
  return String(s || '')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

/**
 * Delimited writer format (preferred):
 * <<<NF_META>>>
 * { "scene_goal": "...", ... }
 * <<<NF_PROSE>>>
 * markdown with "quotes" ok
 * <<<NF_END>>>
 */
export function parseDelimitedWriter(text) {
  const raw = stripFences(text)
  const iMeta = raw.indexOf(NF_META)
  const iProse = raw.indexOf(NF_PROSE)
  if (iMeta < 0 || iProse < 0 || iProse < iMeta) return null
  const iEnd = raw.indexOf(NF_END, iProse + NF_PROSE.length)
  const metaRaw = raw.slice(iMeta + NF_META.length, iProse).trim()
  const prose = raw
    .slice(iProse + NF_PROSE.length, iEnd >= 0 ? iEnd : undefined)
    .trim()
  if (prose.length < 40) return null
  let meta = {}
  try {
    const start = metaRaw.indexOf('{')
    const end = metaRaw.lastIndexOf('}')
    if (start >= 0 && end > start) meta = JSON.parse(metaRaw.slice(start, end + 1))
  } catch {
    meta = {}
  }
  return {
    content_md: prose,
    scene_goal: String(meta.scene_goal || ''),
    characters_on_page: Array.isArray(meta.characters_on_page) ? meta.characters_on_page : [],
    open_loops: Array.isArray(meta.open_loops) ? meta.open_loops : [],
    continuity_notes: Array.isArray(meta.continuity_notes) ? meta.continuity_notes : [],
  }
}

/**
 * Pull a JSON string field even when the model left raw " inside the value.
 * Ends at: `" , "nextKnownKey" :`
 */
export function extractMessyJsonStringField(raw, field, nextKeys = META_KEYS) {
  const keyRe = new RegExp(`"${field}"\\s*:\\s*"`)
  const m = keyRe.exec(raw)
  if (!m) return null
  const start = m.index + m[0].length
  const nextAlt = nextKeys.filter((k) => k !== field).join('|')
  const termRe = nextAlt ? new RegExp(`^"\\s*,\\s*"(?:${nextAlt})"\\s*:`) : null

  const slice = raw.slice(start)
  for (let i = 0; i < slice.length; i++) {
    if (slice[i] !== '"') continue
    if (termRe && termRe.test(slice.slice(i))) {
      return lightUnescape(slice.slice(0, i))
    }
  }

  // Truncated / last field: take until final object close
  let end = slice.length
  const brace = slice.lastIndexOf('}')
  if (brace > 0) end = brace
  let content = slice.slice(0, end).replace(/"\s*[}\s]*$/s, '').trim()
  if (!content) return null
  const note =
    content.length >= 80
      ? '\n\n*[Draft cut off mid-generation — regenerate or Draft scene to continue.]*'
      : ''
  return lightUnescape(content) + note
}

function extractMessyJsonArrayField(raw, field) {
  const keyRe = new RegExp(`"${field}"\\s*:\\s*\\[`)
  const m = keyRe.exec(raw)
  if (!m) return []
  const start = m.index + m[0].length - 1
  let depth = 0
  let inString = false
  let escape = false
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i]
    if (inString) {
      if (escape) escape = false
      else if (ch === '\\') escape = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        try {
          const arr = JSON.parse(raw.slice(start, i + 1))
          return Array.isArray(arr) ? arr.map(String) : []
        } catch {
          return []
        }
      }
    }
  }
  return []
}

/**
 * Repair writer JSON when dialogue quotes break JSON.parse.
 */
export function repairWriterJson(text) {
  const raw = stripFences(text)
  if (!/"content_md"\s*:/.test(raw)) return null

  const content = extractMessyJsonStringField(raw, 'content_md', [
    'content_md',
    ...META_KEYS,
  ])
  if (!content || content.replace(/\*\[Draft cut off[^\]]*\]\*/g, '').trim().length < 40) {
    return null
  }

  const scene_goal = extractMessyJsonStringField(raw, 'scene_goal', META_KEYS) || ''
  return {
    content_md: content,
    scene_goal: scene_goal.replace(/\n\n\*\[Draft cut off[^\]]*\]\*/g, '').trim(),
    characters_on_page: extractMessyJsonArrayField(raw, 'characters_on_page'),
    open_loops: extractMessyJsonArrayField(raw, 'open_loops'),
    continuity_notes: extractMessyJsonArrayField(raw, 'continuity_notes'),
  }
}

/** Full writer parse: delimited → JSON → repaired JSON. */
export function parseWriterPayload(text) {
  const delimited = parseDelimitedWriter(text)
  if (delimited) return delimited
  const repaired = repairWriterJson(text)
  if (repaired) return repaired
  return null
}
