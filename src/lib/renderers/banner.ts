// src/lib/renderers/banner.ts
import {
  MetalType, BannerShape, BannerAnimation,
  METALS, buildGradient, buildShape, buildAnimation, buildTexture, buildBevel
} from '../metals'

export interface BannerOptions {
  text?: string
  subtext?: string
  metal?: MetalType
  shape?: BannerShape
  height?: number
  width?: number
  animation?: BannerAnimation
  fontSize?: number
  fontFamily?: string
  section?: 'header' | 'footer'
  reversal?: boolean
  textAlign?: 'left' | 'center' | 'right'
  desc?: string // alt subtext alias
}

export function renderBanner(opts: BannerOptions): string {
  const {
    text = '',
    subtext = opts.desc ?? '',
    metal = 'chrome',
    shape = 'wave',
    height = 200,
    width = 900,
    animation = 'none',
    fontSize,
    fontFamily = 'Orbitron',
    section = 'header',
    reversal = false,
    textAlign = 'center',
  } = opts

  const w = Math.min(Math.max(Number(width), 200), 1200)
  const h = Math.min(Math.max(Number(height), 60), 500)
  const m = METALS[metal] ?? METALS.chrome
  const textColor = m.isDark ? m.textLight : m.textDark
  const accentColor = m.accent

  const uid = `mf_${Date.now().toString(36)}`
  const gradId = `${uid}_g`
  const shimId = `${uid}_s`
  const hiId = `${uid}_hi`
  const shadowId = `${uid}_sh`

  // Gradient (angled for metallic sweep)
  const gradient = buildGradient(gradId, metal, '135')

  // Highlight gradient (top sheen)
  const hiGrad = `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="white" stop-opacity="0.22"/>
    <stop offset="45%" stop-color="white" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.08"/>
  </linearGradient>`

  // Drop shadow filter
  const shadowFilter = `<filter id="${shadowId}" x="-5%" y="-5%" width="110%" height="130%">
    <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${m.shadow}" flood-opacity="0.6"/>
  </filter>`

  // Glow filter for text
  const glowFilter = `<filter id="${uid}_gf" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`

  const anim = buildAnimation(shimId, animation, w, h)
  const shape_svg = buildShape(shape, w, h, gradId)
  const texture = buildTexture(w, h)
  const bevel = buildBevel(w, h, shape === 'egg' ? 50 : 10)

  // Text sizing
  const autoFontSize = fontSize ?? Math.max(20, Math.min(58, h * 0.24))
  const subFontSize = Math.max(10, autoFontSize * 0.36)
  const textY = shape === 'wave' || shape === 'venom' ? h * 0.38 : h * 0.48
  const subY = textY + autoFontSize * 0.72

  const txAnchor = textAlign === 'left' ? `x="${w * 0.04}"` : textAlign === 'right' ? `x="${w * 0.96}"` : `x="${w / 2}"`
  const anchor = textAlign === 'center' ? 'middle' : textAlign

  const flipTransform = (section === 'footer' || reversal)
    ? `transform="scale(1,-1) translate(0,-${h})"` : ''

  const fadeStyle = animation === 'fadeIn'
    ? `style="animation:mf_fadeIn 0.8s ease both"` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${text}">
  <title>${text || 'MetalForge Banner'}</title>
  <defs>
    ${gradient}
    ${hiGrad}
    ${shadowFilter}
    ${glowFilter}
    ${anim.defs}
  </defs>
  ${anim.style ? `<style>${anim.style}</style>` : ''}
  <g ${flipTransform}>
    ${shape_svg}
    <!-- Metallic highlight sheen -->
    <rect width="${w}" height="${h}" fill="url(#${hiId})" style="mix-blend-mode:overlay"/>
    <!-- Brushed-metal texture -->
    ${texture}
    <!-- Bevel edges -->
    ${bevel}
    <!-- Animation overlay -->
    ${anim.overlay}
  </g>

  ${text ? `
  <!-- Main title text -->
  <text
    ${txAnchor} y="${textY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'${fontFamily}', 'Arial Black', sans-serif"
    font-size="${autoFontSize}"
    font-weight="900"
    fill="${textColor}"
    filter="url(#${shadowId})"
    letter-spacing="${Math.max(1, autoFontSize * 0.06).toFixed(1)}"
    ${fadeStyle}
  >${escapeXml(text)}</text>
  ` : ''}

  ${subtext ? `
  <!-- Subtext -->
  <text
    ${txAnchor} y="${subY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'Rajdhani', 'Arial', sans-serif"
    font-size="${subFontSize}"
    font-weight="500"
    fill="${accentColor}"
    opacity="0.88"
    letter-spacing="${Math.max(1, subFontSize * 0.12).toFixed(1)}"
    ${fadeStyle}
  >${escapeXml(subtext)}</text>
  ` : ''}

  <!-- Bottom metallic line -->
  <rect x="0" y="${h - 3}" width="${w}" height="3"
    fill="url(#${uid}_g)" opacity="0.5"/>
</svg>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
