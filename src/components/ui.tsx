'use client'

import { useState } from 'react'

// ── Label ────────────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-2">
      {children}
    </label>
  )
}

// ── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] tracking-[3px] text-[#4a9eff] opacity-75 mb-1">{tag}</p>
      <h2
        className="font-orbitron text-[22px] font-bold tracking-[2px]"
        style={{
          background: 'linear-gradient(135deg,#f0f0f0 0%,#909090 25%,#d8d8d8 50%,#c8c8c8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >
        {title}
      </h2>
    </div>
  )
}

// ── All 44 v3 Metal swatches ─────────────────────────────────────────────────
export const SWATCH_STYLES: Record<string, string> = {
  // Classic metals
  chrome: 'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8,#787878)',
  gold: 'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#9a7010)',
  silver: 'linear-gradient(135deg,#f8f8f8,#a0a0a0,#e0e0e0,#606060)',
  copper: 'linear-gradient(135deg,#f0a070,#8b4513,#d0782a,#6b3008)',
  bronze: 'linear-gradient(135deg,#e0c090,#8b6914,#c0a040,#6b4808)',
  platinum: 'linear-gradient(135deg,#e8f0f8,#a0b8d0,#d0e0f0,#809ab0)',
  titanium: 'linear-gradient(135deg,#a0b0cc,#4a5f7a,#8090b0,#384a60)',
  iron: 'linear-gradient(135deg,#787888,#383848,#585868,#282838)',
  steel: 'linear-gradient(135deg,#b0c0d0,#607080,#90a8b8,#485860)',
  'rose-gold': 'linear-gradient(135deg,#ffd0d0,#cc7878,#eea0a0,#a05858)',
  obsidian: 'linear-gradient(135deg,#484858,#1c1c2c,#303040,#101020)',
  mercury: 'linear-gradient(135deg,#e8e8f0,#8080a0,#c0c0d8,#606080)',
  // Neon / electric
  electric: 'linear-gradient(135deg,#60ffff,#0050ff,#4000ff,#00d0ff)',
  'neon-pink': 'linear-gradient(135deg,#ff60c0,#c000a0,#ff00ff,#8000c0)',
  'neon-green': 'linear-gradient(135deg,#80ff40,#00cc60,#00ff80,#60ff20)',
  'neon-blue': 'linear-gradient(135deg,#60c0ff,#0080ff,#00c0ff,#0040ff)',
  'neon-purple': 'linear-gradient(135deg,#c080ff,#8000ff,#c000ff,#6000d0)',
  'neon-orange': 'linear-gradient(135deg,#ffb060,#ff6000,#ffd000,#e04000)',
  // Aurora
  aurora: 'linear-gradient(135deg,#00ffa0,#0080ff,#8000ff,#00ffcc)',
  'aurora-rose': 'linear-gradient(135deg,#ff80c0,#8000ff,#ff0080,#c000a0)',
  'aurora-ocean': 'linear-gradient(135deg,#00c0ff,#0040ff,#00ffd0,#0080a0)',
  // Cyberpunk
  'cyber-yellow': 'linear-gradient(135deg,#ffff00,#c0c000,#ffee00,#808000)',
  'cyber-red': 'linear-gradient(135deg,#ff4040,#cc0000,#ff0000,#880000)',
  'cyber-teal': 'linear-gradient(135deg,#00ffc0,#008080,#00e0a0,#006060)',
  // Pastel
  'pastel-pink': 'linear-gradient(135deg,#ffc0e0,#ff80b0,#ffe0f0,#e060a0)',
  'pastel-blue': 'linear-gradient(135deg,#c0e0ff,#80b0ff,#e0f0ff,#60a0e0)',
  'pastel-green': 'linear-gradient(135deg,#c0f0c0,#80d080,#e0ffe0,#60b060)',
  'pastel-lavender': 'linear-gradient(135deg,#e0c0ff,#c080ff,#f0e0ff,#a060e0)',
  'pastel-peach': 'linear-gradient(135deg,#ffd8b0,#ffb070,#ffe8d0,#e09040)',
  // Material
  'material-blue': 'linear-gradient(135deg,#64b5f6,#1565c0,#42a5f5,#0d47a1)',
  'material-red': 'linear-gradient(135deg,#ef9a9a,#c62828,#ef5350,#b71c1c)',
  'material-green': 'linear-gradient(135deg,#a5d6a7,#2e7d32,#66bb6a,#1b5e20)',
  'material-deep-purple': 'linear-gradient(135deg,#ce93d8,#6a1b9a,#ab47bc,#4a148c)',
  // Retro / vintage
  'retro-orange': 'linear-gradient(135deg,#ff8c00,#c04000,#ff6400,#8b2500)',
  'retro-teal': 'linear-gradient(135deg,#00c0b0,#007060,#00e0c0,#004040)',
  'vintage-sepia': 'linear-gradient(135deg,#c8a060,#7a5030,#b08040,#504020)',
  'vintage-green': 'linear-gradient(135deg,#80a858,#3a5828,#68903a,#283818)',
  // Y2K / Memphis
  'y2k-pink': 'linear-gradient(135deg,#ff60ff,#ff00c0,#ff80ff,#c000a0)',
  'memphis-yellow': 'linear-gradient(135deg,#ffee00,#c0a000,#fff000,#807000)',
  'memphis-coral': 'linear-gradient(135deg,#ff7060,#c03020,#ff5040,#902010)',
  // Pixel / 8-bit
  'pixel-green': 'linear-gradient(135deg,#00ff00,#008000,#00e000,#006000)',
  'pixel-purple': 'linear-gradient(135deg,#8000ff,#400080,#6000c0,#200040)',
  // Neutral
  white: 'linear-gradient(135deg,#ffffff,#d0d0d0,#f0f0f0,#b0b0b0)',
  black: 'linear-gradient(135deg,#303030,#080808,#181818,#000000)',
  slate: 'linear-gradient(135deg,#9090a8,#404060,#8080a0,#303050)',
  zinc: 'linear-gradient(135deg,#909090,#404040,#808080,#303030)',
}

// Grouped for expandable picker
const METAL_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Classic', keys: ['chrome', 'gold', 'silver', 'copper', 'bronze', 'platinum', 'titanium', 'iron', 'steel', 'rose-gold', 'obsidian', 'mercury'] },
  { label: 'Neon', keys: ['electric', 'neon-pink', 'neon-green', 'neon-blue', 'neon-purple', 'neon-orange'] },
  { label: 'Aurora', keys: ['aurora', 'aurora-rose', 'aurora-ocean'] },
  { label: 'Cyber', keys: ['cyber-yellow', 'cyber-red', 'cyber-teal'] },
  { label: 'Pastel', keys: ['pastel-pink', 'pastel-blue', 'pastel-green', 'pastel-lavender', 'pastel-peach'] },
  { label: 'Material', keys: ['material-blue', 'material-red', 'material-green', 'material-deep-purple'] },
  { label: 'Retro', keys: ['retro-orange', 'retro-teal', 'vintage-sepia', 'vintage-green'] },
  { label: 'Y2K', keys: ['y2k-pink', 'memphis-yellow', 'memphis-coral'] },
  { label: 'Pixel', keys: ['pixel-green', 'pixel-purple'] },
  { label: 'Neutral', keys: ['white', 'black', 'slate', 'zinc'] },
]

// ── Swatch button ────────────────────────────────────────────────────────────
function Swatch({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  return (
    <button
      title={name}
      onClick={onClick}
      className={`
        w-7 h-7 rounded-md border-2 cursor-pointer transition-all duration-150 shrink-0
        ${active
          ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.35)]'
          : 'border-transparent hover:scale-110 hover:border-[rgba(255,255,255,0.3)]'}
        ${name === 'obsidian' || name === 'black' ? '!border-[rgba(120,140,200,0.4)]' : ''}
      `}
      style={{ background: SWATCH_STYLES[name] ?? '#666' }}
    />
  )
}

// ── Metal Swatch Picker ──────────────────────────────────────────────────────
export function MetalPicker({
  value,
  onChange,
  options,
  compact = false,
}: {
  value: string
  onChange: (v: string) => void
  options?: string[]
  compact?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  // Legacy flat list override
  if (options) {
    return (
      <div className="flex gap-2 flex-wrap">
        {options.map(k => <Swatch key={k} name={k} active={value === k} onClick={() => onChange(k)} />)}
      </div>
    )
  }

  if (compact) {
    const quickKeys = METAL_GROUPS[0].keys.slice(0, 8)
    return (
      <div className="flex gap-1.5 flex-wrap items-center">
        {quickKeys.map(k => <Swatch key={k} name={k} active={value === k} onClick={() => onChange(k)} />)}
        <button
          onClick={() => setExpanded(x => !x)}
          className="w-7 h-7 rounded-md border border-[rgba(120,140,200,0.3)] text-[#7880a0]
            text-[14px] leading-none hover:text-white hover:border-[rgba(74,158,255,0.5)] transition-colors cursor-pointer">
          {expanded ? '−' : '+'}
        </button>
        {expanded && (
          <div className="w-full mt-2 space-y-2">
            {METAL_GROUPS.slice(1).map(g => (
              <div key={g.label}>
                <p className="font-mono text-[9px] tracking-[2px] text-[#7880a0] uppercase mb-1">{g.label}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {g.keys.map(k => <Swatch key={k} name={k} active={value === k} onClick={() => onChange(k)} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Full grouped picker
  return (
    <div className="space-y-3">
      {METAL_GROUPS.map(g => (
        <div key={g.label}>
          <p className="font-mono text-[9px] tracking-[2px] text-[#7880a0] uppercase mb-1.5">{g.label}</p>
          <div className="flex gap-1.5 flex-wrap">
            {g.keys.map(k => <Swatch key={k} name={k} active={value === k} onClick={() => onChange(k)} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Gradient Color Input ──────────────────────────────────────────────────────
/**
 * Comma-separated hex/CSS colors → feeds the `colors` param of all v3 renderers.
 * e.g. "#ff0000,#ff8800,#ffff00"
 */
export function GradientInput({
  value,
  onChange,
  label = 'Custom Gradient Colors',
}: {
  value: string
  onChange: (v: string) => void
  label?: string
}) {
  const stops = value.split(',').map(s => s.trim()).filter(Boolean)
  const preview = stops.length >= 2
    ? `linear-gradient(90deg,${stops.join(',')})`
    : stops[0] ?? '#444'

  return (
    <div className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="metal-input flex-1"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#ff0000,#0000ff  or  gold,silver"
        />
        {value && (
          <div
            className="w-10 h-9 rounded-md border border-[rgba(120,140,200,0.3)] shrink-0"
            style={{ background: preview }}
          />
        )}
      </div>
      <p className="font-mono text-[10px] text-[#7880a0] mt-1">
        Comma-separated colors · overrides metal swatch
      </p>
    </div>
  )
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────
export function ThemePicker({
  value,
  onChange,
}: {
  value: 'dark' | 'light'
  onChange: (v: 'dark' | 'light') => void
}) {
  return (
    <div className="flex gap-2 mb-5">
      {(['dark', 'light'] as const).map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 py-1.5 font-mono text-[11px] tracking-[1.5px] uppercase rounded-md border
            transition-all duration-150 cursor-pointer
            ${value === t
              ? 'border-[rgba(74,158,255,0.6)] bg-[rgba(74,158,255,0.12)] text-[#4a9eff]'
              : 'border-[rgba(120,140,200,0.2)] text-[#7880a0] hover:text-[#e0e4f0]'}`}
        >
          {t === 'dark' ? '◑ Dark' : '○ Light'}
        </button>
      ))}
    </div>
  )
}

// ── Gradient Angle Slider ─────────────────────────────────────────────────────
export function AngleField({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <FieldLabel>Gradient Angle</FieldLabel>
        <span className="font-mono text-[12px] text-[#4a9eff]">{value}°</span>
      </div>
      <input
        type="range" min={0} max={360} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

// ── Select Field ─────────────────────────────────────────────────────────────
export function SelectField({
  label, value, onChange, options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: (string | { value: string; label: string })[]
}) {
  return (
    <div className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <select
        className="metal-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value
          const lbl = typeof o === 'string' ? o : o.label
          return <option key={val} value={val}>{lbl}</option>
        })}
      </select>
    </div>
  )
}

// ── Text Input Field ──────────────────────────────────────────────────────────
export function TextField({
  label, value, onChange, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <input
        className="metal-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

// ── Code Block with Copy ──────────────────────────────────────────────────────
export function CodeBlock({ code, id }: { code: string; id?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code).catch(() => { })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mt-4 code-block">
      <button
        onClick={copy}
        className={`
          absolute top-3 right-3 font-mono text-[10px] tracking-[1.5px] uppercase
          px-3 py-1.5 rounded border cursor-pointer transition-all duration-150
          ${copied
            ? 'bg-[rgba(57,255,20,0.15)] border-[rgba(57,255,20,0.4)] text-[#39ff14]'
            : 'bg-[rgba(74,158,255,0.1)] border-[rgba(74,158,255,0.3)] text-[#4a9eff] hover:bg-[rgba(74,158,255,0.2)]'}
        `}
      >
        {copied ? '✓ COPIED' : 'COPY'}
      </button>
      <pre className="pr-20 overflow-x-auto text-[#7aafff] text-[12px] leading-[1.9]">{code}</pre>
    </div>
  )
}

// ── Preview Box ──────────────────────────────────────────────────────────────
export function PreviewBox({
  children,
  minHeight = 180,
}: {
  children: React.ReactNode
  minHeight?: number
}) {
  return (
    <div
      className="rounded-xl border border-[rgba(120,140,200,0.12)] flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        background: '#050508',
        minHeight,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </div>
  )
}

// ── Builder Layout ───────────────────────────────────────────────────────────
export function BuilderGrid({
  controls,
  preview,
}: {
  controls: React.ReactNode
  preview: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="metal-card p-7">{controls}</div>
      <div className="flex flex-col gap-4">{preview}</div>
    </div>
  )
}

// ── Range Slider ─────────────────────────────────────────────────────────────
export function RangeField({
  label, id, min, max, value, onChange, unit = 'px',
}: {
  label: string; id: string; min: number; max: number
  value: number; onChange: (v: number) => void; unit?: string
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="font-mono text-[12px] text-[#4a9eff]">{value}{unit}</span>
      </div>
      <input
        type="range" id={id} min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

// ── Add to README button ──────────────────────────────────────────────────────
export function AddButton({ onClick, label = '+ Add to README' }: { onClick: () => void; label?: string }) {
  const [added, setAdded] = useState(false)
  const handle = () => {
    onClick()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  return (
    <button
      onClick={handle}
      className={`
        btn-ghost px-5 py-2 rounded-md text-[13px] cursor-pointer
        ${added ? '!text-[#39ff14] !border-[rgba(57,255,20,0.4)]' : ''}
      `}
    >
      {added ? '✓ Added' : label}
    </button>
  )
}

export { METAL_GROUPS }