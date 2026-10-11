import { ExternalLink, ShieldAlert } from 'lucide-react'
import { PUBLISH_WHAT_CONFIG } from '@/lib/bizstart/amazon/publishWhatConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/** What to publish first on DE KDP — research snapshot, not live scrape. */
export default function PublishWhatPanel({ lang = 'en', onOpenStoryforge }) {
  const cfg = PUBLISH_WHAT_CONFIG
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
        {amazonT(lang, 'publishWhatMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          {L(cfg.independenceDisclaimer)} {L(cfg.snapshotNote)}
        </span>
      </p>

      <ConfigBlock title={amazonT(lang, 'publishWhatThemes')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColTheme')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColEvidence')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.dominantThemes.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.theme)}
                  </td>
                  <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">{L(row.evidence)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'publishWhatVerdicts')}>
        <ul className="space-y-3">
          {cfg.verdicts.map((v) => (
            <li
              key={v.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(v.label)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {v.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.clearFormula.title)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.clearFormula.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={openStudio}
          className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
        >
          {amazonT(lang, 'merchStoryforgeCta')}
        </button>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'publishWhatSummary')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColCat')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColSignal')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColComp')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'publishWhatColRec')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.summaryTable.map((row) => (
                <tr key={row.category.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[12rem] px-2.5 py-2 font-medium text-slate-200">
                    {L(row.category)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.signal)}</td>
                  <td className="max-w-[10rem] px-2.5 py-2 text-slate-400">
                    {L(row.competition)}
                  </td>
                  <td className="max-w-[10rem] px-2.5 py-2 text-slate-300">{L(row.recommend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'publishWhatHabit')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.weeklyHabit)}</p>
        <a
          href={cfg.bestsellersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {amazonT(lang, 'publishWhatBestsellersCta')}
        </a>
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
