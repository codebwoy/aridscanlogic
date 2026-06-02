import base44 from '@/lib/base44'
import { loadTaxVaultSettings } from './profile'

const LAST_CHECK_KEY = 'taxvault_last_reminder_check'

const INTERVAL_DAYS = { monthly: 30, quarterly: 90, annually: 365 }

export async function checkRecurringReminders() {
  const settings = loadTaxVaultSettings()
  if (!settings.recurringReminders) return
  if (!('Notification' in window)) return

  const last = localStorage.getItem(LAST_CHECK_KEY)
  const today = new Date().toISOString().slice(0, 10)
  if (last === today) return
  localStorage.setItem(LAST_CHECK_KEY, today)

  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if (Notification.permission !== 'granted') return

  const receipts = await base44.entities.Receipt.list()
  const due = receipts.filter((r) => {
    if (!r.is_recurring) return false
    const days = INTERVAL_DAYS[r.recurring_interval] || 30
    const base = r.purchase_date ? new Date(r.purchase_date) : new Date(r.created_date)
    const next = new Date(base)
    next.setDate(next.getDate() + days)
    const diff = (next - new Date()) / 86400000
    return diff >= 0 && diff <= 3
  })

  due.forEach((r) => {
    new Notification('Tax Vault — Recurring expense', {
      body: `Scan receipt for ${r.vendor_name} (${r.recurring_interval})`,
      tag: `recurring-${r.id}`,
    })
  })
}
