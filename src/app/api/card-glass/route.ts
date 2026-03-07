import { NextRequest, NextResponse } from 'next/server'
import { renderGlassCard } from '@/lib/renderers/card-glass'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderGlassCard({ title: p.get('title') ?? 'Repos', value: p.get('value') ?? '42', subtitle: p.get('subtitle') ?? '', icon: p.get('icon') ?? '◈', theme: (p.get('theme') ?? 'dark') as any, style: (p.get('style') ?? 'card') as any, width: Number(p.get('width') ?? 220), height: Number(p.get('height') ?? 170), tint: p.get('tint') ?? undefined, blur: Number(p.get('blur') ?? 8) })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
