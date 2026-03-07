// src/app/api/button/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderButton } from '@/lib/renderers/button'
import { MetalType, ButtonStyle } from '@/lib/metals'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  try {
    const svg = renderButton({
      label:  p.get('label') ?? p.get('text') ?? 'Click',
      icon:   p.get('icon')  ?? '',
      metal: (p.get('metal') ?? 'chrome') as MetalType,
      style: (p.get('style') ?? 'beveled') as ButtonStyle,
      width:  p.get('width')  ? Number(p.get('width'))  : undefined,
      height: p.get('height') ? Number(p.get('height')) : undefined,
      fontSize: p.get('fontSize') ? Number(p.get('fontSize')) : 15,
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
