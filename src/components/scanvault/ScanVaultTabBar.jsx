import { ScanLine, Files, FolderOpen, Settings, LayoutGrid } from 'lucide-react'
import ResponsiveNav from '@/components/layout/ResponsiveNav'
import { BRAND_SUITE_NAME } from '@/lib/brand'

const TABS = [
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'documents', label: 'Documents', icon: Files },
  { id: 'folders', label: 'Folders', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function ScanVaultTabBar({ activeTab, onTabChange, onBackToSuite }) {
  return (
    <ResponsiveNav
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="scanvault"
      layoutId="sv-tab"
      brandTitle="ScanVault"
      brandSubtitle="Document scanner"
      footerAction={
        onBackToSuite
          ? {
              icon: LayoutGrid,
              label: BRAND_SUITE_NAME,
              onClick: onBackToSuite,
            }
          : undefined
      }
    />
  )
}
