// src/lib/renderers/badge.ts
import { MetalType, BadgeShape, METALS, buildGradient } from '../metals'

export interface BadgeOptions {
  label?: string
  value?: string          // optional right-side value (shield style)
  metal?: MetalType
  shape?: BadgeShape
  icon?: string           // single char or emoji prefix
  fontSize?: number
}

export function renderBadge(opts: BadgeOptions): string {
  const {
    label = 'badge',
    value,
    metal = 'chrome',
    shape = 'pill',
    icon = '',
    fontSize = 11,
  } = opts

  const m = METALS[metal] ?? METALS.chrome
  const textColor = m.isDark ? m.textLight : m.textDark
  const uid = `mbdg_${Date.now().toString(36)}`

  const charW = fontSize * 0.65
  const iconExtra = icon ? fontSize + 4 : 0

  const r =
    shape === 'pill' ? 14 :
    shape === 'sharp' ? 2 :
    shape === 'hex' ? 5 : 4

  if (value) {
    // Shield / two-tone badge
    const lw = label.length * charW + iconExtra + 20
    const rw = value.length * charW + 20
    const w = lw + rw
    const h = 26

    const gradient = buildGradient(`${uid}_g`, metal, '135')
    const valueGrad = `<linearGradient id="${uid}_v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${m.stops[2][0]}"/>
      <stop offset="100%" stop-color="${m.stops[1][0]}"/>
    </linearGradient>`
    const hiGrad = `<linearGradient id="${uid}_hi" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>`

    return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
    role="img" aria-label="${label}: ${value}">
    <title>${label}: ${value}</title>
    <defs>
      ${gradient}
      ${valueGrad}
      ${hiGrad}
    </defs>
    <!-- Label section -->
    <rect width="${lw}" height="${h}" rx="${r}" fill="url(#${uid}_g)"/>
    <!-- Overlap to hide right radius of label -->
    <rect x="${lw - r}" y="0" width="${r}" height="${h}" fill="url(#${uid}_g)"/>
    <!-- Value section -->
    <rect x="${lw}" y="0" width="${rw}" height="${h}" rx="0" fill="url(#${uid}_v)"/>
    <!-- Right rounded cap -->
    <rect x="${lw + rw - r}" y="0" width="${r}" height="${h}" rx="${r}" fill="url(#${uid}_v)"/>
    <!-- Top highlight -->
    <rect width="${w}" height="${h / 2}" rx="${r}" fill="url(#${uid}_hi)"/>
    <!-- Divider -->
    <line x1="${lw}" y1="4" x2="${lw}" y2="${h - 4}" stroke="black" stroke-opacity="0.15" stroke-width="1"/>
    <!-- Label text -->
    <text x="${lw / 2}" y="${h / 2 + 1}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Share Tech Mono', monospace"
      font-size="${fontSize}" font-weight="700"
      fill="${textColor}" letter-spacing="0.8"
    >${icon ? icon + ' ' : ''}${escapeXml(label)}</text>
    <!-- Value text -->
    <text x="${lw + rw / 2}" y="${h / 2 + 1}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Share Tech Mono', monospace"
      font-size="${fontSize}" font-weight="700"
      fill="${textColor}" letter-spacing="0.8"
    >${escapeXml(value)}</text>
  </svg>`
  }

  // Simple single badge
  const w = label.length * charW + iconExtra + 28
  const h = 26

  const gradient = buildGradient(`${uid}_g`, metal, '135')
  const hiGrad = `<linearGradient id="${uid}_hi" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="white" stop-opacity="0.3"/>
    <stop offset="60%" stop-color="white" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.1"/>
  </linearGradient>`

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    ${gradient}
    ${hiGrad}
  </defs>
  <rect width="${w}" height="${h}" rx="${r}" fill="url(#${uid}_g)"/>
  <rect width="${w}" height="${h / 2}" rx="${r}" fill="url(#${uid}_hi)"/>
  <!-- Bottom shadow -->
  <rect x="1" y="${h * 0.55}" width="${w - 2}" height="${h * 0.42}" rx="${r / 2}"
    fill="black" opacity="0.1"/>
  <text
    x="${w / 2}" y="${h / 2 + 1}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono', monospace"
    font-size="${fontSize}" font-weight="700"
    fill="${textColor}" letter-spacing="0.8"
  >${icon ? icon + ' ' : ''}${escapeXml(label)}</text>
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
