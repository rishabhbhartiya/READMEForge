// src/app/api/button/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderButton, ButtonStyle } from '@/lib/renderers/button'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderButton({
      label: p.get('label') ?? p.get('text') ?? 'Click',
      icon: p.get('icon') ?? '',
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'beveled') as ButtonStyle,
      width: p.get('width') ? Number(p.get('width')) : undefined,
      height: p.get('height') ? Number(p.get('height')) : undefined,
      fontSize: p.get('fontSize') ? Number(p.get('fontSize')) : 15,
      textColor: p.get('textColor') ?? undefined,
      borderRadius: p.get('radius') ? Number(p.get('radius')) : undefined,
      animated: p.get('animated') !== 'false',
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
      // href stored for README link generation — returned in response header
      href: p.get('href') ?? undefined,
    })

    const headers: Record<string, string> = {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    }

    // Expose href so callers can build the README markdown link:
    // [![label](this-url)](href)
    const href = p.get('href')
    if (href) headers['X-Button-Href'] = href

    return new NextResponse(svg, { headers })
  } catch (e) {
    return new NextResponse('Error', { status: 400 })
  }
}


// ─────────────────────────────────────────────────────────────────────────────