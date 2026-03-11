// src/app/api/gif-container/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderGifContainer } from '@/lib/renderers/containers'

export const runtime = 'edge'

async function fetchAsDataUri(src: string, req: NextRequest): Promise<string> {
  if (!src) return ''
  try {
    const proxyUrl = new URL('/api/proxy', req.nextUrl.origin)
    proxyUrl.searchParams.set('url', src)
    const res = await fetch(proxyUrl.toString(), { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return ''
    const dataUri = await res.text()
    return dataUri.startsWith('data:') ? dataUri : ''
  } catch {
    return ''
  }
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const rawSrc = p.get('src') ?? ''
    const src = rawSrc ? await fetchAsDataUri(rawSrc, req) : ''

    const svg = renderGifContainer({
      src,
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
        // GIFs animate — shorter cache
        'Cache-Control': rawSrc
          ? 'public, max-age=1800, s-maxage=1800'
          : 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new NextResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60">
        <rect width="300" height="60" fill="#1a0010"/>
        <text x="150" y="34" text-anchor="middle" fill="#ff4444" font-family="monospace" font-size="12">
          GIF Frame Error: ${(e as Error).message}
        </text>
      </svg>`,
      { status: 400, headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
}