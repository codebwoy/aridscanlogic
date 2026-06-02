import base44 from '@/lib/base44'
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

  const history = messages
    .slice(-8)
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n\n')

  const prompt = `${system}\n\n---\nCONVERSATION HISTORY:\n${history || '(new session)'}\n\n---\nuser: ${userMessage}\n\nassistant:`

  const res = await base44.integrations.Core.InvokeLLM({ prompt })
  return {
    text: res?.text || res?.content || '',
    language: lang,
  }
}

export async function generateExecutiveSummary(messages, language = 'de') {
  const transcript = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')
    .slice(0, 10000)

  const prompt = `${buildHerrMuellerSystemPrompt({ language })}

Create an **Executive Summary** of this consultation transcript. Include:
1. Key topics discussed
2. Decisions or recommendations given
3. **Timeline** table (Date | Event | Status) for any filings/registrations/deadlines mentioned
4. Open action items
5. Questions to bring to Steuerberater / Rechtsanwalt

TRANSCRIPT:
${transcript}`

  const res = await base44.integrations.Core.InvokeLLM({ prompt })
  return res?.text || res?.content || ''
}
