import { NextRequest, NextResponse } from 'next/server'
import { renderSkillTree } from '@/lib/renderers/extras'
import { MetalType } from '@/lib/metals'
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  try {
    const skillsParam = p.get('skills')
    const skills = skillsParam ? skillsParam.split(',').map(s => { const [label, val, metal] = s.split(':'); return { label: label ?? s, value: Number(val ?? 80), metal: (metal as MetalType) ?? undefined } }) : undefined
    const svg = renderSkillTree({ title: p.get('title') ?? 'Tech Stack', skills, metal: (p.get('metal') ?? 'chrome') as MetalType, style: (p.get('style') ?? 'metallic') as any, width: Number(p.get('width') ?? 450), barHeight: Number(p.get('barHeight') ?? 28) })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) { return new NextResponse('Error', { status: 400 }) }
}
