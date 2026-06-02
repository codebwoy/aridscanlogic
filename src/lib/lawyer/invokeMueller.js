import appApi from '@/lib/appApi'
import { anthropicChat, isAnthropicConfigured, ensureLlmStatus } from '@/lib/anthropic'
import { buildHerrMuellerSystemPrompt, detectLanguage } from './herrMuellerPrompt'

export async function invokeHerrMueller({
  userMessage,
  messages = [],
  categoryId = null,
  documentContext = null,
  language = null,
}) {
  const lang = language || detectLanguage(userMessage)
  const system = buildHerrMuellerSystemPrompt({
    language: lang,
    categoryId,
    documentContext,
  })

  const chatMessages = messages
    .slice(-12)
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }))

  chatMessages.push({ role: 'user', content: userMessage })

  await ensureLlmStatus()
  if (isAnthropicConfigured()) {
    const text = await anthropicChat({
      system,
      messages: chatMessages,
      maxTokens: 8192,
    })
    return { text, language: lang }
  }

  const history = chatMessages
    .slice(0, -1)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n\n')
  const prompt = `${system}\n\n---\nCONVERSATION HISTORY:\n${history || '(new session)'}\n\n---\nuser: ${userMessage}\n\nassistant:`
  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  return {
    text: res?.text || res?.content || '',
    language: lang,
  }
}

export async function generateExecutiveSummary(messages, language = 'de') {
  const transcript = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')
    .slice(0, 12000)

  const system = buildHerrMuellerSystemPrompt({ language })
  const userPrompt = `Create an **Executive Summary** of this consultation transcript. Include:
1. Key topics discussed
2. Decisions or recommendations given
3. **Timeline** table (Date | Event | Status) for any filings/registrations/deadlines mentioned
4. Open action items
5. Questions to bring to Steuerberater / Rechtsanwalt

TRANSCRIPT:
${transcript}`

  await ensureLlmStatus()
  if (isAnthropicConfigured()) {
    const text = await anthropicChat({
      system,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 4096,
    })
    return text
  }

  const prompt = `${system}\n\n${userPrompt}`
  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  return res?.text || res?.content || ''
}
