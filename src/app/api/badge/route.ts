// src/app/api/badge/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderBadge } from '@/lib/renderers/badge'
import { MetalType, BadgeShape } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  try {
    const svg = renderBadge({
      label:  p.get('label') ?? p.get('l') ?? 'badge',
      value:  p.get('value') ?? p.get('v') ?? undefined,
      metal: (p.get('metal') ?? p.get('color') ?? 'chrome') as MetalType,
      shape: (p.get('shape') ?? 'pill') as BadgeShape,
      icon:   p.get('icon')  ?? '',
      fontSize: p.get('fontSize') ? Number(p.get('fontSize')) : 11,
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
