// src/app/api/image-container/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderImageContainer, FrameStyle } from '@/lib/renderers/containers'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderImageContainer({
      src: p.get('src') ?? '',
      alt: p.get('alt') ?? 'Image',
      width: Number(p.get('width') ?? 300),
      height: Number(p.get('height') ?? 220),
      frame: (p.get('frame') ?? 'metallic') as FrameStyle,
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      caption: p.get('caption') ?? '',
      rounded: p.get('rounded') !== 'false',
      glow: p.get('glow') !== 'false',
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