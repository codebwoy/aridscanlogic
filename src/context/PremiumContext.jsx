import { createContext, useContext, useState, useCallback } from 'react'
import {
  getEffectiveSuitePlan,
  isSuitePremium,
  startSuitePlanTrial,
  subscribeToSuitePlan,
  setSuiteFreePlan,
  restoreSuitePurchases,
} from '@/lib/suite/subscription'
import { suitePlanDisplayName } from '@/lib/suite/plans'

const PremiumContext = createContext(null)

export function PremiumProvider({ children }) {
  const [plan, setPlan] = useState(() => getEffectiveSuitePlan())
  const [isPremium, setIsPremium] = useState(() => isSuitePremium())
  const [modalOpen, setModalOpen] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)
  const [modalFeature, setModalFeature] = useState('')

  const refreshPlan = useCallback(() => {
    const effective = getEffectiveSuitePlan()
    setPlan(effective)
    setIsPremium(isSuitePremium())
  }, [])

  const openPlans = useCallback(() => {
    setModalOpen(false)
    setPlansOpen(true)
  }, [])

  const closePlans = useCallback(() => {
    setPlansOpen(false)
    refreshPlan()
  }, [refreshPlan])

  const requirePremium = useCallback(
    (featureName, onAllowed) => {
      if (isSuitePremium()) {
        onAllowed?.()
        return true
      }
      setModalFeature(featureName)
      setModalOpen(true)
      return false
    },
    []
  )

  const activateTrial = useCallback(() => {
    startSuitePlanTrial('pro')
    refreshPlan()
    setModalOpen(false)
    setPlansOpen(false)
  }, [refreshPlan])

  const startTrial = useCallback(
    (planId, billing) => {
      startSuitePlanTrial(planId, billing)
      refreshPlan()
    },
    [refreshPlan]
  )

  const subscribe = useCallback(
    (planId, billing) => {
      subscribeToSuitePlan(planId, billing)
      refreshPlan()
    },
    [refreshPlan]
  )

  const setFree = useCallback(() => {
    setSuiteFreePlan()
    refreshPlan()
  }, [refreshPlan])

  const restore = useCallback(() => restoreSuitePurchases(), [])

  return (
    <PremiumContext.Provider
      value={{
        plan,
        isPremium,
        modalOpen,
        plansOpen,
        modalFeature,
        setModalOpen,
        openPlans,
        closePlans,
        requirePremium,
        activateTrial,
        startTrial,
        subscribe,
        setFree,
        restore,
        refreshPlan,
        planDisplayName: (lang) => suitePlanDisplayName(plan, lang),
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
