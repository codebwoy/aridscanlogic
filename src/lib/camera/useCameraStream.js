import { useRef, useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'

export function useCameraStream({ facingMode = 'environment', idealWidth = 1920, idealHeight = 1080 } = {}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [active, setActive] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setActive(false)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      stopStream()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: idealWidth }, height: { ideal: idealHeight } },
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
      if (import.meta.env.DEV) console.error(err)
    }
  }, [facingMode, idealWidth, idealHeight, stopStream])

  useEffect(() => {
    startCamera()
    return stopStream
  }, [startCamera, stopStream])

  return { videoRef, streamRef, active, startCamera, stopStream }
}
