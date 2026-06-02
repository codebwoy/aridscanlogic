import { createContext, useContext, useState, useCallback } from 'react'

const PremiumContext = createContext(null)
const STORAGE_KEY = 'scanlogic_premium_trial'

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'active'
    } catch {
      return false
    }
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalFeature, setModalFeature] = useState('')

  const requirePremium = useCallback(
    (featureName, onAllowed) => {
      if (isPremium) {
        onAllowed?.()
        return true
      }
      setModalFeature(featureName)
      setModalOpen(true)
      return false
    },
    [isPremium]
  )

  const activateTrial = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'active')
    setIsPremium(true)
    setModalOpen(false)
  }, [])

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        modalOpen,
        modalFeature,
        setModalOpen,
        requirePremium,
        activateTrial,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider')
  return ctx
}
