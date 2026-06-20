import { lazy, Suspense, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import TabBar from '@/components/layout/TabBar'
import PremiumModal from '@/components/layout/PremiumModal'
import SuitePlansPage from '@/pages/SuitePlansPage'
import { usePremium } from '@/context/PremiumContext'
import { GuideProvider } from '@/context/GuideContext'
import AppGuideDrawer from '@/components/guide/AppGuideDrawer'
import GuideFab from '@/components/guide/GuideFab'
import { applySeo } from '@/lib/seo/applySeo'
import { tabFromHash, setTabHash, subscribeTabHash } from '@/lib/navigation/tabs'
import { trackActivity } from '@/lib/activity/trackActivity'

const DocsPage = lazy(() => import('./DocsPage'))
const TaxVaultHome = lazy(() => import('./taxvault/TaxVaultHome'))
const DocDraftHome = lazy(() => import('./docdraft/DocDraftHome'))
const ContractSafeHome = lazy(() => import('./contractsafe/ContractSafeHome'))
const SettingsPage = lazy(() => import('./SettingsPage'))
const LawyerAIPage = lazy(() => import('./LawyerAIPage'))

const TAB_CONTENT = {
  tax: TaxVaultHome,
  docdraft: DocDraftHome,
  contracts: ContractSafeHome,
  lawyer: LawyerAIPage,
}

const SEO_TAB_KEYS = new Set(['docs', 'tax', 'docdraft', 'contracts', 'lawyer', 'settings'])

function TabFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4" aria-busy="true" aria-label="Wird geladen">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-800/60" />
    </div>
  )
}

export default function Dashboard({ onOpenScanVault }) {
  const [activeTab, setActiveTab] = useState(tabFromHash)
  const { plansOpen, closePlans } = usePremium()
  const ActivePage = TAB_CONTENT[activeTab] || DocsPage
  const isLawyer = activeTab === 'lawyer'

  useEffect(() => subscribeTabHash(setActiveTab), [])

  useEffect(() => {
    if (!window.location.hash) setTabHash(activeTab)
  }, [activeTab])

  const changeTab = (tab) => {
    setActiveTab(tab)
    setTabHash(tab)
  }

  useEffect(() => {
    applySeo(SEO_TAB_KEYS.has(activeTab) ? activeTab : 'suite')
    trackActivity('module.view', { metadata: { module: activeTab } })
  }, [activeTab])

  return (
    <GuideProvider activeModule={activeTab}>
      <AppShell
        variant="suite"
        fullHeight={isLawyer}
        nav={<TabBar activeTab={activeTab} onTabChange={changeTab} />}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={isLawyer ? 'app-panel-full flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden' : 'min-w-0 max-w-full overflow-x-hidden'}
          >
            <Suspense fallback={<TabFallback />}>
              {activeTab === 'docs' ? (
                <DocsPage
                  onOpenTaxVault={() => changeTab('tax')}
                  onOpenDocDraft={() => changeTab('docdraft')}
                />
              ) : activeTab === 'settings' ? (
                <SettingsPage onOpenScanVault={onOpenScanVault} />
              ) : (
                <ActivePage />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
        <PremiumModal />
        {plansOpen && <SuitePlansPage onBack={closePlans} />}
        <GuideFab />
        <AppGuideDrawer />
      </AppShell>
    </GuideProvider>
  )
}
