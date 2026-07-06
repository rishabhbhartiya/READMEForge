// src/lib/renderers/footer.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  getThemeColors, Theme, uniqueId, wavePath,
} from '../metals'

export type FooterStyle =
  | 'wave' | 'minimal' | 'cyber' | 'credits' | 'snake' | 'terminal' | 'hologram'
  | 'aurora' | 'matrix' | 'wave-flow' | 'particles' | 'neon-grid'
  | 'liquid-metal' | 'orbit' | 'gradient-mesh' | 'glass'
  | 'split' | 'constellation' | 'circuit-board' | 'skyline'
  | 'blueprint' | 'geometric' | 'signal-wave' | 'ribbon'

export interface FooterOptions {
  text?: string
  subtext?: string
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: FooterStyle
  width?: number
  height?: number
  /** Comma-separated link labels. NOTE: SVG <text> links are NOT clickable in GitHub README.
   *  To make clickable links, wrap the SVG URL in markdown: [![label](svg-url)](https://url) */
  links?: string
  theme?: Theme
  bg?: string
  /** Enable SMIL animations (flowing/moving backgrounds). Default true. */
  animated?: boolean
  /** Animation speed multiplier — lower is faster. Default 1. */
  speed?: number
  /** Particle count for 'particles' / 'constellation' styles. Default 16. */
  particles?: number
}

function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function auroraBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const fid = `${uid}_ablur`
  const defs = `<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${h * 0.12}"/></filter>`
  const bands = [
    { y: h * 0.3, amp: h * 0.18, color: mainFill, op: 0.32, dur: 9 * speed },
    { y: h * 0.6, amp: h * 0.22, color: accent, op: 0.24, dur: 12 * speed },
  ]
  const back = bands.map(b => {
    const d1 = `${wavePath(w, b.y, b.amp, 1, 0)} L${w},${h} L0,${h} Z`
    const d2 = `${wavePath(w, b.y, b.amp, 1, Math.PI)} L${w},${h} L0,${h} Z`
    return `<path d="${d1}" fill="${b.color}" opacity="${b.op}" filter="url(#${fid})">${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${b.dur}s" repeatCount="indefinite"/>` : ''}</path>`
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
    const len = 3 + Math.floor(rnd() * 3)
    const dur = (4 + rnd() * 4) * speed
    const delay = -rnd() * dur
    const glyphs = Array.from({ length: len }, () => chars[Math.floor(rnd() * chars.length)])
    const tspans = glyphs.map((g, gi) => `<tspan x="${x}" dy="${gi === 0 ? 0 : 14}" opacity="${1 - gi / len}">${g}</tspan>`).join('')
    back += `<g clip-path="url(#${clipId})"><text font-family="'Share Tech Mono',monospace" font-size="12" fill="${accent}" opacity="0.5">${tspans}${animated ? `<animateTransform attributeName="transform" type="translate" from="0,-${len * 14 + 16}" to="0,${h + 16}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>` : `<animateTransform attributeName="transform" type="translate" values="0,${h * 0.4}" dur="1s"/>`}</text></g>`
  }
  return { defs, back }
}

function waveFlowBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const layers = [
    { y: h * 0.55, amp: h * 0.1, color: mainFill, op: 0.45, dur: 7 * speed },
    { y: h * 0.72, amp: h * 0.07, color: accent, op: 0.28, dur: 11 * speed },
  ]
  const back = layers.map(l => {
    const seg = `${wavePath(w, l.y, l.amp, 2, 0)} L${w},${h} L0,${h} Z`
    return `<g><path d="${seg}" fill="${l.color}" opacity="${l.op}" transform="translate(0,0)">${animated ? `<animateTransform attributeName="transform" type="translate" from="0,0" to="-${w},0" dur="${l.dur}s" repeatCount="indefinite"/>` : ''}</path><path d="${seg}" fill="${l.color}" opacity="${l.op}" transform="translate(${w},0)">${animated ? `<animateTransform attributeName="transform" type="translate" from="${w},0" to="0,0" dur="${l.dur}s" repeatCount="indefinite"/>` : ''}</path></g>`
  }).join('')
  return { defs: '', back }
}

function particlesBg(w: number, h: number, uid: string, accent: string, mainFill: string, animated: boolean, speed: number, count: number) {
  const rnd = seeded(uid.length * 7 + w)
  let back = ''
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const x = rnd() * w, y = rnd() * h
    pts.push({ x, y })
    const r = 1.2 + rnd() * 2
    const dur = (3 + rnd() * 4) * speed
    const drift = 6 + rnd() * 10
    const color = i % 3 === 0 ? accent : mainFill
    back += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="0.5">${animated ? `<animate attributeName="cy" values="${y.toFixed(1)};${(y - drift).toFixed(1)};${y.toFixed(1)}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;0.7;0.2" dur="${dur}s" repeatCount="indefinite"/>` : ''}</circle>`
  }
  let lines = ''
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
      if (Math.sqrt(dx * dx + dy * dy) < w * 0.14) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${accent}" stroke-width="0.6" opacity="0.12"/>`
      }
    }
  }
  return { defs: '', back: lines + back }
}

function neonGridBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const horizonY = h * 0.4
  const sunId = `${uid}_sun`
  const defs = `<radialGradient id="${sunId}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/><stop offset="70%" stop-color="${mainFill}" stop-opacity="0.3"/><stop offset="100%" stop-color="${mainFill}" stop-opacity="0"/></radialGradient>`
  const vpx = w / 2
  let verticals = ''
  for (let i = 0; i <= 9; i++) {
    const t = i / 9
    verticals += `<line x1="${vpx}" y1="${horizonY}" x2="${t * w}" y2="${h}" stroke="${mainFill}" stroke-width="1" opacity="0.25"/>`
  }
  let horizontals = ''
  for (let i = 0; i < 5; i++) {
    const t = i / 5
    const y = horizonY + Math.pow(t, 2.2) * (h - horizonY)
    const dur = (2.2 + i * 0.4) * speed
    horizontals += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${mainFill}" stroke-width="1" opacity="${0.3 - t * 0.15}">${animated ? `<animate attributeName="opacity" values="0;${0.35 - t * 0.15};0" dur="${dur}s" repeatCount="indefinite"/>` : ''}</line>`
  }
  const back = `<circle cx="${vpx}" cy="${horizonY}" r="${h * 0.3}" fill="url(#${sunId})"/><line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="${accent}" stroke-width="1.5" opacity="0.45"/>${verticals}${horizontals}`
  return { defs, back }
}

function liquidMetalBlob(cx: number, cy: number, r: number, uid: string, mainFill: string, glowFid: string, animated: boolean, speed: number) {
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
  return `<path d="${d1}" fill="${mainFill}" opacity="0.26" filter="url(#${glowFid})">${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${8 * speed}s" repeatCount="indefinite"/>` : ''}</path>`
}

function orbitRings(cx: number, cy: number, r: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 1.6}" fill="none" stroke="${mainFill}" stroke-width="1" stroke-dasharray="2 6" opacity="0.4">${animated ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${18 * speed}s" repeatCount="indefinite"/>` : ''}</circle><g><circle cx="${cx + r * 1.6}" cy="${cy}" r="3.5" fill="${accent}"/>${animated ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${18 * speed}s" repeatCount="indefinite"/>` : ''}</g>`
}

function gradientMeshBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const fid = `${uid}_meshblur`
  const defs = `<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${h * 0.2}"/></filter>`
  const blobs = [
    { x: w * 0.12, y: h * 0.3, r: h * 0.6, color: mainFill, op: 0.5 },
    { x: w * 0.85, y: h * 0.6, r: h * 0.5, color: accent, op: 0.4 },
  ]
  const back = `<g filter="url(#${fid})">` + blobs.map((b, i) => {
    const dx = 18 + i * 8, dy = 12 + i * 6
    return `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="${b.color}" opacity="${b.op}">${animated ? `<animate attributeName="cx" values="${b.x};${b.x + dx};${b.x}" dur="${(10 + i * 3) * speed}s" repeatCount="indefinite"/><animate attributeName="cy" values="${b.y};${b.y - dy};${b.y}" dur="${(13 + i * 2) * speed}s" repeatCount="indefinite"/>` : ''}</circle>`
  }).join('') + '</g>'
  return { defs, back }
}

function glassPanel(w: number, h: number, uid: string, theme: Theme) {
  const pad = h * 0.1
  const panelFill = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)'
  const strokeC = theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)'
  const hiId = `${uid}_glasshi`
  const defs = `<linearGradient id="${hiId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="35%" stop-color="#ffffff" stop-opacity="0"/></linearGradient>`
  const back = `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="16" fill="${panelFill}" stroke="${strokeC}" stroke-width="1.5"/><rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="16" fill="url(#${hiId})"/>`
  return { defs, back }
}

function splitBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme) {
  const splitX = w * 0.58
  const skew = h * 0.5
  const rightId = `${uid}_splitr`
  const defs = `<clipPath id="${uid}_splitclip"><path d="M${splitX},0 L${w},0 L${w},${h} L${splitX - skew},${h} Z"/></clipPath><linearGradient id="${rightId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${mainFill}"/><stop offset="100%" stop-color="${theme === 'dark' ? '#000000' : '#ffffff'}" stop-opacity="0.15"/></linearGradient>`
  const back = `<rect x="0" y="0" width="${w}" height="${h}" clip-path="url(#${uid}_splitclip)" fill="url(#${rightId})"/><line x1="${splitX}" y1="0" x2="${splitX - skew}" y2="${h}" stroke="${accent}" stroke-width="2" opacity="0.6"/>`
  return { defs, back }
}

function constellationBg(w: number, h: number, uid: string, accent: string, animated: boolean, speed: number, count: number) {
  const rnd = seeded(uid.length * 11 + w + 3)
  const pts: { x: number; y: number; r: number }[] = []
  let stars = ''
  for (let i = 0; i < count; i++) {
    const x = rnd() * w, y = rnd() * h
    const r = 0.7 + rnd() * 1.4
    pts.push({ x, y, r })
    const dur = (2 + rnd() * 3) * speed
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#ffffff" opacity="0.7">${animated ? `<animate attributeName="opacity" values="0.2;0.9;0.2" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}</circle>`
  }
  let lines = ''
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
      if (Math.sqrt(dx * dx + dy * dy) < w * 0.12) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${accent}" stroke-width="0.5" opacity="0.16"/>`
      }
    }
  }
  return { defs: '', back: lines + stars }
}

function circuitBoardBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 5 + h)
  const rows = 3, cols = 9
  let traces = '', pads = ''
  const stepX = w / cols, stepY = h / rows
  const paths: string[] = []
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      if (rnd() > 0.55) continue
      const x = c * stepX, y = r * stepY
      const horizontal = rnd() > 0.5
      const len = 0.6 + rnd() * 0.8
      const x2 = horizontal ? Math.min(w, x + stepX * len) : x
      const y2 = horizontal ? y : Math.min(h, y + stepY * len)
      const d = `M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`
      paths.push(d)
      traces += `<path d="${d}" stroke="${mainFill}" stroke-width="1.2" fill="none" opacity="0.3"/>`
      pads += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="${mainFill}" opacity="0.45"/>`
    }
  }
  let pulses = ''
  if (animated) {
    for (let i = 0; i < Math.min(5, paths.length); i++) {
      const dur = (2.5 + rnd() * 2.5) * speed
      pulses += `<circle r="2.2" fill="${accent}"><animateMotion path="${paths[i]}" dur="${dur}s" repeatCount="indefinite" begin="-${(rnd() * dur).toFixed(1)}s"/><animate attributeName="opacity" values="0;1;1;0" dur="${dur}s" repeatCount="indefinite" begin="-${(rnd() * dur).toFixed(1)}s"/></circle>`
    }
  }
  return { defs: '', back: traces + pads + pulses }
}

function skylineBg(w: number, h: number, uid: string, mainFill: string, accent: string, theme: Theme, animated: boolean, speed: number) {
  const skyId = `${uid}_sky`
  const defs = `<linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${theme === 'dark' ? '#1a0e2e' : '#ffd9a0'}"/><stop offset="55%" stop-color="${theme === 'dark' ? '#2c1250' : '#ff9d6c'}"/><stop offset="100%" stop-color="${theme === 'dark' ? '#0a0815' : '#ffedd4'}"/></linearGradient>`
  const rnd = seeded(uid.length * 13 + w)
  let buildings = '', windows = ''
  let x = 0
  while (x < w) {
    const bw = 22 + rnd() * 26
    const bh = h * (0.35 + rnd() * 0.5)
    const by = h - bh
    buildings += `<rect x="${x.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${(h - by).toFixed(1)}" fill="${mainFill}" opacity="0.55"/>`
    const winCols = Math.max(1, Math.floor(bw / 9))
    const winRows = Math.max(1, Math.floor(bh / 12))
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        if (rnd() > 0.45) continue
        const wx = x + 3 + c * 8, wy = by + 5 + r * 11
        const dur = (2 + rnd() * 3) * speed
        windows += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3.5" height="5" fill="${accent}" opacity="0.7">${animated ? `<animate attributeName="opacity" values="0.15;0.8;0.15" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}</rect>`
      }
    }
    x += bw + 3
  }
  return { defs, back: `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${skyId})"/>${buildings}${windows}` }
}

function blueprintBg(w: number, h: number, uid: string) {
  const bgFillId = `${uid}_bpbg`
  const defs = `<linearGradient id="${bgFillId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0b2a4a"/><stop offset="100%" stop-color="#0e3a63"/></linearGradient>`
  let grid = ''
  const minor = 16, major = 80
  for (let x = 0; x <= w; x += minor) {
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#5a9bd8" stroke-width="${x % major === 0 ? 1 : 0.4}" opacity="${x % major === 0 ? 0.35 : 0.15}"/>`
  }
  for (let y = 0; y <= h; y += minor) {
    grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#5a9bd8" stroke-width="${y % major === 0 ? 1 : 0.4}" opacity="${y % major === 0 ? 0.35 : 0.15}"/>`
  }
  return { defs, back: `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${bgFillId})"/>${grid}` }
}

function geometricBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 17 + w + h)
  const cols = 8, rows = 2
  const cw = w / cols, ch = h / rows
  let tris = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw, y = r * ch
      const flip = rnd() > 0.5
      const color = rnd() > 0.5 ? mainFill : accent
      const op = 0.06 + rnd() * 0.14
      const pts = flip ? `${x},${y} ${x + cw},${y} ${x},${y + ch}` : `${x + cw},${y} ${x + cw},${y + ch} ${x},${y + ch}`
      const dur = (4 + rnd() * 5) * speed
      tris += `<polygon points="${pts}" fill="${color}" opacity="${op.toFixed(2)}">${animated ? `<animate attributeName="opacity" values="${op.toFixed(2)};${(op + 0.12).toFixed(2)};${op.toFixed(2)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}</polygon>`
    }
  }
  return { defs: '', back: tris }
}

function signalWaveBg(w: number, h: number, uid: string, mainFill: string, accent: string, animated: boolean, speed: number) {
  const rnd = seeded(uid.length * 19 + w)
  const bars = Math.max(24, Math.floor(w / 14))
  const baseY = h * 0.92
  let bg = ''
  for (let i = 0; i < bars; i++) {
    const x = (i + 0.5) * (w / bars)
    const maxH = h * (0.15 + rnd() * 0.4)
    const dur = (0.8 + rnd() * 1.2) * speed
    const color = i % 4 === 0 ? accent : mainFill
    bg += `<rect x="${(x - 2).toFixed(1)}" y="${(baseY - maxH).toFixed(1)}" width="4" height="${maxH.toFixed(1)}" rx="2" fill="${color}" opacity="0.4">${animated ? `<animate attributeName="height" values="${(maxH * 0.25).toFixed(1)};${maxH.toFixed(1)};${(maxH * 0.25).toFixed(1)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="y" values="${(baseY - maxH * 0.25).toFixed(1)};${(baseY - maxH).toFixed(1)};${(baseY - maxH * 0.25).toFixed(1)}" dur="${dur}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite"/>` : ''}</rect>`
  }
  return { defs: '', back: bg }
}

function ribbonDecoration(w: number, h: number, mainFill: string, glowFid: string, animated: boolean, speed: number) {
  const y = h * 0.5
  const amp = h * 0.12
  const d1 = `M0,${y} C${w * 0.25},${y - amp} ${w * 0.35},${y + amp} ${w * 0.6},${y} S${w * 0.85},${y - amp} ${w},${y}`
  const d2 = `M0,${y} C${w * 0.25},${y + amp} ${w * 0.35},${y - amp} ${w * 0.6},${y} S${w * 0.85},${y + amp} ${w},${y}`
  return `<path d="${d1}" fill="none" stroke="${mainFill}" stroke-width="${h * 0.2}" stroke-linecap="round" opacity="0.24" filter="url(#${glowFid})">${animated ? `<animate attributeName="d" values="${d1};${d2};${d1}" dur="${9 * speed}s" repeatCount="indefinite"/>` : ''}</path>`
}

function buildFilterLocal(uid: string) {
  const id = `${uid}_gf`
  const defs = `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
  return { id, defs }
}

export function renderFooter(opts: FooterOptions): string {
  const {
    text = 'Thanks for visiting!',
    subtext = 'Made with ♦ and Metal Forage',
    style = 'wave',
    links = '',
    theme = 'dark',
    animated = true,
    speed = 1,
    particles = 16,
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 900), 400), 1200)
  const h = Math.min(Math.max(Number(opts.height ?? 180), 60), 400)
  const spd = Math.min(Math.max(Number(speed) || 1, 0.3), 4)
  const uid = uniqueId('mftr')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const bg = opts.bg ?? (theme === 'dark' ? '#080810' : '#f0f2f8')
  const textColor = theme === 'dark' ? '#e0e4f0' : '#141428'
  const dimColor = theme === 'dark' ? '#7880a0' : '#606080'
  const accentColor = m.glow

  const { id: glowFid, defs: glowDefs } = buildFilterLocal(uid)

  const linkList = links ? links.split(',').map(l => l.trim()).filter(Boolean) : []
  const linksHTML = linkList.length > 0 ? (() => {
    const spacing = w / (linkList.length + 1)
    return linkList.map((link, i) =>
      `<text x="${spacing * (i + 1)}" y="${h * 0.86}" text-anchor="middle" font-family="'Rajdhani',Arial,sans-serif" font-size="${Math.min(13, h * 0.08)}" font-weight="600" fill="${accentColor}" letter-spacing="1.5" opacity="0.85">[ ${escapeXml(link)} ]</text>`
    ).join('')
  })() : ''

  let shapeBgDefs = ''
  let shapeBg = ''
  let textY = h * 0.48
  let textFill = mainFill
  let subFill = dimColor
  let filterAttr = ''

  if (style === 'wave') {
    shapeBg = `<path d="${wavePath(w, h * 0.4, h * 0.15, 1, 0)} L${w},${h} L0,${h} Z" fill="${mainFill}" opacity="0.18"/><path d="${wavePath(w, h * 0.55, h * 0.1, 1.5, Math.PI * 0.5)} L${w},${h} L0,${h} Z" fill="${mainFill}" opacity="0.1"/>`

  } else if (style === 'cyber') {
    shapeBg = `<path d="M0,${h * 0.35} L${w * 0.15},${h * 0.2} L${w},${h * 0.2} L${w},${h} L0,${h} Z" fill="${mainFill}" opacity="0.12"/><line x1="0" y1="${h * 0.35}" x2="${w * 0.15}" y2="${h * 0.2}" stroke="${mainFill}" stroke-width="2" opacity="0.6"/><line x1="${w * 0.15}" y1="${h * 0.2}" x2="${w}" y2="${h * 0.2}" stroke="${mainFill}" stroke-width="1" opacity="0.4"/>`
    textY = h * 0.58

  } else if (style === 'terminal') {
    shapeBg = `<rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.84}" height="${h * 0.76}" rx="6" fill="${theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'}" stroke="${mainFill}" stroke-width="1"/><circle cx="${w * 0.12}" cy="${h * 0.24}" r="4" fill="#ff5f57"/><circle cx="${w * 0.15}" cy="${h * 0.24}" r="4" fill="#febc2e"/><circle cx="${w * 0.18}" cy="${h * 0.24}" r="4" fill="#28c840"/>`
    textFill = textColor

  } else if (style === 'hologram') {
    shapeBg = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * h / 12}" x2="${w}" y2="${i * h / 12}" stroke="${accentColor}" stroke-opacity="0.06" stroke-width="1"/>`).join('')
    textFill = accentColor
    filterAttr = `filter="url(#${glowFid})"`

  } else if (style === 'aurora') {
    const r = auroraBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = textColor

  } else if (style === 'matrix') {
    const r = matrixBg(w, h, uid, accentColor, animated, spd)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = textColor

  } else if (style === 'wave-flow') {
    const r = waveFlowBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBg = r.back; textFill = textColor

  } else if (style === 'particles') {
    const r = particlesBg(w, h, uid, accentColor, mainFill, animated, spd, Math.min(Math.max(Number(particles) || 16, 4), 40))
    shapeBg = r.back; textFill = mainFill

  } else if (style === 'neon-grid') {
    const r = neonGridBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = textColor; filterAttr = `filter="url(#${glowFid})"`

  } else if (style === 'liquid-metal') {
    shapeBg = liquidMetalBlob(w * 0.5, h * 0.45, h * 0.5, uid, mainFill, glowFid, animated, spd)
    textFill = mainFill

  } else if (style === 'orbit') {
    shapeBg = orbitRings(w * 0.5, h * 0.4, h * 0.22, uid, mainFill, accentColor, animated, spd)
    textFill = mainFill

  } else if (style === 'gradient-mesh') {
    const r = gradientMeshBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = textColor

  } else if (style === 'glass') {
    const mesh = gradientMeshBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    const panel = glassPanel(w, h, uid, theme)
    shapeBgDefs = mesh.defs + panel.defs
    shapeBg = mesh.back + panel.back
    textFill = textColor

  } else if (style === 'split') {
    const r = splitBg(w, h, uid, mainFill, accentColor, theme)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = theme === 'dark' ? '#ffffff' : '#141428'

  } else if (style === 'constellation') {
    const r = constellationBg(w, h, uid, accentColor, animated, spd, Math.min(Math.max(Number(particles) || 20, 8), 50))
    shapeBg = r.back; textFill = '#ffffff'; filterAttr = `filter="url(#${glowFid})"`

  } else if (style === 'circuit-board') {
    const r = circuitBoardBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBg = r.back; textFill = textColor

  } else if (style === 'skyline') {
    const r = skylineBg(w, h, uid, mainFill, accentColor, theme, animated, spd)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = '#ffffff'; subFill = '#ffe8c0'

  } else if (style === 'blueprint') {
    const r = blueprintBg(w, h, uid)
    shapeBgDefs = r.defs; shapeBg = r.back; textFill = '#cfe8ff'; subFill = '#8fc4ec'

  } else if (style === 'geometric') {
    const r = geometricBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBg = r.back; textFill = textColor

  } else if (style === 'signal-wave') {
    const r = signalWaveBg(w, h, uid, mainFill, accentColor, animated, spd)
    shapeBg = r.back; textFill = mainFill
    textY = h * 0.38

  } else if (style === 'ribbon') {
    shapeBg = ribbonDecoration(w, h, mainFill, glowFid, animated, spd)
    textFill = textColor

  } else if (style === 'credits') {
    textY = h * 0.42
    shapeBg = `<line x1="${w * 0.3}" y1="${h * 0.62}" x2="${w * 0.7}" y2="${h * 0.62}" stroke="${mainFill}" stroke-width="1" opacity="0.4"/>`
    textFill = mainFill

  } else if (style === 'snake') {
    shapeBg = `<rect x="0" y="${h * 0.15}" width="${w}" height="${h * 0.5}" fill="${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}"/>`
    textY = h * 0.82
    textFill = mainFill
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Footer">
  <title>Metal Forage Footer</title>
  <defs>
    ${mainDefs}
    ${glowDefs}
    ${shapeBgDefs}
  </defs>

  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${shapeBg}

  <rect width="${w}" height="3" fill="${mainFill}"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${mainFill}" stroke-width="1" opacity="0.4"/>

  <text x="${w / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" ${filterAttr}
    font-family="'Orbitron','Arial Black',sans-serif" font-size="${Math.min(22, h * 0.14)}" font-weight="700"
    fill="${textFill}" letter-spacing="2">${escapeXml(text)}</text>

  <text x="${w / 2}" y="${textY + h * 0.18}" text-anchor="middle"
    font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, h * 0.08)}"
    fill="${subFill}" letter-spacing="1">${escapeXml(subtext)}</text>

  ${linksHTML}
</svg>`
}