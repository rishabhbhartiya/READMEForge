'use client'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16
      bg-[rgba(8,8,16,0.88)] backdrop-blur-xl
      border-b border-[rgba(120,140,200,0.12)] relative">

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px
        bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.5),rgba(240,190,50,0.4),transparent)]"/>

      {/* Logo */}
      <div className="font-orbitron text-[20px] font-black tracking-[3px] select-none">
        <span style={{
          background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8,#c8c8c8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>METAL</span>
        <span style={{
          background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#e8c030)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>FORGE</span>
      </div>

      {/* Nav links */}
      <ul className="hidden md:flex gap-1 list-none">
        {['Docs', 'API', 'Examples', 'GitHub'].map(l => (
          <li key={l}>
            <a href="#" className="block px-4 py-2 font-rajdhani font-semibold text-[13px]
              tracking-[1.5px] uppercase text-[#7880a0] rounded
              border border-transparent transition-all duration-200
              hover:text-[#4a9eff] hover:border-[rgba(74,158,255,0.25)] hover:bg-[rgba(74,158,255,0.05)]">
              {l}
            </a>
          </li>
        ))}
      </ul>

      {/* Right badge */}
      <div className="font-mono text-[11px] tracking-[1px] px-3 py-1.5 rounded-sm
        text-[#1a0800] font-bold"
        style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#9a7010)' }}>
        v2.0 ALPHA
      </div>
    </nav>
  )
}
