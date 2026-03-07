// src/lib/renderers/footer.ts
import { MetalType, METALS, buildGradient } from '../metals'

export type FooterStyle = 'wave' | 'minimal' | 'cyber' | 'credits' | 'snake'

export interface FooterOptions {
  text?: string
  subtext?: string
  metal?: MetalType
  style?: FooterStyle
  width?: number
  height?: number
  links?: string   // comma-separated: "Twitter,GitHub,LinkedIn"
}

export function renderFooter(opts: FooterOptions): string {
  const {
    text = 'Thanks for visiting!',
    subtext = 'Made with ♦ and MetalForge',
    metal = 'chrome',
    style = 'wave',
    links = '',
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 900), 400), 1200)
  const h = Math.min(Math.max(Number(opts.height ?? 180), 60), 400)
  const m = METALS[metal] ?? METALS.chrome
  const uid = `mftr_${Date.now().toString(36)}`

  const mainGrad = buildGradient(`${uid}_g`, metal, '90')
  const bgGrad = `<linearGradient id="${uid}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${m.isDark ? '#080810' : '#f0f2f8'}"/>
    <stop offset="100%" stop-color="${m.isDark ? '#0e0e1c' : '#e4e8f4'}"/>
  </linearGradient>`

  const linkList = links ? links.split(',').map(l => l.trim()).filter(Boolean) : []

  let content = ''
  let shapeBg = ''

  if (style === 'wave') {
    shapeBg = `
      <path d="M0,${h * 0.4} C${w * 0.25},${h * 0.2} ${w * 0.5},${h * 0.6} ${w * 0.75},${h * 0.4}
        C${w * 0.875},${h * 0.3} ${w},${h * 0.4} ${w},${h * 0.4} L${w},${h} L0,${h} Z"
        fill="url(#${uid}_g)" opacity="0.18"/>
      <path d="M0,${h * 0.55} C${w * 0.33},${h * 0.35} ${w * 0.66},${h * 0.75} ${w},${h * 0.55}
        L${w},${h} L0,${h} Z" fill="url(#${uid}_g)" opacity="0.1"/>`
  } else if (style === 'cyber') {
    shapeBg = `
      <path d="M0,${h * 0.35} L${w * 0.15},${h * 0.2} L${w},${h * 0.2} L${w},${h} L0,${h} Z"
        fill="url(#${uid}_g)" opacity="0.12"/>
      <line x1="0" y1="${h * 0.35}" x2="${w * 0.15}" y2="${h * 0.2}" stroke="url(#${uid}_g)" stroke-width="2" opacity="0.6"/>
      <line x1="${w * 0.15}" y1="${h * 0.2}" x2="${w}" y2="${h * 0.2}" stroke="url(#${uid}_g)" stroke-width="1" opacity="0.4"/>
    `
  }

  // Main text
  const textY = style === 'cyber' ? h * 0.58 : h * 0.48
  content = `
    <text x="${w / 2}" y="${textY}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'Orbitron','Arial Black',sans-serif"
      font-size="${Math.min(22, h * 0.14)}" font-weight="700"
      fill="url(#${uid}_g)" letter-spacing="2"
    >${escapeXml(text)}</text>
    <text x="${w / 2}" y="${textY + h * 0.18}"
      text-anchor="middle"
      font-family="'Share Tech Mono',monospace"
      font-size="${Math.min(12, h * 0.08)}"
      fill="${m.isDark ? '#7880a0' : '#606080'}" letter-spacing="1"
    >${escapeXml(subtext)}</text>
  `

  // Links row
  if (linkList.length > 0) {
    const spacing = w / (linkList.length + 1)
    const linksHTML = linkList.map((link, i) =>
      `<text x="${spacing * (i + 1)}" y="${h * 0.82}"
        text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(13, h * 0.08)}" font-weight="600"
        fill="${m.accent}" letter-spacing="1.5" opacity="0.85"
      >[ ${escapeXml(link)} ]</text>`
    ).join('')
    content += linksHTML
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Footer">
  <title>MetalForge Footer</title>
  <defs>${mainGrad}${bgGrad}</defs>
  <rect width="${w}" height="${h}" fill="url(#${uid}_bg)"/>
  ${shapeBg}
  <!-- Top metallic line -->
  <rect width="${w}" height="3" fill="url(#${uid}_g)"/>
  <!-- Border -->
  <rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" fill="none" stroke="url(#${uid}_g)" stroke-width="1" opacity="0.4"/>
  ${content}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
