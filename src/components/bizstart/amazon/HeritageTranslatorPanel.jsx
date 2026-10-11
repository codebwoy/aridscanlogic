import { ExternalLink, ShieldAlert } from 'lucide-react'
import { HERITAGE_TRANSLATOR_CONFIG } from '@/lib/bizstart/amazon/heritageTranslatorConfig'
import { amazonT } from '@/lib/bizstart/amazon/i18n'

/** Find & verify Twi / Igbo translators for bilingual kids books. */
export default function HeritageTranslatorPanel({ lang = 'en' }) {
  const cfg = HERITAGE_TRANSLATOR_CONFIG
  const L = (obj) => obj?.[lang] || obj?.en || ''

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-slate-500">
        {amazonT(lang, 'heritageTranslatorMeta')} · {cfg.lastVerified}
        <span className="block text-slate-600">{cfg.sourceLabel}</span>
      </p>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/90">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{L(cfg.independenceDisclaimer)}</span>
      </p>

      <ConfigBlock title={amazonT(lang, 'heritageTranslatorIntro')}>
        <p className="text-xs leading-relaxed text-slate-200">{L(cfg.intro)}</p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.machineTools.heading)}>
        <div className="mb-2 overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColTool')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColRel')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColWhy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.machineTools.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/80 last:border-0">
                  <td className="whitespace-nowrap px-2.5 py-2 font-medium text-slate-200">
                    {L(row.tool)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-300">
                    {L(row.reliability)}
                  </td>
                  <td className="max-w-[16rem] px-2.5 py-2 text-slate-400">{L(row.why)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs font-medium leading-relaxed text-slate-200">
          {L(cfg.machineTools.conclusion)}
        </p>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.twi.heading)}>
        <ul className="space-y-3">
          {cfg.twi.options.map((opt) => (
            <li
              key={opt.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(opt.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {opt.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {opt.postTemplate ? (
                <p className="mt-2 rounded-lg border border-slate-700/80 bg-slate-950/50 px-2.5 py-2 text-[11px] leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {amazonT(lang, 'heritageTranslatorPost')}:{' '}
                  </span>
                  {L(opt.postTemplate)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.igbo.heading)}>
        <ul className="space-y-3">
          {cfg.igbo.options.map((opt) => (
            <li
              key={opt.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-100">{L(opt.title)}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
                {opt.bullets[lang]?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.verify.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.verify.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.brief.heading)}>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.brief.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.costs.heading)}>
        <p className="mb-2 text-[11px] leading-relaxed text-amber-100/80">{L(cfg.costs.note)}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-max min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColSource')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColTwi')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColIgbo')}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2 font-semibold">
                  {amazonT(lang, 'heritageTranslatorColRel')}
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.costs.rows.map((row) => (
                <tr key={row.source.en} className="border-b border-slate-800/80 last:border-0">
                  <td className="max-w-[12rem] px-2.5 py-2 font-medium text-slate-200">
                    {L(row.source)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.twi)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-slate-400">{L(row.igbo)}</td>
                  <td className="max-w-[10rem] px-2.5 py-2 text-slate-400">
                    {L(row.reliability)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConfigBlock>

      <ConfigBlock title={L(cfg.marketSignal.heading)}>
        <ul className="mb-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-300">
          {cfg.marketSignal.bullets[lang]?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-xs font-medium leading-relaxed text-slate-200">{L(cfg.takeaway)}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cfg.links.map((link) => (
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
