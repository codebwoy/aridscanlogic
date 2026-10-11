import { ExternalLink, ShieldAlert } from 'lucide-react'
import { MERCH_CONFIG, merchFileSpecSummary } from '@/lib/bizstart/amazon/merchConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/**
 * Config-backed Merch tables (tiers, specs, products, pricing example).
 * Shown inside the Merch playbook — numbers are estimates with ⚠ notes.
 */
export default function MerchConfigPanel({ lang = 'en', onOpenStoryforge }) {
  const cfg = MERCH_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  function openStudio() {
    if (onOpenStoryforge) {
      onOpenStoryforge('studio')
      return
    }
    const result = launchStoryforgeDesktop({ view: 'studio' })
    if (result.opened) return
    if (result.reason === 'mobile') toast.message(amazonT(lang, 'storyforgeMobile'))
    else toast.error(amazonT(lang, 'storyforgePopupBlocked'))
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'merchConfigMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      {/* File specs */}
      <ConfigBlock title={amazonT(lang, 'merchFileSpecs')}>
        <p className="text-xs leading-relaxed text-slate-300">{merchFileSpecSummary(lang)}</p>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.fileSpecs.note)}</p>
        <button
          type="button"
          onClick={openStudio}
          className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
        >
          {amazonT(lang, 'merchStoryforgeCta')}
        </button>
      </ConfigBlock>

      {/* Tiers */}
      <ConfigBlock title={amazonT(lang, 'merchTiers')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">{amazonT(lang, 'merchColTier')}</th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColDesigns')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColUnlock')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.tiers.rows.map((row) => (
                <tr key={row.tier} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">{row.tier}</td>
                  <td className="px-2.5 py-2 text-slate-400">{row.designs}</td>
                  <td className="px-2.5 py-2 text-slate-400">{L(row.unlock)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.tiers.verifiedNote)}</p>
      </ConfigBlock>

      {/* Products */}
      <ConfigBlock title={amazonT(lang, 'merchProducts')}>
        <ol className="mb-2 list-decimal space-y-0.5 pl-4 text-xs text-slate-300">
          {cfg.products.kidsBrandPriority[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColProduct')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColRoyalty')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColBestFor')}
                </th>
              </tr>
            </thead>
            <tbody>
              {[...cfg.products.rows]
                .sort((a, b) => a.priority - b.priority)
                .map((row) => (
                  <tr key={row.product.en} className="border-b border-slate-800/80 last:border-0">
                    <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                      {L(row.product)}
                    </td>
                    <td className="px-2.5 py-2 text-slate-400">{L(row.royalty)}</td>
                    <td className="max-w-[12rem] px-2.5 py-2 text-slate-400">{L(row.bestFor)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.products.verifiedNote)}</p>
      </ConfigBlock>

      {/* Pricing example */}
      <ConfigBlock title={amazonT(lang, 'merchPricingExample')}>
        <p className="mb-2 text-xs text-slate-400">
          {cfg.pricingExample.marketplace} · {L(cfg.pricingExample.product)}
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <tbody>
              {cfg.pricingExample.rows.map((row) => (
                <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.label)}
                  </td>
                  <td className="px-2.5 py-2 text-slate-400">{L(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          {L(cfg.pricingExample.marketPriceBand)}
        </p>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.pricingExample.verifiedNote)}</p>
      </ConfigBlock>

      {/* Design tools */}
      <ConfigBlock title={amazonT(lang, 'merchDesignTools')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColTool')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColCost')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'merchColBestFor')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.designTools.rows.map((row) => (
                <tr key={row.tool} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">{row.tool}</td>
                  <td className="px-2.5 py-2 text-slate-400">{L(row.cost)}</td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.bestFor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.designTools.verifiedNote)}</p>
      </ConfigBlock>

      {/* Listing example */}
      <ConfigBlock title={amazonT(lang, 'merchListingExample')}>
        <p className="text-xs font-medium leading-relaxed text-slate-200">
          {L(cfg.listingExample.title)}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
          {cfg.listingExample.bullets[lang]?.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'merchListingTips')}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-slate-300">
          {cfg.listingExample.tips[lang]?.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </ConfigBlock>

      {/* Business plan template */}
      <ConfigBlock title={amazonT(lang, 'merchBizPlan')}>
        <p className="mb-2 text-xs text-slate-400">
          {amazonT(lang, 'merchBizPlanIntro')} {L(cfg.businessPlanTemplate.brandPlaceholder)}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-300">
          {cfg.businessPlanTemplate.fields[lang]?.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </ConfigBlock>

      <a
        href={cfg.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white sm:w-auto"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        {amazonT(lang, 'merchApplyCta')}
      </a>
      <p className="text-[11px] leading-relaxed text-amber-100/80">{L(cfg.applyNote)}</p>
    </div>
  )
}

function ConfigBlock({ title, children }) {
  return (
    <div className="space-y-2 rounded-lg border border-slate-800/80 bg-slate-950/30 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {children}
    </div>
  )
}
