import { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, Plus, X, FlipHorizontal, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { dataUrlToJpegFile } from '@/lib/imageProcessing'

/** Capture produces JPEG DataURL strings; upload path uses Blob → File */
export default function CameraCapture({ pages, onPagesChange, onDone }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [active, setActive] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setActive(true)
    } catch (err) {
      toast.error('Kamera konnte nicht gestartet werden')
      console.error(err)
    }
  }, [facingMode])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  const addPageDataUrl = (dataUrl) => {
    onPagesChange([...pages, dataUrl])
    toast.success(`Seite ${pages.length + 1} erfasst`)
  }

  const capturePage = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    addPageDataUrl(canvas.toDataURL('image/jpeg', 0.9))
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const jpegFile =
          file.type === 'image/jpeg'
            ? file
            : await dataUrlToJpegFile(
                await blobToDataUrl(file),
                file.name.replace(/\.\w+$/, '.jpg')
              )
        const dataUrl = await blobToDataUrl(jpegFile)
        addPageDataUrl(dataUrl)
      }
    } catch {
      toast.error('Bild-Upload fehlgeschlagen')
    }
    e.target.value = ''
  }

  const removePage = (idx) => {
    onPagesChange(pages.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <Camera className="h-12 w-12 animate-pulse text-slate-500" />
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
              >
                <X className="h-3 w-3 text-white" />
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
          title="Bilder hochladen"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
          className="rounded-full bg-slate-800 p-3"
        >
          <FlipHorizontal className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={capturePage}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-500 bg-white"
        >
          <div className="h-12 w-12 rounded-full bg-brand-500" />
        </button>
        {pages.length > 0 && (
          <button
            type="button"
            onClick={onDone}
            className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Weiter ({pages.length})
          </button>
        )}
      </div>
    </div>
  )
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
