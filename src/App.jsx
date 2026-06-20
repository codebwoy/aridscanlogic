import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ScanVaultRoot from './pages/scanvault/ScanVaultRoot'
import { applySeo } from '@/lib/seo/applySeo'
import { getAppMode, getShareToken, setAppMode, RETURN_TAB_KEY } from '@/lib/navigation/mode'
import { setTabHash } from '@/lib/navigation/tabs'

export default function App() {
  const [mode, setMode] = useState(getAppMode)

  const openSuite = () => {
    setAppMode('suite')
    setMode('suite')
    const returnTab = sessionStorage.getItem(RETURN_TAB_KEY)
    if (returnTab) {
      sessionStorage.removeItem(RETURN_TAB_KEY)
      setTabHash(returnTab)
    }
  }

  const openScanVault = () => {
    sessionStorage.setItem(RETURN_TAB_KEY, 'settings')
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
