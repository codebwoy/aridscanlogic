import { createHash } from 'node:crypto'
import { UNIVERSAL_FICTION_RULES, bookLanguageAgentInstruction } from '@novelforge/shared'
import { getPromptEntry, parseAgentJson, renderPrompt } from './registry.js'

/**
 * Run a registered agent through LLMProvider with Zod validation + cost metadata.
 */
export async function runAgent(llm, promptKey, { input, modelClass = 'draft', metadata = {} } = {}) {
  const entry = getPromptEntry(promptKey)
  const systemParts = []
  if (entry.coauthorRules) systemParts.push(UNIVERSAL_FICTION_RULES)
  const langCode = input?.language || metadata?.language
  if (langCode) {
    const variety = input?.language_variety || metadata?.language_variety
    systemParts.push(bookLanguageAgentInstruction(langCode, variety))
  }
  const rendered = renderPrompt(entry.template, {
    UNIVERSAL_FICTION_RULES,
    UNIVERSAL_COAUTHOR_RULES: UNIVERSAL_FICTION_RULES,
  })
  systemParts.push(rendered)
  systemParts.push(
    'Respond with valid JSON only matching the schema. Do not wrap the JSON in markdown code fences (no ```json). No prose outside the JSON object.'
  )
  const system = systemParts.join('\n\n')

  const userContent =
    typeof input === 'string' ? input : JSON.stringify(input ?? {}, null, 2)
  const inputHash = createHash('sha256').update(`${promptKey}:${userContent}`).digest('hex')

  // Writer prose needs headroom; Anthropic provider caps at 8192.
  const defaultMax =
    promptKey === 'writer.v1' || promptKey === 'outline.v1' ? 8192 : 4096

  const completion = await llm.complete({
    modelClass,
    system,
    messages: [{ role: 'user', content: userContent }],
    cacheableSystemPrefix: input?.bookBible
      ? `BOOK_BIBLE:\n${JSON.stringify(input.bookBible)}`
      : undefined,
    maxTokens: metadata.maxTokens || defaultMax,
    metadata: {
      ...metadata,
      promptKey,
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
