import { downloadTextFile } from '@/lib/pdfUtils'

export function exportConversationTranscript(messages, title = 'Herr_Mueller') {
  const lines = messages.map((m) => {
    const who = m.role === 'user' ? 'You' : 'Herr Müller'
    return `## ${who}\n\n${m.content}\n`
  })
  downloadTextFile(lines.join('\n---\n\n'), `${title}_${new Date().toISOString().slice(0, 10)}.md`)
}
