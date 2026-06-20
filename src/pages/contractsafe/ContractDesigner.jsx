import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { CONTRACT_TEMPLATES } from '@/lib/contractTemplates'
import { isLegalTemplateKey, buildPopulatedLegalTemplate } from '@/lib/legal/contractSections'
import LegalDocumentPreview from '@/components/legal/LegalDocumentPreview'
import { useAiLanguage } from '@/context/AiLanguageContext'

export default function ContractDesigner({ contract, onSaved, onCancel, initialTemplate }) {
  const { language } = useAiLanguage()
  const [form, setForm] = useState(
    contract || {
      title: '',
      template_type: 'nda',
      status: 'draft',
      contract_body: { sections: [] },
      effective_date: new Date().toISOString().slice(0, 10),
      signing_order: 'parallel',
    }
  )
  const [signers, setSigners] = useState([
    { signer_name: '', signer_email: '' },
    { signer_name: '', signer_email: '' },
  ])

  useEffect(() => {
    if (initialTemplate?.sections) {
      const key = initialTemplate.template_type
      const populated = isLegalTemplateKey(key)
        ? buildPopulatedLegalTemplate(key, language)
        : initialTemplate
      setForm((f) => ({
        ...f,
        title: populated.title || f.title,
        template_type: populated.template_type || f.template_type,
        contract_body: { sections: populated.sections },
      }))
    }
  }, [initialTemplate, language])

  const loadTemplate = (key) => {
    const t = isLegalTemplateKey(key)
      ? buildPopulatedLegalTemplate(key, language)
      : CONTRACT_TEMPLATES[key]
    if (!t) return
    setForm({
      ...form,
      title: t.title,
      template_type: t.template_type,
      contract_body: { sections: t.sections },
    })
    if (isLegalTemplateKey(key)) {
      toast.info(
        language === 'de'
          ? 'Aus BizStart/DocDraft-Profil befüllt — Rechtsanwalt prüfen lassen'
          : 'Filled from BizStart/DocDraft profile — have a lawyer review'
      )
    }
  }

  const save = async () => {
    try {
      const saved = contract?.id
        ? await appApi.entities.Contract.update(contract.id, { ...form, status: 'sent' })
        : await appApi.entities.Contract.create({ ...form, status: 'sent' })

      const validSigners = signers.filter((x) => x.signer_email)
      for (let i = 0; i < validSigners.length; i++) {
        const s = validSigners[i]
        await appApi.entities.ContractSigner.create({
          contract_id: saved.id,
          signer_name: s.signer_name,
          signer_email: s.signer_email,
          signing_order_index: i,
          signing_status: form.signing_order === 'sequential' && i > 0 ? 'waiting' : 'pending',
          signature_image_url: '',
        })
      }
      toast.success('Vertrag gespeichert & zur Signatur freigegeben')
      onSaved?.(saved)
    } catch {
      toast.error('Speichern fehlgeschlagen')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {Object.keys(CONTRACT_TEMPLATES).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => loadTemplate(k)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs uppercase ${
              isLegalTemplateKey(k) ? 'bg-brand-600/30 text-brand-200' : 'bg-slate-800'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Vertragstitel"
        className="w-full rounded-xl bg-slate-800 px-4 py-3"
      />
      <select
        value={form.signing_order}
        onChange={(e) => setForm({ ...form, signing_order: e.target.value })}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
      >
        <option value="parallel">Parallele Signatur — alle jederzeit</option>
        <option value="sequential">Sequentielle Signatur — nacheinander</option>
      </select>
      {(form.contract_body?.sections || []).map((sec, i) => (
        <div key={i} className="rounded-xl bg-slate-800/60 p-3">
          <p className="font-medium text-brand-300">{sec.heading}</p>
          {isLegalTemplateKey(form.template_type) ? (
            <div className="mt-2 max-h-96 overflow-y-auto">
              <LegalDocumentPreview content={sec.body} module="Contract Safe" />
            </div>
          ) : (
            <pre className="mt-1 whitespace-pre-wrap font-sans text-sm text-slate-400">{sec.body}</pre>
          )}
        </div>
      ))}
      <h4 className="text-sm font-medium text-slate-400">Unterzeichner (Reihenfolge = Index)</h4>
      {signers.map((s, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <input
            placeholder={`Name #${i + 1}`}
            value={s.signer_name}
            onChange={(e) => {
              const n = [...signers]
              n[i].signer_name = e.target.value
              setSigners(n)
            }}
            className="rounded-lg bg-slate-900 px-2 py-2 text-sm"
          />
          <input
            placeholder="E-Mail"
            type="email"
            value={s.signer_email}
            onChange={(e) => {
              const n = [...signers]
              n[i].signer_email = e.target.value
              setSigners(n)
            }}
            className="rounded-lg bg-slate-900 px-2 py-2 text-sm"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl bg-slate-800 py-3">
          Abbrechen
        </button>
        <button type="button" onClick={save} className="flex-1 rounded-xl bg-brand-600 py-3 font-semibold">
          Speichern & Senden
        </button>
      </div>
    </div>
  )
}
