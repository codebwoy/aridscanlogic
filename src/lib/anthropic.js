/**
 * Anthropic Claude — requests go through /api/llm (server proxy).
 * ANTHROPIC_API_KEY must stay in .env on the server only, never in the client bundle.
 */

import { apiFetch } from './apiFetch'
import { isSafeFetchUrl } from './security/safeUrl'

const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const LLM_ENDPOINT = '/api/llm'
const STATUS_ENDPOINT = '/api/llm/status'

let llmConfigured = false
let llmModel = DEFAULT_MODEL
let statusPromise = null
let statusCheckedAt = 0
const STATUS_TTL_MS = 30_000

export async function refreshLlmStatus() {
  try {
    const res = await apiFetch(STATUS_ENDPOINT, { cache: 'no-store' })
    if (!res.ok) throw new Error('status failed')
    const data = await res.json()
    llmConfigured = !!data.configured
    llmModel = data.model || DEFAULT_MODEL
  } catch {
    llmConfigured = false
    llmModel = DEFAULT_MODEL
  }
  statusCheckedAt = Date.now()
  return llmConfigured
}

export function ensureLlmStatus() {
  const stale = Date.now() - statusCheckedAt > STATUS_TTL_MS
  if (!statusPromise || stale) {
    statusPromise = refreshLlmStatus()
  }
  return statusPromise
}

export function isAnthropicConfigured() {
  return llmConfigured
}

export function getAnthropicModel() {
  return llmModel
}

function parseJsonFromText(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1].trim() : text.trim()
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1))
      } catch {
        return null
      }
    }
  }
  return null
}

async function urlToImageBlock(url) {
  if (!url) return null
  if (url.startsWith('data:')) {
    const match = url.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) return null
    return {
      type: 'image',
      source: { type: 'base64', media_type: match[1], data: match[2] },
    }
  }
  if (!isSafeFetchUrl(url)) {
    return { type: 'text', text: '[Image URL blocked for security]' }
  }
  try {
    const res = await apiFetch(url)
    const blob = await res.blob()
    const mediaType = blob.type || 'image/jpeg'
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return {
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data },
    }
  } catch {
    return { type: 'text', text: '[Image unavailable]' }
  }
}

async function buildUserContent(prompt, file_urls = []) {
  const blocks = []
  for (const url of file_urls) {
    const img = await urlToImageBlock(url)
    if (img) blocks.push(img)
  }
  blocks.push({ type: 'text', text: prompt })
  return blocks.length === 1 && blocks[0].type === 'text' ? prompt : blocks
}

async function postToLlmProxy(payload) {
  await ensureLlmStatus()
  if (!llmConfigured) throw new Error('ANTHROPIC_API_KEY is not configured on the server')

  const res = await apiFetch(LLM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `LLM proxy error ${res.status}`)
  }

  return res.json()
}

export async function anthropicChat({
  system,
  messages,
  maxTokens = 8192,
  model = getAnthropicModel(),
}) {
  const apiMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content,
    }))

  const data = await postToLlmProxy({
    model,
    max_tokens: maxTokens,
    system: system || undefined,
    messages: apiMessages,
  })

  const block = data.content?.find((b) => b.type === 'text')
  return block?.text || ''
}

export async function invokeLLMViaAnthropic({ prompt, file_urls, response_json_schema }) {
  let system = 'You are a helpful assistant for ScanLogic AI & Business Suite.'
  if (response_json_schema) {
    system += `\n\nRespond with ONLY valid JSON (no markdown fences) matching this schema:\n${JSON.stringify(response_json_schema, null, 2)}`
  }

  const userContent = await buildUserContent(prompt, file_urls || [])

  const data = await postToLlmProxy({
    model: getAnthropicModel(),
    max_tokens: response_json_schema ? 4096 : 8192,
    system,
    messages: [{ role: 'user', content: userContent }],
  })

  const text = data.content?.find((b) => b.type === 'text')?.text || ''

  if (response_json_schema) {
    const parsed = parseJsonFromText(text)
    return { text, parsed: parsed || {} }
  }
  return { text, content: text }
}
