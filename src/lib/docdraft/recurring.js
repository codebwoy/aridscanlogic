const KEY = 'docdraft_recurring'

export function listRecurring() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveRecurring(item) {
  const list = listRecurring()
  const entry = { id: `rec-${Date.now()}`, ...item, createdAt: new Date().toISOString() }
  list.push(entry)
  localStorage.setItem(KEY, JSON.stringify(list))
  return entry
}

export function deleteRecurring(id) {
  localStorage.setItem(KEY, JSON.stringify(listRecurring().filter((r) => r.id !== id)))
}

export function dueRecurringInvoices() {
  const today = new Date()
  return listRecurring().filter((r) => {
    if (!r.nextDate) return false
    const next = new Date(r.nextDate)
    const diff = (next - today) / 86400000
    return diff >= 0 && diff <= 3
  })
}
