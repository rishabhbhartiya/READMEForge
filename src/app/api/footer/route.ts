import { NextRequest, NextResponse } from 'next/server'
import { renderFooter } from '@/lib/renderers/footer'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderFooter({ text: p.get('text') ?? 'Thanks for visiting!', subtext: p.get('subtext') ?? '', metal: (p.get('metal') ?? 'chrome') as MetalType, style: (p.get('style') ?? 'wave') as any, width: Number(p.get('width') ?? 900), height: Number(p.get('height') ?? 180), links: p.get('links') ?? '' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
