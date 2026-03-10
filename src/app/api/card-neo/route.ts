// src/app/api/card-neo/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderNeoCard, NeoTheme, NeoStyle } from '@/lib/renderers/card-neo'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderNeoCard({
      title: p.get('title') ?? 'Commits',
      value: p.get('value') ?? '1,247',
      subtitle: p.get('subtitle') ?? '',
      icon: p.get('icon') ?? '◉',
      neoTheme: (p.get('neoTheme') ?? p.get('theme') ?? 'dark') as NeoTheme,
      neoStyle: (p.get('neoStyle') ?? p.get('style') ?? 'raised') as NeoStyle,
      metal: p.get('metal') ?? undefined,
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 200),
      height: Number(p.get('height') ?? 160),
      accent: p.get('accent') ?? undefined,
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