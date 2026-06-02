import { useState, useEffect } from 'react'
import { applyFilter } from '@/lib/imageProcessing'

const FILTERS = [
  { id: 'auto', label: 'Auto', filter: 'magic-color' },
  { id: 'bw', label: 'B&W', filter: 'high-contrast' },
  { id: 'grayscale', label: 'Grayscale', filter: 'grayscale' },
  { id: 'color', label: 'Color', filter: 'magic-color' },
  { id: 'photo', label: 'Photo', filter: 'original' },
]

export default function ScanVaultOptimizer({ imageSrc, defaultFilter = 'auto', onApply }) {
  const [preview, setPreview] = useState(imageSrc)
  const [filterId, setFilterId] = useState(defaultFilter)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [showBefore, setShowBefore] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPreview(imageSrc)
  }, [imageSrc])

  const applyFilterPreview = async (id) => {
    setFilterId(id)
    setLoading(true)
    const spec = FILTERS.find((f) => f.id === id) || FILTERS[0]
    try {
      let result =
        spec.filter === 'original' ? imageSrc : await applyFilter(imageSrc, spec.filter)
      result = await adjustBrightnessContrast(result, brightness, contrast)
      if (rotation) result = await rotateImage(result, rotation)
      setPreview(result)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      const spec = FILTERS.find((f) => f.id === filterId) || FILTERS[0]
      let result =
        spec.filter === 'original' ? imageSrc : await applyFilter(imageSrc, spec.filter)
      result = await adjustBrightnessContrast(result, brightness, contrast)
      if (rotation) result = await rotateImage(result, rotation)
      onApply?.(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <img
          src={showBefore ? imageSrc : preview}
          alt="Preview"
          className="max-h-64 w-full object-contain"
        />
        <button
          type="button"
          onClick={() => setShowBefore((b) => !b)}
          className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-1 text-xs"
        >
          {showBefore ? 'After' : 'Before'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => applyFilterPreview(f.id)}
            className={`min-h-[48px] rounded-xl px-3 py-2 text-sm ${
              filterId === f.id ? 'bg-[#007AFF]' : 'bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="block text-xs text-slate-400">
        Brightness {brightness}%
        <input
          type="range"
          min={50}
          max={150}
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full"
        />
      </label>
      <label className="block text-xs text-slate-400">
        Contrast {contrast}%
        <input
          type="range"
          min={50}
          max={150}
          value={contrast}
          onChange={(e) => setContrast(Number(e.target.value))}
          className="w-full"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRotation((r) => (r + 90) % 360)}
          className="min-h-[48px] flex-1 rounded-xl bg-white/10 text-sm"
        >
          Rotate 90°
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="min-h-[48px] flex-1 rounded-xl bg-[#007AFF] font-semibold disabled:opacity-50"
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
    </div>
  )
}

async function adjustBrightnessContrast(src, brightness, contrast) {
  const img = await loadImg(src)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

async function rotateImage(src, deg) {
  const img = await loadImg(src)
  const canvas = document.createElement('canvas')
  const swap = deg % 180 !== 0
  canvas.width = swap ? img.height : img.width
  canvas.height = swap ? img.width : img.height
  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.drawImage(img, -img.width / 2, -img.height / 2)
  return canvas.toDataURL('image/jpeg', 0.92)
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
