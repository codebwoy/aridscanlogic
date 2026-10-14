import { bookLanguageAgentInstruction } from '@proofforge/shared'
import { loadAgentSystem, parseAgentJson } from './registry.js'

/**
 * @param {import('@proofforge/llm').LLMProvider} llm
 * @param {string} agentKey
 * @param {{
 *   userContent: string,
 *   language?: string,
 *   languageVariety?: string,
 *   modelClass?: string,
 *   temperature?: number,
 *   maxTokens?: number,
 * }} opts
 */
export async function runAgent(llm, agentKey, opts = {}) {
  const langBlock = bookLanguageAgentInstruction(opts.language || 'en', opts.languageVariety)
  const system = `${loadAgentSystem(agentKey)}\n\n## Language profile\n${langBlock}`
  const completion = await llm.complete({
    modelClass: opts.modelClass || 'cheap',
    system,
    messages: [{ role: 'user', content: opts.userContent }],
    temperature: opts.temperature ?? 0.3,
    maxTokens: opts.maxTokens || 4096,
    metadata: { promptName: agentKey, promptKey: agentKey },
  })
  const data = parseAgentJson(completion.text, agentKey)
  return {
    data,
    usage: {
      model: completion.model,
      tokensIn: completion.tokensIn,
      tokensOut: completion.tokensOut,
      costUsd: completion.costUsd,
    },
    prompt: { name: agentKey.split('.')[0], version: agentKey.split('.')[1] || 'v1' },
  }
}
