// src/app/api/card/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderCard, CardType } from '@/lib/renderers/card'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderCard({
      username: p.get('username') ?? p.get('user') ?? 'yourusername',
      type: (p.get('type') ?? 'stats') as CardType,
      metal: p.get('metal') ?? p.get('color') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      border: (p.get('border') ?? 'metal') as 'metal' | 'glow' | 'minimal' | 'ridge' | 'none',
      width: Number(p.get('width') ?? 495),
      compact: p.get('compact') === 'true',
      title: p.get('title') ?? undefined,
      stat1: p.get('stat1') ?? undefined, label1: p.get('label1') ?? undefined,
      stat2: p.get('stat2') ?? undefined, label2: p.get('label2') ?? undefined,
      stat3: p.get('stat3') ?? undefined, label3: p.get('label3') ?? undefined,
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
    })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new NextResponse('Error', { status: 400 })
  }
}


// ─────────────────────────────────────────────────────────────────────────────