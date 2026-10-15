import { useMemo, useState } from 'react'
import { ExternalLink, ShieldAlert, Rocket } from 'lucide-react'
import {
  Q4_FORWARD_PLAN_CONFIG,
  loadQ4ForwardChecklist,
  saveQ4ForwardChecklist,
  q4ForwardProgress,
} from '@/lib/bizstart/amazon/q4ForwardPlanConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/**
 * Owner Q4 forward plan — tickable checklist with deep links to Hub playbooks + studios.
 */
export default function Q4ForwardPlanPanel({
  lang = 'en',
  onOpenPlaybook,
  onOpenAuthorforge,
  onOpenNovelforge,
  onOpenProofforge,
}) {
  const cfg = Q4_FORWARD_PLAN_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''
  const [state, setState] = useState(() => loadQ4ForwardChecklist())
  const progress = useMemo(() => q4ForwardProgress(state), [state])

  function toggle(id) {
    setState((prev) => {
      const next = saveQ4ForwardChecklist({
        ...prev,
        ticks: { ...prev.ticks, [id]: !prev.ticks[id] },
      })
      return next
    })
  }

  function runAction(action) {
    if (action.openPlaybook && onOpenPlaybook) onOpenPlaybook(action.openPlaybook)
    else if (action.launch === 'authorforge' && onOpenAuthorforge) onOpenAuthorforge()
    else if (action.launch === 'novelforge' && onOpenNovelforge) onOpenNovelforge()
    else if (action.launch === 'proofforge' && onOpenProofforge) onOpenProofforge()
    else if (action.openUrl) {
      window.open(action.openUrl, '_blank', 'noopener,noreferrer')
    }
  }

  function actionButtonLabel(action) {
    if (action.openPlaybook) return amazonT(lang, 'q4ForwardOpenPlaybook')
    if (action.launch === 'authorforge') return amazonT(lang, 'q4ForwardOpenAf')
    if (action.launch === 'novelforge') return amazonT(lang, 'q4ForwardOpenNf')
    if (action.launch === 'proofforge') return amazonT(lang, 'q4ForwardOpenPf')
    if (action.openUrl) return amazonT(lang, 'openLink')
    return null
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'q4ForwardMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'q4ForwardLead')}>
        <p className="text-xs font-medium leading-relaxed text-brand-100">{L(cfg.lead)}</p>
        <p className="mt-2 text-xs text-slate-400" aria-live="polite">
          {progress.checked}/{progress.total} {amazonT(lang, 'q4ForwardDone')} ({progress.percent}%)
        </p>
      </ConfigBlock>

      {cfg.pillars.map((pillar) => (
        <ConfigBlock key={pillar.id} title={L(pillar.title)}>
          <p className="mb-2 text-xs leading-relaxed text-slate-400">{L(pillar.summary)}</p>

          {pillar.milestones?.length ? (
            <ul className="mb-3 space-y-2">
              {pillar.milestones.map((m) => (
                <li key={m.id}>
                  <label className="flex min-h-[44px] cursor-pointer items-start gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 px-2.5 py-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
                      checked={!!state.ticks[m.id]}
                      onChange={() => toggle(m.id)}
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {L(m.when)}
                      </span>
                      <span className="text-xs leading-relaxed text-slate-200">{L(m.what)}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="space-y-2">
            {(pillar.actions || []).map((action) => {
              const btn = actionButtonLabel(action)
              return (
                <li key={action.id}>
                  <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-2.5 py-2">
                    <label className="flex min-h-[44px] cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
                        checked={!!state.ticks[action.id]}
                        onChange={() => toggle(action.id)}
                      />
                      <span className="min-w-0 text-xs leading-relaxed text-slate-200">
                        {L(action.label)}
                        {action.note ? (
                          <span className="mt-1 block text-[11px] text-slate-500">{L(action.note)}</span>
                        ) : null}
                      </span>
                    </label>
                    {btn ? (
                      <button
                        type="button"
                        onClick={() => runAction(action)}
                        className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100"
                      >
                        <Rocket className="h-3.5 w-3.5" aria-hidden />
                        {btn}
                      </button>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </ConfigBlock>
      ))}

      <div className="flex flex-wrap gap-2">
        {cfg.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-xs font-medium text-brand-200"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {link.label}
          </a>
        ))}
        {onOpenPlaybook
          ? cfg.relatedHubGuides.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onOpenPlaybook(g.id)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
              >
                {L(g.label)}
              </button>
            ))
          : null}
      </div>
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
