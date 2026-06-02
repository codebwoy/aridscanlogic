import { ScanLine, Files, FolderOpen, Settings } from 'lucide-react'
import ResponsiveNav from '@/components/layout/ResponsiveNav'

const TABS = [
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'documents', label: 'Documents', icon: Files },
  { id: 'folders', label: 'Folders', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function ScanVaultTabBar({ activeTab, onTabChange }) {
  return (
    <ResponsiveNav
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="scanvault"
      layoutId="sv-tab"
      brandTitle="ScanVault"
      brandSubtitle="Document scanner"
    />
  )
}
