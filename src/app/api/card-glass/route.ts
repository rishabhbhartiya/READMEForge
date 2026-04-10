// src/app/api/card-glass/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { renderGlassCard, GlassTheme, GlassStyle } from '@/lib/renderers/card-glass'

export const runtime = 'edge'

// ── Stat config ───────────────────────────────────────────────────────────────
type StatKey = 'repos' | 'stars' | 'followers' | 'forks'

const STAT_META: Record<StatKey, { icon: string; title: string; subtitle: string }> = {
  repos: { icon: '◈', title: 'Repositories', subtitle: 'Public repos' },
  stars: { icon: '★', title: 'Stars', subtitle: 'Total stars earned' },
  followers: { icon: '◉', title: 'Followers', subtitle: 'GitHub followers' },
  forks: { icon: '⑂', title: 'Forks', subtitle: 'Total forks' },
}

// ── GitHub fetcher ────────────────────────────────────────────────────────────
interface GitHubUser {
  public_repos: number
  followers: number
}

interface GitHubRepo {
  stargazers_count: number
  forks_count: number
}

async function fetchGitHubStat(username: string, stat: StatKey): Promise<string> {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github+json' }

  if (stat === 'repos' || stat === 'followers') {
    const res = await fetch(`https://api.github.com/users/${username}`, { headers })
    if (!res.ok) throw new Error(`GitHub user fetch failed: ${res.status}`)
    const data: GitHubUser = await res.json()
    return stat === 'repos'
      ? String(data.public_repos)
      : String(data.followers)
  }

  // stars or forks — need to page through all repos
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
    for (const r of repos) {
      total += stat === 'stars' ? r.stargazers_count : r.forks_count
    }
    if (repos.length < 100) break
    page++
  }
  return String(total)
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  const username = p.get('username') ?? undefined
  const stat = (p.get('stat') ?? 'repos') as StatKey
  const glassTheme = (p.get('glassTheme') ?? p.get('theme') ?? 'dark') as GlassTheme

  // Resolve value, title, subtitle, icon
  let value = p.get('value') ?? '—'
  let title = p.get('title') ?? undefined
  let subtitle = p.get('subtitle') ?? undefined
  let icon = p.get('icon') ?? undefined

  try {
    if (username) {
      const meta = STAT_META[stat] ?? STAT_META.repos
      // Auto-fill from GitHub unless caller explicitly overrides each field
      value = await fetchGitHubStat(username, stat)
      title = title ?? meta.title
      subtitle = subtitle ?? `@${username} · ${meta.subtitle}`
      icon = icon ?? meta.icon
    }

    const svg = renderGlassCard({
      title: title ?? 'Card',
      value: value,
      subtitle: subtitle ?? '',
      icon: icon ?? '◈',
      glassTheme,
      style: (p.get('style') ?? 'card') as GlassStyle,
      metal: p.get('metal') ?? undefined,
      colors: p.get('colors') ?? undefined,
      angle: p.get('angle') ? Number(p.get('angle')) : undefined,
      width: Number(p.get('width') ?? 220),
      height: Number(p.get('height') ?? 170),
      tint: p.get('tint') ?? undefined,
      blur: Number(p.get('blur') ?? 8),
      theme: (p.get('theme') ?? 'dark') as 'dark' | 'light',
      linkUrl: p.get('linkUrl') ?? undefined, 
    })

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': username
          ? 'public, max-age=3600, stale-while-revalidate=86400'  // 1h cache for live stats
          : 'public, max-age=86400',                               // 24h for static cards
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.error('[card-glass]', e)
    return new NextResponse('Error generating card', { status: 400 })
  }
}
// ─────────────────────────────────────────────────────────────────────────────