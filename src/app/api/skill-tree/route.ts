// src/app/api/skill-tree/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderSkillTree, ProgressStyle, SkillBarItem } from '@/lib/renderers/extras'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    // Format: "TypeScript:92:electric,React:88:neon-pink,Rust:65:copper"
    // or with per-skill gradients: "TypeScript:92:electric:#ff0000|#0000ff"
    const skillsParam = p.get('skills')
    const skills: SkillBarItem[] | undefined = skillsParam
      ? skillsParam.split(',').map(s => {
        const [label, val, metal, colorsRaw] = s.split(':')
        return {
          label: label ?? s,
          value: Number(val ?? 80),
          metal: metal ?? undefined,
          colors: colorsRaw ? colorsRaw.replace(/\|/g, ',') : undefined,
        }
      })
      : undefined

    const svg = renderSkillTree({
      title: p.get('title') ?? 'Tech Stack',
      skills,
      metal: p.get('metal') ?? 'chrome',
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      style: (p.get('style') ?? 'metallic') as ProgressStyle,
      width: Number(p.get('width') ?? 450),
      barHeight: Number(p.get('barHeight') ?? 28),
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