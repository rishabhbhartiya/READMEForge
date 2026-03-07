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

// ── Metal Swatch Picker ──────────────────────────────────────────────────────
const SWATCH_STYLES: Record<string, string> = {
  chrome:   'linear-gradient(135deg,#f0f0f0,#909090,#d8d8d8,#787878)',
  gold:     'linear-gradient(135deg,#fff0a0,#d4a020,#f5d040,#9a7010)',
  'rose-gold': 'linear-gradient(135deg,#ffd0d0,#cc7878,#eea0a0,#a05858)',
  titanium: 'linear-gradient(135deg,#a0b0cc,#4a5f7a,#8090b0,#384a60)',
  copper:   'linear-gradient(135deg,#f0a070,#8b4513,#d0782a,#6b3008)',
  obsidian: 'linear-gradient(135deg,#484858,#1c1c2c,#303040,#101020)',
  electric: 'linear-gradient(135deg,#60ffff,#0050ff,#4000ff,#00d0ff)',
  neon:     'linear-gradient(135deg,#80ff40,#00cc60,#00ff80,#60ff20)',
  blood:    'linear-gradient(135deg,#ff6060,#8b0000,#cc2020,#aa0000)',
  ice:      'linear-gradient(135deg,#e0f8ff,#80c8e8,#c0e8f8,#60a8c8)',
}

export function MetalPicker({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options?: string[]
}) {
  const keys = options ?? Object.keys(SWATCH_STYLES)
  return (
    <div className="flex gap-2 flex-wrap">
      {keys.map(k => (
        <button
          key={k}
          title={k}
          onClick={() => onChange(k)}
          className={`
            w-8 h-8 rounded-md border-2 cursor-pointer transition-all duration-150
            ${value === k
              ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]'
              : 'border-transparent hover:scale-110 hover:border-[rgba(255,255,255,0.3)]'}
            ${k === 'obsidian' ? '!border-[rgba(120,140,200,0.4)]' : ''}
          `}
          style={{ background: SWATCH_STYLES[k] }}
        />
      ))}
    </div>
  )
}

// ── Code Block with Copy ──────────────────────────────────────────────────────
export function CodeBlock({ code, id }: { code: string; id?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code).catch(() => {})
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
export function PreviewBox({ children, minHeight = 180 }: { children: React.ReactNode; minHeight?: number }) {
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
export function BuilderGrid({ controls, preview }: { controls: React.ReactNode; preview: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="metal-card p-7">{controls}</div>
      <div className="flex flex-col gap-4">{preview}</div>
    </div>
  )
}

// ── Range Slider ─────────────────────────────────────────────────────────────
export function RangeField({
  label, id, min, max, value, onChange, unit = 'px'
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
      />
    </div>
  )
}

// ── Add to README button ──────────────────────────────────────────────────────
export function AddButton({ onClick }: { onClick: () => void }) {
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
      {added ? '✓ Added' : '+ Add to README'}
    </button>
  )
}

export { SWATCH_STYLES }
