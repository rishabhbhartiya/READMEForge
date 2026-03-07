// src/lib/renderers/text-anim.ts
// Animated SVG text — typewriter, glitch, wave, morph, neon flicker, etc.

import { MetalType, METALS, buildGradient } from '../metals'

export type TextEffect =
  | 'typewriter' | 'glitch' | 'wave' | 'neon-flicker'
  | 'rainbow' | 'shimmer' | 'matrix' | 'dissolve' | 'bounce'
  | 'scan' | 'laser' | 'retro-scroll'

export interface TextAnimOptions {
  text?: string
  effect?: TextEffect
  metal?: MetalType
  width?: number
  height?: number
  fontSize?: number
  speed?: 'slow' | 'normal' | 'fast'
  color?: string       // override color (hex)
  bg?: 'dark' | 'light' | 'transparent'
  fontFamily?: string
}

export function renderTextAnim(opts: TextAnimOptions): string {
  const {
    text = 'Hello, World!',
    effect = 'typewriter',
    metal = 'electric',
    width = 600,
    height = 80,
    fontSize = 32,
    speed = 'normal',
    bg = 'dark',
    fontFamily = 'Orbitron',
  } = opts

  const w = Math.min(Math.max(Number(width), 150), 1200)
  const h = Math.min(Math.max(Number(height), 30), 300)
  const fs = Math.min(Math.max(Number(fontSize), 10), 120)
  const m = METALS[metal] ?? METALS.electric
  const uid = `mta_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')

  const dur = speed === 'slow' ? 4 : speed === 'fast' ? 1.5 : 2.5
  const color = opts.color ?? m.accent

  const bgRect = bg === 'transparent' ? '' :
    bg === 'dark'
      ? `<rect width="${w}" height="${h}" rx="6" fill="#080810"/>`
      : `<rect width="${w}" height="${h}" rx="6" fill="#f0f4fc"/>`

  const textX = w / 2
  const textY = h / 2

  const baseText = (extras = '', filterAttr = '', fillAttr = `fill="${color}"`) =>
    `<text x="${textX}" y="${textY}"
      text-anchor="middle" dominant-baseline="middle"
      font-family="'${fontFamily}','Arial Black',sans-serif"
      font-size="${fs}" font-weight="900"
      ${fillAttr} letter-spacing="2"
      ${filterAttr} ${extras}
    >${escapeXml(text)}</text>`

  let defs = mainGrad
  let content = ''
  let style = ''

  switch (effect) {
    case 'typewriter': {
      const charW = fs * 0.65
      const totalW = text.length * charW
      const startX = textX - totalW / 2
      const animDur = text.length * (dur / text.length)
      content = `
        ${baseText()}
        <!-- Cursor -->
        <rect x="${textX + totalW/2 + 4}" y="${textY - fs*0.55}" width="${fs*0.08}" height="${fs*1.1}"
          fill="${color}">
          <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
        </rect>
        <!-- Reveal mask moving right -->
        <rect x="0" y="0" width="${w}" height="${h}" fill="${bg === 'dark' ? '#080810' : '#f0f4fc'}">
          <animate attributeName="x" values="${startX};${startX + totalW + fs};${startX + totalW + fs}"
            dur="${animDur * 1.5}s" repeatCount="indefinite" keyTimes="0;0.6;1"
            calcMode="linear"/>
          <animate attributeName="width" values="${w - startX};0;0"
            dur="${animDur * 1.5}s" repeatCount="indefinite" keyTimes="0;0.6;1"
            calcMode="linear"/>
        </rect>
      `
      break
    }

    case 'glitch': {
      const glitchOffset = fs * 0.05
      defs += `<filter id="${uid}_glitch">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="4" seed="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="${fs * 0.04}" xChannelSelector="R" yChannelSelector="G"/>
      </filter>`
      content = `
        <!-- Red channel offset -->
        <text x="${textX + glitchOffset}" y="${textY - 1}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900"
          fill="#ff0040" opacity="0.7" letter-spacing="2"
          style="mix-blend-mode:screen"
        >${escapeXml(text)}<animate attributeName="x" values="${textX+glitchOffset};${textX-glitchOffset};${textX+glitchOffset*2};${textX}" dur="${dur}s" repeatCount="indefinite" keyTimes="0;0.3;0.6;1"/></text>
        <!-- Cyan channel offset -->
        <text x="${textX - glitchOffset}" y="${textY + 1}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900"
          fill="#00ffff" opacity="0.7" letter-spacing="2"
          style="mix-blend-mode:screen"
        >${escapeXml(text)}<animate attributeName="x" values="${textX-glitchOffset};${textX+glitchOffset};${textX};${textX-glitchOffset*2}" dur="${dur*1.1}s" repeatCount="indefinite" keyTimes="0;0.25;0.5;1"/></text>
        ${baseText('', `filter="url(#${uid}_glitch)"`)}
        <!-- Scan bar glitch -->
        <rect x="0" y="${textY - fs*0.3}" width="${w}" height="${fs*0.1}"
          fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0;0.15;0;0" dur="${dur*0.4}s" repeatCount="indefinite"/>
          <animate attributeName="y" values="${textY-fs*0.3};${textY+fs*0.1};${textY-fs*0.2}" dur="${dur*0.4}s" repeatCount="indefinite"/>
        </rect>
      `
      break
    }

    case 'wave': {
      const letters = text.split('')
      const totalTextW = letters.length * fs * 0.6
      const startLetterX = textX - totalTextW / 2
      content = letters.map((char, i) => {
        const lx = startLetterX + i * fs * 0.6 + fs * 0.3
        const delay = (i / letters.length * dur).toFixed(2)
        return `<text x="${lx}" y="${textY}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900"
          fill="${color}" letter-spacing="0"
        >${escapeXml(char)}<animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-${fs*0.3}; 0,0"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/></text>`
      }).join('')
      break
    }

    case 'neon-flicker': {
      defs += `<filter id="${uid}_neon">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`
      content = `
        <!-- Glow layer -->
        <text x="${textX}" y="${textY}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900"
          fill="${color}" letter-spacing="2" filter="url(#${uid}_neon)"
        >${escapeXml(text)}<animate attributeName="opacity" values="0.9;0.4;0.9;0.3;0.9;0.85;0.2;0.9" dur="${dur}s" repeatCount="indefinite"/></text>
        <!-- Crisp layer -->
        ${baseText()}
        <text x="${textX}" y="${textY}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900"
          fill="white" opacity="0.4" letter-spacing="2"
        >${escapeXml(text)}<animate attributeName="opacity" values="0.4;0.1;0.4;0;0.3;0.4;0;0.35" dur="${dur}s" repeatCount="indefinite"/></text>
      `
      break
    }

    case 'shimmer': {
      defs += `<linearGradient id="${uid}_sh" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
        <stop offset="45%" stop-color="${color}" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="white" stop-opacity="1"/>
        <stop offset="55%" stop-color="${color}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.4">
        </stop>
        <animateTransform attributeName="gradientTransform" type="translate"
          from="-${w * 2} 0" to="${w * 2} 0" dur="${dur}s" repeatCount="indefinite"/>
      </linearGradient>`
      content = baseText('', '', `fill="url(#${uid}_sh)"`)
      break
    }

    case 'rainbow': {
      defs += `<linearGradient id="${uid}_rainbow" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ff0080"/>
        <stop offset="20%" stop-color="#ff8000"/>
        <stop offset="40%" stop-color="#ffff00"/>
        <stop offset="60%" stop-color="#00ff80"/>
        <stop offset="80%" stop-color="#0080ff"/>
        <stop offset="100%" stop-color="#8000ff"/>
        <animateTransform attributeName="gradientTransform" type="translate"
          from="-${w} 0" to="${w} 0" dur="${dur * 2}s" repeatCount="indefinite"/>
      </linearGradient>`
      content = baseText('', '', `fill="url(#${uid}_rainbow)"`)
      break
    }

    case 'matrix': {
      // Vertical scan effect
      content = `
        ${baseText('', '', `fill="${color}"`)}
        <!-- Scan line mask -->
        <rect x="${textX - text.length * fs * 0.35}" y="${textY - fs * 0.6}"
          width="${text.length * fs * 0.7}" height="${fs * 1.2}"
          fill="${bg === 'dark' ? '#080810' : '#f0f4fc'}" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0;0.5" dur="${dur*0.5}s" repeatCount="indefinite"/>
        </rect>
        <!-- Green rain characters (decorative) -->
        ${Array.from({length: 8}, (_, i) => {
          const x = textX - text.length * fs * 0.35 + i * (text.length * fs * 0.7 / 8)
          return `<text x="${x}" y="${textY - fs}" font-family="'Share Tech Mono',monospace" font-size="${fs * 0.3}"
            fill="#00ff41" opacity="0.4" text-anchor="middle">
            ${String.fromCharCode(48 + Math.floor(Math.random() * 10))}
            <animate attributeName="opacity" values="0.4;0;0.4" dur="${(0.5 + i * 0.2).toFixed(1)}s" repeatCount="indefinite"/>
          </text>`
        }).join('')}
      `
      break
    }

    case 'bounce': {
      const letters = text.split('')
      const totalTextW = letters.length * fs * 0.62
      const startX = textX - totalTextW / 2
      content = letters.map((char, i) => {
        const lx = startX + i * fs * 0.62 + fs * 0.31
        const delay = (i * 0.08).toFixed(2)
        return `<text x="${lx}" y="${textY}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="'${fontFamily}','Arial Black',sans-serif"
          font-size="${fs}" font-weight="900" fill="${color}"
        >${escapeXml(char)}<animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-${fs*0.25}; 0,${fs*0.05}; 0,0"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.3;0.7;1"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/></text>`
      }).join('')
      break
    }

    default:
      content = baseText()
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${text}">
  <title>${text}</title>
  <defs>${defs}</defs>
  ${style ? `<style>${style}</style>` : ''}
  ${bgRect}
  ${content}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
