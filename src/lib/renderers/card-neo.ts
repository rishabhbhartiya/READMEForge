// src/lib/renderers/card-neo.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList, uniqueId,
} from '../metals'

export type NeoStyle = 'raised' | 'pressed' | 'floating' | 'inset' | 'outline' | 'gradient'
export type NeoTheme = 'light' | 'dark' | 'warm' | 'cool' | 'neon-dark' | 'rose' | 'forest' | 'sunset' | 'arctic'
export type NeoBorder = 'none' | 'thin' | 'accent' | 'glow'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface NeoCardOptions {
  title?: string
  value?: string
  subtitle?: string
  icon?: string
  neoTheme?: NeoTheme
  neoStyle?: NeoStyle
  border?: NeoBorder
  metal?: string
  colors?: string
  angle?: number
  width?: number
  height?: number
  accent?: string
  linkUrl?: string
  fontFamily?: FontFamily
  textColor?: string
  fontScale?: number
}

const NEO_THEMES: Record<NeoTheme, {
  bg: string; light: string; dark: string
  text: string; textDim: string; accent: string
}> = {
  light: { bg: '#e8ecf0', light: '#ffffff', dark: '#c8cdd4', text: '#2a3040', textDim: '#7080a0', accent: '#4a9eff' },
  dark: { bg: '#1c1c2c', light: '#2a2a3c', dark: '#10101e', text: '#e0e4f0', textDim: '#7880a0', accent: '#6080ff' },
  warm: { bg: '#f0e8e0', light: '#fff8f0', dark: '#d8c8b8', text: '#2a1a10', textDim: '#907060', accent: '#e08030' },
  cool: { bg: '#e0e8f0', light: '#f0f8ff', dark: '#c0d0e0', text: '#102030', textDim: '#507090', accent: '#2080c0' },
  'neon-dark': { bg: '#101020', light: '#1a1a30', dark: '#080814', text: '#e0e4ff', textDim: '#5060a0', accent: '#00ffcc' },
  rose: { bg: '#f0e0e6', light: '#fff4f8', dark: '#d0b0bc', text: '#3a1420', textDim: '#906070', accent: '#e0508c' },
  forest: { bg: '#e0ece0', light: '#f4fcf4', dark: '#c0d4c0', text: '#142a14', textDim: '#5a8060', accent: '#2fa050' },
  sunset: { bg: '#2a1818', light: '#3a2424', dark: '#1a0e0e', text: '#ffe8d8', textDim: '#c08868', accent: '#ff7a3c' },
  arctic: { bg: '#e8f4f8', light: '#fbffff', dark: '#c8dce4', text: '#0e2830', textDim: '#5090a0', accent: '#20b8d8' },
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

export function renderNeoCard(opts: NeoCardOptions): string {
  const {
    title, value, subtitle, icon,
    neoTheme = 'dark',
    neoStyle = 'raised',
    border = 'none',
  } = opts

  const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon

  const w = Math.min(Math.max(Number(opts.width ?? 200), 120), 600)
  const h = Math.min(Math.max(Number(opts.height ?? 160), 80), 400)
  const t = NEO_THEMES[neoTheme] ?? NEO_THEMES.dark
  const uid = uniqueId('mneo')

  let accentFill = opts.accent ?? t.accent
  let accentDefs = ''
  if (opts.accent && opts.accent in METALS) {
    const { fill, defs } = resolveColor(opts.accent as MetalName, w, h)
    accentFill = fill; accentDefs = defs
  } else if (opts.colors) {
    const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), w, h)
    accentFill = fill; accentDefs = defs
  } else if (opts.metal && opts.metal in METALS) {
    const { fill, defs } = resolveColor(opts.metal as MetalName, w, h)
    accentFill = fill; accentDefs = defs
  }

  const r = Math.min(16, w / 2, h / 2)
  const shadowDist = Math.min(w, h) * 0.06
  const blur = shadowDist * 2.5

  const family = FONT_STACKS[opts.fontFamily ?? 'display']
  const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
  const mainText = opts.textColor || t.text
  const dimText = opts.textColor || t.textDim

  let cardShape = ''
  let shadowDefs = ''

  if (neoStyle === 'raised') {
    shadowDefs = `<filter id="${uid}_sf" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="${-shadowDist}" dy="${-shadowDist}" stdDeviation="${blur}" flood-color="${t.light}" flood-opacity="0.7"/>
      <feDropShadow dx="${shadowDist}" dy="${shadowDist}" stdDeviation="${blur}" flood-color="${t.dark}" flood-opacity="0.8"/>
    </filter>`
    cardShape = `<rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}" filter="url(#${uid}_sf)"/>`

  } else if (neoStyle === 'pressed') {
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}"/>
      <path d="M${r},0 L${w - r},0 Q${w},0 ${w},${r} L${w},${h * 0.4}
        Q${w * 0.5},${h * 0.15} 0,${h * 0.4} L0,${r} Q0,0 ${r},0 Z"
        fill="${t.dark}" opacity="0.5"/>
      <path d="M${r},${h} L${w - r},${h} Q${w},${h} ${w},${h - r} L${w},${h * 0.6}
        Q${w * 0.5},${h * 0.85} 0,${h * 0.6} L0,${h - r} Q0,${h} ${r},${h} Z"
        fill="${t.light}" opacity="0.3"/>
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="${Math.max(0, r - 1)}" fill="${t.bg}" opacity="0.7"/>`

  } else if (neoStyle === 'floating') {
    shadowDefs = `<filter id="${uid}_sf" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${shadowDist * 2}" stdDeviation="${blur * 1.5}" flood-color="${t.dark}" flood-opacity="0.9"/>
    </filter>`
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}" filter="url(#${uid}_sf)"/>
      <rect x="1" y="1" width="${w - 2}" height="2" rx="${r}" fill="${t.light}" opacity="0.8"/>`

  } else if (neoStyle === 'outline') {
    // Flat, minimal neumorphism — just a soft bg with a crisp inset line, no heavy shadow
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}"/>
      <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${Math.max(0, r - 1)}"
        fill="none" stroke="${t.dark}" stroke-width="1.5" opacity="0.5"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${Math.max(0, r - 2)}"
        fill="none" stroke="${t.light}" stroke-width="1" opacity="0.6"/>`

  } else if (neoStyle === 'gradient') {
    const gid = `${uid}_gbg`
    shadowDefs = `<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.light}"/>
      <stop offset="100%" stop-color="${t.bg}"/>
    </linearGradient>
    <filter id="${uid}_sf" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="${shadowDist}" dy="${shadowDist}" stdDeviation="${blur}" flood-color="${t.dark}" flood-opacity="0.6"/>
    </filter>`
    cardShape = `<rect width="${w}" height="${h}" rx="${r}" fill="url(#${gid})" filter="url(#${uid}_sf)"/>`

  } else {
    // inset
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${Math.max(0, r - 2)}" fill="${t.dark}" opacity="0.4"/>
      <rect x="3" y="3" width="${w - 6}" height="${(h - 6) / 2}" rx="${Math.max(0, r - 2)}" fill="${t.light}" opacity="0.1"/>`
  }

  // ── Border variants layered on top of any neoStyle base ──────────────────
  let borderEl = ''
  if (border === 'thin') {
    borderEl = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none" stroke="${t.dark}" stroke-width="1" opacity="0.4"/>`
  } else if (border === 'accent') {
    borderEl = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="${accentFill}" stroke-width="1.5" opacity="0.7"/>`
  } else if (border === 'glow') {
    borderEl = `<filter id="${uid}_bglow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="${accentFill}" stroke-width="1.5" filter="url(#${uid}_bglow)" opacity="0.8"/>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="${accentFill}" stroke-width="1"/>`
  }

  const hiId = `${uid}_clay`
  const clayDefs = `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
    <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
  </linearGradient>`

  const iconFontSize = Math.min(18, h * 0.13) * scale
  const valueFontSize = Math.min(36, h * 0.25) * scale
  const titleFontSize = Math.min(12, h * 0.09) * scale
  const subFontSize = Math.min(11, h * 0.08) * scale

  const contentTop = h * 0.14
  const contentBottom = h * 0.92
  const pos = layoutRows(contentTop, contentBottom, [
    { key: 'icon', active: hasIcon, weight: 0.85 },
    { key: 'title', active: hasTitle, weight: 0.5 },
    { key: 'value', active: hasValue, weight: 1.3 },
    { key: 'subtitle', active: hasSubtitle, weight: 0.5 },
  ])

  const linkIndicator = opts.linkUrl
    ? `<g opacity="0.5">
    <line x1="${w - 18}" y1="12" x2="${w - 10}" y2="12" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 10}" y1="12" x2="${w - 10}" y2="20" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${w - 18}" y1="20" x2="${w - 10}" y2="12" stroke="${dimText}" stroke-width="1.2" stroke-linecap="round"/>
  </g>`
    : ''

  const cardContent = `
  ${cardShape}

  <rect x="4" y="4" width="${w - 8}" height="${h * 0.45}" rx="${Math.max(0, r - 2)}" fill="url(#${hiId})"/>

  ${hasIcon ? `
  <circle cx="${w * 0.15}" cy="${pos.icon}" r="${Math.min(w, h) * 0.12}" fill="${accentFill}" opacity="0.12"/>
  <circle cx="${w * 0.15}" cy="${pos.icon}" r="${Math.min(w, h) * 0.06}" fill="${accentFill}" opacity="0.2"/>
  <text x="${w * 0.15}" y="${pos.icon}" text-anchor="middle" dominant-baseline="central"
    font-size="${iconFontSize}" fill="${accentFill}" opacity="0.9">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${w * 0.12}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" fill="${dimText}" letter-spacing="1" opacity="0.8"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${w * 0.12}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="900" fill="${mainText}"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${w * 0.12}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" font-weight="500" fill="${dimText}" letter-spacing="0.5" opacity="0.7"
  >${escapeXml(subtitle!)}</text>` : ''}

  ${hasValue ? `<rect x="${w * 0.08}" y="${h * 0.76}" width="${w * 0.18}" height="2" rx="1" fill="${accentFill}" opacity="0.6"/>` : ''}

  ${borderEl}
  ${linkIndicator}`

  const body = opts.linkUrl
    ? `<a href="${escapeXml(opts.linkUrl)}" target="_blank" rel="noopener noreferrer">${cardContent}</a>`
    : cardContent

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(title ?? value ?? 'Card')}">
  <title>${escapeXml([title, value].filter(Boolean).join(': ') || 'Card')}</title>
  <defs>
    ${shadowDefs}
    ${clayDefs}
    ${accentDefs}
  </defs>
  ${body}
</svg>`
}