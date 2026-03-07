// src/lib/renderers/extras.ts
// Progress bars, skill trees, terminal output, social link rows

import { MetalType, METALS, buildGradient } from '../metals'

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

export type ProgressStyle = 'metallic' | 'glass' | 'neo' | 'circuit' | 'segmented' | 'glow-fill'

export interface ProgressBarOptions {
  label?: string
  value?: number     // 0-100
  metal?: MetalType
  style?: ProgressStyle
  width?: number
  height?: number
  showValue?: boolean
  animated?: boolean
}

export function renderProgressBar(opts: ProgressBarOptions): string {
  const {
    label = 'JavaScript',
    value = 75,
    metal = 'gold',
    style = 'metallic',
    width = 400,
    height = 32,
    showValue = true,
    animated = true,
  } = opts

  const w = Math.min(Math.max(Number(width), 100), 900)
  const h = Math.min(Math.max(Number(height), 12), 80)
  const pct = Math.min(Math.max(Number(value), 0), 100)
  const m = METALS[metal] ?? METALS.gold
  const uid = `mpb_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')
  const labelW = label.length * 8 + 16
  const barX = labelW + 8
  const barW = w - barX - (showValue ? 44 : 8)
  const fillW = barW * pct / 100
  const barH = h - 8
  const barY = 4
  const r = barH / 2

  let trackFill = m.isDark ? '#1a1a28' : '#e0e4f0'
  let barShape = ''
  let trackShape = ''
  let extraDefs = ''

  if (style === 'metallic') {
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}" fill="url(#${uid}_g)"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH/2}" rx="${r}" fill="white" opacity="0.2"/>
    `
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>`
  } else if (style === 'glow-fill') {
    extraDefs = `<filter id="${uid}_gf"><feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="url(#${uid}_g)" filter="url(#${uid}_gf)"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="url(#${uid}_g)" opacity="0.8"/>
    `
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>`
  } else if (style === 'segmented') {
    const segCount = 20
    const segW = barW / segCount - 2
    const filledSegs = Math.floor(pct / 100 * segCount)
    trackShape = ''
    barShape = Array.from({length: segCount}, (_, i) => {
      const sx = barX + i * (barW / segCount)
      const filled = i < filledSegs
      return `<rect x="${sx}" y="${barY}" width="${segW}" height="${barH}" rx="2"
        fill="${filled ? `url(#${uid}_g)` : trackFill}" opacity="${filled ? 1 : 0.4}"/>`
    }).join('')
  } else if (style === 'glass') {
    trackShape = `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}"
      fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
        fill="url(#${uid}_g)" opacity="0.7"/>
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH/2}" rx="${r}"
        fill="white" opacity="0.15"/>
    `
  } else if (style === 'circuit') {
    const dotCount = Math.floor(fillW / 8)
    trackShape = `<line x1="${barX}" y1="${barY + barH/2}" x2="${barX + barW}" y2="${barY + barH/2}"
      stroke="${trackFill}" stroke-width="2"/>`
    barShape = `
      <line x1="${barX}" y1="${barY + barH/2}" x2="${barX + fillW}" y2="${barY + barH/2}"
        stroke="url(#${uid}_g)" stroke-width="3"/>
      ${Array.from({length: dotCount}, (_, i) =>
        `<circle cx="${barX + i * 8 + 4}" cy="${barY + barH/2}" r="3" fill="url(#${uid}_g)"/>`
      ).join('')}
      <circle cx="${barX + fillW}" cy="${barY + barH/2}" r="5" fill="url(#${uid}_g)"/>
    `
  } else {
    // neo
    barShape = `
      <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}" fill="url(#${uid}_g)"/>
    `
    trackShape = `
      <rect x="${barX - 1}" y="${barY - 1}" width="${barW + 2}" height="${barH + 2}" rx="${r + 1}"
        fill="${m.isDark ? '#0a0a18' : '#d8dce8'}"/>
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${r}" fill="${trackFill}"/>
    `
  }

  const animEl = animated ? `
    <!-- Fill animation on load -->
    <rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="${r}"
      fill="${m.isDark ? '#0e0e1c' : '#e8ecf4'}" opacity="0.8">
      <animate attributeName="width" from="0" to="${fillW}" dur="1.5s" fill="freeze" calcMode="spline"
        keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" fill="freeze"/>
    </rect>
  ` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${label}: ${pct}%">
  <title>${label}: ${pct}%</title>
  <defs>${mainGrad}${extraDefs}</defs>

  <!-- Label -->
  <text x="0" y="${h / 2 + 1}"
    dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${Math.min(12, h * 0.4)}" fill="${m.isDark ? '#c0c8e8' : '#404060'}" letter-spacing="0.5"
  >${escapeXml(label)}</text>

  ${trackShape}
  ${barShape}
  ${animEl}

  ${showValue ? `<text x="${barX + barW + 4}" y="${h / 2 + 1}"
    dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace"
    font-size="${Math.min(11, h * 0.38)}" fill="${m.accent}" letter-spacing="0.5"
  >${pct}%</text>` : ''}
</svg>`
}

// ─── SKILL TREE ──────────────────────────────────────────────────────────────

export interface SkillBarItem { label: string; value: number; metal?: MetalType }
export interface SkillTreeOptions {
  title?: string
  skills?: SkillBarItem[]
  metal?: MetalType
  style?: ProgressStyle
  width?: number
  barHeight?: number
}

export function renderSkillTree(opts: SkillTreeOptions): string {
  const {
    title = 'Tech Stack',
    metal = 'chrome',
    style = 'metallic',
    width = 450,
    barHeight = 28,
  } = opts

  const skills: SkillBarItem[] = opts.skills ?? [
    { label: 'TypeScript', value: 92, metal: 'electric' },
    { label: 'React',      value: 88, metal: 'electric' },
    { label: 'Node.js',    value: 85, metal: 'neon'     },
    { label: 'Python',     value: 75, metal: 'neon'     },
    { label: 'Rust',       value: 60, metal: 'copper'   },
  ]

  const w = Math.min(Math.max(Number(width), 200), 900)
  const bh = Math.min(Math.max(Number(barHeight), 16), 60)
  const gap = 10
  const titleH = 40
  const totalH = titleH + skills.length * (bh + gap) + 16

  const m = METALS[metal] ?? METALS.chrome
  const uid = `mst_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')

  const bars = skills.map((skill, i) => {
    const barMetal = skill.metal ?? metal
    const bm = METALS[barMetal] ?? m
    const barGradId = `${uid}_bg${i}`
    const barGrad = buildGradient(barGradId, barMetal, '90')
    const y = titleH + i * (bh + gap)
    const labelW = skill.label.length * 8 + 12
    const barX = labelW + 8
    const barW = w - barX - 44
    const fillW = barW * skill.value / 100
    const r = bh / 2

    return `
    ${barGrad}
    <g>
      <text x="0" y="${y + bh/2 + 1}" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(12, bh*0.4)}"
        fill="${m.isDark ? '#c0c8e8' : '#404060'}" letter-spacing="0.5"
      >${escapeXml(skill.label)}</text>
      <rect x="${barX}" y="${y}" width="${barW}" height="${bh}" rx="${r}"
        fill="${m.isDark ? '#1a1a28' : '#e0e4f0'}"/>
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh}" rx="${r}" fill="url(#${barGradId})"/>
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh/2}" rx="${r}" fill="white" opacity="0.18"/>
      <!-- Animated fill reveal -->
      <rect x="${barX}" y="${y}" width="${fillW}" height="${bh}" rx="${r}"
        fill="${m.isDark ? '#0e0e1c' : '#e8ecf4'}" opacity="0.8">
        <animate attributeName="width" from="0" to="${fillW}"
          dur="${1 + i * 0.15}s" fill="freeze" calcMode="spline"
          keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
        <animate attributeName="opacity" from="0.8" to="0"
          dur="${1 + i * 0.15}s" fill="freeze"/>
      </rect>
      <text x="${barX + barW + 4}" y="${y + bh/2 + 1}" dominant-baseline="middle"
        font-family="'Share Tech Mono',monospace" font-size="${Math.min(11, bh*0.38)}"
        fill="${bm.accent}" letter-spacing="0.5"
      >${skill.value}%</text>
    </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}"
  role="img" aria-label="${title}">
  <title>${title}</title>
  <defs>
    ${mainGrad}
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${totalH}" rx="10" fill="${m.isDark ? '#0e0e1a' : '#f0f2f8'}"/>
  <rect width="${w}" height="3" fill="url(#${uid}_g)" rx="2"/>
  <rect x="0.5" y="0.5" width="${w-1}" height="${totalH-1}" rx="10"
    fill="none" stroke="url(#${uid}_g)" stroke-width="1" opacity="0.4"/>

  <!-- Title -->
  <text x="12" y="26"
    font-family="'Orbitron','Arial Black',sans-serif"
    font-size="14" font-weight="700"
    fill="url(#${uid}_g)" letter-spacing="2"
  >${escapeXml(title.toUpperCase())}</text>

  <!-- Skills -->
  <g transform="translate(12, 0)">${bars}</g>
</svg>`
}

// ─── TERMINAL BLOCK ──────────────────────────────────────────────────────────

export interface TerminalOptions {
  title?: string
  lines?: string[]    // lines of terminal output
  metal?: MetalType
  width?: number
  theme?: 'dark' | 'matrix' | 'amber' | 'blue'
  prompt?: string
  animated?: boolean
}

export function renderTerminal(opts: TerminalOptions): string {
  const {
    title = 'profile.sh',
    metal = 'chrome',
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

  const m = METALS[metal] ?? METALS.chrome
  const uid = `mterm_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')

  const THEMES = {
    dark:   { bg: '#0d1117', line1: '#7c8c99', line2: '#e6edf3', prompt: '#58a6ff', cursor: '#58a6ff' },
    matrix: { bg: '#000800', line1: '#003300', line2: '#00ff41', prompt: '#00ff41', cursor: '#00ff41' },
    amber:  { bg: '#0a0800', line1: '#604000', line2: '#ffa040', prompt: '#ffc060', cursor: '#ffa040' },
    blue:   { bg: '#000816', line1: '#003060', line2: '#80d0ff', prompt: '#40a8ff', cursor: '#80d0ff' },
  }
  const tc = THEMES[theme] ?? THEMES.dark

  const linesHTML = lines.map((line, i) => {
    const isCmd = line.startsWith(prompt.trim()) || line.startsWith('$')
    const y = titleBarH + padV + i * lineH + lineH / 2
    const delay = animated ? (i * 0.2).toFixed(1) : '0'
    const animAttrs = animated ? `opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="${delay}s" fill="freeze"/>` : 'opacity="1">'
    return `<text x="16" y="${y}" dominant-baseline="middle"
      font-family="'Share Tech Mono',monospace" font-size="13"
      fill="${isCmd ? tc.prompt : tc.line2}"
      ${animAttrs}${escapeXml(line)}</text>`
  }).join('')

  const lastLineY = titleBarH + padV + lines.length * lineH + lineH / 2
  const cursorX = 16 + (lines[lines.length - 1]?.length ?? 0) * 7.8

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Terminal: ${title}">
  <title>Terminal — ${title}</title>
  <defs>${mainGrad}</defs>

  <!-- Window -->
  <rect width="${w}" height="${h}" rx="8" fill="${tc.bg}"
    stroke="url(#${uid}_g)" stroke-width="1.5"/>

  <!-- Title bar -->
  <rect width="${w}" height="${titleBarH}" rx="8" fill="url(#${uid}_g)" opacity="0.7"/>
  <rect y="${titleBarH - 4}" width="${w}" height="4" fill="url(#${uid}_g)" opacity="0.7"/>

  <!-- Traffic lights -->
  <circle cx="16" cy="${titleBarH/2}" r="5.5" fill="#ff5f57"/>
  <circle cx="32" cy="${titleBarH/2}" r="5.5" fill="#febc2e"/>
  <circle cx="48" cy="${titleBarH/2}" r="5.5" fill="#28c840"/>

  <!-- Title -->
  <text x="${w/2}" y="${titleBarH/2}" text-anchor="middle" dominant-baseline="middle"
    font-family="'Share Tech Mono',monospace" font-size="12"
    fill="${m.isDark ? m.textLight : m.textDark}" letter-spacing="1"
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
  metal?: MetalType
  style?: 'pills' | 'icons' | 'minimal'
  width?: number
  height?: number
}

const PLATFORM_ICONS: Record<string, string> = {
  github: '⌥', twitter: '✕', linkedin: '◆', youtube: '▶',
  instagram: '◈', discord: '⬡', twitch: '◉', email: '✉',
  website: '⊕', npm: '⬛', medium: '◑', devto: '◕',
}

export function renderSocialLinks(opts: SocialLinksOptions): string {
  const {
    metal = 'chrome',
    style = 'pills',
    width = 600,
    height = 48,
  } = opts

  const links: SocialLink[] = opts.links ?? [
    { platform: 'github',   username: 'yourusername' },
    { platform: 'twitter',  username: '@yourusername' },
    { platform: 'linkedin', username: 'yourname' },
    { platform: 'email',    username: 'you@email.com' },
  ]

  const w = Math.min(Math.max(Number(width), 200), 1200)
  const h = Math.min(Math.max(Number(height), 28), 100)
  const m = METALS[metal] ?? METALS.chrome
  const uid = `msl_${Date.now().toString(36)}`
  const mainGrad = buildGradient(`${uid}_g`, metal, '90')

  const spacing = w / (links.length + 1)
  const pillW = Math.min(spacing * 0.85, 160)
  const pillH = h - 8

  const elements = links.map((link, i) => {
    const cx = spacing * (i + 1)
    const icon = PLATFORM_ICONS[link.platform.toLowerCase()] ?? '◈'
    const label = link.username ?? link.platform

    if (style === 'pills') {
      return `
        <rect x="${cx - pillW/2}" y="${(h - pillH)/2}" width="${pillW}" height="${pillH}"
          rx="${pillH/2}" fill="url(#${uid}_g)" opacity="0.9"/>
        <rect x="${cx - pillW/2}" y="${(h - pillH)/2}" width="${pillW}" height="${pillH/2}"
          rx="${pillH/2}" fill="white" opacity="0.15"/>
        <text x="${cx - pillW*0.2}" y="${h/2}"
          dominant-baseline="middle"
          font-size="${Math.min(13, pillH*0.45)}"
          fill="${m.isDark ? m.textLight : m.textDark}" opacity="0.8"
        >${icon}</text>
        <text x="${cx + pillW*0.1}" y="${h/2}"
          dominant-baseline="middle"
          font-family="'Rajdhani',Arial,sans-serif"
          font-size="${Math.min(12, pillH*0.42)}" font-weight="600"
          fill="${m.isDark ? m.textLight : m.textDark}" letter-spacing="0.5"
        >${escapeXml(link.platform.charAt(0).toUpperCase() + link.platform.slice(1))}</text>
      `
    } else if (style === 'icons') {
      const ir = pillH * 0.5
      return `
        <circle cx="${cx}" cy="${h/2}" r="${ir}" fill="url(#${uid}_g)"/>
        <circle cx="${cx}" cy="${h/2 - ir*0.25}" r="${ir*0.75}" fill="white" opacity="0.12"/>
        <text x="${cx}" y="${h/2}" text-anchor="middle" dominant-baseline="middle"
          font-size="${ir * 0.9}" fill="${m.isDark ? m.textLight : m.textDark}"
        >${icon}</text>
      `
    } else {
      return `
        <text x="${cx}" y="${h/2}" text-anchor="middle" dominant-baseline="middle"
          font-family="'Share Tech Mono',monospace"
          font-size="${Math.min(12, h*0.3)}"
          fill="${m.accent}" letter-spacing="0.5"
        >${icon} ${escapeXml(label)}</text>
      `
    }
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="Social Links">
  <title>Social Links</title>
  <defs>${mainGrad}</defs>
  ${elements}
</svg>`
}

function escapeXml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
