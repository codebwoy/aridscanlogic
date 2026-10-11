import { ExternalLink, ShieldAlert } from 'lucide-react'
import { BILINGUAL_STORY_CONFIG } from '@/lib/bizstart/amazon/bilingualStoryConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop, notifyStoryforgeLaunchResult } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/** Craft guide: write bilingual children’s picture-book stories. */
export default function BilingualStoryPanel({ lang = 'en', onOpenStoryforge }) {
  const cfg = BILINGUAL_STORY_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  async function openStudio() {
    if (onOpenStoryforge) {
      await onOpenStoryforge('studio')
      return
    }
    const result = await launchStoryforgeDesktop({ view: 'studio' })
    notifyStoryforgeLaunchResult((key) => amazonT(lang, key), result, toast)
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'bilingualStoryMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'bilingualStoryIntro')}>
        <p className="text-xs leading-relaxed text-slate-200">{L(cfg.intro)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.formula.heading)}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.formula.note)}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColElement')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColWorks')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColExample')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.formula.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.element)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.works)}</td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.example)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.themes.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.themes.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.character.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.character.bullets[lang]?.map((line) => (
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

      <ConfigBlock title={L(cfg.structure.heading)}>
        <p className="mb-2 text-xs leading-relaxed text-slate-300">{L(cfg.structure.intro)}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColSpreads')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColBeat')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColWhat')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.structure.rows.map((row) => (
                <tr key={row.spreads.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.spreads)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.beat)}</td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">{L(row.what)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.readAloud.heading)}>
        <p className="mb-1.5 text-xs font-semibold text-slate-100">{L(cfg.readAloud.optionA.title)}</p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.readAloud.optionA.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mb-1.5 text-xs font-semibold text-slate-100">{L(cfg.readAloud.optionB.title)}</p>
        <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.readAloud.optionB.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-amber-100/80">{L(cfg.readAloud.bilingualTip)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.layouts.heading)}>
        <p className="mb-2 text-[11px] leading-relaxed text-slate-400">{L(cfg.layouts.note)}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColFormat')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColHow')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColBest')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.layouts.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.format)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.how)}</td>
                  <td className="max-w-[10rem] px-2.5 py-2 text-slate-400">{L(row.bestFor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.translation.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.translation.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.wordCounts.heading)}>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColType')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColAge')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColWords')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualStoryColPages')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.wordCounts.rows.map((row) => (
                <tr key={row.type.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.type)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.age)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.words)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.pages)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.wordCounts.bilingualAim)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.template.heading)}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.template.note)}</p>
        <ul className="space-y-2">
          {cfg.template.beats.map((beat) => (
            <li
              key={beat.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(beat.spreads)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(beat.tip)}</p>
              <p className="mt-1 text-xs italic leading-relaxed text-slate-300">{L(beat.example)}</p>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.studyList.heading)}>
        <p className="mb-1.5 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.studyList.note)}</p>
        <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.studyList.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-xs font-medium leading-relaxed text-slate-200">{L(cfg.advantage)}</p>
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
