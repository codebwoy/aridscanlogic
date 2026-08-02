import { useEffect, useRef, useState } from 'react'
import { ResponsiveContainer } from 'recharts'

/**
 * Mount Recharts ResponsiveContainer only after the container has positive size.
 * Avoids width/height -1 warnings and rare DOM crashes during tab transitions.
 */
export default function SafeChart({
  children,
  className = '',
  height = 160,
  minWidth = 64,
  debounceMs = 50,
}) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const [size, setSize] = useState({ w: 0, h: height })

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') {
      setReady(true)
      setSize({ w: minWidth, h: height })
      return undefined
    }

    let timer = 0
    const apply = (w, h) => {
      const width = Math.floor(w)
      const nextH = Math.floor(h) || height
      if (width >= minWidth && nextH > 0) {
        setSize({ w: width, h: nextH })
        setReady(true)
      }
    }

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height: boxH } = entry.contentRect
      window.clearTimeout(timer)
      timer = window.setTimeout(() => apply(width, boxH || height), debounceMs)
    })

    ro.observe(el)
    const rect = el.getBoundingClientRect()
    apply(rect.width, rect.height || height)

    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [height, minWidth, debounceMs])

  return (
    <div
      ref={ref}
      className={['min-w-0', className || 'w-full'].filter(Boolean).join(' ')}
      style={{ height, minHeight: height }}
    >
      {ready ? (
        <ResponsiveContainer width="100%" height={size.h || height} minWidth={0} minHeight={1}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600" aria-hidden>
          …
        </div>
      )}
    </div>
  )
}
