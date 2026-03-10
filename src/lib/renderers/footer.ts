// src/lib/renderers/footer.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  getThemeColors, Theme, uniqueId, wavePath,
} from '../metals'

export type FooterStyle = 'wave' | 'minimal' | 'cyber' | 'credits' | 'snake'

export interface FooterOptions {
  text?: string
  subtext?: string
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: FooterStyle
  width?: number
  height?: number
  /** Comma-separated link labels. NOTE: SVG <text> links are NOT clickable in GitHub README.
   *  To make clickable links, wrap the SVG URL in markdown: [![label](svg-url)](https://url) */
  links?: string
  theme?: Theme
  bg?: string
}

export function renderFooter(opts: FooterOptions): string {
  const {
    text = 'Thanks for visiting!',
    subtext = 'Made with ♦ and MetalForge',
    style = 'wave',
    links = '',
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 900), 400), 1200)
  const h = Math.min(Math.max(Number(opts.height ?? 180), 60), 400)
  const uid = uniqueId('mftr')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const bg = opts.bg ?? (theme === 'dark' ? '#080810' : '#f0f2f8')
  const dimColor = theme === 'dark' ? '#7880a0' : '#606080'
  const accentColor = m.glow

  const linkList = links ? links.split(',').map(l => l.trim()).filter(Boolean) : []

  let shapeBg = ''
  if (style === 'wave') {
    shapeBg = `
      <path d="${wavePath(w, h * 0.4, h * 0.15, 1, 0)} L${w},${h} L0,${h} Z"
        fill="${mainFill}" opacity="0.18"/>
      <path d="${wavePath(w, h * 0.55, h * 0.1, 1.5, Math.PI * 0.5)} L${w},${h} L0,${h} Z"
        fill="${mainFill}" opacity="0.1"/>`
  } else if (style === 'cyber') {
    shapeBg = `
      <path d="M0,${h * 0.35} L${w * 0.15},${h * 0.2} L${w},${h * 0.2} L${w},${h} L0,${h} Z"
        fill="${mainFill}" opacity="0.12"/>
      <line x1="0" y1="${h * 0.35}" x2="${w * 0.15}" y2="${h * 0.2}"
        stroke="${mainFill}" stroke-width="2" opacity="0.6"/>
      <line x1="${w * 0.15}" y1="${h * 0.2}" x2="${w}" y2="${h * 0.2}"
        stroke="${mainFill}" stroke-width="1" opacity="0.4"/>`
  }

  const textY = style === 'cyber' ? h * 0.58 : h * 0.48

  const linksHTML = linkList.length > 0 ? (() => {
    const spacing = w / (linkList.length + 1)
    return linkList.map((link, i) =>
      `<text x="${spacing * (i + 1)}" y="${h * 0.82}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(13, h * 0.08)}" font-weight="600"
        fill="${accentColor}" letter-spacing="1.5" opacity="0.85"
      >[ ${escapeXml(link)} ]</text>`
    ).join('')
  })() : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Footer">
  <title>MetalForge Footer</title>
  <defs>${mainDefs}</defs>

  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${shapeBg}

  <!-- Top metallic line -->
  <rect width="${w}" height="3" fill="${mainFill}"/>
  <!-- Border -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none"
    stroke="${mainFill}" stroke-width="1" opacity="0.4"/>

  <text x="${w / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle"
    font-family="'Orbitron','Arial Black',sans-serif"
    font-size="${Math.min(22, h * 0.14)}" font-weight="700"
    fill="${mainFill}" letter-spacing="2"
  >${escapeXml(text)}</text>

  <text x="${w / 2}" y="${textY + h * 0.18}" text-anchor="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${Math.min(12, h * 0.08)}"
    fill="${dimColor}" letter-spacing="1"
  >${escapeXml(subtext)}</text>

  ${linksHTML}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}