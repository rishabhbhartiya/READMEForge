// src/lib/renderers/card-glass.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  buildGradientDef, getThemeColors, Theme, uniqueId, hexToRgba,
} from '../metals'

export type GlassTheme =
  | 'dark' | 'light' | 'aurora' | 'sunset' | 'ocean' | 'midnight'
  | 'neon' | 'rose' | 'forest' | 'gold' | 'ice' | 'void'

export type GlassStyle = 'card' | 'pill' | 'panel' | 'chip'

export interface GlassCardOptions {
  title?: string
  value?: string
  subtitle?: string
  icon?: string
  glassTheme?: GlassTheme
  style?: GlassStyle
  metal?: string
  colors?: string
  angle?: number
  width?: number
  height?: number
  tint?: string
  blur?: number
  theme?: Theme
  linkUrl?: string
}

const GLASS_THEMES: Record<GlassTheme, {
  bg1: string; bg2: string; bg3: string
  tint: string; border: string
  text: string; textDim: string
  glow: string
}> = {
  dark: {
    bg1: '#0a0a18', bg2: '#141428', bg3: '#1e1e38',
    tint: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)',
    text: '#e0e4ff', textDim: '#7880b0', glow: 'rgba(100,120,255,0.3)',
  },
  light: {
    bg1: '#d0d8e8', bg2: '#e8ecf8', bg3: '#f4f6fc',
    tint: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.7)',
    text: '#1a1a3a', textDim: '#5060a0', glow: 'rgba(80,100,200,0.2)',
  },
  aurora: {
    bg1: '#050a20', bg2: '#0a1a30', bg3: '#102040',
    tint: 'rgba(0,255,180,0.08)', border: 'rgba(0,255,180,0.2)',
    text: '#e0fff8', textDim: '#60b0a0', glow: 'rgba(0,255,180,0.4)',
  },
  sunset: {
    bg1: '#1a0818', bg2: '#200a20', bg3: '#300830',
    tint: 'rgba(255,100,50,0.1)', border: 'rgba(255,150,80,0.25)',
    text: '#ffe8e0', textDim: '#b07060', glow: 'rgba(255,100,50,0.4)',
  },
  ocean: {
    bg1: '#030818', bg2: '#060f28', bg3: '#0a1838',
    tint: 'rgba(40,100,255,0.1)', border: 'rgba(80,160,255,0.2)',
    text: '#e0eeff', textDim: '#5080c0', glow: 'rgba(40,120,255,0.4)',
  },
  midnight: {
    bg1: '#04040c', bg2: '#080818', bg3: '#0c0c22',
    tint: 'rgba(120,80,255,0.08)', border: 'rgba(120,80,255,0.2)',
    text: '#e8e0ff', textDim: '#6050a0', glow: 'rgba(120,80,255,0.4)',
  },
  neon: {
    bg1: '#020d0d', bg2: '#041818', bg3: '#062020',
    tint: 'rgba(0,255,200,0.07)', border: 'rgba(0,255,200,0.25)',
    text: '#ccffe8', textDim: '#00c896', glow: 'rgba(0,255,180,0.5)',
  },
  rose: {
    bg1: '#12020a', bg2: '#200510', bg3: '#2e0818',
    tint: 'rgba(255,60,120,0.09)', border: 'rgba(255,100,150,0.28)',
    text: '#ffe0ec', textDim: '#c06080', glow: 'rgba(255,60,120,0.45)',
  },
  forest: {
    bg1: '#020d04', bg2: '#041808', bg3: '#06220a',
    tint: 'rgba(40,200,80,0.07)', border: 'rgba(60,200,80,0.22)',
    text: '#d8ffe0', textDim: '#50a060', glow: 'rgba(40,200,80,0.4)',
  },
  gold: {
    bg1: '#100a00', bg2: '#1a1000', bg3: '#261800',
    tint: 'rgba(255,200,40,0.08)', border: 'rgba(255,200,40,0.28)',
    text: '#fff4cc', textDim: '#b09040', glow: 'rgba(255,190,30,0.45)',
  },
  ice: {
    bg1: '#020d18', bg2: '#061828', bg3: '#0a2235',
    tint: 'rgba(160,220,255,0.1)', border: 'rgba(180,230,255,0.3)',
    text: '#e8f8ff', textDim: '#70b8d8', glow: 'rgba(120,210,255,0.4)',
  },
  void: {
    bg1: '#000000', bg2: '#060006', bg3: '#0c000c',
    tint: 'rgba(180,0,255,0.07)', border: 'rgba(180,0,255,0.2)',
    text: '#f0e0ff', textDim: '#8040b0', glow: 'rgba(160,0,255,0.45)',
  },
}

export function renderGlassCard(opts: GlassCardOptions): string {
  const {
    title = 'Repositories',
    value = '42',
    subtitle = 'Public repos',
    icon = '◈',
    glassTheme = 'dark',
    style = 'card',
    blur = 8,
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
  const h = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
  const t = GLASS_THEMES[glassTheme] ?? GLASS_THEMES.dark
  const tintColor = opts.tint ?? t.tint
  const blurVal = Math.min(Math.max(Number(blur), 1), 20)
  const uid = uniqueId('mgls')

  const r =
    style === 'pill' ? h / 2 :
      style === 'chip' ? 8 : 16

  const bg1Id = `${uid}_bg1`
  const bg2Id = `${uid}_bg2`
  const hiId = `${uid}_hi`
  const edgeId = `${uid}_edge`

  const gradDefs = `
    <radialGradient id="${bg1Id}" cx="20%" cy="20%" r="80%">
      <stop offset="0%" stop-color="${t.bg3}"/>
      <stop offset="100%" stop-color="${t.bg1}"/>
    </radialGradient>
    <radialGradient id="${bg2Id}" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="${t.glow}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${t.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
      <stop offset="40%" stop-color="white" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${edgeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="white" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.15"/>
    </linearGradient>`

  const glassFilter = `<filter id="${uid}_blur" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="${blurVal * 0.3}" result="blurred"/>
    <feComposite in="SourceGraphic" in2="blurred" operator="over"/>
  </filter>`

  let accentFill = t.glow.replace(/rgba?\([^)]+\)/, t.textDim)
  let accentDefs = ''
  if (opts.colors) {
    const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), w, h)
    accentFill = fill; accentDefs = defs
  } else if (opts.metal && opts.metal in METALS) {
    const { fill, defs } = resolveColor(opts.metal as MetalName, w, h)
    accentFill = fill; accentDefs = defs
  }

  const iconFontSize = Math.min(22, h * 0.15)
  const valueFontSize = Math.min(38, h * 0.26)
  const titleFontSize = Math.min(11, h * 0.08)

  // ── Link hover indicator (small arrow icon top-right when linkUrl set) ──────
  const linkIndicator = opts.linkUrl
    ? `<!-- Link indicator arrow -->
  <g opacity="0.5">
    <line x1="${w - 18}" y1="12" x2="${w - 10}" y2="12"
      stroke="${t.textDim}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 10}" y1="12" x2="${w - 10}" y2="20"
      stroke="${t.textDim}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 18}" y1="20" x2="${w - 10}" y2="12"
      stroke="${t.textDim}" stroke-width="1.2" stroke-linecap="round"/>
  </g>`
    : ''

  // ── Clickable overlay (SVG <a> tag — works in browsers, Notion, GitLab) ─────
  // GitHub README CSP blocks onclick; for GitHub users the md output wraps in [![]()]()
  const cardContent = `
  <!-- Background -->
  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${bg1Id})"/>

  <!-- Glow blobs -->
  <circle cx="${w * 0.2}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.5}"
    fill="${t.glow}" opacity="0.3"/>
  <circle cx="${w * 0.8}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.35}"
    fill="${t.glow}" opacity="0.15"/>

  <!-- Ambient glow radial -->
  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${bg2Id})"/>

  <!-- Glass body (frosted) -->
  <rect width="${w}" height="${h}" rx="${r}"
    fill="${tintColor}" filter="url(#${uid}_blur)"/>

  <!-- Glass highlight (top sheen) -->
  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${hiId})"/>

  <!-- Outer glass border (refraction effect) -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}"
    fill="none" stroke="url(#${edgeId})" stroke-width="1.5"/>

  <!-- Inner border -->
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${r - 1}"
    fill="none" stroke="${t.border}" stroke-width="0.5" opacity="0.6"/>

  <!-- Icon -->
  <text x="${w * 0.14}" y="${h * 0.28}"
    dominant-baseline="middle"
    font-size="${iconFontSize}" fill="${t.text}" opacity="0.9"
  >${escapeXml(icon)}</text>

  <!-- Title -->
  <text x="${w * 0.1}" y="${h * 0.48}"
    font-family="'Share Tech Mono',monospace"
    font-size="${titleFontSize}" fill="${t.textDim}" letter-spacing="1.5" opacity="0.9"
  >${escapeXml(title.toUpperCase())}</text>

  <!-- Value -->
  <text x="${w * 0.1}" y="${h * 0.72}"
    font-family="'Orbitron','Arial Black',sans-serif"
    font-size="${valueFontSize}" font-weight="900"
    fill="${t.text}"
  >${escapeXml(value)}</text>

  <!-- Subtitle -->
  <text x="${w * 0.1}" y="${h * 0.88}"
    font-family="'Rajdhani',Arial,sans-serif"
    font-size="${Math.min(11, h * 0.08)}" font-weight="500"
    fill="${t.textDim}" opacity="0.7" letter-spacing="0.5"
  >${escapeXml(subtitle)}</text>

  <!-- Bottom accent line -->
  <line x1="${w * 0.08}" y1="${h - 3}" x2="${w * 0.5}" y2="${h - 3}"
    stroke="${t.border}" stroke-width="1" opacity="0.5"/>

  ${linkIndicator}`

  // Wrap everything in <a> when linkUrl provided — native SVG linking
  const body = opts.linkUrl
    ? `<a href="${escapeXml(opts.linkUrl)}" target="_blank" rel="noopener noreferrer"
    style="cursor:pointer">
    ${cardContent}
  </a>`
    : cardContent

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(title)}: ${escapeXml(value)}">
  <title>${escapeXml(title)}: ${escapeXml(value)}</title>
  <defs>
    ${gradDefs}
    ${glassFilter}
    ${accentDefs}
  </defs>
  ${body}
</svg>`
}

function escapeXml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}