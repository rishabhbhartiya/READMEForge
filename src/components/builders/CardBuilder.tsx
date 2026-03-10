'use client'

import { useState } from 'react'
import {
  FieldLabel, MetalPicker, GradientInput, AngleField, ThemePicker,
  CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField,
  SelectField, TextField, AddButton,
} from '../ui'

const BASE_URL = 'https://metalforge.vercel.app'

// ─── CARD BUILDER ────────────────────────────────────────────────────────────
export function CardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [username, setUsername] = useState('yourusername')
  const [type, setType] = useState('stats')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [border, setBorder] = useState('metal')
  const [width, setWidth] = useState(495)
  const [compact, setCompact] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  function buildParams(base = false) {
    const p = new URLSearchParams({ username, type, metal, border, width: String(width), theme })
    if (compact) p.set('compact', 'true')
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/card?${p}`
  }

  const markdown = `![${type} Card](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: stat_card" title="METALLIC STAT CARDS" />
      <BuilderGrid
        controls={<>
          <TextField label="GitHub Username" value={username} onChange={setUsername} />

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Card Type" value={type} onChange={setType}
              options={['stats', 'langs', 'streak', 'trophy', 'activity']} />
            <SelectField label="Border Style" value={border} onChange={setBorder}
              options={['metal', 'glow', 'minimal', 'ridge', 'none']} />
          </div>

          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />

          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>

          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}

          <RangeField label="Width" id="cw" min={300} max={700} value={width} onChange={setWidth} />

          <label className="flex items-center gap-3 cursor-pointer mb-5 group">
            <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)}
              className="accent-[#4a9eff] w-4 h-4" />
            <span className="font-mono text-[12px] text-[#7880a0] group-hover:text-[#e0e4f0] transition-colors">
              Compact mode
            </span>
          </label>

          <AddButton onClick={() => onAdd(markdown)} />
        </>}
        preview={<>
          <PreviewBox>
            <img src={buildParams()} alt="Card preview" className="max-w-full" />
          </PreviewBox>
          <CodeBlock code={markdown} />
        </>}
      />
    </div>
  )
}

// ─── BUTTON BUILDER ──────────────────────────────────────────────────────────
const BTN_STYLES = [
  'beveled', 'solid', 'pill', 'sharp', 'engraved', 'ghost', 'outline',
  'gradient', 'glow', '3d', 'neo', 'glass', 'brutalist', 'cta', 'retro', 'pixel',
]

const PRESETS = [
  { label: 'GitHub', icon: '⌥', metal: 'chrome', style: 'beveled' },
  { label: 'Portfolio', icon: '◈', metal: 'gold', style: 'pill' },
  { label: 'LinkedIn', icon: '◆', metal: 'titanium', style: 'beveled' },
  { label: 'Discord', icon: '⬡', metal: 'electric', style: 'pill' },
  { label: 'Email', icon: '✉', metal: 'rose-gold', style: 'sharp' },
  { label: 'npm', icon: '⬛', metal: 'neon-green', style: 'beveled' },
  { label: 'Twitter/X', icon: '✕', metal: 'obsidian', style: 'sharp' },
  { label: 'Buy Coffee', icon: '☕', metal: 'copper', style: 'pill' },
  { label: 'Sponsor', icon: '♦', metal: 'gold', style: 'cta' },
  { label: 'Download', icon: '↓', metal: 'electric', style: 'glow' },
]

export function ButtonBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [label, setLabel] = useState('View Portfolio')
  const [icon, setIcon] = useState('⚡')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [style, setStyle] = useState('beveled')
  const [width, setWidth] = useState(180)
  const [href, setHref] = useState('https://github.com')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  function buildParams(base = false) {
    const p = new URLSearchParams({ label, icon, metal, style, width: String(width), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/button?${p}`
  }

  // README clickable button: [![label](svg)](url)
  const markdown = `[![${label}](${buildParams(true)})](${href})`

  return (
    <div>
      <SectionHeader tag="// component_type: metallic_button" title="FORGED BUTTON GENERATOR" />
      <BuilderGrid
        controls={<>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="col-span-2">
              <TextField label="Label" value={label} onChange={setLabel} />
            </div>
            <div>
              <FieldLabel>Icon</FieldLabel>
              <input className="metal-input text-center" value={icon}
                onChange={e => setIcon(e.target.value)} />
            </div>
          </div>

          <TextField label="Destination URL" value={href} onChange={setHref} />

          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />

          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>

          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}

          <SelectField label="Button Style" value={style} onChange={setStyle} options={BTN_STYLES} />
          <RangeField label="Width" id="btw" min={80} max={400} value={width} onChange={setWidth} />

          <div className="font-mono text-[11px] text-[#7880a0] mb-5 p-3
            bg-[rgba(74,158,255,0.04)] border border-[rgba(74,158,255,0.12)] rounded-md">
            <span className="text-[#4a9eff]">// README tip:</span> SVG buttons need a wrapping link.<br />
            Use <code className="text-[#39ff14]">[![label](svg)](url)</code>
          </div>

          <AddButton onClick={() => onAdd(markdown)} />
        </>}
        preview={<>
          <PreviewBox minHeight={100}>
            <img src={buildParams()} alt="Button preview" />
          </PreviewBox>
          <CodeBlock code={markdown} />
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
  { label: 'JavaScript', metal: 'gold' },
  { label: 'TypeScript', metal: 'electric' },
  { label: 'Python', metal: 'neon-green' },
  { label: 'Rust', metal: 'copper' },
  { label: 'Go', metal: 'chrome' },
  { label: 'React', metal: 'neon-blue' },
  { label: 'Node.js', metal: 'neon-green' },
  { label: 'Docker', metal: 'titanium' },
  { label: 'Kubernetes', metal: 'titanium' },
  { label: 'AWS', metal: 'gold' },
  { label: 'Next.js', metal: 'chrome' },
  { label: 'Figma', metal: 'neon-purple' },
  { label: 'GraphQL', metal: 'rose-gold' },
  { label: 'Tailwind', metal: 'neon-blue' },
  { label: 'PostgreSQL', metal: 'slate' },
  { label: 'Git', metal: 'cyber-red' },
  { label: 'Linux', metal: 'obsidian' },
]

const BADGE_SHAPES = ['pill', 'rounded', 'sharp', 'hex', 'flat']

export function BadgeBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [label, setLabel] = useState('JavaScript')
  const [value, setValue] = useState('')
  const [metal, setMetal] = useState('gold')
  const [colors, setColors] = useState('')
  const [valueColor, setVC] = useState('')
  const [angle, setAngle] = useState(135)
  const [shape, setShape] = useState('pill')
  const [icon, setIcon] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  function buildParams(base = false) {
    const p = new URLSearchParams({ label, metal, shape, theme })
    if (value) p.set('value', value)
    if (icon) p.set('icon', icon)
    if (colors) p.set('colors', colors)
    if (valueColor) p.set('valueColor', valueColor)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/badge?${p}`
  }

  const markdown = `![${label}](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: tech_badge" title="TECH STACK BADGES" />
      <BuilderGrid
        controls={<>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TextField label="Label" value={label} onChange={setLabel} />
            <div>
              <FieldLabel>Value <span className="normal-case opacity-60">(optional)</span></FieldLabel>
              <input className="metal-input" value={value} onChange={e => setValue(e.target.value)}
                placeholder="e.g. v18.0" />
            </div>
          </div>

          <div className="mb-5">
            <FieldLabel>Icon <span className="normal-case opacity-60">(optional)</span></FieldLabel>
            <input className="metal-input" value={icon} onChange={e => setIcon(e.target.value)}
              placeholder="emoji or symbol" />
          </div>

          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />

          <div className="mb-5">
            <FieldLabel>Metal</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>

          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}

          {value && (
            <div className="mb-5">
              <FieldLabel>Value-Side Color <span className="normal-case opacity-60">(metal name or hex)</span></FieldLabel>
              <input className="metal-input" value={valueColor} onChange={e => setVC(e.target.value)}
                placeholder="e.g. obsidian or #222" />
            </div>
          )}

          <SelectField label="Shape" value={shape} onChange={setShape} options={BADGE_SHAPES} />
          <AddButton onClick={() => onAdd(markdown)} />
        </>}
        preview={<>
          <PreviewBox minHeight={80}>
            <img src={buildParams()} alt={label} />
          </PreviewBox>
          <CodeBlock code={markdown} />
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
const DIVIDER_STYLES = ['line', 'double', 'dashed', 'ornate', 'circuit', 'wave', 'zigzag', 'dots']

export function DividerBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(90)
  const [style, setStyle] = useState('line')
  const [width, setWidth] = useState(900)
  const [height, setHeight] = useState(4)

  function buildParams(base = false) {
    const p = new URLSearchParams({ metal, style, width: String(width), height: String(height) })
    if (colors) p.set('colors', colors)
    if (angle !== 90) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/divider?${p}`
  }

  const markdown = `![Divider](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: divider" title="METALLIC DIVIDERS" />
      <BuilderGrid
        controls={<>
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>

          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}

          <SelectField label="Style" value={style} onChange={setStyle} options={DIVIDER_STYLES} />
          <RangeField label="Width" id="dw" min={200} max={1200} value={width} onChange={setWidth} />
          <RangeField label="Height" id="dh" min={2} max={60} value={height} onChange={setHeight} />

          <AddButton onClick={() => onAdd(markdown)} />
        </>}
        preview={<>
          <PreviewBox minHeight={80}>
            <img src={buildParams()} alt="Divider" className="max-w-full" />
          </PreviewBox>
          <CodeBlock code={markdown} />
        </>}
      />
    </div>
  )
}