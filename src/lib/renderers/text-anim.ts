// src/lib/renderers/text-anim.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  getThemeColors, Theme, uniqueId,
  buildTextAnimation, TextAnimationEffect, TextAnimConfig,
} from '../metals'

// Re-export all effects from metals
export type { TextAnimationEffect } from '../metals'

export type TextEffect = TextAnimationEffect
export type SpeedSetting = 'slow' | 'normal' | 'fast'
export type BgMode = 'dark' | 'light' | 'transparent'

export interface TextAnimOptions {
  text?: string
  effect?: TextEffect
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  width?: number
  height?: number
  fontSize?: number
  speed?: SpeedSetting
  /** Override text color */
  color?: string
  bg?: BgMode
  fontFamily?: string
  theme?: Theme
}

export function renderTextAnim(opts: TextAnimOptions): string {
  const {
    text = 'Hello, World!',
    effect = 'typewriter',
    width = 600,
    height = 80,
    fontSize = 32,
    speed = 'normal',
    bg = 'dark',
    fontFamily = 'Orbitron',
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(width), 150), 1200)
  const h = Math.min(Math.max(Number(height), 30), 300)
  const fs = Math.min(Math.max(Number(fontSize), 10), 120)
  const uid = uniqueId('mta')

  const metal = opts.metal ?? 'electric'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.electric

  // Resolve color - prefer explicit color override, then colors gradient, then metal
  let textColor = opts.color ?? m.glow
  let colorDefs = ''
  if (opts.colors) {
    const { fill, defs } = resolveColor(parseColorList(opts.colors, opts.angle ?? 90), w, h)
    textColor = fill; colorDefs = defs
  } else if (opts.metal && opts.metal in METALS && !opts.color) {
    const { fill, defs } = resolveColor(opts.metal as MetalName, w, h)
    textColor = fill; colorDefs = defs
  }

  const dur = speed === 'slow' ? 4 : speed === 'fast' ? 1.5 : 2.5

  const bgColor = bg === 'transparent' ? 'none'
    : bg === 'dark' ? '#080810'
      : '#f0f4fc'

  const bgRect = bg === 'transparent' ? '' :
    `<rect width="${w}" height="${h}" rx="6" fill="${bgColor}"/>`

  const textX = 20  // left-aligned default; centered via text-anchor in some effects
  const textY = h / 2

  const animCfg: TextAnimConfig = {
    effect: effect as TextAnimationEffect,
    text,
    color: textColor,
    bg: bgColor,
    fontSize: fs,
    duration: dur,
    fontFamily,
    letterSpacing: 2,
  }

  const { svgContent, defs: animDefs } = buildTextAnimation(animCfg, textX, textY, uid)

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(text)}">
  <title>${escapeXml(text)}</title>
  <defs>
    ${colorDefs}
    ${animDefs}
  </defs>
  ${bgRect}
  ${svgContent}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}