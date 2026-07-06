// src/lib/renderers/card-clay.ts
import {
    MetalName, ColorSpec, METALS, resolveColor, parseColorList, uniqueId,
} from '../metals'

export type ClayTheme =
    | 'blue' | 'pink' | 'mint' | 'lavender' | 'peach' | 'sky' | 'coral' | 'butter'
    | 'rose' | 'sage' | 'sand' | 'periwinkle'

export type ClayStyle = 'card' | 'blob' | 'panel'
export type Dimension = '2d' | '3d'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface ClayCardOptions {
    title?: string
    value?: string
    subtitle?: string
    icon?: string
    clayTheme?: ClayTheme
    style?: ClayStyle
    dimension?: Dimension
    metal?: string
    colors?: string
    angle?: number
    width?: number
    height?: number
    puff?: number
    linkUrl?: string
    fontFamily?: FontFamily
    textColor?: string
    fontScale?: number
}

const CLAY_THEMES: Record<ClayTheme, { base: string; light: string; dark: string; text: string; textDim: string }> = {
    blue: { base: '#AEC6F5', light: '#E4EDFF', dark: '#7A93C9', text: '#2b3a5c', textDim: '#5b6f9c' },
    pink: { base: '#F5B8CE', light: '#FFE4EE', dark: '#C98AA3', text: '#5c2b40', textDim: '#9c5b76' },
    mint: { base: '#B3E8D0', light: '#E2FBF0', dark: '#7FC0A3', text: '#1f4d3a', textDim: '#4a8a6c' },
    lavender: { base: '#CBB9F0', light: '#EBE1FF', dark: '#9C86C9', text: '#3a2b5c', textDim: '#6b5b9c' },
    peach: { base: '#F5CBAE', light: '#FFE9D9', dark: '#C99A7A', text: '#5c3a2b', textDim: '#9c6b4a' },
    sky: { base: '#AFDCF5', light: '#E2F5FF', dark: '#7CAECB', text: '#2b4c5c', textDim: '#4a7c9c' },
    coral: { base: '#F5A9A0', light: '#FFDAD5', dark: '#C97A70', text: '#5c2b26', textDim: '#9c5148' },
    butter: { base: '#F5E3AE', light: '#FFF6D9', dark: '#C9B87A', text: '#5c4e26', textDim: '#9c8a48' },
    rose: { base: '#F0AFC0', light: '#FFDCE6', dark: '#C97F94', text: '#5c2b3a', textDim: '#9c5b6f' },
    sage: { base: '#C0CFAE', light: '#E8F0D9', dark: '#94A87A', text: '#3a4c26', textDim: '#6b7c4a' },
    sand: { base: '#E0CBA8', light: '#F8ECD9', dark: '#B89C74', text: '#4a3a26', textDim: '#7c6b4a' },
    periwinkle: { base: '#B8C0F0', light: '#E4E8FF', dark: '#8A94C9', text: '#2b325c', textDim: '#5b649c' },
}

const FONT_STACKS: Record<FontFamily, string> = {
    sans: "'Space Grotesk','Helvetica Neue',sans-serif",
    serif: "'Georgia','Times New Roman',serif",
    mono: "'Share Tech Mono','Courier New',monospace",
    display: "'Arial Black','Impact',sans-serif",
    rounded: "'Quicksand','Baloo 2',sans-serif",
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

export function renderClayCard(opts: ClayCardOptions): string {
    const {
        title, value, subtitle, icon,
        clayTheme = 'blue',
        style = 'card',
        dimension = '2d',
        puff = 60,
    } = opts

    const hasTitle = !!title, hasValue = !!value, hasSubtitle = !!subtitle, hasIcon = !!icon
    const is3d = dimension === '3d'

    const bw = Math.min(Math.max(Number(opts.width ?? 220), 120), 600)
    const bh = Math.min(Math.max(Number(opts.height ?? 170), 80), 400)
    const pad = is3d ? Math.round(bh * 0.22) : Math.round(Math.min(bw, bh) * 0.06)
    const w = bw + pad * 2
    const h = bh + pad * 2

    const t = CLAY_THEMES[clayTheme] ?? CLAY_THEMES.blue
    const uid = uniqueId('clay')
    const p = Math.min(Math.max(Number(puff), 0), 100) / 100

    // Radius is now clamped to half the shortest side — this is what fixed the
    // pinched/distorted look on 'card' and 'blob' at smaller heights.
    const rawR =
        style === 'blob' ? Math.min(bw, bh) * 0.48 :
            style === 'panel' ? 18 : 30
    const r = Math.min(rawR, bw / 2, bh / 2)

    const useAccent = !!(opts.colors || (opts.metal && opts.metal in METALS))
    let accentFill = t.dark
    let accentDefs = ''
    if (opts.colors) {
        const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 135), bw, bh)
        accentFill = fill; accentDefs = defs
    } else if (opts.metal && opts.metal in METALS) {
        const { fill, defs } = resolveColor(opts.metal as MetalName, bw, bh)
        accentFill = fill; accentDefs = defs
    }

    const bodyId = `${uid}_body`
    const bodyFill = useAccent ? accentFill : `url(#${bodyId})`

    const family = FONT_STACKS[opts.fontFamily ?? 'rounded']
    const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)
    const mainText = opts.textColor || t.text
    const dimText = opts.textColor || t.textDim

    const gradDefs = `
    <linearGradient id="${bodyId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.light}"/>
      <stop offset="55%" stop-color="${t.base}"/>
      <stop offset="100%" stop-color="${t.dark}"/>
    </linearGradient>
    <radialGradient id="${uid}_sheen" cx="30%" cy="20%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="${(is3d ? 0.6 : 0.42) * p + 0.12}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${uid}_rim" cx="75%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#000000" stop-opacity="${is3d ? 0.32 : 0.16}"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${uid}_ground" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>`

    const shadowBlur = is3d ? 10 + p * 8 : 4 + p * 3
    const shadowDist = is3d ? 8 + p * 6 : 2 + p * 2

    const filters = `
    <filter id="${uid}_dropdark" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="${shadowDist * 0.4}" dy="${shadowDist}" stdDeviation="${shadowBlur * 0.5}"
        flood-color="${t.dark}" flood-opacity="${0.3 + p * 0.2}"/>
    </filter>
    <filter id="${uid}_droplight" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="${-shadowDist * 0.3}" dy="${-shadowDist * 0.3}" stdDeviation="${shadowBlur * 0.35}"
        flood-color="#ffffff" flood-opacity="${0.4 + p * 0.25}"/>
    </filter>
    <filter id="${uid}_groundblur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${6 + p * 5}"/>
    </filter>`

    const iconFontSize = Math.min(24, bh * 0.16) * scale
    const valueFontSize = Math.min(38, bh * 0.27) * scale
    const titleFontSize = Math.min(11, bh * 0.08) * scale
    const subFontSize = Math.min(11, bh * 0.075) * scale

    const contentTop = bh * 0.1
    const contentBottom = bh * 0.94
    const pos = layoutRows(contentTop, contentBottom, [
        { key: 'icon', active: hasIcon, weight: 1 },
        { key: 'title', active: hasTitle, weight: 0.5 },
        { key: 'value', active: hasValue, weight: 1.25 },
        { key: 'subtitle', active: hasSubtitle, weight: 0.5 },
    ])

    const linkIndicator = opts.linkUrl
        ? `<g opacity="0.55">
    <circle cx="${bw - 22}" cy="20" r="10" fill="${t.dark}" opacity="0.25"/>
    <path d="M ${bw - 26} 20 L ${bw - 18} 20 M ${bw - 21} 15 L ${bw - 18} 20 L ${bw - 21} 25"
      stroke="${mainText}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`
        : ''

    const groundShadow = is3d
        ? `<ellipse cx="${bw / 2}" cy="${bh + pad * 0.7}" rx="${bw * 0.34}" ry="${pad * 0.32}"
        fill="url(#${uid}_ground)" filter="url(#${uid}_groundblur)"/>`
        : ''

    const cardContent = `
  ${groundShadow}

  <g filter="url(#${uid}_dropdark)">
    <g filter="url(#${uid}_droplight)">
      <rect width="${bw}" height="${bh}" rx="${r}" fill="${bodyFill}"/>
    </g>
  </g>

  <rect width="${bw}" height="${bh}" rx="${r}" fill="url(#${uid}_rim)"/>
  <rect width="${bw}" height="${bh}" rx="${r}" fill="url(#${uid}_sheen)"/>

  ${hasIcon ? `
  <circle cx="${bw * 0.18}" cy="${pos.icon}" r="${iconFontSize * 0.85}" fill="${t.light}" opacity="0.7"/>
  <text x="${bw * 0.18}" y="${pos.icon}" text-anchor="middle" dominant-baseline="central"
    font-size="${iconFontSize * 0.8}" fill="${mainText}">${escapeXml(icon!)}</text>` : ''}

  ${hasTitle ? `<text x="${bw * 0.1}" y="${pos.title}" dominant-baseline="central"
    font-family="${family}"
    font-size="${titleFontSize}" font-weight="700" fill="${dimText}" letter-spacing="1"
  >${escapeXml(title!.toUpperCase())}</text>` : ''}

  ${hasValue ? `<text x="${bw * 0.1}" y="${pos.value}" dominant-baseline="central"
    font-family="${family}"
    font-size="${valueFontSize}" font-weight="800" fill="${mainText}"
  >${escapeXml(value!)}</text>` : ''}

  ${hasSubtitle ? `<text x="${bw * 0.1}" y="${pos.subtitle}" dominant-baseline="central"
    font-family="${family}"
    font-size="${subFontSize}" font-weight="500" fill="${dimText}" opacity="0.85"
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
  <g transform="translate(${pad}, ${pad})">
  ${body}
  </g>
</svg>`
}