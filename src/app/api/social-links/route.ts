// src/app/api/social-links/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderSocialLinks, SocialLink } from '@/lib/renderers/extras'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    // Format: "github:@user,twitter:@user,linkedin:name"
    const linksParam = p.get('links')
    const links: SocialLink[] | undefined = linksParam
      ? linksParam.split(',').map(l => {
        const [platform, username] = l.split(':')
        return { platform: platform ?? l, username }
      })
      : undefined

    const svg = renderSocialLinks({
      links,
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'pills') as 'pills' | 'icons' | 'minimal',
      width: Number(p.get('width') ?? 600),
      height: Number(p.get('height') ?? 48),
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