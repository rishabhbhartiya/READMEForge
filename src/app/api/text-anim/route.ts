// src/app/api/text-anim/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderTextAnim, TextEffect } from '@/lib/renderers/text-anim'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const svg = renderTextAnim({
      text: p.get('text') ?? 'Hello World',
      effect: (p.get('effect') ?? 'typewriter') as TextEffect,
      metal: p.get('metal') ?? 'electric',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 600),
      height: Number(p.get('height') ?? 80),
      fontSize: Number(p.get('size') ?? 32),
      speed: (p.get('speed') ?? 'normal') as 'slow' | 'normal' | 'fast',
      color: p.get('color') ?? undefined,
      bg: (p.get('bg') ?? 'dark') as 'dark' | 'light' | 'transparent',
      fontFamily: p.get('font') ?? 'Orbitron',
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
    })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        // Shorter cache for animations
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new NextResponse('Error', { status: 400 })
  }
}