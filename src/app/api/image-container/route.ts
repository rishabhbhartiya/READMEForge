import { NextRequest, NextResponse } from 'next/server'
import { renderImageContainer } from '@/lib/renderers/containers'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderImageContainer({ src: p.get('src') ?? '', alt: p.get('alt') ?? 'Image', width: Number(p.get('width') ?? 300), height: Number(p.get('height') ?? 220), frame: (p.get('frame') ?? 'metallic') as any, metal: (p.get('metal') ?? 'chrome') as MetalType, caption: p.get('caption') ?? '', glow: p.get('glow') !== 'false' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
