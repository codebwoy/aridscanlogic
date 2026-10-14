import { LLMProvider, estimateCostUsd } from './provider.js'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Optional OpenAI provider for dual-model verification.
 * Never call from the browser — API only.
 */
export class OpenAILLMProvider extends LLMProvider {
  constructor(opts = {}) {
    super()
    this.apiKey = (opts.apiKey || '').trim()
    this.models = {
      draft: opts.models?.draft || process.env.PROOFFORGE_OPENAI_MODEL || 'gpt-4.1-mini',
      cheap: opts.models?.cheap || process.env.PROOFFORGE_OPENAI_MODEL_CHEAP || 'gpt-4.1-mini',
      polish: opts.models?.polish || process.env.PROOFFORGE_OPENAI_MODEL || 'gpt-4.1',
    }
    this.fetchImpl = opts.fetchImpl || globalThis.fetch
  }

  get id() {
    return 'openai'
  }

  get ready() {
    return this.apiKey.length > 10
  }

  resolveModel(modelClass) {
    return this.models[modelClass] || this.models.draft
  }

  async complete(req) {
    if (!this.ready) {
      const err = new Error('OPENAI_API_KEY not configured on ProofForge API')
      err.code = 'llm_not_configured'
      throw err
    }
    const model = this.resolveModel(req.modelClass || 'cheap')
    const messages = []
    if (req.system) messages.push({ role: 'system', content: req.system })
    for (const m of req.messages || []) {
      messages.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })
    }
    const res = await this.fetchImpl(OPENAI_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: req.temperature ?? 0.3,
        max_tokens: Math.min(Number(req.maxTokens) || 4096, 8192),
        messages,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data?.error?.message || `OpenAI HTTP ${res.status}`)
      err.code = 'llm_upstream'
      err.status = res.status
      throw err
    }
    const text = data.choices?.[0]?.message?.content || ''
    const tokensIn = data.usage?.prompt_tokens || 0
    const tokensOut = data.usage?.completion_tokens || 0
    return {
      text,
      model,
      tokensIn,
      tokensOut,
      costUsd: estimateCostUsd(model, tokensIn, tokensOut, {
        'gpt-4.1-mini': { in: 0.4 / 1e6, out: 1.6 / 1e6 },
        'gpt-4.1': { in: 2 / 1e6, out: 8 / 1e6 },
      }),
      raw: { id: data.id, usage: data.usage },
    }
  }
}
