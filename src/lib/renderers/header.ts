// src/lib/renderers/header.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, getThemeColors,
  Theme, DesignStyle, uniqueId, wavePath,
} from '../metals'

export type HeaderStyle = 'profile' | 'minimal' | 'cyber' | 'terminal' | 'hologram'

export interface HeaderOptions {
  name?: string
  title?: string
  tagline?: string
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: HeaderStyle
  width?: number
  height?: number
  avatar?: string
  wave?: boolean
  theme?: Theme
  bg?: string
}

export function renderHeader(opts: HeaderOptions): string {
  const {
    name = 'Your Name',
    title = 'Full-Stack Developer',
    tagline = 'Building things that matter ✦',
    style = 'profile',
    width = 900,
    height = 280,
    wave = true,
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(width), 400), 1200)
  const h = Math.min(Math.max(Number(height), 120), 500)
  const uid = uniqueId('mhdr')

  // Resolve main color/gradient
  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const bg = opts.bg ?? (theme === 'dark' ? (m.shadow ?? '#080810') : '#f0f2f8')

  // Background gradient
  const bgId = `${uid}_bg`
  const bgDefs = `<linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${theme === 'dark' ? '#080810' : '#f0f2f8'}"/>
    <stop offset="100%" stop-color="${theme === 'dark' ? '#0e0e1c' : '#e4e8f4'}"/>
  </linearGradient>`

  const textColor = theme === 'dark' ? '#e0e4f0' : '#141428'
  const dimColor = theme === 'dark' ? '#7880a0' : '#606080'
  const accentColor = m.glow

  // Decorative corner elements
  const cornerDeco = `
    <path d="M0,0 L40,0 L0,40 Z" fill="${mainFill}" opacity="0.6"/>
    <path d="M${w},0 L${w - 40},0 L${w},40 Z" fill="${mainFill}" opacity="0.6"/>
    <path d="M0,${h} L40,${h} L0,${h - 40} Z" fill="${mainFill}" opacity="0.4"/>
    <path d="M${w},${h} L${w - 40},${h} L${w},${h - 40} Z" fill="${mainFill}" opacity="0.4"/>`

  // Circuit decorations
  const circuits = `
    <line x1="${w * 0.7}" y1="20" x2="${w * 0.9}" y2="20" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <line x1="${w * 0.9}" y1="20" x2="${w * 0.9}" y2="50" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <circle cx="${w * 0.9}" cy="20" r="3" fill="${accentColor}" opacity="0.4"/>
    <circle cx="${w * 0.7}" cy="20" r="3" fill="${accentColor}" opacity="0.4"/>
    <line x1="${w * 0.1}" y1="${h - 20}" x2="${w * 0.3}" y2="${h - 20}" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <line x1="${w * 0.1}" y1="${h - 20}" x2="${w * 0.1}" y2="${h - 50}" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <circle cx="${w * 0.1}" cy="${h - 20}" r="3" fill="${accentColor}" opacity="0.4"/>`

  const waveEl = wave ? `
    <path d="${wavePath(w, h * 0.75, h * 0.12, 1, 0)} L${w},${h} L0,${h} Z"
      fill="${mainFill}" opacity="0.15"/>` : ''

  // Glow filter for hologram
  const { id: glowFid, defs: glowDefs } = buildFilter(
    { glow: true, glowColor: accentColor, glowStrength: 2 },
    `${uid}_hgf`
  )

  let content = ''

  if (style === 'profile') {
    content = `
      <!-- Avatar circle -->
      <circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.32}"
        fill="url(#${bgId})" stroke="${mainFill}" stroke-width="3"/>
      <circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.28}"
        fill="${theme === 'dark' ? '#0e0e1c' : '#e8ecf8'}" opacity="0.5"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.28}"/></clipPath>
           <image href="${opts.avatar}" x="${w * 0.12 - h * 0.28}" y="${h * 0.5 - h * 0.28}"
             width="${h * 0.56}" height="${h * 0.56}" clip-path="url(#${uid}_avc)"
             preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${w * 0.12}" y="${h * 0.5 + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${h * 0.2}"
            fill="${mainFill}" opacity="0.6">${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}

      <!-- Name -->
      <text x="${w * 0.27}" y="${h * 0.35}"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(36, h * 0.15)}" font-weight="900"
        fill="${mainFill}" letter-spacing="2"
      >${escapeXml(name)}</text>

      <!-- Decorative line -->
      <rect x="${w * 0.27}" y="${h * 0.4}" width="${w * 0.35}" height="1" fill="${mainFill}" opacity="0.4"/>

      <!-- Title -->
      <text x="${w * 0.27}" y="${h * 0.52}"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(18, h * 0.08)}" font-weight="500"
        fill="${textColor}" letter-spacing="1.5" opacity="0.85"
      >${escapeXml(title)}</text>

      <!-- Tagline -->
      <text x="${w * 0.27}" y="${h * 0.67}"
        font-family="'Share Tech Mono',monospace"
        font-size="${Math.min(13, h * 0.055)}" fill="${dimColor}" letter-spacing="0.8"
      >${escapeXml(tagline)}</text>`

  } else if (style === 'cyber') {
    content = `
      <rect x="0" y="${h * 0.3}" width="${w * 0.4}" height="2" fill="${mainFill}" opacity="0.5"/>
      <rect x="${w * 0.6}" y="${h * 0.7}" width="${w * 0.4}" height="1" fill="${mainFill}" opacity="0.3"/>

      <!-- Shadow text -->
      <text x="${w / 2 + 2}" y="${h * 0.44 + 2}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(52, h * 0.22)}" font-weight="900"
        fill="${accentColor}" letter-spacing="6" opacity="0.2"
      >${escapeXml(name.toUpperCase())}</text>

      <!-- Main name -->
      <text x="${w / 2}" y="${h * 0.44}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(52, h * 0.22)}" font-weight="900"
        fill="${mainFill}" letter-spacing="6"
      >${escapeXml(name.toUpperCase())}</text>

      <!-- Title bar -->
      <rect x="${w * 0.28}" y="${h * 0.56}" width="${w * 0.44}" height="${h * 0.1}"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)'}" rx="2"/>
      <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace"
        font-size="${Math.min(14, h * 0.058)}" fill="${accentColor}" letter-spacing="3"
      >[ ${escapeXml(title.toUpperCase())} ]</text>`

  } else if (style === 'terminal') {
    content = `
      <!-- Terminal window -->
      <rect x="${w * 0.05}" y="${h * 0.1}" width="${w * 0.9}" height="${h * 0.8}" rx="8"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)'}"
        stroke="${mainFill}" stroke-width="1"/>
      <!-- Title bar -->
      <rect x="${w * 0.05}" y="${h * 0.1}" width="${w * 0.9}" height="${h * 0.15}" rx="8"
        fill="${mainFill}" opacity="0.8"/>
      <rect x="${w * 0.05}" y="${h * 0.17}" width="${w * 0.9}" height="${h * 0.08}" fill="${mainFill}" opacity="0.8"/>
      <!-- Traffic lights -->
      <circle cx="${w * 0.09}" cy="${h * 0.175}" r="6" fill="#ff5f57"/>
      <circle cx="${w * 0.115}" cy="${h * 0.175}" r="6" fill="#febc2e"/>
      <circle cx="${w * 0.14}" cy="${h * 0.175}" r="6" fill="#28c840"/>
      <!-- Title -->
      <text x="${w / 2}" y="${h * 0.19}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${textColor}"
      >metalforge — profile.sh</text>
      <!-- Content -->
      <text x="${w * 0.09}" y="${h * 0.42}" font-family="'Share Tech Mono',monospace" font-size="13"
        fill="${accentColor}">$ whoami</text>
      <text x="${w * 0.09}" y="${h * 0.56}" font-family="'Share Tech Mono',monospace" font-size="14" font-weight="700"
        fill="${textColor}">${escapeXml(name)}</text>
      <text x="${w * 0.09}" y="${h * 0.7}" font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${accentColor}">$ echo $ROLE</text>
      <text x="${w * 0.09}" y="${h * 0.84}" font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${dimColor}">${escapeXml(title)} · ${escapeXml(tagline)}</text>
      <!-- Cursor -->
      <rect x="${w * 0.09}" y="${h * 0.78}" width="8" height="14" fill="${accentColor}" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.2s" repeatCount="indefinite"/>
      </rect>`

  } else if (style === 'hologram') {
    // Scan lines
    const scanLines = Array.from({ length: 20 }, (_, i) =>
      `<line x1="0" y1="${i * h / 20}" x2="${w}" y2="${i * h / 20}" stroke="${accentColor}" stroke-opacity="0.06" stroke-width="1"/>`
    ).join('')

    content = `
      ${scanLines}
      <!-- Glow name -->
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(48, h * 0.2)}" font-weight="900"
        fill="${accentColor}" letter-spacing="4" opacity="0.9"
        filter="url(#${glowFid})"
      >${escapeXml(name)}</text>
      <!-- Shimmer duplicate -->
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(48, h * 0.2)}" font-weight="900"
        fill="white" letter-spacing="4" opacity="0.3"
      >${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(16, h * 0.07)}" letter-spacing="4"
        fill="${accentColor}" opacity="0.7"
      >${escapeXml(title.toUpperCase())}</text>`

  } else {
    // minimal
    content = `
      <text x="${w * 0.06}" y="${h * 0.5}" dominant-baseline="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(42, h * 0.18)}" font-weight="900"
        fill="${mainFill}" letter-spacing="2"
      >${escapeXml(name)}</text>
      <rect x="${w * 0.06}" y="${h * 0.56}" width="${Math.min(name.length * 28, w * 0.5)}" height="2"
        fill="${mainFill}" opacity="0.5"/>
      <text x="${w * 0.06}" y="${h * 0.7}"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(16, h * 0.07)}" font-weight="500"
        fill="${textColor}" letter-spacing="2" opacity="0.7"
      >${escapeXml(title)}</text>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${name} — GitHub Profile Header">
  <title>${name} Profile Header</title>
  <defs>
    ${mainDefs}
    ${bgDefs}
    ${glowDefs}
  </defs>

  <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
  ${cornerDeco}
  ${circuits}
  ${waveEl}

  <!-- Border -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none"
    stroke="${mainFill}" stroke-width="1.5" opacity="0.5"/>
  <!-- Top accent strip -->
  <rect width="${w}" height="3" fill="${mainFill}"/>

  ${content}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}