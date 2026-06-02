import { useRef, useEffect, useState, useCallback } from 'react'
import { Zap, ZapOff, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { dataUrlToJpegFile } from '@/lib/imageProcessing'
import { detectDocumentEdgesFromVideo } from '@/lib/scanvault/edgeDetection'

export default function ScanVaultCamera({
  onCapture,
  onGalleryPick,
  flashMode = 'auto',
  autoCapture = false,
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef = useRef(null)
  const stableFramesRef = useRef(0)
  const capturingRef = useRef(false)
  const [facingMode, setFacingMode] = useState('environment')
  const [flashOn, setFlashOn] = useState(false)
  const [edges, setEdges] = useState({ tl: false, tr: false, br: false, bl: false })
  const [detectedCorners, setDetectedCorners] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
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
  }, [facingMode])

  useEffect(() => {
    startCamera()
    return () => streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [startCamera])

  const capture = useCallback(() => {
    if (capturingRef.current) return
    const video = videoRef.current
    if (!video?.videoWidth) return
    capturingRef.current = true
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const detection = detectDocumentEdgesFromVideo(video)
    onCapture?.(dataUrl, detection?.corners)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    capturingRef.current = false
  }, [onCapture])

  useEffect(() => {
    const id = setInterval(() => {
      const video = videoRef.current
      if (!video?.videoWidth || capturingRef.current) return
      const detection = detectDocumentEdgesFromVideo(video)
      if (!detection) return
      setEdges(detection.edges)
      setDetectedCorners(detection.corners)

      if (autoCapture && detection.stable) {
        stableFramesRef.current += 1
        if (stableFramesRef.current >= 4) {
          stableFramesRef.current = 0
          capture()
        }
      } else {
        stableFramesRef.current = 0
      }
    }, 350)
    return () => clearInterval(id)
  }, [autoCapture, capture])

  const handleFiles = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const jpeg =
        file.type === 'image/jpeg'
          ? file
          : await dataUrlToJpegFile(
              await new Promise((res, rej) => {
                const r = new FileReader()
                r.onload = () => res(r.result)
                r.onerror = rej
                r.readAsDataURL(file)
              }),
              'scan.jpg'
            )
      const url = await new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = () => res(r.result)
        r.onerror = rej
        r.readAsDataURL(jpeg)
      })
      onGalleryPick?.(url, null)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    } catch {
      toast.error('Could not load image')
    }
    e.target.value = ''
  }

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()?.[0]
    if (!track?.getCapabilities?.().torch) {
      setFlashOn((f) => !f)
      return
    }
    try {
      await track.applyConstraints({ advanced: [{ torch: !flashOn }] })
      setFlashOn(!flashOn)
    } catch {
      setFlashOn((f) => !f)
    }
  }

  const cornerStyle = (corner) => {
    if (!detectedCorners) return {}
    const c = detectedCorners[corner === 'tl' ? 0 : corner === 'tr' ? 1 : corner === 'br' ? 2 : 3]
    return { left: `${c.x * 100}%`, top: `${c.y * 100}%` }
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="relative flex-1">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <div className="pointer-events-none absolute inset-0">
          {detectedCorners && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points={detectedCorners.map((c) => `${c.x * 100},${c.y * 100}`).join(' ')}
                fill="rgba(0,122,255,0.08)"
                stroke="rgba(0,122,255,0.7)"
                strokeWidth="0.4"
              />
            </svg>
          )}
          {['tl', 'tr', 'br', 'bl'].map((corner) => (
            <span
              key={corner}
              className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 border-[#22c55e] transition-opacity ${
                corner === 'tl'
                  ? 'border-l-4 border-t-4'
                  : corner === 'tr'
                    ? 'border-r-4 border-t-4'
                    : corner === 'br'
                      ? 'border-r-4 border-b-4'
                      : 'border-l-4 border-b-4'
              } ${edges[corner] ? 'opacity-100' : 'opacity-40'}`}
              style={detectedCorners ? cornerStyle(corner) : { left: corner.includes('l') ? '12%' : '88%', top: corner.includes('t') ? '12%' : '88%' }}
            />
          ))}
        </div>
        {autoCapture && (
          <p className="pointer-events-none absolute bottom-24 left-0 right-0 text-center text-xs text-white/70">
            Hold steady — auto-capture when edges detected
          </p>
        )}
        <button
          type="button"
          onClick={toggleFlash}
          className="absolute right-4 safe-top rounded-full bg-black/50 p-3 min-h-[48px] min-w-[48px]"
          aria-label="Flash"
        >
          {flashOn || flashMode === 'on' ? (
            <Zap className="h-6 w-6 text-yellow-300" />
          ) : (
            <ZapOff className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-around bg-black/90 px-6 py-6 safe-bottom">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-white/10 p-3"
        >
          <ImagePlus className="h-7 w-7 text-white" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFiles} />
        <button
          type="button"
          onClick={capture}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-white/20"
          aria-label="Capture"
        >
          <div className="h-14 w-14 rounded-full bg-white" />
        </button>
        <button
          type="button"
          onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
          className="min-h-[48px] rounded-full px-4 text-sm text-white/80"
        >
          Flip
        </button>
      </div>
    </div>
  )
}
