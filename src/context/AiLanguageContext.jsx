import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getAiLanguage, saveAiLanguage } from '@/lib/ai/languageStorage'

const AiLanguageContext = createContext(null)

export function AiLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getAiLanguage())

  const setLanguage = useCallback((lang) => {
    const next = lang === 'en' ? 'en' : 'de'
    setLanguageState(next)
    saveAiLanguage(next)
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isEnglish: language === 'en',
    }),
    [language, setLanguage]
  )

  return <AiLanguageContext.Provider value={value}>{children}</AiLanguageContext.Provider>
}

export function useAiLanguage() {
  const ctx = useContext(AiLanguageContext)
  if (!ctx) throw new Error('useAiLanguage must be used within AiLanguageProvider')
  return ctx
}

export function useAiLanguageOptional() {
  return useContext(AiLanguageContext)
}
