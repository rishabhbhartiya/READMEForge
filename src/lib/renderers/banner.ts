// src/lib/renderers/banner.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, getThemeColors,
  DesignStyle, Theme, uniqueId,
  GradientConfig,
} from '../metals'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerVisualStyle =
  | 'metallic'       // brushed metal with specular streaks + rivets
  | 'glass'          // deep glassmorphism with refraction layers
  | 'neo'            // neumorphic with soft 3D depth
  | 'cyberpunk'      // neon grid + scanlines + corner brackets
  | 'holographic'    // animated rainbow foil iridescence
  | 'aurora'         // flowing northern lights color bands
  | 'neon'           // neon sign with bloom glow + flicker
  | 'minimal'        // ultra-clean with micro-detail
  | 'retro'          // CRT halftone + VHS grain
  | 'gradient'       // rich layered gradient with depth
  | 'circuit'        // PCB circuit board with traces + nodes
  | 'plasma'         // electric plasma energy field
  | 'crystalline'    // geometric faceted crystal surfaces
  | 'void'           // deep space with particle stars
  | 'inferno'        // fire + heat distortion
  | 'matrix'         // falling code rain effect

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
  height?: number
  width?: number
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
  textColor?: string
  subtextColor?: string
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

// ─── Gradient resolver ────────────────────────────────────────────────────────

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

// ─── Visual Style Engine ──────────────────────────────────────────────────────

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

    // ── METALLIC ─────────────────────────────────────────────────────────────
    case 'metallic': {
      const brushId = `${uid}_brush`
      const specId = `${uid}_spec`
      const bevelId = `${uid}_bev`
      const spec2Id = `${uid}_spec2`
      const crossId = `${uid}_cross`

      const defs = `
        <filter id="${brushId}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0 0.75" numOctaves="3"
            seed="5" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
          <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="brushed"/>
          <feComposite in="brushed" in2="SourceGraphic" operator="in"/>
        </filter>
        <linearGradient id="${specId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="white" stop-opacity="0"/>
          <stop offset="18%"  stop-color="white" stop-opacity="0"/>
          <stop offset="28%"  stop-color="white" stop-opacity="0.55"/>
          <stop offset="34%"  stop-color="white" stop-opacity="0.9"/>
          <stop offset="40%"  stop-color="white" stop-opacity="0.55"/>
          <stop offset="55%"  stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${spec2Id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="white" stop-opacity="0"/>
          <stop offset="55%"  stop-color="white" stop-opacity="0"/>
          <stop offset="65%"  stop-color="white" stop-opacity="0.2"/>
          <stop offset="70%"  stop-color="white" stop-opacity="0.35"/>
          <stop offset="75%"  stop-color="white" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${bevelId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.45"/>
          <stop offset="4%"   stop-color="white" stop-opacity="0.18"/>
          <stop offset="50%"  stop-color="white" stop-opacity="0.03"/>
          <stop offset="92%"  stop-color="black" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.38"/>
        </linearGradient>
        <pattern id="${crossId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="20" y1="0" x2="20" y2="40" stroke="white" stroke-width="0.3" opacity="0.06"/>
          <line x1="0" y1="20" x2="40" y2="20" stroke="white" stroke-width="0.3" opacity="0.06"/>
        </pattern>`

      const rivets = [12, w - 12].map(cx =>
        `<circle cx="${cx}" cy="${h / 2}" r="4.5" fill="${mainFill}" stroke="white" stroke-width="1" stroke-opacity="0.4"/>
         <circle cx="${cx}" cy="${h / 2}" r="2"   fill="white" opacity="0.3"/>
         <circle cx="${cx + (cx < w / 2 ? 14 : -14)}" cy="${h / 2}" r="2.8"
           fill="${mainFill}" stroke="white" stroke-width="0.6" stroke-opacity="0.3"/>
         <circle cx="${cx + (cx < w / 2 ? 14 : -14)}" cy="${h / 2}" r="1.2" fill="white" opacity="0.2"/>`
      ).join('')

      const layers = `
        <!-- Brushed metal texture -->
        <rect width="${w}" height="${h}" fill="white" opacity="0.04" filter="url(#${brushId})"/>
        <!-- Crosshatch micro texture -->
        <rect width="${w}" height="${h}" fill="url(#${crossId})"/>
        <!-- Bevel shading -->
        <rect width="${w}" height="${h}" fill="url(#${bevelId})"/>
        <!-- Primary specular streak -->
        <rect width="${w}" height="${h * 0.35}" fill="url(#${specId})" opacity="0.75"/>
        <!-- Secondary specular streak -->
        <rect y="${h * 0.45}" width="${w}" height="${h * 0.2}" fill="url(#${spec2Id})" opacity="0.5"/>
        <!-- Top edge highlight -->
        <rect x="0" y="0"   width="${w}" height="2"   fill="white" opacity="0.55"/>
        <rect x="0" y="2"   width="${w}" height="1"   fill="white" opacity="0.18"/>
        <!-- Bottom edge shadow -->
        <rect x="0" y="${h - 2}" width="${w}" height="2" fill="black" opacity="0.4"/>
        <!-- Left/right edge shadows -->
        <rect x="0" y="0" width="3" height="${h}" fill="black" opacity="0.15"/>
        <rect x="${w - 3}" y="0" width="3" height="${h}" fill="black" opacity="0.15"/>
        <!-- Rivets -->
        ${rivets}`
      return { defs, layers }
    }

    // ── GLASS ─────────────────────────────────────────────────────────────────
    case 'glass': {
      const tintId = `${uid}_gtint`
      const sheenId = `${uid}_gsh`
      const sheen2Id = `${uid}_gsh2`
      const refractId = `${uid}_gref`
      const noiseId = `${uid}_gnoise`
      const rimId = `${uid}_grim`

      const bgBase = theme === 'dark' ? 'rgba(10,15,40,0.6)' : 'rgba(200,220,255,0.4)'

      const defs = `
        <filter id="${noiseId}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.7 0.6" numOctaves="4"
            seed="8" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"
            in="noise" result="whiteNoise"/>
          <feComposite in="whiteNoise" in2="SourceGraphic" operator="in"/>
        </filter>
        <!-- Primary glass tint -->
        <linearGradient id="${tintId}" x1="0%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%"   stop-color="${theme === 'dark' ? '#8899ff' : '#4466cc'}" stop-opacity="0.12"/>
          <stop offset="50%"  stop-color="${theme === 'dark' ? '#ffffff' : '#aaccff'}" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="${theme === 'dark' ? '#2233aa' : '#2244aa'}" stop-opacity="0.14"/>
        </linearGradient>
        <!-- Top sheen — main light reflection -->
        <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="5%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.55"/>
          <stop offset="15%"  stop-color="white" stop-opacity="0.25"/>
          <stop offset="35%"  stop-color="white" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <!-- Angled internal refraction stripe -->
        <linearGradient id="${refractId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0"/>
          <stop offset="30%"  stop-color="white" stop-opacity="0"/>
          <stop offset="42%"  stop-color="white" stop-opacity="0.18"/>
          <stop offset="48%"  stop-color="white" stop-opacity="0.28"/>
          <stop offset="54%"  stop-color="white" stop-opacity="0.18"/>
          <stop offset="70%"  stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <!-- Bottom inner sheen -->
        <linearGradient id="${sheen2Id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="black"  stop-opacity="0"/>
          <stop offset="70%"  stop-color="black"  stop-opacity="0"/>
          <stop offset="90%"  stop-color="black"  stop-opacity="0.18"/>
          <stop offset="100%" stop-color="black"  stop-opacity="0.35"/>
        </linearGradient>
        <!-- Rim light gradient -->
        <linearGradient id="${rimId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"    stop-color="white" stop-opacity="0.6"/>
          <stop offset="8%"    stop-color="white" stop-opacity="0.1"/>
          <stop offset="92%"   stop-color="white" stop-opacity="0.1"/>
          <stop offset="100%"  stop-color="white" stop-opacity="0.55"/>
        </linearGradient>`

      const layers = `
        <!-- Glass base backdrop -->
        <rect width="${w}" height="${h}" fill="${bgBase}"/>
        <!-- Color tint -->
        <rect width="${w}" height="${h}" fill="url(#${tintId})"/>
        <!-- Frost noise texture -->
        <rect width="${w}" height="${h}" fill="white" opacity="1" filter="url(#${noiseId})"/>
        <!-- Top sheen panel -->
        <rect width="${w}" height="${h * 0.6}" fill="url(#${sheenId})"/>
        <!-- Diagonal refraction stripe -->
        <rect width="${w}" height="${h}" fill="url(#${refractId})"/>
        <!-- Bottom darkening -->
        <rect width="${w}" height="${h}" fill="url(#${sheen2Id})"/>
        <!-- Top edge bright line -->
        <rect x="2" y="1"   width="${w - 4}" height="1.5" fill="white" opacity="0.75" rx="0.75"/>
        <!-- Left edge rim -->
        <rect x="1" y="2"   width="1.5" height="${h - 4}" fill="white" opacity="0.35" rx="0.75"/>
        <!-- Right edge rim -->
        <rect x="${w - 2.5}" y="2" width="1.5" height="${h - 4}" fill="white" opacity="0.2" rx="0.75"/>
        <!-- Bottom edge shadow line -->
        <rect x="2" y="${h - 2}" width="${w - 4}" height="1.5" fill="black" opacity="0.4" rx="0.75"/>
        <!-- Rim light (L+R) -->
        <rect width="${w}" height="${h}" fill="url(#${rimId})" opacity="0.5"/>
        <!-- Subtle color bleed from main fill -->
        <rect width="${w}" height="${h}" fill="${mainFill}" opacity="0.07"/>`
      return { defs, layers }
    }

    // ── NEO ───────────────────────────────────────────────────────────────────
    case 'neo': {
      const baseCol = theme === 'dark' ? '#1a1f35' : '#dde3ee'
      const lightCol = theme === 'dark' ? '#2a3050' : '#ffffff'
      const darkCol = theme === 'dark' ? '#0c0e1a' : '#a0aabf'
      const surfId = `${uid}_nsurf`
      const bumpId = `${uid}_nbump`
      const innerGlowId = `${uid}_nigl`

      const defs = `
        <filter id="${uid}_neo_L" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="-6" dy="-6" stdDeviation="8"
            flood-color="${lightCol}" flood-opacity="0.75"/>
        </filter>
        <filter id="${uid}_neo_D" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="6" dy="6" stdDeviation="8"
            flood-color="${darkCol}" flood-opacity="0.8"/>
        </filter>
        <filter id="${uid}_neo_inner" x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feOffset dx="1" dy="1"/>
          <feComposite in="SourceGraphic" operator="over"/>
        </filter>
        <linearGradient id="${surfId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="${lightCol}" stop-opacity="0.2"/>
          <stop offset="50%"  stop-color="${baseCol}"  stop-opacity="0"/>
          <stop offset="100%" stop-color="${darkCol}"  stop-opacity="0.15"/>
        </linearGradient>
        <radialGradient id="${innerGlowId}" cx="50%" cy="40%" r="55%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.4}">
          <stop offset="0%"   stop-color="${m.glow}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${m.glow}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${bumpId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.22"/>
          <stop offset="8%"   stop-color="white" stop-opacity="0.06"/>
          <stop offset="50%"  stop-color="white" stop-opacity="0"/>
          <stop offset="92%"  stop-color="black" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.18"/>
        </linearGradient>`

      const layers = `
        <!-- Neo base fill -->
        <rect width="${w}" height="${h}" fill="${baseCol}"/>
        <!-- Light shadow (top-left) -->
        <rect width="${w}" height="${h}" fill="none" filter="url(#${uid}_neo_L)"/>
        <!-- Dark shadow (bottom-right) -->
        <rect width="${w}" height="${h}" fill="none" filter="url(#${uid}_neo_D)"/>
        <!-- Surface gradient -->
        <rect width="${w}" height="${h}" fill="url(#${surfId})"/>
        <!-- Inner glow from metal color -->
        <rect width="${w}" height="${h}" fill="url(#${innerGlowId})"/>
        <!-- Surface bump / bevel -->
        <rect width="${w}" height="${h}" fill="url(#${bumpId})"/>
        <!-- Top-left corner light catch -->
        <rect x="8" y="8"  width="${w * 0.45}" height="1.8" rx="0.9" fill="white" opacity="0.28"/>
        <rect x="8" y="8"  width="1.8" height="${h * 0.32}" rx="0.9" fill="white" opacity="0.2"/>
        <!-- Bottom-right corner shadow -->
        <rect x="${w * 0.55}" y="${h - 9}" width="${w * 0.4}" height="1.8" rx="0.9" fill="black" opacity="0.2"/>
        <!-- Metal color accent ring -->
        <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="8"
          fill="none" stroke="${m.glow}" stroke-width="1" opacity="0.15"/>
        <!-- Inset shadow line top -->
        <rect x="0" y="0" width="${w}" height="3" fill="${darkCol}" opacity="0.4"/>
        <!-- Inset shadow line left -->
        <rect x="0" y="0" width="3" height="${h}" fill="${darkCol}" opacity="0.3"/>`
      return { defs, layers }
    }

    // ── CYBERPUNK ─────────────────────────────────────────────────────────────
    case 'cyberpunk': {
      const gridId = `${uid}_cpg`
      const scanId = `${uid}_cps`
      const leakBId = `${uid}_cplb`
      const leakTId = `${uid}_cplt`
      const hexPat = `${uid}_cphex`

      const defs = `
        <!-- Fine grid pattern -->
        <pattern id="${gridId}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="${m.glow}" stroke-width="0.25" opacity="0.22"/>
        </pattern>
        <!-- Hex pattern overlay -->
        <pattern id="${hexPat}" x="0" y="0" width="32" height="28" patternUnits="userSpaceOnUse">
          <path d="M16,1 L28,8 L28,20 L16,27 L4,20 L4,8 Z"
            fill="none" stroke="${m.glow}" stroke-width="0.3" opacity="0.1"/>
        </pattern>
        <!-- Bottom neon leak -->
        <linearGradient id="${leakBId}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"  stop-color="${m.glow}" stop-opacity="0.35"/>
          <stop offset="50%" stop-color="${m.glow}" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="${m.glow}" stop-opacity="0"/>
        </linearGradient>
        <!-- Top neon leak -->
        <linearGradient id="${leakTId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stop-color="${m.glow}" stop-opacity="0.2"/>
          <stop offset="40%" stop-color="${m.glow}" stop-opacity="0"/>
        </linearGradient>
        <!-- Scanline fade -->
        <linearGradient id="${scanId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="black" stop-opacity="0.15"/>
          <stop offset="50%"  stop-color="black" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.15"/>
        </linearGradient>`

      const scanlines = Array.from({ length: Math.ceil(h / 3) }, (_, i) =>
        `<line x1="0" y1="${i * 3 + 1}" x2="${w}" y2="${i * 3 + 1}"
          stroke="black" stroke-width="0.7" opacity="0.1"/>`
      ).join('')

      // Data readout strips
      const dataStrips = [0.15, 0.85].map(fy => {
        const y = h * fy
        return `<rect x="0" y="${y - 0.75}" width="${w}" height="1.5"
          fill="${m.glow}" opacity="0.35"/>
        <rect x="0" y="${y - 2.5}" width="${w * 0.6}" height="1"
          fill="${m.glow}" opacity="0.15"/>
        <rect x="${w * 0.65}" y="${y - 2.5}" width="${w * 0.2}" height="1"
          fill="${m.glow}" opacity="0.1"/>`
      }).join('')

      // Corner brackets — larger, more complex
      const bracketSize = Math.min(28, h * 0.18)
      const brackets = [
        [0, 0, 1, 1],
        [w, 0, -1, 1],
        [0, h, 1, -1],
        [w, h, -1, -1],
      ].map(([bx, by, sx, sy]) =>
        `<polyline points="${bx + sx * bracketSize},${by} ${bx},${by} ${bx},${by + sy * bracketSize}"
          fill="none" stroke="${m.glow}" stroke-width="2.5" opacity="0.9"/>
         <polyline points="${bx + sx * (bracketSize * 0.45)},${by + sy * 2} ${bx + sx * 2},${by + sy * 2} ${bx + sx * 2},${by + sy * (bracketSize * 0.45)}"
          fill="none" stroke="${m.glow}" stroke-width="1" opacity="0.45"/>`
      ).join('')

      // Vertical accent lines
      const vLines = [0.25, 0.75].map(fx =>
        `<line x1="${w * fx}" y1="0" x2="${w * fx}" y2="${h}"
          stroke="${m.glow}" stroke-width="0.5" opacity="0.12"/>`
      ).join('')

      const layers = `
        <!-- Grid base -->
        <rect width="${w}" height="${h}" fill="url(#${gridId})"/>
        <!-- Hex overlay -->
        <rect width="${w}" height="${h}" fill="url(#${hexPat})"/>
        <!-- Scanlines -->
        ${scanlines}
        <!-- Scanline gradient fade -->
        <rect width="${w}" height="${h}" fill="url(#${scanId})"/>
        <!-- Bottom neon leak -->
        <rect width="${w}" height="${h}" fill="url(#${leakBId})"/>
        <!-- Top neon leak -->
        <rect width="${w}" height="${h * 0.3}" fill="url(#${leakTId})"/>
        <!-- Data strips -->
        ${dataStrips}
        <!-- Vertical accent lines -->
        ${vLines}
        <!-- Corner brackets -->
        ${brackets}
        <!-- Center horizontal accent -->
        <rect x="${w * 0.08}" y="${h * 0.5 - 0.4}" width="${w * 0.84}" height="0.8"
          fill="${m.glow}" opacity="0.08"/>
        <!-- Side nodes -->
        <circle cx="3" cy="${h * 0.5}" r="4" fill="${m.glow}" opacity="0.6"/>
        <circle cx="${w - 3}" cy="${h * 0.5}" r="4" fill="${m.glow}" opacity="0.6"/>
        <circle cx="3" cy="${h * 0.5}" r="2" fill="white" opacity="0.5"/>
        <circle cx="${w - 3}" cy="${h * 0.5}" r="2" fill="white" opacity="0.5"/>`
      return { defs, layers }
    }

    // ── HOLOGRAPHIC ───────────────────────────────────────────────────────────
    case 'holographic': {
      const holoId = `${uid}_holo`
      const foilId = `${uid}_foil`
      const shiftId = `${uid}_hshift`
      const microId = `${uid}_hmic`
      const prismId = `${uid}_hpri`

      const defs = `
        <!-- Full spectrum holo gradient (animated) -->
        <linearGradient id="${holoId}" x1="0%" y1="0%" x2="100%" y2="100%"
            gradientUnits="userSpaceOnUse">
          <stop offset="0%"    stop-color="#ff0080" stop-opacity="0.4"/>
          <stop offset="14%"   stop-color="#ff4400" stop-opacity="0.35"/>
          <stop offset="28%"   stop-color="#ffe000" stop-opacity="0.35"/>
          <stop offset="42%"   stop-color="#00e676" stop-opacity="0.35"/>
          <stop offset="57%"   stop-color="#00b4ff" stop-opacity="0.4"/>
          <stop offset="71%"   stop-color="#7c4dff" stop-opacity="0.4"/>
          <stop offset="85%"   stop-color="#e040fb" stop-opacity="0.38"/>
          <stop offset="100%"  stop-color="#ff0080" stop-opacity="0.35"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-${w} -${h}" to="${w} ${h}" dur="6s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>
        <!-- Prismatic diagonal bands -->
        <linearGradient id="${prismId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"    stop-color="white" stop-opacity="0"/>
          <stop offset="15%"   stop-color="#ff80ab" stop-opacity="0.15"/>
          <stop offset="30%"   stop-color="#80d8ff" stop-opacity="0.12"/>
          <stop offset="45%"   stop-color="#ccff90" stop-opacity="0.12"/>
          <stop offset="60%"   stop-color="#ea80fc" stop-opacity="0.15"/>
          <stop offset="75%"   stop-color="#ffff8d" stop-opacity="0.12"/>
          <stop offset="100%"  stop-color="white"   stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-1 0" to="1 0" dur="3s" repeatCount="indefinite" additive="sum"/>
        </linearGradient>
        <!-- Foil sheen -->
        <linearGradient id="${foilId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.5"/>
          <stop offset="25%"  stop-color="white" stop-opacity="0.12"/>
          <stop offset="55%"  stop-color="black" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.18"/>
        </linearGradient>
        <!-- Color shift layer -->
        <linearGradient id="${shiftId}" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#ff1744" stop-opacity="0.08"/>
          <stop offset="33%"  stop-color="#00e5ff" stop-opacity="0.08"/>
          <stop offset="66%"  stop-color="#d500f9" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#ffea00" stop-opacity="0.08"/>
        </linearGradient>
        <!-- Micro diamond pattern -->
        <pattern id="${microId}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M3,0 L6,3 L3,6 L0,3 Z" fill="none" stroke="white" stroke-width="0.2" opacity="0.12"/>
        </pattern>`

      // Sparkle dots — more of them, better distributed
      const sparkles = Array.from({ length: 32 }, (_, i) => {
        const cx = ((i * 137.508) % 100) / 100 * w
        const cy = ((i * 61.803) % 100) / 100 * h
        const r = 0.8 + (i % 4) * 0.6
        const hue = (i * 53 + 20) % 360
        const dur = (1.0 + (i % 5) * 0.4).toFixed(1)
        const begin = (i * 0.15).toFixed(2)
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="hsl(${hue},100%,85%)" opacity="0">
          <animate attributeName="opacity" values="0;0.95;0" dur="${dur}s"
            begin="${begin}s" repeatCount="indefinite"/>
          <animate attributeName="r" values="${r};${r * 1.8};${r}" dur="${dur}s"
            begin="${begin}s" repeatCount="indefinite"/>
        </circle>`
      }).join('')

      const layers = `
        <!-- Micro diamond texture -->
        <rect width="${w}" height="${h}" fill="url(#${microId})"/>
        <!-- Color shift layer -->
        <rect width="${w}" height="${h}" fill="url(#${shiftId})"/>
        <!-- Full spectrum holo gradient -->
        <rect width="${w}" height="${h}" fill="url(#${holoId})"/>
        <!-- Prismatic bands -->
        <rect width="${w}" height="${h}" fill="url(#${prismId})"/>
        <!-- Foil sheen -->
        <rect width="${w}" height="${h}" fill="url(#${foilId})"/>
        <!-- Top edge light -->
        <rect x="2" y="1" width="${w - 4}" height="2" fill="white" opacity="0.6" rx="1"/>
        <!-- Sparkle particles -->
        ${sparkles}`
      return { defs, layers }
    }

    // ── AURORA ────────────────────────────────────────────────────────────────
    case 'aurora': {
      const ids = Array.from({ length: 6 }, (_, i) => `${uid}_aur${i}`)
      const starPat = `${uid}_stars`

      const bands = [
        { color: '#00ffa0', opacity: 0.38, cy: 0.3, dur: 7, phase: 0 },
        { color: '#0080ff', opacity: 0.3, cy: 0.55, dur: 9, phase: 0.3 },
        { color: '#ff00cc', opacity: 0.28, cy: 0.45, dur: 11, phase: 0.15 },
        { color: '#00ffff', opacity: 0.22, cy: 0.65, dur: 6, phase: 0.5 },
        { color: '#8000ff', opacity: 0.25, cy: 0.35, dur: 8, phase: 0.7 },
        { color: '#ff8000', opacity: 0.15, cy: 0.25, dur: 13, phase: 0.2 },
      ]

      const defs = bands.map((b, i) => `
        <radialGradient id="${ids[i]}" cx="50%" cy="${b.cy * 100}%" r="60%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * b.cy}">
          <stop offset="0%"   stop-color="${b.color}" stop-opacity="${b.opacity}"/>
          <stop offset="60%"  stop-color="${b.color}" stop-opacity="${b.opacity * 0.3}"/>
          <stop offset="100%" stop-color="${b.color}" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${-w * 0.25} 0" to="${w * 0.25} 0"
            dur="${b.dur}s" begin="${b.phase}s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>`
      ).join('') + `
        <pattern id="${starPat}" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          ${Array.from({ length: 8 }, (_, i) => {
        const sx = ((i * 77.3) % 80).toFixed(1)
        const sy = ((i * 53.1) % 80).toFixed(1)
        const sr = (0.5 + (i % 3) * 0.4).toFixed(1)
        return `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="white" opacity="${0.2 + (i % 4) * 0.15}"/>`
      }).join('')}
        </pattern>`

      const layers = `
        <!-- Star field base -->
        <rect width="${w}" height="${h}" fill="url(#${starPat})" opacity="0.7"/>
        <!-- Aurora bands -->
        ${bands.map((_, i) => `<rect width="${w}" height="${h}" fill="url(#${ids[i]})"/>`).join('\n        ')}
        <!-- Ground glow -->
        <rect width="${w}" height="${h * 0.3}" y="${h * 0.7}"
          fill="url(#${ids[0]})" opacity="0.3"/>
        <!-- Top vignette -->
        <rect width="${w}" height="${h * 0.25}" fill="black" opacity="0.3"/>`
      return { defs, layers }
    }

    // ── NEON ──────────────────────────────────────────────────────────────────
    case 'neon': {
      const bloomId = `${uid}_nbloom`
      const glowId = `${uid}_nglow`
      const tubeId = `${uid}_ntube`
      const reflId = `${uid}_nrefl`

      const defs = `
        <!-- Bloom filter -->
        <filter id="${bloomId}" x="-20%" y="-20%" width="140%" height="140%"
            color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="8"  result="b1"/>
          <feGaussianBlur stdDeviation="16" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <!-- Tight glow filter -->
        <filter id="${glowId}" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <!-- Neon tube gradient (the colored glass cylinder) -->
        <linearGradient id="${tubeId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white"   stop-opacity="0.7"/>
          <stop offset="15%"  stop-color="${m.glow}" stop-opacity="0.5"/>
          <stop offset="50%"  stop-color="${m.glow}" stop-opacity="0.9"/>
          <stop offset="85%"  stop-color="${m.glow}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="white"   stop-opacity="0.3"/>
        </linearGradient>
        <!-- Floor reflection -->
        <linearGradient id="${reflId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="${m.glow}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${m.glow}" stop-opacity="0"/>
        </linearGradient>`

      // Neon tube lines
      const tubeH = Math.max(3, h * 0.055)
      const tubes = [h * 0.18, h * 0.82].map(ty =>
        `<!-- Neon tube at y=${ty.toFixed(0)} -->
        <rect x="0" y="${ty - tubeH / 2}" width="${w}" height="${tubeH}"
          fill="url(#${tubeId})" filter="url(#${bloomId})" opacity="0.85">
          <animate attributeName="opacity"
            values="0.7;1;0.85;1;0.7" dur="3.2s" repeatCount="indefinite"/>
        </rect>
        <!-- Tube core line -->
        <rect x="0" y="${ty - 0.8}" width="${w}" height="1.6"
          fill="white" opacity="0.9" filter="url(#${glowId})"/>
        <!-- Floor reflection below tube -->
        <rect x="0" y="${ty + tubeH / 2}" width="${w}" height="${h * 0.12}"
          fill="url(#${reflId})"/>`
      ).join('')

      // Vertical neon accents
      const vNeons = [w * 0.05, w * 0.95].map(nx =>
        `<rect x="${nx - 1.5}" y="${h * 0.18}" width="3" height="${h * 0.64}"
          fill="url(#${tubeId})" filter="url(#${bloomId})" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.5;0.8;0.4"
            dur="2.8s" begin="${nx > w / 2 ? '1.4' : '0'}s" repeatCount="indefinite"/>
        </rect>`
      ).join('')

      const layers = `
        <!-- Dark background for neon to pop -->
        <rect width="${w}" height="${h}" fill="rgba(0,0,0,0.55)"/>
        <!-- Ambient glow from metal fill -->
        <rect width="${w}" height="${h}" fill="${mainFill}" opacity="0.06"
          filter="url(#${bloomId})"/>
        <!-- Neon tubes -->
        ${tubes}
        <!-- Vertical neon accents -->
        ${vNeons}
        <!-- Center side dots -->
        <circle cx="6" cy="${h * 0.5}" r="5" fill="${m.glow}"
          filter="url(#${bloomId})" opacity="0.8">
          <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="${w - 6}" cy="${h * 0.5}" r="5" fill="${m.glow}"
          filter="url(#${bloomId})" opacity="0.8">
          <animate attributeName="r" values="5;4;6;4;5" dur="2.2s" repeatCount="indefinite"/>
        </circle>`
      return { defs, layers }
    }

    // ── MINIMAL ───────────────────────────────────────────────────────────────
    case 'minimal': {
      const sheenId = `${uid}_msh`
      const accentId = `${uid}_mac`
      const microDotId = `${uid}_mmd`
      const dividerX = w * 0.08

      const defs = `
        <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.18"/>
          <stop offset="30%"  stop-color="white" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.06"/>
        </linearGradient>
        <linearGradient id="${accentId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${m.glow}" stop-opacity="0.8"/>
          <stop offset="60%"  stop-color="${m.glow}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${m.glow}" stop-opacity="0"/>
        </linearGradient>
        <pattern id="${microDotId}" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="0.7" fill="white" opacity="0.08"/>
        </pattern>`

      const layers = `
        <!-- Micro dot texture -->
        <rect width="${w}" height="${h}" fill="url(#${microDotId})"/>
        <!-- Sheen gradient -->
        <rect width="${w}" height="${h}" fill="url(#${sheenId})"/>
        <!-- Top edge line -->
        <rect x="0" y="0" width="${w}" height="1.5" fill="white" opacity="0.25"/>
        <!-- Bottom edge line -->
        <rect x="0" y="${h - 1.5}" width="${w}" height="1.5" fill="white" opacity="0.1"/>
        <!-- Left accent bar -->
        <rect x="0" y="0" width="4" height="${h}" fill="${m.glow}" opacity="0.55"/>
        <rect x="0" y="0" width="4" height="${h}" fill="white" opacity="0.1"/>
        <!-- Accent divider line with fade -->
        <rect x="${dividerX}" y="${h * 0.28}" width="${w * 0.84}" height="0.75"
          fill="url(#${accentId})"/>
        <!-- Right side subtle accent -->
        <rect x="${w - 4}" y="0" width="4" height="${h}" fill="${m.glow}" opacity="0.2"/>
        <!-- Notch marks on bottom -->
        ${[0.2, 0.4, 0.6, 0.8].map(fx =>
        `<rect x="${w * fx - 0.5}" y="${h - 4}" width="1" height="4"
            fill="${m.glow}" opacity="0.5"/>`
      ).join('')}`
      return { defs, layers }
    }

    // ── RETRO ─────────────────────────────────────────────────────────────────
    case 'retro': {
      const dotId = `${uid}_rdot`
      const vhsId = `${uid}_rvhs`
      const chromId = `${uid}_rch`

      const defs = `
        <!-- Halftone dot pattern -->
        <pattern id="${dotId}" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.8" fill="${m.glow}" opacity="0.28"/>
        </pattern>
        <!-- VHS tracking noise gradient -->
        <linearGradient id="${vhsId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="black"  stop-opacity="0.25"/>
          <stop offset="12%"  stop-color="black"  stop-opacity="0.05"/>
          <stop offset="25%"  stop-color="white"  stop-opacity="0.03"/>
          <stop offset="38%"  stop-color="black"  stop-opacity="0.08"/>
          <stop offset="51%"  stop-color="black"  stop-opacity="0.02"/>
          <stop offset="63%"  stop-color="white"  stop-opacity="0.04"/>
          <stop offset="76%"  stop-color="black"  stop-opacity="0.07"/>
          <stop offset="90%"  stop-color="black"  stop-opacity="0.04"/>
          <stop offset="100%" stop-color="black"  stop-opacity="0.2"/>
        </linearGradient>
        <!-- Chromatic aberration offset gradient -->
        <linearGradient id="${chromId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#ff0040" stop-opacity="0.12"/>
          <stop offset="50%"  stop-color="black"   stop-opacity="0"/>
          <stop offset="100%" stop-color="#00ffff" stop-opacity="0.12"/>
        </linearGradient>`

      const scanlines = Array.from({ length: Math.ceil(h / 2.5) }, (_, i) =>
        `<rect x="0" y="${(i * 2.5).toFixed(1)}" width="${w}" height="1.2"
          fill="black" opacity="0.09"/>`
      ).join('')

      // Horizontal tracking glitch lines
      const glitchLines = [0.2, 0.47, 0.73].map(fy =>
        `<rect x="0" y="${h * fy}" width="${w * (0.3 + (fy * 0.5))}" height="${h * 0.008}"
          fill="white" opacity="0.12"/>
        <rect x="0" y="${h * fy + h * 0.008}" width="${w * (0.2 + fy * 0.3)}" height="${h * 0.004}"
          fill="${m.glow}" opacity="0.18"/>`
      ).join('')

      const layers = `
        <!-- Halftone dots -->
        <rect width="${w}" height="${h}" fill="url(#${dotId})"/>
        <!-- Scanlines -->
        ${scanlines}
        <!-- VHS grain -->
        <rect width="${w}" height="${h}" fill="url(#${vhsId})"/>
        <!-- Chromatic aberration -->
        <rect width="${w}" height="${h}" fill="url(#${chromId})"/>
        <!-- Vignette top/bottom -->
        <rect x="0" y="0"          width="${w}" height="${h * 0.12}" fill="black" opacity="0.3"/>
        <rect x="0" y="${h * 0.88}"  width="${w}" height="${h * 0.12}" fill="black" opacity="0.3"/>
        <!-- Tracking glitch lines -->
        ${glitchLines}
        <!-- Date stamp box (retro camcorder) -->
        <rect x="${w - 120}" y="${h - 28}" width="112" height="20" rx="2"
          fill="black" opacity="0.55"/>
        <text x="${w - 64}" y="${h - 14}" text-anchor="middle" font-family="monospace"
          font-size="10" fill="${m.glow}" opacity="0.8">REC ● 00:00:00</text>`
      return { defs, layers }
    }

    // ── GRADIENT ──────────────────────────────────────────────────────────────
    case 'gradient': {
      const depthId = `${uid}_gdep`
      const vignId = `${uid}_gvig`
      const lightId = `${uid}_glit`
      const grainId = `${uid}_ggr`
      const rimLId = `${uid}_grl`

      const defs = `
        <!-- Radial depth -->
        <radialGradient id="${depthId}" cx="50%" cy="45%" r="65%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.45}">
          <stop offset="0%"   stop-color="white" stop-opacity="0.18"/>
          <stop offset="50%"  stop-color="white" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.22"/>
        </radialGradient>
        <!-- Vignette -->
        <radialGradient id="${vignId}" cx="50%" cy="50%" r="70%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.5}">
          <stop offset="0%"   stop-color="black" stop-opacity="0"/>
          <stop offset="70%"  stop-color="black" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.45"/>
        </radialGradient>
        <!-- Top light source -->
        <radialGradient id="${lightId}" cx="50%" cy="0%" r="60%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="0">
          <stop offset="0%"   stop-color="white" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <!-- Film grain filter -->
        <filter id="${grainId}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"
            seed="15" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
          <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="out"/>
          <feComposite in="out" in2="SourceGraphic" operator="in"/>
        </filter>
        <!-- Side rim lights -->
        <linearGradient id="${rimLId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="white" stop-opacity="0.3"/>
          <stop offset="6%"   stop-color="white" stop-opacity="0"/>
          <stop offset="94%"  stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0.25"/>
        </linearGradient>`

      const layers = `
        <!-- Radial light depth -->
        <rect width="${w}" height="${h}" fill="url(#${depthId})"/>
        <!-- Film grain -->
        <rect width="${w}" height="${h}" fill="white" opacity="0.035" filter="url(#${grainId})"/>
        <!-- Top light source -->
        <rect width="${w}" height="${h}" fill="url(#${lightId})"/>
        <!-- Rim lights (sides) -->
        <rect width="${w}" height="${h}" fill="url(#${rimLId})"/>
        <!-- Vignette -->
        <rect width="${w}" height="${h}" fill="url(#${vignId})"/>
        <!-- Top edge catch -->
        <rect x="0" y="0" width="${w}" height="1.5" fill="white" opacity="0.3"/>
        <!-- Bottom edge shadow -->
        <rect x="0" y="${h - 2}" width="${w}" height="2" fill="black" opacity="0.3"/>`
      return { defs, layers }
    }

    // ── CIRCUIT ───────────────────────────────────────────────────────────────
    case 'circuit': {
      const pcbId = `${uid}_pcb`
      const traceGlow = `${uid}_tcg`

      // Generate pseudo-random but deterministic traces
      const seed = (n: number, mod: number) => ((n * 1664525 + 1013904223) & 0x7fffffff) % mod
      const traces: string[] = []
      const nodes: string[] = []

      for (let i = 0; i < 22; i++) {
        const x1 = seed(i * 7, w)
        const y1 = seed(i * 13, h)
        const dir = seed(i * 3, 4) // 0=H, 1=V, 2=diagonal-ish
        let x2: number, y2: number

        if (dir === 0) {
          x2 = Math.min(w, x1 + seed(i * 5, w * 0.35))
          y2 = y1
        } else if (dir === 1) {
          x2 = x1
          y2 = Math.min(h, y1 + seed(i * 11, h * 0.5))
        } else {
          const len = seed(i * 9, Math.min(w, h) * 0.25)
          x2 = x1 + len
          y2 = y1 + len
        }
        const op = (0.12 + (i % 5) * 0.06).toFixed(2)
        traces.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${m.glow}" stroke-width="${dir === 0 ? 1.2 : 0.8}" opacity="${op}"/>`)

        // Nodes at endpoints
        if (i % 3 === 0) {
          const nr = 2 + (i % 3)
          nodes.push(`<circle cx="${x2}" cy="${y2}" r="${nr}"
            fill="none" stroke="${m.glow}" stroke-width="1" opacity="${Number(op) + 0.1}"/>`)
          nodes.push(`<circle cx="${x2}" cy="${y2}" r="${nr * 0.4}"
            fill="${m.glow}" opacity="${Number(op) * 1.5}"/>`)
        }
        // IC chip rectangles
        if (i % 6 === 0) {
          const cw = 18 + seed(i, 30), ch = 12 + seed(i * 2, 18)
          const cx = seed(i * 4, w - cw), cy = seed(i * 8, h - ch)
          traces.push(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}"
            fill="none" stroke="${m.glow}" stroke-width="0.8" opacity="${Number(op) * 0.8}" rx="1"/>`)
          // Chip pins
          for (let p = 0; p < 3; p++) {
            traces.push(`<line x1="${cx + p * 6 + 3}" y1="${cy}" x2="${cx + p * 6 + 3}" y2="${cy - 4}"
              stroke="${m.glow}" stroke-width="0.8" opacity="${Number(op) * 0.7}"/>`)
          }
        }
      }

      const defs = `
        <filter id="${traceGlow}" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <pattern id="${pcbId}" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="none" stroke="${m.glow}" stroke-width="0.2" opacity="0.06"/>
        </pattern>`

      const layers = `
        <!-- PCB grid -->
        <rect width="${w}" height="${h}" fill="url(#${pcbId})"/>
        <!-- Traces -->
        <g filter="url(#${traceGlow})">
          ${traces.join('\n          ')}
          ${nodes.join('\n          ')}
        </g>
        <!-- PCB corner connectors -->
        ${[0, w - 32].map(bx =>
        `<rect x="${bx}" y="${h / 2 - 8}" width="32" height="16" rx="2"
            fill="none" stroke="${m.glow}" stroke-width="1" opacity="0.4"/>
           <line x1="${bx === 0 ? 0 : w}" y1="${h / 2}" x2="${bx === 0 ? 32 : w - 32}" y2="${h / 2}"
            stroke="${m.glow}" stroke-width="2" opacity="0.5"/>`
      ).join('')}
        <!-- Subtle overlay sheen -->
        <rect width="${w}" height="${h * 0.4}" fill="black" opacity="0.08"/>
        <rect y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="black" opacity="0.1"/>`
      return { defs, layers }
    }

    // ── PLASMA ────────────────────────────────────────────────────────────────
    case 'plasma': {
      const plasmaIds = Array.from({ length: 5 }, (_, i) => `${uid}_plm${i}`)
      const arcId = `${uid}_plmarc`

      const blobs = [
        { cx: 0.25, cy: 0.4, r: 0.55, color: '#ff0080', dur: 4.5, dx: 0.18 },
        { cx: 0.75, cy: 0.6, r: 0.5, color: '#0040ff', dur: 5.5, dx: -0.15 },
        { cx: 0.5, cy: 0.2, r: 0.45, color: '#8000ff', dur: 3.8, dx: 0.12 },
        { cx: 0.15, cy: 0.75, r: 0.4, color: '#00ffcc', dur: 6.2, dx: 0.2 },
        { cx: 0.85, cy: 0.25, r: 0.42, color: '#ff8000', dur: 4.8, dx: -0.18 },
      ]

      const defs = blobs.map((b, i) => `
        <radialGradient id="${plasmaIds[i]}" cx="${b.cx * 100}%" cy="${b.cy * 100}%" r="${b.r * 100}%"
            gradientUnits="userSpaceOnUse" fx="${w * b.cx}" fy="${h * b.cy}">
          <stop offset="0%"   stop-color="${b.color}" stop-opacity="0.5"/>
          <stop offset="50%"  stop-color="${b.color}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${b.color}" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${-w * b.dx} 0" to="${w * b.dx} 0"
            dur="${b.dur}s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>`
      ).join('') + `
        <filter id="${arcId}" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>`

      // Electric arc lines
      const arcs = Array.from({ length: 8 }, (_, i) => {
        const x1 = (i % 2 === 0 ? 0 : w)
        const y1 = h * (0.1 + i * 0.1)
        const cpx = w * (0.3 + (i % 3) * 0.2)
        const cpy = h * (0.5 + (i % 2 === 0 ? 0.2 : -0.2))
        const x2 = w * (0.2 + i * 0.08)
        const y2 = h * (0.8 - i * 0.05)
        return `<path d="M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}"
          fill="none" stroke="${blobs[i % 5].color}" stroke-width="0.8"
          opacity="0.3" filter="url(#${arcId})">
          <animate attributeName="opacity" values="0.1;0.4;0.1"
            dur="${2 + i * 0.4}s" begin="${i * 0.3}s" repeatCount="indefinite"/>
        </path>`
      }).join('')

      const layers = `
        <!-- Plasma blobs -->
        ${blobs.map((_, i) =>
        `<rect width="${w}" height="${h}" fill="url(#${plasmaIds[i]})"/>`
      ).join('\n        ')}
        <!-- Electric arcs -->
        ${arcs}
        <!-- Center energy point -->
        <circle cx="${w * 0.5}" cy="${h * 0.5}" r="8" fill="white" opacity="0.8"
          filter="url(#${arcId})">
          <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="${w * 0.5}" cy="${h * 0.5}" r="3" fill="white" opacity="1"/>`
      return { defs, layers }
    }

    // ── CRYSTALLINE ───────────────────────────────────────────────────────────
    case 'crystalline': {
      const facetIds = Array.from({ length: 8 }, (_, i) => `${uid}_cf${i}`)
      const rimFId = `${uid}_crim`

      // Voronoi-ish facets using triangles and quads
      const facets = [
        { pts: `0,0 ${w * 0.35},0 ${w * 0.2},${h * 0.6} 0,${h * 0.45}`, light: 0.18 },
        { pts: `${w * 0.35},0 ${w * 0.7},0 ${w * 0.55},${h * 0.5} ${w * 0.2},${h * 0.6}`, light: 0.06 },
        { pts: `${w * 0.7},0 ${w},0 ${w},${h * 0.35} ${w * 0.55},${h * 0.5}`, light: 0.14 },
        { pts: `0,${h * 0.45} ${w * 0.2},${h * 0.6} ${w * 0.15},${h} 0,${h}`, light: 0.1 },
        { pts: `${w * 0.2},${h * 0.6} ${w * 0.55},${h * 0.5} ${w * 0.45},${h} ${w * 0.15},${h}`, light: 0.04 },
        { pts: `${w * 0.55},${h * 0.5} ${w},${h * 0.35} ${w},${h * 0.7} ${w * 0.7},${h}`, light: 0.12 },
        { pts: `${w * 0.45},${h} ${w * 0.7},${h} ${w},${h * 0.7} ${w * 0.55},${h * 0.5}`, light: 0.08 },
        { pts: `${w * 0.7},${h} ${w},${h} ${w},${h * 0.7}`, light: 0.16 },
      ]

      const defs = facets.map((f, i) => `
        <linearGradient id="${facetIds[i]}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="white" stop-opacity="${f.light + 0.1}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${0.08 - f.light * 0.3}"/>
        </linearGradient>`
      ).join('') + `
        <filter id="${rimFId}" x="-3%" y="-3%" width="106%" height="106%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>`

      const facetEls = facets.map((f, i) =>
        `<polygon points="${f.pts}"
          fill="url(#${facetIds[i]})" opacity="0.85"/>
        <!-- Facet edge -->
        <polyline points="${f.pts}"
          fill="none" stroke="white" stroke-width="0.5"
          opacity="${f.light * 1.5 + 0.1}"/>`
      ).join('\n        ')

      // Specular highlights on some facets
      const highlights = [0, 2, 6].map(i => {
        const pts = facets[i].pts.split(' ')
        if (pts.length < 2) return ''
        const [x1, y1] = pts[0].split(',').map(Number)
        const [x2, y2] = pts[1].split(',').map(Number)
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="white" stroke-width="1.5" opacity="0.45"
          filter="url(#${rimFId})"/>`
      }).join('')

      const layers = `
        <!-- Crystal facets -->
        ${facetEls}
        <!-- Specular edge highlights -->
        ${highlights}
        <!-- Overall color tint from main fill -->
        <rect width="${w}" height="${h}" fill="${mainFill}" opacity="0.12"/>
        <!-- Top catch light -->
        <rect x="0" y="0" width="${w}" height="1.5" fill="white" opacity="0.4"/>
        <!-- Internal glow -->
        <rect width="${w}" height="${h}" fill="${mainFill}" opacity="0.06"
          filter="url(#${rimFId})"/>`
      return { defs, layers }
    }

    // ── VOID ──────────────────────────────────────────────────────────────────
    case 'void': {
      const nebId = `${uid}_vneb`
      const neb2Id = `${uid}_vneb2`
      const starDId = `${uid}_vsd`
      const dustId = `${uid}_vdust`

      // Lots of stars
      const stars = Array.from({ length: 80 }, (_, i) => {
        const sx = ((i * 137.508 + 11) % 100) / 100 * w
        const sy = ((i * 61.803 + 7) % 100) / 100 * h
        const sr = i % 15 === 0 ? 2.2 : i % 5 === 0 ? 1.4 : 0.7
        const op = 0.3 + (i % 7) * 0.1
        const dur = (2 + (i % 6) * 0.5).toFixed(1)
        const beg = (i * 0.08).toFixed(2)
        if (i % 8 === 0) {
          // Cross sparkle
          return `<g transform="translate(${sx.toFixed(1)},${sy.toFixed(1)})">
            <line x1="-${sr * 2}" y1="0" x2="${sr * 2}" y2="0" stroke="white" stroke-width="0.6" opacity="${op}"/>
            <line x1="0" y1="-${sr * 2}" x2="0" y2="${sr * 2}" stroke="white" stroke-width="0.6" opacity="${op}"/>
            <circle cx="0" cy="0" r="${sr}" fill="white" opacity="${op}">
              <animate attributeName="opacity" values="${op * 0.4};${op};${op * 0.4}"
                dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/>
            </circle>
          </g>`
        }
        return `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr}" fill="white" opacity="${op.toFixed(2)}">
          <animate attributeName="opacity" values="${(op * 0.3).toFixed(2)};${op.toFixed(2)};${(op * 0.3).toFixed(2)}"
            dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/>
        </circle>`
      }).join('')

      const defs = `
        <!-- Nebula cloud 1 -->
        <radialGradient id="${nebId}" cx="30%" cy="40%" r="50%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.3}" fy="${h * 0.4}">
          <stop offset="0%"   stop-color="${m.glow}" stop-opacity="0.35"/>
          <stop offset="50%"  stop-color="${m.glow}" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="${m.glow}" stop-opacity="0"/>
        </radialGradient>
        <!-- Nebula cloud 2 -->
        <radialGradient id="${neb2Id}" cx="75%" cy="65%" r="45%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.75}" fy="${h * 0.65}">
          <stop offset="0%"   stop-color="#4444ff" stop-opacity="0.25"/>
          <stop offset="60%"  stop-color="#4444ff" stop-opacity="0.07"/>
          <stop offset="100%" stop-color="#4444ff" stop-opacity="0"/>
        </radialGradient>
        <!-- Star density gradient (more stars in center) -->
        <radialGradient id="${starDId}" cx="50%" cy="50%" r="60%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.5}">
          <stop offset="0%"   stop-color="white" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <!-- Cosmic dust -->
        <filter id="${dustId}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.4 0.3" numOctaves="3"
            seed="42" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 0 0.4  0 0 0 0.08 0"
            in="noise" result="dust"/>
          <feComposite in="dust" in2="SourceGraphic" operator="in"/>
        </filter>`

      const layers = `
        <!-- Cosmic dust layer -->
        <rect width="${w}" height="${h}" fill="white" filter="url(#${dustId})"/>
        <!-- Nebula glow -->
        <rect width="${w}" height="${h}" fill="url(#${nebId})"/>
        <rect width="${w}" height="${h}" fill="url(#${neb2Id})"/>
        <!-- Star density center glow -->
        <rect width="${w}" height="${h}" fill="url(#${starDId})"/>
        <!-- Stars -->
        ${stars}
        <!-- Edge vignette -->
        <rect width="${w}" height="${h}" fill="black" opacity="0.2"
          style="mask:radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, black 100%)"/>`
      return { defs, layers }
    }

    // ── INFERNO ───────────────────────────────────────────────────────────────
    case 'inferno': {
      const fireIds = Array.from({ length: 5 }, (_, i) => `${uid}_fire${i}`)
      const emberId = `${uid}_ember`
      const heatId = `${uid}_heat`

      const fireLayers = [
        { color: '#ff0000', cy: 1.0, r: 0.6, dur: 3.2, op: 0.5 },
        { color: '#ff4400', cy: 0.85, r: 0.55, dur: 2.8, op: 0.45 },
        { color: '#ff8800', cy: 0.7, r: 0.5, dur: 3.5, op: 0.4 },
        { color: '#ffcc00', cy: 0.5, r: 0.4, dur: 2.5, op: 0.35 },
        { color: '#ffffff', cy: 0.3, r: 0.25, dur: 2.0, op: 0.2 },
      ]

      const defs = fireLayers.map((f, i) => `
        <radialGradient id="${fireIds[i]}" cx="50%" cy="${f.cy * 100}%" r="${f.r * 100}%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * f.cy}">
          <stop offset="0%"   stop-color="${f.color}" stop-opacity="${f.op}"/>
          <stop offset="70%"  stop-color="${f.color}" stop-opacity="${f.op * 0.4}"/>
          <stop offset="100%" stop-color="${f.color}" stop-opacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="${-w * 0.1} ${-h * 0.15}" to="${w * 0.08} ${-h * 0.2}"
            dur="${f.dur}s" repeatCount="indefinite" additive="sum"/>
        </radialGradient>`
      ).join('') + `
        <filter id="${heatId}" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.06" numOctaves="2"
            seed="3" result="noise">
            <animate attributeName="baseFrequency" values="0.02 0.06;0.03 0.08;0.02 0.06"
              dur="0.5s" repeatCount="indefinite"/>
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <radialGradient id="${emberId}" cx="50%" cy="90%" r="40%"
            gradientUnits="userSpaceOnUse" fx="${w * 0.5}" fy="${h * 0.9}">
          <stop offset="0%"   stop-color="#ff4400" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#ff0000" stop-opacity="0"/>
        </radialGradient>`

      // Ember particles
      const embers = Array.from({ length: 20 }, (_, i) => {
        const ex = w * (0.1 + (i * 0.047) % 0.85)
        const ey = h * (0.3 + (i * 0.073) % 0.6)
        const er = 0.8 + (i % 4) * 0.5
        const dur = (1.5 + (i % 5) * 0.3).toFixed(1)
        const beg = (i * 0.12).toFixed(2)
        return `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${er}"
          fill="#ffcc00" opacity="0">
          <animate attributeName="opacity" values="0;0.9;0" dur="${dur}s"
            begin="${beg}s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate"
            from="0,0" to="${((i % 3) - 1) * 8},-${15 + i % 12}"
            dur="${dur}s" begin="${beg}s" repeatCount="indefinite" additive="sum"/>
        </circle>`
      }).join('')

      const layers = `
        <!-- Fire base -->
        ${fireLayers.map((_, i) =>
        `<rect width="${w}" height="${h}" fill="url(#${fireIds[i]})"/>`
      ).join('\n        ')}
        <!-- Heat haze distortion on bottom -->
        <rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}"
          fill="url(#${emberId})" filter="url(#${heatId})"/>
        <!-- Ground ember glow -->
        <rect width="${w}" height="${h}" fill="url(#${emberId})"/>
        <!-- Embers -->
        ${embers}
        <!-- Top smoke fade -->
        <rect x="0" y="0" width="${w}" height="${h * 0.35}" fill="black" opacity="0.3"/>`
      return { defs, layers }
    }

    // ── MATRIX ────────────────────────────────────────────────────────────────
    case 'matrix': {
      const matGlow = `${uid}_matglow`
      const matFade = `${uid}_matfade`

      const chars = ['0', '1', 'ﾊ', 'ﾐ', 'ﾋ', 'ｹ', 'ﾒ', 'ｴ', 'ｶ', 'ｳ', 'ﾏ', 'ﾜ', 'ﾘ',
        '∑', 'Ω', '∆', 'π', 'φ', 'λ', 'ψ', '⌬', '⎔', '◈', '⟨', '⟩']

      const colW = 18
      const cols = Math.ceil(w / colW)
      const rowH = 16
      const rows = Math.ceil(h / rowH)

      const matrixChars = Array.from({ length: cols }, (_, ci) => {
        const x = ci * colW + colW / 2
        return Array.from({ length: rows }, (_, ri) => {
          const y = ri * rowH + rowH * 0.8
          const ch = chars[(ci * 7 + ri * 13) % chars.length]
          const bright = ri === (ci % rows) // "head" character is brightest
          const op = bright ? 1 : (0.08 + ((ci * 3 + ri * 5) % 10) * 0.04)
          const fill = bright ? 'white' : m.glow
          const delay = (ci * 0.12).toFixed(2)
          const dur = (2 + ci % 4).toFixed(1)
          if (ri % 3 !== 0 && !bright) return '' // skip some for density
          return `<text x="${x}" y="${y}" text-anchor="middle"
            font-family="monospace" font-size="${bright ? 13 : 11}"
            fill="${fill}" opacity="${op.toFixed(2)}">
            ${bright ? `<animate attributeName="opacity" values="${op};${Math.min(1, op * 3)};${op}"
              dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>` : ''}
            ${esc(ch)}
          </text>`
        }).filter(Boolean).join('')
      }).join('')

      const defs = `
        <filter id="${matGlow}" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <linearGradient id="${matFade}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="black" stop-opacity="0.4"/>
          <stop offset="20%"  stop-color="black" stop-opacity="0.1"/>
          <stop offset="80%"  stop-color="black" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.4"/>
        </linearGradient>`

      const layers = `
        <!-- Matrix character rain -->
        <g filter="url(#${matGlow})">
          ${matrixChars}
        </g>
        <!-- Fade top/bottom -->
        <rect width="${w}" height="${h}" fill="url(#${matFade})"/>
        <!-- Horizontal scan line -->
        <rect x="0" y="-4" width="${w}" height="4" fill="${m.glow}" opacity="0.2">
          <animateTransform attributeName="transform" type="translate"
            from="0,0" to="0,${h + 4}" dur="3s" repeatCount="indefinite"/>
        </rect>`
      return { defs, layers }
    }

    default: {
      // Clean fallback sheen
      const sheenId = `${uid}_fallback`
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
    case 'none': return { defs: '', el: '' }
    case 'normal': return {
      defs: '', el:
        `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
        rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.7"/>`
    }

    case 'metallic': {
      const id = `${uid}_bmet`
      return {
        defs: `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="white"       stop-opacity="0.9"/>
          <stop offset="25%"  stop-color="${borderColor}" stop-opacity="0.8"/>
          <stop offset="50%"  stop-color="white"       stop-opacity="0.6"/>
          <stop offset="75%"  stop-color="${borderColor}" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white"       stop-opacity="0.5"/>
        </linearGradient>`,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${id})" stroke-width="${bw}"/>`,
      }
    }

    case 'gradient': {
      const id = `${uid}_bgrad`
      return {
        defs: `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${borderColor}" stop-opacity="0"/>
          <stop offset="20%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="80%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${borderColor}" stop-opacity="0"/>
        </linearGradient>`,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${id})" stroke-width="${bw}"/>`,
      }
    }

    case 'glow': {
      const id = `${uid}_bgf`
      return {
        defs: `<filter id="${id}" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>`,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw * 2}" opacity="0.3" filter="url(#${id})"/>
        <rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}"/>`,
      }
    }

    case 'neon': {
      const id = `${uid}_bnf`
      return {
        defs: `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" result="b1"/>
          <feGaussianBlur stdDeviation="8" result="b2"/>
          <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>`,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}" filter="url(#${id})">
          <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </rect>`,
      }
    }

    case 'double': return {
      defs: '', el: `
      <rect x="1"       y="1"       width="${w - 2}"         height="${h - 2}"         rx="${r + 2}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.4"/>
      <rect x="${bw + 2}" y="${bw + 2}" width="${w - bw * 2 - 4}"    height="${h - bw * 2 - 4}"    rx="${r - 2}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.6"/>
      <rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}"         height="${h - bw}"         rx="${r}"   fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.8"/>`
    }

    case 'dashed': return {
      defs: '', el:
        `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
        rx="${r}" fill="none" stroke="${borderColor}" stroke-width="${bw}"
        stroke-dasharray="${bw * 4} ${bw * 2}" opacity="0.75"/>`
    }

    case 'animated': {
      const id = `${uid}_banim`
      const perim = (w + h) * 2
      return {
        defs: `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${borderColor}" stop-opacity="0"/>
          <stop offset="40%"  stop-color="${borderColor}" stop-opacity="1"/>
          <stop offset="60%"  stop-color="white"          stop-opacity="1"/>
          <stop offset="100%" stop-color="${borderColor}" stop-opacity="0"/>
        </linearGradient>`,
        el: `<rect x="${bw / 2}" y="${bw / 2}" width="${w - bw}" height="${h - bw}"
          rx="${r}" fill="none" stroke="url(#${id})" stroke-width="${bw}"
          stroke-dasharray="${perim * 0.3} ${perim * 0.7}">
          <animate attributeName="stroke-dashoffset" from="${perim}" to="0"
            dur="3s" repeatCount="indefinite"/>
        </rect>`,
      }
    }

    case 'circuit': {
      const cs = Math.min(24, h * 0.15)
      return {
        defs: '', el: `
        <polyline points="${cs},2 2,2 2,${cs}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="${w - cs},2 ${w - 2},2 ${w - 2},${cs}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="2,${h - cs} 2,${h - 2} ${cs},${h - 2}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <polyline points="${w - 2},${h - cs} ${w - 2},${h - 2} ${w - cs},${h - 2}" fill="none" stroke="${borderColor}" stroke-width="${bw}" opacity="0.9"/>
        <circle cx="${cs}" cy="2" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${w - cs}" cy="2" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${cs}" cy="${h - 2}" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <circle cx="${w - cs}" cy="${h - 2}" r="${bw}" fill="${borderColor}" opacity="0.8"/>
        <line x1="${cs}" y1="2" x2="${w * 0.3}" y2="2" stroke="${borderColor}" stroke-width="${bw * 0.5}" opacity="0.4"/>
        <line x1="${w * 0.7}" y1="2" x2="${w - cs}" y2="2" stroke="${borderColor}" stroke-width="${bw * 0.5}" opacity="0.4"/>`
      }
    }

    default: return { defs: '', el: '' }
  }
}

// ─── Main render ──────────────────────────────────────────────────────────────

export function renderBanner(opts: BannerOptions): string {
  const {
    text = '',
    subtext = opts.desc ?? '',
    height = 200,
    width = 900,
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

  const { fill: mainFill, defs: mainDefs } = buildBannerGradient(opts, w, h)

  const defaultTextColor = theme === 'dark' ? (m.textDark ?? '#ffffff') : (m.textLight ?? '#111111')
  const defaultSubtextColor = m.glow
  const resolvedTextColor = opts.textColor ?? defaultTextColor
  const resolvedSubtextColor = opts.subtextColor ?? defaultSubtextColor
  const borderColor = opts.borderColor ?? m.glow
  const bg = opts.bg ?? themeColors.bg

  const vs = buildVisualStyle(visualStyle, w, h, uid, mainFill, metal, theme)
  const bord = buildBorder(border as BannerBorder, w, h, uid, mainFill, borderColor, borderWidth, m)

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

  const autoFontSize = fontSize ?? Math.max(20, Math.min(58, h * 0.24))
  const autoSubSize = subtextSize ?? Math.max(10, autoFontSize * 0.38)
  const textY = h * 0.44
  const subY = textY + autoFontSize * 0.78
  const letterSpacing = Math.max(1, autoFontSize * 0.06).toFixed(1)
  const subLetterSpacing = Math.max(1, autoSubSize * 0.12).toFixed(1)

  const txX = textAlign === 'left' ? `x="${w * 0.04}"` : textAlign === 'right' ? `x="${w * 0.96}"` : `x="${w / 2}"`
  const anchor = textAlign === 'center' ? 'middle' : textAlign
  const flipXform = (section === 'footer' || reversal) ? `transform="scale(1,-1) translate(0,-${h})"` : ''

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
    ${bord.defs}
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="${bg}"/>

  <!-- Main fill shape -->
  <rect width="${w}" height="${h}" fill="${mainFill}"/>

  <!-- Visual style layers -->
  <g ${flipXform}>
    ${vs.layers}
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
  >${esc(subtext)}</text>` : ''}

  <!-- Bottom accent line -->
  <rect x="0" y="${h - 3}" width="${w}" height="3" fill="${mainFill}" opacity="0.55"/>
</svg>`
}