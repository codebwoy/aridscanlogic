import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TabBar from '@/components/layout/TabBar'
import PremiumModal from '@/components/layout/PremiumModal'
import DocsPage from './DocsPage'
import TaxVaultHome from './taxvault/TaxVaultHome'
import DocDraftHome from './docdraft/DocDraftHome'
import ContractSafeHome from './contractsafe/ContractSafeHome'
import SettingsPage from './SettingsPage'
import LawyerAIPage from './LawyerAIPage'

const TAB_CONTENT = {
  tax: TaxVaultHome,
  docdraft: DocDraftHome,
  contracts: ContractSafeHome,
  lawyer: LawyerAIPage,
}

export default function Dashboard({ onOpenScanVault }) {
  const [activeTab, setActiveTab] = useState('docs')
  const ActivePage = TAB_CONTENT[activeTab] || DocsPage

  return (
    <div className="app-shell flex min-h-full flex-col text-slate-100">
      <main className="mx-auto w-full max-w-lg flex-1 overflow-hidden pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={activeTab === 'lawyer' ? 'h-[calc(100dvh-6rem)]' : ''}
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
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <PremiumModal />
    </div>
  )
}
