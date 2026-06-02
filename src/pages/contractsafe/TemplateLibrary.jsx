import { ChevronLeft } from 'lucide-react'
import { CONTRACT_TEMPLATES } from '@/lib/contractTemplates'

export default function TemplateLibrary({ onBack, onSelect }) {
  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Template library</h2>
      <div className="space-y-2">
        {Object.entries(CONTRACT_TEMPLATES).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key, t)}
            className="premium-card w-full p-4 text-left"
          >
            <p className="font-semibold">{t.title}</p>
            <p className="text-xs text-slate-500">{t.sections?.length} sections · {t.template_type}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
