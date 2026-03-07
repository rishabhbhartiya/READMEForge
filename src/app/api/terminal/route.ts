import { NextRequest, NextResponse } from 'next/server'
import { renderTerminal } from '@/lib/renderers/extras'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const linesParam = p.get('lines')
    const lines = linesParam ? linesParam.split('|') : undefined
    const svg = renderTerminal({ title: p.get('title') ?? 'profile.sh', lines, metal: (p.get('metal') ?? 'chrome') as MetalType, width: Number(p.get('width') ?? 500), theme: (p.get('theme') ?? 'dark') as any, prompt: p.get('prompt') ?? '$ ', animated: p.get('animated') !== 'false' })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=3600', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
