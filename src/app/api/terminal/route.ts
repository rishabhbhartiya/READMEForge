// src/app/api/terminal/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderTerminal } from '@/lib/renderers/extras'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    // Lines separated by | e.g. "$ whoami|john|$ echo hi|hello"
    const linesParam = p.get('lines')
    const lines = linesParam ? linesParam.split('|') : undefined

    const svg = renderTerminal({
      title: p.get('title') ?? 'profile.sh',
      lines,
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 500),
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'matrix' | 'amber' | 'blue',
      prompt: p.get('prompt') ?? '$ ',
      animated: p.get('animated') !== 'false',
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