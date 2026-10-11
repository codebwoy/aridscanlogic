import { ExternalLink, ShieldAlert } from 'lucide-react'
import { GERMAN_FIRST_CONFIG } from '@/lib/bizstart/amazon/germanFirstConfig'
import { BILINGUAL_KIDS_CONFIG } from '@/lib/bizstart/amazon/bilingualKidsConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** German-first KDP language strategy + Börsenverein / PublishDrive source notes. */
export default function GermanFirstPanel({ lang = 'en' }) {
  const cfg = GERMAN_FIRST_CONFIG
  const bi = BILINGUAL_KIDS_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'germanFirstMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'germanFirstAnswer')}>
        <p className="text-xs leading-relaxed text-slate-200">{L(cfg.strategicAnswer)}</p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstWhyDe')}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.whyGermanGrows.verifiedNote)}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.whyGermanGrows.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'germanFirstStructural')}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.whyGermanGrows.structuralAdvantages[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {amazonT(lang, 'germanFirstWhereEn')}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.whyGermanGrows.whereEnglishWorks[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstPhases')}>
        <ul className="space-y-3">
          {cfg.phases.map((phase) => (
            <li
              key={phase.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(phase.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {phase.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstPrint')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.printEconomics.claim)}</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.printEconomics.verifiedNote)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstMarket')}>
        <p className="mb-1 text-[11px] text-slate-500">{L(cfg.marketHardNumbers.source)}</p>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.marketHardNumbers.verifiedNote)}
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColMetric')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColValue')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.marketHardNumbers.rows.map((row) => (
                <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[12rem] whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.label)}
                  </td>
                  <td className="max-w-[22rem] px-2.5 py-2 text-slate-400">{L(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          {L(cfg.marketHardNumbers.meaning)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstLangCompare')}>
        <p className="mb-1 text-[11px] text-slate-500">{L(cfg.languageCompare.source)}</p>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.languageCompare.verifiedNote)}
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColMetric')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColDe')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColEn')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.languageCompare.rows.map((row) => (
                <tr key={row.metric.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[12rem] px-2.5 py-2 font-medium text-slate-200">
                    {L(row.metric)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-300">{L(row.german)}</td>
                  <td className="max-w-[12rem] px-2.5 py-2 text-slate-400">{L(row.english)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstKids')}>
        <p className="mb-1 text-[11px] text-slate-500">{L(cfg.childrenStructure.source)}</p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.childrenStructure.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstAudio')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.audiobook.claim)}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{L(cfg.audiobook.kidsAngle)}</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.audiobook.verifiedNote)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstTween')}>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.tweenRisk.claim)}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{L(cfg.tweenRisk.meaning)}</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
          {L(cfg.tweenRisk.verifiedNote)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'germanFirstBilingual')}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.bilingual.noHardData)}</p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.bilingual.structuralLogic[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'bilingualKidsTitle')}>
        <p className="mb-2 text-[11px] leading-relaxed text-slate-500">
          {amazonT(lang, 'bilingualKidsMeta')} · {bi.lastVerified}
          <span className="block text-slate-600">{bi.sourceLabel}</span>
        </p>
        <p className="mb-2 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{L(bi.independenceDisclaimer)}</span>
        </p>
        <p className="mb-3 text-xs font-medium leading-relaxed text-slate-200">{L(bi.verdict)}</p>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.provenPairs.heading)}
        </p>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">{L(bi.provenPairs.note)}</p>
        <div className="mb-3 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColPair')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColEvidence')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColStatus')}
                </th>
              </tr>
            </thead>
            <tbody>
              {bi.provenPairs.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.pair)}
                  </td>
                  <td className="max-w-[18rem] px-2.5 py-2 text-slate-400">{L(row.evidence)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.africanPairs.heading)}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {bi.africanPairs.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.opportunityLogic.heading)}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {bi.opportunityLogic.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.pairAssessments.heading)}
        </p>
        <ul className="mb-3 space-y-2">
          {bi.pairAssessments.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(item.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {item.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.strategy.heading)}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {bi.strategy.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {L(bi.proofExamples.heading)}
        </p>
        <p className="mb-1.5 text-[11px] leading-relaxed text-amber-100/80">{L(bi.proofExamples.note)}</p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {bi.proofExamples.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {amazonT(lang, 'bilingualKidsSummary')}
        </p>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColPair')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColPotential')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColComp')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'bilingualKidsColRec')}
                </th>
              </tr>
            </thead>
            <tbody>
              {bi.summaryTable.map((row) => (
                <tr key={row.pair.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.pair)}
                  </td>
                  <td className="max-w-[12rem] px-2.5 py-2 text-slate-300">{L(row.potential)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">
                    {L(row.competition)}
                  </td>
                  <td className="max-w-[14rem] px-2.5 py-2 text-slate-400">{L(row.recommended)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-2 text-xs font-medium leading-relaxed text-slate-200">{L(bi.conclusion)}</p>
        <div className="flex flex-wrap gap-2">
          {bi.links.map((link) => (
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

      <ConfigBlock title={amazonT(lang, 'germanFirstStrategy')}>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColStrategy')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColSupport')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'germanFirstColRisk')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.strategyTable.map((row) => (
                <tr key={row.strategy.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[12rem] px-2.5 py-2 font-medium text-slate-200">
                    {L(row.strategy)}
                  </td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">{L(row.support)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.risk)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-200">{L(cfg.conclusion)}</p>
      </ConfigBlock>

      <div className="flex flex-wrap gap-2">
        {cfg.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-3 text-xs font-semibold text-slate-200"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {link.label}
          </a>
        ))}
      </div>
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
