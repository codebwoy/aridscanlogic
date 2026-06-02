import { Briefcase, Store, Sparkles, Users, Building2, Landmark } from 'lucide-react'
import { STRUCTURES } from '@/lib/bizstart/steps'

const ICONS = { briefcase: Briefcase, store: Store, sparkles: Sparkles, users: Users, building: Building2, landmark: Landmark }

export default function StructureSelector({ lang, selected, onSelect }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">
        {lang === 'de' ? 'Wählen Sie Ihre Rechtsform' : 'Choose your business structure'}
      </h2>
      <div className="space-y-3">
        {STRUCTURES.map((s) => {
          const Icon = ICONS[s.icon] || Briefcase
          const active = selected === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`premium-card w-full p-4 text-left ${active ? 'ring-2 ring-brand-500' : ''}`}
            >
              <div className="flex gap-3">
                <Icon className="h-6 w-6 shrink-0 text-brand-400" />
                <div>
                  <p className="font-semibold">{lang === 'de' ? s.nameDe : s.nameEn}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {lang === 'de' ? s.descDe : s.descEn}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-500">
                    {lang === 'de' ? 'Für' : 'For'}: {s.forWho}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
