import { NextRequest, NextResponse } from 'next/server'
import { renderTable, TableType } from '@/lib/renderers/table'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const p = req.nextUrl.searchParams
    try {
        const svg = renderTable({
            type: (p.get('type') ?? 'stats') as TableType,
            metal: p.get('metal') ?? 'chrome',
            colors: p.get('colors') ?? undefined,
            angle: p.get('angle') ? Number(p.get('angle')) : undefined,
            width: Number(p.get('width') ?? 600),
            theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
            title: p.get('title') ?? undefined,
            rows: p.get('rows') ?? undefined,
            headers: p.get('headers') ?? undefined,
        })
        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch {
        return new NextResponse('Error', { status: 400 })
    }
}