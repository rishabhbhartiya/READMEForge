// src/lib/renderers/card.ts
import {
  MetalName, ColorSpec, METALS, resolveColor, buildGradientDef,
  buildFilter, parseColorList, getThemeColors,
  Theme, DesignStyle, uniqueId,
} from '../metals'

export type CardType = 'stats' | 'langs' | 'streak' | 'trophy' | 'activity' | 'social' | 'blank'
export type CardBorder = 'metal' | 'glow' | 'minimal' | 'ridge' | 'double' | 'dashed' | 'none'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'rounded'

export interface CardOptions {
  username?: string
  type?: CardType
  metal?: string
  colors?: string
  angle?: number
  border?: CardBorder
  width?: number
  compact?: boolean
  title?: string
  stat1?: string; label1?: string
  stat2?: string; label2?: string
  stat3?: string; label3?: string
  theme?: Theme
  style?: DesignStyle
  fontFamily?: FontFamily
  textColor?: string
  fontScale?: number
}

interface StatItem { label: string; value: string; icon: string }

// 'blank' intentionally has no template — a fully empty canvas unless stat1/2/3 are supplied
const CARD_TEMPLATES: Record<CardType, StatItem[]> = {
  stats: [{ label: 'Stars Earned', value: '12.4k', icon: '★' }, { label: 'Total Commits', value: '3,291', icon: '◉' }, { label: 'PRs Merged', value: '847', icon: '⎇' }],
  langs: [{ label: 'JavaScript', value: '42%', icon: 'JS' }, { label: 'TypeScript', value: '28%', icon: 'TS' }, { label: 'Python', value: '18%', icon: 'Py' }],
  streak: [{ label: 'Total Contrib', value: '1,204', icon: '⚡' }, { label: 'Longest Streak', value: '89 d', icon: '🔥' }, { label: 'Current', value: '12 d', icon: '✦' }],
  trophy: [{ label: 'Rank', value: 'S+', icon: '◆' }, { label: 'Followers', value: '5k+', icon: '◈' }, { label: 'Reviews', value: 'Expert', icon: '✦' }],
  activity: [{ label: 'This Week', value: '48', icon: '◑' }, { label: 'This Month', value: '214', icon: '◕' }, { label: 'All Time', value: '3.2k', icon: '◉' }],
  social: [{ label: 'Followers', value: '1.2k', icon: '◉' }, { label: 'Following', value: '340', icon: '◈' }, { label: 'Repos', value: '86', icon: '⎇' }],
  blank: [],
}

const FONT_STACKS: Record<FontFamily, string> = {
  sans: "'Space Grotesk','Helvetica Neue',sans-serif",
  serif: "'Georgia','Times New Roman',serif",
  mono: "'Share Tech Mono','Courier New',monospace",
  display: "'Orbitron','Arial Black',monospace",
  rounded: "'Quicksand','Nunito',sans-serif",
}

export function renderCard(opts: CardOptions): string {
  const {
    username,
    type = 'stats',
    border = 'metal',
    compact = false,
    theme = 'dark',
    style = 'metallic',
  } = opts

  const w = Math.min(Math.max(Number(opts.width ?? 495), 300), 700)
  const h = compact ? 140 : 200

  const metal = opts.metal ?? 'chrome'
  const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
  const themeColors = getThemeColors(theme, style)
  const uid = uniqueId('mc')

  const colorSpec: ColorSpec = opts.colors
    ? parseColorList(opts.colors, opts.angle ?? 135)
    : (metal in METALS ? metal as MetalName : metal)
  const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, h)

  const bgId = `${uid}_bg`
  const bgDefs = `<linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${theme === 'dark' ? '#0d1117' : '#f8f9fc'}"/>
    <stop offset="100%" stop-color="${theme === 'dark' ? '#161b22' : '#eef0f8'}"/>
  </linearGradient>`

  // ── Merge template + explicit overrides, then keep ONLY stats with a real value ──
  // This is what lets the card "vacate the space" instead of showing empty/placeholder slots.
  const template = [...(CARD_TEMPLATES[type] ?? CARD_TEMPLATES.stats)]
  const merged: (StatItem | null)[] = [0, 1, 2].map(i => {
    const statKey = `stat${i + 1}` as 'stat1' | 'stat2' | 'stat3'
    const labelKey = `label${i + 1}` as 'label1' | 'label2' | 'label3'
    const override = opts[statKey]
    const base = template[i]
    if (override) return { value: override, label: opts[labelKey] ?? base?.label ?? '', icon: base?.icon ?? '◆' }
    return base ?? null
  })
  const activeStats = merged.filter((s): s is StatItem => !!s && !!s.value)

  const textColor = opts.textColor || themeColors.text
  const accentColor = m.glow
  const dimColor = opts.textColor || themeColors.textMuted
  const family = FONT_STACKS[opts.fontFamily ?? 'display']
  const scale = Math.min(Math.max(Number(opts.fontScale ?? 1), 0.6), 1.8)

  // Dynamic column positions — 1/2/3 active stats are spaced differently so
  // nothing looks off-center when a slot is intentionally left empty
  const statXPositions =
    activeStats.length === 1 ? [w * 0.5] :
      activeStats.length === 2 ? [w * 0.32, w * 0.68] :
        [w * 0.18, w * 0.5, w * 0.82]

  const hasTitle = !!(opts.title || username)
  const cardTitle = opts.title ?? (username ? `@${username}` : '')

  // Vertically re-flow: if there's no title, the stats row (or empty state) shifts up to fill the gap
  const titleY = compact ? 36 : 50
  const subLabelY = compact ? 54 : 72
  const dividerY = compact ? 62 : 84
  const statLabelYWithTitle = compact ? 80 : 128
  const statValueYWithTitle = compact ? 105 : 155
  const statLabelYNoTitle = h * 0.46
  const statValueYNoTitle = h * 0.64
  const statLabelY = hasTitle ? statLabelYWithTitle : statLabelYNoTitle
  const statValueY = hasTitle ? statValueYWithTitle : statValueYNoTitle

  // ── Border variants ────────────────────────────────────────────────────────
  let borderDefs = ''
  let borderEl = ''
  if (border === 'metal') {
    const { defs: bdDefs } = resolveColor(colorSpec, w, h)
    borderDefs = bdDefs
    borderEl = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="none" stroke="${mainFill}" stroke-width="1.5"/>`
  } else if (border === 'glow') {
    const { id: bfId, defs: bfDefs } = buildFilter({ glow: true, glowColor: m.glow }, `${uid}_bf`)
    borderDefs = bfDefs
    borderEl = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="none"
      stroke="${accentColor}" stroke-width="1.5" filter="url(#${bfId})" opacity="0.8"/>`
  } else if (border === 'ridge') {
    borderEl = `
      <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.15"/>
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="8" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>`
  } else if (border === 'minimal') {
    borderEl = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.35"/>`
  } else if (border === 'double') {
    borderEl = `
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" fill="none" stroke="${mainFill}" stroke-width="1"/>
      <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="7" fill="none" stroke="${mainFill}" stroke-width="0.75" opacity="0.5"/>`
  } else if (border === 'dashed') {
    borderEl = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" fill="none"
      stroke="${accentColor}" stroke-width="1.25" stroke-dasharray="6 4" opacity="0.6"/>`
  }
  // 'none' → borderEl stays empty

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
  role="img" aria-label="${escapeXml(cardTitle || 'Card')}">
  <title>${escapeXml(cardTitle || 'Card')}${hasTitle ? ` — ${type} card` : ''}</title>
  <defs>
    ${mainDefs}
    ${bgDefs}
    ${borderDefs}
  </defs>

  <rect width="${w}" height="${h}" rx="10" fill="url(#${bgId})"/>
  <rect width="${w}" height="3" rx="2" fill="${mainFill}"/>

  ${hasTitle ? `
  <text x="20" y="${titleY}"
    font-family="${family}"
    font-size="${compact ? 14 : 17}" font-weight="700"
    fill="${mainFill}" letter-spacing="0.5"
  >${escapeXml(cardTitle)}</text>

  <text x="20" y="${subLabelY}"
    font-family="'Rajdhani',Arial,sans-serif"
    font-size="11" font-weight="500"
    fill="${dimColor}" letter-spacing="2" opacity="0.7"
  >${type.toUpperCase()} STATISTICS</text>

  <line x1="16" y1="${dividerY}" x2="${w - 16}" y2="${dividerY}"
    stroke="${mainFill}" stroke-width="1" opacity="0.3"/>` : ''}

  ${activeStats.map((s, i) => `
  <text x="${statXPositions[i]}" y="${statLabelY}"
    text-anchor="middle" font-family="'Share Tech Mono',monospace"
    font-size="10" fill="${dimColor}" letter-spacing="0.8"
  >${escapeXml(s.label)}</text>
  <text x="${statXPositions[i]}" y="${statValueY}"
    text-anchor="middle" font-family="${family}"
    font-size="${(compact ? 16 : 20) * scale}" font-weight="700"
    fill="${textColor}"
  >${escapeXml(s.value)}</text>`).join('')}

  ${activeStats.length > 1 ? statXPositions.slice(0, -1).map((_, i) => {
    const midX = (statXPositions[i] + statXPositions[i + 1]) / 2
    return `<line x1="${midX}" y1="${hasTitle ? (compact ? 70 : 95) : statLabelY - (compact ? 14 : 20)}"
      x2="${midX}" y2="${hasTitle ? (compact ? 120 : 168) : statValueY + (compact ? 12 : 16)}"
      stroke="${accentColor}" stroke-width="1" opacity="0.18"/>`
  }).join('') : ''}

  <line x1="16" y1="${h - 22}" x2="${w - 16}" y2="${h - 22}"
    stroke="${mainFill}" stroke-width="1" opacity="0.15"/>
  <text x="${w - 16}" y="${h - 9}" text-anchor="end"
    font-family="'Share Tech Mono',monospace"
    font-size="9" fill="${dimColor}" opacity="0.35" letter-spacing="1"
  >READMEFORGE</text>

  ${borderEl}
</svg>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}