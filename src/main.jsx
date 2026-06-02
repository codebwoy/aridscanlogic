import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PremiumProvider } from './context/PremiumContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
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
    </AuthProvider>
  </StrictMode>
)
