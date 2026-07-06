// src/lib/renderers/card-neobrutalism.ts
import {
    MetalName, ColorSpec, METALS, resolveColor, parseColorList, uniqueId,
} from '../metals'

export type NeoBrutalTheme =
    | 'yellow' | 'pink' | 'cyan' | 'lime' | 'orange' | 'white' | 'violet'
    | 'red' | 'blue' | 'mono' | 'teal' | 'indigo' | 'coral' | 'silver'

export type NeoBrutalStyle = 'card' | 'block' | 'sticker' | 'tag'
export type NeoBrutalPattern = 'none' | 'dots' | 'stripes' | 'grid' | 'cross'
export type Dimension = '2d' | '3d'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface NeoBrutalCardOptions {
    title?: string
    value?: string
    subtitle?: string
    icon?: string
    brutalTheme?: NeoBrutalTheme
    pattern?: NeoBrutalPattern
    style?: NeoBrutalStyle
    dimension?: Dimension
    metal?: string
    colors?: string
    angle?: number
    width?: number
    height?: number
    shadowOffset?: number
    borderWidth?: number
    depth?: number
    rotate?: number
    linkUrl?: string
    fontFamily?: FontFamily
    textColor?: string
    fontScale?: number
}

const BRUTAL_THEMES: Record<NeoBrutalTheme, { bg: string; text: string; border: string; shadow: string }> = {
    yellow: { bg: '#FFDE59', text: '#111111', border: '#111111', shadow: '#111111' },
    pink: { bg: '#FF6B9D', text: '#111111', border: '#111111', shadow: '#111111' },
    cyan: { bg: '#4DEEEA', text: '#111111', border: '#111111', shadow: '#111111' },
    lime: { bg: '#A6FF00', text: '#111111', border: '#111111', shadow: '#111111' },
    orange: { bg: '#FF8A00', text: '#111111', border: '#111111', shadow: '#111111' },
    white: { bg: '#FFFFFF', text: '#111111', border: '#111111', shadow: '#111111' },
    violet: { bg: '#B983FF', text: '#111111', border: '#111111', shadow: '#111111' },
    red: { bg: '#FF3B3B', text: '#FFFFFF', border: '#111111', shadow: '#111111' },
    blue: { bg: '#4D7CFF', text: '#FFFFFF', border: '#111111', shadow: '#111111' },
    mono: { bg: '#111111', text: '#FFFFFF', border: '#FFFFFF', shadow: '#000000' },
    teal: { bg: '#2DD4BF', text: '#0a2e29', border: '#111111', shadow: '#111111' },
    indigo: { bg: '#6366F1', text: '#FFFFFF', border: '#111111', shadow: '#111111' },
    coral: { bg: '#FF7A5C', text: '#111111', border: '#111111', shadow: '#111111' },
    silver: { bg: '#E4E7EB', text: '#111111', border: '#111111', shadow: '#111111' },
}

const FONT_STACKS: Record<FontFamily, string> = {
    sans: "'Space Grotesk','Helvetica Neue',sans-serif",
    serif: "'Georgia','Times New Roman',serif",
    mono: "'Share Tech Mono','Courier New',monospace",
    display: "'Arial Black','Impact',sans-serif",
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

export function renderNeoBrutalCard(opts: NeoBrutalCardOptions): string {
    const {
        title, value, subtitle, icon,
        brutalTheme = 'yellow',
        pattern = 'dots',
        style = 'card',
        dimension = '2d',
    } = opts

    const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon

    let bw = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
    let bh = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
    // Sticker is a real circular badge — force a square canvas so the border reads as a circle, not an oval
    if (style === 'sticker') bh = bw

    const t = BRUTAL_THEMES[brutalTheme] ?? BRUTAL_THEMES.yellow
    const uid = uniqueId('nbrt')

    const is3d = dimension === '3d'
    const depth = Math.min(Math.max(Number(opts.depth ?? 16), 6), 32)

    const styleBorder =
        style === 'block' ? Math.min(Math.max(Number(opts.borderWidth ?? 4), 2), 10) + 2 :
            Math.min(Math.max(Number(opts.borderWidth ?? 4), 2), 10)

    // Every corner radius is clamped to half the shortest side — this is what actually
    // prevents the "oval sticker" / pinched-corner distortion at small heights.
    const rawR =
        style === 'sticker' ? bw * 0.5 :
            style === 'tag' ? 6 :
                style === 'block' ? 0 : 14
    const r = Math.min(rawR, bw / 2, bh / 2)

    const offset = Math.min(Math.max(Number(opts.shadowOffset ?? 8), 2), 20)
    const rotate = Number(opts.rotate ?? 0)

    const extra = is3d ? depth : offset
    const w = bw + extra
    const h = bh + extra

    const useAccent = !!(opts.colors || (opts.metal && opts.metal in METALS))
    let accentFill = t.border
    let accentDefs = ''
    if (opts.colors) {
        const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), bw, bh)
        accentFill = fill; accentDefs = defs
    } else if (opts.metal && opts.metal in METALS) {
        const { fill, defs } = resolveColor(opts.metal as MetalName, bw, bh)
        accentFill = fill; accentDefs = defs
    }
    const bodyFill = useAccent ? accentFill : t.bg
    const stripeFill = useAccent ? t.border : accentFill

    // ── Typography controls (shared across every theme/style) ─────────────────
    const family = FONT_STACKS[opts.fontFamily ?? 'sans']
    const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
    const mainText = opts.textColor || t.text

    // ── Pattern overlay (real repeating texture, not just a flat theme color) ──
    let patternDef = ''
    if (pattern !== 'none') {
        if (pattern === 'dots') {
            patternDef = `<pattern id="${uid}_pat" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.6" fill="${t.border}" opacity="0.16"/>
      </pattern>`
        } else if (pattern === 'stripes') {
            patternDef = `<pattern id="${uid}_pat" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="12" height="12" fill="transparent"/>
        <rect width="6" height="12" fill="${t.border}" opacity="0.1"/>
      </pattern>`
        } else if (pattern === 'grid') {
            patternDef = `<pattern id="${uid}_pat" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M16,0 L0,0 L0,16" fill="none" stroke="${t.border}" stroke-width="1" opacity="0.14"/>
      </pattern>`
        } else if (pattern === 'cross') {
            patternDef = `<pattern id="${uid}_pat" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M9,4 L9,14 M4,9 L14,9" stroke="${t.border}" stroke-width="1.4" opacity="0.16"/>
      </pattern>`
        }
    }

    const stripeH = Math.max(6, bh * 0.05)
    const iconFontSize = Math.min(24, bh * 0.16) * scale
    const valueFontSize = Math.min(40, bh * 0.28) * scale
    const titleFontSize = Math.min(13, bh * 0.09) * scale
    const subFontSize = Math.min(11, bh * 0.075) * scale

    // 'tag' clips usable text width to stay clear of the pointed notch
    const rightInset = style === 'tag' ? bh * 0.32 : 0
    const contentTop = stripeH + bh * 0.08
    const contentBottom = bh - bh * 0.06
    const pos = layoutRows(contentTop, contentBottom, [
        { key: 'icon', active: hasIcon, weight: 0.85 },
        { key: 'title', active: hasTitle, weight: 0.55 },
        { key: 'value', active: hasValue, weight: 1.35 },
        { key: 'subtitle', active: hasSubtitle, weight: 0.55 },
    ])

    const linkIndicator = opts.linkUrl
        ? `<g transform="translate(${bw - 30 - rightInset}, ${bh - 26})">
    <rect width="20" height="20" fill="${t.border}"/>
    <line x1="5" y1="14" x2="14" y2="5" stroke="${t.bg}" stroke-width="2"/>
    <line x1="8" y1="5" x2="14" y2="5" stroke="${t.bg}" stroke-width="2"/>
    <line x1="14" y1="5" x2="14" y2="11" stroke="${t.bg}" stroke-width="2"/>
  </g>`
        : ''

    // ── Real tag geometry: rectangle body + a genuine triangular point + punch hole ──
    const tagPointW = bh * 0.32
    const tagPath = `M0,0 L${bw - tagPointW},0 L${bw},${bh / 2} L${bw - tagPointW},${bh} L0,${bh} Z`
    const tagShape = style === 'tag'

    // ── 3D extrusion: side/bottom faces now use the SAME fill as the front face
    // (bodyFill) with a dark alpha overlay, so changing the theme/metal/gradient
    // actually changes the extruded faces too, instead of leaving them stuck. ──
    const facePoly = (points: string, darken: number) => `
    <polygon points="${points}" fill="${bodyFill}"/>
    <polygon points="${points}" fill="#000000" opacity="${darken}"/>
    <polygon points="${points}" fill="none" stroke="${t.border}" stroke-width="${styleBorder * 0.7}"/>`

    const extrusion = is3d ? `
  ${facePoly(`0,${bh} ${depth},${bh + depth} ${bw + depth},${bh + depth} ${bw},${bh}`, 0.5)}
  ${facePoly(`${bw},0 ${bw + depth},${depth} ${bw + depth},${bh + depth} ${bw},${bh}`, 0.3)}` : ''

    const flatShadow = !is3d
        ? `<rect x="${offset}" y="${offset}" width="${bw - styleBorder / 2}" height="${bh - styleBorder / 2}" rx="${r}" fill="${t.shadow}"/>`
        : ''

    const bodyShape = tagShape
        ? `<path d="${tagPath}" fill="${bodyFill}" stroke="${t.border}" stroke-width="${styleBorder}"/>`
        : `<rect x="0" y="0" width="${bw}" height="${bh}" rx="${r}" fill="${bodyFill}" stroke="${t.border}" stroke-width="${styleBorder}"/>`

    const patternOverlay = pattern !== 'none'
        ? (tagShape
            ? `<path d="${tagPath}" fill="url(#${uid}_pat)"/>`
            : `<rect x="0" y="0" width="${bw}" height="${bh}" rx="${r}" fill="url(#${uid}_pat)"/>`)
        : ''

    const tagHole = tagShape
        ? `<circle cx="${bw - tagPointW * 0.55}" cy="${bh / 2}" r="6" fill="#00000018" stroke="${t.border}" stroke-width="${styleBorder * 0.6}"/>
       <circle cx="${bw - tagPointW * 0.55}" cy="${bh / 2}" r="5.2" fill="${t.bg}" opacity="0.9"/>`
        : ''

    const cardContent = `
  ${is3d ? extrusion : flatShadow}

  ${bodyShape}
  ${patternOverlay}
  ${tagHole}

  ${!tagShape ? `<rect x="0" y="0" width="${bw}" height="${stripeH}" fill="${stripeFill}"/>` : ''}
  ${is3d && !tagShape ? `<rect x="0" y="${stripeH - 2}" width="${bw}" height="2" fill="${t.border}" opacity="0.4"/>` : ''}

  ${hasIcon ? `<text x="${bw * 0.08}" y="${pos.icon}" dominant-baseline="central"
    font-size="${iconFontSize}" fill="${mainText}" font-weight="900">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${bw * 0.08}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" font-weight="800" fill="${mainText}" letter-spacing="0.5"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${bw * 0.08}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="900" fill="${mainText}"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${bw * 0.08}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" font-weight="600" fill="${mainText}" opacity="0.75"
  >${escapeXml(subtitle!)}</text>` : ''}

  ${linkIndicator}`

    const body = opts.linkUrl
        ? `<a href="${escapeXml(opts.linkUrl)}" target="_blank" rel="noopener noreferrer">${cardContent}</a>`
        : cardContent

    const transform = rotate !== 0 ? ` transform="rotate(${rotate} ${bw / 2} ${bh / 2})"` : ''

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(title ?? value ?? 'Card')}">
  <title>${escapeXml([title, value].filter(Boolean).join(': ') || 'Card')}</title>
  <defs>${accentDefs}${patternDef}</defs>
  <g${transform}>
  ${body}
  </g>
</svg>`
}