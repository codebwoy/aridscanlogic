/**
 * Model-agnostic LLM interface.
 * All LLM calls in AuthorForge go through createLlmProvider() — never call SDKs from UI.
 */

/**
 * @typedef {'draft' | 'cheap' | 'polish'} ModelClass
 * @typedef {{
 *   modelClass: ModelClass,
 *   system: string,
 *   messages: { role: 'user' | 'assistant', content: string }[],
 *   cacheableSystemPrefix?: string,
 *   maxTokens?: number,
 *   temperature?: number,
 *   metadata?: Record<string, unknown>
 * }} LLMRequest
 * @typedef {{
 *   text: string,
 *   model: string,
 *   tokensIn: number,
 *   tokensOut: number,
 *   costUsd: number,
 *   raw?: unknown
 * }} LLMCompletion
 */

export class LLMProvider {
  /** @returns {string} */
  get id() {
    return 'base'
  }

  /** @param {LLMRequest} _req @returns {Promise<LLMCompletion>} */
  async complete(_req) {
    throw new Error('LLMProvider.complete not implemented')
  }
}

/** Rough USD cost estimate (configurable rates). */
export function estimateCostUsd(model, tokensIn, tokensOut, rates = {}) {
  const table = {
    'claude-sonnet-4-6': { in: 3 / 1e6, out: 15 / 1e6 },
    'claude-haiku-4-5-20251001': { in: 0.8 / 1e6, out: 4 / 1e6 },
    'claude-opus-4-6': { in: 15 / 1e6, out: 75 / 1e6 },
    'fake-draft': { in: 0, out: 0 },
    ...rates,
  }
  const r = table[model] || table['claude-sonnet-4-6']
  return Number(((tokensIn || 0) * r.in + (tokensOut || 0) * r.out).toFixed(6))
}
