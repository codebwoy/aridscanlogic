import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ScanVaultRoot from './pages/scanvault/ScanVaultRoot'
import { applySeo } from '@/lib/seo/applySeo'
import { getAppMode, getShareToken, setAppMode } from '@/lib/navigation/mode'

export default function App() {
  const [mode, setMode] = useState(getAppMode)

  const openSuite = () => {
    setAppMode('suite')
    setMode('suite')
  }

  const openScanVault = () => {
    setAppMode('scanvault')
    setMode('scanvault')
  }

  useEffect(() => {
    if (mode === 'scanvault' || getShareToken()) applySeo('scanvault')
    else applySeo('suite')
  }, [mode])

  if (mode === 'scanvault' || getShareToken()) {
    return <ScanVaultRoot onOpenBusinessSuite={openSuite} />
  }

  return <Dashboard onOpenScanVault={openScanVault} />
}
