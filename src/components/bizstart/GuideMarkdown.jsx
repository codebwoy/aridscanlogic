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
  h1: ({ children }) => (
    <h1 className="mb-2 text-base font-bold leading-snug tracking-tight text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2.5 mt-4 border-b border-brand-500/25 pb-1.5 text-sm font-bold text-brand-100 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-2 text-sm leading-relaxed text-slate-200">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-brand-100">{children}</strong>,
  ul: ({ children }) => <ul className="my-2 list-none space-y-1.5 pl-0">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1.5 pl-5 text-sm marker:font-semibold marker:text-brand-400">
      {children}
    </ol>
  ),
  li: ({ node, children }) => {
    const ordered = node?.parent?.tagName === 'ol'
    if (ordered) {
      return <li className="leading-relaxed text-slate-200 [&>p]:my-0">{children}</li>
    }
    return (
      <li className="flex gap-2 text-sm leading-relaxed text-slate-200 [&>p]:my-0">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500/90" aria-hidden />
        <span className="min-w-0 flex-1">{children}</span>
      </li>
    )
  },
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-brand-500/20 bg-slate-900/60">
      <table className="w-full min-w-[260px] border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-brand-900/90 to-brand-800/80 text-[10px] uppercase tracking-wide text-brand-100">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-slate-700/50">{children}</tbody>,
  tr: ({ children }) => <tr className="transition-colors hover:bg-brand-950/25">{children}</tr>,
  th: ({ children }) => <th className="px-2.5 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-2.5 py-2 text-slate-300">{children}</td>,
  hr: () => <hr className="my-3 border-0 border-t border-brand-500/20" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2 rounded-lg border-l-2 border-brand-500/50 bg-brand-950/30 py-1 pl-3 text-sm text-slate-300">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-300 underline decoration-brand-500/40 underline-offset-2 hover:text-brand-200"
    >
      {children}
    </a>
  ),
}

/** Branded markdown for BizStart registration guide chat (GFM tables, dark theme). */
export default function GuideMarkdown({ children, className = '' }) {
  const normalized = normalizeLawyerMarkdown(children)

  return (
    <div className={`guide-prose ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, schema]]} components={components}>
        {normalized}
      </ReactMarkdown>
    </div>
  )
}
