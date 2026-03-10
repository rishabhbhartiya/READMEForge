// src/lib/renderers/containers.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  buildFilter, buildImageElement, buildClipRect, buildPlaceholder,
  getThemeColors, Theme, uniqueId,
  hexPoints, starPoints,
} from '../metals'

// ─── IMAGE CONTAINER ─────────────────────────────────────────────────────────

export type FrameStyle = 'metallic' | 'glass' | 'polaroid' | 'circuit' | 'hologram' | 'neon-sign'

export interface ImageContainerOptions {
  /** Full image URL. GitHub README SECURITY NOTE:
   *  GitHub's markdown proxy strips <image> elements from SVGs for security.
   *  For README embedding, use standard markdown: ![alt](url)
   *  This SVG frame works in browsers, GitHub Pages, and direct img src tags. */
  src?: string
  alt?: string
  width?: number
  height?: number
  frame?: FrameStyle
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  caption?: string
  rounded?: boolean
  glow?: boolean
  theme?: Theme
}

export function renderImageContainer(opts: ImageContainerOptions): string {
  const {
    src = '',
    alt = 'Image',
    width = 300,
    height = 220,
    frame = 'metallic',
    rounded = true,
    glow = true,
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 800)
  const h = Math.min(Math.max(Number(height), 80), 600)
  const uid = uniqueId('mimg')
  const pad = 12
  const innerR = rounded ? 8 : 2
  const captionH = opts.caption ? 32 : 0
  const imgH = h - pad * 2 - captionH

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const accentColor = m.glow

  // Filters
  const { id: glowFid, defs: glowDefs } = buildFilter(
    { glow: true, glowColor: accentColor, glowStrength: 1.5 }, `${uid}_gf`
  )
  const neonFilter = `<filter id="${uid}_ngf" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`
  const polaroidShadow = `<filter id="${uid}_ps">
    <feDropShadow dx="3" dy="5" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
  </filter>`

  // Clip path for image
  const clipDefs = buildClipRect(`${uid}_clip`, pad, pad, w - pad * 2, imgH, innerR, innerR)

  let frameEl = ''
  let bgRect = `<rect width="${w}" height="${h}" rx="12" fill="${theme === 'dark' ? '#0e0e1c' : '#f0f2f8'}"/>`

  if (frame === 'metallic') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="12" fill="${mainFill}"/>
      <path d="M12,2 L${w - 12},2 Q${w - 2},2 ${w - 2},12 L${w - 2},${h * 0.4}
        Q${w * 0.5},${h * 0.15} 2,${h * 0.4} L2,12 Q2,2 12,2 Z"
        fill="white" opacity="0.2"/>
      <rect x="${pad - 2}" y="${pad - 2}" width="${w - pad * 2 + 4}" height="${imgH + 4}"
        rx="${innerR + 1}" fill="black" opacity="0.5"/>`
    bgRect = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${imgH}" rx="${innerR}" fill="#060608"/>`

  } else if (frame === 'glass') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="12"
        fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <rect x="1" y="1" width="${w - 2}" height="${h / 2}" rx="12" fill="white" opacity="0.06"/>`
    bgRect = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${imgH}" rx="${innerR}" fill="rgba(0,0,0,0.3)"/>`

  } else if (frame === 'polaroid') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="4" fill="white" filter="url(#${uid}_ps)"/>
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="2" fill="#f8f8f0"/>`
    bgRect = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${imgH}" rx="2" fill="#e0e0e0"/>`

  } else if (frame === 'circuit') {
    const circuitLines = Array.from({ length: 6 }, (_, i) => {
      const x = w * (0.1 + i * 0.15)
      return `<line x1="${x}" y1="0" x2="${x}" y2="${pad - 2}" stroke="${accentColor}" stroke-width="1" opacity="0.5"/>
        <circle cx="${x}" cy="${pad - 2}" r="2" fill="${accentColor}" opacity="0.6"/>`
    }).join('')
    frameEl = `
      <rect width="${w}" height="${h}" rx="8" fill="${theme === 'dark' ? '#0a0a14' : '#f0f2f8'}"
        stroke="${mainFill}" stroke-width="1.5"/>
      ${circuitLines}
      <path d="M6,6 L18,6 M6,6 L6,18" stroke="${mainFill}" stroke-width="2" fill="none"/>
      <path d="M${w - 6},6 L${w - 18},6 M${w - 6},6 L${w - 6},18" stroke="${mainFill}" stroke-width="2" fill="none"/>
      <path d="M6,${h - 6} L18,${h - 6} M6,${h - 6} L6,${h - 18}" stroke="${mainFill}" stroke-width="2" fill="none"/>
      <path d="M${w - 6},${h - 6} L${w - 18},${h - 6} M${w - 6},${h - 6} L${w - 6},${h - 18}" stroke="${mainFill}" stroke-width="2" fill="none"/>`

  } else if (frame === 'neon-sign') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="12" fill="${theme === 'dark' ? '#050508' : '#f0f2f8'}"/>
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12"
        fill="none" stroke="${accentColor}" stroke-width="2" filter="url(#${uid}_ngf)"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="10"
        fill="none" stroke="${accentColor}" stroke-width="0.5" opacity="0.4"/>
      <!-- Animated corner sparks -->
      <circle cx="6" cy="6" r="3" fill="${accentColor}" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${w - 6}" cy="6" r="3" fill="${accentColor}" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.2s" repeatCount="indefinite"/>
      </circle>`
  }

  // Image element
  const imageEl = src
    ? buildImageElement(src, pad, pad, w - pad * 2, imgH, `${uid}_clip`)
    : buildPlaceholder(pad, pad, w - pad * 2, imgH, accentColor, alt)

  const captionEl = opts.caption ? `
    <text x="${w / 2}" y="${pad + imgH + captionH / 2 + pad / 2}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Rajdhani',Arial,sans-serif"
      font-size="13" font-weight="600"
      fill="${frame === 'polaroid' ? '#404040' : (theme === 'dark' ? '#c0c8e8' : '#404060')}"
      letter-spacing="0.5"
    >${escapeXml(opts.caption)}</text>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${alt}">
  <title>${alt}</title>
  <defs>
    ${mainDefs}
    ${glow ? glowDefs : ''}
    ${neonFilter}
    ${polaroidShadow}
    ${clipDefs}
  </defs>
  ${frameEl}
  ${bgRect}
  ${imageEl}
  ${captionEl}
</svg>`
}

// ─── LOGO CONTAINER ──────────────────────────────────────────────────────────

export type LogoStyle = 'shield' | 'hexagon' | 'circle' | 'diamond' | 'star' | 'rounded-square'

export interface LogoContainerOptions {
  text?: string
  /** Full image/logo URL.
   *  NOTE: GitHub README SVG proxy blocks remote <image> elements.
   *  Works in browsers, GitHub Pages, and direct <img> tags.
   *  For README avatar use: <img src="url" width="x" style="border-radius:50%"> */
  src?: string
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: LogoStyle
  size?: number
  glow?: boolean
  spin?: boolean
  theme?: Theme
}

export function renderLogoContainer(opts: LogoContainerOptions): string {
  const {
    text = 'MF',
    src = '',
    style = 'hexagon',
    size = 120,
    glow = true,
    spin = false,
    theme = 'dark',
  } = opts

  const s = Math.min(Math.max(Number(size), 40), 400)
  const cx = s / 2, cy = s / 2, r = s * 0.44
  const uid = uniqueId('mlgo')

  const metal = opts.metal ?? 'gold'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, s, s)

  const m = METALS[metal in METALS ? metal as MetalName : 'gold'] ?? METALS.gold
  const textColor = theme === 'dark' ? (m.textDark ?? '#fff') : (m.textLight ?? '#000')

  // Glow filter
  const { id: glowFid, defs: glowDefs } = buildFilter(
    { glow: true, glowColor: m.glow, glowStrength: 1.5 }, `${uid}_gf`
  )

  const glowAttr = glow ? `filter="url(#${glowFid})"` : ''

  let shapeEl = ''
  let clipEl = ''

  if (style === 'hexagon') {
    const pts = hexPoints(cx, cy, r)
    const innerPts = hexPoints(cx, cy, r * 0.96)
    const highlightPts = hexPoints(cx, cy - r * 0.1, r * 0.5)
    shapeEl = `
      <polygon points="${pts}" fill="${mainFill}" ${glowAttr}/>
      <polygon points="${innerPts}" fill="none" stroke="white" stroke-width="1" opacity="0.25"/>
      <polygon points="${highlightPts}" fill="white" opacity="0.08"/>`
    clipEl = `<clipPath id="${uid}_clip"><polygon points="${hexPoints(cx, cy, r * 0.88)}"/></clipPath>`

  } else if (style === 'shield') {
    const d = `M${cx},${cy - r} L${cx + r},${cy - r * 0.3} L${cx + r},${cy + r * 0.3} L${cx},${cy + r} L${cx - r},${cy + r * 0.3} L${cx - r},${cy - r * 0.3} Z`
    shapeEl = `<path d="${d}" fill="${mainFill}" ${glowAttr}/>
      <path d="${d}" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipEl = `<clipPath id="${uid}_clip"><path d="${d}"/></clipPath>`

  } else if (style === 'diamond') {
    const d = `M${cx},${cy - r} L${cx + r * 0.75},${cy} L${cx},${cy + r} L${cx - r * 0.75},${cy} Z`
    shapeEl = `<path d="${d}" fill="${mainFill}" ${glowAttr}/>
      <path d="${d}" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipEl = `<clipPath id="${uid}_clip"><path d="${d}"/></clipPath>`

  } else if (style === 'circle') {
    shapeEl = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${mainFill}" ${glowAttr}/>
      <circle cx="${cx}" cy="${cy - r * 0.3}" r="${r * 0.85}" fill="white" opacity="0.06"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipEl = `<clipPath id="${uid}_clip"><circle cx="${cx}" cy="${cy}" r="${r * 0.88}"/></clipPath>`

  } else if (style === 'star') {
    const pts = starPoints(cx, cy, r, r * 0.45, 5)
    shapeEl = `<polygon points="${pts}" fill="${mainFill}" ${glowAttr}/>
      <polygon points="${starPoints(cx, cy, r * 0.95, r * 0.42, 5)}" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipEl = `<clipPath id="${uid}_clip"><polygon points="${starPoints(cx, cy, r * 0.8, r * 0.36, 5)}"/></clipPath>`

  } else {
    // rounded-square
    const rr = r * 0.25
    shapeEl = `
      <rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" rx="${rr}" fill="${mainFill}" ${glowAttr}/>
      <rect x="${cx - r + 2}" y="${cy - r + 2}" width="${r * 2 - 4}" height="${r * 2 - 4}" rx="${rr - 1}"
        fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipEl = `<clipPath id="${uid}_clip"><rect x="${cx - r + 6}" y="${cy - r + 6}" width="${r * 2 - 12}" height="${r * 2 - 12}" rx="${rr}"/></clipPath>`
  }

  const spinAnim = spin
    ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="8s" repeatCount="indefinite"/>`
    : ''

  const contentEl = src
    ? `<image href="${src}" x="${cx - r * 0.7}" y="${cy - r * 0.7}" width="${r * 1.4}" height="${r * 1.4}"
        preserveAspectRatio="xMidYMid meet" clip-path="url(#${uid}_clip)"/>`
    : `<text x="${cx}" y="${cy + 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(r * 0.5, 48)}" font-weight="900"
        fill="${textColor}" letter-spacing="2"
      >${escapeXml(text)}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"
  role="img" aria-label="${text || 'Logo'}">
  <title>${text || 'Logo Container'}</title>
  <defs>
    ${mainDefs}
    ${glowDefs}
    ${clipEl}
  </defs>
  <g>${spinAnim ? `<g>${spinAnim}${shapeEl}</g>` : shapeEl}</g>
  ${contentEl}
</svg>`
}

// ─── GIF CONTAINER ───────────────────────────────────────────────────────────

export interface GifContainerOptions {
  /** Full GIF URL.
   *  NOTE: GitHub README SVG proxy blocks remote <image> elements.
   *  For README, use: <img src="your.gif" width="300"> */
  src?: string
  alt?: string
  width?: number
  height?: number
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  frame?: 'metallic' | 'glass' | 'neon' | 'minimal'
  label?: string
  theme?: Theme
}

export function renderGifContainer(opts: GifContainerOptions): string {
  const {
    src = '',
    alt = 'Animated GIF',
    width = 300,
    height = 200,
    frame = 'neon',
    label = 'GIF',
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 800)
  const h = Math.min(Math.max(Number(height), 80), 600)
  const uid = uniqueId('mgif')
  const pad = 8

  const metal = opts.metal ?? 'electric'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'electric'] ?? METALS.electric
  const accentColor = m.glow

  const glowFilter = `<filter id="${uid}_gf" x="-15%" y="-15%" width="130%" height="130%">
    <feGaussianBlur stdDeviation="5" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`

  const clipDefs = `<clipPath id="${uid}_clip">
    <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="4"/>
  </clipPath>`

  let frameEl = ''
  if (frame === 'neon') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="8" fill="${theme === 'dark' ? '#050508' : '#f0f2f8'}"/>
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="8"
        fill="none" stroke="${accentColor}" stroke-width="2" filter="url(#${uid}_gf)"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="6"
        fill="none" stroke="${accentColor}" stroke-width="0.5" opacity="0.4"/>
      <circle cx="6" cy="6" r="3" fill="${accentColor}" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${w - 6}" cy="6" r="3" fill="${accentColor}" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.2s" repeatCount="indefinite"/>
      </circle>`
  } else if (frame === 'metallic') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="10" fill="${mainFill}"/>
      <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="6"
        fill="${theme === 'dark' ? '#080810' : '#f4f4f8'}"/>`
  } else if (frame === 'glass') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="10" fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <rect x="1" y="1" width="${w - 2}" height="${h / 2}" rx="10" fill="white" opacity="0.04"/>`
  } else {
    frameEl = `<rect width="${w}" height="${h}" rx="6" fill="none" stroke="${mainFill}" stroke-width="1.5"/>`
  }

  const imageEl = src
    ? buildImageElement(src, pad, pad, w - pad * 2, h - pad * 2, `${uid}_clip`)
    : `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="14"
        fill="${accentColor}" letter-spacing="2"
      >[ ${escapeXml(label)} CONTAINER ]</text>
      <path d="M${w / 2 - 16},${h / 2 - 20} L${w / 2 + 20},${h / 2} L${w / 2 - 16},${h / 2 + 20} Z"
        fill="${accentColor}" opacity="0.4"/>`

  const labelEl = label ? `
    <rect x="${pad + 4}" y="${pad + 4}" width="${label.length * 7 + 14}" height="18" rx="3"
      fill="${accentColor}" opacity="0.9"/>
    <text x="${pad + label.length * 3.5 + 11}" y="${pad + 13}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Share Tech Mono',monospace" font-size="9" font-weight="700"
      fill="${theme === 'dark' ? '#fff' : '#000'}" letter-spacing="1"
    >${escapeXml(label)}</text>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${alt}">
  <title>${alt}</title>
  <defs>
    ${mainDefs}
    ${glowFilter}
    ${clipDefs}
  </defs>
  ${frameEl}
  ${imageEl}
  ${labelEl}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}