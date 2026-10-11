import { ExternalLink, ShieldAlert } from 'lucide-react'
import { PUBLISHER_TRUTHS_CONFIG } from '@/lib/bizstart/amazon/publisherTruthsConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** Critical first-time publisher truths — ecosystem, distribution, DE rights/tax, timeline. */
export default function PublisherTruthsPanel({
  lang = 'en',
  onOpenStoryforge,
  onOpenAuthorforge,
  onOpenPlaybook,
}) {
  const cfg = PUBLISHER_TRUTHS_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'publisherTruthsMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {onOpenStoryforge ? (
          <button
            type="button"
            onClick={() => onOpenStoryforge('studio')}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white sm:w-auto"
          >
            {amazonT(lang, 'publisherTruthsSfCta')}
          </button>
        ) : null}
        {onOpenAuthorforge ? (
          <button
            type="button"
            onClick={() => onOpenAuthorforge()}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-4 text-sm font-semibold text-brand-100 sm:w-auto"
          >
            {amazonT(lang, 'publisherTruthsAfCta')}
          </button>
        ) : null}
        {onOpenPlaybook ? (
          <button
            type="button"
            onClick={() => onOpenPlaybook('merch-ops')}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 px-4 text-sm font-semibold text-slate-100 sm:w-auto"
          >
            {amazonT(lang, 'publisherTruthsMerchCta')}
          </button>
        ) : null}
        {onOpenPlaybook ? (
          <button
            type="button"
            onClick={() => onOpenPlaybook('tax-de')}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 px-4 text-sm font-semibold text-slate-100 sm:w-auto"
          >
            {amazonT(lang, 'publisherTruthsTaxCta')}
          </button>
        ) : null}
      </div>

      {cfg.truths.map((truth) => (
        <ConfigBlock
          key={truth.id}
          title={`${truth.number}. ${L(truth.title)}`}
        >
          {truth.lead ? (
            <p className="mb-2 text-xs leading-relaxed text-slate-300">{L(truth.lead)}</p>
          ) : null}

          {truth.bullets?.[lang]?.length || truth.bullets?.en?.length ? (
            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(truth.bullets[lang] || truth.bullets.en).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}

          {truth.rows?.length ? (
            <ul className="mt-2 space-y-2">
              {truth.rows.map((row) => (
                <li
                  key={row.platform}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-slate-100">{row.platform}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{L(row.adds)}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {truth.pricing?.length ? (
            <ul className="mt-2 space-y-2">
              {truth.pricing.map((row) => (
                <li
                  key={L(row.product)}
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
                >
                  <span className="text-xs text-slate-300">{L(row.product)}</span>
                  <span className="shrink-0 text-xs font-semibold text-brand-200">{row.range}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {truth.timeline?.length ? (
            <ol className="mt-2 space-y-2">
              {truth.timeline.map((row) => (
                <li
                  key={L(row.when)}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-300">
                    {L(row.when)}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{L(row.what)}</p>
                </li>
              ))}
            </ol>
          ) : null}

          {truth.appHooks ? (
            <p className="mt-2 text-xs leading-relaxed text-brand-100/90">{L(truth.appHooks)}</p>
          ) : null}

          {truth.hubGuideId && onOpenPlaybook ? (
            <button
              type="button"
              onClick={() => onOpenPlaybook(truth.hubGuideId)}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
            >
              {amazonT(lang, 'publisherTruthsOpenGuide')}
            </button>
          ) : null}

          {truth.note ? (
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">{L(truth.note)}</p>
          ) : null}

          {truth.links?.length ? (
            <ul className="mt-2 space-y-1">
              {truth.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </ConfigBlock>
      ))}

      <ConfigBlock title={amazonT(lang, 'publisherTruthsClosing')}>
        <p className="text-xs leading-relaxed text-slate-200">{L(cfg.closing)}</p>
      </ConfigBlock>
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
