// src/lib/renderers/divider.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  Theme, uniqueId, wavePath, zigzagPath,
} from '../metals'

export type DividerStyle = 'line' | 'double' | 'dashed' | 'ornate' | 'circuit' | 'wave' | 'zigzag' | 'dots'

export interface DividerOptions {
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: DividerStyle
  width?: number
  height?: number
  opacity?: number
  theme?: Theme
}

export function renderDivider(opts: DividerOptions): string {
  const {
    style = 'line',
    opacity = 1,
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 900), 100), 1200)
  const h = Math.min(Math.max(Number(opts.height ?? 4), 2), 60)
  const uid = uniqueId('mdiv')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  let content = ''

  switch (style) {
    case 'double':
      content = `
        <rect x="0" y="${h * 0.1}" width="${w}" height="${h * 0.35}" fill="${mainFill}" rx="1"/>
        <rect x="${w * 0.05}" y="${h * 0.6}" width="${w * 0.9}" height="${h * 0.3}" fill="${mainFill}" rx="1" opacity="0.5"/>`
      break

    case 'dashed': {
      const dashW = 40, gap = 12
      const count = Math.floor(w / (dashW + gap))
      const totalW = count * (dashW + gap) - gap
      const startX = (w - totalW) / 2
      content = Array.from({ length: count }, (_, i) =>
        `<rect x="${startX + i * (dashW + gap)}" y="${(h - 2) / 2}" width="${dashW}" height="2" fill="${mainFill}" rx="1"/>`
      ).join('')
      break
    }

    case 'ornate':
      content = `
        <rect x="${w * 0.15}" y="${(h - 1) / 2}" width="${w * 0.7}" height="1" fill="${mainFill}"/>
        <path d="M${w * 0.1},${h / 2} L${w * 0.13},${h * 0.2} L${w * 0.15},${h / 2} L${w * 0.13},${h * 0.8} Z"
          fill="${mainFill}" opacity="0.8"/>
        <circle cx="${w * 0.07}" cy="${h / 2}" r="${h * 0.4}" fill="${mainFill}" opacity="0.6"/>
        <path d="M${w * 0.9},${h / 2} L${w * 0.87},${h * 0.2} L${w * 0.85},${h / 2} L${w * 0.87},${h * 0.8} Z"
          fill="${mainFill}" opacity="0.8"/>
        <circle cx="${w * 0.93}" cy="${h / 2}" r="${h * 0.4}" fill="${mainFill}" opacity="0.6"/>
        <path d="M${w / 2 - h * 0.5},${h / 2} L${w / 2},${h * 0.15} L${w / 2 + h * 0.5},${h / 2} L${w / 2},${h * 0.85} Z"
          fill="${mainFill}"/>`
      break

    case 'circuit': {
      const nodes = [0.15, 0.35, 0.5, 0.65, 0.85]
      content = `
        <rect x="0" y="${(h - 1) / 2}" width="${w}" height="1" fill="${mainFill}" opacity="0.4"/>
        ${nodes.map(nx => `
          <rect x="${w * nx - 8}" y="${(h - 1) / 2}" width="16" height="1" fill="${mainFill}"/>
          <circle cx="${w * nx}" cy="${h / 2}" r="${h * 0.45}" fill="none" stroke="${mainFill}" stroke-width="1.5"/>
          <circle cx="${w * nx}" cy="${h / 2}" r="${h * 0.2}" fill="${mainFill}"/>`
      ).join('')}`
      break
    }

    case 'wave':
      content = `<path d="${wavePath(w, h / 2, h * 0.35, 6, 0, 80)}" stroke="${mainFill}" stroke-width="1.5" fill="none"/>`
      break

    case 'zigzag':
      content = `<path d="${zigzagPath(w, h * 0.2, h * 0.6, 20)}" stroke="${mainFill}" stroke-width="1.5" fill="none"/>`
      break

    case 'dots': {
      const dotGap = 12
      const dotCount = Math.floor(w / dotGap)
      content = Array.from({ length: dotCount }, (_, i) =>
        `<circle cx="${i * dotGap + dotGap / 2}" cy="${h / 2}" r="${h * 0.2}" fill="${mainFill}" opacity="${0.4 + (i % 3) * 0.2}"/>`
      ).join('')
      break
    }

    default: // line
      content = `
        <rect x="0" y="${(h - 2) / 2}" width="${w}" height="2" fill="${mainFill}" rx="1"/>
        <rect x="${w * 0.1}" y="${(h - 1) / 2}" width="${w * 0.8}" height="1" fill="white" opacity="0.3" rx="1"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Metallic divider" opacity="${opacity}">
  <title>MetalForge Divider</title>
  <defs>${mainDefs}</defs>
  ${content}
</svg>`
}