// src/app/api/card-clay/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderClayCard, ClayTheme, ClayStyle, Dimension } from '@/lib/renderers/card-clay'

export const runtime = 'edge'

type StatKey = 'repos' | 'stars' | 'followers' | 'forks'

const STAT_META: Record<StatKey, { icon: string; title: string; subtitle: string }> = {
    repos: { icon: '◈', title: 'Repositories', subtitle: 'Public repos' },
    stars: { icon: '★', title: 'Stars', subtitle: 'Total stars earned' },
    followers: { icon: '◉', title: 'Followers', subtitle: 'GitHub followers' },
    forks: { icon: '⑂', title: 'Forks', subtitle: 'Total forks' },
}

interface GitHubUser { public_repos: number; followers: number }
interface GitHubRepo { stargazers_count: number; forks_count: number }

async function fetchGitHubStat(username: string, stat: StatKey): Promise<string> {
    const headers: HeadersInit = { 'Accept': 'application/vnd.github+json' }

    if (stat === 'repos' || stat === 'followers') {
        const res = await fetch(`https://api.github.com/users/${username}`, { headers })
        if (!res.ok) throw new Error(`GitHub user fetch failed: ${res.status}`)
        const data: GitHubUser = await res.json()
        return stat === 'repos' ? String(data.public_repos) : String(data.followers)
    }

    let page = 1
    let total = 0
    while (true) {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
            { headers }
        )
        if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`)
        const repos: GitHubRepo[] = await res.json()
        if (repos.length === 0) break
        for (const r of repos) total += stat === 'stars' ? r.stargazers_count : r.forks_count
        if (repos.length < 100) break
        page++
    }
    return String(total)
}

export async function GET(req: NextRequest) {
    const p = req.nextUrl.searchParams

    const username = p.get('username') ?? undefined
    const stat = (p.get('stat') ?? 'repos') as StatKey
    const clayTheme = (p.get('clayTheme') ?? p.get('theme') ?? 'blue') as ClayTheme

    // No forced defaults here — undefined means the renderer skips the row entirely
    let value: string | undefined = p.get('value') ?? undefined
    let title: string | undefined = p.get('title') ?? undefined
    let subtitle: string | undefined = p.get('subtitle') ?? undefined
    let icon: string | undefined = p.get('icon') ?? undefined

    try {
        if (username) {
            const meta = STAT_META[stat] ?? STAT_META.repos
            value = await fetchGitHubStat(username, stat)
            title = title ?? meta.title
            subtitle = subtitle ?? `@${username} · ${meta.subtitle}`
            icon = icon ?? meta.icon
        }

        const svg = renderClayCard({
            title, value, subtitle, icon,
            clayTheme,
            style: (p.get('style') ?? 'card') as ClayStyle,
            dimension: (p.get('dimension') ?? '2d') as Dimension,
            metal: p.get('metal') ?? undefined,
            colors: p.get('colors') ?? undefined,
            angle: p.get('angle') ? Number(p.get('angle')) : undefined,
            width: Number(p.get('width') ?? 220),
            height: Number(p.get('height') ?? 170),
            puff: p.get('puff') ? Number(p.get('puff')) : undefined,
            linkUrl: p.get('linkUrl') ?? undefined,
            fontFamily: (p.get('fontFamily') ?? undefined) as any,
            textColor: p.get('textColor') ?? undefined,
            fontScale: p.get('fontScale') ? Number(p.get('fontScale')) : undefined,
        })

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': username
                    ? 'public, max-age=3600, stale-while-revalidate=86400'
                    : 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (e) {
        console.error('[card-clay]', e)
        return new NextResponse('Error generating card', { status: 400 })
    }
}
// ─────────────────────────────────────────────────────────────────────────────