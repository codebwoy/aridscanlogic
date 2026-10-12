import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Headphones,
  Hand,
  Link2,
  Megaphone,
  Package,
  Shirt,
  Sparkles,
  Clapperboard,
  Store,
  ShieldAlert,
  Layers,
  Monitor,
  Receipt,
  Search,
  Flag,
  Library,
  TrendingUp,
  GraduationCap,
  Lightbulb,
  Target,
  Languages,
  Compass,
  Share2,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { programmesByPriority } from '@/lib/bizstart/amazon/programmes'
import { AMAZON_GUIDES } from '@/lib/bizstart/amazon/guides'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import {
  getStoryforgeWebUrl,
  isLocalStoryforgeUrl,
  launchStoryforgeDesktop,
  probeStoryforgeReady,
} from '@/lib/storyforge/launch'
import {
  getAuthorforgeWebUrl,
  isLocalAuthorforgeUrl,
  launchAuthorforgeDesktop,
  probeAuthorforgeReady,
} from '@/lib/authorforge/launch'
import { hubNicheLadder, MARKET_DISCLAIMER as NICHE_MARKET_DISCLAIMER } from '@/lib/authorforge/recommendedNiches'
import MerchConfigPanel from '@/components/bizstart/amazon/MerchConfigPanel'
import KdpConfigPanel from '@/components/bizstart/amazon/KdpConfigPanel'
import KdpResourcesPanel from '@/components/bizstart/amazon/KdpResourcesPanel'
import InspirationPanel from '@/components/bizstart/amazon/InspirationPanel'
import PublishWhatPanel from '@/components/bizstart/amazon/PublishWhatPanel'
import GermanFirstPanel from '@/components/bizstart/amazon/GermanFirstPanel'
import NicheResearchPanel from '@/components/bizstart/amazon/NicheResearchPanel'
import BilingualStoryPanel from '@/components/bizstart/amazon/BilingualStoryPanel'
import HeritageTranslatorPanel from '@/components/bizstart/amazon/HeritageTranslatorPanel'
import PublisherTruthsPanel from '@/components/bizstart/amazon/PublisherTruthsPanel'

const ICONS = {
  kdp: BookOpen,
  merch: Shirt,
  associates: Link2,
  acx: Headphones,
  handmade: Hand,
  influencer: Megaphone,
  fba_fbm: Store,
  vella: Layers,
  video_direct: Clapperboard,
}

const GUIDE_ICONS = {
  'publisher-truths': Compass,
  'publish-wide-email': Share2,
  'kdp-start': BookOpen,
  'kdp-hidden-pitfalls': AlertTriangle,
  'kdp-account-termination': ShieldAlert,
  'tax-de': Receipt,
  'kdp-resources': GraduationCap,
  inspiration: Lightbulb,
  'publish-what': Target,
  'kdp-niche-research': Search,
  'bilingual-story': BookOpen,
  'heritage-translator': Languages,
  'german-first': Languages,
  'merch-ops': Shirt,
  'research-de': Search,
  'brand-loop': Link2,
  'merch-scale': TrendingUp,
  milestones: Flag,
}

const PRIORITY_STYLE = {
  start_now: 'bg-emerald-500/20 text-emerald-300',
  alongside: 'bg-brand-500/20 text-brand-300',
  after_book: 'bg-blue-500/20 text-blue-300',
  after_presence: 'bg-amber-500/20 text-amber-300',
  later: 'bg-slate-600/40 text-slate-300',
  monitor: 'bg-slate-700/60 text-slate-400',
}

function AccordionItem({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-h-[48px] items-center justify-between gap-3 px-3.5 py-3 text-left"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 text-sm font-semibold text-slate-100">{title}</span>
        <span className="flex shrink-0 items-center gap-2">
          {badge}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </span>
      </button>
      {open ? <div className="space-y-3 border-t border-slate-700/60 px-3.5 py-3">{children}</div> : null}
    </div>
  )
}

function PriorityBadge({ lang, priority }) {
  const label = amazonT(lang, `priorityLabels.${priority}`)
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${PRIORITY_STYLE[priority] || PRIORITY_STYLE.later}`}
    >
      {label}
    </span>
  )
}

export default function AmazonHub({ lang = 'en', onBack }) {
  const programmes = programmesByPriority()
  const [focusGuideId, setFocusGuideId] = useState(null)
  const [storyforgeReady, setStoryforgeReady] = useState(null)
  const [authorforgeReady, setAuthorforgeReady] = useState(null)

  useEffect(() => {
    // Only probe localhost studios. Remote Fly URLs: never poll /health (wakes machines +
    // CORP/cold-start false "offline"). Cloud studios open on click.
    const sfLocal = isLocalStoryforgeUrl(getStoryforgeWebUrl())
    const afLocal = isLocalAuthorforgeUrl(getAuthorforgeWebUrl())
    if (!sfLocal) setStoryforgeReady(null)
    if (!afLocal) setAuthorforgeReady(null)
    if (!sfLocal && !afLocal) return undefined

    let cancelled = false
    if (sfLocal) {
      probeStoryforgeReady().then((ok) => {
        if (!cancelled) setStoryforgeReady(ok)
      })
    }
    if (afLocal) {
      probeAuthorforgeReady().then((ok) => {
        if (!cancelled) setAuthorforgeReady(ok)
      })
    }
    const id = setInterval(() => {
      if (sfLocal) {
        probeStoryforgeReady().then((ok) => {
          if (!cancelled) setStoryforgeReady(ok)
        })
      }
      if (afLocal) {
        probeAuthorforgeReady().then((ok) => {
          if (!cancelled) setAuthorforgeReady(ok)
        })
      }
    }, 8000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  async function onOpenStoryforge(view = 'studio') {
    const result = await launchStoryforgeDesktop({ view })
    setStoryforgeReady(result.opened || result.reason !== 'offline')
    if (result.opened) return
    if (result.reason === 'mobile') {
      toast.message(amazonT(lang, 'storyforgeMobile'))
      return
    }
    if (result.reason === 'offline') {
      setStoryforgeReady(false)
      toast.error(amazonT(lang, 'storyforgeOffline'))
      return
    }
    toast.error(amazonT(lang, 'storyforgePopupBlocked'))
  }

  async function onOpenAuthorforge() {
    const result = await launchAuthorforgeDesktop({ view: 'studio' })
    setAuthorforgeReady(result.opened || result.reason !== 'offline')
    if (result.opened) return
    if (result.reason === 'mobile') {
      toast.message(amazonT(lang, 'authorforgeMobile'))
      return
    }
    if (result.reason === 'offline') {
      setAuthorforgeReady(false)
      toast.error(amazonT(lang, 'authorforgeOffline'))
      return
    }
    toast.error(amazonT(lang, 'authorforgePopupBlocked'))
  }

  function openPlaybook(guideId) {
    setFocusGuideId(guideId)
    requestAnimationFrame(() => {
      document.getElementById(`amazon-guide-${guideId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  function openMerchPlaybook() {
    openPlaybook('merch-ops')
  }

  function openKdpPlaybook() {
    openPlaybook('kdp-start')
  }

  function openKdpResources() {
    openPlaybook('kdp-resources')
  }

  function openInspiration() {
    openPlaybook('inspiration')
  }

  function openPublishWhat() {
    openPlaybook('publish-what')
  }

  function openGermanFirst() {
    openPlaybook('german-first')
  }

  function openNicheResearch() {
    openPlaybook('kdp-niche-research')
  }

  function openBilingualStory() {
    openPlaybook('bilingual-story')
  }

  function openHeritageTranslator() {
    openPlaybook('heritage-translator')
  }

  return (
    <div className="w-full min-w-0 max-w-full pb-8">
      <button
        type="button"
        onClick={onBack}
        className="safe-top mb-4 flex min-h-[44px] items-center gap-2 text-sm text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> {amazonT(lang, 'back')}
      </button>

      <header className="mb-4">
        <div className="mb-2 flex items-center gap-2 rounded-full bg-brand-600/20 px-3 py-1 text-xs text-brand-300 w-fit">
          <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
          Amazon
        </div>
        <h1 className="text-xl font-bold leading-tight text-slate-100">{amazonT(lang, 'title')}</h1>
        <p className="mt-1 text-sm text-slate-400">{amazonT(lang, 'subtitle')}</p>
      </header>

      <p className="mb-4 text-sm leading-relaxed text-slate-300">{amazonT(lang, 'intro')}</p>

      <div className="premium-card mb-4 border border-brand-500/25 bg-gradient-to-br from-brand-900/30 to-slate-900/40 p-4">
        <p className="text-sm font-bold text-brand-100">{amazonT(lang, 'comboTitle')}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{amazonT(lang, 'comboBody')}</p>
      </div>

      <div className="premium-card mb-4 border border-brand-500/20 p-4">
        <p className="text-sm font-bold text-slate-100">{amazonT(lang, 'nicheLadderTitle')}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
          {amazonT(lang, 'nicheLadderIntro')}
        </p>
        <ol className="mt-3 space-y-2">
          {hubNicheLadder(lang).map((n) => (
            <li
              key={`${n.priority}-${n.title}`}
              className="rounded-xl border border-slate-700/80 bg-slate-950/40 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-600/25 px-2 py-0.5 text-[11px] font-semibold text-brand-200">
                  #{n.priority}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {amazonT(lang, 'nicheLadderStudio')}: {n.studio}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-100">{n.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{n.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-amber-100/80">{NICHE_MARKET_DISCLAIMER}</p>
      </div>

      {/* Strategy playbooks first — truths before studio launch */}
      <section className="mb-6 space-y-3">
        <div className="flex items-start gap-2">
          <Library className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-200">{amazonT(lang, 'playbooksTitle')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {amazonT(lang, 'playbooksIntro')}
            </p>
          </div>
        </div>
        {AMAZON_GUIDES.map((guide) => {
          const GuideIcon = GUIDE_ICONS[guide.id] || BookOpen
          const forceOpen = focusGuideId === guide.id
          return (
            <div key={guide.id} id={`amazon-guide-${guide.id}`}>
              <AccordionItem
                key={forceOpen ? `${guide.id}-focus` : guide.id}
                defaultOpen={forceOpen || Boolean(guide.defaultOpen)}
                title={
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <GuideIcon className="h-4 w-4 shrink-0 text-brand-300" aria-hidden />
                    <span className="truncate">{guide.title[lang] || guide.title.en}</span>
                  </span>
                }
              >
                <p className="text-xs leading-relaxed text-slate-300">
                  {guide.summary[lang] || guide.summary.en}
                </p>
                {guide.sections.map((section) => (
                  <GuideSectionBlock key={section.heading.en} lang={lang} section={section} />
                ))}
                {guide.id === 'publisher-truths' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'publisherTruthsTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'publisherTruthsHint')}
                    </p>
                    <PublisherTruthsPanel
                      lang={lang}
                      onOpenStoryforge={onOpenStoryforge}
                      onOpenAuthorforge={onOpenAuthorforge}
                      onOpenPlaybook={openPlaybook}
                    />
                  </>
                ) : null}
                {guide.id === 'kdp-start' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'kdpDeepTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'kdpDeepHint')}
                    </p>
                    <KdpConfigPanel
                      lang={lang}
                      onOpenStoryforge={onOpenStoryforge}
                      onOpenPlaybook={openPlaybook}
                    />
                  </>
                ) : null}
                {guide.id === 'kdp-resources' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'kdpResourcesTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'kdpResourcesHint')}
                    </p>
                    <KdpResourcesPanel lang={lang} onOpenStoryforge={onOpenStoryforge} />
                  </>
                ) : null}
                {guide.id === 'inspiration' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'inspTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'inspHint')}
                    </p>
                    <InspirationPanel lang={lang} onOpenStoryforge={onOpenStoryforge} />
                  </>
                ) : null}
                {guide.id === 'publish-what' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'publishWhatTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'publishWhatHint')}
                    </p>
                    <PublishWhatPanel lang={lang} onOpenStoryforge={onOpenStoryforge} />
                  </>
                ) : null}
                {guide.id === 'bilingual-story' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'bilingualStoryTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'bilingualStoryHint')}
                    </p>
                    <BilingualStoryPanel lang={lang} onOpenStoryforge={onOpenStoryforge} />
                  </>
                ) : null}
                {guide.id === 'heritage-translator' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'heritageTranslatorTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'heritageTranslatorHint')}
                    </p>
                    <HeritageTranslatorPanel lang={lang} />
                  </>
                ) : null}
                {guide.id === 'kdp-niche-research' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'nicheResearchTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'nicheResearchHint')}
                    </p>
                    <NicheResearchPanel lang={lang} />
                  </>
                ) : null}
                {guide.id === 'german-first' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'germanFirstTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'germanFirstHint')}
                    </p>
                    <GermanFirstPanel lang={lang} />
                  </>
                ) : null}
                {guide.id === 'merch-ops' ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amazonT(lang, 'merchDeepTitle')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {amazonT(lang, 'merchDeepHint')}
                    </p>
                    <MerchConfigPanel lang={lang} onOpenStoryforge={onOpenStoryforge} />
                  </>
                ) : null}
              </AccordionItem>
            </div>
          )
        })}
      </section>

      <div className="premium-card mb-4 border border-brand-500/20 p-4">
        <div className="flex items-start gap-3">
          <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-100">{amazonT(lang, 'storyforgeTitle')}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {amazonT(lang, 'storyforgeBody')}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => onOpenStoryforge('studio')}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white sm:w-auto"
              >
                {amazonT(lang, 'storyforgeCta')}
              </button>
              <button
                type="button"
                onClick={() => onOpenStoryforge('launchpad')}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-950/40 px-4 text-sm font-semibold text-brand-100 sm:w-auto"
              >
                {amazonT(lang, 'storyforgeLaunchpadCta')}
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              {amazonT(lang, 'storyforgeLaunchpadHint')}
            </p>
            {storyforgeReady === false ? (
              <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
                {amazonT(lang, 'storyforgeOffline')}
              </p>
            ) : storyforgeReady === true ? (
              <p className="mt-2 text-[11px] font-medium text-emerald-300/90">
                {amazonT(lang, 'storyforgeOnline')}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="premium-card mb-4 border border-brand-500/20 p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-100">{amazonT(lang, 'authorforgeTitle')}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {amazonT(lang, 'authorforgeBody')}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => onOpenAuthorforge()}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white sm:w-auto"
              >
                {amazonT(lang, 'authorforgeCta')}
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              {amazonT(lang, 'authorforgeHint')}
            </p>
            {authorforgeReady === false ? (
              <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
                {amazonT(lang, 'authorforgeOffline')}
              </p>
            ) : authorforgeReady === true ? (
              <p className="mt-2 text-[11px] font-medium text-emerald-300/90">
                {amazonT(lang, 'authorforgeOnline')}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{amazonT(lang, 'disclaimer')}</span>
      </p>

      {/* Priority table */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">{amazonT(lang, 'priorityTitle')}</h2>
        <div className="premium-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-max min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400">
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">{amazonT(lang, 'colProgramme')}</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">{amazonT(lang, 'colCost')}</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">{amazonT(lang, 'colEffort')}</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">{amazonT(lang, 'colRelevance')}</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">{amazonT(lang, 'colPriority')}</th>
                </tr>
              </thead>
              <tbody>
                {programmes.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/80 last:border-0">
                    <td className="px-3 py-2.5 font-medium text-slate-200">{p.name[lang] || p.name.en}</td>
                    <td className="px-3 py-2.5 text-slate-400">{p.startupCost[lang] || p.startupCost.en}</td>
                    <td className="px-3 py-2.5 text-slate-400">{p.effort[lang] || p.effort.en}</td>
                    <td className="max-w-[14rem] px-3 py-2.5 text-slate-400">
                      {p.relevance[lang] || p.relevance.en}
                    </td>
                    <td className="px-3 py-2.5">
                      <PriorityBadge lang={lang} priority={p.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Programme cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">{amazonT(lang, 'programmesTitle')}</h2>
        {programmes.map((p, i) => {
          const Icon = ICONS[p.id] || Package
          const why = p.why[lang] || p.why.en
          return (
            <AccordionItem
              key={p.id}
              defaultOpen={i < 2}
              badge={<PriorityBadge lang={lang} priority={p.priority} />}
              title={
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-brand-300" aria-hidden />
                  <span className="truncate">{p.name[lang] || p.name.en}</span>
                </span>
              }
            >
              {!p.actionableDe ? (
                <p className="rounded-lg bg-slate-800/60 px-2.5 py-1.5 text-[11px] text-slate-400">
                  {amazonT(lang, 'notActionable')}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 text-[11px]">
                <MetaChip label={amazonT(lang, 'cost')} value={p.startupCost[lang] || p.startupCost.en} />
                <MetaChip label={amazonT(lang, 'effort')} value={p.effort[lang] || p.effort.en} />
                <MetaChip
                  label={amazonT(lang, 'relevance')}
                  value={p.relevance[lang] || p.relevance.en}
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {amazonT(lang, 'whatLabel')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{p.what[lang] || p.what.en}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {amazonT(lang, 'whyLabel')}
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                  {why.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {amazonT(lang, 'accessLabel')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {p.howAccess[lang] || p.howAccess.en}
                </p>
              </div>

              {p.id === 'kdp' ? (
                <div className="rounded-lg border border-brand-500/25 bg-brand-950/30 p-3">
                  <p className="text-xs leading-relaxed text-slate-300">
                    {amazonT(lang, 'kdpProgrammeExtra')}
                  </p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={openKdpPlaybook}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-3 text-xs font-semibold text-white sm:w-auto"
                    >
                      {amazonT(lang, 'kdpDeepTitle')}
                    </button>
                    <button
                      type="button"
                      onClick={openKdpResources}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'kdpResourcesCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openInspiration}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'inspCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openPublishWhat}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'publishWhatCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openGermanFirst}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'germanFirstCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openNicheResearch}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'nicheResearchCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openBilingualStory}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'bilingualStoryCta')}
                    </button>
                    <button
                      type="button"
                      onClick={openHeritageTranslator}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
                    >
                      {amazonT(lang, 'heritageTranslatorCta')}
                    </button>
                  </div>
                </div>
              ) : null}

              {p.id === 'merch' ? (
                <div className="rounded-lg border border-brand-500/25 bg-brand-950/30 p-3">
                  <p className="text-xs leading-relaxed text-slate-300">
                    {amazonT(lang, 'merchProgrammeExtra')}
                  </p>
                  <button
                    type="button"
                    onClick={openMerchPlaybook}
                    className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-3 text-xs font-semibold text-white sm:w-auto"
                  >
                    {amazonT(lang, 'merchDeepTitle')}
                  </button>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 pt-1">
                {p.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200 hover:border-brand-500/50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    {link.label}
                  </a>
                ))}
              </div>
            </AccordionItem>
          )
        })}
      </section>
    </div>
  )
}

function MetaChip({ label, value }) {
  return (
    <span className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-2 py-1 text-slate-400">
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-200">{value}</span>
    </span>
  )
}

function GuideSectionBlock({ lang, section }) {
  const bullets = section.bullets?.[lang] || section.bullets?.en
  const rows = section.rows
  const note = section.note?.[lang] || section.note?.en
  const links = section.links

  return (
    <div className="space-y-2 rounded-lg border border-slate-800/80 bg-slate-950/30 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {section.heading[lang] || section.heading.en}
      </p>

      {bullets?.length ? (
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {rows?.length ? (
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
              {rows.map((row) => (
                <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {row.label[lang] || row.label.en}
                  </td>
                  <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">
                    {row.detail[lang] || row.detail.en}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {note ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-100/90">
          {note}
        </p>
      ) : null}

      {links?.length ? (
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {amazonT(lang, 'sectionLinks')}
          </p>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200 hover:border-brand-500/50"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
