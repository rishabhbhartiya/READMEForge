'use client'

import { useState } from 'react'
import {
  FieldLabel, MetalPicker, GradientInput, AngleField, ThemePicker,
  CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField,
  SelectField, TextField, AddButton,
} from '../ui'

// ─── Option Lists ─────────────────────────────────────────────────────────────

const SHAPES = [
  'wave', 'wave-bottom', 'flat', 'diagonal', 'slice', 'arch', 'chevron',
  'venom', 'shark', 'egg', 'cylinder', 'hexframe', 'torn', 'diamond', 'ribbon', 'circuit', 'blob',
]

const ANIMATIONS = [
  'none', 'shimmer', 'pulse', 'fadeIn', 'scanline',
  'glow', 'scan', 'twinkling', 'aurora', 'glitch', 'plasma', 'neonFlicker',
]

const VISUAL_STYLES = [
  'metallic', 'glass', 'neo', 'cyberpunk', 'holographic', 'aurora', 'neon', 'minimal', 'retro', 'gradient',
]

const BORDERS = [
  'none', 'metallic', 'normal', 'gradient', 'glow', 'neon', 'double', 'dashed', 'animated', 'circuit',
]

const ALIGNS = ['left', 'center', 'right']

const FONTS = [
  'Orbitron', 'Rajdhani', 'Share Tech Mono', 'Arial Black', 'Georgia',
  'Courier New', 'Impact', 'Trebuchet MS', 'Verdana', 'Tahoma',
]

const BASE_URL = 'https://readmeforge.natrajx.in'

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Collapse({ label, children, defaultOpen = false }: {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-4 border border-[rgba(120,140,200,0.1)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5
          font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase
          hover:text-[#e0e4f0] hover:bg-[rgba(74,158,255,0.04)] transition-all cursor-pointer"
      >
        <span className="text-[#4a9eff]">// </span>
        <span className="flex-1 text-left ml-1">{label}</span>
        <span className="opacity-60">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pt-3 pb-1">{children}</div>}
    </div>
  )
}

// ─── Color Input ──────────────────────────────────────────────────────────────

function ColorField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#ffffff'}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded cursor-pointer border border-[rgba(120,140,200,0.2)] bg-transparent"
        />
        <input
          className="metal-input flex-1"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '#ffffff  or  metal name'}
        />
      </div>
    </div>
  )
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export default function BannerBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  // Core
  const [text, setText] = useState('Hello, World!')
  const [subtext, setSubtext] = useState('Full-Stack Developer · Open Source')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [shape, setShape] = useState('wave')
  const [height, setHeight] = useState(200)
  const [width, setWidth] = useState(900)
  const [section, setSection] = useState<'header' | 'footer'>('header')
  const [align, setAlign] = useState('center')

  // Visual style
  const [visualStyle, setVStyle] = useState('metallic')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [bg, setBg] = useState('')
  const [anim, setAnim] = useState('none')

  // Typography
  const [font, setFont] = useState('Orbitron')
  const [subtextFont, setSFont] = useState('Rajdhani')
  const [textColor, setTextColor] = useState('')
  const [subColor, setSubColor] = useState('')

  // Border
  const [border, setBorder] = useState('none')
  const [borderColor, setBColor] = useState('')
  const [borderWidth, setBWidth] = useState(2)

  // ── Param builder ──
  function buildParams(w = width) {
    const p = new URLSearchParams({
      text, subtext,
      metal,
      type: shape,
      height: String(height),
      width: String(w),
      animation: anim,
      align,
      section,
      theme,
      fontFamily: font,
      subtextFont,
      visualStyle,
      border,
      borderWidth: String(borderWidth),
    })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    if (bg) p.set('bg', bg)
    if (textColor) p.set('textColor', textColor)
    if (subColor) p.set('subtextColor', subColor)
    if (borderColor) p.set('borderColor', borderColor)
    return p.toString()
  }

  const previewUrl = `/api/banner?${buildParams(Math.min(width, 860))}`
  const markdown = `![Banner](${BASE_URL}/api/banner?${buildParams()})`

  return (
    <div>
      <SectionHeader tag="// component_type: banner" title="METALLIC BANNER GENERATOR" />
      <BuilderGrid
        controls={<>
          {/* ── Content ── */}
          <Collapse label="Content" defaultOpen>
            <TextField label="Banner Text" value={text} onChange={setText} placeholder="Your title here" />
            <TextField label="Subtext / Tagline" value={subtext} onChange={setSubtext} placeholder="Optional subtext" />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Text Align" value={align} onChange={setAlign} options={ALIGNS} />
              <SelectField label="Section" value={section}
                onChange={v => setSection(v as 'header' | 'footer')}
                options={[{ value: 'header', label: 'Header' }, { value: 'footer', label: 'Footer (flip)' }]} />
            </div>
          </Collapse>

          {/* ── Visual Style ── */}
          <Collapse label="Visual Style" defaultOpen>
            <SelectField label="Visual Style" value={visualStyle} onChange={setVStyle} options={VISUAL_STYLES} />
            <FieldLabel>Theme</FieldLabel>
            <ThemePicker value={theme} onChange={setTheme} />
            <div className="mb-4">
              <FieldLabel>Metal Finish</FieldLabel>
              <MetalPicker value={metal} onChange={setMetal} compact />
            </div>
            <GradientInput value={colors} onChange={setColors} />
            {colors && <AngleField value={angle} onChange={setAngle} />}
            <div className="mb-4">
              <FieldLabel>Background <span className="normal-case opacity-60">(optional hex)</span></FieldLabel>
              <input className="metal-input" value={bg} onChange={e => setBg(e.target.value)} placeholder="#0a0a18" />
            </div>
          </Collapse>

          {/* ── Shape & Animation ── */}
          <Collapse label="Shape & Animation">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Shape" value={shape} onChange={setShape} options={SHAPES} />
              <SelectField label="Animation" value={anim} onChange={setAnim} options={ANIMATIONS} />
            </div>
          </Collapse>

          {/* ── Typography ── */}
          <Collapse label="Typography">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Title Font" value={font} onChange={setFont} options={FONTS} />
              <SelectField label="Subtext Font" value={subtextFont} onChange={setSFont} options={FONTS} />
            </div>
            <ColorField label="Title Color" value={textColor} onChange={setTextColor} placeholder="leave blank = auto" />
            <ColorField label="Subtext Color" value={subColor} onChange={setSubColor} placeholder="leave blank = auto" />
          </Collapse>

          {/* ── Border ── */}
          <Collapse label="Border">
            <SelectField label="Border Style" value={border} onChange={setBorder} options={BORDERS} />
            {border !== 'none' && <>
              <ColorField label="Border Color" value={borderColor} onChange={setBColor} placeholder="leave blank = auto" />
              <RangeField label="Border Width" id="bbw" min={1} max={8} value={borderWidth} onChange={setBWidth} />
            </>}
          </Collapse>

          {/* ── Size ── */}
          <Collapse label="Size">
            <RangeField label="Height" id="bh" min={80} max={400} value={height} onChange={setHeight} />
            <RangeField label="Width" id="bw" min={300} max={1200} value={width} onChange={setWidth} />
          </Collapse>

          <div className="flex gap-3 mt-2">
            <AddButton onClick={() => onAdd(markdown)} />
          </div>
        </>}

        preview={<>
          <PreviewBox minHeight={height + 40}>
            <img
              src={previewUrl}
              alt="Banner preview"
              className="max-w-full rounded-lg"
              style={{ maxHeight: height + 20 }}
            />
          </PreviewBox>
          <CodeBlock code={markdown} />
          <div className="font-mono text-[11px] text-[#7880a0] leading-[1.8] mt-1">
            <p className="text-[#4a9eff] mb-1">// v4 params:</p>
            <p>text · subtext · metal · colors · angle · shape · animation</p>
            <p>visualStyle · border · borderColor · borderWidth</p>
            <p>textColor · subtextColor · fontFamily · subtextFont</p>
            <p>align · section · theme · bg · width · height</p>
          </div>
        </>}
      />
    </div>
  )
}