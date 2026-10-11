import { ExternalLink, ShieldAlert } from 'lucide-react'
import { INSPIRATION_CONFIG } from '@/lib/bizstart/amazon/inspirationConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/** Books for inspiration, age bands, tools beyond one-off AI image apps. */
export default function InspirationPanel({ lang = 'en', onOpenStoryforge }) {
  const cfg = INSPIRATION_CONFIG
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
        {amazonT(lang, 'inspMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'inspPrimary')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.primaryBlueprint)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.beginnerAdvise.heading)}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.beginnerAdvise.verifiedNote)}
        </p>
        <ul className="space-y-3">
          {cfg.beginnerAdvise.categories.map((cat) => (
            <li
              key={cat.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(cat.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {cat.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'inspBeginnerTips')}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.beginnerAdvise.tips[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-brand-100/90">
          {L(cfg.beginnerAdvise.merchBridge)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.studyShelf.heading)}>
        {cfg.studyShelf.groups.map((group) => (
          <div key={group.id} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {L(group.title)}
            </p>
            <ul className="space-y-2">
              {group.books.map((b) => (
                <li
                  key={b.id}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-slate-100">{b.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(b.blurb)}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'inspStudyNotice')}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.studyShelf.notice[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'inspDeepDives')}>
        <ul className="space-y-3">
          {cfg.bookDeepDives.map((dive) => (
            <li
              key={dive.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{dive.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{L(dive.concept)}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'inspWhySells')}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-400">
                {dive.whySells[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'inspKdpLessons')}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {dive.kdpLessons[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'inspStudyPoints')}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-400">
                {dive.studyPoints[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      {cfg.categories.map((cat) => (
        <ConfigBlock key={cat.id} title={L(cat.title)}>
          <p className="mb-2 text-[11px] text-slate-400">{L(cat.priority)}</p>
          <ul className="space-y-2">
            {cat.books.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
              >
                <p className="text-xs font-semibold text-slate-100">
                  {b.title || amazonT(lang, 'inspUntitled')}
                </p>
                {!b.title && b.titleHint ? (
                  <p className="mt-0.5 text-[11px] text-brand-200/90">{L(b.titleHint)}</p>
                ) : null}
                <p className="mt-1 text-[11px] text-slate-500">
                  {amazonT(lang, 'inspAges')}: {b.ages}
                </p>
                <p className="mt-1 text-xs text-slate-300">{L(b.formula)}</p>
                <p className="mt-1 text-xs text-slate-400">{L(b.role)}</p>
                <p className="mt-1 text-[11px] text-amber-100/80">{L(b.ratingNote)}</p>
              </li>
            ))}
          </ul>
        </ConfigBlock>
      ))}

      <ConfigBlock title={amazonT(lang, 'inspAgesTitle')}>
        <p className="mb-2 text-xs font-medium text-slate-200">{L(cfg.ageGroups.sweetSpot)}</p>
        <p className="mb-2 text-[11px] text-amber-100/80">{L(cfg.ageGroups.verifiedNote)}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'inspColAge')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'inspColSells')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'inspColWhy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.ageGroups.rows.map((row) => (
                <tr key={row.ages.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.ages)}
                  </td>
                  <td className="max-w-[12rem] px-2.5 py-2 text-slate-400">{L(row.sells)}</td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.why)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.tools.heading)}>
        <p className="mb-2 text-[11px] text-amber-100/80">{L(cfg.tools.verifiedNote)}</p>
        {cfg.tools.groups.map((g) => (
          <div key={g.id} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {L(g.title)}
            </p>
            <ul className="space-y-2">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  className="rounded-lg border border-slate-800/80 bg-slate-950/40 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-slate-100">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{L(item.cost)}</p>
                  <p className="mt-1 text-xs text-slate-400">{L(item.why)}</p>
                  {item.note ? (
                    <p className="mt-1 text-[11px] text-amber-100/80">{L(item.note)}</p>
                  ) : null}
                  {item.storyforge ? (
                    <button
                      type="button"
                      onClick={openStudio}
                      className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'merchStoryforgeCta')}
                    </button>
                  ) : null}
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      {amazonT(lang, 'openLink')}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
