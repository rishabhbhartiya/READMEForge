// src/app/api/progress-bar/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderProgressBar, ProgressStyle } from '@/lib/renderers/extras'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderProgressBar({
      label: p.get('label') ?? 'Skill',
      value: Number(p.get('value') ?? 75),
      metal: p.get('metal') ?? 'gold',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'metallic') as ProgressStyle,
      width: Number(p.get('width') ?? 400),
      height: Number(p.get('height') ?? 32),
      showValue: p.get('showValue') !== 'false',
      animated: p.get('animated') !== 'false',
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