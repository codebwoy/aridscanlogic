import { useRef, useState } from 'react'
import { Zap, ZapOff, ImagePlus, X, RefreshCw, AlertCircle, Camera } from 'lucide-react'
import { useCameraStream, CAMERA_ERROR } from '@/lib/camera/useCameraStream'
import { captureVideoFrame } from '@/lib/camera/captureFrame'

export default function TaxVaultCamera({ onCapture, onCancel }) {
  const fileRef = useRef(null)
  const [flashOn, setFlashOn] = useState(false)
  const { videoRef, active, starting, errorKind, errorMessage, startCamera, stopStream } = useCameraStream({
    facingMode: 'environment',
    idealWidth: 1080,
    idealHeight: 1920,
    autoStart: false,
  })

  const finishCapture = (dataUrl) => {
    onCapture?.(dataUrl)
    stopStream()
  }

  const capture = () => {
    if (!active) {
      startCamera()
      return
    }
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
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted autoPlay />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 px-6 text-center">
            {errorKind ? (
              <>
                <AlertCircle className="h-10 w-10 text-amber-400" aria-hidden />
                <p className="text-sm text-slate-200">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={starting}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold"
                >
                  <RefreshCw className={`h-4 w-4 ${starting ? 'animate-spin' : ''}`} aria-hidden />
                  Erneut versuchen
                </button>
                {errorKind === CAMERA_ERROR.DENIED && (
                  <p className="text-[11px] text-slate-500">Kamera in der Adressleiste zulassen.</p>
                )}
              </>
            ) : (
              <>
                <Camera className="h-12 w-12 text-brand-400" aria-hidden />
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={starting}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold"
                >
                  {starting ? 'Wird gestartet…' : 'Kamera aktivieren'}
                </button>
              </>
            )}
          </div>
        )}
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onFile}
        />
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
          disabled={!active}
          className="rounded-full bg-white/10 p-4 disabled:opacity-40"
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
