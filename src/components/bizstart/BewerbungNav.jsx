import { FileText, FileUser, Mail, Sparkles } from 'lucide-react'

export default function BewerbungNav({ current, onNavigate, lang = 'de' }) {
  const items = [
    { id: 'businessPlan', icon: FileText, label: lang === 'de' ? 'Businessplan' : 'Business plan' },
    { id: 'lebenslauf', icon: FileUser, label: lang === 'de' ? 'Lebenslauf' : 'CV' },
    { id: 'anschreiben', icon: Mail, label: lang === 'de' ? 'Anschreiben' : 'Cover letter' },
    { id: 'tailorcv', icon: Sparkles, label: lang === 'de' ? 'TailorCV' : 'TailorCV' },
  ]

  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-brand-500/30 bg-slate-900/80 p-2">
      <p className="w-full px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {lang === 'de' ? 'Bewerbungspaket — alles zusammen' : 'Application pack — all together'}
      </p>
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate?.(id)}
          disabled={current === id}
          className={`flex flex-1 min-w-[90px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition ${
            current === id
              ? 'bg-brand-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  )
}
