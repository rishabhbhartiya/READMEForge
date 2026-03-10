// src/app/api/logo-container/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderLogoContainer, LogoStyle } from '@/lib/renderers/containers'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderLogoContainer({
      text: p.get('text') ?? 'MF',
      src: p.get('src') ?? '',
      metal: p.get('metal') ?? 'gold',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'hexagon') as LogoStyle,
      size: Number(p.get('size') ?? 120),
      glow: p.get('glow') !== 'false',
      spin: p.get('spin') === 'true',
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
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


// ─────────────────────────────────────────────────────────────────────────────