import { NextRequest, NextResponse } from 'next/server'
import { renderSocialLinks } from '@/lib/renderers/extras'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const linksParam = p.get('links')
    const links = linksParam ? linksParam.split(',').map(l => { const [platform, username] = l.split(':'); return { platform: platform ?? l, username } }) : undefined
    const svg = renderSocialLinks({ links, metal: (p.get('metal') ?? 'chrome') as MetalType, style: (p.get('style') ?? 'pills') as any, width: Number(p.get('width') ?? 600), height: Number(p.get('height') ?? 48) })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
