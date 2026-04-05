// src/lib/renderers/banner.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, getThemeColors,
  DesignStyle, Theme, wavePath, uniqueId,
  GradientConfig,
} from '../metals'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerShape =
  | 'wave' | 'wave-bottom' | 'venom' | 'diagonal' | 'arch' | 'flat' | 'egg'
  | 'chevron' | 'shark' | 'slice' | 'cylinder' | 'hexframe' | 'torn'
  | 'diamond' | 'ribbon' | 'circuit' | 'blob'

export type BannerAnimation =
  | 'none' | 'shimmer' | 'pulse' | 'fadeIn' | 'scanline'
  | 'glow' | 'scan' | 'twinkling' | 'aurora' | 'glitch' | 'plasma' | 'neonFlicker'

export type BannerVisualStyle =
  | 'metallic' | 'glass' | 'neo' | 'cyberpunk' | 'holographic'
  | 'aurora' | 'neon' | 'minimal' | 'retro' | 'gradient'

export type BannerBorder =
  | 'none' | 'metallic' | 'normal' | 'gradient' | 'glow'
  | 'double' | 'dashed' | 'animated' | 'neon' | 'circuit'

export interface BannerOptions {
  text?: string
  subtext?: string
  desc?: string
  metal?: string
  colors?: string
  angle?: number
  shape?: BannerShape
  height?: number
  width?: number
  animation?: BannerAnimation
  fontSize?: number
  subtextSize?: number
  fontFamily?: string
  subtextFont?: string
  section?: 'header' | 'footer'
  reversal?: boolean
  textAlign?: 'left' | 'center' | 'right'
  theme?: Theme
  style?: DesignStyle
  visualStyle?: BannerVisualStyle
  bg?: string
  /** Independent text colors */
  textColor?: string
  subtextColor?: string
  /** Border */
  border?: BannerBorder
  borderColor?: string
  borderWidth?: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function hex2rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// ─── Gradient resolver (same logic as before) ─────────────────────────────────

function buildBannerGradient(opts: BannerOptions, w: number, h: number): { fill: string; defs: string } {
  if (opts.colors) {
    const cfg = parseColorList(opts.colors, opts.angle ?? 135)
    const full: GradientConfig = { ...cfg, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: w, y2: h }
    const { id, defs } = buildGradientDef(full)
    return { fill: `url(#${id})`, defs }
  }
  const metal = opts.metal ?? 'chrome'
  return resolveColor(metal in METALS ? metal as MetalName : metal, w, h)
}

// ─── Visual Style Layer ────────────────────────────────────────────────────────
// Returns extra defs + overlay elements that go on top of the base shape
// to give it the visual treatment for glass, neo, cyber, holographic, etc.

function buildVisualStyle(
  vs: BannerVisualStyle,
  w: number, h: number,
  uid: string,
  mainFill: string,
  metal: string,
  theme: Theme,
): { defs: string; layers: string } {
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome

  switch (vs) {

    case 'glass': {
      // Glassmorphism: translucent frosted panel, soft border, internal blur sheen
      const glassId = `${uid}_gl`
      const noiseId = `${uid}_gn`
      const sheenId = `${uid}_gs`
      const glowFId = `${uid}_ggf`
      const defs = `
        <!-- Glass noise texture -->
        <filter id="${noiseId}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
        <!-- Glass inner sheen gradient -->
        <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.28"/>
          <stop offset="40%"  stop-color="white" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="white" stop-opacity="0.02"/>
        </linearGradient>
        <!-- Glass tint -->
        <linearGradient id="${glassId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="${theme === 'dark' ? '#ffffff' : '#000000'}" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="${theme === 'dark' ? '#8899ff' : '#3344aa'}" stop-opacity="0.12"/>
        </linearGradient>`
      const layers = `
        <!-- Glassmorphism tint -->
        <rect width="${w}" height="${h}" fill="url(#${glassId})" rx="0"/>
        <!-- Glass noise -->
        <rect width="${w}" height="${h}" fill="white" opacity="0.03" filter="url(#${noiseId})"/>
        <!-- Glass top sheen -->
        <rect width="${w}" height="${h * 0.55}" fill="url(#${sheenId})"/>
        <!-- Glass edge highlight top -->
        <rect x="1" y="1" width="${w - 2}" height="1.5" fill="white" opacity="0.35"/>
        <!-- Glass edge highlight left -->
        <rect x="1" y="1" width="1.5" height="${h - 2}" fill="white" opacity="0.2"/>
        <!-- Glass bottom shadow -->
        <rect x="1" y="${h - 2}" width="${w - 2}" height="1.5" fill="black" opacity="0.25"/>`
      return { defs, layers }
    }

    case 'neo': {
      // Neumorphism: soft extruded/inset shadow with muted tones
      const lightId = `${uid}_nl`
      const darkId = `${uid}_nd`
      const baseCol = theme === 'dark' ? '#1e2235' : '#e0e5ec'
      const lightCol = theme === 'dark' ? '#2d3450' : '#ffffff'
      const darkCol = theme === 'dark' ? '#0f1220' : '#a3b1c6'
      const defs = `
        <filter id="${uid}_neo_l" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="-4" dy="-4" stdDeviation="6" flood-color="${lightCol}" flood-opacity="0.7"/>
        </filter>
        <filter id="${uid}_neo_d" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="4" dy="4" stdDeviation="6" flood-color="${darkCol}" flood-opacity="0.7"/>
        </filter>
        <linearGradient id="${uid}_neo_g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="${lightCol}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${darkCol}"  stop-opacity="0.1"/>
        </linearGradient>`
      const layers = `
        <!-- Neo light shadow -->
        <rect width="${w}" height="${h}" fill="none" filter="url(#${uid}_neo_l)" rx="12"/>
        <!-- Neo dark shadow -->
        <rect width="${w}" height="${h}" fill="none" filter="url(#${uid}_neo_d)" rx="12"/>
        <!-- Neo surface gradient -->
        <rect width="${w}" height="${h}" fill="url(#${uid}_neo_g)" rx="12"/>
        <!-- Neo top shine -->
        <rect x="8" y="8" width="${w * 0.4}" height="2" rx="1" fill="white" opacity="0.2"/>
        <rect x="8" y="8" width="2" height="${h * 0.3}" rx="1" fill="white" opacity="0.15"/>`
      return { defs, layers }
    }

    case 'cyberpunk': {
      // Cyberpunk: scanlines, grid, neon leak, glitch-ready
      const gridId = `${uid}_cpg`
      const leakId = `${uid}_cpl`
      const defs = `
        <pattern id="${gridId}" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0 L0 0 0 24" fill="none" stroke="${m.glow}" stroke-width="0.3" opacity="0.18"/>
        </pattern>
        <linearGradient id="${leakId}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"  stop-color="${m.glow}" stop-opacity="0.22"/>
          <stop offset="60%" stop-color="${m.glow}" stop-opacity="0"/>
        </linearGradient>`
      // Scanlines via repeating lines
      const scanlines = Array.from({ length: Math.floor(h / 4) }, (_, i) =>
        `<line x1="0" y1="${i * 4}" x2="${w}" y2="${i * 4}" stroke="black" stroke-width="0.8" opacity="0.12"/>`
      ).join('')
      const layers = `
        <!-- Cyber grid -->
        <rect width="${w}" height="${h}" fill="url(#${gridId})"/>
        <!-- Cyber bottom leak -->
        <rect width="${w}" height="${h}" fill="url(#${leakId})"/>
        <!-- Scanlines -->
        ${scanlines}
        <!-- Cyber corner marks -->
        <polyline points="0,16 0,0 16,0"         fill="none" stroke="${m.glow}" stroke-width="2" opacity="0.8"/>
        <polyline points="${w - 16},0 ${w},0 ${w},16"   fill="none" stroke="${m.glow}" stroke-width="2" opacity="0.8"/>
        <polyline points="0,${h - 16} 0,${h} 16,${h}"  fill="none" stroke="${m.glow}" stroke-width="2" opacity="0.8"/>
        <polyline points="${w - 16},${h} ${w},${h} ${w},${h - 16}" fill="none" stroke="${m.glow}" stroke-width="2" opacity="0.8"/>
        <!-- Cyber accent line -->
        <rect x="0" y="${h * 0.88}" width="${w * 0.35}" height="1.5" fill="${m.glow}" opacity="0.6"/>
        <rect x="${w * 0.37}" y="${h * 0.88}" width="${w * 0.08}" height="1.5" fill="${m.glow}" opacity="0.3"/>`
      return { defs, layers }
    }

    case 'holographic': {
      // Holographic: rainbow iridescent shift + foil shimmer
      const holoId = `${uid}_holo`
      const foilId = `${uid}_foil`
      const defs = `
        <linearGradient id="${holoId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"    stop-color="#ff0080" stop-opacity="0.35"/>
          <stop offset="16.6%" stop-color="#ff8c00" stop-opacity="0.3"/>
          <stop offset="33.3%" stop-color="#ffe000" stop-opacity="0.3"/>
          <stop offset="50%"   stop-color="#00e676" stop-opacity="0.3"/>
          <stop offset="66.6%" stop-color="#00b0ff" stop-opacity="0.35"/>
          <stop offset="83.3%" stop-color="#9c27b0" stop-opacity="0.35"/>
          <stop offset="100%"  stop-color="#ff0080" stop-opacity="0.3"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-1 0" to="1 0" dur="4s" repeatCount="indefinite"
            additive="sum"/>
        </linearGradient>
        <linearGradient id="${foilId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.4"/>
          <stop offset="30%"  stop-color="white" stop-opacity="0.08"/>
          <stop offset="70%"  stop-color="black" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.12"/>
        </linearGradient>`
      const layers = `
        <!-- Holographic rainbow layer -->
        <rect width="${w}" height="${h}" fill="url(#${holoId})"/>
        <!-- Foil sheen -->
        <rect width="${w}" height="${h}" fill="url(#${foilId})"/>
        <!-- Holographic sparkle dots -->
        ${[...Array(20)].map((_, i) => {
        const cx = ((i * 137.5) % 100) / 100 * w
        const cy = ((i * 73.1) % 100) / 100 * h
        const r = 1 + (i % 3)
        const hue = (i * 47) % 360
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="hsl(${hue},100%,80%)" opacity="0.6">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur="${1.2 + (i % 5) * 0.4}s"
              begin="${(i * 0.18).toFixed(2)}s" repeatCount="indefinite"/>
          </circle>`
      }).join('')}`
      return { defs, layers }
    }

    case 'aurora': {
      // Aurora borealis: flowing color bands
      const a1 = `${uid}_a1`, a2 = `${uid}_a2`, a3 = `${uid}_a3`
      const defs = `
        <linearGradient id="${a1}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#00ffa0" stop-opacity="0"/>
          <stop offset="30%"  stop-color="#00ffa0" stop-opacity="0.4"/>
          <stop offset="60%"  stop-color="#0080ff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0080ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-0.5 0" to="0.5 0" dur="6s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>
        <linearGradient id="${a2}" x1="20%" y1="0%" x2="80%" y2="0%">
          <stop offset="0%"   stop-color="#8000ff" stop-opacity="0"/>
          <stop offset="50%"  stop-color="#ff00c0" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#8000ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="0.3 0" to="-0.3 0" dur="8s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>
        <linearGradient id="${a3}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#00ffff" stop-opacity="0"/>
          <stop offset="40%"  stop-color="#00ffff" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#00ffff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="0.2 0" to="-0.4 0" dur="5s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>`
      const layers = `
        <rect width="${w}" height="${h}" fill="url(#${a1})"/>
        <rect width="${w}" height="${h * 0.6}" y="${h * 0.2}" fill="url(#${a2})"/>
        <rect width="${w}" height="${h * 0.4}" y="${h * 0.3}" fill="url(#${a3})"/>`
      return { defs, layers }
    }

    case 'neon': {
      // Neon: dark bg, bright glowing outlines, bloom
      const bloomId = `${uid}_nbloom`
      const defs = `
        <filter id="${bloomId}" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>`
      const layers = `
        <!-- Neon glow bloom on fill -->
        <rect width="${w}" height="${h}" fill="${mainFill}" opacity="0.08" filter="url(#${bloomId})"/>
        <!-- Neon horizontal accent lines -->
        <line x1="0" y1="${h * 0.12}" x2="${w}" y2="${h * 0.12}"
          stroke="${m.glow}" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="${h * 0.88}" x2="${w}" y2="${h * 0.88}"
          stroke="${m.glow}" stroke-width="1" opacity="0.5"/>
        <!-- Neon side accents -->
        <line x1="0" y1="0" x2="0" y2="${h}"
          stroke="${m.glow}" stroke-width="3" opacity="0.6"/>
        <line x1="${w}" y1="0" x2="${w}" y2="${h}"
          stroke="${m.glow}" stroke-width="3" opacity="0.6"/>
        <!-- Neon center dot cluster -->
        <circle cx="${w * 0.06}" cy="${h * 0.5}" r="3" fill="${m.glow}" opacity="0.7">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="${w * 0.94}" cy="${h * 0.5}" r="3" fill="${m.glow}" opacity="0.7">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </circle>`
      return { defs, layers }
    }

    case 'retro': {
      // Retro: halftone dots + VHS scanlines + grain
      const dotId = `${uid}_rdot`
      const defs = `
        <pattern id="${dotId}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.2" fill="${m.glow}" opacity="0.25"/>
        </pattern>`
      const scanlines = Array.from({ length: Math.floor(h / 3) }, (_, i) =>
        `<rect x="0" y="${i * 3}" width="${w}" height="1" fill="black" opacity="0.08"/>`
      ).join('')
      const layers = `
        <!-- Retro halftone dots -->
        <rect width="${w}" height="${h}" fill="url(#${dotId})"/>
        <!-- VHS scanlines -->
        ${scanlines}
        <!-- Retro vignette -->
        <rect width="${w}" height="${h * 0.15}" fill="black" opacity="0.2"/>
        <rect y="${h * 0.85}" width="${w}" height="${h * 0.15}" fill="black" opacity="0.2"/>
        <!-- Retro noise line -->
        <rect x="0" y="${h * 0.48}" width="${w}" height="2" fill="white" opacity="0.06"/>`
      return { defs, layers }
    }

    case 'metallic': {
      // Enhanced metallic: brushed texture, specular streak, edge bevel
      const brushId = `${uid}_brush`
      const specId = `${uid}_spec`
      const bevelId = `${uid}_bev`
      const defs = `
        <!-- Brushed metal texture -->
        <filter id="${brushId}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0 0.65" numOctaves="2"
            seed="2" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="brushed"/>
          <feComposite in="brushed" in2="SourceGraphic" operator="in"/>
        </filter>
        <!-- Specular highlight streak -->
        <linearGradient id="${specId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"    stop-color="white" stop-opacity="0"/>
          <stop offset="20%"   stop-color="white" stop-opacity="0"/>
          <stop offset="35%"   stop-color="white" stop-opacity="0.38"/>
          <stop offset="42%"   stop-color="white" stop-opacity="0.55"/>
          <stop offset="50%"   stop-color="white" stop-opacity="0.38"/>
          <stop offset="65%"   stop-color="white" stop-opacity="0"/>
          <stop offset="100%"  stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <!-- Bevel top -->
        <linearGradient id="${bevelId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.35"/>
          <stop offset="6%"   stop-color="white" stop-opacity="0.12"/>
          <stop offset="94%"  stop-color="black" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.3"/>
        </linearGradient>`
      const layers = `
        <!-- Brushed metal texture -->
        <rect width="${w}" height="${h}" fill="white" opacity="0.04" filter="url(#${brushId})"/>
        <!-- Bevel shading -->
        <rect width="${w}" height="${h}" fill="url(#${bevelId})"/>
        <!-- Specular highlight streak -->
        <rect width="${w}" height="${h * 0.28}" fill="url(#${specId})" opacity="0.7"/>
        <!-- Micro top edge highlight -->
        <rect x="0" y="0" width="${w}" height="1.5" fill="white" opacity="0.5"/>
        <!-- Micro bottom edge shadow -->
        <rect x="0" y="${h - 1.5}" width="${w}" height="1.5" fill="black" opacity="0.35"/>
        <!-- Rivet marks -->
        <circle cx="14" cy="${h / 2}" r="3.5" fill="${mainFill}" opacity="0.6" stroke="white" stroke-width="0.8" stroke-opacity="0.3"/>
        <circle cx="24" cy="${h / 2}" r="2"   fill="white"      opacity="0.2"/>
        <circle cx="${w - 14}" cy="${h / 2}" r="3.5" fill="${mainFill}" opacity="0.6" stroke="white" stroke-width="0.8" stroke-opacity="0.3"/>
        <circle cx="${w - 24}" cy="${h / 2}" r="2"   fill="white"      opacity="0.2"/>`
      return { defs, layers }
    }

    case 'gradient':
    case 'minimal':
    default: {
      // Minimal: just a clean top sheen
      const sheenId = `${uid}_msh`
      const defs = `
        <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.05"/>
        </linearGradient>`
      const layers = `
        <rect width="${w}" height="${h}" fill="url(#${sheenId})"/>
        <rect x="0" y="0" width="${w}" height="1" fill="white" opacity="0.2"/>`
      return { defs, layers }
    }
  }
}

// ─── Shape ────────────────────────────────────────────────────────────────────

function buildShape(shape: BannerShape, w: number, h: number, fill: string, uid: string): string {
  switch (shape) {
    case 'wave':
      return `<path d="${wavePath(w, h * 0.72, h * 0.18, 1, 0)} L${w},${h} L0,${h} Z" fill="${fill}"/>
              <rect width="${w}" height="${h * 0.72}" fill="${fill}"/>`

    case 'wave-bottom':
      return `<rect width="${w}" height="${h * 0.28}" fill="${fill}"/>
              <path d="${wavePath(w, h * 0.28, h * 0.18, 1, 0)} L${w},0 L0,0 Z" fill="${fill}"/>`

    case 'venom':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.72}
        Q${w * 0.75},${h} ${w * 0.5},${h * 0.82}
        Q${w * 0.25},${h * 0.65} 0,${h * 0.82} Z" fill="${fill}"/>`

    case 'diagonal':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.75} L0,${h} Z" fill="${fill}"/>`

    case 'slice':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.55} L0,${h} Z" fill="${fill}"/>`

    case 'arch':
      return `<path d="M0,${h} L0,${h * 0.3} Q${w * 0.5},0 ${w},${h * 0.3} L${w},${h} Z" fill="${fill}"/>`

    case 'chevron':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.7} L${w * 0.5},${h} L0,${h * 0.7} Z" fill="${fill}"/>`

    case 'shark':
      return `<path d="M0,0 L${w},0 L${w},${h} L${w * 0.62},${h}
        L${w * 0.5},${h * 0.55} L${w * 0.38},${h} L0,${h} Z" fill="${fill}"/>`

    case 'egg':
      return `<rect width="${w}" height="${h}" rx="${h * 0.5}" fill="${fill}"/>`

    case 'cylinder':
      return `<rect width="${w}" height="${h}" rx="${h * 0.42}" ry="${h * 0.42}" fill="${fill}"/>`

    case 'hexframe': {
      // Hexagonal clipped banner
      const hx = h * 0.14
      return `<path d="M${hx},0 L${w - hx},0 L${w},${h / 2} L${w - hx},${h} L${hx},${h} L0,${h / 2} Z" fill="${fill}"/>`
    }

    case 'torn': {
      // Torn paper edge on bottom — jagged path
      const seg = w / 18
      const tears = Array.from({ length: 19 }, (_, i) => {
        const x = i * seg
        const y = h - (i % 2 === 0 ? h * 0.06 : h * 0.14)
        return `${i === 0 ? 'L' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
      return `<path d="M0,0 L${w},0 L${w},${h * 0.82} ${tears} L0,${h * 0.82} Z" fill="${fill}"/>`
    }

    case 'diamond': {
      // Diamond / rhombus clip (wide lozenge)
      const dip = h * 0.18
      return `<path d="M${dip},0 L${w - dip},0 L${w},${h / 2}
        L${w - dip},${h} L${dip},${h} L0,${h / 2} Z" fill="${fill}"/>`
    }

    case 'ribbon': {
      // Ribbon banner — notched both ends
      const notch = h * 0.22
      return `<path d="M0,0 L${w},0 L${w - notch},${h / 2} L${w},${h}
        L0,${h} L${notch},${h / 2} Z" fill="${fill}"/>`
    }

    case 'circuit': {
      // Rectangle with circuit board corner cutouts
      const c = h * 0.12
      return `<path d="M${c},0 L${w - c},0 L${w},${c} L${w},${h - c}
        L${w - c},${h} L${c},${h} L0,${h - c} L0,${c} Z" fill="${fill}"/>`
    }

    case 'blob': {
      // Organic blob shape using cubic beziers
      const cx = w / 2, cy = h / 2
      const rx = w * 0.52, ry = h * 0.52
      const bx = w * 0.08, by = h * 0.1
      return `<path d="
        M${(cx - rx * 0.1).toFixed(1)},${(cy - ry).toFixed(1)}
        C${(cx + rx * 0.6).toFixed(1)},${(cy - ry - by).toFixed(1)}
          ${(cx + rx + bx).toFixed(1)},${(cy - ry * 0.3).toFixed(1)}
          ${(cx + rx).toFixed(1)},${cy.toFixed(1)}
        C${(cx + rx + bx).toFixed(1)},${(cy + ry * 0.4).toFixed(1)}
          ${(cx + rx * 0.4).toFixed(1)},${(cy + ry + by).toFixed(1)}
          ${(cx).toFixed(1)},${(cy + ry * 0.9).toFixed(1)}
        C${(cx - rx * 0.4).toFixed(1)},${(cy + ry + by * 1.2).toFixed(1)}
          ${(cx - rx - bx).toFixed(1)},${(cy + ry * 0.3).toFixed(1)}
          ${(cx - rx).toFixed(1)},${cy.toFixed(1)}
        C${(cx - rx - bx).toFixed(1)},${(cy - ry * 0.4).toFixed(1)}
          ${(cx - rx * 0.5).toFixed(1)},${(cy - ry - by * 0.8).toFixed(1)}
          ${(cx - rx * 0.1).toFixed(1)},${(cy - ry).toFixed(1)} Z
      " fill="${fill}"/>`
    }

    default: // flat
      return `<rect width="${w}" height="${h}" fill="${fill}"/>`
  }
}

// ─── Border ───────────────────────────────────────────────────────────────────

function buildBorder(
  border: BannerBorder,
  w: number, h: number,
  uid: string,
  mainFill: string,
  borderColor: string,
  borderWidth: number,
  m: typeof METALS[MetalName],
): { defs: string; el: string } {
  const bw = borderWidth
  const r = 10

  switch (border) {
    case 'none':
      return { defs: '', el: '' }

    case 'normal':
      return {
        defs: '',
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.7"/>`,
      }

    case 'metallic': {
      const bMetId = `${uid}_bmet`
      const defs = `
        <linearGradient id="${bMetId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="white"       stop-opacity="0.9"/>
          <stop offset="25%"  stop-color="${borderColor}" stop-opacity="0.8"/>
          <stop offset="50%"  stop-color="white"       stop-opacity="0.6"/>
          <stop offset="75%"  stop-color="${borderColor}" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white"       stop-opacity="0.5"/>
        </linearGradient>`
      return {
        defs,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${bMetId})" stroke-width="${bw}"/>`,
      }
    }

    case 'gradient': {
      const bGradId = `${uid}_bgrad`
      const defs = `
        <linearGradient id="${bGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${mainFill === `url(#${uid}_mg)` ? borderColor : mainFill}" stop-opacity="0"/>
          <stop offset="20%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="80%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${borderColor}" stop-opacity="0"/>
        </linearGradient>`
      return {
        defs,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${bGradId})" stroke-width="${bw}"/>`,
      }
    }

    case 'glow': {
      const bGlowFId = `${uid}_bgf`
      const defs = `
        <filter id="${bGlowFId}" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>`
      return {
        defs,
        el: `
        <rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw * 2}"
          opacity="0.3" filter="url(#${bGlowFId})"/>
        <rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}"/>`,
      }
    }

    case 'neon': {
      const bNeonFId = `${uid}_bnf`
      const defs = `
        <filter id="${bNeonFId}" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" result="blur1"/>
          <feGaussianBlur stdDeviation="8" result="blur2"/>
          <feMerge><feMergeNode in="blur2"/><feMergeNode in="blur1"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>`
      return {
        defs,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}"
          filter="url(#${bNeonFId})">
          <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </rect>`,
      }
    }

    case 'double':
      return {
        defs: '',
        el: `
        <rect x="1" y="1" width="${w - 2}" height="${h - 2}"
          rx="${r + 2}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.4"/>
        <rect x="${bw + 2}" y="${bw + 2}" width="${w - bw * 2 - 4}" height="${h - bw * 2 - 4}"
          rx="${r - 2}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.6"/>
        <rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.8"/>`,
      }

    case 'dashed':
      return {
        defs: '',
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}"
          stroke-dasharray="${bw * 4} ${bw * 2}" opacity="0.75"/>`,
      }

    case 'animated': {
      const bAnimId = `${uid}_banim`
      const perim = (w + h) * 2
      const defs = `
        <linearGradient id="${bAnimId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${borderColor}" stop-opacity="0"/>
          <stop offset="40%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="60%"  stop-color="white"          stop-opacity="1"/>
          <stop offset="100%" stop-color="${borderColor}" stop-opacity="0"/>
        </linearGradient>`
      return {
        defs,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${bAnimId})" stroke-width="${bw}"
          stroke-dasharray="${perim * 0.3} ${perim * 0.7}">
          <animate attributeName="stroke-dashoffset"
            from="${perim}" to="0" dur="3s" repeatCount="indefinite"/>
        </rect>`,
      }
    }

    case 'circuit': {
      const cSize = Math.min(20, h * 0.12)
      return {
        defs: '',
        el: `
        <!-- Circuit border corners -->
        <polyline points="${cSize},2 2,2 2,${cSize}"
          fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="${w - cSize},2 ${w - 2},2 ${w - 2},${cSize}"
          fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="2,${h - cSize} 2,${h - 2} ${cSize},${h - 2}"
          fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="${w - 2},${h - cSize} ${w - 2},${h - 2} ${w - cSize},${h - 2}"
          fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <!-- Circuit dots -->
        <circle cx="${cSize}" cy="2"       r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${w - cSize}" cy="2"   r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${cSize}" cy="${h - 2}" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${w - cSize}" cy="${h - 2}" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <!-- Circuit trace lines -->
        <line x1="${cSize}" y1="2" x2="${w * 0.3}" y2="2"
          stroke="${borderColor}" stroke-width="${bw * 0.5}" opacity="0.4"/>
        <line x1="${w * 0.7}" y1="2" x2="${w - cSize}" y2="2"
          stroke="${borderColor}" stroke-width="${bw * 0.5}" opacity="0.4"/>
        <line x1="${cSize}" y1="${h - 2}" x2="${w * 0.35}" y2="${h - 2}"
          stroke="${borderColor}" stroke-width="${bw * 0.5}" opacity="0.4"/>`,
      }
    }

    default:
      return { defs: '', el: '' }
  }
}

// ─── Animation ────────────────────────────────────────────────────────────────

function buildAnimation(
  anim: BannerAnimation,
  w: number, h: number,
  uid: string,
  fill: string,
): { defs: string; overlay: string; style: string } {

  switch (anim) {
    case 'shimmer': {
      const shimId = `${uid}_shim`
      return {
        defs: `<linearGradient id="${shimId}" x1="0%" y1="0%" x2="100%" y2="0%"
            gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color="white" stop-opacity="0"/>
          <stop offset="45%"  stop-color="white" stop-opacity="0"/>
          <stop offset="50%"  stop-color="white" stop-opacity="0.3"/>
          <stop offset="55%"  stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0">
            <animateTransform attributeName="gradientTransform" type="translate"
              from="${-w * 2} 0" to="${w * 2} 0" dur="3s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>`,
        overlay: `<rect width="${w}" height="${h}" fill="url(#${shimId})" opacity="0.7"/>`,
        style: '',
      }
    }

    case 'pulse':
      return {
        defs: '',
        overlay: `<rect width="${w}" height="${h}" fill="${fill}" opacity="0">
          <animate attributeName="opacity" values="0;0.2;0" dur="2.5s" repeatCount="indefinite"/>
        </rect>`,
        style: '',
      }

    case 'scanline':
      return {
        defs: '',
        overlay: `<rect x="0" y="0" width="${w}" height="2.5" fill="white" opacity="0.18">
          <animateTransform attributeName="transform" type="translate"
            from="0,0" to="0,${h}" dur="2s" repeatCount="indefinite"/>
        </rect>`,
        style: '',
      }

    case 'scan':
      return {
        defs: '',
        overlay: `<rect x="0" y="-6" width="${w}" height="6" fill="white" opacity="0.22">
          <animateTransform attributeName="transform" type="translate"
            from="0,0" to="0,${h + 6}" dur="1.8s" repeatCount="indefinite"/>
        </rect>`,
        style: '',
      }

    case 'fadeIn':
      return {
        defs: '',
        overlay: '',
        style: '@keyframes mf_fadeIn{from{opacity:0}to{opacity:1}}',
      }

    case 'glow': {
      const glowId = `${uid}_ganim`
      return {
        defs: `<radialGradient id="${glowId}" cx="50%" cy="50%" r="55%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.5}">
          <stop offset="0%"   stop-color="${fill}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${fill}" stop-opacity="0"/>
        </radialGradient>`,
        overlay: `<rect width="${w}" height="${h}" fill="url(#${glowId})">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite"/>
        </rect>`,
        style: '',
      }
    }

    case 'twinkling': {
      const dots = [
        [0.12, 0.22], [0.28, 0.68], [0.41, 0.18], [0.55, 0.75], [0.67, 0.30], [0.80, 0.60],
        [0.20, 0.50], [0.35, 0.38], [0.50, 0.55], [0.72, 0.15], [0.88, 0.45], [0.08, 0.80],
        [0.92, 0.25], [0.60, 0.10], [0.45, 0.88], [0.15, 0.60],
      ]
      const sparkles = dots.map(([rx, ry], i) => {
        const cx = (rx * w).toFixed(1)
        const cy = (ry * h).toFixed(1)
        const delay = (i * 0.2).toFixed(2)
        const r = (1.2 + (i % 4) * 0.7).toFixed(1)
        const dur = (2.0 + (i % 3) * 0.5).toFixed(1)
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.95;0" dur="${dur}s"
            begin="${delay}s" repeatCount="indefinite"/>
        </circle>`
      }).join('\n        ')
      return { defs: '', overlay: sparkles, style: '' }
    }

    case 'aurora': {
      const a1 = `${uid}_aa1`, a2 = `${uid}_aa2`
      return {
        defs: `
        <linearGradient id="${a1}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#00ffa0" stop-opacity="0"/>
          <stop offset="40%"  stop-color="#00ffa0" stop-opacity="0.3"/>
          <stop offset="70%"  stop-color="#0080ff" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0080ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-0.6 0" to="0.6 0" dur="5s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>
        <linearGradient id="${a2}" x1="20%" y1="0%" x2="80%" y2="0%">
          <stop offset="0%"   stop-color="#9000ff" stop-opacity="0"/>
          <stop offset="50%"  stop-color="#ff00cc" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#9000ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="0.4 0" to="-0.4 0" dur="7s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>`,
        overlay: `
        <rect width="${w}" height="${h}" fill="url(#${a1})"/>
        <rect width="${w}" height="${h * 0.5}" y="${h * 0.25}" fill="url(#${a2})"/>`,
        style: '',
      }
    }

    case 'glitch': {
      const style = `
        @keyframes mf_glitch1 {
          0%,94%,100%  { clip-path:inset(0 0 ${h * 0.9}px 0); transform:translate(0,0) }
          95%           { clip-path:inset(${h * 0.1}px 0 ${h * 0.5}px 0); transform:translate(-4px,0) }
          97%           { clip-path:inset(${h * 0.5}px 0 ${h * 0.2}px 0); transform:translate(4px,0) }
        }
        @keyframes mf_glitch2 {
          0%,91%,100%  { clip-path:inset(0 0 ${h * 0.95}px 0); transform:translate(0,0); opacity:0 }
          92%           { clip-path:inset(${h * 0.3}px 0 ${h * 0.4}px 0); transform:translate(3px,0); opacity:0.7 }
          94%           { clip-path:inset(${h * 0.6}px 0 0 0); transform:translate(-3px,0); opacity:0.7 }
        }`
      return {
        defs: '',
        overlay: `
        <rect width="${w}" height="${h}" fill="#ff0040" opacity="0"
          style="animation:mf_glitch1 4s infinite"/>
        <rect width="${w}" height="${h}" fill="#00ffff" opacity="0"
          style="animation:mf_glitch2 4s 0.5s infinite"/>`,
        style,
      }
    }

    case 'plasma': {
      const p1 = `${uid}_p1`, p2 = `${uid}_p2`, p3 = `${uid}_p3`
      return {
        defs: `
        <radialGradient id="${p1}" cx="30%" cy="40%" r="50%" gradientUnits="userSpaceOnUse"
          fx="${w * 0.3}" fy="${h * 0.4}">
          <stop offset="0%"   stop-color="#ff0080" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#ff0080" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${-w * 0.1} 0" to="${w * 0.2} 0" dur="4s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>
        <radialGradient id="${p2}" cx="70%" cy="60%" r="45%" gradientUnits="userSpaceOnUse"
          fx="${w * 0.7}" fy="${h * 0.6}">
          <stop offset="0%"   stop-color="#0080ff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0080ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${w * 0.15} 0" to="${-w * 0.1} 0" dur="5s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>
        <radialGradient id="${p3}" cx="50%" cy="20%" r="40%" gradientUnits="userSpaceOnUse"
          fx="${w * 0.5}" fy="${h * 0.2}">
          <stop offset="0%"   stop-color="#a000ff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#a000ff" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="0 ${-h * 0.08}" to="0 ${h * 0.12}" dur="3.5s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>`,
        overlay: `
        <rect width="${w}" height="${h}" fill="url(#${p1})"/>
        <rect width="${w}" height="${h}" fill="url(#${p2})"/>
        <rect width="${w}" height="${h}" fill="url(#${p3})"/>`,
        style: '',
      }
    }

    case 'neonFlicker': {
      const style = `
        @keyframes mf_flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1 }
          20%,22%,24%,55% { opacity: 0.4 }
        }`
      return {
        defs: '',
        overlay: `<rect width="${w}" height="${h}" fill="${fill}" opacity="0.08"
          style="animation:mf_flicker 3s infinite"/>`,
        style,
      }
    }

    default:
      return { defs: '', overlay: '', style: '' }
  }
}

// ─── Text position helper ─────────────────────────────────────────────────────

function getTextY(shape: BannerShape, h: number): number {
  switch (shape) {
    case 'wave':
    case 'venom':
    case 'wave-bottom': return h * 0.38
    case 'arch': return h * 0.62
    case 'ribbon': return h * 0.50
    case 'hexframe':
    case 'diamond': return h * 0.50
    default: return h * 0.48
  }
}

// ─── Main render ──────────────────────────────────────────────────────────────

export function renderBanner(opts: BannerOptions): string {
  const {
    text = '',
    subtext = opts.desc ?? '',
    shape = 'wave',
    height = 200,
    width = 900,
    animation = 'none',
    fontSize,
    subtextSize,
    fontFamily = 'Orbitron',
    subtextFont = 'Rajdhani',
    section = 'header',
    reversal = false,
    textAlign = 'center',
    theme = 'dark',
    style = 'metallic',
    visualStyle = 'metallic',
    border = 'none',
    borderWidth = 2,
  } = opts

  const w = Math.min(Math.max(Number(width), 200), 1200)
  const h = Math.min(Math.max(Number(height), 60), 500)

  const metal = opts.metal ?? 'chrome'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const themeColors = getThemeColors(theme, style)
  const uid = uniqueId('mf')

  // ── Colors ──
  const { fill: mainFill, defs: mainDefs } = buildBannerGradient(opts, w, h)

  // Independent text colors with smart defaults
  const defaultTextColor = theme === 'dark' ? (m.textDark ?? '#ffffff') : (m.textLight ?? '#111111')
  const defaultSubtextColor = m.glow
  const resolvedTextColor = opts.textColor ?? defaultTextColor
  const resolvedSubtextColor = opts.subtextColor ?? defaultSubtextColor
  const borderColor = opts.borderColor ?? m.glow

  // ── Background ──
  const bg = opts.bg ?? themeColors.bg

  // ── Visual style layer ──
  const vs = buildVisualStyle(visualStyle, w, h, uid, mainFill, metal, theme)

  // ── Shape ──
  const shapeEl = buildShape(shape as BannerShape, w, h, mainFill, uid)

  // ── Animation ──
  const anim = buildAnimation(animation as BannerAnimation, w, h, uid, mainFill)

  // ── Border ──
  const bord = buildBorder(border as BannerBorder, w, h, uid, mainFill, borderColor, borderWidth, m)

  // ── Filters ──
  const { id: shadowId, defs: shadowDefs } = buildFilter(
    { shadow: true, shadowDy: 3, shadowBlur: 5, shadowColor: m.shadow, shadowOpacity: 0.65 },
    `${uid}_sh`
  )
  const { id: subtextShadowId, defs: subtextShadowDefs } = buildFilter(
    { shadow: true, shadowDy: 1, shadowBlur: 8, shadowColor: resolvedSubtextColor, shadowOpacity: 0.8 },
    `${uid}_ssh`
  )
  const { id: glowId, defs: glowDefs } = buildFilter(
    { glow: true, glowColor: m.glow },
    `${uid}_gf`
  )

  // ── Typography ──
  const autoFontSize = fontSize ?? Math.max(20, Math.min(58, h * 0.24))
  const autoSubSize = subtextSize ?? Math.max(10, autoFontSize * 0.38)
  const textY = getTextY(shape as BannerShape, h)
  const subY = textY + autoFontSize * 0.78
  const letterSpacing = Math.max(1, autoFontSize * 0.06).toFixed(1)
  const subLetterSpacing = Math.max(1, autoSubSize * 0.12).toFixed(1)

  // ── Text positioning ──
  const txX = textAlign === 'left'
    ? `x="${w * 0.04}"`
    : textAlign === 'right'
      ? `x="${w * 0.96}"`
      : `x="${w / 2}"`
  const anchor = textAlign === 'center' ? 'middle' : textAlign
  const flipXform = (section === 'footer' || reversal)
    ? `transform="scale(1,-1) translate(0,-${h})"`
    : ''
  const fadeStyle = animation === 'fadeIn' ? `style="animation:mf_fadeIn 0.8s ease both"` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${esc(text) || 'Banner'}">
  <title>${esc(text) || 'Banner'}</title>
  <defs>
    ${mainDefs}
    ${shadowDefs}
    ${subtextShadowDefs}
    ${glowDefs}
    ${vs.defs}
    ${anim.defs}
    ${bord.defs}
  </defs>
  ${(anim.style) ? `<style>${anim.style}</style>` : ''}

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="${bg}"/>

  <!-- Shape + visual style -->
  <g ${flipXform}>
    ${shapeEl}
    ${vs.layers}
    ${anim.overlay}
  </g>

  <!-- Border -->
  ${bord.el}

  <!-- Main text -->
  ${text ? `<text ${txX} y="${textY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'${fontFamily}','Arial Black',sans-serif"
    font-size="${autoFontSize}" font-weight="900"
    fill="${resolvedTextColor}"
    filter="url(#${shadowId})"
    letter-spacing="${letterSpacing}"
    ${fadeStyle}
  >${esc(text)}</text>` : ''}

  <!-- Subtext -->
  ${subtext ? `<text ${txX} y="${subY}"
    text-anchor="${anchor}" dominant-baseline="middle"
    font-family="'${subtextFont}','Arial',sans-serif"
    font-size="${autoSubSize}" font-weight="500"
    fill="${resolvedSubtextColor}"
    filter="url(#${subtextShadowId})"
    letter-spacing="${subLetterSpacing}"
    opacity="0.92"
    ${fadeStyle}
  >${esc(subtext)}</text>` : ''}

  <!-- Bottom accent line -->
  <rect x="0" y="${h - 3}" width="${w}" height="3" fill="${mainFill}" opacity="0.55"/>
</svg>`
}