import { ChevronLeft, Shield } from 'lucide-react'
import { CONTRACT_TEMPLATES } from '@/lib/contractTemplates'
import { isLegalTemplateKey, buildPopulatedLegalTemplate } from '@/lib/legal/contractSections'
import { useAiLanguage } from '@/context/AiLanguageContext'

export default function TemplateLibrary({ onBack, onSelect }) {
  const { language } = useAiLanguage()

  const legal = Object.entries(CONTRACT_TEMPLATES).filter(([, t]) => t.category === 'legal')
  const standard = Object.entries(CONTRACT_TEMPLATES).filter(([, t]) => t.category !== 'legal')

  const pick = (key, t) => {
    const populated = isLegalTemplateKey(key) ? buildPopulatedLegalTemplate(key, language) : t
    onSelect(key, populated)
  }

  const TemplateButton = ({ templateKey, t }) => (
    <button
      key={templateKey}
      type="button"
      onClick={() => pick(templateKey, t)}
      className="premium-card w-full p-4 text-left"
    >
      <p className="font-semibold">{t.title}</p>
      <p className="text-xs text-slate-500">
        {t.sections?.length} sections · {t.template_type}
        {isLegalTemplateKey(templateKey) ? ' · BizStart profile' : ''}
      </p>
    </button>
  )

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Template library</h2>

      {legal.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
            <Shield className="h-3 w-3" />
            {language === 'de' ? 'Website-Rechtliches' : 'Website legal'}
          </p>
          <p className="mb-3 text-xs text-slate-500">
            {language === 'de'
              ? 'Aus BizStart/DocDraft-Profil befüllt — Entwürfe, keine Rechtsberatung.'
              : 'Filled from BizStart/DocDraft profile — drafts only, not legal advice.'}
          </p>
          <div className="space-y-2">
            {legal.map(([key, t]) => (
              <TemplateButton key={key} templateKey={key} t={t} />
            ))}
          </div>
        </div>
      )}

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {language === 'de' ? 'Vertragsvorlagen' : 'Contract templates'}
      </p>
      <div className="space-y-2">
        {standard.map(([key, t]) => (
          <TemplateButton key={key} templateKey={key} t={t} />
        ))}
      </div>
    </div>
  )
}
