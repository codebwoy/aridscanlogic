import { ExternalLink, ShieldAlert } from 'lucide-react'
import { KDP_NICHE_RESEARCH_CONFIG } from '@/lib/bizstart/amazon/kdpNicheResearchConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** KDP niche research playbook — free methods first; BSR/revenue estimates ⚠. */
export default function NicheResearchPanel({ lang = 'en' }) {
  const cfg = KDP_NICHE_RESEARCH_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'nicheResearchMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'nicheResearchRule')}>
        <p className="text-xs font-medium leading-relaxed text-slate-200">{L(cfg.goldenRule)}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{L(cfg.timeBudget)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step1.heading)}>
        <ul className="space-y-3">
          {cfg.step1.methods.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(m.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {m.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step2.heading)}>
        <p className="mb-2 text-xs leading-relaxed text-slate-300">{L(cfg.step2.intro)}</p>
        <p className="mb-2 text-[11px] leading-relaxed text-slate-400">{L(cfg.step2.howBsr)}</p>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColCheck')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColLook')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColWhy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.step2.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[10rem] px-2.5 py-2 font-medium text-slate-200">
                    {L(row.check)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.lookFor)}</td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.why)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-100/80">{L(cfg.step2.note)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step3.heading)}>
        <p className="mb-2 text-xs leading-relaxed text-slate-300">{L(cfg.step3.intro)}</p>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColBsr')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColSales')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.step3.rows.map((row) => (
                <tr key={row.bsr.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.bsr)}
                  </td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">{L(row.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-100/80">{L(cfg.step3.royaltyNote)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step4.heading)}>
        <ul className="space-y-2">
          {cfg.step4.lights.map((light) => (
            <li
              key={light.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(light.label)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {light.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step5.heading)}>
        <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.step5.freeMethods[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(cfg.step5.bilingualPatterns.heading)}
        </p>
        <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.step5.bilingualPatterns.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-amber-100/80">{L(cfg.step5.paidNote)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.step6.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.step6.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.toolsTable.heading)}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColTool')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColCost')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'nicheResearchColBest')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.toolsTable.rows.map((row) => (
                <tr key={row.tool.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-200 hover:underline"
                      >
                        {L(row.tool)}
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                      </a>
                    ) : (
                      L(row.tool)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.cost)}</td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">{L(row.bestFor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      {cfg.bookBeam ? (
        <ConfigBlock title={L(cfg.bookBeam.heading)}>
          <p className="text-xs leading-relaxed text-slate-300">{L(cfg.bookBeam.tagline)}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
            {L(cfg.bookBeam.verifiedNote)}
          </p>
          {[
            cfg.bookBeam.research,
            cfg.bookBeam.keywords,
            cfg.bookBeam.trackOptimize,
            cfg.bookBeam.production,
            cfg.bookBeam.freeTools,
          ].map((block) => (
            <div key={block.heading.en} className="mt-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {L(block.heading)}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {block.items[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {amazonT(lang, 'nicheResearchWhen')}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
            {cfg.bookBeam.whenToUse[lang]?.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a
            href={cfg.bookBeam.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {L(cfg.bookBeam.urlLabel)}
          </a>
        </ConfigBlock>
      ) : null}

      <ConfigBlock title={L(cfg.bilingualWorkflow.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.bilingualWorkflow.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.studyGuides.heading)}>
        <p className="mb-1.5 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.studyGuides.note)}</p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.studyGuides.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'nicheResearchTakeaway')}>
        <p className="text-xs font-medium leading-relaxed text-slate-200">{L(cfg.takeaway)}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cfg.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 text-xs font-medium text-slate-200"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {link.label}
            </a>
          ))}
        </div>
      </ConfigBlock>
    </div>
  )
}

function ConfigBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
      <h3 className="mb-2 text-xs font-semibold text-slate-100">{title}</h3>
      {children}
    </div>
  )
}
