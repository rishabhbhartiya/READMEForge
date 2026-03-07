// src/lib/renderers/divider.ts
import { MetalType, METALS, buildGradient } from '../metals'

export type DividerStyle = 'line' | 'double' | 'dashed' | 'ornate' | 'circuit' | 'wave'

export interface DividerOptions {
  metal?: MetalType
  style?: DividerStyle
  width?: number
  height?: number
  opacity?: number
}

export function renderDivider(opts: DividerOptions): string {
  const {
    metal = 'chrome',
    style = 'line',
    opacity = 1,
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 900), 100), 1200)
  const h = Math.min(Math.max(Number(opts.height ?? 4), 2), 60)

  const m = METALS[metal] ?? METALS.chrome
  const uid = `mdiv_${Date.now().toString(36)}`
  const gradient = buildGradient(`${uid}_g`, metal, '90')

  let content = ''

  switch (style) {
    case 'double':
      content = `
        <rect x="0" y="${h * 0.1}" width="${w}" height="${h * 0.35}" fill="url(#${uid}_g)" rx="1"/>
        <rect x="${w * 0.05}" y="${h * 0.6}" width="${w * 0.9}" height="${h * 0.3}" fill="url(#${uid}_g)" rx="1" opacity="0.5"/>`
      break

    case 'dashed':
      const dashW = 40
      const gap = 12
      const count = Math.floor(w / (dashW + gap))
      const totalW = count * (dashW + gap) - gap
      const startX = (w - totalW) / 2
      content = Array.from({ length: count }, (_, i) =>
        `<rect x="${startX + i * (dashW + gap)}" y="${(h - 2) / 2}" width="${dashW}" height="2" fill="url(#${uid}_g)" rx="1"/>`
      ).join('')
      break

    case 'ornate':
      content = `
        <!-- Center line -->
        <rect x="${w * 0.15}" y="${(h - 1) / 2}" width="${w * 0.7}" height="1" fill="url(#${uid}_g)"/>
        <!-- Left ornament -->
        <path d="M${w * 0.1},${h / 2} L${w * 0.13},${h * 0.2} L${w * 0.15},${h / 2} L${w * 0.13},${h * 0.8} Z"
          fill="url(#${uid}_g)" opacity="0.8"/>
        <circle cx="${w * 0.07}" cy="${h / 2}" r="${h * 0.4}" fill="url(#${uid}_g)" opacity="0.6"/>
        <!-- Right ornament (mirrored) -->
        <path d="M${w * 0.9},${h / 2} L${w * 0.87},${h * 0.2} L${w * 0.85},${h / 2} L${w * 0.87},${h * 0.8} Z"
          fill="url(#${uid}_g)" opacity="0.8"/>
        <circle cx="${w * 0.93}" cy="${h / 2}" r="${h * 0.4}" fill="url(#${uid}_g)" opacity="0.6"/>
        <!-- Center diamond -->
        <path d="M${w / 2 - h * 0.5},${h / 2} L${w / 2},${h * 0.15} L${w / 2 + h * 0.5},${h / 2} L${w / 2},${h * 0.85} Z"
          fill="url(#${uid}_g)"/>`
      break

    case 'circuit':
      const nodes = [0.15, 0.35, 0.5, 0.65, 0.85]
      const lines = `
        <rect x="0" y="${(h - 1) / 2}" width="${w}" height="1" fill="url(#${uid}_g)" opacity="0.4"/>
        ${nodes.map(nx => `
          <rect x="${w * nx - 8}" y="${(h - 1) / 2}" width="16" height="1" fill="url(#${uid}_g)"/>
          <circle cx="${w * nx}" cy="${h / 2}" r="${h * 0.45}" fill="none" stroke="url(#${uid}_g)" stroke-width="1.5"/>
          <circle cx="${w * nx}" cy="${h / 2}" r="${h * 0.2}" fill="url(#${uid}_g)"/>
        `).join('')}`
      content = lines
      break

    case 'wave':
      const pts = Array.from({ length: 40 }, (_, i) => {
        const x = (i / 39) * w
        const y = h / 2 + Math.sin((i / 39) * Math.PI * 6) * (h * 0.35)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
      content = `<path d="${pts}" stroke="url(#${uid}_g)" stroke-width="1.5" fill="none"/>`
      break

    default: // line
      content = `
        <rect x="0" y="${(h - 2) / 2}" width="${w}" height="2" fill="url(#${uid}_g)" rx="1"/>
        <rect x="${w * 0.1}" y="${(h - 1) / 2}" width="${w * 0.8}" height="1" fill="white" opacity="0.3" rx="1"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Metallic divider" opacity="${opacity}">
  <title>MetalForge Divider</title>
  <defs>${gradient}</defs>
  ${content}
</svg>`
}
