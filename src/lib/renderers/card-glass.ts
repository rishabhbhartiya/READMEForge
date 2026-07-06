// src/lib/renderers/card-glass.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  buildGradientDef, getThemeColors, Theme, uniqueId, hexToRgba,
} from '../metals'

export type GlassTheme =
  | 'dark' | 'light' | 'aurora' | 'sunset' | 'ocean' | 'midnight'
  | 'neon' | 'rose' | 'forest' | 'gold' | 'ice' | 'void'
  | 'crimson' | 'emerald' | 'sapphire' | 'graphite'

export type GlassStyle = 'card' | 'pill' | 'panel' | 'chip' | 'ribbon' | 'badge'
export type GlassBorder = 'edge' | 'glow' | 'minimal' | 'ridge' | 'double' | 'none'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface GlassCardOptions {
  title?: string
  value?: string
  subtitle?: string
  icon?: string
  glassTheme?: GlassTheme
  style?: GlassStyle
  border?: GlassBorder
  metal?: string
  colors?: string
  angle?: number
  width?: number
  height?: number
  tint?: string
  blur?: number
  theme?: Theme
  linkUrl?: string
  fontFamily?: FontFamily
  textColor?: string
  fontScale?: number
}

const GLASS_THEMES: Record<GlassTheme, {
  bg1: string; bg2: string; bg3: string
  tint: string; border: string
  text: string; textDim: string
  glow: string
}> = {
  dark: { bg1: '#0a0a18', bg2: '#141428', bg3: '#1e1e38', tint: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: '#e0e4ff', textDim: '#7880b0', glow: 'rgba(100,120,255,0.3)' },
  light: { bg1: '#d0d8e8', bg2: '#e8ecf8', bg3: '#f4f6fc', tint: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.7)', text: '#1a1a3a', textDim: '#5060a0', glow: 'rgba(80,100,200,0.2)' },
  aurora: { bg1: '#050a20', bg2: '#0a1a30', bg3: '#102040', tint: 'rgba(0,255,180,0.08)', border: 'rgba(0,255,180,0.2)', text: '#e0fff8', textDim: '#60b0a0', glow: 'rgba(0,255,180,0.4)' },
  sunset: { bg1: '#1a0818', bg2: '#200a20', bg3: '#300830', tint: 'rgba(255,100,50,0.1)', border: 'rgba(255,150,80,0.25)', text: '#ffe8e0', textDim: '#b07060', glow: 'rgba(255,100,50,0.4)' },
  ocean: { bg1: '#030818', bg2: '#060f28', bg3: '#0a1838', tint: 'rgba(40,100,255,0.1)', border: 'rgba(80,160,255,0.2)', text: '#e0eeff', textDim: '#5080c0', glow: 'rgba(40,120,255,0.4)' },
  midnight: { bg1: '#04040c', bg2: '#080818', bg3: '#0c0c22', tint: 'rgba(120,80,255,0.08)', border: 'rgba(120,80,255,0.2)', text: '#e8e0ff', textDim: '#6050a0', glow: 'rgba(120,80,255,0.4)' },
  neon: { bg1: '#020d0d', bg2: '#041818', bg3: '#062020', tint: 'rgba(0,255,200,0.07)', border: 'rgba(0,255,200,0.25)', text: '#ccffe8', textDim: '#00c896', glow: 'rgba(0,255,180,0.5)' },
  rose: { bg1: '#12020a', bg2: '#200510', bg3: '#2e0818', tint: 'rgba(255,60,120,0.09)', border: 'rgba(255,100,150,0.28)', text: '#ffe0ec', textDim: '#c06080', glow: 'rgba(255,60,120,0.45)' },
  forest: { bg1: '#020d04', bg2: '#041808', bg3: '#06220a', tint: 'rgba(40,200,80,0.07)', border: 'rgba(60,200,80,0.22)', text: '#d8ffe0', textDim: '#50a060', glow: 'rgba(40,200,80,0.4)' },
  gold: { bg1: '#100a00', bg2: '#1a1000', bg3: '#261800', tint: 'rgba(255,200,40,0.08)', border: 'rgba(255,200,40,0.28)', text: '#fff4cc', textDim: '#b09040', glow: 'rgba(255,190,30,0.45)' },
  ice: { bg1: '#020d18', bg2: '#061828', bg3: '#0a2235', tint: 'rgba(160,220,255,0.1)', border: 'rgba(180,230,255,0.3)', text: '#e8f8ff', textDim: '#70b8d8', glow: 'rgba(120,210,255,0.4)' },
  void: { bg1: '#000000', bg2: '#060006', bg3: '#0c000c', tint: 'rgba(180,0,255,0.07)', border: 'rgba(180,0,255,0.2)', text: '#f0e0ff', textDim: '#8040b0', glow: 'rgba(160,0,255,0.45)' },
  crimson: { bg1: '#180204', bg2: '#280408', bg3: '#38060c', tint: 'rgba(255,30,60,0.09)', border: 'rgba(255,60,90,0.25)', text: '#ffe0e4', textDim: '#c06070', glow: 'rgba(255,30,60,0.45)' },
  emerald: { bg1: '#02180e', bg2: '#042818', bg3: '#063822', tint: 'rgba(0,220,140,0.08)', border: 'rgba(0,220,140,0.24)', text: '#dcffee', textDim: '#4ec096', glow: 'rgba(0,220,140,0.42)' },
  sapphire: { bg1: '#02081a', bg2: '#04102c', bg3: '#06183e', tint: 'rgba(30,110,255,0.09)', border: 'rgba(60,140,255,0.26)', text: '#dceaff', textDim: '#5a90d0', glow: 'rgba(30,110,255,0.45)' },
  graphite: { bg1: '#0e0e10', bg2: '#18181c', bg3: '#222226', tint: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#e4e4ea', textDim: '#8a8a94', glow: 'rgba(180,180,200,0.3)' },
}

const FONT_STACKS: Record<FontFamily, string> = {
  sans: "'Space Grotesk','Helvetica Neue',sans-serif",
  serif: "'Georgia','Times New Roman',serif",
  mono: "'Share Tech Mono','Courier New',monospace",
  display: "'Orbitron','Arial Black',sans-serif",
  rounded: "'Quicksand','Nunito',sans-serif",
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function layoutRows(usableTop: number, usableBottom: number, rows: { key: string; active: boolean; weight: number }[]) {
  const active = rows.filter(r => r.active)
  const totalWeight = active.reduce((s, r) => s + r.weight, 0) || 1
  const usableH = usableBottom - usableTop
  const pos: Record<string, number> = {}
  let cursor = usableTop
  for (const r of active) {
    const rowH = usableH * (r.weight / totalWeight)
    pos[r.key] = cursor + rowH / 2
    cursor += rowH
  }
  return pos
}

export function renderGlassCard(opts: GlassCardOptions): string {
  const {
    title, value, subtitle, icon,
    glassTheme = 'dark',
    style = 'card',
    border = 'edge',
    blur = 8,
  } = opts

  const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon

  let w = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
  let h = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
  // 'badge' is a compact circular bubble — force a square canvas so it reads as a circle
  if (style === 'badge') { const s = Math.min(w, h); w = s; h = s }

  const t = GLASS_THEMES[glassTheme] ?? GLASS_THEMES.dark
  const tintColor = opts.tint ?? t.tint
  const blurVal = Math.min(Math.max(Number(blur), 1), 20)
  const uid = uniqueId('mgls')

  const rawR =
    style === 'pill' ? h / 2 :
      style === 'badge' ? w / 2 :
        style === 'chip' ? 6 :
          style === 'panel' ? 10 :
            style === 'ribbon' ? 14 : 16
  const r = Math.min(rawR, w / 2, h / 2)

  const bg1Id = `${uid}_bg1`
  const bg2Id = `${uid}_bg2`
  const hiId = `${uid}_hi`
  const edgeId = `${uid}_edge`

  let accentFill = t.textDim
  let accentDefs = ''
  if (opts.colors) {
    const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), w, h)
    accentFill = fill; accentDefs = defs
  } else if (opts.metal && opts.metal in METALS) {
    const { fill, defs } = resolveColor(opts.metal as MetalName, w, h)
    accentFill = fill; accentDefs = defs
  }

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
  const glowFilter = `<filter id="${uid}_glowb" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="4"/>
  </filter>`

  const family = FONT_STACKS[opts.fontFamily ?? 'mono']
  const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
  const mainText = opts.textColor || t.text
  const dimText = opts.textColor || t.textDim

  const iconFontSize = Math.min(22, h * 0.15) * scale
  const valueFontSize = Math.min(38, h * 0.26) * scale
  const titleFontSize = Math.min(11, h * 0.08) * scale
  const subFontSize = Math.min(11, h * 0.08) * scale

  const contentTop = h * 0.1
  const contentBottom = h * 0.93
  const pos = layoutRows(contentTop, contentBottom, [
    { key: 'icon', active: hasIcon, weight: 0.9 },
    { key: 'title', active: hasTitle, weight: 0.55 },
    { key: 'value', active: hasValue, weight: 1.3 },
    { key: 'subtitle', active: hasSubtitle, weight: 0.55 },
  ])

  const linkIndicator = opts.linkUrl
    ? `<g opacity="0.5">
    <line x1="${w - 18}" y1="12" x2="${w - 10}" y2="12" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 10}" y1="12" x2="${w - 10}" y2="20" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 18}" y1="20" x2="${w - 10}" y2="12" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
  </g>`
    : ''

  // ── Border variants — the outer frame treatment is now a real independent choice ──
  let borderEl = ''
  if (border === 'edge') {
    borderEl = `
    <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none" stroke="url(#${edgeId})" stroke-width="1.5"/>
    <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${Math.max(0, r - 1)}" fill="none" stroke="${t.border}" stroke-width="0.5" opacity="0.6"/>`
  } else if (border === 'glow') {
    borderEl = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none"
      stroke="${accentFill}" stroke-width="1.5" filter="url(#${uid}_glowb)" opacity="0.9"/>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="${accentFill}" stroke-width="1"/>`
  } else if (border === 'minimal') {
    borderEl = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none" stroke="${t.border}" stroke-width="1"/>`
  } else if (border === 'ridge') {
    borderEl = `
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${accentFill}" stroke-width="3" opacity="0.15"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${Math.max(0, r - 2)}" fill="none" stroke="${accentFill}" stroke-width="1" opacity="0.3"/>`
  } else if (border === 'double') {
    borderEl = `
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="${t.border}" stroke-width="1"/>
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${Math.max(0, r - 3)}" fill="none" stroke="${t.border}" stroke-width="0.75" opacity="0.6"/>`
  }
  // 'none' → borderEl stays empty

  // 'ribbon' style — a diagonal corner banner showing the value front-and-center
  const ribbon = style === 'ribbon'
    ? `<g>
        <polygon points="${w - 56},0 ${w},0 ${w},44" fill="${accentFill}" opacity="0.9"/>
        <text x="${w - 15}" y="18" text-anchor="middle" transform="rotate(45 ${w - 15} 18)"
          font-family="${family}" font-size="10" font-weight="700" fill="#0a0a18"
        >${hasValue ? escapeXml(value!).slice(0, 6) : ''}</text>
      </g>`
    : ''

  const cardContent = `
  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${bg1Id})"/>

  <circle cx="${w * 0.2}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.5}" fill="${t.glow}" opacity="0.3"/>
  <circle cx="${w * 0.8}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.35}" fill="${t.glow}" opacity="0.15"/>

  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${bg2Id})"/>

  <rect width="${w}" height="${h}" rx="${r}" fill="${tintColor}" filter="url(#${uid}_blur)"/>

  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${hiId})"/>

  ${hasIcon ? `<text x="${w * 0.14}" y="${pos.icon}" dominant-baseline="central"
    font-size="${iconFontSize}" fill="${mainText}" opacity="0.9">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${w * 0.1}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" fill="${dimText}" letter-spacing="1.5" opacity="0.9"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${w * 0.1}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="900" fill="${mainText}"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${w * 0.1}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" font-weight="500" fill="${dimText}" opacity="0.7" letter-spacing="0.5"
  >${escapeXml(subtitle!)}</text>` : ''}

  ${ribbon}
  ${borderEl}

  ${linkIndicator}`

  const body = opts.linkUrl
    ? `<a href="${escapeXml(opts.linkUrl)}" target="_blank" rel="noopener noreferrer" style="cursor:pointer">
    ${cardContent}
  </a>`
    : cardContent

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(title ?? value ?? 'Card')}">
  <title>${escapeXml([title, value].filter(Boolean).join(': ') || 'Card')}</title>
  <defs>
    ${gradDefs}
    ${glassFilter}
    ${glowFilter}
    ${accentDefs}
  </defs>
  ${body}
</svg>`
}