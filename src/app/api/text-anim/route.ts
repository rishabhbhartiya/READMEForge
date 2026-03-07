import { NextRequest, NextResponse } from 'next/server'
import { renderTextAnim } from '@/lib/renderers/text-anim'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderTextAnim({ text: p.get('text') ?? 'Hello World', effect: (p.get('effect') ?? 'typewriter') as any, metal: (p.get('metal') ?? 'electric') as MetalType, width: Number(p.get('width') ?? 600), height: Number(p.get('height') ?? 80), fontSize: Number(p.get('size') ?? 32), speed: (p.get('speed') ?? 'normal') as any, color: p.get('color') ?? undefined, bg: (p.get('bg') ?? 'dark') as any, fontFamily: p.get('font') ?? 'Orbitron' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=3600', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
