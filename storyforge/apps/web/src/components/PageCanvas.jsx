import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva'
import { useEffect, useState } from 'react'

function hslToken(name, alpha) {
  if (typeof document === 'undefined') return 'transparent'
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!raw) return 'transparent'
  return alpha == null ? `hsl(${raw})` : `hsl(${raw} / ${alpha})`
}

function useHtmlImage(url) {
  const [img, setImg] = useState(null)
  useEffect(() => {
    if (!url) {
      setImg(null)
      return
    }
    const image = new window.Image()
    image.onload = () => setImg(image)
    image.onerror = () => setImg(null)
    image.src = url
  }, [url])
  return img
}

/** Konva workspace — shows preview image + text-safe zone. */
export default function PageCanvas({
  width = 640,
  height = 640,
  title = 'Page preview',
  safeInset = 40,
  previewUrl = null,
  pageLabel = '',
  pageText = '',
}) {
  const bg = hslToken('--sf-card')
  const primary = hslToken('--sf-primary')
  const muted = hslToken('--sf-muted')
  const mutedDim = hslToken('--sf-muted', 0.75)
  const img = useHtmlImage(previewUrl)

  return (
    <div className="sf-konva-frame" role="img" aria-label={title}>
      <Stage width={width} height={height}>
        <Layer>
          <Rect width={width} height={height} fill={bg} />
          {img ? (
            <KonvaImage image={img} x={0} y={0} width={width} height={height} />
          ) : (
            <Text
              text="Character / scene layer"
              x={safeInset + 16}
              y={height / 2 - 24}
              width={width - safeInset * 2 - 32}
              align="center"
              fill={muted}
              fontSize={16}
            />
          )}
          <Rect
            x={safeInset}
            y={safeInset}
            width={width - safeInset * 2}
            height={height - safeInset * 2}
            stroke={primary}
            strokeWidth={1}
            dash={[6, 4]}
          />
          <Text
            text={pageLabel || 'Text-safe zone (trim config)'}
            x={safeInset + 16}
            y={safeInset + 12}
            width={width - safeInset * 2 - 32}
            fill={mutedDim}
            fontSize={12}
          />
          {pageText ? (
            <Text
              text={pageText.slice(0, 280)}
              x={safeInset + 16}
              y={height - safeInset - 80}
              width={width - safeInset * 2 - 32}
              fill={muted}
              fontSize={14}
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  )
}
