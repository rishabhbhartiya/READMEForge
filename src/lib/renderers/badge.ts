// src/lib/renderers/badge.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  buildGradientDef, getThemeColors, Theme, uniqueId,
  GradientStop,
} from '../metals'

export type BadgeShape = 'pill' | 'sharp' | 'hex' | 'rounded' | 'flat'

export interface BadgeOptions {
  label?: string
  value?: string           // optional right-side value (shield style)
  /** MetalName, CSS color, or comma-separated gradient e.g. '#ff0000,#0000ff' */
  metal?: string
  colors?: string          // explicit multi-stop gradient
  angle?: number           // gradient angle 0-360
  /** Value-side color (for two-tone badge). Defaults to darker shade of main metal */
  valueColor?: string
  shape?: BadgeShape
  icon?: string            // single char, emoji, or short prefix
  fontSize?: number
  theme?: Theme
}

export function renderBadge(opts: BadgeOptions): string {
  const {
    label = 'badge',
    value,
    shape = 'pill',
    icon = '',
    fontSize = 11,
    theme = 'dark',
  } = opts

  const uid = uniqueId('mbdg')

  const metal = opts.metal ?? 'chrome'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome

  // Resolve main (label-side) color
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)

  const charW = fontSize * 0.65
  const iconExtra = icon ? fontSize + 4 : 0

  const r =
    shape === 'pill' ? 14 :
      shape === 'sharp' ? 2 :
        shape === 'hex' ? 5 :
          shape === 'flat' ? 3 : 4

  const h = 26

  // Text color based on theme
  const textColor = theme === 'dark'
    ? (m.textDark ?? '#ffffff')
    : (m.textLight ?? '#111111')

  // ── TWO-TONE SHIELD BADGE ───────────────────────────────────────────────────
  if (value) {
    const lw = label.length * charW + iconExtra + 20
    const rw = value.length * charW + 20
    const w = lw + rw

    // Label side — main color
    const { fill: labelFill, defs: labelDefs } = resolveColor(colorSpec, w, h)

    // Value side — valueColor param, or auto-derive a darker stop from metal palette
    let valueFill = ''
    let valueDefs = ''
    if (opts.valueColor) {
      const { fill, defs } = resolveColor(
        opts.valueColor in METALS
          ? opts.valueColor as MetalName
          : opts.valueColor,
        w, h
      )
      valueFill = fill
      valueDefs = defs
    } else {
      // Auto: use middle+end stops of metal gradient for a darker complementary look
      const stops: GradientStop[] = [
        { color: m.gradient[Math.floor(m.gradient.length * 0.4)]?.color ?? m.secondary, position: 0 },
        { color: m.gradient[m.gradient.length - 1]?.color ?? m.shadow, position: 100 },
      ]
      const { id: vgId, defs: vgDefs } = buildGradientDef(
        { type: 'linear', angle: 90, stops },
        `${uid}_v`
      )
      valueFill = `url(#${vgId})`
      valueDefs = vgDefs
    }

    // Top highlight sheen
    const { id: hiId, defs: hiDefs } = buildGradientDef(
      {
        type: 'linear',
        angle: 90,
        stops: [
          { color: 'rgba(255,255,255,0.25)', position: 0 },
          { color: 'rgba(255,255,255,0)', position: 100 },
        ],
      },
      `${uid}_hi`
    )

    return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <defs>
    ${labelDefs}
    ${valueDefs}
    ${hiDefs}
  </defs>

  <!-- Label section -->
  <rect width="${lw}" height="${h}" rx="${r}" fill="${labelFill}"/>
  <!-- Hide right radius of label panel -->
  <rect x="${lw - r}" y="0" width="${r}" height="${h}" fill="${labelFill}"/>

  <!-- Value section -->
  <rect x="${lw}" y="0" width="${rw}" height="${h}" fill="${valueFill}"/>
  <!-- Right rounded cap -->
  <rect x="${w - r}" y="0" width="${r}" height="${h}" rx="${r}" fill="${valueFill}"/>

  <!-- Top highlight sheen -->
  <rect width="${w}" height="${h / 2}" rx="${r}" fill="url(#${hiId})"/>

  <!-- Divider -->
  <line x1="${lw}" y1="4" x2="${lw}" y2="${h - 4}"
    stroke="black" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Label text -->
  <text x="${lw / 2}" y="${h / 2 + 1}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${fontSize}" font-weight="700"
    fill="${textColor}" letter-spacing="0.8"
  >${icon ? escapeXml(icon) + ' ' : ''}${escapeXml(label)}</text>

  <!-- Value text -->
  <text x="${lw + rw / 2}" y="${h / 2 + 1}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${fontSize}" font-weight="700"
    fill="${textColor}" letter-spacing="0.8"
  >${escapeXml(value)}</text>
</svg>`
  }

  // ── SINGLE BADGE ─────────────────────────────────────────────────────────────
  const w = label.length * charW + iconExtra + 28

  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  // Top highlight sheen
  const { id: hiId, defs: hiDefs } = buildGradientDef(
    {
      type: 'linear',
      angle: 90,
      stops: [
        { color: 'rgba(255,255,255,0.30)', position: 0 },
        { color: 'rgba(255,255,255,0.05)', position: 60 },
        { color: 'rgba(0,0,0,0.10)', position: 100 },
      ],
    },
    `${uid}_hi`
  )

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    ${mainDefs}
    ${hiDefs}
  </defs>

  <!-- Base fill -->
  <rect width="${w}" height="${h}" rx="${r}" fill="${mainFill}"/>

  <!-- Top highlight sheen -->
  <rect width="${w}" height="${h / 2}" rx="${r}" fill="url(#${hiId})"/>

  <!-- Bottom shadow edge -->
  <rect x="1" y="${h * 0.55}" width="${w - 2}" height="${h * 0.42}" rx="${r / 2}"
    fill="black" opacity="0.1"/>

  <!-- Label -->
  <text x="${w / 2}" y="${h / 2 + 1}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${fontSize}" font-weight="700"
    fill="${textColor}" letter-spacing="0.8"
  >${icon ? escapeXml(icon) + ' ' : ''}${escapeXml(label)}</text>
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}