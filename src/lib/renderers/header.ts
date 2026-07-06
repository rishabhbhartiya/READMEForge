// src/lib/renderers/header.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, getThemeColors,
  Theme, DesignStyle, uniqueId, wavePath,
} from '../metals'

export type HeaderStyle =
  | 'profile' | 'minimal' | 'cyber' | 'terminal' | 'hologram'
  | 'aurora' | 'matrix' | 'wave-flow' | 'particles' | 'neon-grid'
  | 'liquid-metal' | 'orbit' | 'gradient-mesh' | 'glass'
  | 'split' | 'constellation' | 'circuit-board' | 'skyline'
  | 'blueprint' | 'geometric' | 'signal-wave' | 'ribbon'

export interface HeaderOptions {
  name?: string
  title?: string
  tagline?: string
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: HeaderStyle
  width?: number
  height?: number
  avatar?: string
  wave?: boolean
  theme?: Theme
  bg?: string
  /** Enable SMIL animations (flowing/moving backgrounds). Default true. */
  animated?: boolean
  /** Animation speed multiplier — lower is faster. Default 1. */
  speed?: number
  /** Particle count for the 'particles' style. Default 16. */
  particles?: number
}

// ────────────────────────────────────────────────────────────────────────────
// Small deterministic PRNG so backgrounds look organic but render identically
// every time the same URL is requested (important for the edge cache).
// ────────────────────────────────────────────────────────────────────────────
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ────────────────────────────────────────────────────────────────────────────
// Background layer generators — each returns { defs, back } SVG fragments.
// `back` renders BEHIND the foreground content, `defs` goes in <defs>.
// ────────────────────────────────────────────────────────────────────────────

function auroraBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const fid = `${uid}_ablur`
  const defs = `<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="${h * 0.09}"/>
  </filter>`
  const bands = [
    { y: h * 0.35, amp: h * 0.16, color: mainFill, op: 0.35, dur: 9 * speed },
    { y: h * 0.55, amp: h * 0.22, color: accent, op: 0.28, dur: 12 * speed },
    { y: h * 0.75, amp: h * 0.14, color: mainFill, op: 0.22, dur: 15 * speed },
  ]
  const back = bands.map((b, i) => {
    const d1 = `${wavePath(w, b.y, b.amp, 1, 0)} L${w},${h} L0,${h} Z`
    const d2 = `${wavePath(w, b.y, b.amp, 1, Math.PI)} L${w},${h} L0,${h} Z`
    return `<path d="${d1}" fill="${b.color}" opacity="${b.op}" filter="url(#${fid})">
      ${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${b.dur}s" repeatCount="indefinite"/>` : ''}
    </path>`
  }).join('')
  return { defs, back }
}

function matrixBg(w: number, h: number, uid: string, accent: string, animated: boolean, speed: number) {
  const chars = 'アイウエオカキクケコ01サシスセソ'.split('')
  const cols = Math.max(8, Math.floor(w / 42))
  const rnd = seeded(uid.length + w + h)
  let back = ''
  const clipId = `${uid}_mclip`
  const defs = `<clipPath id="${clipId}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>`
  for (let i = 0; i < cols; i++) {
    const x = (i + 0.5) * (w / cols)
    const len = 4 + Math.floor(rnd() * 4)
    const dur = (5 + rnd() * 5) * speed
    const delay = -rnd() * dur
    const glyphs = Array.from({ length: len }, () => chars[Math.floor(rnd() * chars.length)])
    const tspans = glyphs.map((g, gi) => `<tspan x="${x}" dy="${gi === 0 ? 0 : 16}" opacity="${1 - gi / len}">${g}</tspan>`).join('')
    back += `<g clip-path="url(#${clipId})">
      <text font-family="'Share Tech Mono',monospace" font-size="14" fill="${accent}" opacity="0.55">
        ${tspans}
        ${animated ? `<animateTransform attributeName="transform" type="translate" from="0,-${len * 16 + 20}" to="0,${h + 20}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>` : `<animateTransform attributeName="transform" type="translate" values="0,${h * 0.4}" dur="1s"/>`}
      </text>
    </g>`
  }
  return { defs, back }
}

function waveFlowBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const layers = [
    { y: h * 0.72, amp: h * 0.07, color: mainFill, op: 0.5, dur: 7 * speed },
    { y: h * 0.82, amp: h * 0.05, color: accent, op: 0.3, dur: 11 * speed },
  ]
  const back = layers.map(l => {
    const seg = `${wavePath(w, l.y, l.amp, 2, 0)} L${w},${h} L0,${h} Z`
    return `<g>
      <path d="${seg}" fill="${l.color}" opacity="${l.op}" transform="translate(0,0)">
        ${animated ? `<animateTransform attributeName="transform" type="translate" from="0,0" to="-${w},0" dur="${l.dur}s" repeatCount="indefinite"/>` : ''}
      </path>
      <path d="${seg}" fill="${l.color}" opacity="${l.op}" transform="translate(${w},0)">
        ${animated ? `<animateTransform attributeName="transform" type="translate" from="${w},0" to="0,0" dur="${l.dur}s" repeatCount="indefinite"/>` : ''}
      </path>
    </g>`
  }).join('')
  return { defs: '', back }
}

function particlesBg(w: number, h: number, uid: string, accent: string, mainFill: string, animated: boolean, speed: number, count: number) {
  const rnd = seeded(uid.length * 7 + w)
  let back = ''
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const x = rnd() * w
    const y = rnd() * h
    pts.push({ x, y })
    const r = 1.4 + rnd() * 2.2
    const dur = (3 + rnd() * 4) * speed
    const drift = 8 + rnd() * 14
    const color = i % 3 === 0 ? accent : mainFill
    back += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="0.5">
      ${animated ? `<animate attributeName="cy" values="${y.toFixed(1)};${(y - drift).toFixed(1)};${y.toFixed(1)}" dur="${dur}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;0.75;0.2" dur="${dur}s" repeatCount="indefinite"/>` : ''}
    </circle>`
  }
  // faint connecting lines between nearby points for a "network" feel
  let lines = ''
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < w * 0.16) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${accent}" stroke-width="0.6" opacity="0.12"/>`
      }
    }
  }
  return { defs: '', back: lines + back }
}

function neonGridBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const horizonY = h * 0.62
  const sunId = `${uid}_sun`
  const defs = `<radialGradient id="${sunId}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
    <stop offset="70%" stop-color="${mainFill}" stop-opacity="0.35"/>
    <stop offset="100%" stop-color="${mainFill}" stop-opacity="0"/>
  </radialGradient>`
  // vertical fan lines converging toward a vanishing point at horizon center
  const vpx = w / 2
  let verticals = ''
  const vCount = 9
  for (let i = 0; i <= vCount; i++) {
    const t = i / vCount
    const xBottom = t * w
    verticals += `<line x1="${vpx}" y1="${horizonY}" x2="${xBottom}" y2="${h}" stroke="${mainFill}" stroke-width="1" opacity="0.28"/>`
  }
  // horizontal lines with increasing spacing to fake perspective, animated drifting downward
  let horizontals = ''
  const hCount = 6
  for (let i = 0; i < hCount; i++) {
    const t = i / hCount
    const y = horizonY + Math.pow(t, 2.2) * (h - horizonY)
    const dur = (2.4 + i * 0.4) * speed
    horizontals += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${mainFill}" stroke-width="1" opacity="${0.35 - t * 0.2}">
      ${animated ? `<animate attributeName="opacity" values="0;${0.4 - t * 0.2};0" dur="${dur}s" repeatCount="indefinite"/>` : ''}
    </line>`
  }
  const back = `
    <circle cx="${vpx}" cy="${horizonY}" r="${h * 0.34}" fill="url(#${sunId})"/>
    <line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    ${verticals}
    ${horizontals}`
  return { defs, back }
}

function liquidMetalBlob(cx: number, cy: number, r: number, uid: string, mainFill: string, glowFid: string, animated: boolean, speed: number) {
  // Two organic blob outlines to morph between
  const blob = (rr: number, wobble: number) => {
    const pts = 8
    let d = ''
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2
      const rad = rr + Math.sin(a * 3 + wobble) * rr * 0.14
      const x = cx + Math.cos(a) * rad
      const y = cy + Math.sin(a) * rad
      d += (i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return d + ' Z'
  }
  const d1 = blob(r, 0)
  const d2 = blob(r, 2.4)
  return `<path d="${d1}" fill="${mainFill}" opacity="0.28" filter="url(#${glowFid})">
    ${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${8 * speed}s" repeatCount="indefinite"/>` : ''}
  </path>`
}

function orbitRings(cx: number, cy: number, r: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const g1 = `${uid}_orbg1`
  const g2 = `${uid}_orbg2`
  return `
    <circle cx="${cx}" cy="${cy}" r="${r * 1.55}" fill="none" stroke="${mainFill}" stroke-width="1" stroke-dasharray="2 6" opacity="0.4">
      ${animated ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${18 * speed}s" repeatCount="indefinite"/>` : ''}
    </circle>
    <circle cx="${cx}" cy="${cy}" r="${r * 2}" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="1 10" opacity="0.3">
      ${animated ? `<animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="${26 * speed}s" repeatCount="indefinite"/>` : ''}
    </circle>
    <g id="${g1}">
      <circle cx="${cx + r * 1.55}" cy="${cy}" r="4" fill="${accent}"/>
      ${animated ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${18 * speed}s" repeatCount="indefinite"/>` : ''}
    </g>
    <g id="${g2}">
      <circle cx="${cx + r * 2}" cy="${cy}" r="3" fill="${mainFill}"/>
      ${animated ? `<animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="${26 * speed}s" repeatCount="indefinite"/>` : ''}
    </g>`
}

function gradientMeshBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const fid = `${uid}_meshblur`
  const defs = `<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="${h * 0.16}"/>
  </filter>`
  const blobs = [
    { x: w * 0.1, y: h * 0.2, r: h * 0.5, color: mainFill, op: 0.5 },
    { x: w * 0.55, y: h * 0.75, r: h * 0.42, color: accent, op: 0.4 },
    { x: w * 0.85, y: h * 0.15, r: h * 0.38, color: theme === 'dark' ? '#ffffff' : mainFill, op: theme === 'dark' ? 0.08 : 0.25 },
  ]
  const back = `<g filter="url(#${fid})">` + blobs.map((b, i) => {
    const dx = 20 + i * 8, dy = 14 + i * 6
    return `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="${b.color}" opacity="${b.op}">
      ${animated ? `<animate attributeName="cx" values="${b.x};${b.x + dx};${b.x}" dur="${(10 + i * 3) * speed}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${b.y};${b.y - dy};${b.y}" dur="${(13 + i * 2) * speed}s" repeatCount="indefinite"/>` : ''}
    </circle>`
  }).join('') + '</g>'
  return { defs, back }
}

function glassPanel(w: number, h: number, uid: string, theme: Theme, mainFill: string) {
  const pad = h * 0.08
  const panelFill = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)'
  const strokeC = theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)'
  const hiId = `${uid}_glasshi`
  const defs = `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
    <stop offset="35%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>`
  const back = `
    <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="18"
      fill="${panelFill}" stroke="${strokeC}" stroke-width="1.5"/>
    <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="18" fill="url(#${hiId})"/>
    <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="1.5" fill="${mainFill}" opacity="0.5"/>`
  return { defs, back, contentInset: pad }
}

function splitBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const splitX = w * 0.42
  const skew = h * 0.28
  const rightId = `${uid}_splitr`
  const shineId = `${uid}_splitshine`
  const defs = `<clipPath id="${uid}_splitclip"><path d="M${splitX},0 L${w},0 L${w},${h} L${splitX - skew},${h} Z"/></clipPath>
    <linearGradient id="${rightId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${mainFill}"/>
      <stop offset="100%" stop-color="${theme === 'dark' ? '#000000' : '#ffffff'}" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="${shineId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>`
  const back = `
    <rect x="0" y="0" width="${w}" height="${h}" clip-path="url(#${uid}_splitclip)" fill="url(#${rightId})"/>
    <line x1="${splitX}" y1="0" x2="${splitX - skew}" y2="${h}" stroke="${accent}" stroke-width="2" opacity="0.7"/>
    <rect x="${splitX - 40}" y="0" width="40" height="${h}" fill="url(#${shineId})" clip-path="url(#${uid}_splitclip)">
      ${animated ? `<animateTransform attributeName="transform" type="translate" from="-${w}," to="${w * 1.4},0" dur="${5 * speed}s" repeatCount="indefinite"/>` : ''}
    </rect>`
  return { defs, back, splitX }
}

function constellationBg(w: number, h: number, uid: string, accent: string, animated: boolean, speed: number, count: number) {
  const rnd = seeded(uid.length * 11 + w + 3)
  const pts: { x: number; y: number; r: number }[] = []
  let stars = ''
  for (let i = 0; i < count; i++) {
    const x = rnd() * w, y = rnd() * h * 0.85
    const r = 0.8 + rnd() * 1.6
    pts.push({ x, y, r })
    const dur = (2 + rnd() * 3) * speed
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#ffffff" opacity="0.7">
      ${animated ? `<animate attributeName="opacity" values="0.2;0.9;0.2" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}
    </circle>`
  }
  let lines = ''
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
      if (Math.sqrt(dx * dx + dy * dy) < w * 0.14) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${accent}" stroke-width="0.5" opacity="0.18"/>`
      }
    }
  }
  const shootDur = 6 * speed
  const shoot = animated ? `<g opacity="0.9">
    <line x1="0" y1="0" x2="46" y2="14" stroke="#ffffff" stroke-width="1.5"/>
    <animateMotion path="M-40,${h * 0.1} L${w + 40},${h * 0.55}" dur="${shootDur}s" repeatCount="indefinite" begin="1s"/>
    <animate attributeName="opacity" values="0;1;0" dur="${shootDur}s" repeatCount="indefinite" begin="1s"/>
  </g>` : ''
  return { defs: '', back: lines + stars + shoot }
}

function circuitBoardBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 5 + h)
  const rows = 5, cols = 8
  let traces = '', pads = ''
  const stepX = w / cols, stepY = h / rows
  const paths: string[] = []
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      if (rnd() > 0.6) continue
      const x = c * stepX, y = r * stepY
      const horizontal = rnd() > 0.5
      const len = (0.6 + rnd() * 0.8)
      const x2 = horizontal ? Math.min(w, x + stepX * len) : x
      const y2 = horizontal ? y : Math.min(h, y + stepY * len)
      const d = `M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`
      paths.push(d)
      traces += `<path d="${d}" stroke="${mainFill}" stroke-width="1.2" fill="none" opacity="0.35"/>`
      pads += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${mainFill}" opacity="0.5"/>`
    }
  }
  let pulses = ''
  if (animated) {
    for (let i = 0; i < Math.min(6, paths.length); i++) {
      const dur = (2.5 + rnd() * 2.5) * speed
      pulses += `<circle r="2.5" fill="${accent}">
        <animateMotion path="${paths[i]}" dur="${dur}s" repeatCount="indefinite" begin="-${(rnd() * dur).toFixed(1)}s"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="${dur}s" repeatCount="indefinite" begin="-${(rnd() * dur).toFixed(1)}s"/>
      </circle>`
    }
  }
  return { defs: '', back: traces + pads + pulses }
}

function skylineBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const skyId = `${uid}_sky`
  const defs = `<linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="${theme === 'dark' ? '#1a0e2e' : '#ffd9a0'}"/>
    <stop offset="55%" stop-color="${theme === 'dark' ? '#2c1250' : '#ff9d6c'}"/>
    <stop offset="100%" stop-color="${theme === 'dark' ? '#0a0815' : '#ffedd4'}"/>
  </linearGradient>`
  const rnd = seeded(uid.length * 13 + w)
  const baseY = h * 0.62
  let buildings = '', windows = ''
  let x = 0
  while (x < w) {
    const bw = 28 + rnd() * 34
    const bh = h * (0.15 + rnd() * 0.32)
    const by = h - bh
    buildings += `<rect x="${x.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${(h - by).toFixed(1)}" fill="${mainFill}" opacity="0.55"/>`
    const winCols = Math.max(1, Math.floor(bw / 10))
    const winRows = Math.max(1, Math.floor(bh / 14))
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        if (rnd() > 0.45) continue
        const wx = x + 4 + c * 9
        const wy = by + 6 + r * 13
        const dur = (2 + rnd() * 3) * speed
        windows += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="${accent}" opacity="0.7">
          ${animated ? `<animate attributeName="opacity" values="0.15;0.8;0.15" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}
        </rect>`
      }
    }
    x += bw + 3
  }
  const back = `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${skyId})"/>${buildings}${windows}`
  return { defs, back }
}

function blueprintBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const bgFillId = `${uid}_bpbg`
  const defs = `<linearGradient id="${bgFillId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#0b2a4a"/>
    <stop offset="100%" stop-color="#0e3a63"/>
  </linearGradient>`
  let grid = ''
  const minor = 16, major = 80
  for (let x = 0; x <= w; x += minor) {
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#5a9bd8" stroke-width="${x % major === 0 ? 1 : 0.4}" opacity="${x % major === 0 ? 0.35 : 0.15}"/>`
  }
  for (let y = 0; y <= h; y += minor) {
    grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#5a9bd8" stroke-width="${y % major === 0 ? 1 : 0.4}" opacity="${y % major === 0 ? 0.35 : 0.15}"/>`
  }
  const back = `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${bgFillId})"/>${grid}`
  return { defs, back }
}

function geometricBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 17 + w + h)
  const cols = 7, rows = 4
  const cw = w / cols, ch = h / rows
  let tris = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw, y = r * ch
      const flip = rnd() > 0.5
      const color = rnd() > 0.5 ? mainFill : accent
      const op = 0.06 + rnd() * 0.14
      const pts = flip
        ? `${x},${y} ${x + cw},${y} ${x},${y + ch}`
        : `${x + cw},${y} ${x + cw},${y + ch} ${x},${y + ch}`
      const dur = (4 + rnd() * 5) * speed
      tris += `<polygon points="${pts}" fill="${color}" opacity="${op.toFixed(2)}">
        ${animated ? `<animate attributeName="opacity" values="${op.toFixed(2)};${(op + 0.12).toFixed(2)};${op.toFixed(2)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}
      </polygon>`
    }
  }
  return { defs: '', back: tris }
}

function signalWaveBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 19 + w)
  const bars = Math.max(24, Math.floor(w / 14))
  const baseY = h * 0.88
  let bg = ''
  for (let i = 0; i < bars; i++) {
    const x = (i + 0.5) * (w / bars)
    const maxH = h * (0.12 + rnd() * 0.3)
    const dur = (0.8 + rnd() * 1.2) * speed
    const color = i % 4 === 0 ? accent : mainFill
    bg += `<rect x="${(x - 2).toFixed(1)}" y="${(baseY - maxH).toFixed(1)}" width="4" height="${maxH.toFixed(1)}" rx="2" fill="${color}" opacity="0.45">
      ${animated ? `<animate attributeName="height" values="${(maxH * 0.25).toFixed(1)};${maxH.toFixed(1)};${(maxH * 0.25).toFixed(1)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>
      <animate attributeName="y" values="${(baseY - maxH * 0.25).toFixed(1)};${(baseY - maxH).toFixed(1)};${(baseY - maxH * 0.25).toFixed(1)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}
    </rect>`
  }
  return { defs: '', back: bg }
}

function ribbonDecoration(w: number, h: number, uid: string, mainFill: string, glowFid: string, animated: boolean, speed: number) {
  const y = h * 0.55
  const amp = h * 0.1
  const d1 = `M0,${y} C${w * 0.25},${y - amp} ${w * 0.35},${y + amp} ${w * 0.6},${y} S${w * 0.85},${y - amp} ${w},${y}`
  const d2 = `M0,${y} C${w * 0.25},${y + amp} ${w * 0.35},${y - amp} ${w * 0.6},${y} S${w * 0.85},${y + amp} ${w},${y}`
  return `<path d="${d1}" fill="none" stroke="${mainFill}" stroke-width="${h * 0.16}" stroke-linecap="round" opacity="0.28" filter="url(#${glowFid})">
    ${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${9 * speed}s" repeatCount="indefinite"/>` : ''}
  </path>`
}

// ────────────────────────────────────────────────────────────────────────────

export function renderHeader(opts: HeaderOptions): string {
  const {
    name = 'Your Name',
    title = 'Full-Stack Developer',
    tagline = 'Building things that matter ✦',
    style = 'profile',
    width = 900,
    height = 280,
    wave = true,
    theme = 'dark',
    animated = true,
    speed = 1,
    particles = 16,
  } = opts

  const w = Math.min(Math.max(Number(width), 400), 1200)
  const h = Math.min(Math.max(Number(height), 120), 500)
  const spd = Math.min(Math.max(Number(speed) || 1, 0.3), 4)
  const uid = uniqueId('mhdr')

  // Resolve main color/gradient
  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const bg = opts.bg ?? (theme === 'dark' ? (m.shadow ?? '#080810') : '#f0f2f8')

  // Background gradient (base canvas, sits under every style's own background layer)
  const bgId = `${uid}_bg`
  const bgDefs = `<linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${theme === 'dark' ? '#080810' : '#f0f2f8'}"/>
    <stop offset="100%" stop-color="${theme === 'dark' ? '#0e0e1c' : '#e4e8f4'}"/>
  </linearGradient>`

  const textColor = theme === 'dark' ? '#e0e4f0' : '#141428'
  const dimColor = theme === 'dark' ? '#7880a0' : '#606080'
  const accentColor = m.glow

  // Decorative corner elements
  const cornerDeco = `
    <path d="M0,0 L40,0 L0,40 Z" fill="${mainFill}" opacity="0.6"/>
    <path d="M${w},0 L${w - 40},0 L${w},40 Z" fill="${mainFill}" opacity="0.6"/>
    <path d="M0,${h} L40,${h} L0,${h - 40} Z" fill="${mainFill}" opacity="0.4"/>
    <path d="M${w},${h} L${w - 40},${h} L${w},${h - 40} Z" fill="${mainFill}" opacity="0.4"/>`

  // Circuit decorations
  const circuits = `
    <line x1="${w * 0.7}" y1="20" x2="${w * 0.9}" y2="20" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <line x1="${w * 0.9}" y1="20" x2="${w * 0.9}" y2="50" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <circle cx="${w * 0.9}" cy="20" r="3" fill="${accentColor}" opacity="0.4"/>
    <circle cx="${w * 0.7}" cy="20" r="3" fill="${accentColor}" opacity="0.4"/>
    <line x1="${w * 0.1}" y1="${h - 20}" x2="${w * 0.3}" y2="${h - 20}" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <line x1="${w * 0.1}" y1="${h - 20}" x2="${w * 0.1}" y2="${h - 50}" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <circle cx="${w * 0.1}" cy="${h - 20}" r="3" fill="${accentColor}" opacity="0.4"/>`

  const waveEl = wave ? `
    <path d="${wavePath(w, h * 0.75, h * 0.12, 1, 0)} L${w},${h} L0,${h} Z"
      fill="${mainFill}" opacity="0.15"/>` : ''

  // Glow filter for hologram / liquid-metal / orbit / neon accents
  const { id: glowFid, defs: glowDefs } = buildFilter(
    { glow: true, glowColor: accentColor, glowStrength: 2 },
    `${uid}_hgf`
  )

  let content = ''
  let bgLayerDefs = ''
  let bgLayer = ''

  if (style === 'profile') {
    content = `
      <!-- Avatar circle -->
      <circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.32}"
        fill="url(#${bgId})" stroke="${mainFill}" stroke-width="3"/>
      <circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.28}"
        fill="${theme === 'dark' ? '#0e0e1c' : '#e8ecf8'}" opacity="0.5"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${w * 0.12}" cy="${h * 0.5}" r="${h * 0.28}"/></clipPath>
           <image href="${opts.avatar}" x="${w * 0.12 - h * 0.28}" y="${h * 0.5 - h * 0.28}"
             width="${h * 0.56}" height="${h * 0.56}" clip-path="url(#${uid}_avc)"
             preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${w * 0.12}" y="${h * 0.5 + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${h * 0.2}"
            fill="${mainFill}" opacity="0.6">${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}

      <!-- Name -->
      <text x="${w * 0.27}" y="${h * 0.35}"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(36, h * 0.15)}" font-weight="900"
        fill="${mainFill}" letter-spacing="2"
      >${escapeXml(name)}</text>

      <!-- Decorative line -->
      <rect x="${w * 0.27}" y="${h * 0.4}" width="${w * 0.35}" height="1" fill="${mainFill}" opacity="0.4"/>

      <!-- Title -->
      <text x="${w * 0.27}" y="${h * 0.52}"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(18, h * 0.08)}" font-weight="500"
        fill="${textColor}" letter-spacing="1.5" opacity="0.85"
      >${escapeXml(title)}</text>

      <!-- Tagline -->
      <text x="${w * 0.27}" y="${h * 0.67}"
        font-family="'Share Tech Mono',monospace"
        font-size="${Math.min(13, h * 0.055)}" fill="${dimColor}" letter-spacing="0.8"
      >${escapeXml(tagline)}</text>`

  } else if (style === 'cyber') {
    content = `
      <rect x="0" y="${h * 0.3}" width="${w * 0.4}" height="2" fill="${mainFill}" opacity="0.5"/>
      <rect x="${w * 0.6}" y="${h * 0.7}" width="${w * 0.4}" height="1" fill="${mainFill}" opacity="0.3"/>

      <!-- Shadow text -->
      <text x="${w / 2 + 2}" y="${h * 0.44 + 2}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(52, h * 0.22)}" font-weight="900"
        fill="${accentColor}" letter-spacing="6" opacity="0.2"
      >${escapeXml(name.toUpperCase())}</text>

      <!-- Main name -->
      <text x="${w / 2}" y="${h * 0.44}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(52, h * 0.22)}" font-weight="900"
        fill="${mainFill}" letter-spacing="6"
      >${escapeXml(name.toUpperCase())}</text>

      <!-- Title bar -->
      <rect x="${w * 0.28}" y="${h * 0.56}" width="${w * 0.44}" height="${h * 0.1}"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)'}" rx="2"/>
      <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace"
        font-size="${Math.min(14, h * 0.058)}" fill="${accentColor}" letter-spacing="3"
      >[ ${escapeXml(title.toUpperCase())} ]</text>`

  } else if (style === 'terminal') {
    content = `
      <!-- Terminal window -->
      <rect x="${w * 0.05}" y="${h * 0.1}" width="${w * 0.9}" height="${h * 0.8}" rx="8"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)'}"
        stroke="${mainFill}" stroke-width="1"/>
      <!-- Title bar -->
      <rect x="${w * 0.05}" y="${h * 0.1}" width="${w * 0.9}" height="${h * 0.15}" rx="8"
        fill="${mainFill}" opacity="0.8"/>
      <rect x="${w * 0.05}" y="${h * 0.17}" width="${w * 0.9}" height="${h * 0.08}" fill="${mainFill}" opacity="0.8"/>
      <!-- Traffic lights -->
      <circle cx="${w * 0.09}" cy="${h * 0.175}" r="6" fill="#ff5f57"/>
      <circle cx="${w * 0.115}" cy="${h * 0.175}" r="6" fill="#febc2e"/>
      <circle cx="${w * 0.14}" cy="${h * 0.175}" r="6" fill="#28c840"/>
      <!-- Title -->
      <text x="${w / 2}" y="${h * 0.19}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${textColor}"
      >metalforge — profile.sh</text>
      <!-- Content -->
      <text x="${w * 0.09}" y="${h * 0.42}" font-family="'Share Tech Mono',monospace" font-size="13"
        fill="${accentColor}">$ whoami</text>
      <text x="${w * 0.09}" y="${h * 0.56}" font-family="'Share Tech Mono',monospace" font-size="14" font-weight="700"
        fill="${textColor}">${escapeXml(name)}</text>
      <text x="${w * 0.09}" y="${h * 0.7}" font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${accentColor}">$ echo $ROLE</text>
      <text x="${w * 0.09}" y="${h * 0.84}" font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${dimColor}">${escapeXml(title)} · ${escapeXml(tagline)}</text>
      <!-- Cursor -->
      <rect x="${w * 0.09}" y="${h * 0.78}" width="8" height="14" fill="${accentColor}" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.2s" repeatCount="indefinite"/>
      </rect>`

  } else if (style === 'hologram') {
    // Scan lines
    const scanLines = Array.from({ length: 20 }, (_, i) =>
      `<line x1="0" y1="${i * h / 20}" x2="${w}" y2="${i * h / 20}" stroke="${accentColor}" stroke-opacity="0.06" stroke-width="1"/>`
    ).join('')

    bgLayer = scanLines
    content = `
      <!-- Glow name -->
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(48, h * 0.2)}" font-weight="900"
        fill="${accentColor}" letter-spacing="4" opacity="0.9"
        filter="url(#${glowFid})"
      >${escapeXml(name)}
        ${animated ? `<animate attributeName="opacity" values="0.9;0.6;0.95;0.9" dur="${4 * spd}s" repeatCount="indefinite"/>` : ''}
      </text>
      <!-- Shimmer duplicate -->
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(48, h * 0.2)}" font-weight="900"
        fill="white" letter-spacing="4" opacity="0.3"
      >${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(16, h * 0.07)}" letter-spacing="4"
        fill="${accentColor}" opacity="0.7"
      >${escapeXml(title.toUpperCase())}</text>`

  } else if (style === 'aurora') {
    const bgRes = auroraBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayerDefs = bgRes.defs
    bgLayer = bgRes.back
    content = `
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(46, h * 0.19)}" font-weight="900"
        fill="${textColor}" letter-spacing="3" filter="url(#${glowFid})"
      >${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.58}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(17, h * 0.075)}" fill="${accentColor}" letter-spacing="2" opacity="0.9"
      >${escapeXml(title)}</text>
      ${tagline ? `<text x="${w / 2}" y="${h * 0.72}" text-anchor="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(13, h * 0.055)}"
        fill="${dimColor}" letter-spacing="0.5"
      >${escapeXml(tagline)}</text>` : ''}`

  } else if (style === 'matrix') {
    const bgRes = matrixBg(w, h, uid, accentColor, animated, spd)
    bgLayerDefs = bgRes.defs
    bgLayer = bgRes.back
    content = `
      <rect x="${w * 0.08}" y="${h * 0.3}" width="${w * 0.84}" height="${h * 0.4}" rx="6"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'}" stroke="${accentColor}" stroke-width="1"/>
      <text x="${w * 0.12}" y="${h * 0.42}" font-family="'Share Tech Mono',monospace" font-size="13"
        fill="${accentColor}">&gt; whoami_</text>
      <text x="${w * 0.12}" y="${h * 0.55}" font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(28, h * 0.12)}"
        font-weight="900" fill="${textColor}" letter-spacing="1">${escapeXml(name)}</text>
      <text x="${w * 0.12}" y="${h * 0.67}" font-family="'Share Tech Mono',monospace" font-size="12"
        fill="${dimColor}">${escapeXml(title)}</text>`

  } else if (style === 'wave-flow') {
    const bgRes = waveFlowBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayer = bgRes.back
    content = `
      <circle cx="${w * 0.12}" cy="${h * 0.42}" r="${h * 0.28}"
        fill="url(#${bgId})" stroke="${mainFill}" stroke-width="3"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${w * 0.12}" cy="${h * 0.42}" r="${h * 0.24}"/></clipPath>
           <image href="${opts.avatar}" x="${w * 0.12 - h * 0.24}" y="${h * 0.42 - h * 0.24}"
             width="${h * 0.48}" height="${h * 0.48}" clip-path="url(#${uid}_avc)" preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${w * 0.12}" y="${h * 0.42 + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${h * 0.17}" fill="${mainFill}" opacity="0.6"
          >${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}
      <text x="${w * 0.26}" y="${h * 0.34}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(32, h * 0.14)}"
        font-weight="900" fill="${mainFill}" letter-spacing="1.5">${escapeXml(name)}</text>
      <text x="${w * 0.26}" y="${h * 0.48}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${textColor}" opacity="0.85" letter-spacing="1">${escapeXml(title)}</text>
      <text x="${w * 0.26}" y="${h * 0.6}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}">${escapeXml(tagline)}</text>`

  } else if (style === 'particles') {
    const bgRes = particlesBg(w, h, uid, accentColor, mainFill, animated, spd, Math.min(Math.max(Number(particles) || 16, 4), 40))
    bgLayer = bgRes.back
    content = `
      <text x="${w / 2}" y="${h * 0.44}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(40, h * 0.17)}"
        font-weight="900" fill="${mainFill}" letter-spacing="3">${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.6}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${textColor}" opacity="0.8" letter-spacing="2">${escapeXml(title.toUpperCase())}</text>`

  } else if (style === 'neon-grid') {
    const bgRes = neonGridBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayerDefs = bgRes.defs
    bgLayer = bgRes.back
    content = `
      <text x="${w / 2}" y="${h * 0.36}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(46, h * 0.2)}"
        font-weight="900" fill="${textColor}" letter-spacing="4" filter="url(#${glowFid})"
      >${escapeXml(name.toUpperCase())}</text>
      <text x="${w / 2}" y="${h * 0.5}" text-anchor="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(14, h * 0.06)}"
        fill="${accentColor}" letter-spacing="3">[ ${escapeXml(title.toUpperCase())} ]</text>`

  } else if (style === 'liquid-metal') {
    const cx = w * 0.14, cy = h * 0.5, r = h * 0.3
    bgLayer = liquidMetalBlob(cx, cy, r, uid, mainFill, glowFid, animated, spd)
    content = `
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${cx}" cy="${cy}" r="${r * 0.8}"/></clipPath>
           <image href="${opts.avatar}" x="${cx - r * 0.8}" y="${cy - r * 0.8}"
             width="${r * 1.6}" height="${r * 1.6}" clip-path="url(#${uid}_avc)" preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${cx}" y="${cy + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${r * 0.7}" fill="${mainFill}"
          >${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}
      <text x="${w * 0.3}" y="${h * 0.36}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(34, h * 0.15)}"
        font-weight="900" fill="${mainFill}" letter-spacing="2">${escapeXml(name)}</text>
      <text x="${w * 0.3}" y="${h * 0.5}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${textColor}" opacity="0.85" letter-spacing="1.5">${escapeXml(title)}</text>
      <text x="${w * 0.3}" y="${h * 0.63}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}">${escapeXml(tagline)}</text>`

  } else if (style === 'orbit') {
    const cx = w * 0.16, cy = h * 0.5, r = h * 0.2
    bgLayer = orbitRings(cx, cy, r, uid, mainFill, accentColor, animated, spd)
    content = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${bgId})" stroke="${mainFill}" stroke-width="2.5"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${cx}" cy="${cy}" r="${r * 0.85}"/></clipPath>
           <image href="${opts.avatar}" x="${cx - r * 0.85}" y="${cy - r * 0.85}"
             width="${r * 1.7}" height="${r * 1.7}" clip-path="url(#${uid}_avc)" preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${cx}" y="${cy + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${r * 0.7}" fill="${mainFill}" opacity="0.7"
          >${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}
      <text x="${w * 0.34}" y="${h * 0.4}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(30, h * 0.13)}"
        font-weight="900" fill="${mainFill}" letter-spacing="1.5">${escapeXml(name)}</text>
      <text x="${w * 0.34}" y="${h * 0.54}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(15, h * 0.065)}"
        fill="${textColor}" opacity="0.85" letter-spacing="1.5">${escapeXml(title)}</text>
      <text x="${w * 0.34}" y="${h * 0.66}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}">${escapeXml(tagline)}</text>`

  } else if (style === 'gradient-mesh') {
    const bgRes = gradientMeshBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    bgLayerDefs = bgRes.defs
    bgLayer = bgRes.back
    content = `
      <text x="${w * 0.07}" y="${h * 0.45}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(38, h * 0.16)}"
        font-weight="900" fill="${textColor}" letter-spacing="1">${escapeXml(name)}</text>
      <text x="${w * 0.07}" y="${h * 0.6}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${textColor}" opacity="0.75" letter-spacing="1">${escapeXml(title)}</text>
      <text x="${w * 0.07}" y="${h * 0.72}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}">${escapeXml(tagline)}</text>`

  } else if (style === 'glass') {
    const meshRes = gradientMeshBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    const panel = glassPanel(w, h, uid, theme, mainFill)
    bgLayerDefs = meshRes.defs + panel.defs
    bgLayer = meshRes.back + panel.back
    const pad = panel.contentInset
    content = `
      <circle cx="${pad + h * 0.16}" cy="${h * 0.5}" r="${h * 0.24}"
        fill="${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)'}" stroke="${mainFill}" stroke-width="2"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${pad + h * 0.16}" cy="${h * 0.5}" r="${h * 0.2}"/></clipPath>
           <image href="${opts.avatar}" x="${pad + h * 0.16 - h * 0.2}" y="${h * 0.5 - h * 0.2}"
             width="${h * 0.4}" height="${h * 0.4}" clip-path="url(#${uid}_avc)" preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${pad + h * 0.16}" y="${h * 0.5 + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${h * 0.15}" fill="${mainFill}"
          >${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}
      <text x="${pad + h * 0.4}" y="${h * 0.4}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(30, h * 0.13)}"
        font-weight="900" fill="${textColor}" letter-spacing="1.5">${escapeXml(name)}</text>
      <text x="${pad + h * 0.4}" y="${h * 0.54}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(15, h * 0.065)}"
        fill="${accentColor}" opacity="0.9" letter-spacing="1.5">${escapeXml(title)}</text>
      <text x="${pad + h * 0.4}" y="${h * 0.67}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}">${escapeXml(tagline)}</text>`

  } else if (style === 'split') {
    const res = splitBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    bgLayerDefs = res.defs
    bgLayer = res.back
    content = `
      <circle cx="${res.splitX * 0.4}" cy="${h * 0.5}" r="${h * 0.26}"
        fill="url(#${bgId})" stroke="${mainFill}" stroke-width="3"/>
      ${opts.avatar
        ? `<clipPath id="${uid}_avc"><circle cx="${res.splitX * 0.4}" cy="${h * 0.5}" r="${h * 0.22}"/></clipPath>
           <image href="${opts.avatar}" x="${res.splitX * 0.4 - h * 0.22}" y="${h * 0.5 - h * 0.22}"
             width="${h * 0.44}" height="${h * 0.44}" clip-path="url(#${uid}_avc)" preserveAspectRatio="xMidYMid slice"/>`
        : `<text x="${res.splitX * 0.4}" y="${h * 0.5 + 5}" text-anchor="middle" dominant-baseline="middle"
            font-family="'Orbitron',sans-serif" font-size="${h * 0.18}" fill="${mainFill}" opacity="0.7"
          >${escapeXml((name[0] ?? '?').toUpperCase())}</text>`}
      <text x="${res.splitX + w * 0.06}" y="${h * 0.4}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(32, h * 0.14)}"
        font-weight="900" fill="${theme === 'dark' ? '#ffffff' : '#141428'}" letter-spacing="1.5"
      >${escapeXml(name)}</text>
      <text x="${res.splitX + w * 0.06}" y="${h * 0.55}"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${theme === 'dark' ? '#ffffff' : '#141428'}" opacity="0.8" letter-spacing="1.5"
      >${escapeXml(title)}</text>
      <text x="${res.splitX + w * 0.06}" y="${h * 0.68}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${theme === 'dark' ? '#ffffff' : '#141428'}" opacity="0.6"
      >${escapeXml(tagline)}</text>`

  } else if (style === 'constellation') {
    const res = constellationBg(w, h, uid, accentColor, animated, spd, Math.min(Math.max(Number(particles) || 26, 8), 60))
    bgLayer = res.back
    content = `
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(40, h * 0.17)}"
        font-weight="900" fill="#ffffff" letter-spacing="2" filter="url(#${glowFid})"
      >${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.58}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${accentColor}" opacity="0.9" letter-spacing="2"
      >${escapeXml(title.toUpperCase())}</text>`

  } else if (style === 'circuit-board') {
    const res = circuitBoardBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayer = res.back
    content = `
      <rect x="${w * 0.24}" y="${h * 0.32}" width="${w * 0.52}" height="${h * 0.36}" rx="6"
        fill="${theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)'}" stroke="${mainFill}" stroke-width="1"/>
      <text x="${w / 2}" y="${h * 0.46}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(28, h * 0.12)}"
        font-weight="900" fill="${textColor}" letter-spacing="1">${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.6}" text-anchor="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(13, h * 0.055)}"
        fill="${accentColor}">${escapeXml(title)}</text>`

  } else if (style === 'skyline') {
    const res = skylineBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    bgLayerDefs = res.defs
    bgLayer = res.back
    content = `
      <text x="${w / 2}" y="${h * 0.28}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(38, h * 0.16)}"
        font-weight="900" fill="#ffffff" letter-spacing="2" opacity="0.95"
      >${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.4}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(15, h * 0.065)}"
        fill="#ffe8c0" opacity="0.85" letter-spacing="2">${escapeXml(title.toUpperCase())}</text>`

  } else if (style === 'blueprint') {
    const res = blueprintBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayerDefs = res.defs
    bgLayer = res.back
    content = `
      <rect x="${w - 210}" y="${h - 64}" width="190" height="46" fill="none" stroke="#5a9bd8" stroke-width="1.2" opacity="0.7"/>
      <line x1="${w - 210}" y1="${h - 42}" x2="${w - 20}" y2="${h - 42}" stroke="#5a9bd8" stroke-width="1" opacity="0.5"/>
      <text x="${w - 200}" y="${h - 50}" font-family="'Share Tech Mono',monospace" font-size="9" fill="#5a9bd8" opacity="0.8">TITLE</text>
      <text x="${w - 200}" y="${h - 28}" font-family="'Share Tech Mono',monospace" font-size="11" fill="#cfe8ff">${escapeXml(title)}</text>
      <text x="${w * 0.06}" y="${h * 0.46}"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(40, h * 0.17)}"
        font-weight="900" fill="#cfe8ff" letter-spacing="2">${escapeXml(name)}</text>
      <line x1="${w * 0.06}" y1="${h * 0.52}" x2="${w * 0.06 + Math.min(name.length * 24, w * 0.5)}" y2="${h * 0.52}"
        stroke="#5a9bd8" stroke-width="1" stroke-dasharray="4 3" opacity="0.6"/>
      <text x="${w * 0.06}" y="${h * 0.66}"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="#8fc4ec">${escapeXml(tagline)}</text>`

  } else if (style === 'geometric') {
    const res = geometricBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    bgLayer = res.back
    content = `
      <text x="${w / 2}" y="${h * 0.46}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(40, h * 0.17)}"
        font-weight="900" fill="${textColor}" letter-spacing="2">${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${dimColor}" letter-spacing="1.5">${escapeXml(title)}</text>`

  } else if (style === 'signal-wave') {
    const res = signalWaveBg(w, h, uid, mainFill, accentColor, animated, spd)
    bgLayer = res.back
    content = `
      <text x="${w / 2}" y="${h * 0.34}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(38, h * 0.16)}"
        font-weight="900" fill="${mainFill}" letter-spacing="2">${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.48}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(15, h * 0.065)}"
        fill="${textColor}" opacity="0.85" letter-spacing="2">${escapeXml(title.toUpperCase())}</text>`

  } else if (style === 'ribbon') {
    bgLayer = ribbonDecoration(w, h, uid, mainFill, glowFid, animated, spd)
    content = `
      <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle"
        font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(42, h * 0.18)}"
        font-weight="900" fill="${textColor}" letter-spacing="2">${escapeXml(name)}</text>
      <text x="${w / 2}" y="${h * 0.58}" text-anchor="middle"
        font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(16, h * 0.07)}"
        fill="${dimColor}" letter-spacing="1.5">${escapeXml(title)}</text>
      ${tagline ? `<text x="${w / 2}" y="${h * 0.72}" text-anchor="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.05)}"
        fill="${dimColor}" opacity="0.8">${escapeXml(tagline)}</text>` : ''}`

  } else {
    // minimal
    content = `
      <text x="${w * 0.06}" y="${h * 0.5}" dominant-baseline="middle"
        font-family="'Orbitron','Arial Black',sans-serif"
        font-size="${Math.min(42, h * 0.18)}" font-weight="900"
        fill="${mainFill}" letter-spacing="2"
      >${escapeXml(name)}</text>
      <rect x="${w * 0.06}" y="${h * 0.56}" width="${Math.min(name.length * 28, w * 0.5)}" height="2"
        fill="${mainFill}" opacity="0.5"/>
      <text x="${w * 0.06}" y="${h * 0.7}"
        font-family="'Rajdhani',Arial,sans-serif"
        font-size="${Math.min(16, h * 0.07)}" font-weight="500"
        fill="${textColor}" letter-spacing="2" opacity="0.7"
      >${escapeXml(title)}</text>`
  }

  // Styles with fully custom immersive backgrounds skip the generic corner/circuit/wave chrome
  const customBgStyles: HeaderStyle[] = [
    'aurora', 'matrix', 'wave-flow', 'particles', 'neon-grid',
    'liquid-metal', 'orbit', 'gradient-mesh', 'glass', 'hologram',
    'split', 'constellation', 'circuit-board', 'skyline',
    'blueprint', 'geometric', 'signal-wave', 'ribbon',
  ]
  const showGenericChrome = !customBgStyles.includes(style)

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${name} — GitHub Profile Header">
  <title>${name} Profile Header</title>
  <defs>
    ${mainDefs}
    ${bgDefs}
    ${glowDefs}
    ${bgLayerDefs}
  </defs>

  <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
  ${bgLayer}
  ${showGenericChrome ? cornerDeco : ''}
  ${showGenericChrome ? circuits : ''}
  ${showGenericChrome ? waveEl : ''}

  <!-- Border -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none"
    stroke="${mainFill}" stroke-width="1.5" opacity="0.5"/>
  <!-- Top accent strip -->
  <rect width="${w}" height="3" fill="${mainFill}"/>

  ${content}
</svg>`
}