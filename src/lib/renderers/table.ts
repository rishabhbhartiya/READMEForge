import {
    MetalName, METALS, resolveColor, ColorSpec,
    parseColorList, getThemeColors,
    Theme, DesignStyle, uniqueId,
} from '../metals'

export type TableType = 'stats' | 'skills' | 'projects' | 'timeline' | 'comparison'

export interface TableOptions {
    type?: TableType
    metal?: string
    colors?: string
    angle?: number
    width?: number
    theme?: Theme
    style?: DesignStyle
    title?: string
    /** pipe-separated rows, cells comma-separated: "React,90%,Frontend|Rust,60%,Systems" */
    rows?: string
    /** comma-separated column headers */
    headers?: string
}

// ── Default data per type ──────────────────────────────────────────────────
const DEFAULTS: Record<TableType, { headers: string[]; rows: string[][] }> = {
    stats: {
        headers: ['Metric', 'Value', 'Change'],
        rows: [
            ['Total Commits', '3,291', '↑ 12%'],
            ['Stars Earned', '12.4k', '↑ 8%'],
            ['PRs Merged', '847', '↑ 5%'],
            ['Issues Closed', '1,203', '↑ 19%'],
        ],
    },
    skills: {
        headers: ['Language', 'Proficiency', 'Years'],
        rows: [
            ['TypeScript', '████████░░  88%', '4'],
            ['Python', '███████░░░  72%', '6'],
            ['Rust', '██████░░░░  60%', '2'],
            ['Go', '███████░░░  70%', '3'],
        ],
    },
    projects: {
        headers: ['Project', 'Stars', 'Tech', 'Status'],
        rows: [
            ['ReadmeForge', '2.1k', 'Next.js', '🟢 Active'],
            ['MetalUI', '890', 'React', '🟢 Active'],
            ['RustKit', '340', 'Rust', '🟡 WIP'],
            ['PyUtils', '120', 'Python', '⚪ Archived'],
        ],
    },
    timeline: {
        headers: ['Year', 'Role', 'Company'],
        rows: [
            ['2024', 'Senior Engineer', 'TechCorp'],
            ['2022', 'Full-Stack Dev', 'StartupXYZ'],
            ['2020', 'Frontend Dev', 'AgencyABC'],
            ['2018', 'Junior Dev', 'FreelanceHub'],
        ],
    },
    comparison: {
        headers: ['Feature', 'Free', 'Pro', 'Enterprise'],
        rows: [
            ['Components', '10', '100+', 'Unlimited'],
            ['API Calls', '1k/mo', '50k/mo', 'Unlimited'],
            ['Custom Metal', '✗', '✓', '✓'],
            ['Support', 'Docs', 'Email', 'Dedicated'],
        ],
    },
}

export function renderTable(opts: TableOptions): string {
    const {
        type = 'stats',
        theme = 'dark',
        style = 'metallic',
        title,
    } = opts

    const w = Math.min(Math.max(Number(opts.width ?? 600), 300), 900)

    const metal = opts.metal ?? 'chrome'
    const m = METALS[metal in METALS ? metal as MetalName : 'chrome'] ?? METALS.chrome
    const tc = getThemeColors(theme, style)
    const uid = uniqueId('tbl')

    const colorSpec: ColorSpec = opts.colors
        ? parseColorList(opts.colors, opts.angle ?? 135)
        : (metal in METALS ? metal as MetalName : metal)
    const { fill: mainFill, defs: mainDefs } = resolveColor(colorSpec, w, 400)

    // ── Parse rows / headers ──────────────────────────────────────────────────
    const defaults = DEFAULTS[type] ?? DEFAULTS.stats
    const colHeaders = opts.headers
        ? opts.headers.split(',').map(s => s.trim())
        : defaults.headers
    const dataRows: string[][] = opts.rows
        ? opts.rows.split('|').map(r => r.split(',').map(c => c.trim()))
        : defaults.rows

    const cols = colHeaders.length
    const colW = (w - 32) / cols
    const rowH = 36
    const headH = 44
    const topPad = 56            // space for title
    const totalH = topPad + headH + dataRows.length * rowH + 28

    // ── Background ────────────────────────────────────────────────────────────
    const bgId = `${uid}_bg`
    const bgDefs = `<linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="${theme === 'dark' ? '#0d1117' : '#f8f9fc'}"/>
    <stop offset="100%" stop-color="${theme === 'dark' ? '#161b22' : '#eef0f8'}"/>
  </linearGradient>`

    // ── Row stripe ────────────────────────────────────────────────────────────
    const stripeColor = theme === 'dark'
        ? 'rgba(255,255,255,0.025)'
        : 'rgba(0,0,0,0.03)'

    const stripeRows = dataRows.map((_, i) => i % 2 === 0
        ? `<rect x="16" y="${topPad + headH + i * rowH}" width="${w - 32}" height="${rowH}"
         fill="${stripeColor}" rx="2"/>`
        : ''
    ).join('')

    // ── Header cells ─────────────────────────────────────────────────────────
    const headerCells = colHeaders.map((h, i) =>
        `<text x="${16 + i * colW + colW / 2}" y="${topPad + headH / 2 + 5}"
      text-anchor="middle"
      font-family="'Orbitron','Arial Black',monospace"
      font-size="10" font-weight="700" letter-spacing="1.5"
      fill="${mainFill}"
    >${escapeXml(h.toUpperCase())}</text>`
    ).join('')

    // ── Data cells ────────────────────────────────────────────────────────────
    const dataCells = dataRows.map((row, ri) =>
        row.slice(0, cols).map((cell, ci) =>
            `<text x="${16 + ci * colW + (ci === 0 ? 8 : colW / 2)}" y="${topPad + headH + ri * rowH + rowH / 2 + 5}"
        text-anchor="${ci === 0 ? 'start' : 'middle'}"
        font-family="'Share Tech Mono',monospace"
        font-size="11" fill="${ci === 0 ? tc.text : tc.textMuted}"
        ${ci === 0 ? `font-weight="600"` : ''}
      >${escapeXml(cell)}</text>`
        ).join('')
    ).join('')

    // ── Vertical dividers ─────────────────────────────────────────────────────
    const vLines = Array.from({ length: cols - 1 }, (_, i) =>
        `<line x1="${16 + (i + 1) * colW}" y1="${topPad + 8}"
          x2="${16 + (i + 1) * colW}" y2="${totalH - 16}"
      stroke="${m.glow}" stroke-width="1" opacity="0.12"/>`
    ).join('')

    // ── Horizontal row lines ──────────────────────────────────────────────────
    const hLines = dataRows.map((_, i) =>
        `<line x1="16" y1="${topPad + headH + i * rowH}" x2="${w - 16}" y2="${topPad + headH + i * rowH}"
      stroke="${m.glow}" stroke-width="1" opacity="0.08"/>`
    ).join('')

    const tableTitle = title ?? (type.charAt(0).toUpperCase() + type.slice(1) + ' Table')

    return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}"
  role="img" aria-label="${escapeXml(tableTitle)}">
  <title>${escapeXml(tableTitle)}</title>
  <defs>
    ${mainDefs}
    ${bgDefs}
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${totalH}" rx="10" fill="url(#${bgId})"/>
  <!-- Top accent bar -->
  <rect width="${w}" height="3" rx="2" fill="${mainFill}"/>

  <!-- Title -->
  <text x="20" y="36"
    font-family="'Orbitron','Arial Black',monospace"
    font-size="14" font-weight="700" letter-spacing="0.5"
    fill="${mainFill}"
  >${escapeXml(tableTitle)}</text>

  <!-- Header background -->
  <rect x="16" y="${topPad}" width="${w - 32}" height="${headH}"
    fill="${mainFill}" fill-opacity="0.08" rx="4"/>
  <rect x="16" y="${topPad}" width="${w - 32}" height="2"
    fill="${mainFill}" fill-opacity="0.6" rx="1"/>

  <!-- Row stripes -->
  ${stripeRows}

  <!-- Vertical dividers -->
  ${vLines}

  <!-- Horizontal lines -->
  ${hLines}

  <!-- Header cells -->
  ${headerCells}

  <!-- Data cells -->
  ${dataCells}

  <!-- Bottom line -->
  <line x1="16" y1="${totalH - 22}" x2="${w - 16}" y2="${totalH - 22}"
    stroke="${mainFill}" stroke-width="1" opacity="0.15"/>
  <text x="${w - 16}" y="${totalH - 9}" text-anchor="end"
    font-family="'Share Tech Mono',monospace"
    font-size="9" fill="${tc.textMuted}" opacity="0.35" letter-spacing="1"
  >READMEFORGE.DEV</text>

  <!-- Border -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${totalH - 1}"
    rx="10" fill="none" stroke="${mainFill}" stroke-width="1.5" opacity="0.4"/>
</svg>`
}

function escapeXml(str: string): string {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}