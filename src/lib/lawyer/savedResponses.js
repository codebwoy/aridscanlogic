import appApi from '@/lib/appApi'

/** First line of markdown response → message_title */
export function parseMessageTitle(content) {
  if (!content) return 'Beratung'
  const firstLine = content.split(/\r?\n/).find((l) => l.trim()) || ''
  return (
    firstLine
      .replace(/^#+\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/[_*`]/g, '')
      .trim()
      .slice(0, 120) || 'Beratung'
  )
}
export function normalizePrompt(text) {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?.!]+$/, '')
}

/** Find a saved answer for this user question (skips hidden entries). */
export async function findSavedResponse(userPrompt, categoryId = null) {
  const key = normalizePrompt(userPrompt)
  if (!key) return null

  const all = await appApi.entities.SavedLawyerMessage.list()
  const visible = all.filter((i) => !i.is_hidden)

  const exact = visible.find((i) => normalizePrompt(i.user_prompt) === key)
  if (exact) return exact

  if (categoryId) {
    const byCategory = visible.find(
      (i) => i.category_id === categoryId && normalizePrompt(i.user_prompt) === key
    )
    if (byCategory) return byCategory
  }

  return null
}

export async function saveLawyerResponse({
  userPrompt = '',
  content,
  conversationId,
  conversationTitle,
  categoryId = null,
  isHidden = false,
}) {
  const messageTitle = parseMessageTitle(content)

  return appApi.entities.SavedLawyerMessage.create({
    conversation_id: conversationId,
    user_prompt: userPrompt,
    category_id: categoryId || '',
    message_content: content,
    message_title: messageTitle,
    conversation_title: conversationTitle || 'Herr Müller',
    is_hidden: isHidden,
    saved_date: new Date().toISOString(),
  })
}

export async function isResponseSaved(userPrompt) {
  const match = await findSavedResponse(userPrompt)
  return !!match
}
