import { Download, Check } from 'lucide-react'
import { toast } from 'sonner'
import { usePwaInstall } from '@/hooks/usePwaInstall'

export default function InstallPwaButton() {
  const { canInstall, install, isInstalled } = usePwaInstall()

  if (isInstalled && !canInstall) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <Check className="h-6 w-6 shrink-0 text-emerald-400" />
        <div className="text-left">
          <p className="font-medium text-emerald-200">App installiert</p>
          <p className="text-xs text-slate-400">ScanLogic läuft als installierte App auf diesem Gerät.</p>
        </div>
      </div>
    )
  }

  if (!canInstall) return null

  const handleInstall = async () => {
    const ok = await install()
    if (ok) toast.success('ScanLogic wurde installiert')
    else toast.message('Installation abgebrochen')
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-brand-900/80 to-slate-800 p-4"
    >
      <div className="flex items-center gap-3">
        <Download className="h-6 w-6 text-brand-300" />
        <div className="text-left">
          <p className="font-medium">App installieren</p>
          <p className="text-xs text-slate-400">Zum Startbildschirm · Offline · Vollbild</p>
        </div>
      </div>
    </button>
  )
}
