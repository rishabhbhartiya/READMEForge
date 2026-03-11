'use client'
import Link from 'next/link'
import { useState } from 'react'

const BASE = 'https://metal-forage.vercel.app'

// ─── Shared UI ─────────────────────────────────────────────────────────────
function NavBar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16
      bg-[rgba(8,8,16,0.92)] backdrop-blur-xl border-b border-[rgba(120,140,200,0.12)]">
            <div className="absolute bottom-0 left-0 right-0 h-px
        bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.5),rgba(240,190,50,0.4),transparent)]"/>
            <Link href="/" className="font-orbitron text-[20px] font-black tracking-[3px] no-underline">
                <span style={{ background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>METAL</span>
                <span style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FORGE</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
                {[['/', 'Home'], ['/docs', 'Docs'], ['/api-reference', 'API'], ['/#showcase', 'Examples']].map(([href, label]) => (
                    <Link key={label} href={href}
                        className="px-4 py-2 font-rajdhani font-semibold text-[13px] tracking-[1.5px] uppercase
              text-[#7880a0] rounded border border-transparent transition-all duration-200
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
                style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)' }}>v3.0 BETA</div>
        </nav>
    )
}

function Code({ children }: { children: string }) {
    const [copied, setCopied] = useState(false)
    function copy() {
        navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }
    return (
        <div className="relative group my-4">
            <pre className="bg-[#0a0a14] border border-[rgba(74,158,255,0.15)] rounded-lg p-5
        font-mono text-[13px] text-[#c8d0f0] overflow-x-auto leading-[1.8]
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(74,158,255,0.2)]">
                {children}
            </pre>
            <button onClick={copy}
                className="absolute top-3 right-3 px-3 py-1 rounded font-mono text-[11px] tracking-[1px] uppercase
          border border-[rgba(74,158,255,0.25)] text-[#4a9eff] opacity-0 group-hover:opacity-100
          transition-all bg-[rgba(8,8,20,0.9)] hover:bg-[rgba(74,158,255,0.1)]">
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    )
}

function Section({ id, tag, title, children }: { id: string; tag: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="mb-16 scroll-mt-24">
            <div className="font-mono text-[11px] tracking-[2px] text-[#4a9eff] opacity-60 mb-2">{tag}</div>
            <h2 className="font-orbitron text-[22px] font-black tracking-[2px] mb-6 pb-3
        border-b border-[rgba(120,140,200,0.15)]"
                style={{ background: 'linear-gradient(135deg,#e0e4f8,#8090c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {title}
            </h2>
            {children}
        </section>
    )
}

function Callout({ type, children }: { type: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
    const styles = {
        tip: { border: 'rgba(57,255,20,0.25)', bg: 'rgba(57,255,20,0.04)', icon: '✓', color: '#39ff14', label: 'TIP' },
        warning: { border: 'rgba(240,190,50,0.3)', bg: 'rgba(240,190,50,0.05)', icon: '⚠', color: '#f0c030', label: 'NOTE' },
        info: { border: 'rgba(74,158,255,0.25)', bg: 'rgba(74,158,255,0.05)', icon: 'ℹ', color: '#4a9eff', label: 'INFO' },
    }[type]
    return (
        <div className="my-4 p-4 rounded-lg flex gap-3" style={{ background: styles.bg, border: `1px solid ${styles.border}` }}>
            <span className="font-mono text-[12px] font-bold shrink-0 mt-0.5" style={{ color: styles.color }}>
                {styles.icon} {styles.label}
            </span>
            <div className="font-mono text-[13px] text-[#8890b0] leading-[1.7]">{children}</div>
        </div>
    )
}

const SIDEBAR = [
    { id: 'quickstart', label: 'Quick Start' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'url-syntax', label: 'URL Syntax' },
    { id: 'metals', label: 'Metal Themes' },
    { id: 'gradients', label: 'Custom Gradients' },
    { id: 'components', label: 'All Components' },
    { id: 'readme-tips', label: 'README Tips' },
    { id: 'faq', label: 'FAQ' },
]

export default function DocsPage() {
    const [active, setActive] = useState('quickstart')

    return (
        <div className="min-h-screen bg-[#080810] text-[#c8d0f0]">
            <NavBar />

            {/* Hero strip */}
            <div className="relative px-8 py-10 border-b border-[rgba(120,140,200,0.12)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,158,255,0.07)_0%,transparent_60%)]" />
                <div className="max-w-[1200px] mx-auto relative">
                    <div className="font-mono text-[11px] tracking-[3px] text-[#4a9eff] opacity-70 mb-2">// DOCUMENTATION</div>
                    <h1 className="font-orbitron text-[36px] font-black tracking-[3px] mb-3"
                        style={{ background: 'linear-gradient(135deg,#e8e8e8,#a0a8c0,#ffffff,#8090b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        MetalForge Docs
                    </h1>
                    <p className="text-[15px] text-[#7880a0] max-w-[560px] leading-relaxed">
                        Everything you need to build stunning GitHub profile READMEs with MetalForge's 44-metal SVG engine.
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8 py-10 flex gap-10">

                {/* Sidebar */}
                <aside className="hidden lg:block w-[220px] shrink-0">
                    <div className="sticky top-24">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#56607a] mb-4">On this page</div>
                        <nav className="flex flex-col gap-1">
                            {SIDEBAR.map(s => (
                                <a key={s.id} href={`#${s.id}`}
                                    onClick={() => setActive(s.id)}
                                    className={`px-3 py-2 rounded font-mono text-[12px] tracking-[0.5px] transition-all duration-150
                    border-l-2 ${active === s.id
                                            ? 'border-[#4a9eff] text-[#4a9eff] bg-[rgba(74,158,255,0.06)]'
                                            : 'border-transparent text-[#7880a0] hover:text-[#c8d0f0] hover:border-[rgba(74,158,255,0.3)]'}`}>
                                    {s.label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-8 p-4 rounded-lg border border-[rgba(240,190,50,0.2)] bg-[rgba(240,190,50,0.03)]">
                            <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#f0c030] mb-2">Built by</div>
                            <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                                className="font-mono text-[12px] text-[#f0c030] hover:underline font-bold">Natraj-X →</a>
                            <p className="font-mono text-[11px] text-[#56607a] mt-1 leading-[1.6]">
                                AI & IT Engineering Agency
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    <Section id="quickstart" tag="// 01" title="Quick Start">
                        <p className="text-[15px] text-[#8890b0] leading-[1.8] mb-4">
                            MetalForge works by embedding SVG image URLs directly into your GitHub README markdown.
                            No installation, no signup, no API keys — just a URL.
                        </p>
                        <Code>{`<!-- 1. Open the MetalForge app -->
<!-- https://metal-forage.vercel.app -->

<!-- 2. Configure your component visually, then copy the generated markdown -->

<!-- 3. Paste directly into your README.md -->
![My Banner](https://metal-forage.vercel.app/api/banner?text=YOUR+NAME&metal=gold)

<!-- That's it. ✓ -->`}</Code>
                        <Callout type="info">
                            Every MetalForge component is a plain <code>![alt](url)</code> markdown image.
                            It renders anywhere GitHub renders markdown — READMEs, issues, wikis, profiles.
                        </Callout>
                    </Section>

                    <Section id="how-it-works" tag="// 02" title="How It Works">
                        <p className="text-[15px] text-[#8890b0] leading-[1.8] mb-4">
                            When GitHub renders your README, it requests each image URL.
                            MetalForge's edge functions receive the request, generate an SVG in milliseconds, and return it.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                            {[
                                { step: '01', title: 'You add URL', desc: 'Paste a MetalForge URL into your README.md as a markdown image' },
                                { step: '02', title: 'Edge renders', desc: 'Vercel Edge Function generates the SVG from URL parameters in ~10ms' },
                                { step: '03', title: 'GitHub displays', desc: 'GitHub shows the rendered SVG — visitors see your styled README component' },
                            ].map(s => (
                                <div key={s.step} className="p-5 rounded-lg border border-[rgba(74,158,255,0.15)] bg-[rgba(74,158,255,0.03)]">
                                    <div className="font-orbitron text-[28px] font-black text-[rgba(74,158,255,0.2)] mb-2">{s.step}</div>
                                    <div className="font-mono text-[13px] font-bold text-[#c8d0f0] mb-1">{s.title}</div>
                                    <div className="font-mono text-[12px] text-[#56607a] leading-[1.6]">{s.desc}</div>
                                </div>
                            ))}
                        </div>
                        <Callout type="tip">
                            All routes use <code>export const runtime = 'edge'</code> — zero cold starts, globally distributed.
                            SVGs are cached with <code>Cache-Control: public, max-age=86400</code>.
                        </Callout>
                    </Section>

                    <Section id="url-syntax" tag="// 03" title="URL Syntax">
                        <p className="text-[15px] text-[#8890b0] leading-[1.8] mb-4">
                            Every component follows the same URL pattern:
                        </p>
                        <div className="p-5 rounded-lg bg-[#0a0a14] border border-[rgba(240,190,50,0.2)] font-mono text-[14px] my-4 overflow-x-auto">
                            <span className="text-[#f0c030]">https://metal-forage.vercel.app</span>
                            <span className="text-[#7880a0]">/api/</span>
                            <span className="text-[#4a9eff]">{'{component}'}</span>
                            <span className="text-[#7880a0]">?</span>
                            <span className="text-[#39ff14]">param1=value1</span>
                            <span className="text-[#7880a0]">&amp;</span>
                            <span className="text-[#39ff14]">param2=value2</span>
                        </div>
                        <Code>{`<!-- Component examples -->
https://metal-forage.vercel.app/api/banner?text=Hello&metal=chrome
https://metal-forage.vercel.app/api/badge?label=Version&value=3.0&metal=gold
https://metal-forage.vercel.app/api/button?label=Deploy&style=metallic&metal=neon-green
https://metal-forage.vercel.app/api/card?title=Stars&value=1.2k&metal=silver
https://metal-forage.vercel.app/api/skill-tree?skills=Python:90,JS:85&metal=neon-blue`}</Code>
                        <Callout type="warning">
                            Use <code>+</code> or <code>%20</code> for spaces in text values.
                            Special characters should be URL-encoded.
                        </Callout>
                    </Section>

                    <Section id="metals" tag="// 04" title="Metal Themes">
                        <p className="text-[15px] text-[#8890b0] leading-[1.8] mb-6">
                            Pass any metal name as the <code className="text-[#4a9eff]">metal=</code> parameter.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { group: 'Classic', metals: ['chrome', 'gold', 'silver', 'bronze', 'copper', 'iron'] },
                                { group: 'Neon', metals: ['neon-green', 'neon-blue', 'neon-pink', 'neon-orange', 'neon-yellow'] },
                                { group: 'Cyber', metals: ['electric', 'plasma', 'holographic', 'matrix', 'cyber'] },
                                { group: 'Aurora', metals: ['aurora', 'aurora-blue', 'aurora-green'] },
                                { group: 'Pastel', metals: ['rose-gold', 'pearl', 'lavender', 'mint', 'peach'] },
                                { group: 'Material', metals: ['obsidian', 'titanium', 'platinum', 'tungsten'] },
                            ].map(g => (
                                <div key={g.group} className="p-4 rounded-lg border border-[rgba(120,140,200,0.12)] bg-[rgba(255,255,255,0.02)]">
                                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#56607a] mb-2">{g.group}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {g.metals.map(m => (
                                            <code key={m} className="text-[11px] px-2 py-0.5 rounded bg-[rgba(74,158,255,0.08)]
                        text-[#4a9eff] border border-[rgba(74,158,255,0.15)]">{m}</code>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section id="gradients" tag="// 05" title="Custom Gradients">
                        <p className="text-[15px] text-[#8890b0] leading-[1.8] mb-4">
                            Override any metal with your own colors using the <code className="text-[#4a9eff]">colors=</code> param.
                            Pass comma-separated hex values. The <code className="text-[#4a9eff]">angle=</code> param controls the gradient direction.
                        </p>
                        <Code>{`<!-- Two-color gradient, 45° angle -->
![Banner](https://metal-forage.vercel.app/api/banner?text=Custom&colors=%23ff0080,%230080ff&angle=45)

<!-- Three-color gradient -->
![Badge](https://metal-forage.vercel.app/api/badge?label=Status&value=Active&colors=%23ff6b35,%23f0c030,%2339ff14)

<!-- Named colors also work -->
![Card](https://metal-forage.vercel.app/api/card?title=Score&value=100&colors=gold,silver)`}</Code>
                        <Callout type="info">
                            When <code>colors</code> is provided it overrides the <code>metal</code> param for color — but metal
                            still controls glow effects and text colors.
                        </Callout>
                    </Section>

                    <Section id="components" tag="// 06" title="All Components">
                        <div className="space-y-4">
                            {[
                                { name: 'Banner', route: '/api/banner', desc: 'Full-width header banner with title, subtitle, and optional text animation', key_params: 'text, sub, style, anim, width, height' },
                                { name: 'Stat Card', route: '/api/card', desc: 'Compact card showing a title and value — great for GitHub stats', key_params: 'title, value, style, icon' },
                                { name: 'Neo Card', route: '/api/card-neo', desc: 'Neumorphic style card with soft shadows and depth', key_params: 'title, value, neoTheme, neoStyle' },
                                { name: 'Glass Card', route: '/api/card-glass', desc: 'Glassmorphic card with frosted blur effect', key_params: 'title, value, glassTheme' },
                                { name: 'Button', route: '/api/button', desc: '16 clickable button styles — wrap in []() for a link', key_params: 'label, style (16 options), icon' },
                                { name: 'Badge', route: '/api/badge', desc: 'Two-part label/value badge in 5 shapes', key_params: 'label, value, shape, valueColor' },
                                { name: 'Header', route: '/api/header', desc: 'Full page header with name, title, and avatar area', key_params: 'name, title, avatar, style' },
                                { name: 'Footer', route: '/api/footer', desc: 'Page footer strip with text and metal divider', key_params: 'text, style' },
                                { name: 'Divider', route: '/api/divider', desc: 'Decorative separator in 6 styles', key_params: 'style (wave/zigzag/dots/straight/double/gradient)' },
                                { name: 'Text Animation', route: '/api/text-anim', desc: '20 animated text effects rendered as SMIL SVG', key_params: 'text, effect (20 options), size' },
                                { name: 'Progress Bar', route: '/api/progress-bar', desc: 'Single skill progress bar with label and percentage', key_params: 'skill, value (0-100)' },
                                { name: 'Skill Tree', route: '/api/skill-tree', desc: 'Multiple skill bars stacked vertically', key_params: 'skills (Name:percent,Name:percent,...)' },
                                { name: 'Terminal', route: '/api/terminal', desc: 'Fake terminal block with command output lines', key_params: 'lines (pipe-separated), title' },
                                { name: 'Social Links', route: '/api/social-links', desc: 'Row of social platform links/icons', key_params: 'links (platform:handle,...), style' },
                                { name: 'Logo Container', route: '/api/logo-container', desc: 'Shaped logo/avatar container (hex, circle, shield, star)', key_params: 'text, src, style (6 shapes), spin' },
                                { name: 'Image Frame', route: '/api/image-container', desc: 'Decorative metallic frame around any image', key_params: 'src, frame (6 styles), caption' },
                            ].map(c => (
                                <div key={c.name} className="p-4 rounded-lg border border-[rgba(120,140,200,0.1)]
                  bg-[rgba(255,255,255,0.01)] hover:border-[rgba(74,158,255,0.2)] transition-colors">
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                        <span className="font-mono text-[14px] font-bold text-[#c8d0f0]">{c.name}</span>
                                        <code className="font-mono text-[11px] text-[#4a9eff] bg-[rgba(74,158,255,0.08)]
                      px-2 py-0.5 rounded border border-[rgba(74,158,255,0.15)]">{c.route}</code>
                                    </div>
                                    <p className="font-mono text-[13px] text-[#7880a0] mb-1">{c.desc}</p>
                                    <p className="font-mono text-[12px] text-[#56607a]">Params: <span className="text-[#8890b0]">{c.key_params}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link href="/api-reference"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-mono text-[13px]
                  border border-[rgba(74,158,255,0.3)] text-[#4a9eff] hover:bg-[rgba(74,158,255,0.08)] transition-all">
                                View full API Reference →
                            </Link>
                        </div>
                    </Section>

                    <Section id="readme-tips" tag="// 07" title="README Tips">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-mono text-[14px] font-bold text-[#c8d0f0] mb-2">Center your components</h3>
                                <Code>{`<div align="center">

![Banner](https://metal-forage.vercel.app/api/banner?text=YOUR+NAME&metal=chrome&width=900)

</div>`}</Code>
                            </div>
                            <div>
                                <h3 className="font-mono text-[14px] font-bold text-[#c8d0f0] mb-2">Make buttons clickable</h3>
                                <Code>{`<!-- Wrap the image in a link: [![label](svg-url)](destination-url) -->
[![Deploy Now](https://metal-forage.vercel.app/api/button?label=Deploy+Now&metal=neon-green)](https://vercel.com)`}</Code>
                            </div>
                            <div>
                                <h3 className="font-mono text-[14px] font-bold text-[#c8d0f0] mb-2">Side-by-side components</h3>
                                <Code>{`<!-- Use an HTML table for multi-column layouts -->
<table>
<tr>
<td><img src="https://metal-forage.vercel.app/api/card?title=Stars&value=1.2k&metal=gold"/></td>
<td><img src="https://metal-forage.vercel.app/api/card?title=Forks&value=340&metal=chrome"/></td>
<td><img src="https://metal-forage.vercel.app/api/card?title=PRs&value=89&metal=silver"/></td>
</tr>
</table>`}</Code>
                            </div>
                        </div>
                    </Section>

                    <Section id="faq" tag="// 08" title="FAQ">
                        <div className="space-y-5">
                            {[
                                {
                                    q: 'Do I need an API key or account?',
                                    a: 'No. MetalForge is completely free with no authentication required. Just use the URLs directly.',
                                },
                                {
                                    q: 'Why is my image not updating in GitHub?',
                                    a: 'GitHub caches external images aggressively. Add a cache-busting query param like ?v=2 to force a refresh. GitHub\'s CDN cache can take up to 24h to clear.',
                                },
                                {
                                    q: 'Can I use MetalForge images outside GitHub?',
                                    a: 'Yes — the SVG URLs work in any HTML <img> tag, Notion, GitLab, Bitbucket, anywhere that renders images.',
                                },
                                {
                                    q: 'Can I self-host MetalForge?',
                                    a: 'Yes, it\'s open source. Clone the repo, run npm install && npm run dev, and deploy to your own Vercel account.',
                                },
                                {
                                    q: 'Who built MetalForge?',
                                    a: 'MetalForge is a free tool by Natraj-X — an AI & IT engineering agency. Visit natrajx.in to learn about our work.',
                                },
                            ].map(({ q, a }) => (
                                <div key={q} className="p-5 rounded-lg border border-[rgba(120,140,200,0.1)] bg-[rgba(255,255,255,0.01)]">
                                    <div className="font-mono text-[13px] font-bold text-[#c8d0f0] mb-2 flex gap-2">
                                        <span className="text-[#f0c030]">Q.</span> {q}
                                    </div>
                                    <div className="font-mono text-[13px] text-[#7880a0] leading-[1.7] flex gap-2">
                                        <span className="text-[#4a9eff]">A.</span> {a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[rgba(120,140,200,0.1)] py-8 px-8 font-mono text-[12px] text-[#56607a]">
                <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span>© 2026 MetalForge · MIT License</span>
                    <span>Built by <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                        className="text-[#f0c030] hover:underline">Natraj-X AI Engineering</a></span>
                    <div className="flex gap-4">
                        <Link href="/" className="hover:text-[#c8d0f0] transition-colors">Home</Link>
                        <Link href="/api-reference" className="hover:text-[#c8d0f0] transition-colors">API</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}