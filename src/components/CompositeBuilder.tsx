'use client'

import { useState } from 'react'
import {
    FieldLabel, CodeBlock, PreviewBox, BuilderGrid, SectionHeader,
    RangeField, SelectField, TextField, AddButton,
} from './ui'
import { useCompositeCart } from '../lib/compositeCart'

const BASE_URL = 'https://readmeforge.natrajx.in'

export default function CompositeBuilder({ onAdd }: { onAdd: (code: string) => void }) {
    const { items, removeItem, moveItem, updateItemSize, clearCart } = useCompositeCart()

    const [layout, setLayout] = useState('grid')
    const [cols, setCols] = useState(3)
    const [gap, setGap] = useState(16)
    const [padding, setPadding] = useState(16)
    const [uniform, setUniform] = useState(false)
    const [cellWidth, setCellWidth] = useState(220)
    const [cellHeight, setCellHeight] = useState(170)
    const [title, setTitle] = useState('')
    const [background, setBackground] = useState('')
    const [showGridLines, setShowGridLines] = useState(layout === 'table')

    function buildUrl(base = false) {
        const p = new URLSearchParams({ layout })
        if (layout === 'grid') p.set('cols', String(cols))
        if (layout !== 'free') p.set('gap', String(gap))
        p.set('padding', String(padding))
        if (title) p.set('title', title)
        if (background) p.set('background', background)
        if (uniform) { p.set('cellWidth', String(cellWidth)); p.set('cellHeight', String(cellHeight)) }
        p.set('showGridLines', String(showGridLines))
        p.set('cards', JSON.stringify(items.map(i => ({
            type: i.type, params: i.params, width: i.width, height: i.height,
        }))))
        return `${base ? BASE_URL : ''}/api/composite?${p}`
    }

    const markdown = `![Composite](${buildUrl(true)})`
    const previewUrl = items.length > 0 ? buildUrl() : ''

    if (items.length === 0) {
        return (
            <div>
                <SectionHeader tag="// component_type: composite" title="COMPOSITE BUILDER" />
                <div className="rounded-xl border border-[rgba(120,140,200,0.15)] bg-[rgba(120,140,200,0.03)]
          p-12 text-center">
                    <p className="text-[40px] mb-4 opacity-40">⊞</p>
                    <p className="font-mono text-[13px] text-[#7880a0] mb-2">Your composite cart is empty.</p>
                    <p className="font-mono text-[11px] text-[#5a6080]">
                        Go to any component tab, configure it the way you want, then hit{' '}
                        <span className="text-[#4a9eff]">+ Composite</span> to add it here.
                        Come back to arrange everything into one combined image.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <SectionHeader tag="// component_type: composite" title="COMPOSITE BUILDER" />
            <BuilderGrid
                controls={<>
                    {/* ── Cart items ─────────────────────────────────────────────── */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-mono text-[10px] tracking-[2px] text-[#4a9eff] uppercase">
                // Cart ({items.length})
                            </p>
                            <button onClick={clearCart}
                                className="font-mono text-[10px] text-[#7880a0] hover:text-[#ff6060] transition-colors">
                                clear all
                            </button>
                        </div>
                        <div className="space-y-2">
                            {items.map((item, i) => (
                                <div key={item.id}
                                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[rgba(120,140,200,0.15)]
                    bg-[rgba(120,140,200,0.03)]">
                                    <div className="flex flex-col gap-0.5">
                                        <button disabled={i === 0} onClick={() => moveItem(item.id, 'up')}
                                            className="w-5 h-5 flex items-center justify-center rounded text-[10px]
                        text-[#7880a0] hover:text-[#e0e4f0] disabled:opacity-20 disabled:cursor-not-allowed">▲</button>
                                        <button disabled={i === items.length - 1} onClick={() => moveItem(item.id, 'down')}
                                            className="w-5 h-5 flex items-center justify-center rounded text-[10px]
                        text-[#7880a0] hover:text-[#e0e4f0] disabled:opacity-20 disabled:cursor-not-allowed">▼</button>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[11px] text-[#e0e4f0] truncate">{item.label}</p>
                                        <p className="font-mono text-[10px] text-[#5a6080]">{item.type} · {item.width}×{item.height}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)}
                                        className="w-6 h-6 flex items-center justify-center rounded text-[13px]
                      text-[#7880a0] hover:text-[#ff6060] hover:bg-[rgba(255,60,60,0.08)] transition-colors">
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Layout ─────────────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Layout" value={layout} onChange={v => { setLayout(v); setShowGridLines(v === 'table') }}
                            options={['grid', 'row', 'column', 'table', 'free']} />
                        {(layout === 'grid') && (
                            <RangeField label="Columns" id="cols" min={1} max={Math.max(2, items.length)} value={cols} onChange={setCols} />
                        )}
                    </div>

                    {layout !== 'free' && (
                        <div className="grid grid-cols-2 gap-4">
                            <RangeField label="Gap" id="gap" min={0} max={60} value={gap} onChange={setGap} />
                            <RangeField label="Padding" id="pad" min={0} max={60} value={padding} onChange={setPadding} />
                        </div>
                    )}
                    {layout === 'free' && (
                        <div className="mb-2 p-2.5 rounded border border-[rgba(240,190,50,0.2)] bg-[rgba(240,190,50,0.04)]">
                            <p className="font-mono text-[10px] text-[#f0c030] leading-[1.8]">
                                'free' layout uses x/y positions per card. Set those directly in the generated
                                markdown's cards JSON if you need pixel-precise placement.
                            </p>
                        </div>
                    )}

                    {layout !== 'free' && (
                        <label className="flex items-center gap-3 cursor-pointer mb-5 group">
                            <input type="checkbox" checked={uniform} onChange={e => setUniform(e.target.checked)}
                                className="accent-[#4a9eff] w-4 h-4" />
                            <span className="font-mono text-[12px] text-[#7880a0] group-hover:text-[#e0e4f0] transition-colors">
                                Force uniform cell size (scales every card to fit)
                            </span>
                        </label>
                    )}
                    {uniform && layout !== 'free' && (
                        <div className="grid grid-cols-2 gap-4">
                            <RangeField label="Cell Width" id="cw" min={100} max={500} value={cellWidth} onChange={setCellWidth} />
                            <RangeField label="Cell Height" id="ch" min={80} max={400} value={cellHeight} onChange={setCellHeight} />
                        </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer mb-5 group">
                        <input type="checkbox" checked={showGridLines} onChange={e => setShowGridLines(e.target.checked)}
                            className="accent-[#4a9eff] w-4 h-4" />
                        <span className="font-mono text-[12px] text-[#7880a0] group-hover:text-[#e0e4f0] transition-colors">
                            Show grid lines (table look)
                        </span>
                    </label>

                    <TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. My GitHub Stats" />
                    <div className="mb-5">
                        <FieldLabel>Background <span className="normal-case opacity-60">(optional hex, blank = transparent)</span></FieldLabel>
                        <input className="metal-input" value={background} onChange={e => setBackground(e.target.value)} placeholder="#0a0a12" />
                    </div>

                    <div className="flex gap-3">
                        <AddButton onClick={() => onAdd(markdown)} />
                    </div>
                </>}
                preview={<>
                    <PreviewBox>
                        {previewUrl && <img src={previewUrl} alt="Composite preview" className="max-w-full" />}
                    </PreviewBox>
                    <CodeBlock code={markdown} />
                    <p className="font-mono text-[10px] text-[#5a6080] mt-2">
                        {items.length} component{items.length !== 1 ? 's' : ''} combined into one endpoint.
                    </p>
                </>}
            />
        </div>
    )
}