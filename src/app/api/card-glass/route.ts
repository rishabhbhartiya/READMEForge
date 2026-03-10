// src/app/api/card-glass/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderGlassCard, GlassTheme, GlassStyle } from '@/lib/renderers/card-glass'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderGlassCard({
      title: p.get('title') ?? 'Repos',
      value: p.get('value') ?? '42',
      subtitle: p.get('subtitle') ?? '',
      icon: p.get('icon') ?? '◈',
      glassTheme: (p.get('glassTheme') ?? p.get('theme') ?? 'dark') as GlassTheme,
      style: (p.get('style') ?? 'card') as GlassStyle,
      metal: p.get('metal') ?? undefined,
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 220),
      height: Number(p.get('height') ?? 170),
      tint: p.get('tint') ?? undefined,
      blur: Number(p.get('blur') ?? 8),
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