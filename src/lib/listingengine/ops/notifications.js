/**
 * Optional Telegram webhook + browser notifications for seller ops alerts.
 */

import { loadCatalog } from '../catalog/store'

export async function sendTelegramMessage(text, webhookUrl, chatIdOverride) {
  const settings = loadCatalog().settings || {}
  const url = String(webhookUrl || settings.telegram_webhook_url || '').trim()
  if (!url) return { ok: false, skipped: true, reason: 'no_webhook' }
  if (!/^https:\/\//i.test(url)) return { ok: false, reason: 'webhook_must_be_https' }

  const isTelegramBot = /api\.telegram\.org\/bot.+\/sendMessage/i.test(url)
  try {
    let endpoint = url
    let body
    if (isTelegramBot) {
      const u = new URL(url)
      const chatId = chatIdOverride || settings.telegram_chat_id || u.searchParams.get('chat_id')
      if (!chatId) {
        return { ok: false, reason: 'telegram_chat_id_required' }
      }
      endpoint = `${u.origin}${u.pathname}`
      body = { chat_id: chatId, text: String(text).slice(0, 4000) }
    } else {
      body = { text: String(text).slice(0, 4000), source: 'scanlogic-listingengine' }
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      return { ok: false, status: res.status, reason: t.slice(0, 200) }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: err?.message || String(err) }
  }
}

export function notifyBrowser(title, body) {
  try {
    if (typeof Notification === 'undefined') return false
    if (Notification.permission === 'granted') {
      new Notification(title, { body: String(body || '').slice(0, 200) })
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}

export async function requestBrowserNotifyPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export async function notifySeller(event, message, { force = false } = {}) {
  const settings = loadCatalog().settings || {}
  const map = {
    publish: settings.notify_on_publish !== false,
    handling: settings.notify_on_handling_alert !== false,
    daily: settings.notify_daily_summary !== false,
  }
  if (!force && map[event] === false) return { ok: false, skipped: true }

  const title =
    event === 'publish'
      ? 'ScanLogic Publish'
      : event === 'handling'
        ? 'ScanLogic Handling'
        : 'ScanLogic Daily'

  notifyBrowser(title, message)
  const tg = await sendTelegramMessage(`[${title}]\n${message}`, settings.telegram_webhook_url)
  return { ok: true, telegram: tg }
}
