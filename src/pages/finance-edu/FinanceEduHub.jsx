import { useState } from 'react'
import {
  Activity,
  Baby,
  Briefcase,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Library,
  Map,
} from 'lucide-react'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { ETF_CHAPTERS, ETF_COURSE } from '@/lib/finance-edu/curriculum'
import {
  FINANZTIP_BOOKS_URL,
  FINANZTIP_CHAPTERS,
  FINANZTIP_COURSE,
} from '@/lib/finance-edu/finanztipCurriculum'
import {
  ETF4KIDS_HUB_URL,
  ETF4KIDS_TOP10_URL,
  KIDS_CHAPTERS,
  KIDS_COURSE,
} from '@/lib/finance-edu/kidsCurriculum'
import {
  TRADING_CHAPTERS,
  TRADING_COURSE,
  WH_LIBRARY_URL,
  WH_SCALPER_EBOOK_URL,
} from '@/lib/finance-edu/tradingCurriculum'
import {
  FREEDOM24_ETF_PLAN_URL,
  FREEDOM24_HOME_URL,
  SPARPLAN_CHAPTERS,
  SPARPLAN_COURSE,
} from '@/lib/finance-edu/sparplanCurriculum'
import {
  LIQID_HOME_URL,
  LIQID_SMG_URL,
  SMART_MONEY_CHAPTERS,
  SMART_MONEY_COURSE,
} from '@/lib/finance-edu/smartMoneyCurriculum'
import {
  DE_PANTOFFEL_URL,
  DE_VZ_URL,
  DE_WEALTH_CHAPTERS,
  DE_WEALTH_COURSE,
  DE_WEALTH_HUB_URL,
} from '@/lib/finance-edu/deWealthCurriculum'
import {
  countCompleted,
  loadEduProgress,
  totalLessons,
} from '@/lib/finance-edu/progress'
import FinanceCourse from './FinanceCourse'

const TRACKS = [
  {
    course: DE_WEALTH_COURSE,
    chapters: DE_WEALTH_CHAPTERS,
    Icon: Map,
  },
  {
    course: ETF_COURSE,
    chapters: ETF_CHAPTERS,
    Icon: GraduationCap,
  },
  {
    course: FINANZTIP_COURSE,
    chapters: FINANZTIP_CHAPTERS,
    Icon: Library,
  },
  {
    course: KIDS_COURSE,
    chapters: KIDS_CHAPTERS,
    Icon: Baby,
  },
  {
    course: SPARPLAN_COURSE,
    chapters: SPARPLAN_CHAPTERS,
    Icon: CalendarClock,
  },
  {
    course: SMART_MONEY_COURSE,
    chapters: SMART_MONEY_CHAPTERS,
    Icon: Briefcase,
  },
  {
    course: TRADING_COURSE,
    chapters: TRADING_CHAPTERS,
    Icon: Activity,
  },
]

export default function FinanceEduHub({ onExit }) {
  const { language, setLanguage } = useAiLanguage()
  const de = language !== 'en'
  const [activeId, setActiveId] = useState(null)

  const active = TRACKS.find((t) => t.course.id === activeId)

  if (active) {
    return (
      <FinanceCourse
        course={active.course}
        chapters={active.chapters}
        onBack={() => setActiveId(null)}
        backLabel={de ? 'Finanz-Bildung' : 'Finance education'}
      />
    )
  }

  return (
    <div className="w-full min-w-0 max-w-full pb-8">
      <header className="safe-top mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1 text-sm text-slate-400"
        >
          <ChevronLeft className="h-4 w-4" />
          Tax Vault
        </button>
        <AiLanguageTabs language={language} onChange={setLanguage} compact />
      </header>

      <div className="mb-4">
        <h1 className="text-xl font-bold sm:text-2xl">
          {de ? 'Finanz-Bildung' : 'Finance education'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {de
            ? 'Master-Pfad Vermögensaufbau DE plus Spezialkurse (ETFs, Finanztip, Kindersparen, Sparplan, Smart Money, Trading-Risiken).'
            : 'Master path for building wealth in Germany plus specialty courses (ETFs, Finanztip, kids, savings plans, smart money, trading risks).'}
        </p>
      </div>

      <div className="mb-4 space-y-2">
        {TRACKS.map(({ course, chapters, Icon }) => {
          const progress = loadEduProgress(course.storageKey)
          const done = countCompleted(chapters, progress)
          const total = totalLessons(chapters)
          const pct = total ? Math.round((done / total) * 100) : 0
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => setActiveId(course.id)}
              className="premium-card flex w-full items-start gap-3 p-4 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">
                  {de ? course.titleDe : course.titleEn}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {de ? course.taglineDe : course.taglineEn}
                </span>
                <span className="mt-2 block text-[11px] text-slate-500">
                  {done}/{total} · {pct}%
                </span>
              </span>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
            </button>
          )
        })}
      </div>

      <div className="mb-3 space-y-2">
        <a
          href={DE_WEALTH_HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>finanztip.de/geldanlage</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={DE_VZ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>Verbraucherzentrale — Geldanlage</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={DE_PANTOFFEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>Stiftung Warentest — Pantoffel-Portfolio</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href="https://www.finanzfluss.de/etf-handbuch/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>finanzfluss.de/etf-handbuch</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={FINANZTIP_BOOKS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>finanztip.de/buch</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={ETF4KIDS_HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>etf4kids.com — Kindersparen</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={ETF4KIDS_TOP10_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>ETF4Kids — Top-10 child savings</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={FREEDOM24_ETF_PLAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>Freedom24 — ETF-Investment-Plan</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={FREEDOM24_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>freedom24.com</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={LIQID_SMG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>LIQID — Smart Money Leitfaden</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={LIQID_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>liqid.de</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={WH_SCALPER_EBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>WH SelfInvest — Der Scalper (E-Book)</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
        <a
          href={WH_LIBRARY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-2.5 text-sm text-slate-200"
        >
          <span>WH SelfInvest — Trading-Bibliothek</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">
        {de
          ? 'Nur Bildung — keine Anlage-, Steuer-, Rechts-, Broker- oder Handelsberatung. CFDs/Hebelprodukte: hohes Verlustrisiko; die Mehrheit der Kleinanlegerkonten verliert Geld. Bücher, Rankings, Landingpages und E-Books gehören den jeweiligen Anbietern.'
          : 'Education only — not investment, tax, legal, broker, or trading advice. CFDs/leveraged products: high risk of loss; most retail accounts lose money. Books, rankings, landing pages, and ebooks belong to their respective publishers.'}
      </p>
    </div>
  )
}
