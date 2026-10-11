import { ExternalLink, ShieldAlert } from 'lucide-react'
import { KDP_RESOURCES_CONFIG } from '@/lib/bizstart/amazon/kdpResourcesConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/** Free/paid learning path + 30-day plan for starting KDP (children’s books). */
export default function KdpResourcesPanel({ lang = 'en', onOpenStoryforge }) {
  const cfg = KDP_RESOURCES_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  function openStudio() {
    if (onOpenStoryforge) {
      onOpenStoryforge('launchpad')
      return
    }
    const result = launchStoryforgeDesktop({ view: 'launchpad' })
    if (result.opened) return
    if (result.reason === 'mobile') toast.message(amazonT(lang, 'storyforgeMobile'))
    else toast.error(amazonT(lang, 'storyforgePopupBlocked'))
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'kdpResourcesMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'kdpResourcesRec')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.recommendation)}</p>
      </ConfigBlock>

      {cfg.jumpstart ? <JumpstartCurriculum lang={lang} jumpstart={cfg.jumpstart} /> : null}

      {cfg.reedsy ? <ReedsyCurriculum lang={lang} reedsy={cfg.reedsy} /> : null}

      <ConfigBlock title={amazonT(lang, 'kdpResourcesFree')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">#</th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'kdpResColResource')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'kdpResColWhy')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'kdpResColCost')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'sectionLinks')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.freePath.map((row) => (
                <tr key={row.order} className="border-b border-slate-800/80 last:border-0">
                  <td className="px-2.5 py-2 font-medium text-slate-200">{row.order}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.name)}
                  </td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">
                    {L(row.why)}
                    {row.credibilityClaim ? (
                      <span className="mt-1 block text-[11px] text-slate-500">
                        {L(row.credibilityClaim)}
                      </span>
                    ) : null}
                    {row.note ? (
                      <span className="mt-1 block text-[11px] text-amber-100/80">{L(row.note)}</span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.cost)}</td>
                  <td className="px-2.5 py-2">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1 text-brand-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {row.urlLabel}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cfg.freeCoursesDetail ? (
          <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {L(cfg.freeCoursesDetail.heading)}
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {cfg.freeCoursesDetail.titans[lang]?.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpResourcesPaidList')}>
        <p className="mb-2 text-[11px] text-amber-100/80">{L(cfg.paidCoursesNote)}</p>
        <ul className="space-y-3">
          {(cfg.paidCourses || []).map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">
                {c.order}. {L(c.name)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {c.platform}
                {c.rating?.stars
                  ? ` · ${c.rating.stars}★${c.rating.count ? ` (${c.rating.count})` : ''} · as of ${c.rating.asOf}`
                  : ''}
              </p>
              {c.rating?.sourceNote ? (
                <p className="mt-1 text-[11px] text-amber-100/80">{L(c.rating.sourceNote)}</p>
              ) : null}
              <p className="mt-1.5 text-xs text-slate-300">
                <span className="font-semibold text-slate-400">{amazonT(lang, 'kdpResColCovers')}: </span>
                {L(c.covers)}
              </p>
              <p className="mt-1 text-xs text-slate-400">{L(c.why)}</p>
              <p className="mt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-500">{amazonT(lang, 'kdpResColBestFor')}: </span>
                {L(c.bestFor)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-500">{amazonT(lang, 'kdpResColCost')}: </span>
                {L(c.cost)}
              </p>
              {c.note ? <p className="mt-1 text-[11px] text-amber-100/80">{L(c.note)}</p> : null}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {c.urlLabel}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/40 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {amazonT(lang, 'kdpResourcesPaid')}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-100">{L(cfg.paidOption.name)}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{L(cfg.paidOption.why)}</p>
          <p className="mt-1 text-xs text-slate-400">{L(cfg.paidOption.priceDisplay)}</p>
          <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.paidOption.verifiedNote)}</p>
          <a
            href={cfg.paidOption.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {cfg.paidOption.urlLabel}
          </a>
        </div>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpResourcesKids')}>
        <p className="mb-2 text-[11px] leading-relaxed text-slate-400">
          {amazonT(lang, 'kdpResourcesKidsHint')}
        </p>
        <ul className="space-y-3">
          {cfg.childrensResources.map((r) => (
            <li
              key={r.name.en}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(r.name)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(r.why)}</p>
              {r.note ? (
                <p className="mt-1 text-[11px] text-amber-100/80">{L(r.note)}</p>
              ) : null}
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {r.urlLabel}
              </a>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpResourcesAvoid')}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.avoid[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpResourcesLearn')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'tableNeed')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'tableDetail')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.learnFirst.map((row) => (
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
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpResources30')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'kdpResColDays')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'tableDetail')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.plan30.map((row) => (
                <tr key={row.days.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.days)}
                  </td>
                  <td className="max-w-[18rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={openStudio}
          className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
        >
          {amazonT(lang, 'kdpStoryforgeCta')}
        </button>
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

function ReedsyCurriculum({ lang, reedsy }) {
  const L = (obj) => obj?.[lang] || obj?.en || ''
  const hub = reedsy.hub

  return (
    <ConfigBlock title={amazonT(lang, 'kdpReedsyTitle')}>
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'kdpReedsyMeta')} · {reedsy.lastVerified}
        <span className="block text-slate-600">{reedsy.sourceLabel}</span>
      </p>
      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(reedsy.independenceDisclaimer)}</span>
      </p>
      <p className="text-xs leading-relaxed text-slate-300">{L(hub.intro)}</p>
      <p className="text-[11px] text-slate-400">
        {amazonT(lang, 'kdpReedsyTeacher')}: {hub.teacher} · {L(hub.format)}
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={hub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-500/40 bg-brand-950/40 px-3 py-2 text-xs font-semibold text-brand-100"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {amazonT(lang, 'kdpReedsyEnroll')}
        </a>
        <a
          href={hub.catalogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {amazonT(lang, 'kdpReedsyCatalog')}
        </a>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpReedsyOutcomes')}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(hub.outcomes[lang] || hub.outcomes.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 pt-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpReedsyModules')}
        </p>
        {reedsy.modules.map((mod) => (
          <details
            key={mod.id}
            className="rounded-lg border border-slate-800/80 bg-slate-900/40 open:bg-slate-900/60"
          >
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-100 [&::-webkit-details-marker]:hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-600/30 text-[11px] text-brand-200">
                {mod.number}
              </span>
              <span className="min-w-0 flex-1">{L(mod.title)}</span>
            </summary>
            <div className="space-y-2 border-t border-slate-800/80 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'kdpJumpstartLearn')}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {(mod.learn[lang] || mod.learn.en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'kdpReedsyDoNow')}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {(mod.doNow[lang] || mod.doNow.en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpReedsyPairs')}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(reedsy.howItPairsWithKdp[lang] || reedsy.howItPairsWithKdp.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpJumpstartChecklist')}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(reedsy.studyChecklist[lang] || reedsy.studyChecklist.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpReedsyRelated')}
        </p>
        {reedsy.relatedCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
          >
            <p className="text-xs font-semibold text-slate-100">{L(course.title)}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {course.teacher}
              {course.priority ? ` · ${course.priority}` : ''}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(course.why)}</p>
            {course.outcomes ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-slate-400">
                {(course.outcomes[lang] || course.outcomes.en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-brand-200"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {amazonT(lang, 'kdpReedsyOpenCourse')}
            </a>
          </div>
        ))}
      </div>
    </ConfigBlock>
  )
}

function JumpstartCurriculum({ lang, jumpstart }) {
  const L = (obj) => obj?.[lang] || obj?.en || ''
  const hub = jumpstart.hub

  return (
    <ConfigBlock title={amazonT(lang, 'kdpJumpstartTitle')}>
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'kdpJumpstartMeta')} · {jumpstart.lastVerified}
        <span className="block text-slate-600">{jumpstart.sourceLabel}</span>
      </p>
      <p className="text-xs leading-relaxed text-slate-300">{L(hub.intro)}</p>
      <p className="text-xs leading-relaxed text-slate-400">{L(hub.beforeYouStart)}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={hub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-500/40 bg-brand-950/40 px-3 py-2 text-xs font-semibold text-brand-100"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {L(hub.title)}
        </a>
        <a
          href={hub.contentGuidelinesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {amazonT(lang, 'kdpJumpstartGuidelines')}
        </a>
      </div>

      <div className="space-y-3 pt-1">
        {jumpstart.chapters.map((ch) => (
          <details
            key={ch.id}
            className="rounded-lg border border-slate-800/80 bg-slate-900/40 open:bg-slate-900/60"
          >
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-100 [&::-webkit-details-marker]:hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-600/30 text-[11px] text-brand-200">
                {ch.number}
              </span>
              <span className="min-w-0 flex-1">{L(ch.title)}</span>
            </summary>
            <div className="space-y-2 border-t border-slate-800/80 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'kdpJumpstartYouNeed')}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {(ch.youNeed[lang] || ch.youNeed.en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'kdpJumpstartLearn')}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {(ch.learn[lang] || ch.learn.en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {ch.note ? (
                <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-100/90">
                  {L(ch.note)}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-500/40 bg-brand-950/40 px-3 py-2 text-xs font-semibold text-brand-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {amazonT(lang, 'kdpJumpstartOpenChapter')}
                </a>
                {ch.links.map((link) => (
                  <a
                    key={`${ch.id}-${link.url}-${link.label}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpJumpstartChecklist')}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(jumpstart.studyChecklist[lang] || jumpstart.studyChecklist.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'kdpJumpstartLibrary')}
        </p>
        {jumpstart.officialLibrary.map((group) => (
          <div key={group.group.en}>
            <p className="mb-1.5 text-xs font-semibold text-slate-200">{L(group.group)}</p>
            <div className="flex flex-wrap gap-2">
              {group.links.map((link) => (
                <a
                  key={`${group.group.en}-${link.url}-${link.label}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ConfigBlock>
  )
}
