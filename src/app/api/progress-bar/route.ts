import { NextRequest, NextResponse } from 'next/server'
import { renderProgressBar } from '@/lib/renderers/extras'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderProgressBar({ label: p.get('label') ?? 'Skill', value: Number(p.get('value') ?? 75), metal: (p.get('metal') ?? 'gold') as MetalType, style: (p.get('style') ?? 'metallic') as any, width: Number(p.get('width') ?? 400), height: Number(p.get('height') ?? 32), showValue: p.get('showValue') !== 'false', animated: p.get('animated') !== 'false' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
