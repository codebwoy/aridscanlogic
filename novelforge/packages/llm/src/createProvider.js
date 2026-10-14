import { FakeLLMProvider } from './fakeProvider.js'
import { AnthropicLLMProvider } from './anthropicProvider.js'

/**
 * @param {{
 *   provider?: string,
 *   anthropicApiKey?: string,
 *   models?: { draft?: string, cheap?: string, polish?: string }
 * }} [cfg]
 */
export function createLlmProvider(cfg = {}) {
  const name = (cfg.provider || process.env.NOVELFORGE_LLM_PROVIDER || 'fake').toLowerCase()
  if (name === 'anthropic') {
    return new AnthropicLLMProvider({
      apiKey: cfg.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '',
      models: {
        draft: cfg.models?.draft || process.env.NOVELFORGE_MODEL_DRAFT || process.env.ANTHROPIC_MODEL,
        cheap: cfg.models?.cheap || process.env.NOVELFORGE_MODEL_CHEAP,
        polish: cfg.models?.polish || process.env.NOVELFORGE_MODEL_POLISH,
      },
    })
  }
  return new FakeLLMProvider()
}

export function llmProviderStatus(provider) {
  if (!provider) return { id: 'none', ready: false }
  if (provider.id === 'fake') return { id: 'fake', ready: true, mode: 'fixtures' }
  return { id: provider.id, ready: !!provider.ready, mode: 'live' }
}
