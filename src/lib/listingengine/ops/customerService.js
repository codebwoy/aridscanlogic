/**
 * Customer service cases — inquiry sync + manual paste + LLM draft (approve before send).
 */

import appApi from '@/lib/appApi'
import { fetchEbayInquiries, replyEbayInquiry } from '../ebay/client'
import { loadOrders } from './orders'

export const CS_STATUS = {
  OPEN: 'OPEN',
  DRAFT_READY: 'DRAFT_READY',
  WAITING_SEND: 'WAITING_SEND',
  SENT: 'SENT',
  CLOSED: 'CLOSED',
  ESCALATE: 'ESCALATE',
}

const CS_KEY = 'scanlogic_listingengine_cs'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function emptyCsCase(overrides = {}) {
  const now = new Date().toISOString()
  return {
    id: overrides.id || `cs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    source: 'manual', // manual | inquiry | order
    inquiryId: '',
    orderId: '',
    buyer: '',
    subject: '',
    buyerMessage: '',
    draftReply: '',
    status: CS_STATUS.OPEN,
    category: 'general', // where_is_order | shipping_delay | return | cancel | wrong_item | general
    human_approved: false,
    lastError: '',
    sentAt: null,
    dry_run_sent: false,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function loadCsCases() {
  const raw = readJson(CS_KEY, null)
  if (!raw || typeof raw !== 'object') return { version: 1, cases: [], updated_at: null }
  return {
    version: 1,
    cases: Array.isArray(raw.cases) ? raw.cases.map((c) => emptyCsCase(c)) : [],
    updated_at: raw.updated_at || null,
  }
}

export function saveCsCases(cases) {
  const next = {
    version: 1,
    cases: cases.map((c) => emptyCsCase(c)),
    updated_at: new Date().toISOString(),
  }
  writeJson(CS_KEY, next)
  return next
}

export function upsertCsCase(csCase) {
  const state = loadCsCases()
  const byId = new Map(state.cases.map((c) => [c.id, c]))
  const next = emptyCsCase({ ...csCase, updated_at: new Date().toISOString() })
  byId.set(next.id, next)
  // Also dedupe by inquiryId
  if (next.inquiryId) {
    for (const [id, c] of byId) {
      if (c.inquiryId === next.inquiryId && id !== next.id) byId.delete(id)
    }
  }
  return saveCsCases([...byId.values()])
}

export function updateCsCase(id, patch) {
  const state = loadCsCases()
  const cases = state.cases.map((c) =>
    c.id === id ? emptyCsCase({ ...c, ...patch, updated_at: new Date().toISOString() }) : c
  )
  return saveCsCases(cases)
}

export function removeCsCase(id) {
  const state = loadCsCases()
  return saveCsCases(state.cases.filter((c) => c.id !== id))
}

export async function syncInquiriesFromEbay({ limit = 25 } = {}) {
  let inquiries = []
  let syncError = null
  try {
    const data = await fetchEbayInquiries({ limit, inquiry_status: 'OPEN' })
    inquiries = data.inquiries || []
  } catch (err) {
    syncError = err?.message || String(err)
  }

  const state = loadCsCases()
  const byInquiry = new Map(
    state.cases.filter((c) => c.inquiryId).map((c) => [c.inquiryId, c])
  )

  for (const inq of inquiries) {
    if (!inq.inquiryId) continue
    const existing = byInquiry.get(inq.inquiryId)
    const buyerMsg =
      inq.inquiryDetails?.content ||
      inq.inquiryDetails?.description ||
      existing?.buyerMessage ||
      '(Siehe eBay Inquiry — Details ggf. im Seller Hub)'
    const next = emptyCsCase({
      ...(existing || {}),
      id: existing?.id,
      source: 'inquiry',
      inquiryId: inq.inquiryId,
      orderId: existing?.orderId || '',
      buyer: String(inq.buyer || existing?.buyer || ''),
      subject: `Inquiry ${inq.inquiryId}`,
      buyerMessage: String(buyerMsg).slice(0, 4000),
      status: existing?.status === CS_STATUS.SENT ? CS_STATUS.SENT : CS_STATUS.OPEN,
      category: existing?.category || 'general',
    })
    byInquiry.set(inq.inquiryId, next)
  }

  const others = state.cases.filter((c) => !c.inquiryId)
  const merged = [...byInquiry.values(), ...others].sort((a, b) =>
    String(b.updated_at || '').localeCompare(String(a.updated_at || ''))
  )
  const saved = saveCsCases(merged)
  return { ...saved, syncError, synced: inquiries.length }
}

export function createManualCsCase({ buyerMessage, buyer, orderId, subject, category }) {
  return upsertCsCase(
    emptyCsCase({
      source: orderId ? 'order' : 'manual',
      buyerMessage: String(buyerMessage || '').trim(),
      buyer: String(buyer || '').trim(),
      orderId: String(orderId || '').trim(),
      subject: String(subject || 'Käuferanfrage').slice(0, 120),
      category: category || 'general',
      status: CS_STATUS.OPEN,
    })
  )
}

function findOrderContext(orderId) {
  if (!orderId) return null
  const { orders } = loadOrders()
  return orders.find((o) => o.orderId === orderId) || null
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    category: { type: 'string' },
    escalate: { type: 'boolean' },
    escalate_reason: { type: 'string' },
    caution: { type: 'string' },
  },
  required: ['reply'],
}

/**
 * LLM draft reply — must not invent tracking, refunds, or shipping promises.
 */
export async function draftCsReply(caseId, language = 'de') {
  const state = loadCsCases()
  const cs = state.cases.find((c) => c.id === caseId)
  if (!cs) throw new Error('CS case not found')

  const order = findOrderContext(cs.orderId)
  const orderFacts = order
    ? {
        orderId: order.orderId,
        status: order.localStatus,
        trackingNumber: order.trackingNumber || null,
        carrier: order.shippingCarrierCode || null,
        shippedAt: order.shippedAt || null,
        items: (order.lineItems || []).map((li) => ({
          sku: li.sku,
          title: li.title || li.catalog_title,
          qty: li.quantity,
        })),
        handlingAlert: !!order.handlingAlert,
      }
    : null

  const prompt =
    language === 'en'
      ? `You draft a polite eBay seller reply in German (unless buyer wrote in English — then match language).

HARD RULES:
- Use ONLY facts provided below. Do NOT invent tracking numbers, delivery dates, refunds, replacements, or legal claims.
- If tracking is missing, say you are checking with the supplier and will update ASAP — do not invent a number.
- If escalate=true for legal threats, chargebacks, or safety issues — keep reply short and escalate.
- No ALL-CAPS spam. Keep under 1200 characters.
- This is customer service assistance, not legal advice.

Buyer: ${cs.buyer || 'unknown'}
Subject: ${cs.subject}
Category hint: ${cs.category}
Buyer message:
"""
${cs.buyerMessage}
"""

Verified order facts (JSON, may be null):
${JSON.stringify(orderFacts)}

Return JSON: { "reply": "...", "category": "where_is_order|shipping_delay|return|cancel|wrong_item|general", "escalate": false, "escalate_reason": "", "caution": "" }`
      : `Du entwirfst eine höfliche eBay-Verkäufer-Antwort auf Deutsch (wenn der Käufer auf Englisch schrieb: Englisch).

HART:
- Nur die unten genannten Fakten nutzen. KEINE Tracking-Nummern, Liefertermine, Erstattungen, Ersatzlieferungen oder Rechtsversprechen erfinden.
- Fehlt Tracking: sagen, dass du beim Lieferanten nachfragst und bald meldest — keine Nummer erfinden.
- Bei rechtlichen Drohungen/Chargeback/Sicherheit: escalate=true, Antwort kurz halten.
- Kein CAPS-Spam. Max. ca. 1200 Zeichen.
- Kundenservice-Hilfe, keine Rechtsberatung.

Käufer: ${cs.buyer || 'unbekannt'}
Betreff: ${cs.subject}
Kategorie-Hinweis: ${cs.category}
Käufer-Nachricht:
"""
${cs.buyerMessage}
"""

Verifizierte Bestelldaten (JSON, kann null sein):
${JSON.stringify(orderFacts)}

JSON zurückgeben: { "reply": "...", "category": "where_is_order|shipping_delay|return|cancel|wrong_item|general", "escalate": false, "escalate_reason": "", "caution": "" }`

  const res = await appApi.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: DRAFT_SCHEMA,
  })
  const parsed = res?.parsed || res?.data || {}
  const reply = String(parsed.reply || '').trim().slice(0, 2000)
  if (!reply) throw new Error('Keine Antwort vom Modell')

  const escalate = !!parsed.escalate
  return updateCsCase(caseId, {
    draftReply: reply,
    category: parsed.category || cs.category,
    status: escalate ? CS_STATUS.ESCALATE : CS_STATUS.DRAFT_READY,
    human_approved: false,
    lastError: parsed.caution || parsed.escalate_reason || '',
  })
}

/** Named reply templates (no invented tracking / refund promises). */
export const CS_REPLY_TEMPLATES = [
  { id: 'where_is_order', labelDe: 'Wo ist meine Bestellung?', labelEn: 'Where is my order?' },
  { id: 'shipping_delay', labelDe: 'Verspätung', labelEn: 'Shipping delay' },
  { id: 'return', labelDe: 'Rückgabe', labelEn: 'Return' },
  { id: 'cancel', labelDe: 'Storno', labelEn: 'Cancel' },
  { id: 'wrong_item', labelDe: 'Falscher Artikel', labelEn: 'Wrong item' },
  { id: 'general', labelDe: 'Allgemein', labelEn: 'General' },
]

function buildTemplateBody(templateId, cs, language = 'de') {
  const order = findOrderContext(cs.orderId)
  const tracking = order?.trackingNumber
  const carrier = order?.shippingCarrierCode ? ` (${order.shippingCarrierCode})` : ''
  const de = language !== 'en'
  const id = templateId || cs.category || 'general'

  if (id === 'where_is_order' && tracking) {
    return de
      ? `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Ihre Sendung ist unterwegs.\nTracking: ${tracking}${carrier}.\n\nBei weiteren Fragen melden Sie sich gerne.\n\nFreundliche Grüße`
      : `Hello,\n\nThank you for your message. Your parcel is on the way.\nTracking: ${tracking}${carrier}.\n\nBest regards`
  }
  if (id === 'where_is_order') {
    return de
      ? `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Ich prüfe den aktuellen Versandstatus Ihrer Bestellung und melde mich in Kürze mit einem Update. Ich möchte keine unzutreffenden Angaben machen.\n\nFreundliche Grüße`
      : `Hello,\n\nThank you for your message. I am checking the current shipping status and will update you shortly. I do not want to provide inaccurate information.\n\nBest regards`
  }
  if (id === 'shipping_delay') {
    return de
      ? `Guten Tag,\n\nvielen Dank für Ihre Geduld. Es gibt eine Verzögerung bei der Bearbeitung. Ich prüfe den Status beim Lieferanten und informiere Sie, sobald ich verlässliche Angaben habe.\n\nFreundliche Grüße`
      : `Hello,\n\nThank you for your patience. There is a delay in processing. I am checking with the supplier and will update you as soon as I have reliable information.\n\nBest regards`
  }
  if (id === 'return') {
    return de
      ? `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Für Rückgaben nutzen Sie bitte den Rückgabe-Prozess in Ihrem eBay-Konto. Sobald die Rückgabe eröffnet ist, kann ich den Fall weiter prüfen.\n\nFreundliche Grüße`
      : `Hello,\n\nThank you for your message. Please start the return via your eBay account. Once the return is open, I can review the case further.\n\nBest regards`
  }
  if (id === 'cancel') {
    return de
      ? `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Ich prüfe, ob die Bestellung noch stornierbar ist, und melde mich mit dem Ergebnis. Bitte haben Sie etwas Geduld.\n\nFreundliche Grüße`
      : `Hello,\n\nThank you for your message. I am checking whether the order can still be cancelled and will get back to you with the result. Please bear with me.\n\nBest regards`
  }
  if (id === 'wrong_item') {
    return de
      ? `Guten Tag,\n\nes tut mir leid, dass der Artikel nicht Ihren Erwartungen entspricht. Bitte beschreiben Sie kurz, was geliefert wurde bzw. was erwartet wurde. Ich prüfe den Fall und melde mich mit den nächsten Schritten (ohne voreilige Erstattung).\n\nFreundliche Grüße`
      : `Hello,\n\nI am sorry the item did not match your expectations. Please briefly describe what was delivered vs what you expected. I will review the case and come back with next steps (no premature refund promises).\n\nBest regards`
  }
  return de
    ? `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Ich prüfe den aktuellen Status und melde mich in Kürze mit einem Update. Ich möchte keine unzutreffenden Angaben machen.\n\nFreundliche Grüße`
    : `Hello,\n\nThank you for your message. I am checking the current status and will update you shortly. I do not want to provide inaccurate information.\n\nBest regards`
}

/**
 * Template fallback when LLM unavailable.
 */
export function templateCsReply(cs, language = 'de') {
  return buildTemplateBody(cs.category || 'general', cs, language)
}

/** Apply a named template into the case draft (not sent). */
export function applyCsTemplate(caseId, templateId, language = 'de') {
  const state = loadCsCases()
  const cs = state.cases.find((c) => c.id === caseId)
  if (!cs) throw new Error('CS case not found')
  const reply = buildTemplateBody(templateId, cs, language)
  return updateCsCase(caseId, {
    draftReply: reply,
    category: templateId || cs.category,
    status: CS_STATUS.DRAFT_READY,
    human_approved: false,
    lastError: '',
  })
}

export async function sendCsReply(caseId, { dryRun = true } = {}) {
  const state = loadCsCases()
  const cs = state.cases.find((c) => c.id === caseId)
  if (!cs) throw new Error('CS case not found')
  if (!cs.human_approved) throw new Error('Freigabe erforderlich vor dem Senden')
  if (!cs.draftReply?.trim()) throw new Error('Kein Entwurf')

  if (cs.inquiryId) {
    await replyEbayInquiry({
      inquiryId: cs.inquiryId,
      message: cs.draftReply,
      human_approved: true,
      dry_run: !!dryRun,
    })
  }

  return updateCsCase(caseId, {
    status: CS_STATUS.SENT,
    sentAt: new Date().toISOString(),
    dry_run_sent: !!dryRun || !cs.inquiryId,
    lastError: cs.inquiryId
      ? ''
      : dryRun
        ? ''
        : 'Kein Inquiry-ID — Antwort in die Zwischenablage kopieren und im Seller Hub senden.',
  })
}
