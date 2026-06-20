import { useRef, useState } from 'react'
import { Camera, Plus, X, FlipHorizontal, ImagePlus, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { dataUrlToJpegFile } from '@/lib/imageProcessing'
import { useCameraStream, CAMERA_ERROR } from '@/lib/camera/useCameraStream'
import { blobToDataUrl, captureVideoFrame } from '@/lib/camera/captureFrame'

/** Capture produces JPEG DataURL strings; upload path uses Blob → File */
export default function CameraCapture({ pages, onPagesChange, onDone }) {
  const fileInputRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const { videoRef, active, starting, errorKind, errorMessage, startCamera } = useCameraStream({
    facingMode,
    autoStart: false,
  })

  const addPageDataUrl = (dataUrl) => {
    onPagesChange([...pages, dataUrl])
    toast.success(`Seite ${pages.length + 1} erfasst`)
  }

  const capturePage = () => {
    if (!active) {
      startCamera()
      return
    }
    const dataUrl = captureVideoFrame(videoRef.current, 0.9)
    if (dataUrl) addPageDataUrl(dataUrl)
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      for (const file of files) {
        const jpegFile =
          file.type === 'image/jpeg'
            ? file
            : await dataUrlToJpegFile(await blobToDataUrl(file), file.name.replace(/\.\w+$/, '.jpg'))
        addPageDataUrl(await blobToDataUrl(jpegFile))
      }
    } catch {
      toast.error('Bild-Upload fehlgeschlagen')
    }
    e.target.value = ''
  }

  const removePage = (idx) => {
    onPagesChange(pages.filter((_, i) => i !== idx))
  }

  const enableCamera = () => {
    startCamera()
  }

  const showOverlay = !active

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted autoPlay />
        {showOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/90 px-6 text-center">
            {errorKind ? (
              <>
                <AlertCircle className="h-10 w-10 text-amber-400" aria-hidden />
                <p className="text-sm leading-relaxed text-slate-200">{errorMessage}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={enableCamera}
                    disabled={starting}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <RefreshCw className={`h-4 w-4 ${starting ? 'animate-spin' : ''}`} aria-hidden />
                    Erneut versuchen
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <ImagePlus className="h-4 w-4" aria-hidden />
                    Bild hochladen
                  </button>
                </div>
                {errorKind === CAMERA_ERROR.DENIED && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Tipp: Klicken Sie auf das Kamera-Symbol in der Adressleiste und wählen Sie „Zulassen“.
                  </p>
                )}
              </>
            ) : (
              <>
                <Camera className="h-12 w-12 text-brand-400" aria-hidden />
                <p className="text-sm text-slate-300">Kamera für Dokumentenscan aktivieren</p>
                <button
                  type="button"
                  onClick={enableCamera}
                  disabled={starting}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {starting ? 'Wird gestartet…' : 'Kamera aktivieren'}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 underline"
                >
                  Stattdessen Bild hochladen
                </button>
              </>
            )}
          </div>
        )}
        <div className="pointer-events-none absolute inset-4 rounded-lg border-2 border-dashed border-white/40" />
      </div>

      {pages.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {pages.map((p, i) => (
            <div key={i} className="relative shrink-0">
              <img src={p} alt={`Seite ${i + 1}`} className="h-16 w-12 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removePage(i)}
                className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5"
                aria-label={`Seite ${i + 1} entfernen`}
              >
                <X className="h-3 w-3 text-white" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-slate-800 p-3"
          aria-label="Bilder hochladen"
        >
          <ImagePlus className="h-5 w-5" aria-hidden />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
          disabled={!active}
          className="rounded-full bg-slate-800 p-3 disabled:opacity-40"
          aria-label="Kamera wechseln"
        >
          <FlipHorizontal className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={capturePage}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-500 bg-white"
          aria-label="Seite aufnehmen"
        >
          <div className="h-12 w-12 rounded-full bg-brand-500" />
        </button>
        {pages.length > 0 && (
          <button
            type="button"
            onClick={onDone}
            className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Weiter ({pages.length})
          </button>
        )}
      </div>
    </div>
  )
}
