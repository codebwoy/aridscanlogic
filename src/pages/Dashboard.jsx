import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import TabBar from '@/components/layout/TabBar'
import PremiumModal from '@/components/layout/PremiumModal'
import DocsPage from './DocsPage'
import TaxVaultHome from './taxvault/TaxVaultHome'
import DocDraftHome from './docdraft/DocDraftHome'
import ContractSafeHome from './contractsafe/ContractSafeHome'
import SettingsPage from './SettingsPage'
import LawyerAIPage from './LawyerAIPage'
import { GuideProvider } from '@/context/GuideContext'
import AppGuideDrawer from '@/components/guide/AppGuideDrawer'
import GuideFab from '@/components/guide/GuideFab'

const TAB_CONTENT = {
  tax: TaxVaultHome,
  docdraft: DocDraftHome,
  contracts: ContractSafeHome,
  lawyer: LawyerAIPage,
}

export default function Dashboard({ onOpenScanVault }) {
  const [activeTab, setActiveTab] = useState('docs')
  const ActivePage = TAB_CONTENT[activeTab] || DocsPage
  const isLawyer = activeTab === 'lawyer'

  return (
    <GuideProvider activeModule={activeTab}>
    <AppShell
      variant="suite"
      fullHeight={isLawyer}
      nav={<TabBar activeTab={activeTab} onTabChange={setActiveTab} />}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={isLawyer ? 'app-panel-full flex min-h-0 flex-1 flex-col' : ''}
        >
          {activeTab === 'docs' ? (
            <DocsPage
              onOpenTaxVault={() => setActiveTab('tax')}
              onOpenDocDraft={() => setActiveTab('docdraft')}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPage onOpenScanVault={onOpenScanVault} />
          ) : (
            <ActivePage />
          )}
        </motion.div>
      </AnimatePresence>
      <PremiumModal />
      <GuideFab />
      <AppGuideDrawer />
    </AppShell>
    </GuideProvider>
  )
}
