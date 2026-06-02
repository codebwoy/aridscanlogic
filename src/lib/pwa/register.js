import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'

let updateSW

export function initPwa() {
  if (!import.meta.env.PROD) return

  updateSW = registerSW({
    immediate: true,
    onOfflineReady() {
      toast.success('ScanLogic ist offline bereit', {
        description: 'Die App funktioniert auch ohne Netzwerk (lokal gespeicherte Daten).',
        duration: 5000,
      })
    },
    onNeedRefresh() {
      toast('Update verfügbar', {
        description: 'Neue Version installieren?',
        duration: Infinity,
        action: {
          label: 'Aktualisieren',
          onClick: () => updateSW?.(true),
        },
      })
    },
    onRegisteredSW(_url, registration) {
      if (registration) {
        window.setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })
}
