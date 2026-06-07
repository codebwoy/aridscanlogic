import { useState, useEffect } from 'react'
import { Wand2, Eraser } from 'lucide-react'
import { applyFilter } from '@/lib/imageProcessing'
import { SUITE_FILTERS } from '@/lib/imageFilters'
import { aiBackgroundRemoval } from '@/lib/backgroundRemoval'
import { usePremium } from '@/context/PremiumContext'
import { toast } from 'sonner'

const FILTERS = SUITE_FILTERS

export default function DocOptimizer({ imageSrc, onOptimized }) {
  const [preview, setPreview] = useState(imageSrc)
  const [loading, setLoading] = useState(false)
  const { requirePremium } = usePremium()

  useEffect(() => {
    setPreview(imageSrc)
  }, [imageSrc])

  const apply = async (filterId) => {
    if (filterId === 'original') {
      setPreview(imageSrc)
      onOptimized(imageSrc)
      return
    }
    const spec = FILTERS.find((f) => f.id === filterId)
    setLoading(true)
    try {
      const result = await applyFilter(imageSrc, spec?.filter || filterId)
      setPreview(result)
      onOptimized(result)
      toast.success('Filter applied')
    } catch {
      toast.error('Filter failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBgErase = () => {
    requirePremium('AI Background Removal', async () => {
      setLoading(true)
      try {
        const result = await aiBackgroundRemoval(preview)
        setPreview(result)
        onOptimized(result)
        toast.success('Background replaced with white')
      } catch {
        toast.error('Background removal failed')
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="premium-card relative aspect-[3/4] overflow-hidden p-1">
        <img src={preview} alt="Preview" className="h-full w-full rounded-xl object-contain" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
            <Wand2 className="h-8 w-8 animate-spin text-brand-400" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => apply(f.id)}
            disabled={loading}
            className="rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm hover:border-brand-500/40 disabled:opacity-50"
          >
            {f.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleBgErase}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-gradient-to-r from-brand-600/30 to-indigo-600/20 py-3 text-sm font-medium text-brand-200"
      >
        <Eraser className="h-4 w-4" />
        AI Background Removal (edge-aware)
      </button>
    </div>
  )
}
