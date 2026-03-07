// src/lib/renderers/card-neo.ts
// Neumorphic (soft UI) cards — raised and pressed variants

export type NeoStyle = 'raised' | 'pressed' | 'floating' | 'inset'
export type NeoTheme = 'light' | 'dark' | 'warm' | 'cool' | 'neon-dark'

export interface NeoCardOptions {
  title?: string
  value?: string
  subtitle?: string
  icon?: string
  theme?: NeoTheme
  style?: NeoStyle
  width?: number
  height?: number
  accent?: string
}

const NEO_THEMES: Record<NeoTheme, {
  bg: string; light: string; dark: string
  text: string; textDim: string; accent: string
}> = {
  light: {
    bg: '#e8ecf0', light: '#ffffff', dark: '#c8cdd4',
    text: '#2a3040', textDim: '#7080a0', accent: '#4a9eff',
  },
  dark: {
    bg: '#1c1c2c', light: '#2a2a3c', dark: '#10101e',
    text: '#e0e4f0', textDim: '#7880a0', accent: '#6080ff',
  },
  warm: {
    bg: '#f0e8e0', light: '#fff8f0', dark: '#d8c8b8',
    text: '#2a1a10', textDim: '#907060', accent: '#e08030',
  },
  cool: {
    bg: '#e0e8f0', light: '#f0f8ff', dark: '#c0d0e0',
    text: '#102030', textDim: '#507090', accent: '#2080c0',
  },
  'neon-dark': {
    bg: '#101020', light: '#1a1a30', dark: '#080814',
    text: '#e0e4ff', textDim: '#5060a0', accent: '#00ffcc',
  },
}

export function renderNeoCard(opts: NeoCardOptions): string {
  const {
    title = 'Commits',
    value = '1,247',
    subtitle = 'This year',
    icon = '◉',
    theme = 'dark',
    style = 'raised',
    width = 200,
    height = 160,
  } = opts

  const w = Math.min(Math.max(Number(width), 120), 600)
  const h = Math.min(Math.max(Number(height), 80), 400)
  const t = NEO_THEMES[theme] ?? NEO_THEMES.dark
  const accentColor = opts.accent ?? t.accent
  const r = 16
  const uid = `mneo_${Date.now().toString(36)}`

  // Neumorphism shadow params
  const shadowDist = Math.min(w, h) * 0.06
  const blur = shadowDist * 2.5

  let cardShape = ''
  let shadowFilter = ''

  if (style === 'raised') {
    shadowFilter = `<filter id="${uid}_sf" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="${-shadowDist}" dy="${-shadowDist}" stdDeviation="${blur}" flood-color="${t.light}" flood-opacity="0.7"/>
      <feDropShadow dx="${shadowDist}" dy="${shadowDist}" stdDeviation="${blur}" flood-color="${t.dark}" flood-opacity="0.8"/>
    </filter>`
    cardShape = `<rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}" filter="url(#${uid}_sf)"/>`
  } else if (style === 'pressed') {
    shadowFilter = `<filter id="${uid}_sf" x="-5%" y="-5%" width="110%" height="110%">
      <feFlood flood-color="${t.dark}" flood-opacity="0.6" result="dark"/>
      <feComposite in="dark" in2="SourceGraphic" operator="in" result="darkShadow"/>
      <feFlood flood-color="${t.light}" flood-opacity="0.5" result="light"/>
      <feComposite in="light" in2="SourceGraphic" operator="in" result="lightShadow"/>
    </filter>`
    // Inner shadow via gradient
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}"/>
      <!-- Inner dark shadow top-left -->
      <path d="M${r},0 L${w-r},0 Q${w},0 ${w},${r} L${w},${h*0.4}
        Q${w*0.5},${h*0.15} 0,${h*0.4} L0,${r} Q0,0 ${r},0 Z"
        fill="${t.dark}" opacity="0.5"/>
      <!-- Inner light shadow bottom-right -->
      <path d="M${r},${h} L${w-r},${h} Q${w},${h} ${w},${h-r} L${w},${h*0.6}
        Q${w*0.5},${h*0.85} 0,${h*0.6} L0,${h-r} Q0,${h} ${r},${h} Z"
        fill="${t.light}" opacity="0.3"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="${r-1}" fill="${t.bg}" opacity="0.7"/>
    `
  } else if (style === 'floating') {
    shadowFilter = `<filter id="${uid}_sf" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${shadowDist * 2}" stdDeviation="${blur * 1.5}" flood-color="${t.dark}" flood-opacity="0.9"/>
    </filter>`
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}" filter="url(#${uid}_sf)"/>
      <!-- Top highlight edge -->
      <rect x="1" y="1" width="${w-2}" height="2" rx="${r}" fill="${t.light}" opacity="0.8"/>
    `
  } else {
    // inset
    cardShape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="${t.bg}"/>
      <rect x="3" y="3" width="${w-6}" height="${h-6}" rx="${r-2}" fill="${t.dark}" opacity="0.4"/>
      <rect x="3" y="3" width="${w-6}" height="${(h-6)/2}" rx="${r-2}" fill="${t.light}" opacity="0.1"/>
    `
  }

  // Accent glow circle
  const glowCircle = `
    <circle cx="${w * 0.15}" cy="${h * 0.25}" r="${Math.min(w,h) * 0.12}"
      fill="${accentColor}" opacity="0.12"/>
    <circle cx="${w * 0.15}" cy="${h * 0.25}" r="${Math.min(w,h) * 0.06}"
      fill="${accentColor}" opacity="0.2"/>
  `

  // Value with large font
  const valueFontSize = Math.min(36, h * 0.25)
  const titleFontSize = Math.min(12, h * 0.09)

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${title}: ${value}">
  <title>${title}: ${value}</title>
  <defs>${shadowFilter}</defs>

  ${cardShape}
  ${glowCircle}

  <!-- Icon -->
  <text x="${w * 0.15}" y="${h * 0.27}"
    text-anchor="middle" dominant-baseline="middle"
    font-size="${Math.min(18, h * 0.13)}" fill="${accentColor}" opacity="0.9"
  >${icon}</text>

  <!-- Title -->
  <text x="${w * 0.12}" y="${h * 0.48}"
    font-family="'Share Tech Mono',monospace"
    font-size="${titleFontSize}" fill="${t.textDim}" letter-spacing="1" opacity="0.8"
  >${escapeXml(title.toUpperCase())}</text>

  <!-- Value -->
  <text x="${w * 0.12}" y="${h * 0.7}"
    font-family="'Orbitron','Arial Black',sans-serif"
    font-size="${valueFontSize}" font-weight="900"
    fill="${t.text}"
  >${escapeXml(value)}</text>

  <!-- Subtitle -->
  <text x="${w * 0.12}" y="${h * 0.87}"
    font-family="'Rajdhani',Arial,sans-serif"
    font-size="${Math.min(11, h * 0.08)}" font-weight="500"
    fill="${t.textDim}" letter-spacing="0.5" opacity="0.7"
  >${escapeXml(subtitle)}</text>

  <!-- Accent bar -->
  <rect x="${w * 0.08}" y="${h * 0.76}" width="${w * 0.18}" height="2"
    rx="1" fill="${accentColor}" opacity="0.6"/>
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
