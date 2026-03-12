const COLS = [
  {
    title: 'Components',
    links: [
      { label: 'Banners', href: '/?tab=banner' },
      { label: 'Stat Cards', href: '/?tab=card' },
      { label: 'Buttons', href: '/?tab=button' },
      { label: 'Badges', href: '/?tab=badge' },
      { label: 'Text Animations', href: '/?tab=text' },
      { label: 'Progress Bars', href: '/?tab=progress' },
      { label: 'Terminal Blocks', href: '/?tab=terminal' },
      { label: 'Dividers', href: '/?tab=divider' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-reference' },
      { label: 'Examples', href: '/#showcase' },
      { label: 'GitHub', href: 'https://github.com/rishabhbhartiya/ReadmeForge.git', external: true },
    ],
  },
  {
    title: 'Built by Natraj-X',
    natrajx: true,
    links: [
      { label: 'AI & ML Engineering', href: 'https://www.natrajx.in/aiml', external: true },
      { label: 'Web Development', href: 'https://www.natrajx.in/webdev', external: true },
      { label: 'Cloud / Infra', href: 'https://www.natrajx.in/cloudinfra', external: true },
      { label: 'Our Work', href: 'https://www.natrajx.in/work', external: true },
      { label: 'Blog', href: 'https://www.natrajx.in/blog', external: true },
      { label: 'Contact Us', href: 'https://www.natrajx.in/contact', external: true },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#0e0e1a] border-t border-[rgba(120,140,200,0.12)] pt-14 pb-8 px-8 overflow-hidden">

      {/* Top metallic line */}
      <div className="absolute top-0 left-0 right-0 h-px
        bg-[linear-gradient(90deg,transparent,rgba(200,200,255,0.25),rgba(255,180,50,0.25),transparent)]"/>

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px]
        bg-[radial-gradient(ellipse,rgba(74,158,255,0.04)_0%,transparent_70%)] pointer-events-none"/>

      <div className="max-w-[1320px] mx-auto">

        {/* Natraj-X hero backlink banner */}
        <a
          href="https://www.natrajx.in/"
          target="_blank"
          rel="noopener"
          title="Natraj-X — AI Engineering Agency: ML Pipelines, Web Development, Data Engineering"
          className="flex flex-col sm:flex-row items-center justify-between gap-4
            px-6 py-4 mb-12 rounded-lg border border-[rgba(240,190,50,0.2)]
            bg-[rgba(240,190,50,0.04)] hover:bg-[rgba(240,190,50,0.08)]
            hover:border-[rgba(240,190,50,0.4)] transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-md flex items-center justify-center
              bg-[rgba(240,190,50,0.12)] border border-[rgba(240,190,50,0.3)]">
              <span className="font-mono font-black text-[14px] tracking-tight"
                style={{
                  background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>NX</span>
            </div>
            <div>
              <div className="font-mono text-[12px] tracking-[2px] uppercase text-[#f0c030] font-bold">
                ReadmeForge is built by Natraj-X
              </div>
              <div className="font-mono text-[11px] text-[#7880a0] mt-0.5">
                We build production-grade AI systems, ML pipelines &amp; full-stack applications →{' '}
                <span className="text-[#4a9eff] group-hover:underline">natrajx.in</span>
              </div>
            </div>
          </div>
          <div className="font-mono text-[11px] tracking-[1.5px] uppercase
            px-4 py-2 rounded border border-[rgba(240,190,50,0.35)]
            text-[#f0c030] group-hover:bg-[rgba(240,190,50,0.1)] transition-colors whitespace-nowrap">
            Hire Us →
          </div>
        </a>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="font-orbitron text-[18px] font-black tracking-[3px] mb-4">
              <span style={{
                background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>README</span>
              <span style={{
                background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>FORGE</span>
            </div>
            <p className="text-[13px] text-[#7880a0] leading-[1.7] max-w-[240px] mb-5">
              Free GitHub README SVG generator. 44 metal themes, 28 design styles,
              20+ text effects. Open source &amp; free forever.
            </p>
            <p className="text-[12px] text-[#56607a] leading-[1.6] max-w-[240px] mb-5">
              A tool by{' '}
              <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
                className="text-[#f0c030] hover:underline font-semibold">
                Natraj-X AI Engineering
              </a>
              {' '}— specialists in ML pipelines, data engineering &amp; full-stack development.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm
                bg-[rgba(74,158,255,0.08)] text-[#4a9eff] border border-[rgba(74,158,255,0.2)]
                tracking-[1px] uppercase">Open Source</span>
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm
                bg-[rgba(240,190,50,0.08)] text-[#f0c030] border border-[rgba(240,190,50,0.2)]
                tracking-[1px] uppercase">Free Forever</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-sm
                bg-[rgba(57,255,20,0.08)] text-[#39ff14] border border-[rgba(57,255,20,0.2)]
                tracking-[1px] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14]
                  shadow-[0_0_6px_#39ff14] status-pulse inline-block"/>
                Live
              </span>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className={`font-mono text-[11px] tracking-[2px] uppercase mb-4 ${(col as any).natrajx ? 'text-[#f0c030]' : 'text-[#7880a0]'
                }`}>
                {(col as any).natrajx && <span className="mr-1.5">★</span>}
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l: any) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener' : undefined}
                      className="flex items-center gap-2 text-[13px] text-[#7880a0]
                        transition-colors duration-150 hover:text-[#e0e4f0] group">
                      <span className={`opacity-50 group-hover:opacity-100 transition-opacity ${(col as any).natrajx ? 'text-[#f0c030]' : 'text-[#4a9eff]'
                        }`}>›</span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SEO text block — crawlable by Google */}
        <div className="text-[11px] text-[#3a3e55] leading-[1.8] mb-8 max-w-3xl">
          ReadmeForge is a free GitHub README generator created by{' '}
          <a href="https://www.natrajx.in/" rel="noopener" target="_blank"
            className="text-[#4a4e68] hover:text-[#7880a0]">
            Natraj-X
          </a>
          , an AI &amp; IT engineering agency. Generate metallic SVG badges, animated banners,
          stat cards, progress bars, terminal blocks and more for your GitHub profile README.
          Supports 44 metal themes and edge-rendered SVG components.
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[rgba(120,140,200,0.1)] flex flex-col sm:flex-row
          justify-between items-center gap-4 font-mono text-[11px] text-[#7880a0] tracking-[1px]">
          <span>
            © 2026{' '}
            <span style={{
              background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>READMEFORGE</span>
            {' '}· MIT LICENSE
          </span>

          <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
            title="Natraj-X — AI Engineering Agency"
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm
              border border-[rgba(240,190,50,0.2)] hover:border-[rgba(240,190,50,0.45)]
              hover:bg-[rgba(240,190,50,0.06)] transition-all duration-200 group">
            <span className="text-[#56607a] group-hover:text-[#7880a0]">CRAFTED BY</span>
            <span className="font-black tracking-[2px]"
              style={{
                background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>NATRAJ-X</span>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none"
              className="text-[#f0c030] opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>

          <span>v1.0.0 · NEXT.JS 15 · EDGE RUNTIME</span>
        </div>
      </div>
    </footer>
  )
}