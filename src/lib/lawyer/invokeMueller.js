import {
  anthropicChat,
  isAnthropicConfigured,
  refreshLlmStatus,
} from '@/lib/anthropic'
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

  await refreshLlmStatus()
  if (!isAnthropicConfigured()) {
    throw new Error('ANTHROPIC_NOT_CONFIGURED')
  }

  const text = await anthropicChat({
    system,
    messages: chatMessages,
    maxTokens: 8192,
  })

  return { text, language: lang }
}

export async function generateExecutiveSummary(messages, language = 'de') {
  const transcript = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')
    .slice(0, 12000)

  if (!transcript.trim()) {
    throw new Error('EMPTY_TRANSCRIPT')
  }

  const lang = language === 'en' || language === 'de' ? language : 'de'
  const system = buildHerrMuellerSystemPrompt({ language: lang })
  const userPrompt = buildExecutiveSummaryPrompt(lang, transcript)

  await refreshLlmStatus()
  if (!isAnthropicConfigured()) {
    throw new Error('ANTHROPIC_NOT_CONFIGURED')
  }

  const text = await anthropicChat({
    system,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: 4096,
  })

  if (!text?.trim()) {
    throw new Error('EMPTY_SUMMARY')
  }

  return text
}

export async function translateMuellerContent(content, targetLang) {
  const lang = targetLang === 'en' ? 'en' : 'de'
  const instruction =
    lang === 'en'
      ? 'Translate the following Herr Müller markdown response to English. Keep all markdown structure, tables, headings, and lists. Output ONLY the translated markdown — no preamble.'
      : 'Übersetze die folgende Herr-Müller-Markdown-Antwort ins Deutsche. Behalte Markdown-Struktur, Tabellen, Überschriften und Listen bei. Gib NUR die übersetzte Markdown-Antwort aus — keine Einleitung.'

  await refreshLlmStatus()
  if (!isAnthropicConfigured()) {
    throw new Error('ANTHROPIC_NOT_CONFIGURED')
  }

  return anthropicChat({
    system: instruction,
    messages: [{ role: 'user', content }],
    maxTokens: 4096,
  })
}
