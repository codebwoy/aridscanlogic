import { useCallback, useEffect, useState } from 'react'
import { Loader2, Link2, Unlink, UploadCloud, RefreshCw, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { PUBLISH_STATUS, READINESS_VERDICT } from '@/lib/listingengine'
import {
  connectEbayAccount,
  disconnectEbayAccount,
  fetchEbayPolicies,
  fetchEbayStatus,
  publishListingToEbay,
} from '@/lib/listingengine/ebay/client'
import { isEbayConnected, loadEbayAuth } from '@/lib/listingengine/ebay/authStore'
import { buildEbayPublishPayload } from '@/lib/listingengine/ebay/mapToInventory'

export default function EbayPublishPanel({
  lang = 'de',
  session,
  readiness,
  onSettingsChange,
}) {
  const [configured, setConfigured] = useState(null)
  const [connected, setConnected] = useState(isEbayConnected)
  const [sandbox, setSandbox] = useState(false)
  const [busy, setBusy] = useState(false)
  const [policies, setPolicies] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const settings = session.ebay_settings || {}

  const refreshStatus = useCallback(async () => {
    try {
      const s = await fetchEbayStatus()
      setConfigured(!!s.configured)
      setSandbox(!!s.sandbox)
    } catch {
      setConfigured(false)
    }
    setConnected(isEbayConnected())
    const auth = loadEbayAuth()
    if (auth?.sandbox != null) setSandbox(!!auth.sandbox)
  }, [])

  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  const patch = (partial) => onSettingsChange?.(partial)

  const onConnect = async () => {
    setBusy(true)
    try {
      await connectEbayAccount()
      setConnected(true)
      toast.success(lang === 'de' ? 'eBay-Konto verbunden' : 'eBay account connected')
      await loadPolicies()
    } catch (err) {
      toast.error(err?.message || (lang === 'de' ? 'Verbindung fehlgeschlagen' : 'Connect failed'))
    } finally {
      setBusy(false)
      refreshStatus()
    }
  }

  const onDisconnect = () => {
    disconnectEbayAccount()
    setConnected(false)
    setPolicies(null)
    toast.success(lang === 'de' ? 'eBay getrennt' : 'eBay disconnected')
  }

  const loadPolicies = async () => {
    setBusy(true)
    try {
      const data = await fetchEbayPolicies()
      setPolicies(data)
      const next = { ...settings }
      if (!next.fulfillmentPolicyId && data.fulfillment?.[0]?.id) {
        next.fulfillmentPolicyId = data.fulfillment[0].id
      }
      if (!next.paymentPolicyId && data.payment?.[0]?.id) {
        next.paymentPolicyId = data.payment[0].id
      }
      if (!next.returnPolicyId && data.return?.[0]?.id) {
        next.returnPolicyId = data.return[0].id
      }
      if (!next.merchantLocationKey && data.locations?.[0]?.key) {
        next.merchantLocationKey = data.locations[0].key
      }
      onSettingsChange?.(next)
      if (data.errors?.length) {
        toast.error(data.errors[0])
      } else {
        toast.success(lang === 'de' ? 'Richtlinien geladen' : 'Policies loaded')
      }
    } catch (err) {
      toast.error(err?.message || (lang === 'de' ? 'Richtlinien fehlgeschlagen' : 'Policies failed'))
    } finally {
      setBusy(false)
    }
  }

  const canPublish =
    session.human_approved &&
    session.compliance?.publish_status !== PUBLISH_STATUS.BLOCKED &&
    readiness?.verdict !== READINESS_VERDICT.FIX &&
    connected &&
    configured &&
    settings.categoryId &&
    settings.merchantLocationKey &&
    settings.fulfillmentPolicyId &&
    settings.paymentPolicyId &&
    settings.returnPolicyId &&
    session.economics?.selling_price

  const onPublish = async () => {
    if (!session.human_approved) {
      toast.error(
        lang === 'de'
          ? 'Bitte zuerst menschlich freigeben.'
          : 'Approve the listing first.'
      )
      return
    }
    if (session.compliance?.publish_status === PUBLISH_STATUS.BLOCKED) {
      toast.error(
        lang === 'de'
          ? 'Compliance blockiert — nicht veröffentlichen.'
          : 'Compliance blocked — cannot publish.'
      )
      return
    }
    if (readiness?.verdict === READINESS_VERDICT.FIX) {
      toast.error(
        lang === 'de'
          ? 'Publish Readiness zu niedrig.'
          : 'Publish Readiness too low.'
      )
      return
    }

    setBusy(true)
    try {
      const payload = buildEbayPublishPayload({
        product: session.product,
        listing: session.listing,
        legal: session.legal,
        economics: session.economics,
        ebaySettings: settings,
        humanApproved: session.human_approved,
        complianceBlocked: session.compliance?.publish_status === PUBLISH_STATUS.BLOCKED,
      })
      const result = await publishListingToEbay(payload)
      setLastResult(result)
      onSettingsChange?.({
        lastListingId: result.listingId || '',
        lastOfferId: result.offerId || '',
        lastSku: result.sku || '',
      })
      toast.success(
        lang === 'de'
          ? `Auf eBay veröffentlicht${result.listingId ? ` (#${result.listingId})` : ''}`
          : `Published to eBay${result.listingId ? ` (#${result.listingId})` : ''}`
      )
    } catch (err) {
      const detail =
        Array.isArray(err?.details) && err.details[0]?.message
          ? err.details[0].message
          : err?.message
      toast.error(detail || (lang === 'de' ? 'Publish fehlgeschlagen' : 'Publish failed'))
    } finally {
      setBusy(false)
    }
  }

  const listingUrl =
    lastResult?.listingId || settings.lastListingId
      ? sandbox
        ? `https://www.sandbox.ebay.de/itm/${lastResult?.listingId || settings.lastListingId}`
        : `https://www.ebay.de/itm/${lastResult?.listingId || settings.lastListingId}`
      : null

  return (
    <div className="premium-card space-y-3 border border-brand-500/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-100">
            {lang === 'de' ? 'eBay OAuth Publish' : 'eBay OAuth publish'}
          </p>
          <p className="text-[11px] text-slate-500">
            {lang === 'de'
              ? 'Konto verbinden → Richtlinien wählen → nach Freigabe live stellen (EBAY_DE).'
              : 'Connect account → pick policies → publish to EBAY_DE after approval.'}
          </p>
        </div>
        {configured === false ? (
          <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] text-amber-200">
            {lang === 'de' ? 'Server nicht konfiguriert' : 'Server not configured'}
          </span>
        ) : sandbox ? (
          <span className="rounded-full bg-slate-700 px-2 py-1 text-[10px] text-slate-300">
            Sandbox
          </span>
        ) : null}
      </div>

      {configured === false ? (
        <p className="text-xs text-amber-200/90">
          {lang === 'de'
            ? 'Setze EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RU_NAME in der Server-.env (siehe .env.example). RuName-Callback: /api/ebay/oauth/callback'
            : 'Set EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RU_NAME in server .env (see .env.example). RuName callback: /api/ebay/oauth/callback'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {!connected ? (
            <button
              type="button"
              disabled={busy}
              onClick={onConnect}
              className="flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
              {lang === 'de' ? 'eBay verbinden' : 'Connect eBay'}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={loadPolicies}
                className="flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {lang === 'de' ? 'Richtlinien laden' : 'Load policies'}
              </button>
              <button
                type="button"
                onClick={onDisconnect}
                className="flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs text-rose-300"
              >
                <Unlink className="h-3.5 w-3.5" />
                {lang === 'de' ? 'Trennen' : 'Disconnect'}
              </button>
            </>
          )}
        </div>
      )}

      {connected && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'eBay Kategorie-ID' : 'eBay category ID'}
            <input
              value={settings.categoryId || ''}
              onChange={(e) => patch({ categoryId: e.target.value })}
              placeholder="z. B. 20716"
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'Menge' : 'Quantity'}
            <input
              value={settings.quantity || '1'}
              onChange={(e) => patch({ quantity: e.target.value })}
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-xs text-slate-400 sm:col-span-2">
            {lang === 'de' ? 'Lagerort (merchantLocationKey)' : 'Location (merchantLocationKey)'}
            {policies?.locations?.length ? (
              <select
                value={settings.merchantLocationKey || ''}
                onChange={(e) => patch({ merchantLocationKey: e.target.value })}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {policies.locations.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.name || l.key}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={settings.merchantLocationKey || ''}
                onChange={(e) => patch({ merchantLocationKey: e.target.value })}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
              />
            )}
          </label>

          {[
            ['fulfillmentPolicyId', 'Fulfillment', policies?.fulfillment],
            ['paymentPolicyId', 'Payment', policies?.payment],
            ['returnPolicyId', 'Return', policies?.return],
          ].map(([key, label, list]) => (
            <label key={key} className="block text-xs text-slate-400">
              {label}
              {list?.length ? (
                <select
                  value={settings[key] || ''}
                  onChange={(e) => patch({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {list.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.id}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={settings[key] || ''}
                  onChange={(e) => patch({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                />
              )}
            </label>
          ))}

          <label className="block text-xs text-slate-400 sm:col-span-2">
            {lang === 'de'
              ? 'Bild-URLs (https, eine pro Zeile — eBay akzeptiert nur öffentliche HTTPS-URLs)'
              : 'Image URLs (https, one per line — eBay needs public HTTPS URLs)'}
            <textarea
              rows={2}
              value={settings.imageUrlsText || ''}
              onChange={(e) => patch({ imageUrlsText: e.target.value })}
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
        </div>
      )}

      <p className="text-[11px] text-slate-500">
        {lang === 'de'
          ? `Preis aus Profit-Tab: ${session.economics?.selling_price || '—'} € · Freigabe: ${
              session.human_approved ? 'ja' : 'nein'
            }`
          : `Price from Profit tab: ${session.economics?.selling_price || '—'} € · Approved: ${
              session.human_approved ? 'yes' : 'no'
            }`}
      </p>

      <button
        type="button"
        disabled={busy || !canPublish}
        onClick={onPublish}
        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
        {lang === 'de' ? 'Auf eBay.de veröffentlichen' : 'Publish to eBay.de'}
      </button>

      {!canPublish && connected ? (
        <p className="text-[11px] text-amber-300/90">
          {lang === 'de'
            ? 'Benötigt: menschliche Freigabe, keine Compliance-Blocker, Kategorie, Lagerort, 3 Business Policies, Verkaufspreis.'
            : 'Needs: human approval, no compliance blocks, category, location, 3 business policies, selling price.'}
        </p>
      ) : null}

      {listingUrl ? (
        <a
          href={listingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-300 underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Listing auf eBay öffnen' : 'Open listing on eBay'}
          {(lastResult?.listingId || settings.lastListingId) &&
            ` (#${lastResult?.listingId || settings.lastListingId})`}
        </a>
      ) : null}
    </div>
  )
}
