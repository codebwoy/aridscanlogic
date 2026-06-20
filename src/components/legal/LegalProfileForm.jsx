import { LEGAL_STRUCTURE_OPTIONS, getMissingProfileFields } from '@/lib/legal/profile'

const LABELS = {
  de: {
    sectionImpressum: 'Ihre Angaben (Impressum)',
    sectionController: 'Verantwortlicher (Auftraggeber / Website-Betreiber)',
    sectionProcessor: 'Auftragsverarbeiter (Ihr Unternehmen)',
    sectionClient: 'Kunde / Auftraggeber (Verantwortlicher)',
    hint: 'Diese Felder füllen Impressum, Datenschutz und AVV automatisch aus.',
    firstName: 'Vorname',
    lastName: 'Nachname',
    businessName: 'Geschäftsname / Firma',
    legalStructure: 'Rechtsform',
    street: 'Straße',
    houseNumber: 'Nr.',
    plz: 'PLZ',
    city: 'Stadt',
    country: 'Land',
    email: 'E-Mail',
    phone: 'Telefon',
    website: 'Website-URL',
    steuernummer: 'Steuernummer',
    steuernummerHint: 'Nach Finanzamt-Anmeldung — sonst leer lassen',
    ustIdNr: 'USt-IdNr.',
    handelsregister: 'Handelsregister (GmbH/UG, optional)',
    activity: 'Tätigkeitsbeschreibung',
    missing: 'Noch ausfüllen',
    noPoBox: 'Kein Postfach — ladungsfähige Anschrift',
  },
  en: {
    sectionImpressum: 'Your details (Impressum)',
    sectionController: 'Controller (website operator)',
    sectionProcessor: 'Processor (your business)',
    sectionClient: 'Client / controller',
    hint: 'These fields auto-fill Impressum, Privacy Policy, and AVV.',
    firstName: 'First name',
    lastName: 'Last name',
    businessName: 'Business name',
    legalStructure: 'Legal form',
    street: 'Street',
    houseNumber: 'No.',
    plz: 'Postal code',
    city: 'City',
    country: 'Country',
    email: 'Email',
    phone: 'Phone',
    website: 'Website URL',
    steuernummer: 'Tax number (Steuernummer)',
    steuernummerHint: 'After Finanzamt registration — leave blank if pending',
    ustIdNr: 'VAT ID (USt-IdNr.)',
    handelsregister: 'Commercial register (GmbH/UG, optional)',
    activity: 'Activity description',
    missing: 'Still required',
    noPoBox: 'No P.O. box — physical address required',
  },
}

export default function LegalProfileForm({
  lang = 'de',
  fields,
  onChange,
  variant = 'full',
  showMissing = true,
}) {
  const t = LABELS[lang] || LABELS.de
  const missing = showMissing ? getMissingProfileFields(fields) : []

  const set = (key, val) => onChange({ ...fields, [key]: val })

  const input = (label, key, opts = {}) => (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">
        {label}
        {showMissing && missing.includes(key) && (
          <span className="ml-1 text-amber-400">· {t.missing}</span>
        )}
      </span>
      <input
        type={opts.type || 'text'}
        value={fields[key] || ''}
        onChange={(e) => set(key, e.target.value)}
        placeholder={opts.placeholder}
        className={`w-full rounded-lg bg-slate-800 px-3 py-2 text-sm ${
          showMissing && missing.includes(key) ? 'ring-1 ring-amber-500/40' : ''
        }`}
      />
      {opts.hint && <span className="mt-0.5 block text-[10px] text-slate-500">{opts.hint}</span>}
    </label>
  )

  const sectionTitle =
    variant === 'controller'
      ? t.sectionController
      : variant === 'processor'
        ? t.sectionProcessor
        : t.sectionImpressum

  const showExtended = variant === 'full' || variant === 'controller' || variant === 'processor'

  return (
    <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div>
        <p className="text-sm font-semibold text-brand-300">{sectionTitle}</p>
        <p className="text-xs text-slate-500">{t.hint}</p>
        {variant === 'full' && (
          <p className="mt-1 text-[10px] text-slate-500">{t.noPoBox}</p>
        )}
      </div>

      {(variant === 'full' || variant === 'processor' || variant === 'controller') && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {input(t.firstName, 'firstName')}
            {input(t.lastName, 'lastName')}
          </div>
          {input(t.businessName, 'businessName')}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">{t.legalStructure}</span>
            <select
              value={fields.legalStructure || 'einzelunternehmer'}
              onChange={(e) => set('legalStructure', e.target.value)}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            >
              {LEGAL_STRUCTURE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {lang === 'de' ? o.labelDe : o.labelEn}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {showExtended && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">{input(t.street, 'street')}</div>
            {input(t.houseNumber, 'houseNumber')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {input(t.plz, 'plz')}
            {input(t.city, 'city')}
          </div>
          {input(t.country, 'country')}
          <div className="grid grid-cols-2 gap-2">
            {input(t.email, 'email', { type: 'email' })}
            {input(t.phone, 'phone', { type: 'tel' })}
          </div>
          {input(t.website, 'website', { placeholder: 'https://…' })}
          <div className="grid grid-cols-2 gap-2">
            {input(t.steuernummer, 'steuernummer', { hint: t.steuernummerHint })}
            {input(t.ustIdNr, 'ustIdNr')}
          </div>
          {(variant === 'full' || fields.legalStructure === 'gmbh' || fields.legalStructure === 'ug') &&
            input(t.handelsregister, 'handelsregister')}
          {variant === 'full' && (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">{t.activity}</span>
              <textarea
                value={fields.activityDescription || ''}
                onChange={(e) => set('activityDescription', e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          )}
        </>
      )}
    </div>
  )
}
