// src/app/api-reference/page.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

// ─── Shared components ────────────────────────────────────────────────────────
function NavBar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16
      bg-[rgba(8,8,16,0.92)] backdrop-blur-xl border-b border-[rgba(120,140,200,0.12)]">
            <div className="absolute bottom-0 left-0 right-0 h-px
        bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.5),rgba(240,190,50,0.4),transparent)]"/>
            <Link href="/" className="font-orbitron text-[20px] font-black tracking-[3px] no-underline">
                <span style={{ background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>README</span>
                <span style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FORGE</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
                {[['/', 'Home'], ['/docs', 'Docs'], ['/api-reference', 'API'], ['/#showcase', 'Examples']].map(([href, label]) => (
                    <Link key={label} href={href}
                        className="px-4 py-2 font-rajdhani font-semibold text-[13px] tracking-[1.5px] uppercase
              text-[#7880a0] rounded border border-transparent transition-all
              hover:text-[#4a9eff] hover:border-[rgba(74,158,255,0.25)] hover:bg-[rgba(74,158,255,0.05)]">
                        {label}
                    </Link>
                ))}
                <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                    className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded border border-[rgba(240,190,50,0.3)]
            bg-[rgba(240,190,50,0.06)] font-mono text-[11px] tracking-[1px] uppercase text-[#f0c030]
            hover:bg-[rgba(240,190,50,0.12)] transition-all">
                    <span className="text-[9px] opacity-70">BY</span> NATRAJ-X
                </a>
            </div>
            <div className="font-mono text-[11px] px-3 py-1.5 rounded-sm text-[#1a0800] font-bold"
                style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)' }}>v1.0 BETA</div>
        </nav>
    )
}

function Code({ children }: { children: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <div className="relative group my-3">
            <pre className="bg-[#070710] border border-[rgba(74,158,255,0.12)] rounded-lg p-4
        font-mono text-[12px] text-[#c8d0f0] overflow-x-auto leading-[1.8]">
                {children}
            </pre>
            <button onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded font-mono text-[10px] tracking-[1px] uppercase
          border border-[rgba(74,158,255,0.2)] text-[#4a9eff] opacity-0 group-hover:opacity-100 transition-all
          bg-[rgba(8,8,20,0.9)] hover:bg-[rgba(74,158,255,0.1)]">
                {copied ? '✓' : 'Copy'}
            </button>
        </div>
    )
}

// ─── Param table ──────────────────────────────────────────────────────────────
type Param = { name: string; type: string; default?: string; required?: boolean; desc: string }

function ParamTable({ params }: { params: Param[] }) {
    return (
        <div className="overflow-x-auto my-4 rounded-lg border border-[rgba(120,140,200,0.12)]">
            <table className="w-full font-mono text-[12px] border-collapse">
                <thead>
                    <tr className="border-b border-[rgba(120,140,200,0.12)] bg-[rgba(255,255,255,0.02)]">
                        <th className="text-left px-4 py-2.5 text-[#7880a0] tracking-[1px] uppercase text-[11px]">Param</th>
                        <th className="text-left px-4 py-2.5 text-[#7880a0] tracking-[1px] uppercase text-[11px]">Type</th>
                        <th className="text-left px-4 py-2.5 text-[#7880a0] tracking-[1px] uppercase text-[11px]">Default</th>
                        <th className="text-left px-4 py-2.5 text-[#7880a0] tracking-[1px] uppercase text-[11px]">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {params.map((p, i) => (
                        <tr key={p.name} className={`border-b border-[rgba(120,140,200,0.06)] ${i % 2 === 0 ? '' : 'bg-[rgba(255,255,255,0.01)]'}`}>
                            <td className="px-4 py-2.5">
                                <code className="text-[#39ff14]">{p.name}</code>
                                {p.required && <span className="ml-1.5 text-[#ff4444] text-[10px]">*</span>}
                            </td>
                            <td className="px-4 py-2.5 text-[#4a9eff]">{p.type}</td>
                            <td className="px-4 py-2.5 text-[#56607a]">{p.default ?? '—'}</td>
                            <td className="px-4 py-2.5 text-[#8890b0] leading-[1.5]">{p.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ─── Endpoint block ───────────────────────────────────────────────────────────
function Endpoint({ id, method = 'GET', path, desc, params, example }: {
    id: string; method?: string; path: string; desc: string
    params: Param[]; example: string
}) {
    return (
        <div id={id} className="mb-12 scroll-mt-24 p-6 rounded-xl border border-[rgba(120,140,200,0.1)]
      bg-[rgba(255,255,255,0.01)] hover:border-[rgba(74,158,255,0.2)] transition-colors">
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded
          bg-[rgba(57,255,20,0.1)] text-[#39ff14] border border-[rgba(57,255,20,0.25)]">{method}</span>
                <code className="font-mono text-[15px] font-bold text-[#4a9eff]">{path}</code>
            </div>
            <p className="font-mono text-[13px] text-[#7880a0] mb-5 leading-[1.7]">{desc}</p>
            <h4 className="font-mono text-[11px] tracking-[2px] uppercase text-[#56607a] mb-2">Parameters</h4>
            <ParamTable params={params} />
            <h4 className="font-mono text-[11px] tracking-[2px] uppercase text-[#56607a] mb-2 mt-5">Example</h4>
            <Code>{example}</Code>
        </div>
    )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const ENDPOINTS = [
    { id: 'ep-overview', label: 'Overview' },
    { id: 'ep-banner', label: 'Banner' },
    { id: 'ep-card', label: 'Stat Card' },
    { id: 'ep-card-neo', label: 'Neo Card' },
    { id: 'ep-card-glass', label: 'Glass Card' },
    { id: 'ep-button', label: 'Button' },
    { id: 'ep-badge', label: 'Badge' },
    { id: 'ep-header', label: 'Header' },
    { id: 'ep-footer', label: 'Footer' },
    { id: 'ep-divider', label: 'Divider' },
    { id: 'ep-text-anim', label: 'Text Animation' },
    { id: 'ep-progress-bar', label: 'Progress Bar' },
    { id: 'ep-skill-tree', label: 'Skill Tree' },
    { id: 'ep-terminal', label: 'Terminal' },
    { id: 'ep-social-links', label: 'Social Links' },
    { id: 'ep-logo-container', label: 'Logo Container' },
    { id: 'ep-image-container', label: 'Image Frame' },
]

const COMMON_PARAMS: Param[] = [
    { name: 'metal', type: 'string', default: 'chrome', desc: 'Metal theme name. Any of the 44 metal values.' },
    { name: 'colors', type: 'string', default: '—', desc: 'Comma-separated hex colors to override the metal gradient. E.g. #ff0000,#0000ff' },
    { name: 'angle', type: 'number', default: '135', desc: 'Gradient angle in degrees (0–360).' },
    { name: 'theme', type: 'dark | light', default: 'dark', desc: 'Overall color theme — controls backgrounds and text.' },
    { name: 'width', type: 'number', default: 'varies', desc: 'SVG width in pixels.' },
    { name: 'height', type: 'number', default: 'varies', desc: 'SVG height in pixels.' },
]

export default function ApiReferencePage() {
    return (
        <div className="min-h-screen bg-[#080810] text-[#c8d0f0]">
            <NavBar />

            {/* Hero strip */}
            <div className="relative px-8 py-10 border-b border-[rgba(120,140,200,0.12)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(57,255,20,0.05)_0%,transparent_60%)]" />
                <div className="max-w-[1200px] mx-auto relative">
                    <div className="font-mono text-[11px] tracking-[3px] text-[#39ff14] opacity-70 mb-2">// API REFERENCE</div>
                    <h1 className="font-orbitron text-[36px] font-black tracking-[3px] mb-3"
                        style={{ background: 'linear-gradient(135deg,#e8e8e8,#a0a8c0,#ffffff,#8090b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        API Reference
                    </h1>
                    <p className="text-[15px] text-[#7880a0] max-w-[520px] leading-relaxed mb-4">
                        All ReadmeForge endpoints. Every route accepts <code>GET</code> requests and returns
                        an <code>image/svg+xml</code> response — usable directly as a markdown image URL.
                    </p>
                    <div className="flex gap-3 flex-wrap font-mono text-[12px]">
                        <span className="px-3 py-1.5 rounded border border-[rgba(57,255,20,0.25)] text-[#39ff14] bg-[rgba(57,255,20,0.05)]">
                            Base URL: readmeforge.natrajx.in
                        </span>
                        <span className="px-3 py-1.5 rounded border border-[rgba(74,158,255,0.25)] text-[#4a9eff] bg-[rgba(74,158,255,0.05)]">
                            Runtime: Vercel Edge
                        </span>
                        <span className="px-3 py-1.5 rounded border border-[rgba(240,190,50,0.25)] text-[#f0c030] bg-[rgba(240,190,50,0.05)]">
                            Auth: None required
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8 py-10 flex gap-10">

                {/* Sidebar */}
                <aside className="hidden lg:block w-[200px] shrink-0">
                    <div className="sticky top-24">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#56607a] mb-4">Endpoints</div>
                        <nav className="flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto">
                            {ENDPOINTS.map(e => (
                                <a key={e.id} href={`#${e.id}`}
                                    className="px-3 py-1.5 rounded font-mono text-[11px] tracking-[0.5px]
                    text-[#7880a0] hover:text-[#4a9eff] hover:bg-[rgba(74,158,255,0.06)]
                    border-l-2 border-transparent hover:border-[rgba(74,158,255,0.4)]
                    transition-all duration-150">
                                    {e.label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-6 p-4 rounded-lg border border-[rgba(240,190,50,0.2)] bg-[rgba(240,190,50,0.03)]">
                            <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#f0c030] mb-1">Built by</div>
                            <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                                className="font-mono text-[12px] font-bold text-[#f0c030] hover:underline">Natraj-X →</a>
                            <p className="font-mono text-[11px] text-[#56607a] mt-1">AI & IT Engineering</p>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    {/* Overview */}
                    <div id="ep-overview" className="mb-12 scroll-mt-24">
                        <div className="font-mono text-[11px] tracking-[2px] text-[#39ff14] opacity-60 mb-2">// OVERVIEW</div>
                        <h2 className="font-orbitron text-[20px] font-black tracking-[2px] mb-5 pb-3
              border-b border-[rgba(120,140,200,0.15)]"
                            style={{ background: 'linear-gradient(135deg,#e0e4f8,#8090c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Request Format
                        </h2>
                        <Code>{`GET https://readmeforge.natrajx.in/api/{component}?param=value&param=value

Response Headers:
  Content-Type: image/svg+xml; charset=utf-8
  Cache-Control: public, max-age=86400
  Access-Control-Allow-Origin: *

Usage in GitHub README:
  ![Alt text](https://readmeforge.natrajx.in/api/banner?text=Hello&metal=gold)`}</Code>

                        <div className="mt-6">
                            <h3 className="font-mono text-[13px] font-bold text-[#c8d0f0] mb-3 tracking-[1px]">Common Parameters</h3>
                            <p className="font-mono text-[12px] text-[#7880a0] mb-3">
                                These parameters are supported by <em>all</em> endpoints:
                            </p>
                            <ParamTable params={COMMON_PARAMS} />
                        </div>
                    </div>

                    <Endpoint
                        id="ep-banner"
                        path="/api/banner"
                        desc="Full-width SVG banner with main heading, optional subtitle, and 16 advanced visual styles. No shape or animation params — the visual style IS the full aesthetic experience."
                        params={[
                            { name: 'text', type: 'string', default: '', desc: 'Main heading text' },
                            { name: 'subtext', type: 'string', default: '—', desc: 'Subtitle / tagline below the heading. Also accepts desc or s.' },
                            { name: 'visualStyle', type: 'string', default: 'metallic', desc: '16 styles: metallic, glass, neo, cyberpunk, holographic, aurora, neon, minimal, retro, gradient, circuit, plasma, crystalline, void, inferno, matrix' },
                            { name: 'bg', type: 'string', default: '—', desc: 'Background color override (any CSS color)' },
                            { name: 'textColor', type: 'string', default: '—', desc: 'Override main text color (hex or CSS)' },
                            { name: 'subtextColor', type: 'string', default: '—', desc: 'Override subtext color (hex or CSS)' },
                            { name: 'fontFamily', type: 'string', default: 'Orbitron', desc: 'Heading font family' },
                            { name: 'subtextFont', type: 'string', default: 'Rajdhani', desc: 'Subtext font family' },
                            { name: 'fontSize', type: 'number', default: 'auto', desc: 'Heading font size in px (auto-scaled from height if omitted)' },
                            { name: 'subtextSize', type: 'number', default: 'auto', desc: 'Subtext font size in px' },
                            { name: 'align', type: 'string', default: 'center', desc: 'Text alignment: left | center | right' },
                            { name: 'border', type: 'string', default: 'none', desc: 'Border style: none | metallic | normal | gradient | glow | double | dashed | animated | neon | circuit' },
                            { name: 'borderColor', type: 'string', default: '—', desc: 'Border color override' },
                            { name: 'borderWidth', type: 'number', default: '2', desc: 'Border width in px' },
                            { name: 'theme', type: 'string', default: 'dark', desc: 'dark | light — controls background and text defaults' },
                            { name: 'width', type: 'number', default: '900', desc: 'Width in px (200–1200)' },
                            { name: 'height', type: 'number', default: '200', desc: 'Height in px (60–500)' },
                        ]}
                        example={`# Metallic brushed steel
![Banner](https://readmeforge.natrajx.in/api/banner?text=MY+PROJECT&subtext=Built+with+AI&metal=chrome&visualStyle=metallic&width=900&height=200)

# Deep glassmorphism
![Banner](https://readmeforge.natrajx.in/api/banner?text=PORTFOLIO&subtext=Design+%C2%B7+Code+%C2%B7+Deploy&metal=electric&visualStyle=glass&width=900&height=200)

# Cyberpunk grid with neon border
![Banner](https://readmeforge.natrajx.in/api/banner?text=HACKER+MODE&subtext=Security+%C2%B7+Systems+%C2%B7+Code&metal=neon-green&visualStyle=cyberpunk&border=neon&width=900&height=200)

# Animated holographic foil
![Banner](https://readmeforge.natrajx.in/api/banner?text=OPEN+SOURCE&metal=holographic&visualStyle=holographic&width=900&height=200)

# Aurora borealis
![Banner](https://readmeforge.natrajx.in/api/banner?text=FULL+STACK&subtext=React+%C2%B7+Node+%C2%B7+Cloud&metal=aurora&visualStyle=aurora&width=900&height=220)

# Matrix code rain
![Banner](https://readmeforge.natrajx.in/api/banner?text=THE+MATRIX&subtext=Follow+the+white+rabbit&metal=neon-green&visualStyle=matrix&width=900&height=200)

# Deep space void
![Banner](https://readmeforge.natrajx.in/api/banner?text=VOID+WALKER&metal=neon-blue&visualStyle=void&width=900&height=200)

# Inferno fire
![Banner](https://readmeforge.natrajx.in/api/banner?text=FIRE+STARTER&metal=gold&visualStyle=inferno&width=900&height=200)`}
                    />

                    <Endpoint
                        id="ep-card"
                        path="/api/card"
                        desc="Compact stat card displaying a title and a value. Use for GitHub stats, scores, counters, and key metrics."
                        params={[
                            { name: 'title', type: 'string', default: 'GitHub Stats', desc: 'Card title label' },
                            { name: 'value', type: 'string', default: '—', desc: 'Main value displayed prominently' },
                            { name: 'style', type: 'string', default: 'default', desc: 'Design style preset' },
                            { name: 'icon', type: 'string', default: '—', desc: 'Icon identifier' },
                            { name: 'width', type: 'number', default: '320', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '160', desc: 'Height in px' },
                        ]}
                        example={`![Stars](https://readmeforge.natrajx.in/api/card?title=GitHub+Stars&value=1.2k&metal=gold&style=hologram)`}
                    />

                    <Endpoint
                        id="ep-card-neo"
                        path="/api/card-neo"
                        desc="Neumorphic (soft 3D) card with layered shadows and raised/inset aesthetics."
                        params={[
                            { name: 'title', type: 'string', default: 'Neo Card', desc: 'Card title' },
                            { name: 'value', type: 'string', default: '—', desc: 'Card value' },
                            { name: 'neoTheme', type: 'dark | light', default: 'dark', desc: 'Neumorphic background theme' },
                            { name: 'neoStyle', type: 'string', default: 'raised', desc: 'raised | inset | flat' },
                        ]}
                        example={`![Neo Card](https://readmeforge.natrajx.in/api/card-neo?title=Projects&value=12&metal=chrome&neoTheme=dark)`}
                    />

                    <Endpoint
                        id="ep-card-glass"
                        path="/api/card-glass"
                        desc="Glassmorphic card with frosted blur effect, translucent backgrounds, and a light border. Supports live GitHub stat fetching via ?username= — no token required. Add ?linkUrl= to make the card clickable."
                        params={[
                            { name: 'title', type: 'string', default: 'Glass Card', desc: 'Card title (auto-set when username is provided)' },
                            { name: 'value', type: 'string', default: '—', desc: 'Card value (auto-fetched from GitHub when username is provided)' },
                            { name: 'subtitle', type: 'string', default: '—', desc: 'Subtitle below the value (auto-set when username is provided)' },
                            { name: 'icon', type: 'string', default: '◈', desc: 'Icon symbol (auto-set per stat when username is provided)' },
                            { name: 'glassTheme', type: 'string', default: 'dark', desc: '12 themes: dark, light, aurora, sunset, ocean, midnight, neon, rose, forest, gold, ice, void' },
                            { name: 'style', type: 'string', default: 'card', desc: 'card | pill | panel | chip' },
                            { name: 'blur', type: 'number', default: '8', desc: 'Frosted blur intensity (1–20)' },
                            { name: 'tint', type: 'string', default: '—', desc: 'Override glass tint color (CSS rgba)' },
                            { name: 'username', type: 'string', default: '—', desc: 'GitHub username — when set, value is fetched live from the GitHub API' },
                            { name: 'stat', type: 'string', default: 'repos', desc: 'Which GitHub stat to display: repos | stars | followers | forks' },
                            { name: 'linkUrl', type: 'string', default: '—', desc: 'URL to open when the card is clicked (opens in new tab). Use URL-encoded value.' },
                            { name: 'width', type: 'number', default: '220', desc: 'Width in px (120–600)' },
                            { name: 'height', type: 'number', default: '170', desc: 'Height in px (80–400)' },
                        ]}
                        example={`# Static card
![Glass Card](https://readmeforge.natrajx.in/api/card-glass?title=Rating&value=5.0&glassTheme=ice)

# Clickable card — opens your GitHub profile
![Repos](https://readmeforge.natrajx.in/api/card-glass?username=torvalds&stat=repos&glassTheme=aurora&linkUrl=https%3A%2F%2Fgithub.com%2Ftorvalds)

# Stars card linking to repo
![Stars](https://readmeforge.natrajx.in/api/card-glass?username=torvalds&stat=stars&glassTheme=gold&linkUrl=https%3A%2F%2Fgithub.com%2Ftorvalds%3Ftab%3Drepositories)

# In README — wrap image in a markdown link for GitHub (SVG onclick blocked by GitHub CSP)
[![Stars](https://readmeforge.natrajx.in/api/card-glass?username=torvalds&stat=stars&glassTheme=gold)](https://github.com/torvalds)`}
                    />

                    <Endpoint
                        id="ep-button"
                        path="/api/button"
                        desc="Metallic SVG button in 16 styles. Wrap in [![label](url)](href) to make it clickable in a README."
                        params={[
                            { name: 'label', type: 'string', default: 'Click Me', desc: 'Button label text' },
                            { name: 'style', type: 'string', default: 'metallic', desc: '16 styles: metallic, ghost, outline, neon, chrome, gold, pill, sharp, glass, minimal, cyber, retro, gradient, brutalist, 3d, flat' },
                            { name: 'icon', type: 'string', default: '—', desc: 'Icon to prepend to label' },
                            { name: 'width', type: 'number', default: '200', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '48', desc: 'Height in px' },
                        ]}
                        example={`<!-- Clickable button (link wraps the image) -->
[![Deploy](https://readmeforge.natrajx.in/api/button?label=Deploy+Now&metal=neon-green&style=metallic)](https://vercel.com)`}
                    />

                    <Endpoint
                        id="ep-badge"
                        path="/api/badge"
                        desc="Two-part label/value badge in 5 shapes. Great for version, status, and tech stack indicators."
                        params={[
                            { name: 'label', type: 'string', default: 'Label', desc: 'Left side label text' },
                            { name: 'value', type: 'string', default: '—', desc: 'Right side value text' },
                            { name: 'shape', type: 'string', default: 'pill', desc: 'pill | sharp | hex | rounded | flat' },
                            { name: 'valueColor', type: 'string', default: '—', desc: 'Override the value text color (hex)' },
                        ]}
                        example={`![Version](https://readmeforge.natrajx.in/api/badge?label=Version&value=3.0.0&metal=gold&shape=pill)
![Status](https://readmeforge.natrajx.in/api/badge?label=Status&value=Active&metal=neon-green&shape=sharp)`}
                    />

                    <Endpoint
                        id="ep-header"
                        path="/api/header"
                        desc="Full-width profile header with name, title, and optional avatar/logo area."
                        params={[
                            { name: 'name', type: 'string', default: 'Your Name', desc: 'Display name' },
                            { name: 'title', type: 'string', default: 'Developer', desc: 'Job title or tagline' },
                            { name: 'avatar', type: 'string', default: '—', desc: 'Avatar image URL' },
                            { name: 'style', type: 'string', default: 'default', desc: 'Design style preset' },
                            { name: 'width', type: 'number', default: '800', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '200', desc: 'Height in px' },
                        ]}
                        example={`![Header](https://readmeforge.natrajx.in/api/header?name=John+Doe&title=Full+Stack+Developer&metal=chrome&style=cyber-grid&width=900)`}
                    />

                    <Endpoint
                        id="ep-footer"
                        path="/api/footer"
                        desc="Thin footer strip with optional text and metallic divider styling."
                        params={[
                            { name: 'text', type: 'string', default: '—', desc: 'Footer text' },
                            { name: 'style', type: 'string', default: 'wave', desc: 'Divider style within the footer' },
                            { name: 'width', type: 'number', default: '800', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '60', desc: 'Height in px' },
                        ]}
                        example={`![Footer](https://readmeforge.natrajx.in/api/footer?text=Thanks+for+visiting&metal=chrome&style=wave&width=900)`}
                    />

                    <Endpoint
                        id="ep-divider"
                        path="/api/divider"
                        desc="Decorative horizontal divider in 6 styles. Use between README sections."
                        params={[
                            { name: 'style', type: 'string', default: 'wave', desc: 'wave | zigzag | dots | straight | double | gradient' },
                            { name: 'width', type: 'number', default: '800', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '40', desc: 'Height in px' },
                        ]}
                        example={`![Divider](https://readmeforge.natrajx.in/api/divider?style=wave&metal=gold&width=900)
![Divider](https://readmeforge.natrajx.in/api/divider?style=zigzag&metal=neon-blue&width=900)`}
                    />

                    <Endpoint
                        id="ep-text-anim"
                        path="/api/text-anim"
                        desc="Animated SVG text with 20 SMIL-based effects. Animates in GitHub READMEs."
                        params={[
                            { name: 'text', type: 'string', default: 'Hello World', desc: 'The text to animate' },
                            { name: 'effect', type: 'string', default: 'typewriter', desc: 'typewriter | glitch | neon-pulse | wave | matrix-rain | hologram-flicker | cyber-scan | pixel-dissolve | data-stream | lightning | fire | ice | aurora | portal | quantum | gravity-well | sound-wave | dna-helix | constellation | wormhole' },
                            { name: 'size', type: 'number', default: '32', desc: 'Font size in px' },
                            { name: 'width', type: 'number', default: '600', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '80', desc: 'Height in px' },
                        ]}
                        example={`![Typing](https://readmeforge.natrajx.in/api/text-anim?text=Hello+World&effect=typewriter&metal=neon-green&size=36)
![Glitch](https://readmeforge.natrajx.in/api/text-anim?text=SYSTEM+ERROR&effect=glitch&metal=neon-pink&size=40)`}
                    />

                    <Endpoint
                        id="ep-progress-bar"
                        path="/api/progress-bar"
                        desc="Single horizontal progress bar with a label and percentage fill."
                        params={[
                            { name: 'skill', type: 'string', default: 'Skill', desc: 'Skill / label name' },
                            { name: 'value', type: 'number', default: '75', desc: 'Percentage fill (0–100)' },
                            { name: 'width', type: 'number', default: '400', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '40', desc: 'Height in px' },
                        ]}
                        example={`![Python](https://readmeforge.natrajx.in/api/progress-bar?skill=Python&value=90&metal=neon-blue&width=400)`}
                    />

                    <Endpoint
                        id="ep-skill-tree"
                        path="/api/skill-tree"
                        desc="Multiple stacked skill progress bars in one SVG. Pass all skills in a single param."
                        params={[
                            { name: 'skills', type: 'string', required: true, desc: 'Comma-separated Name:percent pairs. E.g. Python:90,TypeScript:85,Rust:60' },
                            { name: 'title', type: 'string', default: 'Tech Stack', desc: 'Section title above the bars' },
                            { name: 'width', type: 'number', default: '500', desc: 'Width in px' },
                        ]}
                        example={`![Skills](https://readmeforge.natrajx.in/api/skill-tree?skills=Python:90,TypeScript:85,Next.js:80,AWS:70&metal=neon-blue&title=Tech+Stack&width=500)`}
                    />

                    <Endpoint
                        id="ep-terminal"
                        path="/api/terminal"
                        desc="Fake terminal block with a title bar and command output lines. Great for showing setup commands or bio text."
                        params={[
                            { name: 'lines', type: 'string', required: true, desc: 'Pipe | separated lines. Use colon syntax for prompt: cd ~/projects' },
                            { name: 'title', type: 'string', default: 'terminal', desc: 'Title bar text' },
                            { name: 'width', type: 'number', default: '500', desc: 'Width in px' },
                        ]}
                        example={`![Terminal](https://readmeforge.natrajx.in/api/terminal?title=~/me&lines=whoami:+fullstack+dev|focus:+AI+%26+web|status:+building+cool+stuff&metal=matrix&width=500)`}
                    />

                    <Endpoint
                        id="ep-social-links"
                        path="/api/social-links"
                        desc="Row of social platform link buttons. Supported platforms: github, twitter, linkedin, youtube, instagram, email, website, discord."
                        params={[
                            { name: 'links', type: 'string', required: true, desc: 'Comma-separated platform:handle pairs. E.g. github:@you,twitter:@you,linkedin:yourname' },
                            { name: 'style', type: 'string', default: 'pills', desc: 'pills | icons | minimal' },
                            { name: 'width', type: 'number', default: '600', desc: 'Width in px' },
                        ]}
                        example={`![Social](https://readmeforge.natrajx.in/api/social-links?links=github:@yourname,twitter:@yourname,linkedin:yourname&metal=chrome&style=pills&width=600)`}
                    />

                    <Endpoint
                        id="ep-logo-container"
                        path="/api/logo-container"
                        desc="Metallic shaped container for a logo, avatar, or initials. 6 shapes available."
                        params={[
                            { name: 'text', type: 'string', default: 'MF', desc: 'Initials/text to show if no src provided' },
                            { name: 'src', type: 'string', default: '—', desc: 'Image URL for logo/avatar' },
                            { name: 'style', type: 'string', default: 'hexagon', desc: 'hexagon | shield | circle | diamond | star | rounded-square' },
                            { name: 'size', type: 'number', default: '120', desc: 'Size in px (width and height are equal)' },
                            { name: 'spin', type: 'boolean', default: 'false', desc: 'Slow rotation animation' },
                            { name: 'glow', type: 'boolean', default: 'true', desc: 'Glow filter effect' },
                        ]}
                        example={`![Logo](https://readmeforge.natrajx.in/api/logo-container?text=NX&metal=gold&style=hexagon&size=120&glow=true)`}
                    />

                    <Endpoint
                        id="ep-image-container"
                        path="/api/image-container"
                        desc="Decorative metallic frame around any image. The image is fetched server-side and embedded as base64."
                        params={[
                            { name: 'src', type: 'string', default: '—', desc: 'Public image URL to embed inside the frame' },
                            { name: 'frame', type: 'string', default: 'metallic', desc: 'metallic | glass | polaroid | circuit | hologram | neon-sign' },
                            { name: 'caption', type: 'string', default: '—', desc: 'Caption text below the image' },
                            { name: 'rounded', type: 'boolean', default: 'true', desc: 'Rounded inner corners' },
                            { name: 'width', type: 'number', default: '300', desc: 'Width in px' },
                            { name: 'height', type: 'number', default: '220', desc: 'Height in px' },
                        ]}
                        example={`![Screenshot](https://readmeforge.natrajx.in/api/image-container?src=https://your-image.com/shot.png&metal=chrome&frame=metallic&caption=My+Project&width=400)`}
                    />

                    {/* Response format */}
                    <div className="mt-10 p-6 rounded-xl border border-[rgba(120,140,200,0.1)] bg-[rgba(255,255,255,0.01)]">
                        <h3 className="font-orbitron text-[16px] font-black tracking-[2px] mb-4"
                            style={{ background: 'linear-gradient(135deg,#e0e4f8,#8090c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Response Format
                        </h3>
                        <Code>{`// Success
HTTP 200
Content-Type: image/svg+xml; charset=utf-8
Cache-Control: public, max-age=86400
Access-Control-Allow-Origin: *

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="160" ...>
  ...
</svg>

// Error
HTTP 400
<svg ...><text>Error: ...</text></svg>`}</Code>
                    </div>

                    {/* Natraj-X CTA */}
                    <div className="mt-12 p-6 rounded-xl border border-[rgba(240,190,50,0.25)]
            bg-[rgba(240,190,50,0.04)] text-center">
                        <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#f0c030] mb-2">API by</div>
                        <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                            className="font-orbitron text-[20px] font-black hover:underline"
                            style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            NATRAJ-X
                        </a>
                        <p className="font-mono text-[13px] text-[#7880a0] mt-2 mb-4">
                            AI & IT Engineering Agency — ML pipelines, data engineering, full-stack products.
                        </p>
                        <a href="https://www.natrajx.in/contact" target="_blank" rel="noopener"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded font-mono text-[12px] tracking-[1px] uppercase
                border border-[rgba(240,190,50,0.35)] text-[#f0c030] hover:bg-[rgba(240,190,50,0.1)] transition-all">
                            Work with us →
                        </a>
                    </div>

                </div>
            </div>

            <footer className="border-t border-[rgba(120,140,200,0.1)] py-8 px-8 font-mono text-[12px] text-[#56607a]">
                <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span>© 2026 ReadmeForge · MIT License</span>
                    <span>Built by <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                        className="text-[#f0c030] hover:underline">Natraj-X AI Engineering</a></span>
                    <div className="flex gap-4">
                        <Link href="/" className="hover:text-[#c8d0f0] transition-colors">Home</Link>
                        <Link href="/docs" className="hover:text-[#c8d0f0] transition-colors">Docs</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
