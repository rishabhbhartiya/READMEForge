// src/lib/renderers/extras.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, parseColorList,
  getThemeColors, Theme, uniqueId,
} from '../metals'

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

export type ProgressStyle = 'metallic' | 'glass' | 'neo' | 'circuit' | 'segmented' | 'glow-fill'

export interface ProgressBarOptions {
  label?: string
  value?: number       // 0–100
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: ProgressStyle
  width?: number
  height?: number
  showValue?: boolean
  animated?: boolean
  theme?: Theme
}

export function renderProgressBar(opts: ProgressBarOptions): string {
  const {
    label = 'JavaScript',
    value = 75,
    style = 'metallic',
    width = 400,
    height = 32,
    showValue = true,
    animated = true,
    theme = 'dark',
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 900)
  const h = Math.min(Math.max(Number(height), 12), 80)
  const pct = Math.min(Math.max(Number(value), 0), 100)
  const uid = uniqueId('mpb')

  const metal = opts.metal ?? 'gold'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'gold'] ?? METALS.gold
  const trackFill = theme === 'dark' ? '#1a1a28' : '#e0e4f0'
  const labelColor = theme === 'dark' ? '#c0c8e8' : '#404060'
  const accentColor = m.glow

  const labelW = label.length * 8 + 16
  const barX = labelW + 8
  const barW = w - barX - (showValue ? 44 : 8)
  const fillW = barW * pct / 100
  const barH = h - 8
  const barY = 4
  const r = barH / 2

  let trackShape = ''
  let barShape = ''
  let extraDefs = ''

  if (style === 'metallic') {
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>`
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}" fill="${mainFill}"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH / 2}" rx="${r}" fill="white" opacity="0.2"/>`

  } else if (style === 'glow-fill') {
    extraDefs = `<filter id="${uid}_gf">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>`
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="${mainFill}" filter="url(#${uid}_gf)"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="${mainFill}" opacity="0.8"/>`

  } else if (style === 'segmented') {
    const segCount = 20
    const segW = barW / segCount - 2
    const filledSegs = Math.floor(pct / 100 * segCount)
    barShape = Array.from({ length: segCount }, (_, i) => {
      const sx = barX + i * (barW / segCount)
      return `<rect x="${sx}" y="${barY}" width="${segW}" height="${barH}" rx="2"
        fill="${i < filledSegs ? mainFill : trackFill}" opacity="${i < filledSegs ? 1 : 0.4}"/>`
    }).join('')

  } else if (style === 'glass') {
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}"
      fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="${mainFill}" opacity="0.7"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH / 2}" rx="${r}"
        fill="white" opacity="0.15"/>`

  } else if (style === 'circuit') {
    const dotCount = Math.floor(fillW / 8)
    trackShape = `<line x1="${barX}" y1="${barY + barH / 2}" x2="${barX + barW}" y2="${barY + barH / 2}"
      stroke="${trackFill}" stroke-width="2"/>`
    barShape = `
      <line x1="${barX}" y1="${barY + barH / 2}" x2="${barX + fillW}" y2="${barY + barH / 2}"
        stroke="${mainFill}" stroke-width="3"/>
      ${Array.from({ length: dotCount }, (_, i) =>
      `<circle cx="${barX + i * 8 + 4}" cy="${barY + barH / 2}" r="3" fill="${mainFill}"/>`
    ).join('')}
      <circle cx="${barX + fillW}" cy="${barY + barH / 2}" r="5" fill="${mainFill}"/>`

  } else {
    // neo
    trackShape = `
      <rect x="${barX - 1}" y="${barY - 1}" width="${barW + 2}" height="${barH + 2}" rx="${r + 1}"
        fill="${theme === 'dark' ? '#0a0a18' : '#d8dce8'}"/>
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>`
    barShape = `<rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}" fill="${mainFill}"/>`
  }

  const animEl = animated ? `
    <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
      fill="${theme === 'dark' ? '#0e0e1c' : '#e8ecf4'}" opacity="0.8">
      <animate attributeName="width" from="0" to="${fillW}" dur="1.5s" fill="freeze" calcMode="spline"
        keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" fill="freeze"/>
    </rect>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}: ${pct}%">
  <title>${label}: ${pct}%</title>
  <defs>${mainDefs}${extraDefs}</defs>

  <text x="0" y="${h / 2 + 1}" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${Math.min(12, h * 0.4)}" fill="${labelColor}" letter-spacing="0.5"
  >${escapeXml(label)}</text>

  ${trackShape}
  ${barShape}
  ${animEl}

  ${showValue ? `<text x="${barX + barW + 4}" y="${h / 2 + 1}" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${Math.min(11, h * 0.38)}" fill="${accentColor}" letter-spacing="0.5"
  >${pct}%</text>` : ''}
</svg>`
}

// ─── SKILL TREE ──────────────────────────────────────────────────────────────

export interface SkillBarItem {
  label: string
  value: number
  /** MetalName or CSS color */
  metal?: string
  colors?: string
}

export interface SkillTreeOptions {
  title?: string
  skills?: SkillBarItem[]
  /** MetalName, CSS color, or comma-separated gradient for title/border */
  metal?: string
  colors?: string
  angle?: number
  style?: ProgressStyle
  width?: number
  barHeight?: number
  theme?: Theme
}

export function renderSkillTree(opts: SkillTreeOptions): string {
  const {
    title = 'Tech Stack',
    style = 'metallic',
    width = 450,
    barHeight = 28,
    theme = 'dark',
  } = opts

  const skills: SkillBarItem[] = opts.skills ?? [
    { label: 'TypeScript', value: 92, metal: 'electric' },
    { label: 'React', value: 88, metal: 'electric' },
    { label: 'Node.js', value: 85, metal: 'neon-green' },
    { label: 'Python', value: 75, metal: 'neon-purple' },
    { label: 'Rust', value: 60, metal: 'copper' },
  ]

  const w = Math.min(Math.max(Number(width), 200), 900)
  const bh = Math.min(Math.max(Number(barHeight), 16), 60)
  const gap = 10
  const titleH = 40
  const totalH = titleH + skills.length * (bh + gap) + 16
  const uid = uniqueId('mst')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, totalH)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const trackFill = theme === 'dark' ? '#1a1a28' : '#e0e4f0'
  const labelColor = theme === 'dark' ? '#c0c8e8' : '#404060'

  const bars = skills.map((skill, i) => {
    const barMetal = skill.metal ?? metal
    const barColorSpec: ColorSpec = skill.colors
      ? parseColorList(skill.colors, 90)
      : (barMetal in METALS ? barMetal as MetalName : barMetal)
    const barGradId = `${uid}_bg${i}`
    // resolve inline per skill
    const barM = METALS[barMetal in METALS ? barMetal as MetalName : 'chrome'] ?? m
    const barGradStops = barM.gradient.map(s => `<stop offset="${s.position}%" stop-color="${s.color}"/>`).join('')
    const barGradDef = `<linearGradient id="${barGradId}" x1="0%" y1="0%" x2="100%" y2="0%"
      gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="0">${barGradStops}</linearGradient>`

    const y = titleH + i * (bh + gap)
    const lW = skill.label.length * 8 + 12
    const barX = lW + 8
    const barW = w - barX - 44
    const fillW = barW * skill.value / 100
    const r = bh / 2

    return `
    ${barGradDef}
    <g>
      <text x="0" y="${y + bh / 2 + 1}" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, bh * 0.4)}"
        fill="${labelColor}" letter-spacing="0.5"
      >${escapeXml(skill.label)}</text>
      <rect x="${barX}" y="${y}" width="${barW}" height="${bh}" rx="${r}" fill="${trackFill}"/>
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh}" rx="${r}" fill="url(#${barGradId})"/>
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh / 2}" rx="${r}" fill="white" opacity="0.18"/>
      <!-- Animated fill reveal -->
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh}" rx="${r}"
        fill="${theme === 'dark' ? '#0e0e1c' : '#e8ecf4'}" opacity="0.8">
        <animate attributeName="width" from="0" to="${fillW}"
          dur="${1 + i * 0.15}s" fill="freeze" calcMode="spline"
          keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
        <animate attributeName="opacity" from="0.8" to="0"
          dur="${1 + i * 0.15}s" fill="freeze"/>
      </rect>
      <text x="${barX + barW + 4}" y="${y + bh / 2 + 1}" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(11, bh * 0.38)}"
        fill="${barM.glow}" letter-spacing="0.5"
      >${skill.value}%</text>
    </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}"
  role="img" aria-label="${title}">
  <title>${title}</title>
  <defs>${mainDefs}</defs>

  <rect width="${w}" height="${totalH}" rx="10" fill="${theme === 'dark' ? '#0e0e1a' : '#f0f2f8'}"/>
  <rect width="${w}" height="3" fill="${mainFill}" rx="2"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${totalH - 1}" rx="10"
    fill="none" stroke="${mainFill}" stroke-width="1" opacity="0.4"/>

  <text x="12" y="26"
    font-family="'Orbitron','Arial Black',sans-serif"
    font-size="14" font-weight="700"
    fill="${mainFill}" letter-spacing="2"
  >${escapeXml(title.toUpperCase())}</text>

  <g transform="translate(12, 0)">${bars}</g>
</svg>`
}

// ─── TERMINAL BLOCK ──────────────────────────────────────────────────────────

export interface TerminalOptions {
  title?: string
  lines?: string[]
  /** MetalName, CSS color, or comma-separated gradient for title bar */
  metal?: string
  colors?: string
  angle?: number
  width?: number
  theme?: 'dark' | 'matrix' | 'amber' | 'blue'
  prompt?: string
  animated?: boolean
}

export function renderTerminal(opts: TerminalOptions): string {
  const {
    title = 'profile.sh',
    width = 500,
    theme = 'dark',
    prompt = '$ ',
    animated = true,
  } = opts

  const lines = opts.lines ?? [
    '$ whoami',
    'fullstack-developer',
    '$ cat skills.txt',
    'TypeScript · React · Node.js · Rust',
    '$ echo $PASSION',
    'Open Source & Beautiful Code ✦',
  ]

  const w = Math.min(Math.max(Number(width), 200), 900)
  const lineH = 22
  const titleBarH = 36
  const padV = 14
  const h = titleBarH + padV + lines.length * lineH + padV
  const uid = uniqueId('mterm')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, titleBarH)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome

  const THEMES = {
    dark: { bg: '#0d1117', cmd: '#58a6ff', out: '#e6edf3', cursor: '#58a6ff' },
    matrix: { bg: '#000800', cmd: '#00ff41', out: '#00ff41', cursor: '#00ff41' },
    amber: { bg: '#0a0800', cmd: '#ffc060', out: '#ffa040', cursor: '#ffa040' },
    blue: { bg: '#000816', cmd: '#40a8ff', out: '#80d0ff', cursor: '#80d0ff' },
  }
  const tc = THEMES[theme] ?? THEMES.dark

  const linesHTML = lines.map((line, i) => {
    const isCmd = line.startsWith(prompt.trim()) || line.startsWith('$')
    const y = titleBarH + padV + i * lineH + lineH / 2
    const delay = animated ? (i * 0.2).toFixed(1) : '0'
    const anim = animated
      ? `opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="${delay}s" fill="freeze"/>`
      : `opacity="1">`
    return `<text x="16" y="${y}" dominant-baseline="middle"
      font-family="'Share Tech Mono',monospace" font-size="13"
      fill="${isCmd ? tc.cmd : tc.out}" ${anim}${escapeXml(line)}</text>`
  }).join('')

  const lastLineLen = lines[lines.length - 1]?.length ?? 0
  const cursorX = 16 + lastLineLen * 7.8

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Terminal: ${title}">
  <title>Terminal — ${title}</title>
  <defs>${mainDefs}</defs>

  <!-- Window -->
  <rect width="${w}" height="${h}" rx="8" fill="${tc.bg}"
    stroke="${mainFill}" stroke-width="1.5"/>

  <!-- Title bar -->
  <rect width="${w}" height="${titleBarH}" rx="8" fill="${mainFill}" opacity="0.7"/>
  <rect y="${titleBarH - 4}" width="${w}" height="4" fill="${mainFill}" opacity="0.7"/>

  <!-- Traffic lights -->
  <circle cx="16" cy="${titleBarH / 2}" r="5.5" fill="#ff5f57"/>
  <circle cx="32" cy="${titleBarH / 2}" r="5.5" fill="#febc2e"/>
  <circle cx="48" cy="${titleBarH / 2}" r="5.5" fill="#28c840"/>

  <!-- Title -->
  <text x="${w / 2}" y="${titleBarH / 2}" text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace" font-size="12"
    fill="${m.textDark ?? '#fff'}" letter-spacing="1"
  >${escapeXml(title)}</text>

  <!-- Lines -->
  ${linesHTML}

  <!-- Blinking cursor -->
  <rect x="${cursorX}" y="${titleBarH + padV + (lines.length - 1) * lineH + 4}"
    width="7" height="14" fill="${tc.cursor}" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite"/>
  </rect>
</svg>`
}

// ─── SOCIAL LINKS ROW ────────────────────────────────────────────────────────

export interface SocialLink { platform: string; url?: string; username?: string }

export interface SocialLinksOptions {
  links?: SocialLink[]
  /** MetalName, CSS color, or comma-separated gradient */
  metal?: string
  colors?: string
  angle?: number
  style?: 'pills' | 'icons' | 'minimal'
  width?: number
  height?: number
  theme?: 'dark' | 'light'
}

const PLATFORM_ICONS: Record<string, string> = {
  github: '⌥', twitter: '✕', linkedin: '◆', youtube: '▶',
  instagram: '◈', discord: '⬡', twitch: '◉', email: '✉',
  website: '⊕', npm: '⬛', medium: '◑', devto: '◕',
}

export function renderSocialLinks(opts: SocialLinksOptions): string {
  const {
    style = 'pills',
    width = 600,
    height = 48,
    theme = 'dark',
  } = opts

  const links: SocialLink[] = opts.links ?? [
    { platform: 'github', username: 'yourusername' },
    { platform: 'twitter', username: '@yourusername' },
    { platform: 'linkedin', username: 'yourname' },
    { platform: 'email', username: 'you@email.com' },
  ]

  const w = Math.min(Math.max(Number(width), 200), 1200)
  const h = Math.min(Math.max(Number(height), 28), 100)
  const uid = uniqueId('msl')

  const metal = opts.metal ?? 'chrome'
  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 90)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const textColor = theme === 'dark' ? (m.textDark ?? '#fff') : (m.textLight ?? '#000')
  const accentColor = m.glow

  const spacing = w / (links.length + 1)
  const pillW = Math.min(spacing * 0.85, 160)
  const pillH = h - 8

  const elements = links.map((link, i) => {
    const cx = spacing * (i + 1)
    const icon = PLATFORM_ICONS[link.platform.toLowerCase()] ?? '◈'
    const label = link.username ?? link.platform
    const platformLabel = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

    if (style === 'pills') {
      return `
        <rect x="${cx - pillW / 2}" y="${(h - pillH) / 2}" width="${pillW}" height="${pillH}"
          rx="${pillH / 2}" fill="${mainFill}" opacity="0.9"/>
        <rect x="${cx - pillW / 2}" y="${(h - pillH) / 2}" width="${pillW}" height="${pillH / 2}"
          rx="${pillH / 2}" fill="white" opacity="0.15"/>
        <text x="${cx - pillW * 0.2}" y="${h / 2}" dominant-baseline="middle"
          font-size="${Math.min(13, pillH * 0.45)}" fill="${textColor}" opacity="0.8"
        >${icon}</text>
        <text x="${cx + pillW * 0.1}" y="${h / 2}" dominant-baseline="middle"
          font-family="'Rajdhani',Arial,sans-serif"
          font-size="${Math.min(12, pillH * 0.42)}" font-weight="600"
          fill="${textColor}" letter-spacing="0.5"
        >${escapeXml(platformLabel)}</text>`

    } else if (style === 'icons') {
      const ir = pillH * 0.5
      return `
        <circle cx="${cx}" cy="${h / 2}" r="${ir}" fill="${mainFill}"/>
        <circle cx="${cx}" cy="${h / 2 - ir * 0.25}" r="${ir * 0.75}" fill="white" opacity="0.12"/>
        <text x="${cx}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
          font-size="${ir * 0.9}" fill="${textColor}"
        >${icon}</text>`

    } else {
      return `
        <text x="${cx}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
          font-family="'Share Tech Mono',monospace"
          font-size="${Math.min(12, h * 0.3)}"
          fill="${accentColor}" letter-spacing="0.5"
        >${icon} ${escapeXml(label)}</text>`
    }
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Social Links">
  <title>Social Links</title>
  <defs>${mainDefs}</defs>
  ${elements}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}