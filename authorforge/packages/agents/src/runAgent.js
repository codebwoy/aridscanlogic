import { createHash } from 'node:crypto'
import { UNIVERSAL_COAUTHOR_RULES } from '@authorforge/shared'
import { getPromptEntry, parseAgentJson, renderPrompt } from './registry.js'

/**
 * Run a registered agent through LLMProvider with Zod validation + cost metadata.
 */
export async function runAgent(llm, promptKey, { input, modelClass = 'draft', metadata = {} } = {}) {
  const entry = getPromptEntry(promptKey)
  const system = [
    UNIVERSAL_COAUTHOR_RULES,
    entry.template,
    'Respond with valid JSON only matching the schema.',
  ].join('\n\n')

  const userContent =
    typeof input === 'string' ? input : JSON.stringify(input ?? {}, null, 2)
  const inputHash = createHash('sha256').update(`${promptKey}:${userContent}`).digest('hex')

  const completion = await llm.complete({
    modelClass,
    system,
    messages: [{ role: 'user', content: userContent }],
    cacheableSystemPrefix: input?.bookBible
      ? `BOOK_BIBLE:\n${JSON.stringify(input.bookBible)}`
      : undefined,
    maxTokens: metadata.maxTokens || 4096,
    metadata: {
      ...metadata,
      promptName: entry.name,
      promptVersion: entry.version,
      inputHash,
    },
  })

  const parsed = parseAgentJson(completion.text, entry.outputSchema)
  return {
    parsed,
    completion,
    promptName: entry.name,
    promptVersion: entry.version,
    inputHash,
  }
}

export { renderPrompt, getPromptEntry }
