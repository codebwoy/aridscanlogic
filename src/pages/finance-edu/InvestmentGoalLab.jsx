import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  Home,
  Building2,
  Briefcase,
  RotateCcw,
} from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import SafeChart from '@/components/shared/SafeChart'
import { useAiLanguage } from '@/context/AiLanguageContext'
import {
  CATEGORY_CARDS,
  GOALS,
  RISK,
  applyOptionalTaxHaircut,
  compoundGrowth,
  computeGoalLab,
  formatMoney,
  getRealReturn,
  pctLabel,
  sanitizeInputs,
} from '@/lib/finance-edu/goalLab'
import { loadGoalLabInputs, resetGoalLabInputs, saveGoalLabInputs } from '@/lib/finance-edu/goalLabStore'

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function inputClass() {
  return 'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500'
}

function ProgressBar({ value, label }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const GOAL_OPTIONS = [
  {
    id: GOALS.rent,
    Icon: Home,
    de: 'Miete / Lebenshaltung absichern',
    en: 'Cover rent / living costs',
    hintDe: 'Zielvermögen aus Jahreskosten ÷ Entnahmerate',
    hintEn: 'Target = annual costs ÷ withdrawal rate',
  },
  {
    id: GOALS.property,
    Icon: Building2,
    de: 'Kapital für Bar-Immobilienkauf',
    en: 'Capital for all-cash property',
    hintDe: 'Sparziel bis zum Kaufpreis (ohne Finanzierung)',
    hintEn: 'Savings target toward purchase price (no mortgage)',
  },
  {
    id: GOALS.business,
    Icon: Briefcase,
    de: 'Geschäft vs. Markt reinvestieren',
    en: 'Business vs market reinvestment',
    hintDe: 'ROE im Betrieb vs. globale Aktienrendite vergleichen',
    hintEn: 'Compare business ROE vs assumed equity return',
  },
]

function buildProjectionSeries(inputs, projectedNet) {
  const years = Math.max(1, Math.round(inputs.horizonYears))
  const step = years <= 15 ? 1 : years <= 30 ? 2 : 5
  const r = getRealReturn(inputs.risk)
  const annualPmt = inputs.monthlySurplus * 12
  const points = []

  for (let y = 0; y <= years; y += step) {
    const gross = compoundGrowth(inputs.liquidNetWorth, annualPmt, r, y)
    const adj = applyOptionalTaxHaircut(gross, inputs.liquidNetWorth, {
      ...inputs,
      horizonYears: Math.max(y, 0.01),
    })
    points.push({ year: y, value: Math.round(adj.terminalNet) })
  }

  if (points[points.length - 1]?.year !== years) {
    points.push({ year: years, value: Math.round(projectedNet) })
  }
  return points
}

export default function InvestmentGoalLab({ onBack }) {
  const { language, setLanguage } = useAiLanguage()
  const de = language !== 'en'
  const locale = de ? 'de-DE' : 'en-GB'

  const [inputs, setInputs] = useState(() => loadGoalLabInputs())
  const result = useMemo(() => computeGoalLab(inputs), [inputs])
  const projectionSeries = useMemo(
    () => buildProjectionSeries(inputs, result.projectedNet),
    [inputs, result.projectedNet]
  )

  const patch = (partial) => {
    setInputs((prev) => {
      const next = sanitizeInputs({ ...prev, ...partial })
      saveGoalLabInputs(next)
      return next
    })
  }

  const money = (n) => formatMoney(n, inputs.currency, locale)

  const sleeveData = result.sleeveChart.map((s) => ({
    ...s,
    name: de ? s.nameDe : s.nameEn,
    pct: Math.round(s.value * 100),
  }))

  const goalMeta = GOAL_OPTIONS.find((g) => g.id === inputs.goal) || GOAL_OPTIONS[0]

  return (
    <div className="w-full min-w-0 max-w-full pb-10">
      <header className="safe-top mb-4 flex items-center justify-between gap-2">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-slate-400">
          <ChevronLeft className="h-4 w-4" />
          {de ? 'Finanz-Bildung' : 'Finance education'}
        </button>
        <AiLanguageTabs language={language} onChange={setLanguage} compact />
      </header>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {de ? 'Zielrechner & Allokations-Szenarien' : 'Goal lab & allocation scenarios'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {de
              ? 'Bildungs-Rechner: Ziele, Sparplan-Projektion und illustrative Ärmel — keine Anlageberatung.'
              : 'Educational calculator: goals, savings projection, and illustrative sleeves — not investment advice.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInputs(resetGoalLabInputs())}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 px-2 py-1.5 text-xs text-slate-400"
          title={de ? 'Zurücksetzen' : 'Reset'}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <section className="mb-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">
          {de ? 'Primäres Ziel' : 'Primary goal'}
        </h2>
        {GOAL_OPTIONS.map(({ id, Icon, de: d, en, hintDe, hintEn }) => {
          const active = inputs.goal === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => patch({ goal: id })}
              className={`premium-card flex w-full items-start gap-3 p-3 text-left ${
                active ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">{de ? d : en}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {de ? hintDe : hintEn}
                </span>
              </span>
            </button>
          )
        })}
      </section>

      <section className="premium-card mb-4 space-y-3 p-4">
        <h2 className="text-sm font-semibold text-slate-300">
          {de ? 'Finanzprofil' : 'Financial profile'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={de ? 'Liquides Vermögen (€)' : 'Liquid net worth (€)'}>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              className={inputClass()}
              value={inputs.liquidNetWorth}
              onChange={(e) => patch({ liquidNetWorth: e.target.value })}
            />
          </Field>
          <Field label={de ? 'Monatlicher Sparbetrag (€)' : 'Monthly investable surplus (€)'}>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              className={inputClass()}
              value={inputs.monthlySurplus}
              onChange={(e) => patch({ monthlySurplus: e.target.value })}
            />
          </Field>
          <Field label={de ? 'Horizont (Jahre)' : 'Horizon (years)'}>
            <input
              type="range"
              min={1}
              max={40}
              value={inputs.horizonYears}
              onChange={(e) => patch({ horizonYears: Number(e.target.value) })}
              className="w-full accent-brand-500"
            />
            <span className="mt-1 block text-xs text-brand-300">
              {inputs.horizonYears} {de ? 'Jahre' : 'years'}
            </span>
          </Field>
          <Field label={de ? 'Risikoband' : 'Risk band'}>
            <select
              className={inputClass()}
              value={inputs.risk}
              onChange={(e) => patch({ risk: e.target.value })}
            >
              <option value={RISK.conservative}>{de ? 'Konservativ' : 'Conservative'}</option>
              <option value={RISK.balanced}>{de ? 'Ausgewogen' : 'Balanced'}</option>
              <option value={RISK.aggressive}>{de ? 'Offensiv' : 'Aggressive'}</option>
            </select>
          </Field>
        </div>

        {inputs.goal === GOALS.rent && (
          <div className="grid gap-3 border-t border-slate-800 pt-3 sm:grid-cols-2">
            <Field label={de ? 'Jährliche Lebens-/Mietkosten (€)' : 'Annual living / rent costs (€)'}>
              <input
                type="number"
                min={0}
                className={inputClass()}
                value={inputs.annualLivingCost}
                onChange={(e) => patch({ annualLivingCost: e.target.value })}
              />
            </Field>
            <Field
              label={
                de
                  ? `Sichere Entnahmerate (${pctLabel(inputs.safeWithdrawalRate, locale)})`
                  : `Safe withdrawal rate (${pctLabel(inputs.safeWithdrawalRate, locale)})`
              }
            >
              <input
                type="range"
                min={2}
                max={6}
                step={0.25}
                value={inputs.safeWithdrawalRate * 100}
                onChange={(e) => patch({ safeWithdrawalRate: Number(e.target.value) / 100 })}
                className="w-full accent-brand-500"
              />
            </Field>
          </div>
        )}

        {inputs.goal === GOALS.property && (
          <div className="border-t border-slate-800 pt-3">
            <Field label={de ? 'Ziel Kaufpreis bar (€)' : 'All-cash purchase target (€)'}>
              <input
                type="number"
                min={0}
                className={inputClass()}
                value={inputs.propertyTarget}
                onChange={(e) => patch({ propertyTarget: e.target.value })}
              />
            </Field>
          </div>
        )}

        {inputs.goal === GOALS.business && (
          <div className="grid gap-3 border-t border-slate-800 pt-3 sm:grid-cols-2">
            <Field label={de ? 'Erwartete ROE Geschäft (%)' : 'Expected business ROE (%)'}>
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                className={inputClass()}
                value={Math.round(inputs.businessRoe * 1000) / 10}
                onChange={(e) => patch({ businessRoe: Number(e.target.value) / 100 })}
              />
            </Field>
            <Field label={de ? 'Annahme Aktienrendite (%)' : 'Assumed equity return (%)'}>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                className={inputClass()}
                value={Math.round(inputs.expectedEquityReturn * 1000) / 10}
                onChange={(e) => patch({ expectedEquityReturn: Number(e.target.value) / 100 })}
              />
            </Field>
          </div>
        )}

        <div className="space-y-2 border-t border-slate-800 pt-3">
          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-1 accent-brand-500"
              checked={inputs.applyTaxHaircut}
              onChange={(e) => patch({ applyTaxHaircut: e.target.checked })}
            />
            <span>
              {de
                ? 'Illustrativer DE-Steuerabzug (Abgeltung + Soli, Teilfreistellung 30 % für Aktienfonds)'
                : 'Illustrative DE tax haircut (withholding + soli, 30% Teilfreistellung for equity funds)'}
            </span>
          </label>
          {inputs.applyTaxHaircut && (
            <Field label={de ? 'Freistellungsauftrag genutzt (€ / Jahr)' : 'Allowance used (€ / year)'}>
              <input
                type="number"
                min={0}
                max={2000}
                className={inputClass()}
                value={inputs.freistellungUsed}
                onChange={(e) => patch({ freistellungUsed: e.target.value })}
              />
            </Field>
          )}
        </div>
      </section>

      <section className="premium-card mb-4 space-y-4 p-4">
        <h2 className="text-sm font-semibold text-slate-300">
          {de ? 'Szenario-Übersicht' : 'Scenario summary'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900/60 p-3">
            <p className="text-[11px] text-slate-500">{de ? 'Zielvermögen' : 'Target portfolio'}</p>
            <p className="text-lg font-semibold text-white">{money(result.goalTarget)}</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3">
            <p className="text-[11px] text-slate-500">
              {de ? `Projektion in ${inputs.horizonYears} J.` : `Projection in ${inputs.horizonYears}y`}
            </p>
            <p className="text-lg font-semibold text-brand-300">{money(result.projectedNet)}</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3">
            <p className="text-[11px] text-slate-500">
              {de ? 'Annahme Realrendite' : 'Assumed real return'}
            </p>
            <p className="text-lg font-semibold text-white">{pctLabel(result.realReturn, locale)}</p>
          </div>
        </div>

        <ProgressBar
          value={result.currentProgress}
          label={de ? `Fortschritt heute (${goalMeta.de})` : `Progress today (${goalMeta.en})`}
        />
        <ProgressBar
          value={result.projectedProgress}
          label={de ? 'Fortschritt nach Projektion' : 'Progress after projection'}
        />

        <p className="text-xs text-slate-400">
          {result.yearsToGoal == null
            ? de
              ? 'Mit aktuellen Annahmen wird das Ziel in 60 Jahren voraussichtlich nicht erreicht.'
              : 'With current assumptions the target is unlikely within 60 years.'
            : result.yearsToGoal === 0
              ? de
                ? 'Ziel bereits erreicht (laut Eingaben).'
                : 'Target already met (per inputs).'
              : de
                ? `Geschätzte Dauer bis zum Ziel: ca. ${result.yearsToGoal} Jahre.`
                : `Estimated time to target: ~${result.yearsToGoal} years.`}
        </p>

        {inputs.applyTaxHaircut && result.taxOnGain > 0 && (
          <p className="text-[11px] text-slate-500">
            {de
              ? `Illustrative Steuer auf geschätzten Gewinn: ${money(result.taxOnGain)} (eff. ~${pctLabel(result.effectiveTaxRate, locale)}). Keine Steuerberatung.`
              : `Illustrative tax on estimated gain: ${money(result.taxOnGain)} (eff. ~${pctLabel(result.effectiveTaxRate, locale)}). Not tax advice.`}
          </p>
        )}
      </section>

      <section className="premium-card mb-4 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-300">
          {de ? 'Illustrative Ärmel-Allokation' : 'Illustrative sleeve allocation'}
        </h2>
        <p className="mb-3 text-[11px] text-slate-500">
          {de
            ? 'Szenario nach Risikoband × Ziel — keine persönliche Empfehlung.'
            : 'Scenario by risk band × goal — not a personal recommendation.'}
        </p>
        <SafeChart height={180} className="h-44 w-full">
          <PieChart>
            <Pie
              data={sleeveData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {sleeveData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [`${Math.round(Number(v) * 100)}%`, name]}
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
            />
          </PieChart>
        </SafeChart>
        <ul className="mt-2 space-y-1">
          {sleeveData.map((s) => (
            <li key={s.key} className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span>{s.pct}%</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="premium-card mb-4 space-y-3 p-4">
        <h2 className="text-sm font-semibold text-slate-300">
          {de ? 'Sparplan-Projektion' : 'Savings-plan projection'}
        </h2>
        <Field
          label={
            de
              ? `Monatlicher Beitrag: ${money(inputs.monthlySurplus)}`
              : `Monthly contribution: ${money(inputs.monthlySurplus)}`
          }
        >
          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={Math.min(5000, inputs.monthlySurplus)}
            onChange={(e) => patch({ monthlySurplus: Number(e.target.value) })}
            className="w-full accent-brand-500"
          />
        </Field>
        <SafeChart height={200} className="h-[200px] w-full">
          <LineChart data={projectionSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              width={40}
            />
            <Tooltip
              formatter={(v) => money(v)}
              labelFormatter={(y) => (de ? `Jahr ${y}` : `Year ${y}`)}
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </SafeChart>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {result.milestones.map((m) => (
            <div key={m.years} className="rounded-lg bg-slate-900/50 p-2 text-center">
              <p className="text-[10px] text-slate-500">
                {m.years} {de ? 'J.' : 'y'}
              </p>
              <p className="text-xs font-semibold text-white">{money(m.net)}</p>
            </div>
          ))}
        </div>
      </section>

      {result.businessCompare && (
        <section className="premium-card mb-4 space-y-2 p-4">
          <h2 className="text-sm font-semibold text-slate-300">
            {de ? 'Geschäft vs. öffentliche Märkte' : 'Business vs public markets'}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-900/60 p-3">
              <p className="text-[11px] text-slate-500">{de ? 'Bei Geschäfts-ROE' : 'At business ROE'}</p>
              <p className="font-semibold text-white">{money(result.businessCompare.businessTerminal)}</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-3">
              <p className="text-[11px] text-slate-500">{de ? 'Bei Aktienannahme' : 'At equity assumption'}</p>
              <p className="font-semibold text-white">{money(result.businessCompare.marketTerminal)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {result.businessCompare.businessWins
              ? de
                ? `Unter diesen Annahmen liegt das Geschäft um ${money(result.businessCompare.delta)} vorn — nur ein Szenario, keine Empfehlung.`
                : `Under these assumptions the business leads by ${money(result.businessCompare.delta)} — scenario only, not advice.`
              : de
                ? `Unter diesen Annahmen liegt der Markt um ${money(Math.abs(result.businessCompare.delta))} vorn — nur ein Szenario.`
                : `Under these assumptions the market leads by ${money(Math.abs(result.businessCompare.delta))} — scenario only.`}
          </p>
        </section>
      )}

      <section className="mb-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-300">
          {de ? 'Kategorien (keine Produkttipps)' : 'Categories (no product tips)'}
        </h2>
        <div className="space-y-2">
          {CATEGORY_CARDS.map((card) => {
            const weight = result.sleeves[card.sleeve]
            return (
              <div key={card.id} className="premium-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {de ? card.titleDe : card.titleEn}
                  </p>
                  <span className="shrink-0 text-xs text-brand-300">{pctLabel(weight, locale)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{de ? card.indexDe : card.indexEn}</p>
                <p className="mt-1 text-[11px] text-slate-500">{de ? card.traitsDe : card.traitsEn}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {de ? `Rolle: ${card.roleDe}` : `Role: ${card.roleEn}`}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-slate-500">
        {de
          ? 'Nur Bildung und Szenario-Mathematik. Keine Anlage-, Steuer-, Rechts- oder Produktberatung. Keine ISINs, Broker oder Kaufempfehlungen. Steuerregeln (Abgeltungsteuer, Teilfreistellung, Freistellungsauftrag, Vorabpauschale) ändern sich — immer aktuell prüfen. Vergangene Renditen sind keine Garantie.'
          : 'Education and scenario math only. Not investment, tax, legal, or product advice. No ISINs, brokers, or buy recommendations. Tax rules (withholding tax, Teilfreistellung, allowances, Vorabpauschale) change — always verify. Past returns are not a guarantee.'}
      </p>
    </div>
  )
}
