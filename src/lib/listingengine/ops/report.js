/**
 * Daily ops summary — listings, errors, orders, CS, stock-outs.
 */

import { loadCatalog, getDailyPublishUsage } from '../catalog/store'
import { effectiveDailyCap } from '../catalog/schema'
import { loadOrders, ORDER_STATUS } from './orders'
import { loadCsCases, CS_STATUS } from './customerService'
import { notifySeller } from './notifications'

export function buildDailyReport() {
  const catalog = loadCatalog()
  const { orders } = loadOrders()
  const { cases } = loadCsCases()
  const usage = getDailyPublishUsage()
  const cap = effectiveDailyCap(catalog.settings)

  const products = catalog.products || []
  const listed = products.filter((p) => p.status === 'LISTED')
  const errors = products.filter((p) => p.status === 'ERROR' || p.last_error)
  const attention = products.filter((p) => p.status === 'NEEDS_ATTENTION')
  const stockOuts = products.filter((p) => p.stock_qty <= 0 && p.status === 'LISTED')
  const pendingReview = products.filter((p) => p.status === 'PENDING_REVIEW')
  const approved = products.filter((p) => p.status === 'APPROVED')

  const ordersPending = orders.filter(
    (o) =>
      o.localStatus === ORDER_STATUS.PENDING_SUPPLIER ||
      o.localStatus === ORDER_STATUS.ORDERED_SUPPLIER ||
      o.localStatus === ORDER_STATUS.NEW
  )
  const ordersShipped = orders.filter((o) => o.localStatus === ORDER_STATUS.SHIPPED)
  const handlingAlerts = orders.filter((o) => o.handlingAlert)
  const csOpen = cases.filter(
    (c) => c.status !== CS_STATUS.SENT && c.status !== CS_STATUS.CLOSED
  )

  const todayLogs = (catalog.publish_log || []).filter((e) =>
    String(e.at || '').startsWith(usage.day)
  )

  return {
    day: usage.day,
    publish: {
      today_count: usage.count,
      today_errors: usage.errors,
      daily_cap: cap,
      slots_left: Math.max(0, cap - usage.count),
      dry_run: catalog.settings?.dry_run !== false,
      kill_switch: !!catalog.settings?.kill_switch,
      live_mode: !!catalog.settings?.live_mode,
      log_today: todayLogs.length,
    },
    catalog: {
      total: products.length,
      listed: listed.length,
      approved: approved.length,
      pending_review: pendingReview.length,
      needs_attention: attention.length,
      errors: errors.length,
      stock_outs: stockOuts.length,
      consecutive_clean_days: catalog.settings?.consecutive_clean_days || 0,
      approved_clean_count: catalog.settings?.approved_clean_count || 0,
    },
    orders: {
      total: orders.length,
      pending: ordersPending.length,
      shipped: ordersShipped.length,
      handling_alerts: handlingAlerts.length,
    },
    cs: {
      total: cases.length,
      open: csOpen.length,
    },
  }
}

export function formatDailyReportText(report, lang = 'de') {
  const r = report || buildDailyReport()
  if (lang === 'en') {
    return [
      `ScanLogic daily — ${r.day}`,
      `Publish: ${r.publish.today_count}/${r.publish.daily_cap} (errors ${r.publish.today_errors}) · dry-run=${r.publish.dry_run}`,
      `Catalog: ${r.catalog.total} · listed ${r.catalog.listed} · review ${r.catalog.pending_review} · attention ${r.catalog.needs_attention} · stock-outs ${r.catalog.stock_outs}`,
      `Orders: pending ${r.orders.pending} · shipped ${r.orders.shipped} · handling alerts ${r.orders.handling_alerts}`,
      `CS open: ${r.cs.open}`,
    ].join('\n')
  }
  return [
    `ScanLogic Tagesbericht — ${r.day}`,
    `Publish: ${r.publish.today_count}/${r.publish.daily_cap} (Fehler ${r.publish.today_errors}) · Dry-Run=${r.publish.dry_run}`,
    `Katalog: ${r.catalog.total} · gelistet ${r.catalog.listed} · Review ${r.catalog.pending_review} · Attention ${r.catalog.needs_attention} · Stock-outs ${r.catalog.stock_outs}`,
    `Bestellungen: offen ${r.orders.pending} · versendet ${r.orders.shipped} · Frist-Warnung ${r.orders.handling_alerts}`,
    `CS offen: ${r.cs.open}`,
  ].join('\n')
}

export async function sendDailySummary(lang = 'de') {
  const report = buildDailyReport()
  const text = formatDailyReportText(report, lang)
  const notify = await notifySeller('daily', text)
  return { report, text, notify }
}
