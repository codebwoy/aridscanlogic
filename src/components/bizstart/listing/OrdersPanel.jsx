import { useCallback, useState } from 'react'
import {
  Loader2,
  RefreshCw,
  PackageCheck,
  AlertTriangle,
  Truck,
  Download,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  ORDER_STATUS,
  loadOrders,
  syncOrdersFromEbay,
  markOrderedFromSupplier,
  markOrderIssue,
  uploadTracking,
  COMMON_CARRIERS,
  createManualCsCase,
  addSampleDryRunOrder,
  clearSampleOrders,
} from '@/lib/listingengine/ops'
import { loadCatalog } from '@/lib/listingengine/catalog'
import { isEbayConnected } from '@/lib/listingengine/ebay/authStore'

function money(total) {
  if (!total) return '—'
  const v = total.value ?? total
  const c = total.currency || 'EUR'
  return `${v} ${c}`
}

function stepLabel(status, lang) {
  const de = lang === 'de'
  if (status === ORDER_STATUS.NEW || status === ORDER_STATUS.PENDING_SUPPLIER) {
    return de ? '1/3 Beim Lieferanten bestellen' : '1/3 Order from supplier'
  }
  if (status === ORDER_STATUS.ORDERED_SUPPLIER) {
    return de ? '2/3 Tracking eintragen & an eBay' : '2/3 Enter tracking → eBay'
  }
  if (status === ORDER_STATUS.SHIPPED) {
    return de ? '3/3 Versendet' : '3/3 Shipped'
  }
  return status
}

export default function OrdersPanel({ lang = 'de', onOpenCs }) {
  const [state, setState] = useState(() => loadOrders())
  const [busy, setBusy] = useState(false)
  const [shipForm, setShipForm] = useState({})

  const dryRun = loadCatalog().settings?.dry_run !== false

  const refresh = useCallback(() => setState(loadOrders()), [])

  const onSync = async () => {
    if (!isEbayConnected()) {
      toast.error(lang === 'de' ? 'Zuerst eBay verbinden (Katalog-Tab)' : 'Connect eBay first')
      return
    }
    setBusy(true)
    try {
      const next = await syncOrdersFromEbay({ days: 14, limit: 50 })
      setState(next)
      toast.success(
        lang === 'de'
          ? `${next.orders.length} Bestellungen synchronisiert`
          : `${next.orders.length} orders synced`
      )
    } catch (err) {
      toast.error(err?.message || 'Sync failed')
    } finally {
      setBusy(false)
    }
  }

  const onSample = () => {
    setState(addSampleDryRunOrder())
    toast.success(
      lang === 'de'
        ? 'Sample-Bestellung geladen — Dry-Run üben (Lieferant → Tracking)'
        : 'Sample order loaded — practice dry-run (supplier → tracking)'
    )
  }

  const onClearSamples = () => {
    setState(clearSampleOrders())
    toast.success(lang === 'de' ? 'Sample-Bestellungen entfernt' : 'Sample orders cleared')
  }

  const onMarkSupplier = (orderId) => {
    setState(markOrderedFromSupplier(orderId))
    toast.success(
      lang === 'de' ? 'Als beim Lieferanten bestellt markiert' : 'Marked ordered from supplier'
    )
  }

  const onShip = async (order) => {
    const form = shipForm[order.orderId] || {}
    const tracking = String(form.tracking || order.trackingNumber || '').trim()
    const carrier = String(form.carrier || order.shippingCarrierCode || 'DHL').trim()
    if (!tracking) {
      toast.error(lang === 'de' ? 'Tracking-Nummer fehlt' : 'Tracking number required')
      return
    }
    setBusy(true)
    try {
      const next = await uploadTracking({
        orderId: order.orderId,
        trackingNumber: tracking,
        shippingCarrierCode: carrier,
        dryRun,
      })
      setState(next)
      toast.success(
        dryRun
          ? lang === 'de'
            ? 'Dry-Run: Tracking gespeichert (nicht an eBay gesendet)'
            : 'Dry-run: tracking saved (not sent to eBay)'
          : lang === 'de'
            ? 'Tracking an eBay übermittelt'
            : 'Tracking uploaded to eBay'
      )
    } catch (err) {
      toast.error(err?.message || 'Ship failed')
      markOrderIssue(order.orderId, err?.message)
      refresh()
    } finally {
      setBusy(false)
    }
  }

  const onCsFromOrder = (order) => {
    createManualCsCase({
      orderId: order.orderId,
      buyer: order.buyerUsername,
      subject: `Bestellung ${order.orderId}`,
      buyerMessage:
        lang === 'de'
          ? `Hallo, wo bleibt meine Bestellung ${order.orderId}? Bitte um Tracking.`
          : `Hi, where is my order ${order.orderId}? Please send tracking.`,
      category: 'where_is_order',
    })
    toast.success(lang === 'de' ? 'CS-Fall angelegt — Tab Kundenservice' : 'CS case created')
    onOpenCs?.()
  }

  const alerts = state.orders.filter((o) => o.handlingAlert).length
  const hasSamples = state.orders.some((o) => String(o.orderId).startsWith('SAMPLE-'))

  return (
    <div className="space-y-4">
      <div className="premium-card space-y-3 border border-brand-500/25 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">
              {lang === 'de' ? 'Bestellungen & Versand' : 'Orders & shipping'}
            </p>
            <p className="text-[11px] text-slate-500">
              {lang === 'de'
                ? 'Ablauf: Sync → Beim Lieferanten markieren → Tracking an eBay. Standard: Dry-Run (wie Publish).'
                : 'Flow: Sync → mark ordered from supplier → tracking to eBay. Default: dry-run (like publish).'}
            </p>
          </div>
          <div className="stack-actions w-full sm:w-auto">
            <button
              type="button"
              onClick={onSample}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Sample
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onSync}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {lang === 'de' ? 'Orders sync' : 'Sync orders'}
            </button>
          </div>
        </div>

        <ol className="list-decimal space-y-1 pl-4 text-[11px] text-slate-400">
          <li>
            {lang === 'de'
              ? 'Orders sync (echte Verkäufe) oder Sample für Übung'
              : 'Sync orders (real sales) or Sample to practice'}
          </li>
          <li>
            {lang === 'de'
              ? '„Beim Lieferant“ — du bestellst beim Wholesaler'
              : '“At supplier” — you place the wholesale order'}
          </li>
          <li>
            {lang === 'de'
              ? 'Tracking + Carrier → eBay (Dry-Run speichert nur lokal)'
              : 'Tracking + carrier → eBay (dry-run saves locally only)'}
          </li>
        </ol>

        {alerts > 0 ? (
          <p className="flex items-center gap-1.5 text-xs text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            {lang === 'de'
              ? `${alerts} Bestellung(en) nahe Handling-/Lieferfrist`
              : `${alerts} order(s) near handling deadline`}
          </p>
        ) : null}
        {dryRun ? (
          <p className="text-[10px] text-amber-300/90">
            Dry-Run aktiv — Tracking wird lokal gespeichert, nicht live an eBay gepusht.
          </p>
        ) : (
          <p className="text-[10px] text-emerald-300/90">
            LIVE — Tracking wird an eBay createShippingFulfillment gesendet.
          </p>
        )}
        {hasSamples ? (
          <button
            type="button"
            onClick={onClearSamples}
            className="inline-flex items-center gap-1 text-[10px] text-rose-300"
          >
            <Trash2 className="h-3 w-3" />
            {lang === 'de' ? 'Samples entfernen' : 'Clear samples'}
          </button>
        ) : null}
      </div>

      {!state.orders.length ? (
        <div className="premium-card space-y-3 p-6 text-center">
          <p className="text-sm text-slate-500">
            {lang === 'de'
              ? 'Keine Bestellungen — Sample laden (Dry-Run üben) oder eBay syncen.'
              : 'No orders — load Sample (practice dry-run) or sync from eBay.'}
          </p>
          <button
            type="button"
            onClick={onSample}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
          >
            <Download className="h-3.5 w-3.5" />
            {lang === 'de' ? 'Sample-Bestellung laden' : 'Load sample order'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {state.orders.map((o) => (
            <div key={o.orderId} className="premium-card space-y-2 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">
                    #{o.orderId} · {o.buyerUsername || '—'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {stepLabel(o.localStatus, lang)} · eBay {o.orderFulfillmentStatus || '—'} ·{' '}
                    {money(o.total)}
                    {o.handlingAlert ? ' · ⚠ Frist' : ''}
                    {o.dry_run_shipped ? ' · dry-ship' : ''}
                    {String(o.orderId).startsWith('SAMPLE-') ? ' · sample' : ''}
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {o.creationDate ? String(o.creationDate).slice(0, 10) : '—'}
                </span>
              </div>

              <ul className="space-y-0.5 text-[11px] text-slate-400">
                {(o.lineItems || []).map((li) => (
                  <li key={li.lineItemId}>
                    {li.quantity}× {li.title || li.sku}{' '}
                    <span className="text-slate-600">({li.sku || 'no-sku'})</span>
                    {li.catalog_supplier_sku ? (
                      <span className="text-brand-300"> → {li.catalog_supplier_sku}</span>
                    ) : null}
                  </li>
                ))}
              </ul>

              {o.shipTo?.fullName || o.shipTo?.city ? (
                <p className="text-[10px] text-slate-500">
                  {o.shipTo.fullName}, {o.shipTo.addressLine1}, {o.shipTo.postalCode}{' '}
                  {o.shipTo.city} {o.shipTo.countryCode}
                </p>
              ) : null}

              {o.localStatus !== ORDER_STATUS.SHIPPED &&
              o.localStatus !== ORDER_STATUS.CANCELLED ? (
                <div className="form-grid form-grid-3 !gap-2">
                  <input
                    placeholder="Tracking"
                    value={shipForm[o.orderId]?.tracking ?? o.trackingNumber ?? ''}
                    onChange={(e) =>
                      setShipForm((s) => ({
                        ...s,
                        [o.orderId]: { ...s[o.orderId], tracking: e.target.value },
                      }))
                    }
                    className="min-h-[44px] rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                  />
                  <select
                    value={shipForm[o.orderId]?.carrier ?? o.shippingCarrierCode ?? 'DHL'}
                    onChange={(e) =>
                      setShipForm((s) => ({
                        ...s,
                        [o.orderId]: { ...s[o.orderId], carrier: e.target.value },
                      }))
                    }
                    className="min-h-[44px] rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                  >
                    {COMMON_CARRIERS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1">
                    {o.localStatus === ORDER_STATUS.PENDING_SUPPLIER ||
                    o.localStatus === ORDER_STATUS.NEW ? (
                      <button
                        type="button"
                        onClick={() => onMarkSupplier(o.orderId)}
                        className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5 text-[10px]"
                      >
                        <PackageCheck className="h-3 w-3" />
                        {lang === 'de' ? 'Beim Lieferant' : 'At supplier'}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onShip(o)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-700 px-2 py-1.5 text-[10px] font-semibold text-white"
                    >
                      <Truck className="h-3 w-3" />
                      {lang === 'de' ? 'Tracking → eBay' : 'Ship → eBay'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onCsFromOrder(o)}
                      className="rounded-lg bg-slate-800 px-2 py-1.5 text-[10px] text-brand-300"
                    >
                      CS
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-300/90">
                  {o.shippingCarrierCode} {o.trackingNumber}
                </p>
              )}

              {o.lastError ? <p className="text-[10px] text-rose-300">{o.lastError}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
