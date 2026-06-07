import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import { PremiumProvider } from './context/PremiumContext.jsx'
import './index.css'
import { initPwa } from './lib/pwa/register'
import { ensureLlmStatus } from './lib/anthropic'
import { initAppStorage } from './lib/appApi'
import { applySeo } from './lib/seo/applySeo'

applySeo('suite')
initPwa()
ensureLlmStatus()
initAppStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ConfirmProvider>
          <PremiumProvider>
            <App />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'bg-slate-800 text-white border-slate-700',
            },
          }}
          richColors
        />
          </PremiumProvider>
        </ConfirmProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
