import { ExternalLink, ShieldAlert } from 'lucide-react'
import { KDP_PLAN_TO_WIN_CONFIG } from '@/lib/bizstart/amazon/kdpPlanToWinConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** Five-pillar KDP Plan to Win — niche → product → SEO → launch → brand. */
export default function PlanToWinPanel({ lang = 'en', onOpenPlaybook }) {
  const cfg = KDP_PLAN_TO_WIN_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'planToWinMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'planToWinChain')}>
        <p className="text-xs font-medium leading-relaxed text-brand-100">{L(cfg.chain)}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">{L(cfg.intro)}</p>
      </ConfigBlock>

      {cfg.pillars.map((pillar) => (
        <ConfigBlock
          key={pillar.id}
          title={`${pillar.number}. ${L(pillar.title)}`}
        >
          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
            {(pillar.bullets[lang] || pillar.bullets.en).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {pillar.phases?.length ? (
            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-800/80">
              <table className="w-max min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                      {amazonT(lang, 'planToWinPhase')}
                    </th>
                    <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                      {amazonT(lang, 'tableDetail')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pillar.phases.map((row) => (
                    <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                      <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                        {L(row.label)}
                      </td>
                      <td className="max-w-[18rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </ConfigBlock>
      ))}

      <ConfigBlock title={amazonT(lang, 'planToWinMatrix')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'planToWinMetric')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'planToWinWeak')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'planToWinWinning')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.executionMatrix.map((row) => (
                <tr key={row.metric.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.metric)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-500">{L(row.weak)}</td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-300">{L(row.winning)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <div className="flex flex-wrap gap-2">
        {cfg.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {link.label}
          </a>
        ))}
        {onOpenPlaybook
          ? cfg.relatedHubGuides.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onOpenPlaybook(g.id)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
              >
                {L(g.label)}
              </button>
            ))
          : null}
      </div>
    </div>
  )
}

function ConfigBlock({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  )
}
