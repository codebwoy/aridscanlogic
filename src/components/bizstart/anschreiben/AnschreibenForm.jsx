import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import LebenslaufAiField from '@/components/bizstart/lebenslauf/LebenslaufAiField'
import { BEWERBUNGS_TYP_OPTIONS, ANREDE_OPTIONS } from '@/lib/bizstart/anschreiben/schema'
import { BEWERBUNG_TEMPLATE } from '@/lib/bizstart/bewerbungTemplate'

const T = BEWERBUNG_TEMPLATE

function Accordion({ id, title, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-brand-900"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && <div className="border-t border-slate-100 px-4 pb-4 pt-2">{children}</div>}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
      {hint && <span className="mb-1 block text-[11px] text-slate-500">{hint}</span>}
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-300'

function TextInput({ value, onChange, ...rest }) {
  return <input className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} {...rest} />
}

export default function AnschreibenForm({
  a,
  onChange,
  onImportCv,
  onImportBizStart,
  aiFieldProps,
  onGenerateDraft,
  generatingDraft,
}) {
  const [open, setOpen] = useState({ sender: true, recipient: true, body: true })
  const set = (key, val) => onChange({ [key]: val })
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  return (
    <div className="space-y-3 pb-6">
      <div className="flex flex-wrap gap-2">
        {onImportCv && (
          <button type="button" onClick={onImportCv} className="flex-1 rounded-xl border border-brand-300 bg-brand-50 px-2 py-2 text-[11px] font-semibold text-brand-800">
            Aus Lebenslauf übernehmen
          </button>
        )}
        {onImportBizStart && (
          <button type="button" onClick={onImportBizStart} className="flex-1 rounded-xl border border-brand-300 bg-brand-50 px-2 py-2 text-[11px] font-semibold text-brand-800">
            Aus BizStart-Profil
          </button>
        )}
      </div>

      {onGenerateDraft && (
        <button
          type="button"
          onClick={onGenerateDraft}
          disabled={generatingDraft}
          className="w-full rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-900 disabled:opacity-50"
        >
          {generatingDraft ? 'ScanLogic AI erstellt Entwurf …' : 'Vollständigen Entwurf mit ScanLogic AI erstellen'}
        </button>
      )}

      <Accordion id="meta" title="Art der Bewerbung" open={open.meta !== false} onToggle={() => toggle('meta')}>
        <Field label="Zweck" hint="Steuert Ton und Schwerpunkt der KI">
          <select className={inputCls} value={a.bewerbungsTyp} onChange={(e) => set('bewerbungsTyp', e.target.value)}>
            {BEWERBUNGS_TYP_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stellen-/Projekttitel">
          <TextInput value={a.stellenTitel} onChange={(v) => set('stellenTitel', v)} placeholder={T.stellenTitel} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Referenz-Nr.">
            <TextInput value={a.referenzNr} onChange={(v) => set('referenzNr', v)} />
          </Field>
          <Field label="Quelle der Ausschreibung">
            <TextInput value={a.quelle} onChange={(v) => set('quelle', v)} placeholder="LinkedIn" />
          </Field>
        </div>
      </Accordion>

      <Accordion id="sender" title="1 — Absender (Briefkopf)" open={open.sender} onToggle={() => toggle('sender')}>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Vorname">
            <TextInput value={a.vorname} onChange={(v) => set('vorname', v)} placeholder={T.vorname} />
          </Field>
          <Field label="Nachname">
            <TextInput value={a.nachname} onChange={(v) => set('nachname', v)} placeholder={T.nachname} />
          </Field>
        </div>
        <Field label="Straße">
          <TextInput value={a.strasse} onChange={(v) => set('strasse', v)} placeholder={T.strasse} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="PLZ">
            <TextInput value={a.plz} onChange={(v) => set('plz', v)} placeholder={T.plz} />
          </Field>
          <Field label="Stadt">
            <TextInput value={a.stadt} onChange={(v) => set('stadt', v)} placeholder={T.stadt} />
          </Field>
          <Field label="Telefon">
            <TextInput value={a.telefon} onChange={(v) => set('telefon', v)} type="tel" placeholder={T.telefon} />
          </Field>
        </div>
        <Field label="E-Mail">
          <TextInput value={a.email} onChange={(v) => set('email', v)} type="email" placeholder={T.email} />
        </Field>
        <Field label="Berufsbezeichnung" hint="Erscheint unter Ihrem Namen — z. B. Webentwickler">
          <TextInput value={a.berufsbezeichnung} onChange={(v) => set('berufsbezeichnung', v)} placeholder={T.berufsbezeichnung} />
        </Field>
      </Accordion>

      <Accordion id="recipient" title="2 — Empfänger & Datum" open={open.recipient} onToggle={() => toggle('recipient')}>
        <Field label="Unternehmen / Institution">
          <TextInput value={a.firma} onChange={(v) => set('firma', v)} placeholder={T.firma} />
        </Field>
        <Field label="Abteilung">
          <TextInput value={a.abteilung} onChange={(v) => set('abteilung', v)} placeholder="Personalabteilung" />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Anrede Ansprechpartner">
            <select className={inputCls} value={a.ansprechpartnerAnrede} onChange={(e) => set('ansprechpartnerAnrede', e.target.value)}>
              {ANREDE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nachname Ansprechpartner">
            <TextInput value={a.ansprechpartnerNachname} onChange={(v) => set('ansprechpartnerNachname', v)} placeholder={T.ansprechpartnerNachname} />
          </Field>
        </div>
        <Field label="Straße (Empfänger)">
          <TextInput value={a.firmaStrasse} onChange={(v) => set('firmaStrasse', v)} placeholder={T.firmaStrasse} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="PLZ">
            <TextInput value={a.firmaPlz} onChange={(v) => set('firmaPlz', v)} placeholder={T.firmaPlz} />
          </Field>
          <Field label="Stadt">
            <TextInput value={a.firmaStadt} onChange={(v) => set('firmaStadt', v)} placeholder={T.firmaStadt} />
          </Field>
        </div>
        <Field label="Ort, Datum" hint="Rechtsbündig — z. B. Musterstadt, TT.MM.JJJJ">
          <TextInput value={a.ortDatum} onChange={(v) => set('ortDatum', v)} placeholder={T.ortDatum} />
        </Field>
      </Accordion>

      <Accordion id="body" title="3 — Betreff & Text (DIN 5008)" open={open.body} onToggle={() => toggle('body')}>
        <Field label="Betreffzeile" hint="Fett, ohne „Betreff:“ — Stelle, Ref.-Nr., Quelle">
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps('betreff', 'Betreffzeile', 2, 'Bewerbung als … — Ref.-Nr. … — LinkedIn')}
            />
          ) : (
            <TextInput value={a.betreff} onChange={(v) => set('betreff', v)} />
          )}
        </Field>
        <Field label="Einleitung" hint="2–3 Sätze, erster Buchstabe klein (nach Anrede-Komma)">
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps(
                'einleitung',
                'Einleitung',
                4,
                'als erfahrener … verfolge ich …'
              )}
            />
          ) : null}
        </Field>
        <Field label="Hauptteil" hint="Qualifikation & Ergebnisse (PAR) — nicht den Lebenslauf wiederholen">
          {aiFieldProps ? (
            <LebenslaufAiField {...aiFieldProps('hauptteil', 'Hauptteil', 6, 'In meiner aktuellen Position …')} />
          ) : null}
        </Field>
        <Field label="Motivation" hint="Warum genau dieses Unternehmen?">
          {aiFieldProps ? (
            <LebenslaufAiField {...aiFieldProps('motivation', 'Motivation', 4, 'Ihr Fokus auf … deckt sich mit …')} />
          ) : null}
        </Field>
        <Field label="Schlussteil" hint="Eintrittsdatum / Kündigungsfrist, ggf. Gehaltsvorstellung (brutto/Jahr)">
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps(
                'schlussteil',
                'Schlussteil',
                3,
                'Für eine Arbeitsaufnahme stehe ich … Gehaltsvorstellung: …'
              )}
            />
          ) : null}
        </Field>
      </Accordion>

      <Accordion id="close" title="4 — Grußformel & Anlagen" open={open.close} onToggle={() => toggle('close')}>
        <Field label="Grußformel" hint="Ohne Komma — Standard: Mit freundlichen Grüßen">
          <TextInput value={a.grussformel} onChange={(v) => set('grussformel', v)} />
        </Field>
        <Field label="Name unter der Unterschrift">
          <TextInput value={a.unterschriftName} onChange={(v) => set('unterschriftName', v)} placeholder={T.unterschriftName} />
        </Field>
        <Field label="Anlagen" hint="Unten links — üblicherweise „Anlagen“">
          <TextInput value={a.anlagenHinweis} onChange={(v) => set('anlagenHinweis', v)} placeholder="Anlagen" />
        </Field>
      </Accordion>
    </div>
  )
}
