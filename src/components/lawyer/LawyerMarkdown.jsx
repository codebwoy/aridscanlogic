import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { lawyerMarkdownSchema } from '@/lib/lawyer/sanitizeSchema'
import { normalizeLawyerMarkdown } from '@/lib/lawyer/markdownNormalize'

const schema = {
  ...lawyerMarkdownSchema,
  protocols: {
    ...lawyerMarkdownSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
}

const components = {
  h2: ({ children }) => (
    <h2 className="mb-3 border-b border-brand-500/30 pb-2 text-lg font-bold tracking-tight text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-2 leading-relaxed text-slate-200">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-brand-100">{children}</strong>,
  ul: ({ children }) => <ul className="my-2 list-none space-y-2 pl-0">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-400">
      {children}
    </ol>
  ),
  li: ({ node, children }) => {
    const ordered = node?.parent?.tagName === 'ol'
    if (ordered) {
      return <li className="leading-relaxed text-slate-200 [&>p]:my-0">{children}</li>
    }
    return (
      <li className="flex gap-2.5 leading-relaxed text-slate-200 [&>p]:my-0">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500/90" aria-hidden />
        <span className="min-w-0 flex-1">{children}</span>
      </li>
    )
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-brand-500/20 bg-slate-900/50">
      <table className="w-full min-w-[280px] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-brand-900/80 to-indigo-950/80 text-xs uppercase tracking-wide text-brand-200">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-slate-700/60">{children}</tbody>,
  tr: ({ children }) => <tr className="transition-colors hover:bg-brand-950/30">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2.5 font-semibold first:rounded-tl-xl last:rounded-tr-xl">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2.5 text-slate-300">{children}</td>,
  hr: () => <hr className="my-4 border-0 border-t border-brand-500/20" />,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-brand-500/50 bg-brand-950/25 py-1 pl-3 text-slate-300">
      {children}
    </blockquote>
  ),
}

export function isExecutiveSummary(content) {
  if (!content || typeof content !== 'string') return false
  return /^##\s*(Executive Summary|Zusammenfassung)/im.test(content.trim())
}

export function splitDisclaimer(markdown) {
  const trimmed = (markdown || '').trimEnd()
  const match = trimmed.match(/\n\*([^*\n]+(?:\n(?!\*)[^*\n]+)*)\*\s*$/s)
  if (!match) return { body: trimmed, disclaimer: null }
  return {
    body: trimmed.slice(0, match.index).trimEnd(),
    disclaimer: match[1].trim(),
  }
}

export default function LawyerMarkdown({ children, className = '' }) {
  const normalized = normalizeLawyerMarkdown(children)
  const { body, disclaimer } = splitDisclaimer(normalized)

  return (
    <div className={`lawyer-prose ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, schema]]} components={components}>
        {body}
      </ReactMarkdown>
      {disclaimer && (
        <p className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2.5 text-xs italic leading-relaxed text-slate-400">
          {disclaimer}
        </p>
      )}
    </div>
  )
}
