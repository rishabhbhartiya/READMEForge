// src/app/api/header/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderHeader, HeaderStyle } from '@/lib/renderers/header'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderHeader({
      name: p.get('name') ?? 'Your Name',
      title: p.get('title') ?? 'Developer',
      tagline: p.get('tagline') ?? p.get('sub') ?? '',
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'profile') as HeaderStyle,
      width: Number(p.get('width') ?? 900),
      height: Number(p.get('height') ?? 280),
      avatar: p.get('avatar') ?? undefined,
      wave: p.get('wave') !== 'false',
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