import { Stage, Layer, Rect, Text, Image as KonvaImage, Ellipse, Path } from 'react-konva'
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

/** Konva workspace — preview image, text-safe zone, optional speech bubble. */
export default function PageCanvas({
  width = 640,
  height = 640,
  title = 'Page preview',
  safeInset = 40,
  previewUrl = null,
  pageLabel = '',
  pageText = '',
  speechBubble = '',
}) {
  const bg = hslToken('--sf-card')
  const primary = hslToken('--sf-primary')
  const muted = hslToken('--sf-muted')
  const mutedDim = hslToken('--sf-muted', 0.75)
  const bubbleFill = hslToken('--sf-card')
  const bubbleStroke = hslToken('--sf-fg')
  const img = useHtmlImage(previewUrl)
  const bubble = String(speechBubble || '').trim()
  const bubbleW = Math.min(280, width * 0.42)
  const bubbleH = Math.min(120, 36 + Math.ceil(bubble.length / 28) * 18)
  const bubbleX = width - safeInset - bubbleW - 8
  const bubbleY = safeInset + 28

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
          {bubble ? (
            <>
              <Ellipse
                x={bubbleX + bubbleW / 2}
                y={bubbleY + bubbleH / 2}
                radiusX={bubbleW / 2}
                radiusY={bubbleH / 2}
                fill={bubbleFill}
                stroke={bubbleStroke}
                strokeWidth={2}
                opacity={0.94}
              />
              <Path
                data={`M ${bubbleX + bubbleW * 0.35} ${bubbleY + bubbleH - 4} L ${bubbleX + bubbleW * 0.22} ${bubbleY + bubbleH + 28} L ${bubbleX + bubbleW * 0.55} ${bubbleY + bubbleH - 2} Z`}
                fill={bubbleFill}
                stroke={bubbleStroke}
                strokeWidth={2}
              />
              <Text
                text={bubble.slice(0, 120)}
                x={bubbleX + 18}
                y={bubbleY + 16}
                width={bubbleW - 36}
                align="center"
                fill={bubbleStroke}
                fontSize={13}
                fontStyle="bold"
                lineHeight={1.2}
              />
            </>
          ) : null}
          {pageText ? (
            <Text
              text={pageText.slice(0, 420)}
              x={safeInset + 16}
              y={height - safeInset - 110}
              width={width - safeInset * 2 - 32}
              fill={muted}
              fontSize={13}
              lineHeight={1.25}
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  )
}
