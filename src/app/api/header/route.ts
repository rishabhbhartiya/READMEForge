// src/app/api/header/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderHeader } from '@/lib/renderers/header'
import { MetalType } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderHeader({
      name:    p.get('name')    ?? 'Your Name',
      title:   p.get('title')  ?? 'Developer',
      tagline: p.get('tagline') ?? p.get('sub') ?? '',
      metal:  (p.get('metal')  ?? 'chrome') as MetalType,
      style:  (p.get('style')  ?? 'profile') as any,
      width:   Number(p.get('width')  ?? 900),
      height:  Number(p.get('height') ?? 280),
      wave:    p.get('wave') !== 'false',
    })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
