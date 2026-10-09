import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Shield,
  RefreshCw,
  Trash2,
  Link2,
  Unlink,
  Download,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  PRODUCT_STATUS,
  loadCatalog,
  saveCatalog,
  upsertProducts,
  removeProducts,
  clearCatalogProducts,
  effectiveDailyCap,
  remainingPublishSlots,
  getDailyPublishUsage,
  importCsvText,
  importJsonText,
  SAMPLE_CSV,
  enrichAndPriceAll,
  approveProducts,
  rejectProducts,
  publishApprovedBatch,
  applyStockPriceUpdates,
  setKillSwitch,
  setLiveMode,
  canPublishProduct,
  rewriteCatalogGermanCopy,
} from '@/lib/listingengine/catalog'
import {
  connectEbayAccount,
  disconnectEbayAccount,
  fetchEbayPolicies,
  fetchEbayStatus,
  reviseEbayOffer,
} from '@/lib/listingengine/ebay/client'
import { isEbayConnected, loadEbayAuth } from '@/lib/listingengine/ebay/authStore'
import OrdersPanel from '@/components/bizstart/listing/OrdersPanel'
import CsInboxPanel from '@/components/bizstart/listing/CsInboxPanel'
import ResponsiveTabs from '@/components/layout/ResponsiveTabs'

function StatusPill({ status, lang }) {
  const map = {
    [PRODUCT_STATUS.IMPORTED]: 'bg-slate-700 text-slate-200',
    [PRODUCT_STATUS.PENDING_REVIEW]: 'bg-amber-500/20 text-amber-200',
    [PRODUCT_STATUS.NEEDS_ATTENTION]: 'bg-rose-500/20 text-rose-200',
    [PRODUCT_STATUS.APPROVED]: 'bg-emerald-500/20 text-emerald-200',
    [PRODUCT_STATUS.LISTED]: 'bg-brand-500/20 text-brand-200',
    [PRODUCT_STATUS.PAUSED]: 'bg-slate-600 text-slate-300',
    [PRODUCT_STATUS.ERROR]: 'bg-rose-600/30 text-rose-100',
    [PRODUCT_STATUS.REJECTED]: 'bg-slate-800 text-slate-400',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status] || 'bg-slate-700'}`}>
      {status}
    </span>
  )
}

export default function CatalogOpsPanel({ lang = 'de' }) {
  const [catalog, setCatalog] = useState(() => loadCatalog())
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('catalog') // catalog | orders | cs
  const [configured, setConfigured] = useState(null)
  const [connected, setConnected] = useState(isEbayConnected)
  const [sandbox, setSandbox] = useState(false)
  const [policies, setPolicies] = useState(null)

  const refresh = useCallback(() => {
    setCatalog(loadCatalog())
    setConnected(isEbayConnected())
  }, [])

  useEffect(() => {
    ;(async () => {
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
    })()
  }, [])

  const settings = catalog.settings
  const usage = getDailyPublishUsage()
  const cap = effectiveDailyCap(settings)
  const slots = remainingPublishSlots(settings)

  const filtered = useMemo(() => {
    let list = catalog.products
    if (filter === 'review') {
      list = list.filter((p) => p.status === PRODUCT_STATUS.PENDING_REVIEW)
    } else if (filter === 'approved') {
      list = list.filter((p) => p.status === PRODUCT_STATUS.APPROVED)
    } else if (filter === 'listed') {
      list = list.filter((p) => p.status === PRODUCT_STATUS.LISTED)
    } else if (filter === 'attention') {
      list = list.filter(
        (p) =>
          p.status === PRODUCT_STATUS.NEEDS_ATTENTION || p.status === PRODUCT_STATUS.ERROR
      )
    }
    return list
  }, [catalog.products, filter])

  const patchSettings = (partial) => {
    const next = saveCatalog({ settings: { ...settings, ...partial } })
    setCatalog(next)
  }

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const selectFiltered = () => {
    setSelected(new Set(filtered.map((p) => p.id)))
  }

  const onImportFile = async (file) => {
    if (!file) return
    setBusy(true)
    try {
      const text = await file.text()
      const isJson = /\.json$/i.test(file.name) || text.trim().startsWith('[') || text.trim().startsWith('{')
      const { products, errors } = isJson ? importJsonText(text) : importCsvText(text)
      if (!products.length) {
        toast.error(lang === 'de' ? 'Keine Produkte gefunden' : 'No products found')
        return
      }
      const next = upsertProducts(products)
      setCatalog(next)
      toast.success(
        lang === 'de'
          ? `${products.length} Produkte importiert${errors.length ? ` (${errors.length} Zeilenfehler)` : ''}`
          : `${products.length} products imported${errors.length ? ` (${errors.length} row errors)` : ''}`
      )
      if (errors.length) console.warn('Import row errors', errors)
    } catch (err) {
      toast.error(err?.message || (lang === 'de' ? 'Import fehlgeschlagen' : 'Import failed'))
    } finally {
      setBusy(false)
    }
  }

  const onLoadSample = () => {
    const { products } = importCsvText(SAMPLE_CSV)
    const next = upsertProducts(products)
    setCatalog(next)
    toast.success(lang === 'de' ? 'Beispiel-CSV geladen' : 'Sample CSV loaded')
  }

  const onEnrich = () => {
    setBusy(true)
    try {
      const ids = selected.size ? [...selected] : null
      const next = enrichAndPriceAll(ids)
      setCatalog(next)
      toast.success(lang === 'de' ? 'Preis & Policy geprüft' : 'Priced & policy-checked')
    } finally {
      setBusy(false)
    }
  }

  const onGermanCopy = async () => {
    if (!catalog.products.length) {
      toast.error(lang === 'de' ? 'Keine Produkte' : 'No products')
      return
    }
    setBusy(true)
    try {
      const ids = selected.size ? [...selected] : null
      const result = await rewriteCatalogGermanCopy({
        productIds: ids,
        mode: 'correct',
        language: lang,
        onProgress: ({ index, total, sku }) => {
          toast.message(`${index}/${total}: ${sku || '…'}`)
        },
      })
      setCatalog(result.catalog)
      toast.success(
        lang === 'de'
          ? `Deutsche Korrektur: ${result.rewritten} angepasst${result.errors.length ? `, ${result.errors.length} Fehler` : ''}`
          : `German correction: ${result.rewritten} updated${result.errors.length ? `, ${result.errors.length} errors` : ''}`
      )
      if (result.skipped) {
        toast.message(
          lang === 'de'
            ? `${result.skipped} übersprungen (Tageslimit)`
            : `${result.skipped} skipped (daily cap)`
        )
      }
    } catch (err) {
      toast.error(err?.message || (lang === 'de' ? 'Korrektur fehlgeschlagen' : 'Correction failed'))
    } finally {
      setBusy(false)
    }
  }

  const onApprove = () => {
    const ids = selected.size
      ? [...selected]
      : catalog.products
          .filter((p) => p.status === PRODUCT_STATUS.PENDING_REVIEW)
          .map((p) => p.id)
    if (!ids.length) {
      toast.error(lang === 'de' ? 'Nichts zum Freigeben' : 'Nothing to approve')
      return
    }
    const next = approveProducts(ids)
    setCatalog(next)
    setSelected(new Set())
    toast.success(lang === 'de' ? `${ids.length} freigegeben` : `${ids.length} approved`)
  }

  const onReject = () => {
    const ids = [...selected]
    if (!ids.length) return
    setCatalog(rejectProducts(ids))
    setSelected(new Set())
    toast.success(lang === 'de' ? 'Abgelehnt' : 'Rejected')
  }

  const onPublish = async () => {
    setBusy(true)
    try {
      const result = await publishApprovedBatch({ limit: Math.min(50, slots || 10) })
      refresh()
      if (result.published.length) {
        toast.success(
          lang === 'de'
            ? `${result.published.length} ${result.dryRun ? 'Dry-Run' : 'live'} veröffentlicht`
            : `${result.published.length} ${result.dryRun ? 'dry-run' : 'live'} published`
        )
      }
      if (result.errors.length) {
        toast.error(result.errors[0].message || 'Publish errors')
      }
      if (!result.published.length && !result.errors.length) {
        toast.message(lang === 'de' ? 'Keine freigegebenen Produkte' : 'No approved products')
      }
    } catch (err) {
      toast.error(err?.message || 'Publish failed')
    } finally {
      setBusy(false)
    }
  }

  const onSyncStock = async () => {
    setBusy(true)
    try {
      // Re-price from current costs; push qty/price to eBay for LISTED items
      const next = applyStockPriceUpdates(
        catalog.products.map((p) => ({
          supplier_sku: p.supplier_sku,
          stock_qty: p.stock_qty,
          supplier_cost: p.supplier_cost,
          shipping_cost: p.shipping_cost,
        }))
      )
      setCatalog(next)

      const dryRun = next.settings.dry_run || !next.settings.live_mode
      let synced = 0
      for (const p of next.products.filter((x) => x.status === PRODUCT_STATUS.LISTED && x.offer_id)) {
        try {
          await reviseEbayOffer({
            sku: p.ebay_sku || p.supplier_sku,
            offerId: p.offer_id,
            quantity: p.stock_qty,
            price: p.list_price,
            currency: next.settings.currency,
            dry_run: dryRun,
          })
          synced++
        } catch (err) {
          toast.error(`${p.supplier_sku}: ${err?.message || 'sync failed'}`)
        }
      }
      toast.success(
        lang === 'de'
          ? `Bestand/Preis aktualisiert (${synced}${dryRun ? ', dry-run' : ''})`
          : `Stock/price updated (${synced}${dryRun ? ', dry-run' : ''})`
      )
      refresh()
    } finally {
      setBusy(false)
    }
  }

  const loadPolicies = async () => {
    setBusy(true)
    try {
      const data = await fetchEbayPolicies()
      setPolicies(data)
      const patch = { ...settings }
      if (!patch.fulfillment_policy_id && data.fulfillment?.[0]?.id) {
        patch.fulfillment_policy_id = data.fulfillment[0].id
      }
      if (!patch.payment_policy_id && data.payment?.[0]?.id) {
        patch.payment_policy_id = data.payment[0].id
      }
      if (!patch.return_policy_id && data.return?.[0]?.id) {
        patch.return_policy_id = data.return[0].id
      }
      if (!patch.merchant_location_key && data.locations?.[0]?.key) {
        patch.merchant_location_key = data.locations[0].key
      }
      patchSettings(patch)
      toast.success(lang === 'de' ? 'Richtlinien geladen' : 'Policies loaded')
    } catch (err) {
      toast.error(err?.message || 'Policies failed')
    } finally {
      setBusy(false)
    }
  }

  const onConnect = async () => {
    setBusy(true)
    try {
      await connectEbayAccount()
      setConnected(true)
      toast.success(lang === 'de' ? 'eBay verbunden' : 'eBay connected')
      await loadPolicies()
    } catch (err) {
      toast.error(err?.message || 'Connect failed')
    } finally {
      setBusy(false)
    }
  }

  const counts = useMemo(() => {
    const c = { all: catalog.products.length, review: 0, approved: 0, listed: 0, attention: 0 }
    for (const p of catalog.products) {
      if (p.status === PRODUCT_STATUS.PENDING_REVIEW) c.review++
      if (p.status === PRODUCT_STATUS.APPROVED) c.approved++
      if (p.status === PRODUCT_STATUS.LISTED) c.listed++
      if (p.status === PRODUCT_STATUS.NEEDS_ATTENTION || p.status === PRODUCT_STATUS.ERROR) {
        c.attention++
      }
    }
    return c
  }, [catalog.products])

  return (
    <div className="w-full min-w-0 max-w-full space-y-4">
      <ResponsiveTabs
        tabs={[
          { id: 'catalog', de: 'Katalog', en: 'Catalog' },
          { id: 'orders', de: 'Bestellungen', en: 'Orders' },
          { id: 'cs', de: 'Kundenservice', en: 'Support' },
        ]}
        value={view}
        onChange={setView}
        lang={lang}
      />

      {view === 'orders' ? <OrdersPanel lang={lang} onOpenCs={() => setView('cs')} /> : null}
      {view === 'cs' ? <CsInboxPanel lang={lang} /> : null}

      {view === 'catalog' ? (
      <>
      <div className="premium-card space-y-3 border border-brand-500/25 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-100">
              {lang === 'de' ? 'Katalog → eBay (ListFlow)' : 'Catalog → eBay (ListFlow)'}
            </p>
            <p className="text-[11px] text-slate-500 sm:max-w-xl">
              {lang === 'de'
                ? 'CSV/JSON importieren · Preis & Policy · Review · Publish über offizielle Sell Inventory API. Standard: Dry-Run.'
                : 'Import CSV/JSON · price & policy · review · publish via official Sell Inventory API. Default: dry-run.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sandbox ? (
              <span className="rounded-full bg-slate-700 px-2 py-1 text-[10px] text-slate-300">
                Sandbox
              </span>
            ) : null}
            {settings.dry_run ? (
              <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] text-amber-200">
                Dry-Run
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-200">
                LIVE
              </span>
            )}
            {settings.kill_switch ? (
              <span className="rounded-full bg-rose-500/30 px-2 py-1 text-[10px] text-rose-100">
                Kill switch
              </span>
            ) : null}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          {lang === 'de'
            ? `Heute: ${usage.count}/${cap} · frei: ${slots} · Ramp: +${settings.ramp_step}/Tag bis ${settings.ramp_max}`
            : `Today: ${usage.count}/${cap} · left: ${slots} · Ramp: +${settings.ramp_step}/day up to ${settings.ramp_max}`}
        </p>

        <div className="stack-actions">
          {!connected ? (
            <button
              type="button"
              disabled={busy || configured === false}
              onClick={onConnect}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
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
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {lang === 'de' ? 'Richtlinien' : 'Policies'}
              </button>
              <button
                type="button"
                onClick={() => {
                  disconnectEbayAccount()
                  setConnected(false)
                }}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs text-rose-300"
              >
                <Unlink className="h-3.5 w-3.5" />
                {lang === 'de' ? 'Trennen' : 'Disconnect'}
              </button>
            </>
          )}
          <label className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs">
            <Upload className="h-3.5 w-3.5" />
            {lang === 'de' ? 'CSV/JSON' : 'CSV/JSON'}
            <input
              type="file"
              accept=".csv,.json,text/csv,application/json"
              className="hidden"
              onChange={(e) => onImportFile(e.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={onLoadSample}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Sample
          </button>
        </div>

        {configured === false ? (
          <p className="text-[11px] text-amber-200/90">
            {lang === 'de'
              ? 'Server: EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RU_NAME in .env setzen (EBAY_ENV=sandbox). Dry-Run funktioniert ohne.'
              : 'Server: set EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RU_NAME in .env (EBAY_ENV=sandbox). Dry-run works without.'}
          </p>
        ) : null}
      </div>

      {/* Settings */}
      <div className="premium-card space-y-3 p-3 sm:p-4">
        <p className="text-xs font-semibold text-slate-300">
          {lang === 'de' ? 'Publish-Einstellungen' : 'Publish settings'}
        </p>
        <div className="form-grid">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={!!settings.dry_run}
              onChange={(e) => {
                if (e.target.checked) setCatalog(setLiveMode(false))
                else {
                  if (
                    !window.confirm(
                      lang === 'de'
                        ? 'LIVE_MODE: echte eBay-Listings? Nur mit Freigabe und Sandbox-Test.'
                        : 'LIVE_MODE: real eBay listings? Only after sandbox testing.'
                    )
                  ) {
                    return
                  }
                  setCatalog(setLiveMode(true))
                }
                refresh()
              }}
            />
            Dry-Run (kein echtes Publish)
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={!!settings.kill_switch}
              onChange={(e) => {
                setCatalog(setKillSwitch(e.target.checked))
                refresh()
              }}
            />
            Kill switch (Publish pausieren)
          </label>
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'Tages-Cap' : 'Daily cap'}
            <input
              type="number"
              min={1}
              max={100}
              value={settings.daily_listing_cap}
              onChange={(e) => patchSettings({ daily_listing_cap: Number(e.target.value) || 10 })}
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'Min. Marge %' : 'Min margin %'}
            <input
              type="number"
              value={settings.min_margin_pct}
              onChange={(e) => patchSettings({ min_margin_pct: Number(e.target.value) || 15 })}
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'eBay Kategorie-ID (Default)' : 'Default eBay category ID'}
            <input
              value={settings.default_category_id || ''}
              onChange={(e) => patchSettings({ default_category_id: e.target.value })}
              placeholder="z. B. 20697"
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-400">
            merchantLocationKey
            {policies?.locations?.length ? (
              <select
                value={settings.merchant_location_key || ''}
                onChange={(e) => patchSettings({ merchant_location_key: e.target.value })}
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
                value={settings.merchant_location_key || ''}
                onChange={(e) => patchSettings({ merchant_location_key: e.target.value })}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
              />
            )}
          </label>
          {[
            ['fulfillment_policy_id', 'Fulfillment', policies?.fulfillment],
            ['payment_policy_id', 'Payment', policies?.payment],
            ['return_policy_id', 'Return', policies?.return],
          ].map(([key, label, list]) => (
            <label key={key} className="block text-xs text-slate-400">
              {label}
              {list?.length ? (
                <select
                  value={settings[key] || ''}
                  onChange={(e) => patchSettings({ [key]: e.target.value })}
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
                  onChange={(e) => patchSettings({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="stack-actions">
        <button
          type="button"
          disabled={busy || !catalog.products.length}
          onClick={onEnrich}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium disabled:opacity-40"
        >
          <Shield className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Anreichern & Preisen' : 'Enrich & price'}
        </button>
        <button
          type="button"
          disabled={busy || !catalog.products.length}
          onClick={onGermanCopy}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-violet-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {lang === 'de' ? 'Deutsche Kopie korrigieren' : 'Fix German copy'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Freigeben' : 'Approve'}
        </button>
        <button
          type="button"
          disabled={busy || !selected.size}
          onClick={onReject}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs text-rose-300 disabled:opacity-40"
        >
          <XCircle className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Ablehnen' : 'Reject'}
        </button>
        <button
          type="button"
          disabled={busy || settings.kill_switch || slots <= 0}
          onClick={onPublish}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          {lang === 'de' ? 'Publish Batch' : 'Publish batch'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onSyncStock}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs disabled:opacity-40"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Stock/Preis Sync' : 'Stock/price sync'}
        </button>
        <button
          type="button"
          disabled={busy || !catalog.products.length}
          onClick={() => {
            if (window.confirm(lang === 'de' ? 'Katalog leeren?' : 'Clear catalog?')) {
              setCatalog(clearCatalogProducts())
              setSelected(new Set())
            }
          }}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1">
        {[
          ['all', `Alle (${counts.all})`],
          ['review', `Review (${counts.review})`],
          ['approved', `Approved (${counts.approved})`],
          ['listed', `Listed (${counts.listed})`],
          ['attention', `Attention (${counts.attention})`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] ${
              filter === id ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={selectFiltered}
          className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-400"
        >
          {lang === 'de' ? 'Sichtbare wählen' : 'Select visible'}
        </button>
      </div>

      {/* Product list / review queue */}
      <div className="space-y-2">
        {!filtered.length ? (
          <div className="premium-card p-6 text-center text-sm text-slate-500">
            {lang === 'de'
              ? 'Noch keine Produkte — CSV importieren oder Sample laden.'
              : 'No products yet — import CSV or load sample.'}
          </div>
        ) : (
          filtered.map((p) => {
            const gate = canPublishProduct(p, settings)
            return (
              <div
                key={p.id}
                className="premium-card flex flex-col gap-3 p-3 sm:flex-row sm:items-start"
              >
                <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="mt-1 h-5 w-5 shrink-0"
                  aria-label={p.title || p.supplier_sku}
                />
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover bg-slate-800 sm:h-14 sm:w-14"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[10px] text-slate-500 sm:h-14 sm:w-14">
                    no img
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1 sm:hidden">
                  <StatusPill status={p.status} lang={lang} />
                  <p className="line-clamp-2 text-sm font-medium text-slate-100">{p.title || '—'}</p>
                </div>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="hidden flex-wrap items-center gap-2 sm:flex">
                    <StatusPill status={p.status} lang={lang} />
                    <span className="truncate text-sm font-medium text-slate-100">{p.title || '—'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    SKU {p.supplier_sku} · {p.list_price ? `${p.list_price} €` : '—'} ·{' '}
                    {p.expected_profit != null
                      ? `Profit ${p.expected_profit.toFixed(2)} € (${p.expected_margin_pct}%)`
                      : 'nicht gepreist'}{' '}
                    · Stock {p.stock_qty}
                    {p.listing_id ? ` · #${p.listing_id}` : ''}
                  </p>
                  {p.policy_flags?.length ? (
                    <p className="text-[10px] text-amber-300/90">
                      <AlertTriangle className="mr-1 inline h-3 w-3" />
                      {p.policy_flags.join(' · ')}
                    </p>
                  ) : null}
                  {p.last_error ? (
                    <p className="text-[10px] text-rose-300">{p.last_error}</p>
                  ) : null}
                  {!gate.ok && p.status === PRODUCT_STATUS.APPROVED ? (
                    <p className="text-[10px] text-amber-200">
                      Block: {gate.reasons.join(', ')}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <label className="text-[10px] text-slate-500">
                      Cat
                      <input
                        value={p.category_id || ''}
                        onChange={(e) => {
                          const next = saveCatalog({
                            products: catalog.products.map((x) =>
                              x.id === p.id ? { ...x, category_id: e.target.value } : x
                            ),
                          })
                          setCatalog(next)
                        }}
                        className="ml-1 min-h-[36px] w-24 rounded bg-slate-900 px-2 py-1 text-sm"
                      />
                    </label>
                    <label className="text-[10px] text-slate-500">
                      Preis
                      <input
                        value={p.list_price || ''}
                        onChange={(e) => {
                          const next = saveCatalog({
                            products: catalog.products.map((x) =>
                              x.id === p.id ? { ...x, list_price: e.target.value } : x
                            ),
                          })
                          setCatalog(next)
                        }}
                        className="ml-1 min-h-[36px] w-20 rounded bg-slate-900 px-2 py-1 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      className="min-h-[36px] px-2 text-xs text-rose-400"
                      onClick={() => {
                        setCatalog(removeProducts([p.id]))
                        setSelected((s) => {
                          const n = new Set(s)
                          n.delete(p.id)
                          return n
                        })
                      }}
                    >
                      {lang === 'de' ? 'Löschen' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {catalog.publish_log?.length ? (
        <div className="premium-card space-y-2 p-4">
          <p className="text-xs font-semibold text-slate-300">
            {lang === 'de' ? 'Publish-Log (letzte)' : 'Recent publish log'}
          </p>
          <ul className="max-h-40 space-y-1 overflow-y-auto text-[10px] text-slate-500">
            {[...catalog.publish_log].reverse().slice(0, 20).map((e, i) => (
              <li key={`${e.at}-${i}`}>
                {e.at?.slice(11, 19)} · {e.sku} · {e.ok ? 'OK' : 'ERR'}
                {e.dry_run ? ' (dry)' : ''} {e.listing_id || e.error || ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="flex items-start gap-2 text-[11px] text-slate-500">
        <Pause className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {lang === 'de'
          ? 'Nur lizenzierte Lieferanten-Feeds. Kein Auto-Publish ohne Freigabe. Selling Limits und Dropshipping-Regeln von eBay beachten.'
          : 'Licensed supplier feeds only. No auto-publish without approval. Respect eBay selling limits and dropshipping rules.'}
      </p>
      </>
      ) : null}
    </div>
  )
}
