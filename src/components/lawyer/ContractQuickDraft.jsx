const TEMPLATES = [
  { id: 'nda', label: 'NDA', promptDe: 'Erstellen Sie eine zweisprachige DE/EN NDA-Vorlage (Freelancer, Software).' },
  { id: 'freelance', label: 'Freelance', promptDe: 'Erstellen Sie einen Freelance-Dienstleistungsvertrag DE/EN mit Leistungsbeschreibung und Vergütung.' },
  { id: 'minijob', label: 'Mini-Job', promptDe: 'Erklären Sie Mini-Job-Vertrag Pflichten und eine kurze Mustervorlage DE.' },
  { id: 'saas', label: 'SaaS', promptDe: 'Erstellen Sie eine Software-/SaaS-Dienstleistungsvereinbarung DE/EN (SLA, Haftung, IP).' },
]

export default function ContractQuickDraft({ onSelect }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <span className="w-full text-[10px] font-semibold uppercase text-slate-500">Quick draft</span>
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.promptDe)}
          className="rounded-full bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:bg-brand-600/20"
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
