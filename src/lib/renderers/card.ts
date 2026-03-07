// src/lib/renderers/card.ts
import { MetalType, CardType, METALS, buildGradient } from '../metals'

export interface CardOptions {
  username?: string
  type?: CardType
  metal?: MetalType
  border?: 'metal' | 'glow' | 'minimal' | 'ridge' | 'none'
  width?: number
  compact?: boolean
  title?: string
  // Custom stat overrides (for demo / static mode)
  stat1?: string; label1?: string
  stat2?: string; label2?: string
  stat3?: string; label3?: string
}

interface StatItem { label: string; value: string; icon: string }

const CARD_TEMPLATES: Record<CardType, StatItem[]> = {
  stats:    [{ label:'Stars Earned',  value:'12.4k', icon:'★' },{ label:'Total Commits', value:'3,291', icon:'◉' },{ label:'PRs Merged',   value:'847',   icon:'⎇' }],
  langs:    [{ label:'JavaScript',    value:'42%',   icon:'JS'},{ label:'TypeScript',    value:'28%',   icon:'TS'},{ label:'Python',       value:'18%',   icon:'Py'}],
  streak:   [{ label:'Total Contrib', value:'1,204', icon:'⚡'},{ label:'Longest Streak',value:'89 d',  icon:'🔥'},{ label:'Current',      value:'12 d',  icon:'✦' }],
  trophy:   [{ label:'Rank',          value:'S+',    icon:'◆' },{ label:'Followers',    value:'5k+',   icon:'◈' },{ label:'Reviews',      value:'Expert',icon:'✦' }],
  activity: [{ label:'This Week',     value:'48',    icon:'◑' },{ label:'This Month',   value:'214',   icon:'◕' },{ label:'All Time',     value:'3.2k',  icon:'◉' }],
}

export function renderCard(opts: CardOptions): string {
  const {
    username = 'yourusername',
    type = 'stats',
    metal = 'chrome',
    border = 'metal',
    width = 495,
    compact = false,
    title,
  } = opts

  const w = Math.min(Math.max(Number(width), 300), 700)
  const h = compact ? 140 : 200
  const m = METALS[metal] ?? METALS.chrome
  const uid = `mc_${Date.now().toString(36)}`

  const gradient = buildGradient(`${uid}_g`, metal, '135')
  const bgGrad = `<linearGradient id="${uid}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${m.isDark ? '#0d1117' : '#f8f9fc'}"/>
    <stop offset="100%" stop-color="${m.isDark ? '#161b22' : '#eef0f8'}"/>
  </linearGradient>`

  // Override stats if custom values provided
  let stats = [...CARD_TEMPLATES[type] ?? CARD_TEMPLATES.stats]
  if (opts.stat1) stats[0] = { ...stats[0], value: opts.stat1, label: opts.label1 ?? stats[0].label }
  if (opts.stat2) stats[1] = { ...stats[1], value: opts.stat2, label: opts.label2 ?? stats[1].label }
  if (opts.stat3) stats[2] = { ...stats[2], value: opts.stat3, label: opts.label3 ?? stats[2].label }

  const textColor = m.isDark ? '#c9d1d9' : '#24292e'
  const accentColor = m.accent
  const dimColor = m.isDark ? '#8b949e' : '#666688'

  // Stat positions
  const statXPositions = [w * 0.18, w * 0.5, w * 0.82]
  const statValueY = compact ? 105 : 155
  const statLabelY = compact ? 80 : 128

  // Border definition
  let borderDef = ''
  let borderApply = ''
  if (border === 'metal') {
    borderDef = buildGradient(`${uid}_bd`, metal, '45')
    borderApply = `<rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" rx="10" fill="none" stroke="url(#${uid}_bd)" stroke-width="1.5"/>`
  } else if (border === 'glow') {
    borderDef = `<filter id="${uid}_bf">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`
    borderApply = `<rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" rx="10" fill="none"
      stroke="${accentColor}" stroke-width="1.5" filter="url(#${uid}_bf)" opacity="0.8"/>`
  } else if (border === 'ridge') {
    borderApply = `
      <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.15"/>
      <rect x="3" y="3" width="${w-6}" height="${h-6}" rx="8" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>`
  } else if (border === 'minimal') {
    borderApply = `<rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" rx="10" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.35"/>`
  }

  const cardTitle = title ?? `@${username}`

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${cardTitle} GitHub Stats">
  <title>${cardTitle} — ${type} card</title>
  <defs>
    ${gradient}
    ${bgGrad}
    ${borderDef}
  </defs>

  <!-- Card background -->
  <rect width="${w}" height="${h}" rx="10" fill="url(#${uid}_bg)"/>

  <!-- Top metallic accent strip -->
  <rect width="${w}" height="3" rx="2" fill="url(#${uid}_g)"/>

  <!-- Username / Title -->
  <text x="20" y="${compact ? 36 : 50}"
    font-family="'Orbitron', 'Arial Black', monospace"
    font-size="${compact ? 14 : 17}" font-weight="700"
    fill="url(#${uid}_g)" letter-spacing="0.5"
  >${escapeXml(cardTitle)}</text>

  <!-- Card type label -->
  <text x="20" y="${compact ? 54 : 72}"
    font-family="'Rajdhani', Arial, sans-serif"
    font-size="11" font-weight="500"
    fill="${dimColor}" letter-spacing="2" opacity="0.7"
    text-transform="uppercase"
  >${type.toUpperCase()} STATISTICS</text>

  <!-- Divider line -->
  <line x1="16" y1="${compact ? 62 : 84}" x2="${w - 16}" y2="${compact ? 62 : 84}"
    stroke="url(#${uid}_g)" stroke-width="1" opacity="0.3"/>

  <!-- Stats -->
  ${stats.slice(0, 3).map((s, i) => `
  <text x="${statXPositions[i]}" y="${statLabelY}"
    text-anchor="middle"
    font-family="'Share Tech Mono', monospace"
    font-size="10" fill="${dimColor}" letter-spacing="0.8"
  >${escapeXml(s.label)}</text>
  <text x="${statXPositions[i]}" y="${statValueY}"
    text-anchor="middle"
    font-family="'Orbitron', 'Arial Black', sans-serif"
    font-size="${compact ? 16 : 20}" font-weight="700"
    fill="url(#${uid}_g)"
  >${escapeXml(s.value)}</text>
  `).join('')}

  <!-- Vertical separators -->
  <line x1="${statXPositions[0] + w * 0.16}" y1="${compact ? 70 : 95}" x2="${statXPositions[0] + w * 0.16}" y2="${compact ? 120 : 168}"
    stroke="${accentColor}" stroke-width="1" opacity="0.18"/>
  <line x1="${statXPositions[1] + w * 0.16}" y1="${compact ? 70 : 95}" x2="${statXPositions[1] + w * 0.16}" y2="${compact ? 120 : 168}"
    stroke="${accentColor}" stroke-width="1" opacity="0.18"/>

  <!-- Footer line -->
  <line x1="16" y1="${h - 22}" x2="${w - 16}" y2="${h - 22}"
    stroke="url(#${uid}_g)" stroke-width="1" opacity="0.15"/>
  <text x="${w - 16}" y="${h - 9}" text-anchor="end"
    font-family="'Share Tech Mono', monospace"
    font-size="9" fill="${dimColor}" opacity="0.35" letter-spacing="1"
  >METALFORGE.DEV</text>

  <!-- Border -->
  ${borderApply}
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
