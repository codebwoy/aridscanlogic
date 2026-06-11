import appApi from '@/lib/appApi'
import { anthropicChat, isAnthropicConfigured, ensureLlmStatus } from '@/lib/anthropic'
import { buildHerrMuellerSystemPrompt, detectLanguage } from './herrMuellerPrompt'
import { buildExecutiveSummaryPrompt } from './executiveSummaryPrompt'

export async function invokeHerrMueller({
  userMessage,
  messages = [],
  categoryId = null,
  documentContext = null,
  language = null,
}) {
  const lang = language === 'en' || language === 'de' ? language : detectLanguage(userMessage)
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

  const lang = language === 'en' || language === 'de' ? language : 'de'
  const system = buildHerrMuellerSystemPrompt({ language: lang })
  const userPrompt = buildExecutiveSummaryPrompt(lang, transcript)

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

function isExecutiveSummaryMarkdown(content) {
  return /^##\s*(Executive Summary|Zusammenfassung)/im.test((content || '').trim())
}

export async function translateMuellerContent(content, targetLang) {
  const lang = targetLang === 'en' ? 'en' : 'de'
  const instruction =
    lang === 'en'
      ? 'Translate the following Herr Müller markdown response to English. Keep all markdown structure, tables, headings, and lists. Output ONLY the translated markdown — no preamble.'
      : 'Übersetze die folgende Herr-Müller-Markdown-Antwort ins Deutsche. Behalte Markdown-Struktur, Tabellen, Überschriften und Listen bei. Gib NUR die übersetzte Markdown-Antwort aus — keine Einleitung.'

  await ensureLlmStatus()
  if (isAnthropicConfigured()) {
    return anthropicChat({
      system: instruction,
      messages: [{ role: 'user', content }],
      maxTokens: 4096,
    })
  }

  if (isExecutiveSummaryMarkdown(content)) {
    const { executiveSummaryDemo } = await import('./demoResponses.js')
    return executiveSummaryDemo(lang, '')
  }

  const prompt = `${instruction}\n\n---\n${content}`
  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  const text = res?.text || res?.content || ''
  if (text && !text.includes('Demo mode')) return text
  throw new Error('TRANSLATION_UNAVAILABLE')
}
