// src/app/api/card-neo/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderNeoCard, NeoTheme, NeoStyle, NeoBorder } from '@/lib/renderers/card-neo'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderNeoCard({
      title: p.get('title') ?? undefined,
      value: p.get('value') ?? undefined,
      subtitle: p.get('subtitle') ?? undefined,
      icon: p.get('icon') ?? undefined,
      neoTheme: (p.get('neoTheme') ?? p.get('theme') ?? 'dark') as NeoTheme,
      neoStyle: (p.get('neoStyle') ?? p.get('style') ?? 'raised') as NeoStyle,
      border: (p.get('border') ?? 'none') as NeoBorder,
      metal: p.get('metal') ?? undefined,
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 200),
      height: Number(p.get('height') ?? 160),
      accent: p.get('accent') ?? undefined,
      linkUrl: p.get('linkUrl') ?? undefined,
      fontFamily: (p.get('fontFamily') ?? undefined) as any,
      textColor: p.get('textColor') ?? undefined,
      fontScale: p.get('fontScale') ? Number(p.get('fontScale')) : undefined,
    })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.error('[card-neo]', e)
    return new NextResponse('Error', { status: 400 })
  }
}


// ─────────────────────────────────────────────────────────────────────────────