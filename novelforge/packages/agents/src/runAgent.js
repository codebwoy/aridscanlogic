import { createHash } from 'node:crypto'
import { UNIVERSAL_FICTION_RULES, bookLanguageAgentInstruction } from '@novelforge/shared'
import {
  clampDraftTargetWords,
  maxTokensForDraftWords,
  WRITER_MAX_OUTPUT_TOKENS,
} from './draftLimits.js'
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
  if (promptKey === 'writer.v1') {
    systemParts.push(
      'Output MUST use <<<NF_META>>>, <<<NF_PROSE>>>, <<<NF_END>>> delimiters. Put all fiction prose only between NF_PROSE and NF_END. Meta JSON must not contain the scene prose. No markdown fences.'
    )
  } else {
    systemParts.push(
      'Respond with valid JSON only matching the schema. Do not wrap the JSON in markdown code fences (no ```json). No prose outside the JSON object. Always close every string and brace.'
    )
  }
  const system = systemParts.join('\n\n')

  let agentInput = input
  if (promptKey === 'writer.v1' && input && typeof input === 'object' && input.node) {
    const tw = clampDraftTargetWords(input.node.target_words ?? metadata.targetWords)
    agentInput = {
      ...input,
      node: {
        ...input.node,
        target_words: tw,
      },
      draft_constraints: {
        max_words: tw,
        output_format: 'NF_DELIMITED',
      },
    }
  }

  const userContent =
    typeof agentInput === 'string' ? agentInput : JSON.stringify(agentInput ?? {}, null, 2)
  const inputHash = createHash('sha256').update(`${promptKey}:${userContent}`).digest('hex')

  const defaultMax =
    promptKey === 'writer.v1'
      ? maxTokensForDraftWords(agentInput?.node?.target_words || metadata.targetWords)
      : promptKey === 'outline.v1'
        ? WRITER_MAX_OUTPUT_TOKENS
        : 4096

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
