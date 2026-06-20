import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import LebenslaufAiField from './LebenslaufAiField'
import {
  FAMILIENSTAND_OPTIONS,
  FUEHRERSCHEIN_OPTIONS,
  LANGUAGE_LEVELS,
  IT_LEVELS,
  emptyExperience,
  emptyEducation,
  emptyTraining,
  emptyLanguage,
  emptyITSkill,
  emptyVolunteering,
} from '@/lib/bizstart/lebenslauf/schema'

function Accordion({ id, title, open, onToggle, children }) {
  return (
    <div className="cv-accordion rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        id={`cv-acc-${id}`}
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
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-300'

function TextInput({ value, onChange, ...rest }) {
  return <input className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} {...rest} />
}

function TextArea({ value, onChange, rows = 3, ...rest }) {
  return (
    <textarea
      className={`${inputCls} resize-y`}
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  )
}

function ListEditor({ items, onChange, emptyItem, renderItem, addLabel }) {
  const update = (idx, patch) => {
    const next = items.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    onChange(next)
  }
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx))
  const add = () => onChange([...items, emptyItem()])

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-dashed border-brand-200/80 bg-brand-50/30 p-3">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => remove(idx)}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" /> Entfernen
            </button>
          </div>
          {renderItem(item, (patch) => update(idx, patch), idx)}
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1 text-xs font-semibold text-brand-700">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  )
}

export default function LebenslaufForm({
  cv,
  onChange,
  onImportBizStart,
  aiFieldProps,
  onGenerateProfil,
  generatingProfil = false,
}) {
  const [open, setOpen] = useState({ personal: true, profil: false, erfahrung: false })

  const set = (key, val) => onChange({ [key]: val })
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 800_000) {
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3 pb-6">
      {onImportBizStart && (
        <button
          type="button"
          onClick={onImportBizStart}
          className="w-full rounded-xl border border-brand-300 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800"
        >
          Daten aus BizStart-Profil übernehmen
        </button>
      )}

      <Accordion
        id="personal"
        title="Persönliche Daten"
        open={open.personal}
        onToggle={() => toggle('personal')}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Vorname *">
            <TextInput value={cv.vorname} onChange={(v) => set('vorname', v)} autoComplete="given-name" />
          </Field>
          <Field label="Nachname *">
            <TextInput value={cv.nachname} onChange={(v) => set('nachname', v)} autoComplete="family-name" />
          </Field>
        </div>
        <Field label="Berufsbezeichnung" hint="Erscheint unter dem Namen im Kopf des Lebenslaufs">
          <TextInput value={cv.job_title} onChange={(v) => set('job_title', v)} placeholder="z. B. Webentwickler/in" />
        </Field>
        <Field label="Straße & Hausnummer">
          <TextInput value={cv.strasse} onChange={(v) => set('strasse', v)} autoComplete="street-address" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="PLZ">
            <TextInput value={cv.plz} onChange={(v) => set('plz', v)} autoComplete="postal-code" />
          </Field>
          <Field label="Stadt">
            <TextInput value={cv.stadt} onChange={(v) => set('stadt', v)} autoComplete="address-level2" />
          </Field>
          <Field label="Telefon">
            <TextInput value={cv.telefon} onChange={(v) => set('telefon', v)} type="tel" autoComplete="tel" />
          </Field>
        </div>
        <Field label="E-Mail">
          <TextInput value={cv.email} onChange={(v) => set('email', v)} type="email" autoComplete="email" />
        </Field>
        <Field label="LinkedIn (optional)">
          <TextInput value={cv.linkedin} onChange={(v) => set('linkedin', v)} placeholder="linkedin.com/in/…" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Geburtsdatum">
            <TextInput value={cv.geburtsdatum} onChange={(v) => set('geburtsdatum', v)} type="date" />
          </Field>
          <Field label="Geburtsort">
            <TextInput value={cv.geburtsort} onChange={(v) => set('geburtsort', v)} />
          </Field>
        </div>
        <Field label="Staatsangehörigkeit">
          <TextInput value={cv.nationalitaet} onChange={(v) => set('nationalitaet', v)} placeholder="deutsch" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Familienstand">
            <select className={inputCls} value={cv.familienstand} onChange={(e) => set('familienstand', e.target.value)}>
              {FAMILIENSTAND_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Führerschein">
            <select className={inputCls} value={cv.fuehrerschein} onChange={(e) => set('fuehrerschein', e.target.value)}>
              {FUEHRERSCHEIN_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Bewerbungsfoto (optional)" hint="Rechts oben — max. ~800 KB, JPG/PNG">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="text-xs" />
          {cv.photo && (
            <button type="button" onClick={() => set('photo', '')} className="mt-1 text-xs text-red-600">
              Foto entfernen
            </button>
          )}
        </Field>
      </Accordion>

      <Accordion id="profil" title="Profil" open={open.profil} onToggle={() => toggle('profil')}>
        {onGenerateProfil && (
          <button
            type="button"
            onClick={onGenerateProfil}
            disabled={generatingProfil}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white py-2 text-xs font-semibold text-brand-800 hover:bg-brand-50 disabled:opacity-50"
          >
            {generatingProfil ? 'ScanLogic AI schreibt …' : 'Profil mit ScanLogic AI erstellen'}
          </button>
        )}
        <Field
          label="Kurzprofil"
          hint="3–5 Sätze: Wer sind Sie, was bieten Sie an, was qualifiziert Sie? (ersetzt veralteten „Berufswunsch“)"
        >
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps(
                'profil',
                'Profil / Kurzprofil',
                5,
                'Ich bin … mit … Jahren Erfahrung in …'
              )}
            />
          ) : (
            <TextArea value={cv.profil} onChange={(v) => set('profil', v)} rows={5} placeholder="Ich bin …" />
          )}
        </Field>
      </Accordion>

      <Accordion id="erfahrung" title="Berufserfahrung" open={open.erfahrung} onToggle={() => toggle('erfahrung')}>
        <ListEditor
          items={cv.erfahrung || []}
          onChange={(v) => set('erfahrung', v)}
          emptyItem={emptyExperience}
          addLabel="Erfahrung hinzufügen"
          renderItem={(item, patch, idx) => (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Von (MM/JJJJ)">
                  <TextInput value={item.von} onChange={(v) => patch({ von: v })} placeholder="01/2020" />
                </Field>
                <Field label="Bis (MM/JJJJ oder „heute“)">
                  <TextInput value={item.bis} onChange={(v) => patch({ bis: v })} placeholder="heute" />
                </Field>
              </div>
              <Field label="Position / Tätigkeit">
                <TextInput value={item.titel} onChange={(v) => patch({ titel: v })} />
              </Field>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Unternehmen">
                  <TextInput value={item.unternehmen} onChange={(v) => patch({ unternehmen: v })} />
                </Field>
                <Field label="Stadt">
                  <TextInput value={item.stadt} onChange={(v) => patch({ stadt: v })} />
                </Field>
              </div>
              <Field label="Branche">
                <TextInput value={item.branche} onChange={(v) => patch({ branche: v })} />
              </Field>
              <Field label="Aufgaben (eine pro Zeile)">
                {aiFieldProps ? (
                  <LebenslaufAiField
                    {...aiFieldProps(
                      `erfahrung:${idx}:aufgaben`,
                      `Berufserfahrung — Aufgaben${item.titel?.trim() ? `: ${item.titel}` : ''}`,
                      4,
                      'Kundenberatung und …'
                    )}
                  />
                ) : (
                  <TextArea value={item.aufgaben} onChange={(v) => patch({ aufgaben: v })} rows={4} />
                )}
              </Field>
            </>
          )}
        />
      </Accordion>

      <Accordion id="ausbildung" title="Ausbildung" open={open.ausbildung} onToggle={() => toggle('ausbildung')}>
        <ListEditor
          items={cv.ausbildung || []}
          onChange={(v) => set('ausbildung', v)}
          emptyItem={emptyEducation}
          addLabel="Ausbildung hinzufügen"
          renderItem={(item, patch, idx) => (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Von">
                  <TextInput value={item.von} onChange={(v) => patch({ von: v })} />
                </Field>
                <Field label="Bis">
                  <TextInput value={item.bis} onChange={(v) => patch({ bis: v })} />
                </Field>
              </div>
              <Field label="Abschluss">
                <TextInput value={item.abschluss} onChange={(v) => patch({ abschluss: v })} />
              </Field>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Institution">
                  <TextInput value={item.institution} onChange={(v) => patch({ institution: v })} />
                </Field>
                <Field label="Stadt">
                  <TextInput value={item.stadt} onChange={(v) => patch({ stadt: v })} />
                </Field>
              </div>
              <Field label="Note (nur bei guter Note 1–2)">
                <TextInput value={item.note} onChange={(v) => patch({ note: v })} placeholder="1,3" />
              </Field>
              <Field label="Schwerpunkte (eine pro Zeile)">
                {aiFieldProps ? (
                  <LebenslaufAiField
                    {...aiFieldProps(
                      `ausbildung:${idx}:schwerpunkte`,
                      `Ausbildung — Schwerpunkte${item.abschluss?.trim() ? `: ${item.abschluss}` : ''}`,
                      3,
                      'Schwerpunkt …'
                    )}
                  />
                ) : (
                  <TextArea value={item.schwerpunkte} onChange={(v) => patch({ schwerpunkte: v })} rows={3} />
                )}
              </Field>
            </>
          )}
        />
      </Accordion>

      <Accordion id="weiter" title="Weiterbildung" open={open.weiter} onToggle={() => toggle('weiter')}>
        <ListEditor
          items={cv.weiterbildung || []}
          onChange={(v) => set('weiterbildung', v)}
          emptyItem={emptyTraining}
          addLabel="Weiterbildung hinzufügen"
          renderItem={(item, patch) => (
            <>
              <Field label="Jahr">
                <TextInput value={item.jahr} onChange={(v) => patch({ jahr: v })} placeholder="2024" />
              </Field>
              <Field label="Titel / Zertifikat">
                <TextInput value={item.titel} onChange={(v) => patch({ titel: v })} placeholder="Telc B2 Beruf" />
              </Field>
              <Field label="Anbieter">
                <TextInput value={item.anbieter} onChange={(v) => patch({ anbieter: v })} />
              </Field>
            </>
          )}
        />
      </Accordion>

      <Accordion id="sprachen" title="Sprachkenntnisse" open={open.sprachen} onToggle={() => toggle('sprachen')}>
        <ListEditor
          items={cv.sprachen || []}
          onChange={(v) => set('sprachen', v)}
          emptyItem={emptyLanguage}
          addLabel="Sprache hinzufügen"
          renderItem={(item, patch) => (
            <div className="grid gap-2 sm:grid-cols-3">
              <Field label="Sprache">
                <TextInput value={item.sprache} onChange={(v) => patch({ sprache: v })} placeholder="Deutsch" />
              </Field>
              <Field label="Niveau">
                <select className={inputCls} value={item.niveau} onChange={(e) => patch({ niveau: e.target.value })}>
                  {LANGUAGE_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Zertifikat">
                <TextInput value={item.zertifikat} onChange={(v) => patch({ zertifikat: v })} placeholder="Telc B2" />
              </Field>
            </div>
          )}
        />
      </Accordion>

      <Accordion id="it" title="IT-Kenntnisse" open={open.it} onToggle={() => toggle('it')}>
        <ListEditor
          items={cv.itSkills || []}
          onChange={(v) => set('itSkills', v)}
          emptyItem={emptyITSkill}
          addLabel="Software hinzufügen"
          renderItem={(item, patch) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Software / Tool">
                <TextInput value={item.software} onChange={(v) => patch({ software: v })} />
              </Field>
              <Field label="Niveau">
                <select className={inputCls} value={item.niveau} onChange={(e) => patch({ niveau: e.target.value })}>
                  {IT_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        />
      </Accordion>

      <Accordion id="weitere" title="Weitere Kenntnisse" open={open.weitere} onToggle={() => toggle('weitere')}>
        <Field label="Stichpunkte (eine pro Zeile)">
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps('weitereKenntnisse', 'Weitere Kenntnisse', 4, 'Teamführung\nProjektmanagement')}
            />
          ) : (
            <TextArea value={cv.weitereKenntnisse} onChange={(v) => set('weitereKenntnisse', v)} rows={4} />
          )}
        </Field>
      </Accordion>

      <Accordion id="ehrenamt" title="Ehrenamt" open={open.ehrenamt} onToggle={() => toggle('ehrenamt')}>
        <ListEditor
          items={cv.ehrenamt || []}
          onChange={(v) => set('ehrenamt', v)}
          emptyItem={emptyVolunteering}
          addLabel="Engagement hinzufügen"
          renderItem={(item, patch) => (
            <>
              <Field label="Zeitraum">
                <TextInput value={item.zeitraum} onChange={(v) => patch({ zeitraum: v })} />
              </Field>
              <Field label="Tätigkeit">
                <TextInput value={item.taetigkeit} onChange={(v) => patch({ taetigkeit: v })} />
              </Field>
              <Field label="Organisation">
                <TextInput value={item.organisation} onChange={(v) => patch({ organisation: v })} />
              </Field>
            </>
          )}
        />
      </Accordion>

      <Accordion id="interessen" title="Interessen" open={open.interessen} onToggle={() => toggle('interessen')}>
        <Field label="Hobbys & Interessen (kurz, professionell)">
          {aiFieldProps ? (
            <LebenslaufAiField
              {...aiFieldProps('interessen', 'Interessen', 2, 'Lesen, Wandern, …')}
            />
          ) : (
            <TextArea value={cv.interessen} onChange={(v) => set('interessen', v)} rows={2} />
          )}
        </Field>
      </Accordion>

      <Accordion id="unterschrift" title="Unterschrift" open={open.unterschrift} onToggle={() => toggle('unterschrift')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Ort *">
            <TextInput value={cv.unterschriftOrt} onChange={(v) => set('unterschriftOrt', v)} />
          </Field>
          <Field label="Datum">
            <TextInput value={cv.unterschriftDatum} onChange={(v) => set('unterschriftDatum', v)} placeholder="TT.MM.JJJJ" />
          </Field>
        </div>
        <Field label="Name in Kursivschrift (Unterschriftzeile)" hint="Leer = Vor- und Nachname">
          <TextInput value={cv.unterschriftName} onChange={(v) => set('unterschriftName', v)} />
        </Field>
      </Accordion>
    </div>
  )
}
