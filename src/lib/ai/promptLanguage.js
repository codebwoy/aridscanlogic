/** Instruction snippet for LLM prompts — matches app AI language toggle. */
export function aiLanguageInstruction(language = 'de') {
  return language === 'en'
    ? 'Respond in English only. Use English labels in structured output.'
    : 'Antworte ausschließlich auf Deutsch. Verwende deutsche Bezeichnungen in strukturierten Ausgaben.'
}
