import { useState, useCallback, useEffect } from 'react'
import { Check } from 'lucide-react'
import { perspectiveCrop } from '@/lib/imageProcessing'
import { toast } from 'sonner'

const DEFAULT_CORNERS = [
  { x: 0.08, y: 0.1 },
  { x: 0.92, y: 0.1 },
  { x: 0.92, y: 0.9 },
  { x: 0.08, y: 0.9 },
]

export default function PerspectiveCrop({ imageSrc, onCropped, initialCorners }) {
  const [corners, setCorners] = useState(initialCorners || DEFAULT_CORNERS)
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    if (initialCorners?.length === 4) setCorners(initialCorners)
  }, [imageSrc, initialCorners])

  const handlePointerDown = (idx) => (e) => {
    e.preventDefault()
    setDragging(idx)
  }

  const handlePointerMove = useCallback(
    (e) => {
      if (dragging === null) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.min(0.98, Math.max(0.02, (e.clientX - rect.left) / rect.width))
      const y = Math.min(0.98, Math.max(0.02, (e.clientY - rect.top) / rect.height))
      setCorners((prev) => prev.map((c, i) => (i === dragging ? { x, y } : c)))
    },
    [dragging]
  )

  const handlePointerUp = () => setDragging(null)

  const applyCrop = async () => {
    try {
      const cropped = await perspectiveCrop(imageSrc, corners)
      onCropped(cropped)
      toast.success('Perspektive zugeschnitten')
    } catch {
      toast.error('Zuschnitt fehlgeschlagen')
    }
  }

  const points = corners.map((c) => `${c.x * 100},${c.y * 100}`).join(' ')

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-slate-400">
        Ziehen Sie die Ecken auf die Dokumentkanten
      </p>
      <div
        className="relative aspect-[3/4] touch-none overflow-hidden rounded-2xl bg-black"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img src={imageSrc} alt="Crop" className="h-full w-full object-contain" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={points}
            fill="rgba(99,102,241,0.15)"
            stroke="#818cf8"
            strokeWidth="0.5"
          />
          {corners.map((c, i) => (
            <circle
              key={i}
              cx={c.x * 100}
              cy={c.y * 100}
              r="2.5"
              fill="#6366f1"
              stroke="white"
              strokeWidth="0.4"
              className="cursor-grab"
              onPointerDown={handlePointerDown(i)}
            />
          ))}
        </svg>
      </div>
      <button
        type="button"
        onClick={applyCrop}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-semibold"
      >
        <Check className="h-5 w-5" />
        Zuschnitt anwenden
      </button>
    </div>
  )
}
