import { ExternalLink, ShieldAlert } from 'lucide-react'
import { KDP_CONFIG } from '@/lib/bizstart/amazon/kdpConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'
import { launchStoryforgeDesktop, notifyStoryforgeLaunchResult } from '@/lib/storyforge/launch'
import { toast } from 'sonner'

/**
 * Config-backed KDP requirements for Germany (account, eggs-in-one-basket, tax ⚠, book, picture-book tech).
 */
export default function KdpConfigPanel({ lang = 'en', onOpenStoryforge, onOpenPlaybook }) {
  const cfg = KDP_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''
  const eggs = cfg.eggsInOneBasket

  async function openLaunchpad() {
    if (onOpenStoryforge) {
      await onOpenStoryforge('launchpad')
      return
    }
    const result = await launchStoryforgeDesktop({ view: 'launchpad' })
    notifyStoryforgeLaunchResult((key) => amazonT(lang, key), result, toast)
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'kdpConfigMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'kdpAccountReqs')}>
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
              {cfg.accountRequirements.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
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

      <ConfigBlock title={amazonT(lang, 'kdpEggsTitle')}>
        <p className="text-[11px] leading-relaxed text-slate-400">{amazonT(lang, 'kdpEggsHint')}</p>

        <p className="mb-1.5 mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpEggsWhy')}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(eggs.why[lang] || eggs.why.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpEggsWide')}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(eggs.strategy1Wide[lang] || eggs.strategy1Wide.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpEggsDach')}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(eggs.strategy1Dach[lang] || eggs.strategy1Dach.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mb-3 overflow-x-auto rounded-lg border border-slate-800/80">
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
              {(eggs.dachWideFit || []).map((row) => (
                <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.label)}
                  </td>
                  <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {eggs.dachDomesticReqs ? (
          <>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpEggsDachLegal')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(eggs.dachDomesticReqs.impressum[lang] || eggs.dachDomesticReqs.impressum.en).map(
                (line) => (
                  <li key={line}>{line}</li>
                ),
              )}
            </ul>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpEggsBuchpreis')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                eggs.dachDomesticReqs.buchpreisbindung[lang] ||
                eggs.dachDomesticReqs.buchpreisbindung.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpEggsDachAdmin')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                eggs.dachDomesticReqs.accountAdmin[lang] || eggs.dachDomesticReqs.accountAdmin.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpEggsDachFiles')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                eggs.dachDomesticReqs.filesDeposit[lang] || eggs.dachDomesticReqs.filesDeposit.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mb-3 overflow-x-auto rounded-lg border border-slate-800/80">
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
                  {eggs.dachDomesticReqs.checklist.map((row) => (
                    <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                      <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                        {L(row.label)}
                      </td>
                      <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpEggsEmail')}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {(eggs.strategy2Email[lang] || eggs.strategy2Email.en).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpEggsCompare')}
        </p>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
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
              {eggs.comparison.map((row) => (
                <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.label)}
                  </td>
                  <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-amber-100/80">{L(eggs.verifiedNote)}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {eggs.links.map((link) => (
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
          {onOpenPlaybook && eggs.hubGuideId ? (
            <button
              type="button"
              onClick={() => onOpenPlaybook(eggs.hubGuideId)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-brand-500/40 bg-brand-950/40 px-3 py-2 text-xs font-semibold text-brand-100"
            >
              {amazonT(lang, 'kdpEggsOpenPlaybook')}
            </button>
          ) : null}
        </div>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpTaxTitle')}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpTaxUs')}
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.tax.usForms[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-slate-300">{L(cfg.tax.treatyClaim.value)}</p>
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.tax.treatyClaim.verifiedNote)}</p>

        {cfg.tax.authorRegistration ? (
          <>
            <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpTaxAuthorReg')}
            </p>
            <p className="text-xs leading-relaxed text-slate-300">
              {L(cfg.tax.authorRegistration.intro)}
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
              {L(cfg.tax.authorRegistration.verifiedNote)}
            </p>
            <p className="mb-1.5 mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpTaxGewerbe')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                cfg.tax.authorRegistration.gewerbeVsFreelance[lang] ||
                cfg.tax.authorRegistration.gewerbeVsFreelance.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpTaxNumbers')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                cfg.tax.authorRegistration.taxNumbers[lang] ||
                cfg.tax.authorRegistration.taxNumbers.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {amazonT(lang, 'kdpTaxSetupSteps')}
            </p>
            <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
              {(
                cfg.tax.authorRegistration.setupSteps[lang] ||
                cfg.tax.authorRegistration.setupSteps.en
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mb-3 overflow-x-auto rounded-lg border border-slate-800/80">
              <table className="w-max min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                      {amazonT(lang, 'tableNeed')}
                    </th>
                    <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                      {amazonT(lang, 'kdpTaxStatus')}
                    </th>
                    <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                      {amazonT(lang, 'tableDetail')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cfg.tax.authorRegistration.checklist.map((row) => (
                    <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                      <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                        {L(row.label)}
                      </td>
                      <td className="whitespace-nowrap px-2.5 py-2 font-medium text-brand-200">
                        {L(row.status)}
                      </td>
                      <td className="max-w-[18rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {amazonT(lang, 'kdpTaxDe')}
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.tax.germanDomestic[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          {L(cfg.tax.kleinunternehmerHint.value)}
        </p>
        <p className="mt-1.5 text-[11px] text-amber-100/80">
          {L(cfg.tax.kleinunternehmerHint.verifiedNote)}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(cfg.tax.links || [{ label: 'BzSt', url: cfg.bzstUrl }]).map((link) => (
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
          {onOpenPlaybook && cfg.tax.hubGuideId ? (
            <button
              type="button"
              onClick={() => onOpenPlaybook(cfg.tax.hubGuideId)}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
            >
              {amazonT(lang, 'kdpTaxOpenPlaybook')}
            </button>
          ) : null}
        </div>
      </ConfigBlock>

      {cfg.planToWin ? (
        <ConfigBlock title={amazonT(lang, 'kdpPlanToWinTitle')}>
          <p className="text-xs font-medium leading-relaxed text-brand-100">{L(cfg.planToWin.chain)}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{L(cfg.planToWin.intro)}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
            {(cfg.planToWin.pillars[lang] || cfg.planToWin.pillars.en).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-2 mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-max min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                    {amazonT(lang, 'planToWinMetric')}
                  </th>
                  <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                    {amazonT(lang, 'planToWinWinning')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cfg.planToWin.matrix.map((row) => (
                  <tr key={row.metric.en} className="border-b border-slate-800/80 last:border-0">
                    <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                      {L(row.metric)}
                    </td>
                    <td className="max-w-[18rem] px-2.5 py-2 text-slate-400">{L(row.winning)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {onOpenPlaybook && cfg.planToWin.hubGuideId ? (
            <button
              type="button"
              onClick={() => onOpenPlaybook(cfg.planToWin.hubGuideId)}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
            >
              {amazonT(lang, 'kdpPlanToWinOpen')}
            </button>
          ) : null}
        </ConfigBlock>
      ) : null}

      {cfg.altEcosystems ? (
        <ConfigBlock title={amazonT(lang, 'kdpAltEcoTitle')}>
          <p className="text-xs leading-relaxed text-slate-300">{L(cfg.altEcosystems.intro)}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
            {(cfg.altEcosystems.lanes[lang] || cfg.altEcosystems.lanes.en).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-3 overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-max min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                    {amazonT(lang, 'altEcoColOpportunity')}
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
                {cfg.altEcosystems.matrix.map((row) => (
                  <tr key={row.opportunity.en} className="border-b border-slate-800/80 last:border-0">
                    <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                      {L(row.opportunity)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">{L(row.margins)}</td>
                    <td className="max-w-[12rem] px-2.5 py-2 text-slate-400">{L(row.skill)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs font-medium leading-relaxed text-brand-100">
            {L(cfg.altEcosystems.pickPath)}
          </p>
          {onOpenPlaybook && cfg.altEcosystems.hubGuideId ? (
            <button
              type="button"
              onClick={() => onOpenPlaybook(cfg.altEcosystems.hubGuideId)}
              className="mt-2 inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
            >
              {amazonT(lang, 'kdpAltEcoOpen')}
            </button>
          ) : null}
        </ConfigBlock>
      ) : null}

      {cfg.hiddenPitfalls ? (
        <ConfigBlock title={amazonT(lang, 'kdpPitfallsTitle')}>
          <p className="text-xs leading-relaxed text-slate-300">{L(cfg.hiddenPitfalls.intro)}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
            {L(cfg.hiddenPitfalls.verifiedNote)}
          </p>
          {[
            ['aiDisclosure', 'kdpPitfallsAi'],
            ['titleSubtitle', 'kdpPitfallsTitleMeta'],
            ['forbiddenKeywords', 'kdpPitfallsKeywords'],
            ['isbnOwnership', 'kdpPitfallsIsbn'],
            ['bleedMargins', 'kdpPitfallsBleed'],
          ].map(([key, i18nKey]) => (
            <div key={key} className="mt-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {amazonT(lang, i18nKey)}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {(cfg.hiddenPitfalls[key][lang] || cfg.hiddenPitfalls[key].en).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-2 mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
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
                {cfg.hiddenPitfalls.checklist.map((row) => (
                  <tr key={row.label.en} className="border-b border-slate-800/80 last:border-0">
                    <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                      {L(row.label)}
                    </td>
                    <td className="max-w-[20rem] px-2.5 py-2 text-slate-400">{L(row.detail)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2">
            {cfg.hiddenPitfalls.links.map((link) => (
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
            {onOpenPlaybook && cfg.hiddenPitfalls.hubGuideId ? (
              <button
                type="button"
                onClick={() => onOpenPlaybook(cfg.hiddenPitfalls.hubGuideId)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-100"
              >
                {amazonT(lang, 'kdpPitfallsOpenPlaybook')}
              </button>
            ) : null}
          </div>
        </ConfigBlock>
      ) : null}

      <ConfigBlock title={amazonT(lang, 'kdpBookReqs')}>
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
              {cfg.bookRequirements.map((row) => (
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

      <ConfigBlock title={amazonT(lang, 'kdpPictureTech')}>
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
              {cfg.pictureBookTech.rows.map((row) => (
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
        <p className="mt-1.5 text-[11px] text-amber-100/80">{L(cfg.pictureBookTech.verifiedNote)}</p>
        <button
          type="button"
          onClick={openLaunchpad}
          className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 text-xs font-semibold text-brand-100 sm:w-auto"
        >
          {amazonT(lang, 'kdpStoryforgeCta')}
        </button>
      </ConfigBlock>

      <ConfigBlock title={amazonT(lang, 'kdpThisWeek')}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.startThisWeek[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <a
        href={cfg.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white sm:w-auto"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        {amazonT(lang, 'kdpApplyCta')}
      </a>
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
