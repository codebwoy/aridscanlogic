import { useMemo, useState } from 'react'
import {
  Activity,
  Baby,
  BookOpen,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Gauge,
  GraduationCap,
  Home,
  Landmark,
  Layers,
  Library,
  ListChecks,
  Map,
  PieChart,
  Scale,
  Shield,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import GuideMarkdown from '@/components/bizstart/GuideMarkdown'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { getLesson, sourceUrl } from '@/lib/finance-edu/curriculum'
import {
  countCompleted,
  isLessonComplete,
  loadEduProgress,
  markLessonComplete,
  saveEduProgress,
  totalLessons,
} from '@/lib/finance-edu/progress'

const ICONS = {
  BookOpen,
  ShieldAlert,
  PieChart,
  ListChecks,
  Landmark,
  GraduationCap,
  Library,
  Layers,
  Shield,
  TrendingUp,
  Clock,
  Baby,
  Home,
  Activity,
  Gauge,
  CalendarClock,
  Wallet,
  Briefcase,
  Scale,
  Map,
}

function ChapterIcon({ name, className }) {
  const Icon = ICONS[name] || BookOpen
  return <Icon className={className} aria-hidden />
}

/**
 * Shared course player for finance-edu curricula.
 * @param {{ course: object, chapters: object[], onBack: () => void, backLabel?: string }} props
 */
export default function FinanceCourse({ course, chapters, onBack, backLabel }) {
  const { language, setLanguage } = useAiLanguage()
  const de = language !== 'en'
  const [progress, setProgress] = useState(() => loadEduProgress(course.storageKey))
  const [chapterId, setChapterId] = useState(null)
  const [lessonId, setLessonId] = useState(null)

  const total = totalLessons(chapters)
  const done = countCompleted(chapters, progress)
  const pct = total ? Math.round((done / total) * 100) : 0

  const active = useMemo(() => {
    if (!chapterId || !lessonId) return null
    return getLesson(chapters, chapterId, lessonId)
  }, [chapters, chapterId, lessonId])

  const openLesson = (cId, lId) => {
    setChapterId(cId)
    setLessonId(lId)
    setProgress(saveEduProgress(course.storageKey, { lastLessonId: lId }))
  }

  const completeAndNext = () => {
    if (!active) return
    const nextProgress = markLessonComplete(course.storageKey, active.lesson.id)
    setProgress(nextProgress)

    const chapter = active.chapter
    const idx = chapter.lessons.findIndex((l) => l.id === active.lesson.id)
    if (idx >= 0 && idx < chapter.lessons.length - 1) {
      openLesson(chapter.id, chapter.lessons[idx + 1].id)
      return
    }
    const cIdx = chapters.findIndex((c) => c.id === chapter.id)
    if (cIdx >= 0 && cIdx < chapters.length - 1) {
      const nextChapter = chapters[cIdx + 1]
      openLesson(nextChapter.id, nextChapter.lessons[0].id)
      return
    }
    setLessonId(null)
    setChapterId(null)
  }

  if (active) {
    const { chapter, lesson } = active
    const title = de ? lesson.titleDe : lesson.titleEn
    const body = de ? lesson.bodyDe : lesson.bodyEn
    const keys = de ? lesson.keyPointsDe : lesson.keyPointsEn
    const completed = isLessonComplete(lesson.id, progress)
    const deepLink = sourceUrl(lesson.sourcePath, course.sourceBase, course.handbookUrl)

    return (
      <div className="w-full min-w-0 max-w-full pb-8">
        <header className="safe-top mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setLessonId(null)}
            className="flex items-center gap-1 text-sm text-slate-400"
          >
            <ChevronLeft className="h-4 w-4" />
            {de ? 'Kapitel' : 'Chapter'}
          </button>
          <AiLanguageTabs language={language} onChange={setLanguage} compact />
        </header>

        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-400">
          {de ? chapter.titleDe : chapter.titleEn} · {lesson.minutes} min
        </p>
        <h1 className="mb-3 text-xl font-bold text-white">{title}</h1>

        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
          {de
            ? 'Nur Bildung — keine Anlage-, Steuer- oder Rechtsberatung. Keine Kaufempfehlungen.'
            : 'Education only — not investment, tax, or legal advice. No product recommendations.'}
        </div>

        <div className="mb-4 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
          <GuideMarkdown>{body}</GuideMarkdown>
        </div>

        <div className="mb-4 rounded-xl bg-slate-800/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {de ? 'Merksätze' : 'Key takeaways'}
          </p>
          <ul className="space-y-1.5">
            {keys.map((k) => (
              <li key={k} className="flex gap-2 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={deepLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex w-full items-center justify-between gap-2 rounded-xl border border-brand-500/30 bg-brand-950/40 px-3 py-3 text-sm text-brand-100"
        >
          <span className="min-w-0">{de ? course.deepenDe : course.deepenEn}</span>
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
        </a>

        <button
          type="button"
          onClick={completeAndNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold shadow-lg shadow-brand-600/25"
        >
          {completed
            ? de
              ? 'Weiter'
              : 'Continue'
            : de
              ? 'Als gelesen markieren & weiter'
              : 'Mark read & continue'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const chapter = chapterId ? chapters.find((c) => c.id === chapterId) : null

  if (chapterId && chapter) {
    const chapterDone = chapter.lessons.filter((l) => isLessonComplete(l.id, progress)).length

    return (
      <div className="w-full min-w-0 max-w-full pb-8">
        <header className="safe-top mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setChapterId(null)}
            className="flex items-center gap-1 text-sm text-slate-400"
          >
            <ChevronLeft className="h-4 w-4" />
            {de ? 'Übersicht' : 'Overview'}
          </button>
          <AiLanguageTabs language={language} onChange={setLanguage} compact />
        </header>

        <div className="mb-1 flex items-center gap-2 text-brand-400">
          <ChapterIcon name={chapter.icon} className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {de ? `Kapitel ${chapter.number}` : `Chapter ${chapter.number}`}
          </span>
        </div>
        <h1 className="mb-1 text-xl font-bold">{de ? chapter.titleDe : chapter.titleEn}</h1>
        <p className="mb-4 text-sm text-slate-400">{de ? chapter.blurbDe : chapter.blurbEn}</p>
        <p className="mb-3 text-xs text-slate-500">
          {chapterDone}/{chapter.lessons.length} {de ? 'Lektionen erledigt' : 'lessons done'}
        </p>

        <div className="space-y-2">
          {chapter.lessons.map((lesson, i) => {
            const doneLesson = isLessonComplete(lesson.id, progress)
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => openLesson(chapter.id, lesson.id)}
                className="flex w-full items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-800/70 p-3.5 text-left transition-colors hover:border-brand-500/40"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    doneLesson
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {doneLesson ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-white">
                    {de ? lesson.titleDe : lesson.titleEn}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">~{lesson.minutes} min</span>
                </span>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const resume = progress.lastLessonId
    ? chapters
        .flatMap((c) => c.lessons.map((l) => ({ chapterId: c.id, lesson: l })))
        .find((x) => x.lesson.id === progress.lastLessonId)
    : null

  const CourseIcon = ICONS[course.icon] || GraduationCap

  return (
    <div className="w-full min-w-0 max-w-full pb-8">
      <header className="safe-top mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-400"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel || (de ? 'Kurse' : 'Courses')}
        </button>
        <AiLanguageTabs language={language} onChange={setLanguage} compact />
      </header>

      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-300">
          <CourseIcon className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl">
            {de ? course.titleDe : course.titleEn}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {de ? course.taglineDe : course.taglineEn}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>{de ? 'Fortschritt' : 'Progress'}</span>
          <span>
            {done}/{total} · {pct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {resume && (
          <button
            type="button"
            onClick={() => openLesson(resume.chapterId, resume.lesson.id)}
            className="mt-3 w-full rounded-xl bg-brand-600/90 py-2.5 text-sm font-semibold"
          >
            {de ? 'Weiterlernen' : 'Continue learning'}
          </button>
        )}
      </div>

      <div className="mb-4 space-y-2">
        {chapters.map((ch) => {
          const chapterDone = ch.lessons.filter((l) => isLessonComplete(l.id, progress)).length
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setChapterId(ch.id)}
              className="premium-card flex w-full items-start gap-3 p-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-brand-300">
                <ChapterIcon name={ch.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-brand-400">{ch.number}</span>
                  <span className="font-semibold text-white">
                    {de ? ch.titleDe : ch.titleEn}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {de ? ch.blurbDe : ch.blurbEn}
                </span>
                <span className="mt-2 block text-[11px] text-slate-500">
                  {chapterDone}/{ch.lessons.length} {de ? 'Lektionen' : 'lessons'}
                </span>
              </span>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
            </button>
          )
        })}
      </div>

      <a
        href={course.handbookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 flex w-full items-center justify-between gap-2 rounded-xl border border-slate-600 px-3 py-3 text-sm text-slate-200"
      >
        <span className="min-w-0">{de ? course.externalDe : course.externalEn}</span>
        <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      </a>

      <p className="text-[11px] leading-relaxed text-slate-500">
        {de ? course.creditDe : course.creditEn}
      </p>
    </div>
  )
}
