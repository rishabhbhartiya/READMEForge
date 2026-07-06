// src/app/api/card/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderCard, CardType, CardBorder } from '@/lib/renderers/card'
import { DesignStyle } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderCard({
      // No more forced 'yourusername' fallback — leave it out entirely for a blank card
      username: p.get('username') ?? p.get('user') ?? undefined,
      type: (p.get('type') ?? 'stats') as CardType,
      metal: p.get('metal') ?? p.get('color') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      border: (p.get('border') ?? 'metal') as CardBorder,
      width: Number(p.get('width') ?? 495),
      compact: p.get('compact') === 'true',
      title: p.get('title') ?? undefined,
      stat1: p.get('stat1') ?? undefined, label1: p.get('label1') ?? undefined,
      stat2: p.get('stat2') ?? undefined, label2: p.get('label2') ?? undefined,
      stat3: p.get('stat3') ?? undefined, label3: p.get('label3') ?? undefined,
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
      // 'style' used to be accepted by the renderer but never actually read from
      // the query string here — that's now fixed.
      style: (p.get('style') ?? 'metallic') as DesignStyle,
      fontFamily: (p.get('fontFamily') ?? undefined) as any,
      textColor: p.get('textColor') ?? undefined,
      fontScale: p.get('fontScale') ? Number(p.get('fontScale')) : undefined,
    })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.error('[card]', e)
    return new NextResponse('Error', { status: 400 })
  }
}


// ─────────────────────────────────────────────────────────────────────────────