import { ChevronLeft } from 'lucide-react'
import { searchDocuments } from '@/lib/scanvault/store'

export default function SearchResults({ query, onBack, onSelect }) {
  const results = searchDocuments(query)

  const snippet = (text, q) => {
    if (!text || !q) return ''
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return text.slice(0, 80)
    return `…${text.slice(Math.max(0, i - 20), i + 60)}…`
  }

  return (
    <div className="scanvault-shell min-h-full bg-[#0f0f0f] px-4 pb-8 text-white">
      <button type="button" onClick={onBack} className="safe-top mb-4 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-lg font-bold">
        {results.length} result(s) for &ldquo;{query}&rdquo;
      </h2>
      <div className="space-y-2">
        {results.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d)}
            className="w-full rounded-xl bg-white/5 p-3 text-left"
          >
            <p className="font-medium">{d.name}</p>
            <p className="mt-1 text-xs text-slate-500">{snippet(d.extractedText, query)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
