// src/lib/renderers/card-glow.ts
import {
    MetalName, ColorSpec, METALS, resolveColor, parseColorList, uniqueId,
} from '../metals'

export type GlowTheme =
    | 'cyan' | 'magenta' | 'purple' | 'green' | 'orange' | 'blue' | 'red' | 'rainbow'
    | 'lime' | 'teal' | 'gold' | 'ice'

export type GlowStyle = 'card' | 'outline' | 'beam'
export type Dimension = '2d' | '3d'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface GlowCardOptions {
    title?: string
    value?: string
    subtitle?: string
    icon?: string
    glowTheme?: GlowTheme
    style?: GlowStyle
    dimension?: Dimension
    metal?: string
    colors?: string
    angle?: number
    width?: number
    height?: number
    intensity?: number
    pulse?: boolean
    linkUrl?: string
    fontFamily?: FontFamily
    textColor?: string
    fontScale?: number
}

const GLOW_THEMES: Record<GlowTheme, { c1: string; c2: string; text: string; textDim: string }> = {
    cyan: { c1: '#00fff2', c2: '#00b8ff', text: '#d6fffb', textDim: '#5ce8dc' },
    magenta: { c1: '#ff00e5', c2: '#ff5cd3', text: '#ffe0f9', textDim: '#ff8ce8' },
    purple: { c1: '#a855f7', c2: '#7c3aed', text: '#ecdcff', textDim: '#c69bff' },
    green: { c1: '#39ff14', c2: '#00c853', text: '#e2ffe0', textDim: '#8affa0' },
    orange: { c1: '#ff9100', c2: '#ff3d00', text: '#ffe9d6', textDim: '#ffb26e' },
    blue: { c1: '#2979ff', c2: '#00e5ff', text: '#dcecff', textDim: '#7fb8ff' },
    red: { c1: '#ff1744', c2: '#ff616f', text: '#ffe0e4', textDim: '#ff8b9a' },
    rainbow: { c1: '#ff00e5', c2: '#00fff2', text: '#ffffff', textDim: '#cfeaff' },
    lime: { c1: '#d4ff00', c2: '#7cb500', text: '#f4ffd6', textDim: '#c8ea6e' },
    teal: { c1: '#00ffc8', c2: '#00897b', text: '#d6fff5', textDim: '#6effda' },
    gold: { c1: '#ffd700', c2: '#ff8f00', text: '#fff6d6', textDim: '#ffdd7e' },
    ice: { c1: '#c8f0ff', c2: '#5cb8e0', text: '#ecfaff', textDim: '#a0dcf0' },
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

export function renderGlowCard(opts: GlowCardOptions): string {
    const {
        title, value, subtitle, icon,
        glowTheme = 'cyan',
        style = 'card',
        dimension = '2d',
        intensity = 65,
        pulse = false,
    } = opts

    const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon
    const is3d = dimension === '3d'

    const w = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
    const h = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
    const t = GLOW_THEMES[glowTheme] ?? GLOW_THEMES.cyan
    const uid = uniqueId('glow')
    const inten = Math.min(Math.max(Number(intensity), 10), 100) / 100

    const r = Math.min(16, w / 2, h / 2)
    const strokeW = style === 'outline' ? 2 : 1.5
    const layers = is3d ? 3 : 1

    const useAccent = !!(opts.colors || (opts.metal && opts.metal in METALS))
    let accentFill = t.c1
    let accentDefs = ''
    if (opts.colors) {
        const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), w, h)
        accentFill = fill; accentDefs = defs
    } else if (opts.metal && opts.metal in METALS) {
        const { fill, defs } = resolveColor(opts.metal as MetalName, w, h)
        accentFill = fill; accentDefs = defs
    }

    const borderId = `${uid}_border`
    const borderFill = useAccent ? accentFill : `url(#${borderId})`
    const glowBlur = 3 + inten * 9

    const family = FONT_STACKS[opts.fontFamily ?? 'display']
    const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
    const mainText = opts.textColor || t.text
    const dimText = opts.textColor || t.textDim

    // Beam diagonal length — big enough to fully clear the card at any aspect ratio
    const beamDiag = Math.sqrt(w * w + h * h) * 1.3
    const beamW = Math.max(w, h) * 0.5

    const gradDefs = `
    <linearGradient id="${borderId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.c1}"/>
      <stop offset="100%" stop-color="${t.c2}"/>
    </linearGradient>
    <linearGradient id="${uid}_curve" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="${is3d ? 0.22 : 0.08}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${uid}_beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="${t.c1}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>`

    const filters = `
    <filter id="${uid}_glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${glowBlur}" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="${uid}_textglow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="${1.5 + inten * 2}" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="${uid}_beamblur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>`

    const animDefs = pulse
        ? `<animate xlink:href="#${uid}_glowrect" attributeName="opacity" values="0.55;1;0.55" dur="2.4s" repeatCount="indefinite"/>`
        : ''

    const iconFontSize = Math.min(24, h * 0.16) * scale
    const valueFontSize = Math.min(38, h * 0.27) * scale
    const titleFontSize = Math.min(11, h * 0.08) * scale
    const subFontSize = Math.min(11, h * 0.08) * scale

    const contentTop = h * 0.12
    const contentBottom = h * 0.92
    const pos = layoutRows(contentTop, contentBottom, [
        { key: 'icon', active: hasIcon, weight: 0.9 },
        { key: 'title', active: hasTitle, weight: 0.55 },
        { key: 'value', active: hasValue, weight: 1.3 },
        { key: 'subtitle', active: hasSubtitle, weight: 0.55 },
    ])

    const linkIndicator = opts.linkUrl
        ? `<g opacity="0.6" filter="url(#${uid}_textglow)">
    <line x1="${w - 24}" y1="14" x2="${w - 14}" y2="14" stroke="${t.c1}" stroke-width="1.4"/>
    <line x1="${w - 14}" y1="14" x2="${w - 14}" y2="24" stroke="${t.c1}" stroke-width="1.4"/>
    <line x1="${w - 24}" y1="24" x2="${w - 14}" y2="14" stroke="${t.c1}" stroke-width="1.4"/>
  </g>`
        : ''

    let nestedBorders = ''
    for (let i = 0; i < layers; i++) {
        const inset = strokeW / 2 + i * 3.5
        const op = 1 - i * 0.32
        nestedBorders += `<rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" rx="${Math.max(0, r - inset)}"
      fill="none" stroke="${borderFill}" stroke-width="${strokeW}" opacity="${op.toFixed(2)}"/>\n  `
    }

    // 'beam' style — a genuinely floating diagonal light band that sweeps across the
    // ENTIRE card on a continuous loop, clipped to the card's rounded shape.
    const beam = style === 'beam'
        ? `<clipPath id="${uid}_clip"><rect width="${w}" height="${h}" rx="${r}"/></clipPath>
      <g clip-path="url(#${uid}_clip)" filter="url(#${uid}_beamblur)">
        <rect x="${-beamW * 2}" y="${-beamDiag / 2}" width="${beamW}" height="${beamDiag}"
          fill="url(#${uid}_beam)" opacity="0.9" transform="rotate(35 ${w / 2} ${h / 2})">
          <animate attributeName="x"
            values="${-beamW * 2};${w + beamW};${-beamW * 2}" dur="4.5s" repeatCount="indefinite"/>
        </rect>
      </g>`
        : ''

    const cardContent = `
  <rect width="${w}" height="${h}" rx="${r}" fill="#050508"/>

  <rect id="${uid}_glowrect" x="${strokeW / 2}" y="${strokeW / 2}"
    width="${w - strokeW}" height="${h - strokeW}" rx="${r}"
    fill="none" stroke="${borderFill}" stroke-width="${strokeW}"
    filter="url(#${uid}_glow)">
    ${animDefs}
  </rect>

  ${nestedBorders}

  <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${w - strokeW}" height="${h - strokeW}" rx="${r}"
    fill="${style === 'outline' ? 'none' : 'rgba(255,255,255,0.02)'}"/>

  ${is3d ? `<rect x="${strokeW / 2}" y="${strokeW / 2}" width="${w - strokeW}" height="${(h - strokeW) * 0.4}" rx="${r}"
    fill="url(#${uid}_curve)"/>` : ''}

  ${beam}

  ${hasIcon ? `<text x="${w * 0.1}" y="${pos.icon}" dominant-baseline="central"
    font-size="${iconFontSize}" fill="${t.c1}" filter="url(#${uid}_textglow)">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${w * 0.1}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" fill="${dimText}" letter-spacing="2"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${w * 0.1}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="800" fill="${mainText}"
    filter="url(#${uid}_textglow)"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${w * 0.1}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" fill="${dimText}" opacity="0.8" letter-spacing="0.5"
  >${escapeXml(subtitle!)}</text>` : ''}

  ${linkIndicator}`

    const body = opts.linkUrl
        ? `<a href="${escapeXml(opts.linkUrl)}" target="_blank" rel="noopener noreferrer">${cardContent}</a>`
        : cardContent

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(title ?? value ?? 'Card')}">
  <title>${escapeXml([title, value].filter(Boolean).join(': ') || 'Card')}</title>
  <defs>
    ${gradDefs}
    ${filters}
    ${accentDefs}
  </defs>
  ${body}
</svg>`
}