import { FakeLLMProvider } from './fakeProvider.js'
import { AnthropicLLMProvider } from './anthropicProvider.js'
import { OpenAILLMProvider } from './openaiProvider.js'

/**
 * @param {{
 *   provider?: string,
 *   anthropicApiKey?: string,
 *   openaiApiKey?: string,
 *   models?: { draft?: string, cheap?: string, polish?: string }
 * }} [cfg]
 */
export function createLlmProvider(cfg = {}) {
  const name = String(cfg.provider || process.env.PROOFFORGE_LLM_PROVIDER || 'fake')
    .toLowerCase()
    .trim()
  if (name === 'anthropic') {
    return new AnthropicLLMProvider({
      apiKey: cfg.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '',
      models: {
        draft: cfg.models?.draft || process.env.PROOFFORGE_MODEL_DRAFT || process.env.ANTHROPIC_MODEL,
        cheap: cfg.models?.cheap || process.env.PROOFFORGE_MODEL_CHEAP,
        polish: cfg.models?.polish || process.env.PROOFFORGE_MODEL_POLISH,
      },
    })
  }
  if (name === 'openai') {
    return new OpenAILLMProvider({
      apiKey: cfg.openaiApiKey || process.env.OPENAI_API_KEY || '',
      models: cfg.models,
    })
  }
  return new FakeLLMProvider()
}

/** Secondary verifier provider (optional dual-model disagreement). */
export function createVerifyProvider(cfg = {}) {
  const name = String(
    cfg.verifyProvider || process.env.PROOFFORGE_VERIFY_PROVIDER || ''
  )
    .toLowerCase()
    .trim()
  if (!name || name === 'none' || name === 'off') return null
  if (name === 'same') return createLlmProvider(cfg)
  if (name === 'fake') return new FakeLLMProvider()
  if (name === 'openai') {
    return new OpenAILLMProvider({
      apiKey: cfg.openaiApiKey || process.env.OPENAI_API_KEY || '',
    })
  }
  if (name === 'anthropic') {
    return new AnthropicLLMProvider({
      apiKey: cfg.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '',
    })
  }
  return null
}

export function llmProviderStatus(provider) {
  if (!provider) return { id: 'none', ready: false }
  if (provider.id === 'fake') return { id: 'fake', ready: true, mode: 'fixtures' }
  return { id: provider.id, ready: !!provider.ready, mode: 'live' }
}
