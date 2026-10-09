import { useState } from 'react'
import {
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  ClipboardList,
  Coins,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import {
  GEWERBE_GUIDE_SOURCE,
  ONLINE_PORTAL_HINTS,
  getGuideSections,
  getChecklist,
  getCostRows,
} from '@/lib/bizstart/gewerbeGuide'
import { gewerbeT } from '@/lib/bizstart/gewerbeI18n'

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 text-sm font-semibold text-slate-100">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? <div className="space-y-2 border-t border-slate-700/60 px-3.5 py-3">{children}</div> : null}
    </div>
  )
}

export default function GewerbeInfoGuide({ lang = 'de' }) {
  const sections = getGuideSections(lang)
  const checklist = getChecklist(lang)
  const costs = getCostRows(lang)
  const howSteps = [
    { n: '01', title: gewerbeT(lang, 'howTo1Title'), text: gewerbeT(lang, 'howTo1') },
    { n: '02', title: gewerbeT(lang, 'howTo2Title'), text: gewerbeT(lang, 'howTo2') },
    { n: '03', title: gewerbeT(lang, 'howTo3Title'), text: gewerbeT(lang, 'howTo3') },
  ]

  return (
    <div className="premium-card space-y-5 border border-brand-500/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-base font-bold text-brand-100">
            <BookOpen className="h-4 w-4 text-brand-300" aria-hidden />
            {gewerbeT(lang, 'howToTitle')}
          </p>
          <p className="mt-1 text-sm text-slate-400">{gewerbeT(lang, 'howToIntro')}</p>
        </div>
        <a
          href={GEWERBE_GUIDE_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-2.5 py-1.5 text-[11px] font-medium text-brand-200 hover:border-brand-500/50"
        >
          <ExternalLink className="h-3 w-3" />
          {GEWERBE_GUIDE_SOURCE.name}
        </a>
      </div>

      <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100/90">
        {lang === 'de' ? GEWERBE_GUIDE_SOURCE.noteDe : GEWERBE_GUIDE_SOURCE.noteEn}
      </p>

      {/* 3-step process */}
      <div className="space-y-3">
        {howSteps.map((s) => (
          <div key={s.n} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/35 text-xs font-bold text-brand-100">
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-100">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Costs */}
      <AccordionItem
        title={
          <span className="inline-flex items-center gap-2">
            <Coins className="h-3.5 w-3.5 text-amber-300" />
            {lang === 'de' ? 'Kosten & Gebühren (Überblick)' : 'Costs & fees (overview)'}
          </span>
        }
        defaultOpen
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500">
                <th className="pb-2 font-medium">{lang === 'de' ? 'Posten' : 'Item'}</th>
                <th className="pb-2 font-medium">{lang === 'de' ? 'typisch' : 'typical'}</th>
                <th className="pb-2 font-medium">{lang === 'de' ? 'Hinweis' : 'Note'}</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((row) => (
                <tr key={row.item} className="border-b border-slate-800/80 text-slate-300">
                  <td className="py-2 pr-2 font-medium text-slate-200">{row.item}</td>
                  <td className="py-2 pr-2 tabular-nums text-brand-200">{row.range}</td>
                  <td className="py-2 text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-500">
          {lang === 'de'
            ? 'Online ist die Gebühr meist gleich wie vor Ort — Ziel ist Zeitersparnis, nicht ein günstigerer Preis.'
            : 'Online fees are usually the same as in person — the goal is time saved, not a lower price.'}
        </p>
      </AccordionItem>

      {/* Checklist */}
      <AccordionItem
        title={
          <span className="inline-flex items-center gap-2">
            <ClipboardList className="h-3.5 w-3.5 text-emerald-300" />
            {lang === 'de' ? 'Checkliste vor dem Absenden' : 'Checklist before you submit'}
          </span>
        }
      >
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item} className="flex gap-2 text-xs text-slate-300">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </AccordionItem>

      {/* Topic sections */}
      {sections.map((sec, i) => (
        <AccordionItem key={sec.id} title={sec.title} defaultOpen={i === 0}>
          {sec.body.map((p) => (
            <p key={p.slice(0, 40)} className="text-xs leading-relaxed text-slate-400">
              {p}
            </p>
          ))}
        </AccordionItem>
      ))}

      {/* Portal hints */}
      <AccordionItem
        title={lang === 'de' ? 'Beispiele offline / Online-Portale' : 'Example online portals'}
      >
        <p className="mb-2 text-[11px] text-slate-500">
          {lang === 'de'
            ? 'Verfügbarkeit und Identifikation variieren je Kommune. Immer die offizielle Stadt-/Landeswebsite prüfen.'
            : 'Availability and ID checks vary by municipality. Always verify the official city/state site.'}
        </p>
        <ul className="space-y-1.5">
          {ONLINE_PORTAL_HINTS.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 hover:text-brand-200"
              >
                <ExternalLink className="h-3 w-3" />
                {lang === 'de' ? p.de : p.en}
              </a>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <div className="flex gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
        <p className="text-[11px] leading-relaxed text-rose-100/90">
          {lang === 'de'
            ? 'Kein Drittanbieter ersetzt das Gewerbeamt. Zahlen Sie nicht für „amtliche“ Sofort-Anmeldungen ohne klaren kommunalen Bezug.'
            : 'No third party replaces the trade office. Do not pay for “official” instant filings without a clear municipal link.'}
        </p>
      </div>
    </div>
  )
}
