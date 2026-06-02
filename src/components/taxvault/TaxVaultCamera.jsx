import { useRef, useEffect, useCallback, useState } from 'react'
import { Zap, ZapOff, ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'

export default function TaxVaultCamera({ onCapture, onCancel }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef = useRef(null)
  const [flashOn, setFlashOn] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch {
      toast.error('Camera access denied')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [startCamera])

  const capture = () => {
    const video = videoRef.current
    if (!video?.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    onCapture?.(canvas.toDataURL('image/jpeg', 0.92))
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onCapture?.(reader.result)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <button type="button" onClick={onCancel} className="safe-top absolute left-4 z-10 rounded-full bg-black/50 p-2">
        <X className="h-6 w-6 text-white" />
      </button>
      <div className="relative flex-1">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-dashed border-brand-400/80" />
      </div>
      <div className="flex items-center justify-around bg-black/90 py-6 safe-bottom">
        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full bg-white/10 p-4">
          <ImagePlus className="h-7 w-7 text-white" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        <button
          type="button"
          onClick={capture}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white"
        >
          <div className="h-14 w-14 rounded-full bg-white" />
        </button>
        <button type="button" onClick={() => setFlashOn(!flashOn)} className="rounded-full bg-white/10 p-4">
          {flashOn ? <Zap className="h-7 w-7 text-yellow-300" /> : <ZapOff className="h-7 w-7 text-white" />}
        </button>
      </div>
    </div>
  )
}
