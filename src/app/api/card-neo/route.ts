import { NextRequest, NextResponse } from 'next/server'
import { renderNeoCard } from '@/lib/renderers/card-neo'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderNeoCard({ title: p.get('title') ?? 'Commits', value: p.get('value') ?? '1,247', subtitle: p.get('subtitle') ?? '', icon: p.get('icon') ?? '◉', theme: (p.get('theme') ?? 'dark') as any, style: (p.get('style') ?? 'raised') as any, width: Number(p.get('width') ?? 200), height: Number(p.get('height') ?? 160), accent: p.get('accent') ?? undefined })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
