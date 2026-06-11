import { defaultSchema } from 'rehype-sanitize'

/** XSS-safe schema that keeps GFM tables for Lawyer AI markdown. */
export const lawyerMarkdownSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
  ],
  attributes: {
    ...defaultSchema.attributes,
    th: [...(defaultSchema.attributes?.th || []), 'align'],
    td: [...(defaultSchema.attributes?.td || []), 'align'],
    table: [...(defaultSchema.attributes?.table || [])],
  },
}
