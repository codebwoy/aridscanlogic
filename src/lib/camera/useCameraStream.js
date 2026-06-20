import { useRef, useEffect, useState, useCallback } from 'react'

export const CAMERA_ERROR = {
  DENIED: 'denied',
  NOT_FOUND: 'notfound',
  BUSY: 'busy',
  INSECURE: 'insecure',
  UNSUPPORTED: 'unsupported',
  UNKNOWN: 'unknown',
}

export function classifyCameraError(err) {
  const name = err?.name || ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') return CAMERA_ERROR.DENIED
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return CAMERA_ERROR.NOT_FOUND
  if (name === 'NotReadableError' || name === 'TrackStartError') return CAMERA_ERROR.BUSY
  if (name === 'SecurityError') return CAMERA_ERROR.INSECURE
  if (name === 'NotSupportedError' || name === 'TypeError') return CAMERA_ERROR.UNSUPPORTED
  return CAMERA_ERROR.UNKNOWN
}

export function cameraErrorMessage(kind, lang = 'de') {
  const de = lang !== 'en'
  switch (kind) {
    case CAMERA_ERROR.DENIED:
      return de
        ? 'Kamerazugriff blockiert. Erlauben Sie die Kamera in den Browser-Einstellungen (Adressleiste) und tippen Sie auf „Erneut versuchen“.'
        : 'Camera access blocked. Allow camera in browser settings (address bar) and tap Retry.'
    case CAMERA_ERROR.NOT_FOUND:
      return de ? 'Keine Kamera gefunden.' : 'No camera found on this device.'
    case CAMERA_ERROR.BUSY:
      return de
        ? 'Kamera wird bereits verwendet. Schließen Sie andere Apps und versuchen Sie es erneut.'
        : 'Camera is in use. Close other apps using the camera and retry.'
    case CAMERA_ERROR.INSECURE:
      return de
        ? 'Kamera erfordert HTTPS oder localhost. Öffnen Sie die App über eine sichere Verbindung.'
        : 'Camera requires HTTPS or localhost.'
    case CAMERA_ERROR.UNSUPPORTED:
      return de ? 'Kamera wird in diesem Browser nicht unterstützt.' : 'Camera is not supported in this browser.'
    default:
      return de ? 'Kamera konnte nicht gestartet werden.' : 'Could not start the camera.'
  }
}

async function requestCameraStream(facingMode, idealWidth, idealHeight) {
  const attempts = [
    {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: idealWidth },
        height: { ideal: idealHeight },
      },
      audio: false,
    },
    { video: { facingMode: { ideal: facingMode } }, audio: false },
    { video: { facingMode }, audio: false },
    { video: true, audio: false },
  ]

  let lastErr
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      lastErr = err
      if (classifyCameraError(err) === CAMERA_ERROR.DENIED) throw err
    }
  }
  throw lastErr
}

/**
 * @param {object} opts
 * @param {boolean} [opts.autoStart=false] Prefer false — camera permission works best after a user tap.
 */
export function useCameraStream({
  facingMode = 'environment',
  idealWidth = 1920,
  idealHeight = 1080,
  autoStart = false,
} = {}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [active, setActive] = useState(false)
  const [errorKind, setErrorKind] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [starting, setStarting] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setActive(false)
  }, [])

  const attachStream = useCallback(async (stream) => {
    streamRef.current = stream
    const video = videoRef.current
    if (!video) {
      setActive(true)
      return
    }
    video.srcObject = stream
    try {
      await video.play()
      setActive(true)
    } catch {
      setActive(true)
    }
  }, [])

  const startCamera = useCallback(async () => {
    setStarting(true)
    setErrorKind(null)
    setErrorMessage(null)

    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setErrorKind(CAMERA_ERROR.INSECURE)
      setErrorMessage(cameraErrorMessage(CAMERA_ERROR.INSECURE))
      setStarting(false)
      return false
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorKind(CAMERA_ERROR.UNSUPPORTED)
      setErrorMessage(cameraErrorMessage(CAMERA_ERROR.UNSUPPORTED))
      setStarting(false)
      return false
    }

    try {
      stopStream()
      const stream = await requestCameraStream(facingMode, idealWidth, idealHeight)
      await attachStream(stream)
      setStarting(false)
      return true
    } catch (err) {
      const kind = classifyCameraError(err)
      setErrorKind(kind)
      setErrorMessage(cameraErrorMessage(kind))
      setActive(false)
      if (import.meta.env.DEV) console.error(err)
      setStarting(false)
      return false
    }
  }, [facingMode, idealWidth, idealHeight, stopStream, attachStream])

  useEffect(() => {
    if (!autoStart) return undefined
    startCamera()
    return stopStream
  }, [autoStart, startCamera, stopStream])

  useEffect(() => {
    const stream = streamRef.current
    const video = videoRef.current
    if (stream && video && video.srcObject !== stream) {
      video.srcObject = stream
      video.play().catch(() => {})
    }
  })

  const hadStreamRef = useRef(false)
  useEffect(() => {
    if (streamRef.current) hadStreamRef.current = true
  })

  useEffect(() => {
    if (!hadStreamRef.current) return
    startCamera()
  }, [facingMode, startCamera])

  return {
    videoRef,
    streamRef,
    active,
    starting,
    errorKind,
    errorMessage,
    startCamera,
    stopStream,
  }
}
