// src/app/api/divider/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderDivider, DividerStyle } from '@/lib/renderers/divider'
import { MetalType } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  try {
    const svg = renderDivider({
      metal:  (p.get('metal') ?? 'chrome') as MetalType,
      style:  (p.get('style') ?? 'line') as DividerStyle,
      width:   Number(p.get('width')  ?? 900),
      height:  Number(p.get('height') ?? 4),
      opacity: Number(p.get('opacity') ?? 1),
    })

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new NextResponse('Error', { status: 400 })
  }
}
