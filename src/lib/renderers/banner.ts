// src/lib/renderers/banner.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, quickGradient, getThemeColors,
  DesignStyle, Theme, svgOpen, svgClose, wavePath, uniqueId,
  GradientConfig,
} from '../metals'

export type BannerShape = 'wave' | 'venom' | 'diagonal' | 'arch' | 'flat' | 'egg' | 'chevron'
export type BannerAnimation = 'none' | 'shimmer' | 'pulse' | 'fadeIn' | 'scanline'

export interface BannerOptions {
  text?: string
  subtext?: string
  /** MetalName, CSS color, or comma-separated gradient colors e.g. '#ff0000,#0000ff' */
  metal?: string
  /** Explicit gradient stops e.g. '#ff0000,#ff8800,#ffff00' */
  colors?: string
  /** Gradient angle 0-360 */
  angle?: number
  shape?: BannerShape
  height?: number
  width?: number
  animation?: BannerAnimation
  fontSize?: number
  fontFamily?: string
  section?: 'header' | 'footer'
  reversal?: boolean
  textAlign?: 'left' | 'center' | 'right'
  desc?: string
  theme?: Theme
  style?: DesignStyle
  /** Background color override */
  bg?: string
}

function buildBannerGradient(opts: BannerOptions, w: number, h: number): { fill: string; defs: string } {
  // Priority: colors param > metal param
  if (opts.colors) {
    const cfg = parseColorList(opts.colors, opts.angle ?? 135)
    // override gradientUnits to userSpaceOnUse for correct positioning
    const full: GradientConfig = { ...cfg, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: w, y2: h }
    const { id, defs } = buildGradientDef(full)
    return { fill: `url(#${id})`, defs }
  }
  const metal = opts.metal ?? 'chrome'
  return resolveColor(metal in METALS ? metal as MetalName : metal, w, h)
}

function buildShape(shape: BannerShape, w: number, h: number, fill: string): string {
  switch (shape) {
    case 'wave':
      return `<path d="${wavePath(w, h * 0.72, h * 0.18, 1, 0)} L${w},${h} L0,${h} Z" fill="${fill}"/>
        <rect width="${w}" height="${h * 0.72}" fill="${fill}"/>`
    case 'venom':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.72} Q${w * 0.75},${h} ${w * 0.5},${h * 0.82} Q${w * 0.25},${h * 0.65} 0,${h * 0.82} Z" fill="${fill}"/>`
    case 'diagonal':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.75} L0,${h} Z" fill="${fill}"/>`
    case 'arch':
      return `<path d="M0,${h} L0,${h * 0.3} Q${w * 0.5},0 ${w},${h * 0.3} L${w},${h} Z" fill="${fill}"/>`
    case 'chevron':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.7} L${w * 0.5},${h} L0,${h * 0.7} Z" fill="${fill}"/>`
    case 'egg':
      return `<rect width="${w}" height="${h}" rx="${h * 0.5}" fill="${fill}"/>`
    default: // flat
      return `<rect width="${w}" height="${h}" fill="${fill}"/>`
  }
}

function buildAnimation(shape: string, anim: BannerAnimation, w: number, uid: string, fill: string): { defs: string; overlay: string; style: string } {
  if (anim === 'shimmer') {
    const shimId = `${uid}_shim`
    return {
      defs: `<linearGradient id="${shimId}" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="white" stop-opacity="0"/>
        <stop offset="45%" stop-color="white" stop-opacity="0"/>
        <stop offset="50%" stop-color="white" stop-opacity="0.25"/>
        <stop offset="55%" stop-color="white" stop-opacity="0"/>
        <stop offset="100%" stop-color="white" stop-opacity="0">
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${-w * 2} 0" to="${w * 2} 0" dur="3s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>`,
      overlay: `<rect width="${w}" height="100%" fill="url(#${shimId})" opacity="0.6"/>`,
      style: '',
    }
  }
  if (anim === 'pulse') {
    return {
      defs: '',
      overlay: `<rect width="${w}" height="100%" fill="${fill}" opacity="0">
        <animate attributeName="opacity" values="0;0.18;0" dur="2.5s" repeatCount="indefinite"/>
      </rect>`,
      style: '',
    }
  }
  if (anim === 'scanline') {
    return {
      defs: '',
      overlay: `<rect x="0" y="0" width="${w}" height="3" fill="white" opacity="0.15">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="0,100%" dur="2s" repeatCount="indefinite"/>
      </rect>`,
      style: '',
    }
  }
  if (anim === 'fadeIn') {
    return { defs: '', overlay: '', style: '@keyframes mf_fadeIn{from{opacity:0}to{opacity:1}}' }
  }
  return { defs: '', overlay: '', style: '' }
}

export function renderBanner(opts: BannerOptions): string {
  const {
    text = '',
    subtext = opts.desc ?? '',
    shape = 'wave',
    height = 200,
    width = 900,
    animation = 'none',
    fontSize,
    fontFamily = 'Orbitron',
    section = 'header',
    reversal = false,
    textAlign = 'center',
    theme = 'dark',
    style = 'metallic',
  } = opts

  const w = Math.min(Math.max(Number(width), 200), 1200)
  const h = Math.min(Math.max(Number(height), 60), 500)

  const metal = opts.metal ?? 'chrome'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const themeColors = getThemeColors(theme, style)

  const uid = uniqueId('mf')

  // Resolve main color/gradient
  const { fill: mainFill, defs: mainDefs } = buildBannerGradient(opts, w, h)

  // Highlight sheen
  const hiId = `${uid}_hi`
  const hiDefs = `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="white" stop-opacity="0.22"/>
    <stop offset="45%" stop-color="white" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.08"/>
  </linearGradient>`

  // Drop shadow
  const { id: shadowId, defs: shadowDefs } = buildFilter(
    { shadow: true, shadowDy: 3, shadowBlur: 4, shadowColor: m.shadow, shadowOpacity: 0.6 },
    `${uid}_sh`
  )

  // Glow for text
  const { id: glowId, defs: glowDefs } = buildFilter({ glow: true, glowColor: m.glow }, `${uid}_gf`)

  const anim = buildAnimation(shape, animation, w, uid, mainFill)
  const shapeEl = buildShape(shape, w, h, mainFill)

  const autoFontSize = fontSize ?? Math.max(20, Math.min(58, h * 0.24))
  const subFontSize = Math.max(10, autoFontSize * 0.36)
  const textY = shape === 'wave' || shape === 'venom' ? h * 0.38 : h * 0.48
  const subY = textY + autoFontSize * 0.72

  const textColor = theme === 'dark' ? (m.textDark ?? '#ffffff') : (m.textLight ?? '#111111')
  const accentColor = m.glow

  const txAnchor = textAlign === 'left' ? `x="${w * 0.04}"` : textAlign === 'right' ? `x="${w * 0.96}"` : `x="${w / 2}"`
  const anchor = textAlign === 'center' ? 'middle' : textAlign
  const flipTransform = (section === 'footer' || reversal) ? `transform="scale(1,-1) translate(0,-${h})"` : ''
  const fadeStyle = animation === 'fadeIn' ? `style="animation:mf_fadeIn 0.8s ease both"` : ''

  const bg = opts.bg ?? themeColors.bg

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${text || 'MetalForge Banner'}">
  <title>${text || 'MetalForge Banner'}</title>
  <defs>
    ${mainDefs}
    ${hiDefs}
    ${shadowDefs}
    ${glowDefs}
    ${anim.defs}
  </defs>
  ${anim.style ? `<style>${anim.style}</style>` : ''}

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="${bg}"/>

  <g ${flipTransform}>
    ${shapeEl}
    <!-- Metallic highlight sheen -->
    <rect width="${w}" height="${h}" fill="url(#${hiId})" style="mix-blend-mode:overlay" opacity="0.5"/>
    <!-- Animation overlay -->
    ${anim.overlay}
  </g>

  ${text ? `
  <text ${txAnchor} y="${textY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'${fontFamily}', 'Arial Black', sans-serif"
    font-size="${autoFontSize}" font-weight="900"
    fill="${textColor}"
    filter="url(#${shadowId})"
    letter-spacing="${Math.max(1, autoFontSize * 0.06).toFixed(1)}"
    ${fadeStyle}
  >${escapeXml(text)}</text>` : ''}

  ${subtext ? `
  <text ${txAnchor} y="${subY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'Rajdhani', 'Arial', sans-serif"
    font-size="${subFontSize}" font-weight="500"
    fill="${accentColor}" opacity="0.88"
    letter-spacing="${Math.max(1, subFontSize * 0.12).toFixed(1)}"
    ${fadeStyle}
  >${escapeXml(subtext)}</text>` : ''}

  <!-- Bottom metallic line -->
  <rect x="0" y="${h - 3}" width="${w}" height="3" fill="${mainFill}" opacity="0.5"/>
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}