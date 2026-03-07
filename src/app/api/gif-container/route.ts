import { NextRequest, NextResponse } from 'next/server'
import { renderGifContainer } from '@/lib/renderers/containers'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderGifContainer({ src: p.get('src') ?? '', alt: p.get('alt') ?? 'GIF', width: Number(p.get('width') ?? 300), height: Number(p.get('height') ?? 200), metal: (p.get('metal') ?? 'electric') as MetalType, frame: (p.get('frame') ?? 'neon') as any, label: p.get('label') ?? 'GIF' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
