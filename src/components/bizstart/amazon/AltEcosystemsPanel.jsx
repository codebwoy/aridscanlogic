import { ExternalLink, ShieldAlert } from 'lucide-react'
import { AMAZON_ALT_ECOSYSTEMS_CONFIG } from '@/lib/bizstart/amazon/amazonAltEcosystemsConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** Under-explored Amazon ecosystems — elaborated cards + comparison matrix. */
export default function AltEcosystemsPanel({ lang = 'en', onOpenPlaybook }) {
  const cfg = AMAZON_ALT_ECOSYSTEMS_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'altEcoMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'altEcoIntro')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.intro)}</p>
        <p className="mt-2 text-xs font-medium leading-relaxed text-brand-100">{L(cfg.chainVsKdp)}</p>
      </ConfigBlock>

      {cfg.ecosystems.map((eco) => (
        <ConfigBlock key={eco.id} title={`${eco.number}. ${L(eco.name)}`}>
          <p className="text-xs font-medium leading-relaxed text-brand-100">{L(eco.tagline)}</p>

          {eco.businessModelShift ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoB2bShift')}</SubLabel>
              <BulletList items={eco.businessModelShift[lang] || eco.businessModelShift.en} />
            </>
          ) : null}

          <SubLabel>{amazonT(lang, 'altEcoWhat')}</SubLabel>
          <BulletList items={eco.whatYouSell[lang] || eco.whatYouSell.en} />

          <SubLabel>{amazonT(lang, 'altEcoWhyLow')}</SubLabel>
          <BulletList items={eco.whyLowCompetition[lang] || eco.whyLowCompetition.en} />

          <SubLabel>{amazonT(lang, 'altEcoPotential')}</SubLabel>
          <BulletList items={eco.potential[lang] || eco.potential.en} />

          {eco.howItWorks ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoHowItWorks')}</SubLabel>
              <BulletList items={eco.howItWorks[lang] || eco.howItWorks.en} />
            </>
          ) : null}

          {eco.techStackCore ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoTechCore')}</SubLabel>
              <BulletList items={eco.techStackCore[lang] || eco.techStackCore.en} />
            </>
          ) : null}

          {eco.techStackAws ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoTechAws')}</SubLabel>
              <BulletList items={eco.techStackAws[lang] || eco.techStackAws.en} />
            </>
          ) : null}

          {eco.cursorIde ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoCursor')}</SubLabel>
              <BulletList items={eco.cursorIde[lang] || eco.cursorIde.en} />
            </>
          ) : null}

          {eco.resolveCustomerOutline ? (
            <>
              <SubLabel>{amazonT(lang, 'altEcoResolveOutline')}</SubLabel>
              <BulletList
                items={eco.resolveCustomerOutline[lang] || eco.resolveCustomerOutline.en}
              />
            </>
          ) : null}

          <SubLabel>{amazonT(lang, 'altEcoHow')}</SubLabel>
          <BulletList items={eco.howToEnter[lang] || eco.howToEnter.en} />

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90">
                {amazonT(lang, 'altEcoSuits')}
              </p>
              <BulletList items={eco.suitsYouIf[lang] || eco.suitsYouIf.en} />
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {amazonT(lang, 'altEcoNotIdeal')}
              </p>
              <BulletList items={eco.notIdealIf[lang] || eco.notIdealIf.en} />
            </div>
          </div>

          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <MetaChip label={amazonT(lang, 'altEcoCapital')} value={L(eco.capital)} />
            <MetaChip label={amazonT(lang, 'altEcoEffort')} value={L(eco.effort)} />
            <MetaChip label={amazonT(lang, 'altEcoCompetition')} value={L(eco.competition)} />
          </dl>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{L(eco.marginNote)}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {eco.links.map((link) => (
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
            {eco.deepGuideId && onOpenPlaybook ? (
              <button
                type="button"
                onClick={() => onOpenPlaybook(eco.deepGuideId)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
              >
                {amazonT(lang, 'altEcoOpenMerch')}
              </button>
            ) : null}
          </div>
        </ConfigBlock>
      ))}

      <ConfigBlock title={amazonT(lang, 'altEcoMatrix')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'altEcoColOpportunity')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'altEcoColBarrier')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'altEcoColCompetition')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'altEcoColMargins')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'altEcoColSkill')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.comparisonMatrix.map((row) => (
                <tr key={row.opportunity.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.opportunity)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.barrier)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">
                    {L(row.competition)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.margins)}</td>
                  <td className="max-w-[12rem] px-2.5 py-2 text-slate-400">{L(row.skill)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{L(cfg.matrixFootnote)}</p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'altEcoPickPath')}>
        <BulletList items={cfg.pickPath[lang] || cfg.pickPath.en} />
      </ConfigBlock>

      {onOpenPlaybook && cfg.relatedHubGuides?.length ? (
        <div className="flex flex-wrap gap-2">
          {cfg.relatedHubGuides.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onOpenPlaybook(g.id)}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
            >
              {L(g.label)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function SubLabel({ children }) {
  return (
    <p className="mb-1 mt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </p>
  )
}

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
      {items.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

function MetaChip({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-2.5 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-200">{value}</dd>
    </div>
  )
}

function ConfigBlock({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  )
}
