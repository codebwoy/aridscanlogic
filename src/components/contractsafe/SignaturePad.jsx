import { useRef, useEffect, useState, useCallback } from 'react'
import { Eraser, Check } from 'lucide-react'

/** Touch/mouse canvas signature → base64 PNG data URL */
export default function SignaturePad({ onSave, onCancel }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [hasStroke, setHasStroke] = useState(false)

  const getPoint = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const p = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const p = getPoint(e)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    setHasStroke(true)
  }

  const end = () => {
    drawing.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasStroke(false)
  }

  const confirm = () => {
    if (!hasStroke) return
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.72)
    onSave?.(base64)
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-slate-400">Unterschrift im Feld zeichnen</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full touch-none rounded-xl border-2 border-slate-600 bg-white"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm">
          Abbrechen
        </button>
        <button type="button" onClick={clear} className="rounded-xl bg-slate-800 px-4 py-3">
          <Eraser className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={!hasStroke}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Signieren
        </button>
      </div>
    </div>
  )
}
