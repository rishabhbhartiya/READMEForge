// src/lib/renderers/composite.ts
//
// Pure layout/composition logic — takes already-fetched child SVG markup
// (from ANY /api/* route: cards, headers, footers, terminals, badges,
// buttons, dividers, banners, progress bars, skill trees, social links,
// tables, text animations, containers — literally anything that returns
// an <svg>) and arranges it into one parent SVG.
//
// Fetching/resolving each child happens in the route handler (route.ts),
// since that's where we have access to the request origin for internal
// same-deployment calls. This file only does layout math + XML assembly.
// ─────────────────────────────────────────────────────────────────────────────

export type CompositeLayout = 'grid' | 'row' | 'column' | 'table' | 'free'

export interface ResolvedChild {
    /** Inner SVG markup (everything between <svg ...> and </svg>) */
    inner: string
    /** Intrinsic width/height as rendered by the source component */
    width: number
    height: number
    /** Only used when layout='free' */
    x?: number
    y?: number
    /** Set when this child failed to resolve — renders a small error placeholder instead */
    error?: string
}

export interface CompositeLayoutOptions {
    layout?: CompositeLayout
    cols?: number
    gap?: number
    padding?: number
    /** If both are set, every cell is this fixed size and children scale-to-fit.
     *  If omitted, cell sizes auto-follow each child's own natural width/height. */
    cellWidth?: number
    cellHeight?: number
    background?: string
    title?: string
    titleColor?: string
    /** Draws divider lines between cells + an outer border. Defaults to true for layout='table'. */
    showGridLines?: boolean
}

function escapeXml(s: string) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

interface Placed { x: number; y: number; w: number; h: number }

function layoutChildren(children: ResolvedChild[], layout: CompositeLayout, opts: CompositeLayoutOptions) {
    const gap = Math.min(Math.max(Number(opts.gap ?? 16), 0), 80)
    const uniform = !!(opts.cellWidth && opts.cellHeight)
    const cellW = Number(opts.cellWidth ?? 0)
    const cellH = Number(opts.cellHeight ?? 0)
    const n = children.length

    let positions: Placed[] = []
    let contentW = 0, contentH = 0
    let colBoundaries: number[] = []
    let rowBoundaries: number[] = []

    if (layout === 'free') {
        for (const c of children) {
            const x = c.x ?? 0, y = c.y ?? 0
            positions.push({ x, y, w: c.width, h: c.height })
            contentW = Math.max(contentW, x + c.width)
            contentH = Math.max(contentH, y + c.height)
        }
        return { positions, contentW, contentH, colBoundaries, rowBoundaries }
    }

    const cols =
        layout === 'row' ? n :
            layout === 'column' ? 1 :
                Math.max(1, Math.min(Number(opts.cols ?? Math.ceil(Math.sqrt(n))), n))
    const rows = Math.ceil(n / cols)

    if (uniform) {
        for (let i = 0; i < n; i++) {
            const col = i % cols, row = Math.floor(i / cols)
            positions.push({ x: col * (cellW + gap), y: row * (cellH + gap), w: cellW, h: cellH })
        }
        contentW = cols * cellW + (cols - 1) * gap
        contentH = rows * cellH + (rows - 1) * gap
        for (let c = 1; c < cols; c++) colBoundaries.push(c * cellW + (c - 0.5) * gap)
        for (let r = 1; r < rows; r++) rowBoundaries.push(r * cellH + (r - 0.5) * gap)
    } else {
        const colWidths = new Array(cols).fill(0)
        const rowHeights = new Array(rows).fill(0)
        children.forEach((c, i) => {
            const col = i % cols, row = Math.floor(i / cols)
            colWidths[col] = Math.max(colWidths[col], c.width)
            rowHeights[row] = Math.max(rowHeights[row], c.height)
        })
        const colX: number[] = []
        let cx = 0
        for (let c = 0; c < cols; c++) { colX.push(cx); cx += colWidths[c] + gap }
        const rowY: number[] = []
        let ry = 0
        for (let r = 0; r < rows; r++) { rowY.push(ry); ry += rowHeights[r] + gap }

        children.forEach((c, i) => {
            const col = i % cols, row = Math.floor(i / cols)
            const boxW = colWidths[col], boxH = rowHeights[row]
            positions.push({
                x: colX[col] + (boxW - c.width) / 2,
                y: rowY[row] + (boxH - c.height) / 2,
                w: c.width, h: c.height,
            })
        })
        contentW = colX[cols - 1] + colWidths[cols - 1]
        contentH = rowY[rows - 1] + rowHeights[rows - 1]
        for (let c = 1; c < cols; c++) colBoundaries.push(colX[c] - gap / 2)
        for (let r = 1; r < rows; r++) rowBoundaries.push(rowY[r] - gap / 2)
    }

    return { positions, contentW, contentH, colBoundaries, rowBoundaries }
}

export function renderComposite(children: ResolvedChild[], opts: CompositeLayoutOptions): string {
    const layout = opts.layout ?? 'grid'
    const padding = Math.min(Math.max(Number(opts.padding ?? 16), 0), 80)
    const showGridLines = opts.showGridLines ?? layout === 'table'

    const { positions, contentW, contentH, colBoundaries, rowBoundaries } = layoutChildren(children, layout, opts)

    const titleH = opts.title ? 36 : 0
    const totalW = Math.max(1, contentW + padding * 2)
    const totalH = Math.max(1, contentH + padding * 2 + titleH)

    const bg = opts.background && opts.background !== 'transparent'
        ? `<rect width="${totalW}" height="${totalH}" fill="${opts.background}"/>`
        : ''

    const titleEl = opts.title
        ? `<text x="${padding}" y="${padding + 16}" font-family="'Space Grotesk',sans-serif"
        font-size="16" font-weight="700" fill="${opts.titleColor ?? '#e0e4f0'}"
      >${escapeXml(opts.title)}</text>`
        : ''

    const childrenEls = children.map((c, i) => {
        const pos = positions[i]
        const x = pos.x + padding
        const y = pos.y + padding + titleH
        if (c.error) {
            return `<g transform="translate(${x},${y})">
        <rect width="${pos.w}" height="${pos.h}" rx="6" fill="rgba(255,60,60,0.08)" stroke="rgba(255,60,60,0.4)" stroke-width="1"/>
        <text x="${pos.w / 2}" y="${pos.h / 2}" text-anchor="middle" dominant-baseline="central"
          font-family="monospace" font-size="10" fill="#ff6060">${escapeXml(c.error)}</text>
      </g>`
        }
        return `<svg x="${x}" y="${y}" width="${pos.w}" height="${pos.h}"
      viewBox="0 0 ${c.width} ${c.height}" preserveAspectRatio="xMidYMid meet">${c.inner}</svg>`
    }).join('\n')

    let gridLinesEl = ''
    if (showGridLines && (colBoundaries.length || rowBoundaries.length)) {
        const stroke = 'rgba(255,255,255,0.12)'
        const lines: string[] = []
        for (const cb of colBoundaries) {
            lines.push(`<line x1="${cb + padding}" y1="${padding + titleH}" x2="${cb + padding}" y2="${totalH - padding}" stroke="${stroke}" stroke-width="1"/>`)
        }
        for (const rb of rowBoundaries) {
            lines.push(`<line x1="${padding}" y1="${rb + padding + titleH}" x2="${totalW - padding}" y2="${rb + padding + titleH}" stroke="${stroke}" stroke-width="1"/>`)
        }
        lines.push(`<rect x="${padding - 8}" y="${padding + titleH - 8}" width="${contentW + 16}" height="${contentH + 16}"
      fill="none" stroke="${stroke}" stroke-width="1" rx="8"/>`)
        gridLinesEl = lines.join('\n')
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}"
  role="img" aria-label="${escapeXml(opts.title ?? 'Component grid')}">
  ${bg}
  ${titleEl}
  ${gridLinesEl}
  ${childrenEls}
</svg>`
}

/** Strips the outer <svg> tag, keeping everything else (defs, shapes, text, etc) */
export function extractSvg(svgString: string, fallbackW: number, fallbackH: number) {
    const wMatch = svgString.match(/<svg[^>]*\swidth="([\d.]+)"/)
    const hMatch = svgString.match(/<svg[^>]*\sheight="([\d.]+)"/)
    const width = wMatch ? parseFloat(wMatch[1]) : fallbackW
    const height = hMatch ? parseFloat(hMatch[1]) : fallbackH
    const inner = svgString.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    return { inner, width, height }
}