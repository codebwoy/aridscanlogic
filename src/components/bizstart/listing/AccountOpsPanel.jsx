import { useCallback, useEffect, useState } from 'react'
import {
  Loader2,
  RefreshCw,
  ShieldAlert,
  Package,
  Undo2,
  Ban,
  CheckCircle2,
  XCircle,
  FileText,
  Bell,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchEbayPrivileges,
  fetchEbayStandards,
  fetchEbayReturns,
  fetchEbayCancellations,
  fetchEbayOffers,
  endEbayOffer,
  fetchEbayCoverage,
} from '@/lib/listingengine/ebay/client'
import { isEbayConnected } from '@/lib/listingengine/ebay/authStore'
import { loadCatalog, saveCatalog } from '@/lib/listingengine/catalog'
import { suggestCategoriesForCatalog } from '@/lib/listingengine/catalog'
import {
  buildDailyReport,
  formatDailyReportText,
  sendDailySummary,
  requestBrowserNotifyPermission,
} from '@/lib/listingengine/ops'

function money(limit) {
  if (!limit?.amount) return null
  const a = limit.amount
  return `${a.value ?? a} ${a.currency || 'EUR'}`
}

export default function AccountOpsPanel({ lang = 'de', onCatalogRefresh }) {
  const [busy, setBusy] = useState(false)
  const [privileges, setPrivileges] = useState(null)
  const [standards, setStandards] = useState(null)
  const [returns, setReturns] = useState([])
  const [cancellations, setCancellations] = useState([])
  const [offers, setOffers] = useState([])
  const [coverage, setCoverage] = useState(null)
  const [errors, setErrors] = useState({})
  const [settings, setSettings] = useState(() => loadCatalog().settings || {})
  const [reportText, setReportText] = useState('')

  const dryRun = settings.dry_run !== false

  const patchSettings = (partial) => {
    const next = saveCatalog({ settings: { ...loadCatalog().settings, ...partial } })
    setSettings(next.settings)
    onCatalogRefresh?.()
  }

  const loadAll = useCallback(async () => {
    if (!isEbayConnected()) {
      toast.error(lang === 'de' ? 'Zuerst eBay verbinden (Katalog)' : 'Connect eBay first')
      return
    }
    setBusy(true)
    const nextErrors = {}
    try {
      try {
        setPrivileges(await fetchEbayPrivileges())
      } catch (e) {
        nextErrors.privileges = e.message
      }
      try {
        setStandards(await fetchEbayStandards({ program: 'PROGRAM_DE' }))
      } catch (e) {
        nextErrors.standards = e.message
      }
      try {
        const r = await fetchEbayReturns({ limit: 25 })
        setReturns(r.returns || [])
      } catch (e) {
        nextErrors.returns = e.message
      }
      try {
        const c = await fetchEbayCancellations({ limit: 25 })
        setCancellations(c.cancellations || [])
      } catch (e) {
        nextErrors.cancellations = e.message
      }
      try {
        const o = await fetchEbayOffers({ limit: 50 })
        setOffers(o.offers || [])
      } catch (e) {
        nextErrors.offers = e.message
      }
      try {
        setCoverage(await fetchEbayCoverage())
      } catch {
        /* optional */
      }
      setErrors(nextErrors)
      toast.success(lang === 'de' ? 'Konto-Daten aktualisiert' : 'Account data refreshed')
    } finally {
      setBusy(false)
    }
  }, [lang])

  useEffect(() => {
    fetchEbayCoverage()
      .then(setCoverage)
      .catch(() => {})
  }, [])

  const onSuggestCategories = async () => {
    setBusy(true)
    try {
      const result = await suggestCategoriesForCatalog({ onlyMissing: true })
      onCatalogRefresh?.()
      toast.success(
        lang === 'de'
          ? `${result.updated} Kategorien vorgeschlagen`
          : `${result.updated} categories suggested`
      )
      if (result.errors?.length) {
        toast.message(`${result.errors.length} ohne Treffer`)
      }
    } catch (err) {
      toast.error(err?.message || 'Category suggest failed')
    } finally {
      setBusy(false)
    }
  }

  const onShowReport = () => {
    const text = formatDailyReportText(buildDailyReport(), lang)
    setReportText(text)
  }

  const onSendReport = async () => {
    setBusy(true)
    try {
      const result = await sendDailySummary(lang)
      setReportText(result.text)
      toast.success(
        lang === 'de'
          ? 'Tagesbericht gesendet / angezeigt'
          : 'Daily report sent / shown'
      )
      if (result.notify?.telegram && !result.notify.telegram.ok && !result.notify.telegram.skipped) {
        toast.message(result.notify.telegram.reason || 'Telegram failed')
      }
    } catch (err) {
      toast.error(err?.message || 'Report failed')
    } finally {
      setBusy(false)
    }
  }

  const onEnableBrowserNotify = async () => {
    const perm = await requestBrowserNotifyPermission()
    toast.message(String(perm))
  }

  const onEndOffer = async (offerId) => {
    if (
      !dryRun &&
      !window.confirm(lang === 'de' ? 'Listing wirklich beenden?' : 'Really end this listing?')
    ) {
      return
    }
    setBusy(true)
    try {
      await endEbayOffer({ offerId, dry_run: dryRun })
      toast.success(
        dryRun
          ? lang === 'de'
            ? 'Dry-Run: Ende simuliert'
            : 'Dry-run: end simulated'
          : lang === 'de'
            ? 'Angebot beendet'
            : 'Offer ended'
      )
      const o = await fetchEbayOffers({ limit: 50 })
      setOffers(o.offers || [])
    } catch (err) {
      toast.error(err?.message || 'End failed')
    } finally {
      setBusy(false)
    }
  }

  const profile = standards?.standardsProfiles?.[0]

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="premium-card space-y-3 border border-brand-500/25 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {lang === 'de' ? 'eBay-Konto & Automation' : 'eBay account & automation'}
            </p>
            <p className="text-[11px] text-slate-500 sm:max-w-xl">
              {lang === 'de'
                ? 'Limits, Verkäuferstandards, Returns, Stornos, Live-Angebote, Kategorie-Vorschläge — nur offizielle APIs. Kein 100%-Autopilot.'
                : 'Limits, seller standards, returns, cancellations, live offers, category suggestions — official APIs only. Not 100% autopilot.'}
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={loadAll}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Sync
          </button>
        </div>
        {dryRun ? (
          <p className="text-[10px] text-amber-300/90">
            Dry-Run aktiv — „Angebot beenden“ wird nicht live ausgeführt.
          </p>
        ) : null}
      </div>

      {/* Coverage honesty */}
      {coverage ? (
        <div className="premium-card space-y-2 p-3 sm:p-4">
          <p className="text-xs font-semibold text-slate-300">
            {lang === 'de' ? 'Was automatisiert ist' : 'What is automated'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ul className="space-y-1 text-[11px] text-emerald-300/90">
              {(coverage.automated || []).map((k) => (
                <li key={k} className="flex gap-1.5">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                  {k}
                </li>
              ))}
            </ul>
            <ul className="space-y-1 text-[11px] text-slate-500">
              {(coverage.not_automated || []).map((k) => (
                <li key={k} className="flex gap-1.5">
                  <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-slate-600" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[10px] text-slate-500">{coverage.note}</p>
        </div>
      ) : null}

      {/* Privileges */}
      <div className="premium-card space-y-2 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <ShieldAlert className="h-4 w-4 text-brand-300" />
          {lang === 'de' ? 'Verkaufslimits' : 'Selling limits'}
        </div>
        {errors.privileges ? (
          <p className="text-[11px] text-rose-300">{errors.privileges}</p>
        ) : privileges?.sellingLimit ? (
          <p className="text-xs text-slate-300">
            {lang === 'de' ? 'Menge' : 'Quantity'}:{' '}
            <strong>{privileges.sellingLimit.quantity ?? '—'}</strong>
            {' · '}
            {lang === 'de' ? 'Wert' : 'Amount'}:{' '}
            <strong>{money(privileges.sellingLimit) || '—'}</strong>
          </p>
        ) : (
          <p className="text-[11px] text-slate-500">
            {lang === 'de' ? 'Sync tippen oder Limits unbegrenzt / nicht geliefert.' : 'Tap Sync or limits unlimited / not returned.'}
          </p>
        )}
      </div>

      {/* Standards */}
      <div className="premium-card space-y-2 p-3 sm:p-4">
        <p className="text-xs font-semibold text-slate-300">
          {lang === 'de' ? 'Verkäuferstandards' : 'Seller standards'}
        </p>
        {errors.standards ? (
          <p className="text-[11px] text-amber-200">
            {errors.standards}
            <span className="mt-1 block text-slate-500">
              {lang === 'de'
                ? 'Tipp: eBay trennen & neu verbinden (Analytics-Scope).'
                : 'Tip: disconnect & reconnect eBay (analytics scope).'}
            </span>
          </p>
        ) : profile ? (
          <div className="text-xs text-slate-300">
            <p>
              Level: <strong>{profile.standardsLevel || profile.defaultProgram || '—'}</strong>
              {profile.evaluationCycle?.evaluationDate
                ? ` · Eval ${String(profile.evaluationCycle.evaluationDate).slice(0, 10)}`
                : ''}
            </p>
            {Array.isArray(profile.metrics) && profile.metrics.length ? (
              <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                {profile.metrics.slice(0, 8).map((m) => (
                  <li key={m.metricKey || m.name}>
                    {m.metricKey || m.name}: {m.value ?? m.metricValue ?? '—'}
                    {m.level != null ? ` (${m.level})` : ''}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">{lang === 'de' ? 'Noch nicht geladen.' : 'Not loaded yet.'}</p>
        )}
      </div>

      <div className="stack-actions">
        <button
          type="button"
          disabled={busy}
          onClick={onSuggestCategories}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-violet-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          <Package className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Kategorien vorschlagen' : 'Suggest categories'}
        </button>
      </div>

      {/* Daily report + notifications */}
      <div className="premium-card space-y-3 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <FileText className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Tagesbericht & Benachrichtigungen' : 'Daily report & notifications'}
        </div>
        <div className="form-grid">
          <label className="block text-xs text-slate-400 sm:col-span-2">
            Telegram webhook URL
            <input
              value={settings.telegram_webhook_url || ''}
              onChange={(e) => patchSettings({ telegram_webhook_url: e.target.value })}
              placeholder="https://api.telegram.org/bot…/sendMessage"
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-400">
            Telegram chat_id
            <input
              value={settings.telegram_chat_id || ''}
              onChange={(e) => patchSettings({ telegram_chat_id: e.target.value })}
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={settings.notify_on_publish !== false}
              onChange={(e) => patchSettings({ notify_on_publish: e.target.checked })}
            />
            {lang === 'de' ? 'Bei Publish' : 'On publish'}
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={settings.notify_on_handling_alert !== false}
              onChange={(e) => patchSettings({ notify_on_handling_alert: e.target.checked })}
            />
            {lang === 'de' ? 'Handling-Frist' : 'Handling alerts'}
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={settings.notify_daily_summary !== false}
              onChange={(e) => patchSettings({ notify_daily_summary: e.target.checked })}
            />
            {lang === 'de' ? 'Tagesbericht' : 'Daily summary'}
          </label>
        </div>
        <div className="stack-actions">
          <button
            type="button"
            disabled={busy}
            onClick={onShowReport}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            {lang === 'de' ? 'Bericht anzeigen' : 'Show report'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onSendReport}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
            {lang === 'de' ? 'Senden / Notify' : 'Send / notify'}
          </button>
          <button
            type="button"
            onClick={onEnableBrowserNotify}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
          >
            <Bell className="h-3.5 w-3.5" />
            Browser Notify
          </button>
        </div>
        {reportText ? (
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-900/60 p-2 text-[11px] text-slate-300">
            {reportText}
          </pre>
        ) : null}
      </div>

      {/* Returns */}
      <div className="premium-card space-y-2 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Undo2 className="h-3.5 w-3.5" />
          {lang === 'de' ? `Rückgaben (${returns.length})` : `Returns (${returns.length})`}
        </div>
        {errors.returns ? (
          <p className="text-[11px] text-rose-300">{errors.returns}</p>
        ) : !returns.length ? (
          <p className="text-[11px] text-slate-500">{lang === 'de' ? 'Keine offenen Returns (oder Sync).' : 'No returns (or sync).'}</p>
        ) : (
          <ul className="max-h-48 space-y-2 overflow-y-auto text-[11px] text-slate-400">
            {returns.map((r) => (
              <li key={r.returnId} className="rounded-lg bg-slate-900/50 px-2 py-1.5">
                #{r.returnId} · {r.currentState || '—'} · {r.buyerLoginName || '—'}
                {r.reason ? ` · ${r.reason}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cancellations */}
      <div className="premium-card space-y-2 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Ban className="h-3.5 w-3.5" />
          {lang === 'de'
            ? `Stornos (${cancellations.length})`
            : `Cancellations (${cancellations.length})`}
        </div>
        {errors.cancellations ? (
          <p className="text-[11px] text-rose-300">{errors.cancellations}</p>
        ) : !cancellations.length ? (
          <p className="text-[11px] text-slate-500">
            {lang === 'de' ? 'Keine Stornos (oder Sync).' : 'No cancellations (or sync).'}
          </p>
        ) : (
          <ul className="max-h-40 space-y-2 overflow-y-auto text-[11px] text-slate-400">
            {cancellations.map((c) => (
              <li key={c.cancelId} className="rounded-lg bg-slate-900/50 px-2 py-1.5">
                #{c.cancelId} · {c.cancelState || '—'} · {c.cancelReason || '—'}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Live offers */}
      <div className="premium-card space-y-2 p-3 sm:p-4">
        <p className="text-xs font-semibold text-slate-300">
          {lang === 'de' ? `Live-Angebote (${offers.length})` : `Live offers (${offers.length})`}
        </p>
        {errors.offers ? (
          <p className="text-[11px] text-rose-300">{errors.offers}</p>
        ) : !offers.length ? (
          <p className="text-[11px] text-slate-500">{lang === 'de' ? 'Keine Angebote (oder Sync).' : 'No offers (or sync).'}</p>
        ) : (
          <ul className="max-h-56 space-y-2 overflow-y-auto">
            {offers.map((o) => (
              <li
                key={o.offerId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900/50 px-2 py-2 text-[11px] text-slate-300"
              >
                <span className="min-w-0 truncate">
                  {o.sku} · {o.status} · {o.listingId ? `#${o.listingId}` : o.offerId}
                  {o.price ? ` · ${o.price.value} ${o.price.currency}` : ''}
                </span>
                {o.status === 'PUBLISHED' || o.status === 'Published' ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onEndOffer(o.offerId)}
                    className="min-h-[36px] rounded-lg bg-rose-900/40 px-2 text-[10px] text-rose-200"
                  >
                    {lang === 'de' ? 'Beenden' : 'End'}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
