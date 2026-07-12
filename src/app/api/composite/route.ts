// src/app/api/composite/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Combines ANY existing component endpoint — cards, headers, footers,
// terminals, badges, buttons, dividers, banners, progress bars, skill trees,
// social links, tables, text animations, image/gif/logo containers — into a
// single parent SVG. Each child is fetched server-side (own deployment or an
// external URL) and inlined, so the final image is one self-contained SVG:
// no nested network requests happen when GitHub/a browser renders it.
//
// cards param shape (URL-encoded JSON array), one of two forms per item:
//   { "type": "terminal", "params": { "lines": "...", "theme": "dark" } }
//     -> internally calls this deployment's own /api/terminal?lines=...&theme=dark
//   { "src": "https://any-host.com/some.svg", "width": 220, "height": 170 }
//     -> fetched directly as given
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderComposite, extractSvg, ResolvedChild, CompositeLayout } from '@/lib/renderers/composite'

export const runtime = 'edge'

interface CardSpec {
    type?: string
    params?: Record<string, string | number | boolean>
    src?: string
    width?: number
    height?: number
    x?: number
    y?: number
}

function buildInternalUrl(origin: string, type: string, params: Record<string, any> = {}): string {
    const url = new URL(`/api/${type}`, origin)
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
    return url.toString()
}

async function resolveChild(spec: CardSpec, origin: string): Promise<ResolvedChild> {
    const fallbackW = spec.width ?? 220
    const fallbackH = spec.height ?? 170

    const fetchUrl = spec.type
        ? buildInternalUrl(origin, spec.type, spec.params)
        : spec.src

    if (!fetchUrl) {
        return { inner: '', width: fallbackW, height: fallbackH, x: spec.x, y: spec.y, error: 'no type or src given' }
    }

    try {
        const res = await fetch(fetchUrl)
        if (!res.ok) {
            return { inner: '', width: fallbackW, height: fallbackH, x: spec.x, y: spec.y, error: `${spec.type ?? 'src'} ${res.status}` }
        }
        const contentType = res.headers.get('content-type') ?? ''
        if (!contentType.includes('svg')) {
            return { inner: '', width: fallbackW, height: fallbackH, x: spec.x, y: spec.y, error: 'not an SVG response' }
        }
        const text = await res.text()
        const { inner, width, height } = extractSvg(text, fallbackW, fallbackH)
        // width/height come from the actually-fetched SVG — spec.width/height are only
        // used above as a fallback inside extractSvg() if that SVG had no width/height
        // attributes at all. They must NOT override a successful extraction, or the
        // viewBox and the rendered content end up mismatched (clipped/stretched output).
        return { inner, width, height, x: spec.x, y: spec.y }
    } catch (e) {
        return { inner: '', width: fallbackW, height: fallbackH, x: spec.x, y: spec.y, error: 'fetch failed' }
    }
}

export async function GET(req: NextRequest) {
    const p = req.nextUrl.searchParams
    try {
        const cardsRaw = p.get('cards')
        if (!cardsRaw) {
            return new NextResponse(
                'Missing "cards" param — pass a URL-encoded JSON array, e.g. ' +
                'cards=[{"type":"terminal","params":{"lines":"npm install"}},{"type":"card-glass","params":{"title":"Stars","value":"1.2k"}}]',
                { status: 400 }
            )
        }

        let specs: CardSpec[]
        try {
            specs = JSON.parse(cardsRaw)
        } catch {
            return new NextResponse('Invalid JSON in "cards" param', { status: 400 })
        }
        if (!Array.isArray(specs) || specs.length === 0) {
            return new NextResponse('"cards" must be a non-empty array', { status: 400 })
        }
        if (specs.length > 24) {
            return new NextResponse('Too many components (max 24 per composite)', { status: 400 })
        }

        const origin = req.nextUrl.origin
        // Fetch every child concurrently — a single slow/failed child doesn't block the rest
        const children = await Promise.all(specs.map(spec => resolveChild(spec, origin)))

        const svg = renderComposite(children, {
            layout: (p.get('layout') ?? 'grid') as CompositeLayout,
            cols: p.get('cols') ? Number(p.get('cols')) : undefined,
            gap: p.get('gap') ? Number(p.get('gap')) : undefined,
            padding: p.get('padding') ? Number(p.get('padding')) : undefined,
            cellWidth: p.get('cellWidth') ? Number(p.get('cellWidth')) : undefined,
            cellHeight: p.get('cellHeight') ? Number(p.get('cellHeight')) : undefined,
            background: p.get('background') ?? undefined,
            title: p.get('title') ?? undefined,
            titleColor: p.get('titleColor') ?? undefined,
            showGridLines: p.has('showGridLines') ? p.get('showGridLines') === 'true' : undefined,
        })

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': 'public, max-age=1800',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (e) {
        console.error('[composite]', e)
        return new NextResponse('Error generating composite SVG', { status: 400 })
    }
}
// ─────────────────────────────────────────────────────────────────────────────