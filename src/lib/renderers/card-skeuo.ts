// src/lib/renderers/card-skeuo.ts
import {
    MetalName, ColorSpec, METALS, resolveColor, parseColorList, uniqueId,
} from '../metals'

export type SkeuoTheme =
    | 'leather' | 'brushedMetal' | 'wood' | 'paper' | 'carbonFiber' | 'glassPlaque' | 'denim' | 'marble'
    | 'stone' | 'copper' | 'canvas' | 'satin' | 'velvet' | 'porcelain' | 'rubber' | 'lacquer'

export type SkeuoStyle = 'card' | 'plaque' | 'tag'
export type Dimension = '2d' | '3d'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'
type TextureType = 'brushed' | 'carbon' | 'wood' | 'denim' | 'vein' | 'flat'

interface SkeuoDef {
    base1: string; base2: string; base3: string
    text: string; textDim: string
    stitch?: string
    grain?: string
    bezel: string
    texture: TextureType
    glossy?: boolean
}

const SKEUO_THEMES: Record<SkeuoTheme, SkeuoDef> = {
    leather: { base1: '#5a3825', base2: '#3f2717', base3: '#2a1a0f', text: '#f0e0c8', textDim: '#c9a878', stitch: '#e8d4a0', bezel: '#1a0f08', texture: 'flat' },
    brushedMetal: { base1: '#c8ccd0', base2: '#9a9ea4', base3: '#7a7e84', text: '#1a1c1f', textDim: '#4a4e54', bezel: '#5a5e64', texture: 'brushed' },
    wood: { base1: '#a8703c', base2: '#7a4e28', base3: '#5c3a1c', text: '#fff2de', textDim: '#e0b888', grain: '#4a2e14', bezel: '#3a2210', texture: 'wood' },
    paper: { base1: '#f5f0e4', base2: '#e8e0cc', base3: '#d8ccb0', text: '#2a2418', textDim: '#6a5e48', bezel: '#c0b494', texture: 'flat' },
    carbonFiber: { base1: '#1c1c1e', base2: '#141416', base3: '#0a0a0c', text: '#e8e8ea', textDim: '#8a8a90', bezel: '#050506', texture: 'carbon' },
    glassPlaque: { base1: '#2c3440', base2: '#1a2028', base3: '#0e1218', text: '#e8f0ff', textDim: '#8098b8', bezel: '#c8d4e0', texture: 'flat', glossy: true },
    denim: { base1: '#3a5878', base2: '#2a4460', base3: '#1c3048', text: '#e8f0ff', textDim: '#a0b8d0', stitch: '#e0c060', bezel: '#14243a', texture: 'denim' },
    marble: { base1: '#f0eee8', base2: '#dedad0', base3: '#c8c2b4', text: '#26241e', textDim: '#5a5648', grain: '#a8a294', bezel: '#b0aa9c', texture: 'vein' },
    stone: { base1: '#9a968c', base2: '#7a766c', base3: '#5a564e', text: '#f0eee8', textDim: '#c4c0b6', grain: '#6a665c', bezel: '#3a382e', texture: 'vein' },
    copper: { base1: '#d68a5c', base2: '#b56a3c', base3: '#8a4a24', text: '#fff2e4', textDim: '#f0c8a0', bezel: '#5a3218', texture: 'brushed' },
    canvas: { base1: '#ded6c4', base2: '#c8bea8', base3: '#aca08a', text: '#3a3424', textDim: '#6a604a', grain: '#b8ac94', bezel: '#8a8068', texture: 'vein' },
    satin: { base1: '#e8e4e0', base2: '#c8c0b8', base3: '#a8a098', text: '#2a2622', textDim: '#5a544c', bezel: '#8a8278', texture: 'brushed' },
    velvet: { base1: '#5c2438', base2: '#3f1826', base3: '#280f18', text: '#f0d8e0', textDim: '#c99ab0', stitch: '#d8a0b8', bezel: '#180a10', texture: 'flat' },
    porcelain: { base1: '#fbfaf6', base2: '#f0ede4', base3: '#e0dcd0', text: '#2a2822', textDim: '#7a7468', bezel: '#d0ccc0', texture: 'flat', glossy: true },
    rubber: { base1: '#2e2e30', base2: '#1e1e20', base3: '#141416', text: '#e8e8ea', textDim: '#8a8a8e', bezel: '#0a0a0a', texture: 'flat' },
    lacquer: { base1: '#c81030', base2: '#900820', base3: '#5c0414', text: '#fff0e8', textDim: '#f0a8b8', bezel: '#3c0210', texture: 'flat', glossy: true },
}

const FONT_STACKS: Record<FontFamily, string> = {
    sans: "'Space Grotesk','Helvetica Neue',sans-serif",
    serif: "'Georgia','Times New Roman',serif",
    mono: "'Share Tech Mono','Courier New',monospace",
    display: "'Arial Black','Impact',sans-serif",
    rounded: "'Rajdhani','Nunito',sans-serif",
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

export interface SkeuoCardOptions {
    title?: string
    value?: string
    subtitle?: string
    icon?: string
    skeuoTheme?: SkeuoTheme
    style?: SkeuoStyle
    dimension?: Dimension
    metal?: string
    colors?: string
    angle?: number
    width?: number
    height?: number
    depth?: number
    linkUrl?: string
    fontFamily?: FontFamily
    textColor?: string
    fontScale?: number
}

export function renderSkeuoCard(opts: SkeuoCardOptions): string {
    const {
        title, value, subtitle, icon,
        skeuoTheme = 'brushedMetal',
        style = 'card',
        dimension = '2d',
    } = opts

    const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon
    const is3d = dimension === '3d'

    const bw = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
    const bh = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
    const t = SKEUO_THEMES[skeuoTheme] ?? SKEUO_THEMES.brushedMetal
    const uid = uniqueId('skeu')
    const depth = Math.min(Math.max(Number(opts.depth ?? 14), 6), 28)

    const rawR = style === 'tag' ? 6 : style === 'plaque' ? 10 : 14
    const r = Math.min(rawR, bw / 2, bh / 2)
    const bezelW = Math.min((style === 'plaque' ? 7 : 3), bw * 0.12, bh * 0.12)

    const extra = is3d ? depth : 0
    const w = bw + extra
    const h = bh + extra

    // Metal/gradient now TINTS the material instead of replacing it — texture stays visible
    const useAccent = !!(opts.colors || (opts.metal && opts.metal in METALS))
    let accentFill = t.textDim
    let accentDefs = ''
    if (opts.colors) {
        const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), bw, bh)
        accentFill = fill; accentDefs = defs
    } else if (opts.metal && opts.metal in METALS) {
        const { fill, defs } = resolveColor(opts.metal as MetalName, bw, bh)
        accentFill = fill; accentDefs = defs
    }

    const family = FONT_STACKS[opts.fontFamily ?? 'serif']
    const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
    const mainText = opts.textColor || t.text
    const dimText = opts.textColor || t.textDim

    const bodyId = `${uid}_body`
    const sheenId = `${uid}_sheen`

    let texturePattern = ''
    let textureFill = `url(#${bodyId})`
    if (t.texture === 'brushed') {
        texturePattern = `<pattern id="${uid}_tex" width="3" height="3" patternUnits="userSpaceOnUse">
      <rect width="3" height="3" fill="${t.base2}"/>
      <line x1="0" y1="0" x2="0" y2="3" stroke="${t.base1}" stroke-width="0.6" opacity="0.5"/>
    </pattern>`
        textureFill = `url(#${uid}_tex)`
    } else if (t.texture === 'carbon') {
        texturePattern = `<pattern id="${uid}_tex" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="${t.base2}"/>
      <rect width="4" height="4" fill="${t.base1}"/>
      <rect x="4" y="4" width="4" height="4" fill="${t.base1}"/>
    </pattern>`
        textureFill = `url(#${uid}_tex)`
    } else if (t.texture === 'wood') {
        texturePattern = `<pattern id="${uid}_tex" width="${bw}" height="14" patternUnits="userSpaceOnUse">
      <rect width="${bw}" height="14" fill="${t.base1}"/>
      <path d="M0,7 Q${bw * 0.25},3 ${bw * 0.5},7 T${bw},7" stroke="${t.grain}" stroke-width="1" fill="none" opacity="0.4"/>
      <path d="M0,11 Q${bw * 0.25},9 ${bw * 0.5},12 T${bw},10" stroke="${t.grain}" stroke-width="0.7" fill="none" opacity="0.3"/>
    </pattern>`
        textureFill = `url(#${uid}_tex)`
    } else if (t.texture === 'denim') {
        texturePattern = `<pattern id="${uid}_tex" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="4" height="4" fill="${t.base1}"/>
      <line x1="0" y1="0" x2="0" y2="4" stroke="${t.base3}" stroke-width="1.2" opacity="0.5"/>
    </pattern>`
        textureFill = `url(#${uid}_tex)`
    } else if (t.texture === 'vein') {
        texturePattern = `<pattern id="${uid}_tex" width="${bw}" height="${bh}" patternUnits="userSpaceOnUse">
      <rect width="${bw}" height="${bh}" fill="${t.base1}"/>
      <path d="M0,${bh * 0.3} Q${bw * 0.4},${bh * 0.1} ${bw},${bh * 0.35}" stroke="${t.grain}" stroke-width="1.4" fill="none" opacity="0.5"/>
      <path d="M0,${bh * 0.7} Q${bw * 0.6},${bh * 0.9} ${bw},${bh * 0.6}" stroke="${t.grain}" stroke-width="1" fill="none" opacity="0.4"/>
    </pattern>`
        textureFill = `url(#${uid}_tex)`
    }

    const gradDefs = `
    <linearGradient id="${bodyId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${t.base1}"/>
      <stop offset="60%" stop-color="${t.base2}"/>
      <stop offset="100%" stop-color="${t.base3}"/>
    </linearGradient>
    <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="${t.glossy ? 0.4 : 0.18}"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="${uid}_bezelHi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
    </linearGradient>
    ${texturePattern}`

    const filters = `
    <filter id="${uid}_shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>`

    const stitching = t.stitch
        ? `<rect x="7" y="7" width="${bw - 14}" height="${bh - 14}" rx="${Math.max(0, r - 4)}"
        fill="none" stroke="${t.stitch}" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.6"/>`
        : ''

    const iconFontSize = Math.min(24, bh * 0.16) * scale
    const valueFontSize = Math.min(38, bh * 0.27) * scale
    const titleFontSize = Math.min(11, bh * 0.08) * scale
    const subFontSize = Math.min(11, bh * 0.075) * scale

    const rightInset = style === 'tag' ? bh * 0.3 : 0
    const contentTop = bh * 0.1
    const contentBottom = bh * 0.94
    const pos = layoutRows(contentTop, contentBottom, [
        { key: 'icon', active: hasIcon, weight: 0.9 },
        { key: 'title', active: hasTitle, weight: 0.55 },
        { key: 'value', active: hasValue, weight: 1.25 },
        { key: 'subtitle', active: hasSubtitle, weight: 0.55 },
    ])

    const linkIndicator = opts.linkUrl
        ? `<g opacity="0.6">
    <line x1="${bw - 22 - rightInset}" y1="14" x2="${bw - 12 - rightInset}" y2="14" stroke="${dimText}" stroke-width="1.4"/>
    <line x1="${bw - 12 - rightInset}" y1="14" x2="${bw - 12 - rightInset}" y2="24" stroke="${dimText}" stroke-width="1.4"/>
    <line x1="${bw - 22 - rightInset}" y1="24" x2="${bw - 12 - rightInset}" y2="14" stroke="${dimText}" stroke-width="1.4"/>
  </g>`
        : ''

    // ── Real 'tag' geometry: a physical hang-tag shape with a punch hole ──────
    const tagPointW = bh * 0.3
    const tagPath = `M0,0 L${bw - tagPointW},0 L${bw},${bh / 2} L${bw - tagPointW},${bh} L0,${bh} Z`
    const tagShape = style === 'tag'

    // ── 'plaque' style adds real concentric embossed rings, not just a wider bezel ──
    const plaqueRings = style === 'plaque'
        ? `<rect x="${bezelW + 3}" y="${bezelW + 3}" width="${bw - (bezelW + 3) * 2}" height="${bh - (bezelW + 3) * 2}"
        rx="${Math.max(0, r - bezelW - 3)}" fill="none" stroke="#000000" stroke-width="1" opacity="0.25"/>
       <rect x="${bezelW + 5}" y="${bezelW + 5}" width="${bw - (bezelW + 5) * 2}" height="${bh - (bezelW + 5) * 2}"
        rx="${Math.max(0, r - bezelW - 5)}" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.2"/>`
        : ''

    const outerShape = tagShape
        ? `<path d="${tagPath}" fill="${useAccent ? accentFill : t.bezel}" filter="url(#${uid}_shadow)"/>`
        : `<rect width="${bw}" height="${bh}" rx="${r}" fill="${useAccent ? accentFill : t.bezel}" filter="url(#${uid}_shadow)"/>`

    const innerShape = tagShape
        ? `<path d="M${bezelW},${bezelW} L${bw - tagPointW - bezelW * 0.3},${bezelW} L${bw - bezelW},${bh / 2} L${bw - tagPointW - bezelW * 0.3},${bh - bezelW} L${bezelW},${bh - bezelW} Z"
        fill="${textureFill}"/>`
        : `<rect x="${bezelW}" y="${bezelW}" width="${bw - bezelW * 2}" height="${bh - bezelW * 2}" rx="${Math.max(0, r - bezelW)}"
        fill="${textureFill}"/>`

    const sheenShape = tagShape
        ? `<path d="${tagPath}" fill="url(#${sheenId})" opacity="0.9"/>`
        : `<rect x="${bezelW}" y="${bezelW}" width="${bw - bezelW * 2}" height="${bh - bezelW * 2}" rx="${Math.max(0, r - bezelW)}" fill="url(#${sheenId})"/>`

    // Metal tint wash on top of the material — combines rather than replaces
    const accentTint = useAccent
        ? `<rect x="${bezelW}" y="${bezelW}" width="${bw - bezelW * 2}" height="${bh - bezelW * 2}" rx="${Math.max(0, r - bezelW)}"
        fill="${accentFill}" opacity="0.32"/>`
        : ''

    const tagHole = tagShape
        ? `<circle cx="${bw - tagPointW * 0.5}" cy="${bh / 2}" r="6" fill="#00000020"/>
       <circle cx="${bw - tagPointW * 0.5}" cy="${bh / 2}" r="5" fill="${t.bezel}"/>`
        : ''

    // ── 3D extrusion — same fill as the front (bezel color), darkened with an
    // alpha overlay so it follows the theme/metal/gradient instead of a fixed shade ──
    const facePoly = (points: string, darken: number) => {
        const frontFill = useAccent ? accentFill : t.bezel
        return `
    <polygon points="${points}" fill="${frontFill}"/>
    <polygon points="${points}" fill="#000000" opacity="${darken}"/>`
    }
    const extrusion = is3d ? `
    ${facePoly(`0,${bh} ${depth},${bh + depth} ${bw + depth},${bh + depth} ${bw},${bh}`, 0.55)}
    ${facePoly(`${bw},0 ${bw + depth},${depth} ${bw + depth},${bh + depth} ${bw},${bh}`, 0.35)}` : ''

    const innerBevel = (is3d && !tagShape)
        ? `<rect x="${bezelW}" y="${bezelW}" width="${bw - bezelW * 2}" height="${bh - bezelW * 2}" rx="${Math.max(0, r - bezelW)}"
        fill="none" stroke="url(#${uid}_bezelHi)" stroke-width="2.5" opacity="0.8"/>`
        : ''

    const cardContent = `
  ${extrusion}
  ${outerShape}
  ${innerShape}
  ${sheenShape}
  ${accentTint}
  ${innerBevel}
  ${plaqueRings}
  ${stitching}
  ${tagHole}

  <line x1="${bw * 0.1}" y1="${bh * 0.42}" x2="${bw * 0.9 - rightInset}" y2="${bh * 0.42}" stroke="#000000" stroke-width="1" opacity="0.25"/>
  <line x1="${bw * 0.1}" y1="${bh * 0.43}" x2="${bw * 0.9 - rightInset}" y2="${bh * 0.43}" stroke="#ffffff" stroke-width="0.6" opacity="0.15"/>

  ${hasIcon ? `<text x="${bw * 0.1}" y="${pos.icon}" dominant-baseline="central"
    font-size="${iconFontSize}" fill="${mainText}">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${bw * 0.1}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" font-weight="700" fill="${dimText}" letter-spacing="1.5"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${bw * 0.1}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="800" fill="${mainText}"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${bw * 0.1}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" fill="${dimText}" opacity="0.85"
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