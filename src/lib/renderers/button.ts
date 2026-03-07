// src/lib/renderers/button.ts
import { MetalType, ButtonStyle, METALS, buildGradient } from '../metals'

export interface ButtonOptions {
  label?: string
  icon?: string
  metal?: MetalType
  width?: number
  height?: number
  style?: ButtonStyle
  fontSize?: number
  href?: string  // not embedded in SVG but used for wrapping markdown
}

export function renderButton(opts: ButtonOptions): string {
  const {
    label = 'Click Me',
    icon = '',
    metal = 'chrome',
    style = 'beveled',
    fontSize = 15,
  } = opts

  // Auto-size width based on text length
  const charWidth = fontSize * 0.65
  const iconExtra = icon ? fontSize + 6 : 0
  const minWidth = label.length * charWidth + iconExtra + 48
  const w = Math.min(Math.max(Number(opts.width ?? minWidth), 80), 500)
  const h = Math.min(Math.max(Number(opts.height ?? 44), 28), 100)

  const m = METALS[metal] ?? METALS.chrome
  const textColor = m.isDark ? m.textLight : m.textDark
  const uid = `mb_${Date.now().toString(36)}`

  const r =
    style === 'pill' ? h / 2 :
    style === 'sharp' ? 2 :
    style === 'engraved' ? 6 : 8

  const gradient = buildGradient(`${uid}_g`, metal, '160')
  const hiGrad = `<linearGradient id="${uid}_hi" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="white" stop-opacity="0.55"/>
    <stop offset="50%" stop-color="white" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.12"/>
  </linearGradient>`
  const shadowFilter = `<filter id="${uid}_sf" x="-8%" y="-15%" width="116%" height="140%">
    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${m.shadow}" flood-opacity="0.55"/>
  </filter>`

  let shape = ''
  let bevel = ''

  if (style === 'engraved') {
    shape = `
      <!-- Outer depression -->
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="${m.stops[1][0]}" opacity="0.5"/>
      <!-- Inner raised part -->
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${r - 1}" fill="url(#${uid}_g)"/>
      <!-- Inner highlight -->
      <rect x="3" y="3" width="${w - 6}" height="${(h - 6) / 2}" rx="${r - 1}" fill="url(#${uid}_hi)" opacity="0.5"/>`
    bevel = `<!-- Engraved shadow ring -->
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none"
        stroke="black" stroke-width="1.5" opacity="0.3"/>`
  } else if (style === 'ghost') {
    shape = `
      <rect width="${w}" height="${h}" rx="${r}" fill="transparent"/>
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none"
        stroke="url(#${uid}_g)" stroke-width="2"/>`
  } else {
    shape = `
      <!-- Base fill -->
      <rect width="${w}" height="${h}" rx="${r}" fill="url(#${uid}_g)" filter="url(#${uid}_sf)"/>
      <!-- Top highlight sheen -->
      <rect x="1" y="1" width="${w - 2}" height="${h / 2 - 1}" rx="${r}" fill="url(#${uid}_hi)"/>
      <!-- Bottom edge shadow -->
      <rect x="1" y="${h * 0.6}" width="${w - 2}" height="${h * 0.38}" rx="${r / 2}"
        fill="black" opacity="0.12"/>`
    bevel = `
      <!-- Outer bevel highlight -->
      <path d="M${r},1 L${w - r},1 Q${w - 1},1 ${w - 1},${r} L${w - 1},${h * 0.5}
        C${w * 0.6},${h * 0.3} ${w * 0.4},${h * 0.3} 1,${h * 0.5} L1,${r} Q1,1 ${r},1 Z"
        fill="white" opacity="0.12"/>
      <!-- Outer bevel shadow -->
      <path d="M${r},${h - 1} L${w - r},${h - 1} Q${w - 1},${h - 1} ${w - 1},${h - r}
        L${w - 1},${h * 0.5} C${w * 0.6},${h * 0.7} ${w * 0.4},${h * 0.7} 1,${h * 0.5}
        L1,${h - r} Q1,${h - 1} ${r},${h - 1} Z"
        fill="black" opacity="0.15"/>`
  }

  // Text centering
  const textX = w / 2
  const textY = h / 2
  const displayText = icon ? `${icon} ${label}` : label

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    ${gradient}
    ${hiGrad}
    ${shadowFilter}
  </defs>

  ${shape}
  ${bevel}

  <text
    x="${textX}" y="${textY}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="'Rajdhani', 'Arial', sans-serif"
    font-size="${fontSize}" font-weight="700"
    fill="${textColor}"
    letter-spacing="1.5"
  >${escapeXml(displayText)}</text>
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
