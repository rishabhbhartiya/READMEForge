const COLS = [
  {
    title: 'Components',
    links: ['Banners', 'Stat Cards', 'Buttons', 'Badges', 'Dividers', 'Text Animations', 'Progress Bars'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Examples', 'Changelog', 'GitHub'],
  },
  {
    title: 'Community',
    links: ['Discord', 'Twitter/X', 'Contribute', 'Report a Bug'],
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
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="font-orbitron text-[18px] font-black tracking-[3px] mb-4">
              <span style={{
                background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>METAL</span>
              <span style={{
                background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>FORGE</span>
            </div>
            <p className="text-[14px] text-[#7880a0] leading-[1.7] max-w-[240px] mb-5">
              Advanced GitHub README component generator. 44-metal SVG engine. 28 design styles.
              Deployed on Vercel.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm
                bg-[rgba(74,158,255,0.08)] text-[#4a9eff] border border-[rgba(74,158,255,0.2)]
                tracking-[1px] uppercase">
                Open Source
              </span>
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm
                bg-[rgba(240,190,50,0.08)] text-[#f0c030] border border-[rgba(240,190,50,0.2)]
                tracking-[1px] uppercase">
                SVG Engine
              </span>
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
              <h4 className="font-mono text-[11px] tracking-[2px] uppercase text-[#7880a0] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="flex items-center gap-2 text-[14px] text-[#7880a0]
                      transition-colors duration-150 hover:text-[#e0e4f0] group">
                      <span className="text-[#4a9eff] opacity-50 group-hover:opacity-100 transition-opacity">›</span>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[rgba(120,140,200,0.1)] flex flex-col sm:flex-row
          justify-between items-center gap-3 font-mono text-[11px] text-[#7880a0] tracking-[1px]">
          <span>
            © 2026{' '}
            <span style={{
              background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>METALFORGE</span>
            {' '}· MIT LICENSE
          </span>
          <span>CRAFTED WITH <span className="text-[#ff6b35]">♦</span> FOR DEVELOPERS</span>
          <span>v3.0.0-beta · NEXT.JS 15 · EDGE RUNTIME</span>
        </div>
      </div>
    </footer>
  )
}