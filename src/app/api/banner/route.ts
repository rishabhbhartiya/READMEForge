// src/app/api/banner/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderBanner } from '@/lib/renderers/banner'
import { MetalType, BannerShape, BannerAnimation } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  try {
    const svg = renderBanner({
      text:      p.get('text')      ?? p.get('t') ?? '',
      subtext:   p.get('subtext')   ?? p.get('desc') ?? p.get('s') ?? '',
      metal:    (p.get('metal')     ?? p.get('color') ?? 'chrome') as MetalType,
      shape:    (p.get('type')      ?? p.get('shape') ?? 'wave')  as BannerShape,
      height:    Number(p.get('height') ?? p.get('h') ?? 200),
      width:     Number(p.get('width')  ?? p.get('w') ?? 900),
      animation:(p.get('animation') ?? p.get('anim') ?? 'none')   as BannerAnimation,
      fontSize:  p.get('fontSize')  ? Number(p.get('fontSize'))    : undefined,
      fontFamily: p.get('fontFamily') ?? 'Orbitron',
      section:  (p.get('section')   ?? 'header') as 'header' | 'footer',
      reversal:  p.get('reversal')  === 'true',
      textAlign:(p.get('align')     ?? 'center') as 'left' | 'center' | 'right',
    })

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new NextResponse(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="60">
      <rect width="400" height="60" fill="#1a0010"/>
      <text x="200" y="34" text-anchor="middle" fill="#ff4444" font-family="monospace" font-size="13">
        MetalForge Error: ${(e as Error).message}
      </text>
    </svg>`, {
      status: 400,
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }
}
