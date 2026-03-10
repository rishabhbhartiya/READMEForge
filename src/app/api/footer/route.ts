// src/app/api/footer/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderFooter, FooterStyle } from '@/lib/renderers/footer'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderFooter({
      text: p.get('text') ?? 'Thanks for visiting!',
      subtext: p.get('subtext') ?? '',
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'wave') as FooterStyle,
      width: Number(p.get('width') ?? 900),
      height: Number(p.get('height') ?? 180),
      links: p.get('links') ?? '',
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
      bg: p.get('bg') ?? undefined,
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