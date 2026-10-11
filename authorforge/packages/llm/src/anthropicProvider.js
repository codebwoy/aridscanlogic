import { LLMProvider, estimateCostUsd } from './provider.js'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

/**
 * Direct Anthropic call from AuthorForge API (Recommendation C).
 * Does NOT use ScanLogic /api/llm — book jobs need longer timeouts & cost tracking.
 */
export class AnthropicLLMProvider extends LLMProvider {
  /**
   * @param {{
   *   apiKey: string,
   *   models?: { draft?: string, cheap?: string, polish?: string },
   *   fetchImpl?: typeof fetch
   * }} opts
   */
  constructor(opts) {
    super()
    this.apiKey = (opts.apiKey || '').trim()
    this.models = {
      draft: opts.models?.draft || 'claude-sonnet-4-6',
      cheap: opts.models?.cheap || 'claude-haiku-4-5-20251001',
      polish: opts.models?.polish || 'claude-opus-4-6',
    }
    this.fetchImpl = opts.fetchImpl || globalThis.fetch
  }

  get id() {
    return 'anthropic'
  }

  get ready() {
    return this.apiKey.length > 10
  }

  resolveModel(modelClass) {
    return this.models[modelClass] || this.models.draft
  }

  async complete(req) {
    if (!this.ready) {
      const err = new Error('ANTHROPIC_API_KEY not configured on AuthorForge API')
      err.code = 'llm_not_configured'
      throw err
    }
    const model = this.resolveModel(req.modelClass || 'draft')
    const systemParts = []
    if (req.cacheableSystemPrefix) {
      systemParts.push({
        type: 'text',
        text: req.cacheableSystemPrefix,
        cache_control: { type: 'ephemeral' },
      })
    }
    if (req.system) {
      systemParts.push({ type: 'text', text: req.system })
    }

    const body = {
      model,
      max_tokens: Math.min(Number(req.maxTokens) || 4096, 8192),
      temperature: req.temperature ?? 0.7,
      system: systemParts.length === 1 && !req.cacheableSystemPrefix ? req.system : systemParts,
      messages: (req.messages || []).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    }

    const res = await this.fetchImpl(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data?.error?.message || `Anthropic HTTP ${res.status}`)
      err.code = 'llm_upstream'
      err.status = res.status
      throw err
    }

    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    const tokensIn = data.usage?.input_tokens || 0
    const tokensOut = data.usage?.output_tokens || 0
    return {
      text,
      model,
      tokensIn,
      tokensOut,
      costUsd: estimateCostUsd(model, tokensIn, tokensOut),
      raw: { id: data.id, usage: data.usage },
    }
  }
}
