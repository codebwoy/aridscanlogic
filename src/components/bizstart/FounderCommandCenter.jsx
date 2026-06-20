import { LayoutDashboard, ChevronRight, Target, FileText, AlertTriangle, FileUser, Mail } from 'lucide-react'
import { buildFounderCommandCenter } from '@/lib/bizstart/commandCenter'
import { readinessColor } from '@/lib/bizstart/businessPlanReadiness'

const STATUS_DOT = {
  confirmed: 'bg-emerald-400',
  submitted: 'bg-blue-400',
  in_progress: 'bg-amber-400',
  not_started: 'bg-slate-600',
}

export default function FounderCommandCenter({ lang, formData, stepStatus, onNavigate }) {
  const cc = buildFounderCommandCenter(formData, stepStatus, lang)

  return (
    <div className="premium-card mb-4 overflow-hidden p-0">
      <div className="border-b border-slate-700/80 bg-gradient-to-r from-brand-900/40 to-indigo-900/30 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-brand-300" aria-hidden />
            <div>
              <p className="text-sm font-bold text-slate-100">
                {lang === 'de' ? 'Gründer-Übersicht' : 'Founder command center'}
              </p>
              <p className="text-[11px] text-slate-400">
                {lang === 'de' ? 'Registrierung & Businessplan auf einen Blick' : 'Registration & business plan at a glance'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold tabular-nums ${readinessColor(cc.overallScore)}`}>
              {cc.overallScore}%
            </p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              {lang === 'de' ? 'Gesamt' : 'Overall'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Target}
          label={lang === 'de' ? 'Registrierung' : 'Registration'}
          value={`${cc.registrationScore}%`}
          sub={lang === 'de' ? `${cc.nextSteps.length} offen` : `${cc.nextSteps.length} open`}
        />
        <MetricCard
          icon={FileText}
          label={lang === 'de' ? 'Businessplan' : 'Business plan'}
          value={cc.planStarted ? `${cc.planReadiness.score}%` : '—'}
          sub={
            cc.planComplete
              ? lang === 'de'
                ? 'Abgeschlossen'
                : 'Complete'
              : cc.planStarted
                ? cc.planAudience
                : lang === 'de'
                  ? 'Noch nicht gestartet'
                  : 'Not started'
          }
        />
        <MetricCard
          icon={FileUser}
          label={lang === 'de' ? 'Lebenslauf' : 'CV'}
          value={cc.cvScore > 0 ? `${cc.cvScore}%` : '—'}
          sub={
            cc.cvReady
              ? lang === 'de'
                ? 'Anhang bereit'
                : 'Annex ready'
              : lang === 'de'
                ? 'Für Förderung empfohlen'
                : 'Recommended for funding'
          }
        />
        <MetricCard
          icon={Mail}
          label={lang === 'de' ? 'Anschreiben' : 'Cover letter'}
          value={cc.letterScore > 0 ? `${cc.letterScore}%` : '—'}
          sub={
            cc.letterReady
              ? lang === 'de'
                ? 'DIN 5008 bereit'
                : 'DIN 5008 ready'
              : lang === 'de'
                ? 'Für Bewerbung & Förderung'
                : 'For jobs & funding'
          }
        />
      </div>

      {cc.planTitle && (
        <p className="px-4 pb-2 text-xs text-slate-400">
          {lang === 'de' ? 'Plan' : 'Plan'}: <span className="text-slate-300">{cc.planTitle}</span>
        </p>
      )}

      {cc.blockers.length > 0 && (
        <div className="border-t border-slate-800 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            {lang === 'de' ? 'Als Nächstes' : 'Up next'}
          </p>
          <ul className="space-y-2">
            {cc.blockers.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(b.screen)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-800/60 px-3 py-2 text-left text-xs hover:bg-slate-800"
                >
                  <div>
                    <p className="font-medium text-slate-200">{b.label}</p>
                    <p className="text-slate-500">{b.detail}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-400" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cc.nextSteps.length > 0 && (
        <div className="border-t border-slate-800 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {lang === 'de' ? 'Schritte' : 'Steps'}
          </p>
          <ul className="space-y-1.5">
            {cc.nextSteps.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(s.id === 'structure' ? 'structure' : s.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-slate-800/50"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[s.status]}`} />
                  <span className="flex-1 text-slate-300">{s.label}</span>
                  <span className="text-slate-600">~{s.estMin}m</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-800 px-4 py-2 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate?.('businessPlan')}
          className="text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          {lang === 'de' ? 'Businessplan →' : 'Business plan →'}
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('lebenslauf')}
          className="text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          {lang === 'de' ? 'Lebenslauf →' : 'CV →'}
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('anschreiben')}
          className="text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          {lang === 'de' ? 'Anschreiben →' : 'Cover letter →'}
        </button>
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl bg-slate-800/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon className="h-3 w-3" aria-hidden />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold text-slate-100">{value}</p>
      <p className="truncate text-[10px] text-slate-500">{sub}</p>
    </div>
  )
}
