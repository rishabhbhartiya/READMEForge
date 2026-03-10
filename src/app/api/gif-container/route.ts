// src/app/api/gif-container/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderGifContainer } from '@/lib/renderers/containers'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderGifContainer({
      src: p.get('src') ?? '',
      alt: p.get('alt') ?? 'GIF',
      width: Number(p.get('width') ?? 300),
      height: Number(p.get('height') ?? 200),
      metal: p.get('metal') ?? 'electric',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      frame: (p.get('frame') ?? 'neon') as 'metallic' | 'glass' | 'neon' | 'minimal',
      label: p.get('label') ?? 'GIF',
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