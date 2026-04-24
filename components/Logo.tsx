'use client'

interface LogoProps {
  size?: number
  stacked?: boolean
  glyph?: boolean
}

export default function Logo({ size = 24, stacked = false, glyph = false }: LogoProps) {
  const r = size * 0.38
  const glyphW = size * 1.4
  const glyphH = size * 0.72
  const cx1 = glyphW * 0.36
  const cx2 = glyphW * 0.64
  const cy = glyphH / 2
  const strokeW = Math.max(1.5, size * 0.055)

  const GlyphSvg = (
    <svg
      width={glyphW}
      height={glyphH}
      viewBox={`0 0 ${glyphW} ${glyphH}`}
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="voltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8FF00" />
          <stop offset="100%" stopColor="#A8D900" />
        </linearGradient>
        <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#E0547F" />
        </linearGradient>
        <clipPath id="leftClip">
          <rect x={0} y={0} width={glyphW / 2} height={glyphH} />
        </clipPath>
        <clipPath id="rightClip">
          <rect x={glyphW / 2} y={0} width={glyphW / 2} height={glyphH} />
        </clipPath>
      </defs>
      {/* Left circle — volt */}
      <circle
        cx={cx1}
        cy={cy}
        r={r}
        stroke="url(#voltGrad)"
        strokeWidth={strokeW}
        fill="none"
        opacity={0.9}
      />
      {/* Right circle — rose */}
      <circle
        cx={cx2}
        cy={cy}
        r={r}
        stroke="url(#roseGrad)"
        strokeWidth={strokeW}
        fill="none"
        opacity={0.9}
      />
      {/* Overlap blend arc — volt side */}
      <circle
        cx={cx1}
        cy={cy}
        r={r}
        stroke="url(#voltGrad)"
        strokeWidth={strokeW * 1.2}
        fill="none"
        clipPath="url(#rightClip)"
        opacity={0.4}
      />
      {/* Overlap blend arc — rose side */}
      <circle
        cx={cx2}
        cy={cy}
        r={r}
        stroke="url(#roseGrad)"
        strokeWidth={strokeW * 1.2}
        fill="none"
        clipPath="url(#leftClip)"
        opacity={0.4}
      />
    </svg>
  )

  if (glyph) return GlyphSvg

  const fontSize = Math.round(size * 0.65)
  const wordmark = (
    <span
      style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 800,
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <span style={{ color: 'var(--volt)' }}>Spot</span>
      <span style={{ color: '#F5F7FA' }}>Me</span>
    </span>
  )

  if (stacked) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: size * 0.18,
        }}
      >
        {GlyphSvg}
        {wordmark}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.25,
      }}
    >
      {GlyphSvg}
      {wordmark}
    </div>
  )
}
