// src/lib/renderers/containers.ts
// Image, GIF, and Logo container frames

import { MetalType, METALS, buildGradient } from '../metals'

// ─── IMAGE CONTAINER ─────────────────────────────────────────────────────────

export type FrameStyle = 'metallic' | 'glass' | 'polaroid' | 'circuit' | 'hologram' | 'badge-frame' | 'neon-sign'

export interface ImageContainerOptions {
  src?: string           // image URL to embed
  alt?: string
  width?: number
  height?: number
  frame?: FrameStyle
  metal?: MetalType
  caption?: string
  rounded?: boolean
  glow?: boolean
}

export function renderImageContainer(opts: ImageContainerOptions): string {
  const {
    src = '',
    alt = 'Image',
    width = 300,
    height = 220,
    frame = 'metallic',
    metal = 'chrome',
    caption = '',
    rounded = true,
    glow = true,
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 800)
  const h = Math.min(Math.max(Number(height), 80), 600)
  const m = METALS[metal] ?? METALS.chrome
  const uid = `mimg_${Date.now().toString(36)}`
  const pad = 12
  const innerR = rounded ? 8 : 2
  const captionH = caption ? 32 : 0
  const imgH = h - pad * 2 - captionH
  const totalH = h

  const mainGrad = buildGradient(`${uid}_g`, metal, '135')

  let frameElements = ''
  let bgRect = `<rect width="${w}" height="${totalH}" rx="12" fill="${m.isDark ? '#0e0e1c' : '#f0f2f8'}"/>`

  if (frame === 'metallic') {
    frameElements = `
      <!-- Metallic outer frame -->
      <rect width="${w}" height="${totalH}" rx="12" fill="url(#${uid}_g)"/>
      <!-- Bevel top highlight -->
      <path d="M12,2 L${w-12},2 Q${w-2},2 ${w-2},12 L${w-2},${totalH*0.4}
        Q${w*0.5},${totalH*0.15} 2,${totalH*0.4} L2,12 Q2,2 12,2 Z"
        fill="white" opacity="0.2"/>
      <!-- Inner inset shadow -->
      <rect x="${pad-2}" y="${pad-2}" width="${w-pad*2+4}" height="${imgH+4}"
        rx="${innerR+1}" fill="black" opacity="0.5"/>
    `
    bgRect = `<rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${imgH}" rx="${innerR}" fill="#060608"/>`
  } else if (frame === 'glass') {
    frameElements = `
      <rect width="${w}" height="${totalH}" rx="12"
        fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <rect x="1" y="1" width="${w-2}" height="${totalH/2}" rx="12"
        fill="white" opacity="0.06"/>
    `
    bgRect = `<rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${imgH}" rx="${innerR}" fill="rgba(0,0,0,0.3)"/>`
  } else if (frame === 'polaroid') {
    frameElements = `
      <rect width="${w}" height="${totalH}" rx="4"
        fill="white" filter="url(#${uid}_ps)"/>
      <rect x="4" y="4" width="${w-8}" height="${totalH-8}" rx="2"
        fill="#f8f8f0"/>
    `
    bgRect = `<rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${imgH}" rx="2" fill="#e0e0e0"/>`
  } else if (frame === 'circuit') {
    const circuitLines = Array.from({length: 6}, (_, i) => {
      const x = w * (0.1 + i * 0.15)
      return `<line x1="${x}" y1="0" x2="${x}" y2="${pad-2}" stroke="${m.accent}" stroke-width="1" opacity="0.5"/>
        <circle cx="${x}" cy="${pad-2}" r="2" fill="${m.accent}" opacity="0.6"/>`
    }).join('')
    frameElements = `
      <rect width="${w}" height="${totalH}" rx="8" fill="${m.isDark ? '#0a0a14' : '#f0f2f8'}"
        stroke="url(#${uid}_g)" stroke-width="1.5"/>
      ${circuitLines}
      <!-- Corner brackets -->
      <path d="M6,6 L18,6 M6,6 L6,18" stroke="url(#${uid}_g)" stroke-width="2" fill="none"/>
      <path d="M${w-6},6 L${w-18},6 M${w-6},6 L${w-6},18" stroke="url(#${uid}_g)" stroke-width="2" fill="none"/>
      <path d="M6,${totalH-6} L18,${totalH-6} M6,${totalH-6} L6,${totalH-18}" stroke="url(#${uid}_g)" stroke-width="2" fill="none"/>
      <path d="M${w-6},${totalH-6} L${w-18},${totalH-6} M${w-6},${totalH-6} L${w-6},${totalH-18}" stroke="url(#${uid}_g)" stroke-width="2" fill="none"/>
    `
  } else if (frame === 'neon-sign') {
    frameElements = `
      <rect width="${w}" height="${totalH}" rx="12" fill="${m.isDark ? '#050508' : '#f0f2f8'}"/>
      <rect x="0.5" y="0.5" width="${w-1}" height="${totalH-1}" rx="12"
        fill="none" stroke="${m.accent}" stroke-width="2"
        filter="url(#${uid}_ngf)"/>
      <rect x="3" y="3" width="${w-6}" height="${totalH-6}" rx="10"
        fill="none" stroke="${m.accent}" stroke-width="0.5" opacity="0.4"/>
    `
  }

  // Glow filter
  const glowFilter = glow ? `<filter id="${uid}_gf" x="-15%" y="-15%" width="130%" height="130%">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>` : ''
  const neonGlowFilter = `<filter id="${uid}_ngf" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`
  const polaroidShadow = `<filter id="${uid}_ps">
    <feDropShadow dx="3" dy="5" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
  </filter>`

  // Image embed (or placeholder)
  const imageEl = src
    ? `<image href="${src}" x="${pad}" y="${pad}" width="${w-pad*2}" height="${imgH}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#${uid}_clip)"/>`
    : `<!-- Placeholder grid -->
      ${Array.from({length:6},(_,i) => Array.from({length:4},(_,j) =>
        `<rect x="${pad + i*(w-pad*2)/6}" y="${pad + j*imgH/4}" width="${(w-pad*2)/6 - 1}" height="${imgH/4 - 1}"
          fill="${m.isDark ? '#1a1a28' : '#e0e4f0'}" rx="2" opacity="0.5"/>`
      ).join('')).join('')}
      <text x="${w/2}" y="${pad + imgH/2}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${m.isDark ? '#7880a0' : '#8090b0'}" letter-spacing="1"
      >[ IMAGE ]</text>`

  const captionEl = caption ? `
    <text x="${w/2}" y="${pad + imgH + captionH/2 + pad/2}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Rajdhani',Arial,sans-serif"
      font-size="13" font-weight="600"
      fill="${frame === 'polaroid' ? '#404040' : (m.isDark ? '#c0c8e8' : '#404060')}"
      letter-spacing="0.5"
    >${escapeXml(caption)}</text>
  ` : ''

  const glowApply = glow && frame !== 'polaroid' && frame !== 'glass'
    ? `filter="url(#${uid}_gf)"` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}"
  role="img" aria-label="${alt}">
  <title>${alt}</title>
  <defs>
    ${mainGrad}
    ${glowFilter}
    ${neonGlowFilter}
    ${polaroidShadow}
    <clipPath id="${uid}_clip">
      <rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${imgH}" rx="${innerR}"/>
    </clipPath>
  </defs>

  ${frameElements}
  ${bgRect}
  ${imageEl}
  ${captionEl}
</svg>`
}

// ─── LOGO CONTAINER ──────────────────────────────────────────────────────────

export type LogoStyle = 'shield' | 'hexagon' | 'circle' | 'diamond' | 'star' | 'rounded-square'

export interface LogoContainerOptions {
  text?: string        // initials or short text
  src?: string         // logo image URL
  metal?: MetalType
  style?: LogoStyle
  size?: number
  glow?: boolean
  spin?: boolean
}

export function renderLogoContainer(opts: LogoContainerOptions): string {
  const {
    text = 'MF',
    src = '',
    metal = 'gold',
    style = 'hexagon',
    size = 120,
    glow = true,
    spin = false,
  } = opts

  const s = Math.min(Math.max(Number(size), 40), 400)
  const cx = s / 2, cy = s / 2, r = s * 0.44
  const m = METALS[metal] ?? METALS.gold
  const uid = `mlgo_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '135')

  const glowFilter = glow ? `<filter id="${uid}_gf" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="${s * 0.04}" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>` : ''

  let shapeEl = ''
  let clipShape = ''

  if (style === 'hexagon') {
    const pts = Array.from({length:6}, (_,i) => {
      const a = (i * 60 - 30) * Math.PI / 180
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
    }).join(' ')
    shapeEl = `<polygon points="${pts}" fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>`
    clipShape = `<clipPath id="${uid}_clip"><polygon points="${pts}"/></clipPath>`
    // Inner highlight
    const pts2 = Array.from({length:6}, (_,i) => {
      const a = (i * 60 - 30) * Math.PI / 180
      return `${(cx + r * 0.96 * Math.cos(a)).toFixed(2)},${(cy + r * 0.96 * Math.sin(a)).toFixed(2)}`
    }).join(' ')
    shapeEl += `<polygon points="${pts2}" fill="none" stroke="white" stroke-width="1" opacity="0.25"/>
      <polygon points="${Array.from({length:6},(_,i) => {
        const a = (i*60-30)*Math.PI/180
        return `${(cx+r*0.7*Math.cos(a)).toFixed(2)},${(cy-r*0.1+r*0.5*Math.sin(a)).toFixed(2)}`
      }).join(' ')}" fill="white" opacity="0.1"/>`
  } else if (style === 'shield') {
    shapeEl = `<path d="M${cx},${cy-r} L${cx+r},${cy-r*0.3} L${cx+r},${cy+r*0.3} L${cx},${cy+r} L${cx-r},${cy+r*0.3} L${cx-r},${cy-r*0.3} Z"
      fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>`
    clipShape = `<clipPath id="${uid}_clip"><path d="M${cx},${cy-r} L${cx+r},${cy-r*0.3} L${cx+r},${cy+r*0.3} L${cx},${cy+r} L${cx-r},${cy+r*0.3} L${cx-r},${cy-r*0.3} Z"/></clipPath>`
  } else if (style === 'diamond') {
    shapeEl = `<path d="M${cx},${cy-r} L${cx+r*0.75},${cy} L${cx},${cy+r} L${cx-r*0.75},${cy} Z"
      fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>`
    clipShape = `<clipPath id="${uid}_clip"><path d="M${cx},${cy-r} L${cx+r*0.75},${cy} L${cx},${cy+r} L${cx-r*0.75},${cy} Z"/></clipPath>`
  } else if (style === 'circle') {
    shapeEl = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>
      <circle cx="${cx}" cy="${cy-r*0.3}" r="${r*0.85}" fill="white" opacity="0.08"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipShape = `<clipPath id="${uid}_clip"><circle cx="${cx}" cy="${cy}" r="${r * 0.9}"/></clipPath>`
  } else if (style === 'star') {
    const starPts = Array.from({length:10},(_,i) => {
      const a = (i * 36 - 90) * Math.PI / 180
      const rad = i % 2 === 0 ? r : r * 0.45
      return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`
    }).join(' ')
    shapeEl = `<polygon points="${starPts}" fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>`
    clipShape = `<clipPath id="${uid}_clip"><polygon points="${starPts}"/></clipPath>`
  } else {
    // rounded-square
    shapeEl = `<rect x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" rx="${r*0.25}"
      fill="url(#${uid}_g)" ${glow ? 'filter="url(#'+uid+'_gf)"' : ''}/>
      <rect x="${cx-r+2}" y="${cy-r+2}" width="${r*2-4}" height="${r*2-4}" rx="${r*0.2}"
        fill="none" stroke="white" stroke-width="1" opacity="0.2"/>`
    clipShape = `<clipPath id="${uid}_clip"><rect x="${cx-r+4}" y="${cy-r+4}" width="${r*2-8}" height="${r*2-8}" rx="${r*0.2}"/></clipPath>`
  }

  const spinAnim = spin
    ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="8s" repeatCount="indefinite"/>`
    : ''

  const contentEl = src
    ? `<image href="${src}" x="${cx-r*0.7}" y="${cy-r*0.7}" width="${r*1.4}" height="${r*1.4}"
        preserveAspectRatio="xMidYMid meet" clip-path="url(#${uid}_clip)"/>`
    : `<text x="${cx}" y="${cy+2}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(r * 0.5, 48)}" font-weight="900"
        fill="${m.isDark ? m.textLight : m.textDark}"
        letter-spacing="2"
      >${escapeXml(text)}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"
  role="img" aria-label="${text || 'Logo'}">
  <title>${text || 'Logo Container'}</title>
  <defs>
    ${mainGrad}
    ${glowFilter}
    ${clipShape}
  </defs>

  <g>${spinAnim}${shapeEl}</g>
  ${contentEl}
</svg>`
}

// ─── GIF CONTAINER ───────────────────────────────────────────────────────────

export interface GifContainerOptions {
  src?: string
  alt?: string
  width?: number
  height?: number
  metal?: MetalType
  frame?: 'metallic' | 'glass' | 'neon' | 'minimal'
  label?: string    // optional "GIF" label badge
}

export function renderGifContainer(opts: GifContainerOptions): string {
  const {
    src = '',
    alt = 'Animated GIF',
    width = 300,
    height = 200,
    metal = 'electric',
    frame = 'neon',
    label = 'GIF',
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 800)
  const h = Math.min(Math.max(Number(height), 80), 600)
  const m = METALS[metal] ?? METALS.electric
  const uid = `mgif_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')
  const pad = 8

  const glowFilter = `<filter id="${uid}_gf" x="-15%" y="-15%" width="130%" height="130%">
    <feGaussianBlur stdDeviation="5" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`

  let frameEl = ''
  if (frame === 'neon') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="8" fill="${m.isDark ? '#050508' : '#f0f2f8'}"/>
      <rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" rx="8"
        fill="none" stroke="${m.accent}" stroke-width="2" filter="url(#${uid}_gf)"/>
      <rect x="3" y="3" width="${w-6}" height="${h-6}" rx="6"
        fill="none" stroke="${m.accent}" stroke-width="0.5" opacity="0.4"/>
      <!-- Corner sparks -->
      <circle cx="6" cy="6" r="3" fill="${m.accent}" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${w-6}" cy="6" r="3" fill="${m.accent}" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    `
  } else if (frame === 'metallic') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="10" fill="url(#${uid}_g)"/>
      <rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${h-pad*2}" rx="6" fill="${m.isDark ? '#080810' : '#f4f4f8'}"/>
    `
  } else if (frame === 'glass') {
    frameEl = `
      <rect width="${w}" height="${h}" rx="10" fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    `
  } else {
    frameEl = `<rect width="${w}" height="${h}" rx="6" fill="none" stroke="url(#${uid}_g)" stroke-width="1.5"/>`
  }

  const imageEl = src
    ? `<image href="${src}" x="${pad}" y="${pad}" width="${w-pad*2}" height="${h-pad*2}"
        preserveAspectRatio="xMidYMid slice" clip-path="url(#${uid}_clip)"/>`
    : `<text x="${w/2}" y="${h/2}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="14"
        fill="${m.accent}" letter-spacing="2"
      >[ ${label} CONTAINER ]</text>
      <!-- Play button placeholder -->
      <path d="M${w/2-16},${h/2-20} L${w/2+20},${h/2} L${w/2-16},${h/2+20} Z"
        fill="${m.accent}" opacity="0.4"/>`

  const labelEl = label ? `
    <rect x="${pad+4}" y="${pad+4}" width="${label.length * 7 + 14}" height="18" rx="3"
      fill="${m.accent}" opacity="0.9"/>
    <text x="${pad + label.length*3.5 + 11}" y="${pad + 13}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Share Tech Mono',monospace" font-size="9" font-weight="700"
      fill="${m.isDark ? m.textLight : m.textDark}" letter-spacing="1"
    >${label}</text>
  ` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${alt}">
  <title>${alt}</title>
  <defs>
    ${mainGrad}
    ${glowFilter}
    <clipPath id="${uid}_clip">
      <rect x="${pad}" y="${pad}" width="${w-pad*2}" height="${h-pad*2}" rx="4"/>
    </clipPath>
  </defs>

  ${frameEl}
  ${imageEl}
  ${labelEl}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
