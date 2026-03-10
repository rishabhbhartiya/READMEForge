// src/lib/renderers/button.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  buildFilter, getThemeColors, Theme, DesignStyle, uniqueId,
  ButtonVariant, ButtonConfig, renderButton as coreRenderButton,
} from '../metals'

// Re-export ButtonVariant from metals for convenience
export type { ButtonVariant } from '../metals'

export type ButtonStyle =
  | 'beveled' | 'pill' | 'sharp' | 'engraved' | 'ghost'
  | 'solid' | 'outline' | 'gradient' | 'glow' | '3d'
  | 'neo' | 'glass' | 'brutalist' | 'cta' | 'retro' | 'pixel'

export interface ButtonOptions {
  label?: string
  icon?: string
  /** MetalName, CSS color, or comma-separated gradient e.g. '#ff0000,#0000ff' */
  metal?: string
  colors?: string        // multi-stop gradient
  angle?: number         // gradient angle
  width?: number
  height?: number
  style?: ButtonStyle
  fontSize?: number
  href?: string          // Destination URL for README markdown link wrapping
  theme?: Theme
  textColor?: string
  borderRadius?: number
  animated?: boolean
}

/**
 * README CLICKABLE BUTTON:
 * SVG images in markdown cannot be clicked directly.
 * To create a clickable button in a README, wrap the SVG URL in a markdown link:
 *
 *   [![Label](https://your-api.com/api/button?label=Click+Me&metal=gold)](https://destination.com)
 *
 * The `href` param stores the destination URL but is NOT embedded in the SVG itself.
 * Use it in your API route to generate the above markdown string.
 */
export function renderButton(opts: ButtonOptions): string {
  const {
    label = 'Click Me',
    icon = '',
    style = 'beveled',
    fontSize = 15,
    theme = 'dark',
    animated = true,
  } = opts

  const charWidth = fontSize * 0.65
  const iconExtra = icon ? fontSize + 6 : 0
  const minWidth = label.length * charWidth + iconExtra + 48
  const w = Math.min(Math.max(Number(opts.width ?? minWidth), 80), 500)
  const h = Math.min(Math.max(Number(opts.height ?? 44), 28), 100)

  // Resolve color
  const colorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (opts.metal ?? 'chrome')
  const { fill: mainFill, defs: mainDefs } = resolveColor(
    colorSpec as ColorSpec,
    w, h
  )

  const metal = opts.metal ?? 'chrome'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const textColor = opts.textColor ?? (theme === 'dark' ? (m.textDark ?? '#fff') : (m.textLight ?? '#000'))

  const uid = uniqueId('mb')

  const r =
    style === 'pill' ? h / 2 :
      style === 'sharp' ? 2 :
        style === 'engraved' ? 6 :
          style === 'brutalist' ? 0 :
            opts.borderRadius ?? 8

  const displayText = icon ? `${icon} ${label}` : label
  const cx = w / 2, cy = h / 2

  // Shared filter defs
  const { id: shadowId, defs: shadowDefs } = buildFilter(
    { shadow: true, shadowDy: 2, shadowBlur: 3, shadowColor: m.shadow, shadowOpacity: 0.55 },
    `${uid}_sf`
  )

  let extraDefs = ''
  let shape = ''
  let bevel = ''

  // Highlight gradient
  const hiId = `${uid}_hi`
  extraDefs += `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="white" stop-opacity="0.55"/>
    <stop offset="50%" stop-color="white" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.12"/>
  </linearGradient>`

  if (style === 'engraved') {
    shape = `
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="${m.shadow}" opacity="0.5"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${r - 1}" fill="${mainFill}"/>
      <rect x="3" y="3" width="${w - 6}" height="${(h - 6) / 2}" rx="${r - 1}" fill="url(#${hiId})" opacity="0.5"/>`
    bevel = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none"
      stroke="black" stroke-width="1.5" opacity="0.3"/>`

  } else if (style === 'ghost' || style === 'outline') {
    shape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="transparent"/>
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none"
        stroke="${mainFill}" stroke-width="2"/>`

  } else if (style === 'glass') {
    shape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <rect width="${w}" height="${h / 2}" rx="${r}" fill="rgba(255,255,255,0.08)"/>`

  } else if (style === 'brutalist') {
    shape = `
      <rect x="4" y="4" width="${w}" height="${h}" rx="0" fill="#000"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="0" fill="${mainFill}"
        stroke="#000" stroke-width="3"/>
      <rect x="0" y="0" width="${w}" height="${h * 0.5}" fill="white" opacity="0.12"/>`

  } else if (style === 'neo') {
    const bg = theme === 'dark' ? '#1e2030' : '#E0E5EC'
    const s1 = theme === 'dark' ? '#0a0c18' : '#a3b1c6'
    const s2 = theme === 'dark' ? '#323660' : '#ffffff'
    const neofid = `${uid}_neo`
    extraDefs += `<filter id="${neofid}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-3" dy="-3" stdDeviation="6" flood-color="${s2}" flood-opacity="0.7"/>
      <feDropShadow dx="3" dy="3" stdDeviation="6" flood-color="${s1}" flood-opacity="0.8"/>
    </filter>`
    shape = `<rect width="${w}" height="${h}" rx="${r}" fill="${bg}" filter="url(#${neofid})"/>`

  } else if (style === 'cta') {
    const ctaGid = `${uid}_ctag`
    const ctaFid = `${uid}_ctaf`
    extraDefs += `<linearGradient id="${ctaGid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6C3AF4"/>
      <stop offset="100%" stop-color="#C026D3"/>
    </linearGradient>
    <filter id="${ctaFid}">
      <feGaussianBlur stdDeviation="8" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`
    shape = `
      <rect x="2" y="8" width="${w - 4}" height="${h}" rx="${r}" fill="rgba(108,58,244,0.4)" filter="url(#${ctaFid})"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="url(#${ctaGid})"/>
      <rect x="0" y="0" width="${w}" height="${h / 2.5}" rx="${r}" fill="rgba(255,255,255,0.15)"/>`

  } else if (style === 'retro') {
    shape = `
      <rect x="3" y="3" width="${w}" height="${h}" rx="2" fill="${m.shadow}"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="2" fill="${mainFill}"
        stroke="${m.highlight}" stroke-width="2"/>
      <rect x="2" y="2" width="${w - 4}" height="${h * 0.4}" rx="1" fill="rgba(255,255,255,0.15)"/>`

  } else if (style === 'pixel') {
    shape = `
      <rect x="4" y="4" width="${w}" height="${h}" fill="#000"/>
      <rect x="0" y="0" width="${w}" height="${h}" fill="${mainFill}"/>
      <rect x="0" y="0" width="${w}" height="4" fill="rgba(255,255,255,0.4)"/>
      <rect x="0" y="0" width="4" height="${h}" fill="rgba(255,255,255,0.2)"/>`

  } else if (style === 'gradient') {
    const gradId = `${uid}_btng`
    extraDefs += `<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${METALS.aurora.gradient[0].color}"/>
      <stop offset="50%" stop-color="${METALS['neon-purple'].primary}"/>
      <stop offset="100%" stop-color="${METALS['neon-pink'].primary}"/>
    </linearGradient>`
    shape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="url(#${gradId})"/>
      <rect x="0" y="0" width="${w}" height="${h / 2}" rx="${r}" fill="rgba(255,255,255,0.15)"/>`

  } else if (style === 'glow') {
    const glowFid = `${uid}_glf`
    extraDefs += `<filter id="${glowFid}">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`
    shape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${mainFill}" filter="url(#${glowFid})"/>`

  } else if (style === 'pill') {
    const pr = h / 2
    shape = `
      <rect width="${w}" height="${h}" rx="${pr}" fill="${mainFill}" filter="url(#${shadowId})"/>
      <rect x="1" y="1" width="${w - 2}" height="${h / 2 - 1}" rx="${pr}" fill="url(#${hiId})"/>`

  } else {
    // default: beveled / solid / 3d
    shape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${mainFill}" filter="url(#${shadowId})"/>
      <rect x="1" y="1" width="${w - 2}" height="${h / 2 - 1}" rx="${r}" fill="url(#${hiId})"/>
      <rect x="1" y="${h * 0.6}" width="${w - 2}" height="${h * 0.38}" rx="${r / 2}" fill="black" opacity="0.12"/>`
    bevel = `
      <path d="M${r},1 L${w - r},1 Q${w - 1},1 ${w - 1},${r} L${w - 1},${h * 0.5}
        C${w * 0.6},${h * 0.3} ${w * 0.4},${h * 0.3} 1,${h * 0.5} L1,${r} Q1,1 ${r},1 Z"
        fill="white" opacity="0.12"/>
      <path d="M${r},${h - 1} L${w - r},${h - 1} Q${w - 1},${h - 1} ${w - 1},${h - r}
        L${w - 1},${h * 0.5} C${w * 0.6},${h * 0.7} ${w * 0.4},${h * 0.7} 1,${h * 0.5}
        L1,${h - r} Q1,${h - 1} ${r},${h - 1} Z"
        fill="black" opacity="0.15"/>`
  }

  // Animated shimmer on load
  const animEl = animated && !['ghost', 'outline', 'glass', 'brutalist'].includes(style) ? `
    <rect width="${w}" height="${h}" rx="${r}" fill="white" opacity="0">
      <animate attributeName="opacity" values="0;0.12;0" dur="2s" repeatCount="indefinite"/>
    </rect>` : ''

  // Text color override for special styles
  let finalTextColor = textColor
  if (style === 'ghost' || style === 'outline') finalTextColor = mainFill
  if (style === 'brutalist') finalTextColor = '#000'
  if (style === 'neo') finalTextColor = theme === 'dark' ? '#aab0d0' : '#5a6a8a'
  if (style === 'retro') finalTextColor = m.highlight
  if (style === 'cta' || style === 'gradient') finalTextColor = '#fff'
  if (style === 'glass') finalTextColor = 'rgba(255,255,255,0.9)'

  const fontFamily = style === 'pixel' ? "'Courier New',monospace"
    : style === 'retro' ? "'Georgia',serif"
      : style === 'brutalist' ? "'Arial Black',sans-serif"
        : "'Rajdhani','Arial',sans-serif"
  const fontWeight = style === 'brutalist' ? '900' : '700'

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    ${mainDefs}
    ${shadowDefs}
    ${extraDefs}
  </defs>
  ${shape}
  ${bevel}
  ${animEl}
  <text x="${cx}" y="${cy}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="${fontFamily}"
    font-size="${fontSize}" font-weight="${fontWeight}"
    fill="${finalTextColor}" letter-spacing="1.5"
  >${escapeXml(displayText)}</text>
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}