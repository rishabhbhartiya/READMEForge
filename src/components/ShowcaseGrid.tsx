// src/components/ShowcaseGrid.tsx

'use client'

import { SectionHeader } from './ui'

const BASE = 'https://readmeforge.natrajx.in'

const SECTIONS = [
  {
    label: '// Headers & Footers',
    items: [
      { name:'profile-header-chrome',   url:'/api/header?name=John+Doe&title=Full-Stack+Developer&tagline=Building+things+that+matter&metal=chrome&style=profile&height=260', type:'header' },
      { name:'cyber-header-electric',   url:'/api/header?name=HACKER+MODE&title=Security+Engineer&metal=electric&style=cyber&height=220', type:'header' },
      { name:'terminal-header-neon-green', url:'/api/header?name=Alice+Dev&title=Backend+Engineer&tagline=Rust+%C2%B7+Go+%C2%B7+Distributed+Systems&metal=neon-green&style=terminal&height=260', type:'header' },
      { name:'hologram-header-gold',    url:'/api/header?name=HOLOGRAM&title=Creative+Developer&metal=gold&style=hologram&height=220', type:'header' },
      { name:'wave-footer-chrome',      url:'/api/footer?text=Thanks+for+visiting%21&subtext=Let%E2%80%99s+build+something+together&metal=chrome&style=wave&height=160', type:'footer' },
      { name:'cyber-footer-gold',       url:'/api/footer?text=CONNECT+WITH+ME&links=Twitter%2CGitHub%2CLinkedIn%2CEmail&metal=gold&style=cyber&height=160', type:'footer' },
    ]
  },
  {
    label: '// Neumorphic Cards',
    items: [
      { name:'neo-commits-dark',     url:'/api/card-neo?title=Commits&value=3%2C291&subtitle=This+year&icon=%E2%97%89&neoTheme=dark&style=raised&metal=chrome', type:'neo-card' },
      { name:'neo-stars-warm',       url:'/api/card-neo?title=Stars&value=12.4k&subtitle=Earned&icon=%E2%98%85&neoTheme=warm&style=raised&metal=gold', type:'neo-card' },
      { name:'neo-prs-cool',         url:'/api/card-neo?title=Pull+Requests&value=847&subtitle=Merged&icon=%E2%8E%87&neoTheme=cool&style=floating&metal=electric', type:'neo-card' },
      { name:'neo-pressed-neon',     url:'/api/card-neo?title=Repos&value=58&subtitle=Public&icon=%E2%97%88&neoTheme=neon-dark&style=pressed&metal=neon-purple', type:'neo-card' },
    ]
  },
  {
    label: '// Glassmorphic Cards',
    items: [
      // Original themes
      { name: 'glass-dark', url: '/api/card-glass?title=Repositories&value=42&subtitle=Public+repos&icon=%E2%97%88&glassTheme=dark&metal=chrome', type: 'glass-card' },
      { name: 'glass-aurora', url: '/api/card-glass?title=Followers&value=5.2k&subtitle=GitHub+followers&icon=%E2%98%85&glassTheme=aurora&metal=aurora', type: 'glass-card' },
      { name: 'glass-sunset', url: '/api/card-glass?title=Streak&value=89+days&subtitle=Longest+streak&icon=%E2%9A%A1&glassTheme=sunset&metal=rose-gold', type: 'glass-card' },
      { name: 'glass-ocean', url: '/api/card-glass?title=Stars&value=12.4k&subtitle=Total+earned&icon=%E2%9C%A6&glassTheme=ocean&metal=aurora-ocean', type: 'glass-card' },
      { name: 'glass-midnight', url: '/api/card-glass?title=Commits&value=3.2k&subtitle=All+time&icon=%E2%97%89&glassTheme=midnight&metal=neon-blue', type: 'glass-card' },
      // New themes
      { name: 'glass-neon', url: '/api/card-glass?title=Pull+Requests&value=284&subtitle=Merged&icon=%E2%8E%87&glassTheme=neon&metal=neon-green', type: 'glass-card' },
      { name: 'glass-rose', url: '/api/card-glass?title=Sponsors&value=18&subtitle=Thank+you&icon=%E2%99%A5&glassTheme=rose&metal=rose-gold', type: 'glass-card' },
      { name: 'glass-forest', url: '/api/card-glass?title=Issues+Closed&value=531&subtitle=All+time&icon=%E2%9C%93&glassTheme=forest&metal=neon-green', type: 'glass-card' },
      { name: 'glass-gold', url: '/api/card-glass?title=Gists&value=47&subtitle=Public&icon=%E2%97%87&glassTheme=gold&metal=gold', type: 'glass-card' },
      { name: 'glass-ice', url: '/api/card-glass?title=Watching&value=312&subtitle=Repos&icon=%E2%97%8E&glassTheme=ice&metal=electric', type: 'glass-card' },
      { name: 'glass-void', url: '/api/card-glass?title=Discussions&value=96&subtitle=Started&icon=%E2%97%8F&glassTheme=void&metal=neon-blue', type: 'glass-card' },
      // GitHub live stat examples
      { name: 'glass-gh-repos', url: '/api/card-glass?username=torvalds&stat=repos&glassTheme=aurora&metal=chrome', type: 'glass-card' },
      { name: 'glass-gh-stars', url: '/api/card-glass?username=torvalds&stat=stars&glassTheme=gold&metal=gold', type: 'glass-card' },
    ]
  },
  {
    label: '// Text Animations',
    items: [
      { name:'typewriter-electric',  url:'/api/text-anim?text=Hello%2C+World%21&effect=typewriter&metal=electric&width=500&size=32', type:'text-anim' },
      { name:'glitch-neon-pink',     url:'/api/text-anim?text=GLITCH+MODE&effect=glitch&metal=neon-pink&width=500&size=34', type:'text-anim' },
      { name:'neon-flicker-blue',    url:'/api/text-anim?text=NEON+LIGHTS&effect=neon-flicker&metal=neon-blue&width=500&size=32', type:'text-anim' },
      { name:'wave-gold',            url:'/api/text-anim?text=WAVE+EFFECT&effect=wave&metal=gold&width=500&size=30', type:'text-anim' },
      { name:'rainbow',              url:'/api/text-anim?text=FULL+SPECTRUM&effect=rainbow&width=500&size=32', type:'text-anim' },
      { name:'shimmer-chrome',       url:'/api/text-anim?text=METALLIC+SHIMMER&effect=shimmer&metal=chrome&width=500&size=30', type:'text-anim' },
      { name:'bounce-rose-gold',     url:'/api/text-anim?text=BOUNCE%21&effect=bounce&metal=rose-gold&width=400&size=36', type:'text-anim' },
    ]
  },
  {
    label: '// Progress & Skills',
    items: [
      { name:'progress-metallic-gold',    url:'/api/progress-bar?label=JavaScript&value=92&metal=gold&style=metallic&width=400', type:'progress' },
      { name:'progress-glow-electric',    url:'/api/progress-bar?label=TypeScript&value=88&metal=electric&style=glow-fill&width=400', type:'progress' },
      { name:'progress-segmented-neon-green', url:'/api/progress-bar?label=React&value=85&metal=neon-green&style=segmented&width=400', type:'progress' },
      { name:'progress-circuit-copper',   url:'/api/progress-bar?label=Rust&value=60&metal=copper&style=circuit&width=400', type:'progress' },
      { name:'skill-tree-default',        url:'/api/skill-tree?title=Tech+Stack&metal=chrome&width=450', type:'skill-tree' },
      { name:'skill-tree-custom',         url:'/api/skill-tree?title=Languages&skills=TypeScript:92:electric,Python:80:neon-green,Rust:65:copper,Go:70:titanium&metal=gold&width=450', type:'skill-tree' },
    ]
  },
  {
    label: '// Terminals',
    items: [
      { name:'terminal-dark',   url:'/api/terminal?title=profile.sh&theme=dark&width=480', type:'terminal' },
      { name:'terminal-matrix', url:'/api/terminal?title=matrix.sh&theme=matrix&width=480&lines=%24+whoami|neo|%24+cat+mission.txt|Free+your+mind.', type:'terminal' },
      { name:'terminal-amber',  url:'/api/terminal?title=retro.sh&theme=amber&width=480', type:'terminal' },
      { name:'terminal-blue',   url:'/api/terminal?title=system.sh&theme=blue&width=480', type:'terminal' },
    ]
  },
  {
    label: '// Logo Containers',
    items: [
      { name:'logo-hex-gold',          url:'/api/logo-container?text=MF&metal=gold&style=hexagon&size=120', type:'logo' },
      { name:'logo-shield-chrome',     url:'/api/logo-container?text=DEV&metal=chrome&style=shield&size=120', type:'logo' },
      { name:'logo-circle-electric',   url:'/api/logo-container?text=JS&metal=electric&style=circle&size=120', type:'logo' },
      { name:'logo-diamond-rose-gold', url:'/api/logo-container?text=RS&metal=rose-gold&style=diamond&size=120', type:'logo' },
      { name:'logo-star-neon-green',   url:'/api/logo-container?text=★&metal=neon-green&style=star&size=120', type:'logo' },
      { name:'logo-square-titanium',   url:'/api/logo-container?text=TS&metal=titanium&style=rounded-square&size=120', type:'logo' },
    ]
  },
  {
    label: '// Image & GIF Containers',
    items: [
      { name:'img-metallic-chrome', url:'/api/image-container?frame=metallic&metal=chrome&width=280&height=200&caption=Project+Screenshot', type:'container' },
      { name:'img-circuit-gold',    url:'/api/image-container?frame=circuit&metal=gold&width=280&height=200', type:'container' },
      { name:'img-neon-sign',       url:'/api/image-container?frame=neon-sign&metal=electric&width=280&height=200', type:'container' },
      { name:'img-polaroid',        url:'/api/image-container?frame=polaroid&width=260&height=220&caption=My+Setup', type:'container' },
      { name:'gif-neon-frame',      url:'/api/gif-container?frame=neon&metal=neon-green&width=280&height=200', type:'gif' },
      { name:'gif-metallic-frame',  url:'/api/gif-container?frame=metallic&metal=gold&width=280&height=200', type:'gif' },
    ]
  },
  {
    label: '// Social Links',
    items: [
      { name:'social-pills-chrome',  url:'/api/social-links?links=github:@you,twitter:@you,linkedin:you,email:you@email.com&metal=chrome&style=pills&width=600', type:'social' },
      { name:'social-icons-gold',    url:'/api/social-links?links=github,twitter,linkedin,discord,youtube&metal=gold&style=icons&width=400&height=60', type:'social' },
      { name:'social-minimal-neon-green', url:'/api/social-links?links=github:@dev,twitter:@dev,npm:@dev&metal=neon-green&style=minimal&width=500', type:'social' },
    ]
  },
  {
    label: '// Banners',
    items: [
      { name: 'banner-metallic-chrome', url: '/api/banner?text=Welcome+to+my+Profile&subtext=Full-Stack+Developer&metal=chrome&visualStyle=metallic&height=200&width=860', type: 'banner' },
      { name: 'banner-glass-electric', url: '/api/banner?text=PORTFOLIO&subtext=Design+%C2%B7+Code+%C2%B7+Deploy&metal=electric&visualStyle=glass&height=200&width=860', type: 'banner' },
      { name: 'banner-cyberpunk-neon-green', url: '/api/banner?text=HACKER+MODE&subtext=Security+%C2%B7+Systems&metal=neon-green&visualStyle=cyberpunk&border=neon&height=200&width=860', type: 'banner' },
      { name: 'banner-holographic', url: '/api/banner?text=OPEN+SOURCE&subtext=Building+the+future&metal=holographic&visualStyle=holographic&height=200&width=860', type: 'banner' },
      { name: 'banner-aurora-blue', url: '/api/banner?text=FULL+STACK&subtext=React+%C2%B7+Node+%C2%B7+Cloud&metal=aurora&visualStyle=aurora&height=200&width=860', type: 'banner' },
      { name: 'banner-neon-pink', url: '/api/banner?text=NEON+DREAMS&subtext=Glow+in+the+dark&metal=neon-pink&visualStyle=neon&border=neon&height=200&width=860', type: 'banner' },
      { name: 'banner-retro-gold', url: '/api/banner?text=RETRO+VIBES&subtext=Est.+1984&metal=gold&visualStyle=retro&height=200&width=860', type: 'banner' },
      { name: 'banner-matrix-neon-green', url: '/api/banner?text=THE+MATRIX&subtext=Follow+the+white+rabbit&metal=neon-green&visualStyle=matrix&height=200&width=860', type: 'banner' },
      { name: 'banner-void-neon-blue', url: '/api/banner?text=VOID+WALKER&subtext=Lost+in+the+cosmos&metal=neon-blue&visualStyle=void&height=200&width=860', type: 'banner' },
      { name: 'banner-inferno-gold', url: '/api/banner?text=FIRE+STARTER&subtext=Burn+bright&metal=gold&visualStyle=inferno&height=200&width=860', type: 'banner' },
      { name: 'banner-circuit-electric', url: '/api/banner?text=CIRCUIT+BOARD&subtext=Hardware+%C2%B7+Firmware+%C2%B7+Software&metal=electric&visualStyle=circuit&border=circuit&height=200&width=860', type: 'banner' },
      { name: 'banner-plasma-purple', url: '/api/banner?text=PLASMA+CORE&subtext=High+energy+computing&metal=neon-blue&visualStyle=plasma&height=200&width=860', type: 'banner' },
      { name: 'banner-crystalline-chrome', url: '/api/banner?text=CRYSTALLINE&subtext=Faceted+precision&metal=chrome&visualStyle=crystalline&height=200&width=860', type: 'banner' },
      { name: 'banner-minimal-titanium', url: '/api/banner?text=MINIMAL+MARK&subtext=Less+is+more&metal=titanium&visualStyle=minimal&height=160&width=860', type: 'banner' },
      { name: 'banner-neo-warm', url: '/api/banner?text=SOFT+UI&subtext=Neumorphic+depth&metal=rose-gold&visualStyle=neo&height=200&width=860', type: 'banner' },
      { name: 'banner-gradient-gold', url: '/api/banner?text=GRADIENT+FLOW&subtext=Smooth+depth+and+light&metal=gold&visualStyle=gradient&border=metallic&height=200&width=860', type: 'banner' },
    ]
  },
  {
    label: '// Tables',
    items: [
      { name: 'table-stats-chrome', url: '/api/table?type=stats&metal=chrome&width=600', type: 'table' },
      { name: 'table-skills-gold', url: '/api/table?type=skills&metal=gold&width=600', type: 'table' },
      { name: 'table-projects-electric', url: '/api/table?type=projects&metal=electric&width=600', type: 'table' },
      { name: 'table-timeline-neon', url: '/api/table?type=timeline&metal=neon-blue&width=600', type: 'table' },
      { name: 'table-comparison-rose', url: '/api/table?type=comparison&metal=rose-gold&width=600', type: 'table' },
      { name: 'table-custom-neon-green', url: '/api/table?type=stats&metal=neon-green&headers=Tool,Usage,Rating&rows=VSCode,Daily,★★★★★|Neovim,Often,★★★★☆|Cursor,Weekly,★★★☆☆&width=600', type: 'table' },
    ]
  },
]

const TYPE_COLORS: Record<string, string> = {
  header:      'text-[#4a9eff] border-[rgba(74,158,255,0.25)] bg-[rgba(74,158,255,0.08)]',
  footer:      'text-[#f0c030] border-[rgba(240,190,50,0.25)] bg-[rgba(240,190,50,0.08)]',
  'neo-card':  'text-[#ff6b35] border-[rgba(255,107,53,0.25)] bg-[rgba(255,107,53,0.08)]',
  'glass-card':'text-[#00ffcc] border-[rgba(0,255,200,0.25)] bg-[rgba(0,255,200,0.06)]',
  'text-anim': 'text-[#ff60a0] border-[rgba(255,96,160,0.25)] bg-[rgba(255,96,160,0.08)]',
  progress:    'text-[#39ff14] border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.08)]',
  'skill-tree':'text-[#a0c8ff] border-[rgba(160,200,255,0.25)] bg-[rgba(160,200,255,0.08)]',
  terminal:    'text-[#39ff14] border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.08)]',
  logo:        'text-[#f0c030] border-[rgba(240,190,50,0.25)] bg-[rgba(240,190,50,0.08)]',
  container:   'text-[#c0c8e8] border-[rgba(192,200,232,0.2)] bg-[rgba(192,200,232,0.05)]',
  gif:         'text-[#4a9eff] border-[rgba(74,158,255,0.25)] bg-[rgba(74,158,255,0.08)]',
  social:      'text-[#ff6b35] border-[rgba(255,107,53,0.25)] bg-[rgba(255,107,53,0.08)]',
  banner:      'text-[#4a9eff] border-[rgba(74,158,255,0.25)] bg-[rgba(74,158,255,0.08)]',
  card:        'text-[#f0c030] border-[rgba(240,190,50,0.25)] bg-[rgba(240,190,50,0.08)]',
  button:      'text-[#ff6b35] border-[rgba(255,107,53,0.25)] bg-[rgba(255,107,53,0.08)]',
  badge:       'text-[#39ff14] border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.08)]',
  divider:     'text-[#c0c8e8] border-[rgba(192,200,232,0.2)] bg-[rgba(192,200,232,0.05)]',
  table: 'text-[#c0c8e8] border-[rgba(192,200,232,0.2)] bg-[rgba(192,200,232,0.05)]',
}

export default function ShowcaseGrid({ onAdd }: { onAdd: (code: string) => void }) {
  return (
    <div>
      <SectionHeader tag="// pre-built: all_metallic_components" title="FULL COMPONENT SHOWCASE"/>
      {SECTIONS.map(section => (
        <div key={section.label} className="mb-12">
          <p className="font-mono text-[11px] tracking-[2px] text-[#4a9eff] opacity-75 mb-4">{section.label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map(item => (
              <div key={item.name}
                className="metal-card overflow-hidden group transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#050508] p-4 flex items-center justify-center min-h-[80px]
                  border-b border-[rgba(120,140,200,0.1)]"
                  style={{
                    backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
                    backgroundSize:'20px 20px',
                  }}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className="max-w-full max-h-[120px] rounded transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-[#7880a0] tracking-[1px] truncate mb-1">{item.name}</p>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border tracking-[1px] uppercase
                      ${TYPE_COLORS[item.type] ?? TYPE_COLORS.banner}`}>
                      {item.type}
                    </span>
                  </div>
                  <button
                    onClick={() => onAdd(`![${item.name}](${BASE}${item.url})`)}
                    className="btn-ghost px-3 py-1.5 rounded text-[11px] cursor-pointer shrink-0
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
