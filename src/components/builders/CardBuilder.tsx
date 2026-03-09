'use client'

import { useState } from 'react'
import { FieldLabel, MetalPicker, CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField, AddButton } from '../ui'

// ─── CARD BUILDER ────────────────────────────────────────────────────────────
export function CardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [username, setUsername] = useState('yourusername')
  const [type, setType] = useState('stats')
  const [metal, setMetal] = useState('chrome')
  const [border, setBorder] = useState('metal')
  const [width, setWidth] = useState(495)
  const [compact, setCompact] = useState(false)

  const url = `/api/card?username=${username}&type=${type}&metal=${metal}&border=${border}&width=${width}${compact?'&compact=true':''}`
  const markdown = `![${type} Card](https://metal-forage.vercel.app${url})`

  return (
    <div>
      <SectionHeader tag="// component_type: stat_card" title="METALLIC STAT CARDS"/>
      <BuilderGrid
        controls={<>
          <div className="mb-5">
            <FieldLabel>GitHub Username</FieldLabel>
            <input className="metal-input" value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <FieldLabel>Card Type</FieldLabel>
              <select className="metal-select" value={type} onChange={e => setType(e.target.value)}>
                {['stats','langs','streak','trophy','activity'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Border Style</FieldLabel>
              <select className="metal-select" value={border} onChange={e => setBorder(e.target.value)}>
                {['metal','glow','minimal','ridge','none'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-5">
            <FieldLabel>Metal Theme</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal}/>
          </div>
          <RangeField label="Width" id="cw" min={300} max={700} value={width} onChange={setWidth}/>
          <label className="flex items-center gap-3 cursor-pointer mb-5 group">
            <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)}
              className="accent-[#4a9eff] w-4 h-4"/>
            <span className="font-mono text-[12px] text-[#7880a0] group-hover:text-[#e0e4f0] transition-colors">
              Compact mode
            </span>
          </label>
          <AddButton onClick={() => onAdd(markdown)}/>
        </>}
        preview={<>
          <PreviewBox>
            <img src={url} alt="Card preview" className="max-w-full"/>
          </PreviewBox>
          <CodeBlock code={markdown}/>
        </>}
      />
    </div>
  )
}

// ─── BUTTON BUILDER ──────────────────────────────────────────────────────────
const PRESETS = [
  { label:'GitHub',    icon:'⌥', metal:'chrome',   style:'beveled' },
  { label:'Portfolio', icon:'◈',  metal:'gold',     style:'pill'    },
  { label:'LinkedIn',  icon:'◆',  metal:'titanium', style:'beveled' },
  { label:'Discord',   icon:'⬡',  metal:'electric', style:'pill'    },
  { label:'Email',     icon:'✉',  metal:'rose-gold',style:'sharp'   },
  { label:'npm',       icon:'⬛', metal:'neon',     style:'beveled' },
  { label:'Twitter/X', icon:'✕',  metal:'obsidian', style:'sharp'   },
  { label:'Buy Coffee',icon:'☕', metal:'copper',   style:'pill'    },
]

export function ButtonBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [label, setLabel] = useState('View Portfolio')
  const [icon, setIcon]   = useState('⚡')
  const [metal, setMetal] = useState('chrome')
  const [style, setStyle] = useState('beveled')
  const [width, setWidth] = useState(180)
  const [href, setHref]   = useState('https://github.com')

  const url = `/api/button?label=${encodeURIComponent(label)}&icon=${encodeURIComponent(icon)}&metal=${metal}&style=${style}&width=${width}`
  const markdown = `[![${label}](https://metal-forage.vercel.app${url})](${href})`

  return (
    <div>
      <SectionHeader tag="// component_type: metallic_button" title="FORGED BUTTON GENERATOR"/>
      <BuilderGrid
        controls={<>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="col-span-2">
              <FieldLabel>Label</FieldLabel>
              <input className="metal-input" value={label} onChange={e => setLabel(e.target.value)}/>
            </div>
            <div>
              <FieldLabel>Icon</FieldLabel>
              <input className="metal-input text-center" value={icon} onChange={e => setIcon(e.target.value)}/>
            </div>
          </div>
          <div className="mb-5">
            <FieldLabel>Link URL</FieldLabel>
            <input className="metal-input" value={href} onChange={e => setHref(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal}/>
          </div>
          <div className="mb-5">
            <FieldLabel>Button Style</FieldLabel>
            <select className="metal-select" value={style} onChange={e => setStyle(e.target.value)}>
              {['beveled','pill','sharp','engraved','ghost'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <RangeField label="Width" id="btw" min={80} max={400} value={width} onChange={setWidth}/>
          <AddButton onClick={() => onAdd(markdown)}/>
        </>}
        preview={<>
          <PreviewBox minHeight={100}>
            <img src={url} alt="Button preview"/>
          </PreviewBox>
          <CodeBlock code={markdown}/>
          <div>
            <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <img
                  key={p.label}
                  src={`/api/button?label=${encodeURIComponent(p.label)}&icon=${encodeURIComponent(p.icon)}&metal=${p.metal}&style=${p.style}&width=130`}
                  alt={p.label}
                  className="cursor-pointer hover:opacity-80 transition-opacity rounded"
                  onClick={() => { setLabel(p.label); setIcon(p.icon); setMetal(p.metal); setStyle(p.style) }}
                />
              ))}
            </div>
          </div>
        </>}
      />
    </div>
  )
}

// ─── BADGE BUILDER ───────────────────────────────────────────────────────────
const TECH_BADGES = [
  { label:'JavaScript', metal:'gold'    },
  { label:'TypeScript', metal:'electric'},
  { label:'Python',     metal:'neon'    },
  { label:'Rust',       metal:'copper'  },
  { label:'Go',         metal:'chrome'  },
  { label:'React',      metal:'electric'},
  { label:'Node.js',    metal:'neon'    },
  { label:'Docker',     metal:'titanium'},
  { label:'Kubernetes', metal:'titanium'},
  { label:'AWS',        metal:'gold'    },
  { label:'Git',        metal:'blood'   },
  { label:'Linux',      metal:'obsidian'},
  { label:'Next.js',    metal:'chrome'  },
  { label:'Figma',      metal:'rose-gold'},
  { label:'GraphQL',    metal:'rose-gold'},
]

export function BadgeBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [label, setLabel] = useState('JavaScript')
  const [value, setValue] = useState('')
  const [metal, setMetal] = useState('gold')
  const [shape, setShape] = useState('pill')
  const [icon, setIcon]   = useState('')

  const url = `/api/badge?label=${encodeURIComponent(label)}${value?`&value=${encodeURIComponent(value)}`:''}&metal=${metal}&shape=${shape}${icon?`&icon=${encodeURIComponent(icon)}`:''}`
  const markdown = `![${label}](https://metal-forage.vercel.app${url})`

  return (
    <div>
      <SectionHeader tag="// component_type: tech_badge" title="TECH STACK BADGES"/>
      <BuilderGrid
        controls={<>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <FieldLabel>Label</FieldLabel>
              <input className="metal-input" value={label} onChange={e => setLabel(e.target.value)}/>
            </div>
            <div>
              <FieldLabel>Value (optional)</FieldLabel>
              <input className="metal-input" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. v18.0"/>
            </div>
          </div>
          <div className="mb-5">
            <FieldLabel>Icon Prefix</FieldLabel>
            <input className="metal-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="emoji or symbol"/>
          </div>
          <div className="mb-5">
            <FieldLabel>Metal</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal}/>
          </div>
          <div className="mb-5">
            <FieldLabel>Shape</FieldLabel>
            <select className="metal-select" value={shape} onChange={e => setShape(e.target.value)}>
              {['pill','rect','hex','sharp'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <AddButton onClick={() => onAdd(markdown)}/>
        </>}
        preview={<>
          <PreviewBox minHeight={80}>
            <img src={url} alt={label}/>
          </PreviewBox>
          <CodeBlock code={markdown}/>
          <div>
            <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// Tech stack quick-add:</p>
            <div className="flex flex-wrap gap-2">
              {TECH_BADGES.map(b => (
                <img
                  key={b.label}
                  src={`/api/badge?label=${encodeURIComponent(b.label)}&metal=${b.metal}&shape=pill`}
                  alt={b.label}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => { setLabel(b.label); setMetal(b.metal) }}
                />
              ))}
            </div>
          </div>
        </>}
      />
    </div>
  )
}

// ─── DIVIDER BUILDER ─────────────────────────────────────────────────────────
export function DividerBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [metal, setMetal] = useState('chrome')
  const [style, setStyle] = useState('line')
  const [width, setWidth] = useState(900)
  const [height, setHeight] = useState(4)

  const url = `/api/divider?metal=${metal}&style=${style}&width=${width}&height=${height}`
  const markdown = `![Divider](https://metal-forage.vercel.app${url})`

  return (
    <div>
      <SectionHeader tag="// component_type: divider" title="METALLIC DIVIDERS"/>
      <BuilderGrid
        controls={<>
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal}/>
          </div>
          <div className="mb-5">
            <FieldLabel>Style</FieldLabel>
            <select className="metal-select" value={style} onChange={e => setStyle(e.target.value)}>
              {['line','double','dashed','ornate','circuit','wave'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <RangeField label="Width"  id="dw" min={200} max={1200} value={width}  onChange={setWidth}/>
          <RangeField label="Height" id="dh" min={2}   max={60}   value={height} onChange={setHeight}/>
          <AddButton onClick={() => onAdd(markdown)}/>
        </>}
        preview={<>
          <PreviewBox minHeight={80}>
            <img src={url} alt="Divider" className="max-w-full"/>
          </PreviewBox>
          <CodeBlock code={markdown}/>
        </>}
      />
    </div>
  )
}
