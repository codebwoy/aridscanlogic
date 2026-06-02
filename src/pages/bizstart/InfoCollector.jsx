import { useState } from 'react'

const ACTIVITIES = [
  'IT & Software',
  'Beratung',
  'Handel',
  'Gastronomie',
  'Handwerk',
  'Design',
  'Marketing',
  'Sonstiges',
]

export default function InfoCollector({ lang, formData, onChange, onComplete }) {
  const [section, setSection] = useState(0)
  const sections = lang === 'de' ? ['Persönlich', 'Geschäft', 'Bank', 'USt'] : ['Personal', 'Business', 'Bank', 'VAT']
  const f = (key, val) => onChange({ [key]: val })

  const field = (label, key, type = 'text') => (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      <input
        type={type}
        value={formData[key] || ''}
        onChange={(e) => f(key, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
      />
    </label>
  )

  return (
    <div>
      <div className="mb-4 flex gap-1">
        {sections.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${i <= section ? 'bg-brand-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>
      <h2 className="mb-4 text-lg font-bold">{sections[section]}</h2>

      {section === 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {field(lang === 'de' ? 'Vorname' : 'First name', 'firstName')}
            {field(lang === 'de' ? 'Nachname' : 'Last name', 'lastName')}
          </div>
          {field(lang === 'de' ? 'Geburtsdatum' : 'Date of birth', 'dateOfBirth', 'date')}
          {field(lang === 'de' ? 'Staatsangehörigkeit' : 'Nationality', 'nationality')}
          {field('Straße', 'street')}
          <div className="grid grid-cols-3 gap-2">
            {field('Nr.', 'houseNumber')}
            {field('PLZ', 'plz')}
            {field(lang === 'de' ? 'Stadt' : 'City', 'city')}
          </div>
          {field(lang === 'de' ? 'Steuer-ID (11 Ziffern)' : 'Tax ID (11 digits)', 'taxId')}
          {field('E-Mail', 'email', 'email')}
          {field(lang === 'de' ? 'Telefon' : 'Phone', 'phone')}
        </div>
      )}

      {section === 1 && (
        <div className="space-y-3">
          {field(lang === 'de' ? 'Geschäftsname' : 'Business name', 'intendedBusinessName')}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">
              {lang === 'de' ? 'Tätigkeitsbeschreibung' : 'Activity description'}
            </span>
            <textarea
              value={formData.businessActivityDescription || ''}
              onChange={(e) => f('businessActivityDescription', e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <select
            value={formData.activityCategory || ''}
            onChange={(e) => f('activityCategory', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="">— {lang === 'de' ? 'Kategorie' : 'Category'} —</option>
            {ACTIVITIES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {field(lang === 'de' ? 'Umsatz Jahr 1 (EUR)' : 'Revenue year 1 (EUR)', 'expectedRevenueYear1', 'number')}
          {field(lang === 'de' ? 'Gewinn Jahr 1 (EUR)' : 'Profit year 1 (EUR)', 'expectedProfitYear1', 'number')}
          {field(lang === 'de' ? 'Betriebseröffnung' : 'Start date', 'businessStartDate', 'date')}
        </div>
      )}

      {section === 2 && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!formData.hasBusinessBank}
              onChange={(e) => f('hasBusinessBank', e.target.checked)}
            />
            {lang === 'de' ? 'Geschäftskonto vorhanden' : 'Have business bank account'}
          </label>
          {field(lang === 'de' ? 'Bank' : 'Bank name', 'bankName')}
          {field('IBAN', 'iban')}
          {field('BIC', 'bic')}
          <div className="premium-card p-3 text-xs text-slate-400">
            <p className="font-medium text-slate-300">N26 Business · Kontist · Qonto</p>
            <p className="mt-1">Compare fees on provider websites.</p>
          </div>
        </div>
      )}

      {section === 3 && (
        <div className="space-y-3">
          {Number(formData.expectedRevenueYear1) < 22000 && (
            <button
              type="button"
              onClick={() => f('vatScheme', 'kleinunternehmer')}
              className={`premium-card w-full p-4 text-left ${formData.vatScheme === 'kleinunternehmer' ? 'ring-2 ring-brand-500' : ''}`}
            >
              <p className="font-semibold">Kleinunternehmer §19</p>
              <p className="text-xs text-slate-400">No VAT on invoices under €22k revenue</p>
            </button>
          )}
          <button
            type="button"
            onClick={() => f('vatScheme', 'standard')}
            className={`premium-card w-full p-4 text-left ${formData.vatScheme === 'standard' ? 'ring-2 ring-brand-500' : ''}`}
          >
            <p className="font-semibold">{lang === 'de' ? 'Regelbesteuerung' : 'Standard VAT'}</p>
            <p className="text-xs text-slate-400">19% / 7% VAT, USt-Voranmeldung</p>
          </button>
          <select
            value={formData.vatFilingFrequency || 'quarterly'}
            onChange={(e) => f('vatFilingFrequency', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="monthly">Monthly / Monatlich</option>
            <option value="quarterly">Quarterly / Quartalsweise</option>
            <option value="annual">Annual / Jährlich</option>
          </select>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {section > 0 && (
          <button type="button" onClick={() => setSection(section - 1)} className="flex-1 rounded-xl bg-slate-800 py-3">
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => (section < 3 ? setSection(section + 1) : onComplete())}
          className="btn-primary flex-1 rounded-xl py-3 font-semibold"
        >
          {section < 3 ? 'Next' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
