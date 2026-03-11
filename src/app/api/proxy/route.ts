// src/app/api/proxy/route.ts
// Fetches a remote image server-side, embeds as base64 data URI.
// This lets SVG <image> elements work on GitHub's README proxy,
// which blocks external href= URLs but allows data: URIs.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif',
    'image/webp', 'image/svg+xml', 'image/bmp',
]
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

function uint8ToBase64(bytes: Uint8Array): string {
    // Process in chunks to avoid call stack overflow on large images
    const CHUNK = 8192
    let binary = ''
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
    }
    return btoa(binary)
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing url param', { status: 400 })
    }

    let parsed: URL
    try {
        parsed = new URL(url)
    } catch {
        return new NextResponse('Invalid URL', { status: 400 })
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return new NextResponse('Only http/https URLs allowed', { status: 400 })
    }

    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Metal Forage/3.0 (+https://metal-forage.vercel.app)' },
            signal: AbortSignal.timeout(8000),
        })

        if (!res.ok) {
            return new NextResponse(`Upstream ${res.status}`, { status: 502 })
        }

        const rawType = res.headers.get('content-type') ?? 'image/png'
        const contentType = rawType.split(';')[0].trim()

        if (!ALLOWED_TYPES.includes(contentType)) {
            return new NextResponse(`Unsupported type: ${contentType}`, { status: 415 })
        }

        const buffer = await res.arrayBuffer()

        if (buffer.byteLength > MAX_BYTES) {
            return new NextResponse('Image too large (max 2MB)', { status: 413 })
        }

        const base64 = uint8ToBase64(new Uint8Array(buffer))
        const dataUri = `data:${contentType};base64,${base64}`

        return new NextResponse(dataUri, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (e) {
        return new NextResponse(`Fetch failed: ${(e as Error).message}`, { status: 502 })
    }
}