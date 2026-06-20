import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const schema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
}

/** Renders markdown with HTML stripped (XSS-safe for LLM/OCR output). */
export default function SafeMarkdown({ children, className = '' }) {
  return (
    <div className={`safe-prose ${className}`}>
      <ReactMarkdown rehypePlugins={[[rehypeSanitize, schema]]}>{children}</ReactMarkdown>
    </div>
  )
}
