'use client'
import { useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Docs',     href: '/docs'          },
  { label: 'API',      href: '/api-reference'  },
  { label: 'Examples', href: '/#showcase'      },
  { label: 'GitHub',   href: 'https://github.com/rishabhbhartiya/ReadmeForge.git', target: '_blank' },
]

export default function Navbar() {
  // Enable smooth scrolling globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // Full page routes (/docs, /api-reference) — navigate normally
    if (!href.startsWith('#') && !href.startsWith('/#')) return
    e.preventDefault()
    // Handle /#showcase — go to home then scroll
    if (href.startsWith('/#')) {
      window.location.href = href
      return
    }
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16
      bg-[rgba(8,8,16,0.88)] backdrop-blur-xl
      border-b border-[rgba(120,140,200,0.12)] relative">

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px
        bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.5),rgba(240,190,50,0.4),transparent)]"/>

      {/* Logo */}
      <a href="/" className="font-orbitron text-[20px] font-black tracking-[3px] select-none no-underline">
        <span style={{
          background: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8,#c8c8c8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>README</span>
        <span style={{
          background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#e8c030)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>FORGE</span>
      </a>

      {/* Nav links */}
      <ul className="hidden md:flex gap-1 list-none items-center">
        {NAV_LINKS.map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              target={(l as any).target}
              rel={(l as any).target === '_blank' ? 'noopener noreferrer' : undefined}
              onClick={(e) => handleNav(e, l.href)}
              className="block px-4 py-2 font-rajdhani font-semibold text-[13px]
                tracking-[1.5px] uppercase text-[#7880a0] rounded
                border border-transparent transition-all duration-200
                hover:text-[#4a9eff] hover:border-[rgba(74,158,255,0.25)]
                hover:bg-[rgba(74,158,255,0.05)] cursor-pointer">
              {l.label}
            </a>
          </li>
        ))}

        {/* Natraj-X backlink */}
        <li>
          <a
            href="https://www.natrajx.in/"
            target="_blank"
            rel="noopener"
            title="Built by Natraj-X — AI Engineering Agency"
            className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded
              border border-[rgba(240,190,50,0.3)] bg-[rgba(240,190,50,0.06)]
              font-mono text-[11px] tracking-[1px] uppercase
              text-[#f0c030] transition-all duration-200
              hover:border-[rgba(240,190,50,0.6)] hover:bg-[rgba(240,190,50,0.12)]
              hover:text-[#f5d050]">
            <span className="text-[9px] opacity-70">BY</span>
            <span className="font-bold tracking-[2px]">NATRAJ-X</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-60">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        </li>
      </ul>

      {/* Right badge */}
      <div className="font-mono text-[11px] tracking-[1px] px-3 py-1.5 rounded-sm
        text-[#1a0800] font-bold select-none"
        style={{ background: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#9a7010)' }}>
        v1.0 BETA
      </div>
    </nav>
  )
}
