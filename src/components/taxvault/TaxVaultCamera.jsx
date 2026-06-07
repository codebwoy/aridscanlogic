import { useRef, useState } from 'react'
import { Zap, ZapOff, ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCameraStream } from '@/lib/camera/useCameraStream'
import { captureVideoFrame } from '@/lib/camera/captureFrame'

export default function TaxVaultCamera({ onCapture, onCancel }) {
  const fileRef = useRef(null)
  const [flashOn, setFlashOn] = useState(false)
  const { videoRef, stopStream } = useCameraStream({
    facingMode: 'environment',
    idealWidth: 1080,
    idealHeight: 1920,
  })

  const finishCapture = (dataUrl) => {
    onCapture?.(dataUrl)
    stopStream()
  }

  const capture = () => {
    const dataUrl = captureVideoFrame(videoRef.current, 0.92)
    if (dataUrl) finishCapture(dataUrl)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => finishCapture(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <button
        type="button"
        onClick={onCancel}
        className="safe-top absolute left-4 z-10 rounded-full bg-black/50 p-2"
        aria-label="Abbrechen"
      >
        <X className="h-6 w-6 text-white" aria-hidden />
      </button>
      <div className="relative flex-1">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-dashed border-brand-400/80" />
      </div>
      <div className="flex items-center justify-around bg-black/90 py-6 safe-bottom">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full bg-white/10 p-4"
          aria-label="Bild aus Galerie"
        >
          <ImagePlus className="h-7 w-7 text-white" aria-hidden />
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        <button
          type="button"
          onClick={capture}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white"
          aria-label="Beleg fotografieren"
        >
          <div className="h-14 w-14 rounded-full bg-white" />
        </button>
        <button
          type="button"
          onClick={() => setFlashOn(!flashOn)}
          className="rounded-full bg-white/10 p-4"
          aria-label={flashOn ? 'Blitz aus' : 'Blitz an'}
        >
          {flashOn ? (
            <Zap className="h-7 w-7 text-yellow-300" aria-hidden />
          ) : (
            <ZapOff className="h-7 w-7 text-white" aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}
