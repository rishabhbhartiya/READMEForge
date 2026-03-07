'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BannerBuilder from '@/components/builders/BannerBuilder'
import { CardBuilder, ButtonBuilder, BadgeBuilder, DividerBuilder } from '@/components/builders/CardBuilder'
import ShowcaseGrid from '@/components/ShowcaseGrid'
import ReadmeAssembler from '@/components/ReadmeAssembler'
import { SectionHeader, MetalPicker, FieldLabel, CodeBlock, PreviewBox, BuilderGrid, RangeField, AddButton } from '@/components/ui'

const TABS = [
  { id:'banner',      icon:'⬛', label:'Banners'    },
  { id:'header',      icon:'⊞',  label:'Headers'    },
  { id:'footer',      icon:'⊟',  label:'Footers'    },
  { id:'card',        icon:'◈',  label:'Cards'      },
  { id:'neo',         icon:'◑',  label:'Neumorphic' },
  { id:'glass',       icon:'◻',  label:'Glass'      },
  { id:'button',      icon:'⬟',  label:'Buttons'    },
  { id:'badge',       icon:'◆',  label:'Badges'     },
  { id:'text',        icon:'Ａ',  label:'Text FX'    },
  { id:'progress',    icon:'▰',  label:'Progress'   },
  { id:'terminal',    icon:'⌨',  label:'Terminal'   },
  { id:'logo',        icon:'⬡',  label:'Logos'      },
  { id:'image',       icon:'▣',  label:'Frames'     },
  { id:'social',      icon:'◈',  label:'Social'     },
  { id:'divider',     icon:'─',  label:'Dividers'   },
  { id:'showcase',    icon:'✦',  label:'Showcase'   },
] as const

type TabId = typeof TABS[number]['id']

// ─── Quick Builders for new types ────────────────────────────────────────────

function HeaderBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [name, setName] = useState('John Doe')
  const [title, setTitle] = useState('Full-Stack Developer')
  const [tagline, setTagline] = useState('Building things that matter ✦')
  const [metal, setMetal] = useState('chrome')
  const [style, setStyle] = useState('profile')
  const [height, setHeight] = useState(280)
  const url = `/api/header?name=${encodeURIComponent(name)}&title=${encodeURIComponent(title)}&tagline=${encodeURIComponent(tagline)}&metal=${metal}&style=${style}&height=${height}`
  const md = `![Header](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: profile_header" title="PROFILE HEADER GENERATOR"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Your Name</FieldLabel><input className="metal-input" value={name} onChange={e=>setName(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Title / Role</FieldLabel><input className="metal-input" value={title} onChange={e=>setTitle(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Tagline</FieldLabel><input className="metal-input" value={tagline} onChange={e=>setTagline(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Metal Finish</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="mb-5"><FieldLabel>Style</FieldLabel>
        <select className="metal-select" value={style} onChange={e=>setStyle(e.target.value)}>
          {['profile','minimal','cyber','terminal','hologram'].map(s=><option key={s} value={s}>{s}</option>)}
        </select></div>
      <RangeField label="Height" id="hh" min={120} max={400} value={height} onChange={setHeight}/>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={height}><img src={url} alt="Header preview" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function FooterBuilderUI({ onAdd }: { onAdd:(c:string)=>void }) {
  const [text, setText] = useState('Thanks for visiting!')
  const [subtext, setSubtext] = useState('Made with ♦ and MetalForge')
  const [links, setLinks] = useState('Twitter,GitHub,LinkedIn')
  const [metal, setMetal] = useState('chrome')
  const [style, setStyle] = useState('wave')
  const [height, setHeight] = useState(180)
  const url = `/api/footer?text=${encodeURIComponent(text)}&subtext=${encodeURIComponent(subtext)}&links=${encodeURIComponent(links)}&metal=${metal}&style=${style}&height=${height}`
  const md = `![Footer](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: profile_footer" title="PROFILE FOOTER GENERATOR"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Main Text</FieldLabel><input className="metal-input" value={text} onChange={e=>setText(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Subtext</FieldLabel><input className="metal-input" value={subtext} onChange={e=>setSubtext(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Links (comma-separated)</FieldLabel><input className="metal-input" value={links} onChange={e=>setLinks(e.target.value)} placeholder="Twitter,GitHub,LinkedIn"/></div>
      <div className="mb-5"><FieldLabel>Metal</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="mb-5"><FieldLabel>Style</FieldLabel>
        <select className="metal-select" value={style} onChange={e=>setStyle(e.target.value)}>
          {['wave','minimal','cyber','credits'].map(s=><option key={s} value={s}>{s}</option>)}
        </select></div>
      <RangeField label="Height" id="fh" min={80} max={300} value={height} onChange={setHeight}/>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={height}><img src={url} alt="Footer preview" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function NeoCardBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [title, setTitle] = useState('Commits')
  const [value, setValue] = useState('3,291')
  const [subtitle, setSubtitle] = useState('This year')
  const [icon, setIcon] = useState('◉')
  const [theme, setTheme] = useState('dark')
  const [style, setStyle] = useState('raised')
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(160)
  const url = `/api/card-neo?title=${encodeURIComponent(title)}&value=${encodeURIComponent(value)}&subtitle=${encodeURIComponent(subtitle)}&icon=${encodeURIComponent(icon)}&theme=${theme}&style=${style}&width=${width}&height=${height}`
  const md = `![${title}](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: neumorphic_card" title="NEUMORPHIC CARD"/>
    <BuilderGrid controls={<>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="col-span-2"><FieldLabel>Title</FieldLabel><input className="metal-input" value={title} onChange={e=>setTitle(e.target.value)}/></div>
        <div><FieldLabel>Icon</FieldLabel><input className="metal-input text-center" value={icon} onChange={e=>setIcon(e.target.value)}/></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><FieldLabel>Value</FieldLabel><input className="metal-input" value={value} onChange={e=>setValue(e.target.value)}/></div>
        <div><FieldLabel>Subtitle</FieldLabel><input className="metal-input" value={subtitle} onChange={e=>setSubtitle(e.target.value)}/></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><FieldLabel>Theme</FieldLabel>
          <select className="metal-select" value={theme} onChange={e=>setTheme(e.target.value)}>
            {['dark','light','warm','cool','neon-dark'].map(t=><option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><FieldLabel>Style</FieldLabel>
          <select className="metal-select" value={style} onChange={e=>setStyle(e.target.value)}>
            {['raised','pressed','floating','inset'].map(s=><option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <RangeField label="Width" id="ncw" min={120} max={400} value={width} onChange={setWidth}/>
        <RangeField label="Height" id="nch" min={80} max={300} value={height} onChange={setHeight}/>
      </div>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={height+40}><img src={url} alt="Neo card preview"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function GlassCardBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [title, setTitle] = useState('Repositories')
  const [value, setValue] = useState('42')
  const [subtitle, setSubtitle] = useState('Public repos')
  const [icon, setIcon] = useState('◈')
  const [theme, setTheme] = useState('dark')
  const [width, setWidth] = useState(220)
  const [height, setHeight] = useState(170)
  const url = `/api/card-glass?title=${encodeURIComponent(title)}&value=${encodeURIComponent(value)}&subtitle=${encodeURIComponent(subtitle)}&icon=${encodeURIComponent(icon)}&theme=${theme}&width=${width}&height=${height}`
  const md = `![${title}](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: glass_card" title="GLASSMORPHIC CARD"/>
    <BuilderGrid controls={<>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="col-span-2"><FieldLabel>Title</FieldLabel><input className="metal-input" value={title} onChange={e=>setTitle(e.target.value)}/></div>
        <div><FieldLabel>Icon</FieldLabel><input className="metal-input text-center" value={icon} onChange={e=>setIcon(e.target.value)}/></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><FieldLabel>Value</FieldLabel><input className="metal-input" value={value} onChange={e=>setValue(e.target.value)}/></div>
        <div><FieldLabel>Subtitle</FieldLabel><input className="metal-input" value={subtitle} onChange={e=>setSubtitle(e.target.value)}/></div>
      </div>
      <div className="mb-5"><FieldLabel>Theme</FieldLabel>
        <select className="metal-select" value={theme} onChange={e=>setTheme(e.target.value)}>
          {['dark','light','aurora','sunset','ocean','midnight'].map(t=><option key={t} value={t}>{t}</option>)}
        </select></div>
      <div className="grid grid-cols-2 gap-4">
        <RangeField label="Width" id="gcw" min={120} max={400} value={width} onChange={setWidth}/>
        <RangeField label="Height" id="gch" min={80} max={300} value={height} onChange={setHeight}/>
      </div>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={height+40}><img src={url} alt="Glass card preview"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function TextAnimBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [text, setText] = useState('Hello, World!')
  const [effect, setEffect] = useState('typewriter')
  const [metal, setMetal] = useState('electric')
  const [width, setWidth] = useState(600)
  const [size, setSize] = useState(32)
  const [speed, setSpeed] = useState('normal')
  const [bg, setBg] = useState('dark')
  const url = `/api/text-anim?text=${encodeURIComponent(text)}&effect=${effect}&metal=${metal}&width=${width}&size=${size}&speed=${speed}&bg=${bg}`
  const md = `![${text}](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: text_animation" title="TEXT ANIMATION EFFECTS"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Text</FieldLabel><input className="metal-input" value={text} onChange={e=>setText(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Effect</FieldLabel>
        <select className="metal-select" value={effect} onChange={e=>setEffect(e.target.value)}>
          {['typewriter','glitch','wave','neon-flicker','rainbow','shimmer','matrix','bounce'].map(e=><option key={e} value={e}>{e}</option>)}
        </select></div>
      <div className="mb-5"><FieldLabel>Metal / Color</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><FieldLabel>Speed</FieldLabel>
          <select className="metal-select" value={speed} onChange={e=>setSpeed(e.target.value)}>
            {['slow','normal','fast'].map(s=><option key={s} value={s}>{s}</option>)}
          </select></div>
        <div><FieldLabel>Background</FieldLabel>
          <select className="metal-select" value={bg} onChange={e=>setBg(e.target.value)}>
            {['dark','light','transparent'].map(b=><option key={b} value={b}>{b}</option>)}
          </select></div>
      </div>
      <RangeField label="Font Size" id="tfs" min={14} max={80} value={size} onChange={setSize}/>
      <RangeField label="Width" id="tw" min={200} max={1000} value={width} onChange={setWidth}/>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={100}><img src={url} alt="Text animation preview" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function ProgressBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [label, setLabel] = useState('JavaScript')
  const [value, setValue2] = useState(85)
  const [metal, setMetal] = useState('gold')
  const [style, setStyle] = useState('metallic')
  const [width, setWidth] = useState(450)
  const url = `/api/progress-bar?label=${encodeURIComponent(label)}&value=${value}&metal=${metal}&style=${style}&width=${width}`
  const md = `![${label} ${value}%](https://metalforge.vercel.app${url})`

  const PRESET_SKILLS = [
    {label:'TypeScript',v:92,m:'electric'},{label:'React',v:88,m:'electric'},{label:'Python',v:80,m:'neon'},
    {label:'Rust',v:65,m:'copper'},{label:'Go',v:70,m:'titanium'},{label:'CSS',v:90,m:'rose-gold'},
  ]

  return (
    <div><SectionHeader tag="// component_type: progress_bar" title="SKILL PROGRESS BARS"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Skill Label</FieldLabel><input className="metal-input" value={label} onChange={e=>setLabel(e.target.value)}/></div>
      <RangeField label="Proficiency" id="pv" min={0} max={100} value={value} onChange={setValue2} unit="%"/>
      <div className="mb-5"><FieldLabel>Metal</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="mb-5"><FieldLabel>Style</FieldLabel>
        <select className="metal-select" value={style} onChange={e=>setStyle(e.target.value)}>
          {['metallic','glow-fill','segmented','glass','circuit','neo'].map(s=><option key={s} value={s}>{s}</option>)}
        </select></div>
      <RangeField label="Width" id="pw" min={200} max={800} value={width} onChange={setWidth}/>
      <div className="mt-4">
        <button className="btn-chrome px-4 py-2 rounded text-sm cursor-pointer mr-3 mb-3"
          onClick={()=>onAdd(`![${label}](https://metalforge.vercel.app/api/skill-tree?title=Tech+Stack&skills=${encodeURIComponent(PRESET_SKILLS.map(s=>`${s.label}:${s.v}:${s.m}`).join(','))}&width=450)`)}>
          ⚡ Add Full Skill Tree
        </button>
        <AddButton onClick={()=>onAdd(md)}/>
      </div>
    </>} preview={<>
      <PreviewBox minHeight={80}><img src={url} alt="Progress bar"/></PreviewBox>
      <CodeBlock code={md}/>
      <div className="mt-4">
        <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// Skill tree preview:</p>
        <PreviewBox minHeight={160}>
          <img src={`/api/skill-tree?title=Tech+Stack&skills=${encodeURIComponent(PRESET_SKILLS.map(s=>`${s.label}:${s.v}:${s.m}`).join(','))}&width=420`} alt="Skill tree" className="max-w-full"/>
        </PreviewBox>
      </div>
    </>}/>
    </div>
  )
}

function TerminalBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [termTitle, setTermTitle] = useState('profile.sh')
  const [lines, setLines] = useState('$ whoami|full-stack-developer|$ echo $STACK|TypeScript · React · Node.js|$ cat hobbies.txt|Open Source · Gaming · Coffee ☕')
  const [theme, setTheme] = useState('dark')
  const [metal, setMetal] = useState('chrome')
  const [width, setWidth] = useState(500)
  const url = `/api/terminal?title=${encodeURIComponent(termTitle)}&lines=${encodeURIComponent(lines)}&theme=${theme}&metal=${metal}&width=${width}`
  const md = `![Terminal](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: terminal" title="TERMINAL BLOCK"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Window Title</FieldLabel><input className="metal-input" value={termTitle} onChange={e=>setTermTitle(e.target.value)}/></div>
      <div className="mb-5"><FieldLabel>Lines (separate with |)</FieldLabel>
        <textarea className="metal-input" rows={5} value={lines} onChange={e=>setLines(e.target.value)} style={{resize:'vertical'}}/>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><FieldLabel>Theme</FieldLabel>
          <select className="metal-select" value={theme} onChange={e=>setTheme(e.target.value)}>
            {['dark','matrix','amber','blue'].map(t=><option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><FieldLabel>Frame Metal</FieldLabel>
          <select className="metal-select" value={metal} onChange={e=>setMetal(e.target.value)}>
            {['chrome','gold','neon','electric','titanium'].map(m=><option key={m} value={m}>{m}</option>)}
          </select></div>
      </div>
      <RangeField label="Width" id="termw" min={250} max={800} value={width} onChange={setWidth}/>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox><img src={url} alt="Terminal preview" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function LogoBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [text, setLogoText] = useState('MF')
  const [metal, setMetal] = useState('gold')
  const [shape, setShape] = useState('hexagon')
  const [size, setSize] = useState(120)
  const [glow, setGlow] = useState(true)
  const url = `/api/logo-container?text=${encodeURIComponent(text)}&metal=${metal}&style=${shape}&size=${size}&glow=${glow}`
  const md = `![Logo](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: logo_container" title="LOGO CONTAINER"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Initials / Symbol</FieldLabel><input className="metal-input" value={text} onChange={e=>setLogoText(e.target.value)} maxLength={4}/></div>
      <div className="mb-5"><FieldLabel>Metal Finish</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="mb-5"><FieldLabel>Shape</FieldLabel>
        <select className="metal-select" value={shape} onChange={e=>setShape(e.target.value)}>
          {['hexagon','shield','circle','diamond','star','rounded-square'].map(s=><option key={s} value={s}>{s}</option>)}
        </select></div>
      <RangeField label="Size" id="ls" min={40} max={300} value={size} onChange={setSize}/>
      <label className="flex items-center gap-3 cursor-pointer mb-5">
        <input type="checkbox" checked={glow} onChange={e=>setGlow(e.target.checked)} className="accent-[#4a9eff] w-4 h-4"/>
        <span className="font-mono text-[12px] text-[#7880a0]">Enable glow</span>
      </label>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<>
      <PreviewBox minHeight={size+40}><img src={url} alt="Logo preview"/></PreviewBox>
      <CodeBlock code={md}/>
      <div className="mt-4">
        <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// All shapes preview:</p>
        <div className="flex flex-wrap gap-3">
          {['hexagon','shield','circle','diamond','star','rounded-square'].map(s=>(
            <img key={s} src={`/api/logo-container?text=${encodeURIComponent(text)}&metal=${metal}&style=${s}&size=70`}
              alt={s} className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={()=>setShape(s)}/>
          ))}
        </div>
      </div>
    </>}/>
    </div>
  )
}

function FrameBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [frameType, setFrameType] = useState<'image'|'gif'>('image')
  const [src, setSrc] = useState('')
  const [caption, setCaption] = useState('Project Screenshot')
  const [frame, setFrame] = useState('metallic')
  const [metal, setMetal] = useState('chrome')
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(220)
  const url = frameType === 'image'
    ? `/api/image-container?src=${encodeURIComponent(src)}&frame=${frame}&metal=${metal}&width=${width}&height=${height}&caption=${encodeURIComponent(caption)}`
    : `/api/gif-container?src=${encodeURIComponent(src)}&frame=${frame}&metal=${metal}&width=${width}&height=${height}`
  const md = `![Frame](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: image_frame" title="IMAGE / GIF FRAME"/>
    <BuilderGrid controls={<>
      <div className="flex gap-3 mb-5">
        {(['image','gif'] as const).map(t=>(
          <button key={t} onClick={()=>setFrameType(t)}
            className={`px-4 py-2 rounded text-sm font-mono tracking-widest uppercase cursor-pointer border transition-all ${frameType===t ? 'btn-chrome border-transparent' : 'btn-ghost'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mb-5"><FieldLabel>Image URL (optional)</FieldLabel><input className="metal-input" value={src} onChange={e=>setSrc(e.target.value)} placeholder="https://..."/></div>
      {frameType==='image' && <div className="mb-5"><FieldLabel>Caption</FieldLabel><input className="metal-input" value={caption} onChange={e=>setCaption(e.target.value)}/></div>}
      <div className="mb-5"><FieldLabel>Frame Style</FieldLabel>
        <select className="metal-select" value={frame} onChange={e=>setFrame(e.target.value)}>
          {(frameType==='image' ? ['metallic','glass','polaroid','circuit','neon-sign'] : ['neon','metallic','glass','minimal']).map(f=><option key={f} value={f}>{f}</option>)}
        </select></div>
      <div className="mb-5"><FieldLabel>Metal</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="grid grid-cols-2 gap-4">
        <RangeField label="Width" id="fw" min={100} max={600} value={width} onChange={setWidth}/>
        <RangeField label="Height" id="fh2" min={80} max={500} value={height} onChange={setHeight}/>
      </div>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={height+40}><img src={url} alt="Frame preview" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

function SocialBuilder({ onAdd }: { onAdd:(c:string)=>void }) {
  const [links, setLinks] = useState('github:@yourusername,twitter:@yourusername,linkedin:yourname,email:you@email.com')
  const [metal, setMetal] = useState('chrome')
  const [style, setStyle] = useState('pills')
  const [width, setWidth] = useState(600)
  const url = `/api/social-links?links=${encodeURIComponent(links)}&metal=${metal}&style=${style}&width=${width}`
  const md = `![Social Links](https://metalforge.vercel.app${url})`
  return (
    <div><SectionHeader tag="// component_type: social_links" title="SOCIAL LINKS ROW"/>
    <BuilderGrid controls={<>
      <div className="mb-5"><FieldLabel>Links (platform:username, comma-separated)</FieldLabel>
        <textarea className="metal-input" rows={4} value={links} onChange={e=>setLinks(e.target.value)}/>
        <p className="font-mono text-[10px] text-[#7880a0] mt-1">Platforms: github, twitter, linkedin, discord, youtube, instagram, email, website, npm, medium</p>
      </div>
      <div className="mb-5"><FieldLabel>Metal</FieldLabel><MetalPicker value={metal} onChange={setMetal}/></div>
      <div className="mb-5"><FieldLabel>Style</FieldLabel>
        <select className="metal-select" value={style} onChange={e=>setStyle(e.target.value)}>
          {['pills','icons','minimal'].map(s=><option key={s} value={s}>{s}</option>)}
        </select></div>
      <RangeField label="Width" id="slw" min={200} max={1000} value={width} onChange={setWidth}/>
      <AddButton onClick={()=>onAdd(md)}/>
    </>} preview={<><PreviewBox minHeight={80}><img src={url} alt="Social links" className="max-w-full"/></PreviewBox><CodeBlock code={md}/></>}/>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [tab, setTab] = useState<TabId>('banner')
  const [assembled, setAssembled] = useState<string[]>([])
  const addToReadme = useCallback((code: string) => { setAssembled(prev => [...prev, code]) }, [])

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse,rgba(74,158,255,0.09)_0%,transparent_70%)] pointer-events-none"/>
        <p className="font-mono text-[11px] tracking-[3px] text-[#4a9eff] mb-3 opacity-75">// METALFORGE v2.0 — 16 COMPONENT TYPES — FULL PROFILE KIT</p>
        <h1 className="font-orbitron text-[clamp(24px,5vw,64px)] font-black tracking-[4px] leading-tight mb-4"
          style={{ background:'linear-gradient(135deg,#e8e8e8 0%,#a0a8c0 35%,#ffffff 55%,#8090b0 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          README FORGE
        </h1>
        <p className="text-[16px] text-[#7880a0] max-w-[700px] mx-auto mb-8 leading-relaxed">
          Headers · Footers · Metallic Cards · Neumorphic · Glassmorphic · Text FX · Progress Bars · Terminals · Logo Containers · Image Frames · GIF Frames · Social Links · Banners · Buttons · Badges · Dividers
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={()=>setTab('showcase')} className="btn-chrome px-6 py-2.5 rounded-md text-sm cursor-pointer">✦ Full Showcase</button>
          <button onClick={()=>setTab('header')} className="btn-gold px-6 py-2.5 rounded-md text-sm cursor-pointer">⊞ Build Profile</button>
        </div>
        <div className="flex gap-6 justify-center mt-10 flex-wrap">
          {[['16','Component Types'],['10','Metal Finishes'],['8','Banner Shapes'],['9','Text Effects']].map(([n,l])=>(
            <div key={l} className="text-center">
              <div className="font-orbitron text-2xl font-black" style={{ background:'var(--gold)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</div>
              <div className="font-mono text-[10px] text-[#7880a0] tracking-widest mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-[1320px] mx-auto px-6 pb-24">
        {/* TAB BAR - scrollable */}
        <div className="flex border-b border-[rgba(120,140,200,0.15)] mb-10 overflow-x-auto pb-0 hide-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-3 font-rajdhani font-semibold text-[12px] tracking-[1.2px] uppercase border-b-2 -mb-px whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0
                ${tab===t.id ? 'text-[#4a9eff] border-[#4a9eff]' : 'text-[#7880a0] border-transparent hover:text-[#e0e4f0]'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab==='banner'   && <BannerBuilder      onAdd={addToReadme}/>}
        {tab==='header'   && <HeaderBuilder       onAdd={addToReadme}/>}
        {tab==='footer'   && <FooterBuilderUI     onAdd={addToReadme}/>}
        {tab==='card'     && <CardBuilder         onAdd={addToReadme}/>}
        {tab==='neo'      && <NeoCardBuilder      onAdd={addToReadme}/>}
        {tab==='glass'    && <GlassCardBuilder    onAdd={addToReadme}/>}
        {tab==='button'   && <ButtonBuilder       onAdd={addToReadme}/>}
        {tab==='badge'    && <BadgeBuilder        onAdd={addToReadme}/>}
        {tab==='text'     && <TextAnimBuilder     onAdd={addToReadme}/>}
        {tab==='progress' && <ProgressBuilder     onAdd={addToReadme}/>}
        {tab==='terminal' && <TerminalBuilder     onAdd={addToReadme}/>}
        {tab==='logo'     && <LogoBuilder         onAdd={addToReadme}/>}
        {tab==='image'    && <FrameBuilder        onAdd={addToReadme}/>}
        {tab==='social'   && <SocialBuilder       onAdd={addToReadme}/>}
        {tab==='divider'  && <DividerBuilder      onAdd={addToReadme}/>}
        {tab==='showcase' && <ShowcaseGrid        onAdd={addToReadme}/>}

        <ReadmeAssembler items={assembled} onClear={()=>setAssembled([])}/>
      </main>
      <Footer/>
    </div>
  )
}
