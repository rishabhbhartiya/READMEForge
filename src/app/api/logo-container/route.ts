import { NextRequest, NextResponse } from 'next/server'
import { renderLogoContainer } from '@/lib/renderers/containers'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderLogoContainer({ text: p.get('text') ?? 'MF', src: p.get('src') ?? '', metal: (p.get('metal') ?? 'gold') as MetalType, style: (p.get('style') ?? 'hexagon') as any, size: Number(p.get('size') ?? 120), glow: p.get('glow') !== 'false', spin: p.get('spin') === 'true' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
