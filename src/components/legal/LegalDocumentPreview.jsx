import { BRAND_SUITE_NAME } from '@/lib/brand'
import { parseLegalMarkdown } from '@/lib/legal/parseLegalMarkdown'

function FieldGrid({ fields }) {
  if (!fields.length) return null
  return (
    <div className="my-2 grid gap-1.5">
      {fields.map((f, i) => (
        <div
          key={`${f.label}-${i}`}
          className={`grid grid-cols-[7.5rem_1fr] gap-3 rounded-md px-3 py-2 text-sm sm:grid-cols-[9rem_1fr] ${
            i % 2 === 0 ? 'bg-slate-50' : 'bg-indigo-50/80'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{f.label}</span>
          <span className="whitespace-pre-wrap font-medium leading-snug text-slate-800">{f.value || '—'}</span>
        </div>
      ))}
    </div>
  )
}

export default function LegalDocumentPreview({
  content,
  className = '',
  module = 'Website-Rechtliches',
  showHeader = true,
}) {
  const blocks = parseLegalMarkdown(content)
  const h1 = blocks.find((b) => b.type === 'h1')
  const nodes = []
  let fieldBuffer = []
  let key = 0

  const flushFields = () => {
    if (fieldBuffer.length) {
      nodes.push(<FieldGrid key={`f-${key++}`} fields={fieldBuffer} />)
      fieldBuffer = []
    }
  }

  blocks.forEach((block) => {
    switch (block.type) {
      case 'h1':
        if (block.text !== h1?.text) {
          flushFields()
          nodes.push(
            <h2
              key={`h1-${key++}`}
              className="mb-2 mt-4 border-b-2 border-indigo-500 pb-1 text-base font-bold text-indigo-900"
            >
              {block.text}
            </h2>
          )
        }
        break
      case 'disclaimer':
        flushFields()
        nodes.push(
          <div
            key={`d-${key++}`}
            className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs leading-relaxed text-indigo-800"
          >
            {block.text}
          </div>
        )
        break
      case 'h2':
        flushFields()
        nodes.push(
          <h3
            key={`h2-${key++}`}
            className="mb-2 mt-5 inline-block min-w-[40%] border-b-2 border-indigo-400 pb-0.5 text-xs font-bold uppercase tracking-wide text-indigo-700"
          >
            {block.text}
          </h3>
        )
        break
      case 'field':
        fieldBuffer.push(block)
        break
      case 'list':
        flushFields()
        nodes.push(
          <ul key={`ul-${key++}`} className="my-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {block.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        )
        break
      case 'hr':
        flushFields()
        nodes.push(<hr key={`hr-${key++}`} className="my-4 border-indigo-200" />)
        break
      case 'note':
        flushFields()
        nodes.push(
          <p key={`n-${key++}`} className="mt-2 text-xs italic text-slate-500">
            {block.text}
          </p>
        )
        break
      case 'p':
      default:
        flushFields()
        nodes.push(
          <p key={`p-${key++}`} className="my-1.5 text-sm leading-relaxed text-slate-700">
            {block.text}
          </p>
        )
        break
    }
  })
  flushFields()

  const date = new Date().toLocaleDateString('de-DE')

  return (
    <div className={`legal-doc-preview overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {showHeader && (
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 px-4 py-3 text-white">
          <span className="float-right text-[11px] opacity-90">{date}</span>
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-90">{BRAND_SUITE_NAME}</p>
          <p className="text-xs opacity-85">{module}</p>
        </div>
      )}
      <div className="border-t-[3px] border-indigo-500 p-5">
        {h1 && (
          <h1 className="mb-3 text-lg font-bold tracking-tight text-indigo-950">{h1.text}</h1>
        )}
        {nodes}
      </div>
    </div>
  )
}
