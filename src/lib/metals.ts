// src/lib/metals.ts
// MetalForge SVG Engine — all metallic finishes, shapes, and renderers

export type MetalType =
  | 'chrome' | 'gold' | 'rose-gold' | 'titanium'
  | 'copper' | 'obsidian' | 'electric' | 'neon' | 'blood' | 'ice'

export type BannerShape =
  | 'wave' | 'wave-bottom' | 'rect' | 'shark' | 'slice'
  | 'egg' | 'cylinder' | 'diagonal' | 'venom'

export type BannerAnimation =
  | 'none' | 'fadeIn' | 'shimmer' | 'glow' | 'scan' | 'twinkling'

export type CardType = 'stats' | 'langs' | 'streak' | 'trophy' | 'activity'
export type BadgeShape = 'pill' | 'rect' | 'hex' | 'sharp'
export type ButtonStyle = 'beveled' | 'pill' | 'sharp' | 'engraved' | 'ghost'

export interface MetalConfig {
  stops: [string, string][]    // [color, offset%]
  textDark: string             // dark text color (for light metals)
  textLight: string            // light text color (for dark metals)
  glow: string                 // glow rgba
  accent: string               // accent/highlight
  shadow: string               // drop shadow color
  isDark: boolean
}

export const METALS: Record<MetalType, MetalConfig> = {
  chrome: {
    stops: [['#f4f4f4','0%'],['#909090','20%'],['#d8d8d8','40%'],['#e8e8e8','55%'],['#787878','80%'],['#c8c8c8','100%']],
    textDark: '#141428', textLight: '#f0f0f0',
    glow: 'rgba(200,210,240,0.5)', accent: '#e8e8f8', shadow: '#606080',
    isDark: false,
  },
  gold: {
    stops: [['#fff0a0','0%'],['#d4a020','20%'],['#f5d040','40%'],['#fce060','55%'],['#9a7010','80%'],['#e8c030','100%']],
    textDark: '#1a0800', textLight: '#fff8d0',
    glow: 'rgba(255,200,40,0.6)', accent: '#ffe060', shadow: '#a06000',
    isDark: false,
  },
  'rose-gold': {
    stops: [['#ffd0d0','0%'],['#cc7878','20%'],['#eea0a0','40%'],['#ffb8b8','55%'],['#a05858','80%'],['#e09090','100%']],
    textDark: '#200808', textLight: '#ffe8e8',
    glow: 'rgba(255,140,140,0.5)', accent: '#ffb0b0', shadow: '#804040',
    isDark: false,
  },
  titanium: {
    stops: [['#a0b0cc','0%'],['#4a5f7a','20%'],['#8090b0','40%'],['#90a0c0','55%'],['#384a60','80%'],['#7080a8','100%']],
    textDark: '#e8f0ff', textLight: '#e8f0ff',
    glow: 'rgba(100,150,230,0.5)', accent: '#a0b8e0', shadow: '#203050',
    isDark: true,
  },
  copper: {
    stops: [['#f0a070','0%'],['#8b4513','20%'],['#d0782a','40%'],['#e08840','55%'],['#6b3008','80%'],['#c06830','100%']],
    textDark: '#1a0800', textLight: '#ffe8d0',
    glow: 'rgba(210,120,50,0.5)', accent: '#d88040', shadow: '#602008',
    isDark: false,
  },
  obsidian: {
    stops: [['#484858','0%'],['#1c1c2c','20%'],['#303040','40%'],['#383848','55%'],['#101020','80%'],['#282838','100%']],
    textDark: '#c0c8e8', textLight: '#c0c8e8',
    glow: 'rgba(80,90,180,0.5)', accent: '#6870c0', shadow: '#000010',
    isDark: true,
  },
  electric: {
    stops: [['#60ffff','0%'],['#0050ff','30%'],['#4000ff','55%'],['#0070ff','80%'],['#00d0ff','100%']],
    textDark: '#ffffff', textLight: '#ffffff',
    glow: 'rgba(0,200,255,0.7)', accent: '#40ffff', shadow: '#002080',
    isDark: true,
  },
  neon: {
    stops: [['#80ff40','0%'],['#00cc60','30%'],['#00ff80','55%'],['#20e050','80%'],['#60ff20','100%']],
    textDark: '#001208', textLight: '#e0ffe0',
    glow: 'rgba(57,255,20,0.7)', accent: '#60ff30', shadow: '#004010',
    isDark: true,
  },
  blood: {
    stops: [['#ff6060','0%'],['#8b0000','25%'],['#cc2020','50%'],['#aa0000','75%'],['#ff4040','100%']],
    textDark: '#200000', textLight: '#ffe0e0',
    glow: 'rgba(200,0,0,0.6)', accent: '#ff4040', shadow: '#400000',
    isDark: true,
  },
  ice: {
    stops: [['#e0f8ff','0%'],['#80c8e8','20%'],['#c0e8f8','40%'],['#d8f0ff','55%'],['#60a8c8','80%'],['#b0d8f0','100%']],
    textDark: '#102030', textLight: '#f0faff',
    glow: 'rgba(160,220,255,0.6)', accent: '#c0e8ff', shadow: '#205070',
    isDark: false,
  },
}

// ─── Gradient Builder ────────────────────────────────────────────────────────

export function buildGradient(
  id: string,
  metal: MetalType,
  angle = '135',
  opacity = 1
): string {
  const m = METALS[metal]
  const stops = m.stops
    .map(([c, o]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${opacity}"/>`)
    .join('\n      ')
  const rad = (parseInt(angle) * Math.PI) / 180
  const x2 = (50 + 50 * Math.cos(rad)).toFixed(1)
  const y2 = (50 + 50 * Math.sin(rad)).toFixed(1)
  return `<linearGradient id="${id}" x1="50%" y1="50%" x2="${x2}%" y2="${y2}%" gradientUnits="userSpaceOnUse">
      ${stops}
    </linearGradient>`
}

export function buildRadialGradient(
  id: string,
  metal: MetalType,
  cx = '50%', cy = '50%', r = '60%'
): string {
  const m = METALS[metal]
  const stops = m.stops
    .map(([c, o]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('\n      ')
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">
      ${stops}
    </radialGradient>`
}

// ─── Shape Path Builder ──────────────────────────────────────────────────────

export function buildShape(
  shape: BannerShape,
  w: number,
  h: number,
  fillId: string
): string {
  const f = `url(#${fillId})`
  switch (shape) {
    case 'wave':
      return `
        <path d="M0,0 L${w},0 L${w},${h * 0.55}
          C${w * 0.75},${h * 0.35} ${w * 0.5},${h * 0.75} ${w * 0.25},${h * 0.5}
          C${w * 0.1},${h * 0.38} 0,${h * 0.45} 0,${h * 0.45} Z" fill="${f}"/>
        <path d="M0,${h * 0.45}
          C${w * 0.1},${h * 0.45} ${w * 0.25},${h * 0.5} ${w * 0.35},${h * 0.52}
          C${w * 0.5},${h * 0.55} ${w * 0.65},${h * 0.48} ${w * 0.75},${h * 0.45}
          C${w * 0.85},${h * 0.42} ${w},${h * 0.45} ${w},${h * 0.45}
          L${w},${h} L0,${h} Z" fill="${f}" opacity="0.7"/>`

    case 'wave-bottom':
      return `
        <rect width="${w}" height="${h}" fill="${f}"/>
        <path d="M0,${h * 0.7}
          C${w * 0.25},${h * 0.55} ${w * 0.5},${h * 0.85} ${w * 0.75},${h * 0.65}
          C${w * 0.875},${h * 0.55} ${w},${h * 0.7} ${w},${h * 0.7}
          L${w},${h} L0,${h} Z" fill="rgba(0,0,0,0.25)"/>`

    case 'shark':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.72} L${w * 0.55},${h} L0,${h * 0.72} Z" fill="${f}"/>`

    case 'slice':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.62} L0,${h} Z" fill="${f}"/>`

    case 'egg':
      return `<ellipse cx="${w / 2}" cy="${h * 0.48}" rx="${w * 0.51}" ry="${h * 0.48}" fill="${f}"/>`

    case 'cylinder':
      return `
        <rect x="0" y="${h * 0.08}" width="${w}" height="${h * 0.84}" fill="${f}"/>
        <ellipse cx="${w / 2}" cy="${h * 0.08}" rx="${w / 2}" ry="${h * 0.09}" fill="${f}"/>
        <ellipse cx="${w / 2}" cy="${h * 0.08}" rx="${w / 2}" ry="${h * 0.09}" fill="white" opacity="0.2"/>
        <ellipse cx="${w / 2}" cy="${h * 0.92}" rx="${w / 2}" ry="${h * 0.09}" fill="${f}"/>
        <ellipse cx="${w / 2}" cy="${h * 0.92}" rx="${w / 2}" ry="${h * 0.09}" fill="black" opacity="0.2"/>`

    case 'diagonal':
      return `<path d="M0,0 L${w},0 L${w},${h * 0.75} L0,${h} Z" fill="${f}"/>`

    case 'venom':
      return `
        <path d="M0,0 L${w},0 L${w},${h * 0.6}
          C${w * 0.8},${h * 0.4} ${w * 0.65},${h * 0.9} ${w * 0.5},${h * 0.7}
          C${w * 0.35},${h * 0.5} ${w * 0.2},${h * 0.9} 0,${h * 0.6} Z" fill="${f}"/>`

    default: // rect
      return `<rect width="${w}" height="${h}" fill="${f}"/>`
  }
}

// ─── Animation Builder ───────────────────────────────────────────────────────

export function buildAnimation(
  id: string,
  anim: BannerAnimation,
  w: number,
  h: number
): { defs: string; overlay: string; style: string } {
  switch (anim) {
    case 'shimmer':
      return {
        defs: `<linearGradient id="${id}_shim" x1="-100%" y1="0" x2="200%" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="45%" stop-color="white" stop-opacity="0"/>
          <stop offset="50%" stop-color="white" stop-opacity="0.35"/>
          <stop offset="55%" stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0">
            <animate attributeName="stop-opacity" values="0;0" dur="0s" repeatCount="indefinite"/>
          </stop>
          <animateTransform attributeName="gradientTransform" type="translate" from="-${w * 2} 0" to="${w * 2} 0" dur="2.5s" repeatCount="indefinite"/>
        </linearGradient>`,
        overlay: `<rect width="${w}" height="${h}" fill="url(#${id}_shim)" style="mix-blend-mode:overlay"/>`,
        style: '',
      }

    case 'glow':
      return {
        defs: `<filter id="${id}_gf" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <animate id="${id}_glowanim" attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>`,
        overlay: `<rect width="${w}" height="${h}" fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.08;0" dur="2s" repeatCount="indefinite"/>
        </rect>`,
        style: '',
      }

    case 'scan':
      return {
        defs: '',
        overlay: `<rect x="0" y="-4" width="${w}" height="4" fill="white" opacity="0.5">
          <animate attributeName="y" values="-4;${h}" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
        </rect>
        <rect x="0" y="-8" width="${w}" height="2" fill="white" opacity="0.2">
          <animate attributeName="y" values="-8;${h}" dur="1.8s" begin="0.2s" repeatCount="indefinite" calcMode="linear"/>
        </rect>`,
        style: '',
      }

    case 'twinkling':
      const stars = Array.from({ length: 12 }, (_, i) => {
        const x = Math.floor(Math.random() * w)
        const y = Math.floor(Math.random() * h)
        const delay = (i * 0.3).toFixed(1)
        return `<circle cx="${x}" cy="${y}" r="2" fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
        </circle>`
      }).join('\n')
      return { defs: '', overlay: stars, style: '' }

    case 'fadeIn':
      return {
        defs: '',
        overlay: '',
        style: `@keyframes mf_fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`,
      }

    default:
      return { defs: '', overlay: '', style: '' }
  }
}

// ─── Engraving / Texture ─────────────────────────────────────────────────────

export function buildTexture(w: number, h: number, density = 8): string {
  const lines = Array.from({ length: Math.floor(h / density) }, (_, i) =>
    `<line x1="0" y1="${i * density}" x2="${w}" y2="${i * density}" stroke="white" stroke-opacity="0.035" stroke-width="1"/>`
  ).join('')
  const vlines = Array.from({ length: Math.floor(w / (density * 4)) }, (_, i) =>
    `<line x1="${i * density * 4}" y1="0" x2="${i * density * 4}" y2="${h}" stroke="white" stroke-opacity="0.015" stroke-width="1"/>`
  ).join('')
  return lines + vlines
}

// ─── Bevel / Highlight ───────────────────────────────────────────────────────

export function buildBevel(w: number, h: number, r = 8): string {
  return `
    <!-- Top highlight (beveled) -->
    <path d="M${r},1 L${w - r},1 Q${w - 1},1 ${w - 1},${r} L${w - 1},${h * 0.4} 
      Q${w * 0.5},${h * 0.15} 1,${h * 0.4} L1,${r} Q1,1 ${r},1 Z"
      fill="white" opacity="0.18"/>
    <!-- Bottom shadow -->
    <path d="M${r},${h - 1} L${w - r},${h - 1} Q${w - 1},${h - 1} ${w - 1},${h - r}
      L${w - 1},${h * 0.7} Q${w * 0.5},${h * 0.9} 1,${h * 0.7}
      L1,${h - r} Q1,${h - 1} ${r},${h - 1} Z"
      fill="black" opacity="0.2"/>`
}
