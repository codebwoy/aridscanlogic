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
  const userPrompt = `Create an **Executive Summary** of this consultation transcript.

Use this exact markdown structure (German or English matching the transcript language):

## Executive Summary

**Themen:** one-line topic overview

| Datum | Ereignis | Status |
|-------|----------|--------|
| YYYY-MM-DD | … | … |

### Empfehlungen
1. …
2. …

### Offene Punkte
- …

### Fragen für Ihren Steuerberater / Rechtsanwalt
- …

*Hinweis: Diese Beratung dient ausschließlich der allgemeinen Information und Bildung.*

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
