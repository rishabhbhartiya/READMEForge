'use client'

import { useState } from 'react'
import { FieldLabel, MetalPicker, CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField, AddButton } from '../ui'

const SHAPES = ['wave','wave-bottom','rect','shark','slice','egg','cylinder','diagonal','venom']
const ANIMATIONS = ['none','fadeIn','shimmer','glow','scan','twinkling']
const ALIGNS = ['left','center','right']

export default function BannerBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [text, setText] = useState('Hello, World!')
  const [subtext, setSubtext] = useState('Full-Stack Developer · Open Source')
  const [metal, setMetal] = useState('chrome')
  const [shape, setShape] = useState('wave')
  const [height, setHeight] = useState(200)
  const [width, setWidth] = useState(900)
  const [anim, setAnim] = useState('none')
  const [align, setAlign] = useState('center')
  const [section, setSection] = useState<'header'|'footer'>('header')

  const buildUrl = (base = 'https://metal-forage.vercel.app') =>
    `${base}/api/banner?text=${encodeURIComponent(text)}&subtext=${encodeURIComponent(subtext)}&metal=${metal}&type=${shape}&height=${height}&width=${width}&animation=${anim}&align=${align}&section=${section}`

  const markdown = `![Banner](${buildUrl()})`
  const previewUrl = buildUrl('')   // relative — works in dev

  return (
    <div>
      <SectionHeader tag="// component_type: banner" title="METALLIC BANNER GENERATOR" />
      <BuilderGrid
        controls={
          <>
            <div className="mb-5">
              <FieldLabel>Banner Text</FieldLabel>
              <input className="metal-input" value={text} onChange={e => setText(e.target.value)} placeholder="Your text here"/>
            </div>
            <div className="mb-5">
              <FieldLabel>Subtext / Tagline</FieldLabel>
              <input className="metal-input" value={subtext} onChange={e => setSubtext(e.target.value)} placeholder="Optional subtext"/>
            </div>

            <div className="mb-5">
              <FieldLabel>Metal Finish</FieldLabel>
              <MetalPicker value={metal} onChange={setMetal}/>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <FieldLabel>Shape</FieldLabel>
                <select className="metal-select" value={shape} onChange={e => setShape(e.target.value)}>
                  {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Animation</FieldLabel>
                <select className="metal-select" value={anim} onChange={e => setAnim(e.target.value)}>
                  {ANIMATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <FieldLabel>Text Align</FieldLabel>
                <select className="metal-select" value={align} onChange={e => setAlign(e.target.value)}>
                  {ALIGNS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Section</FieldLabel>
                <select className="metal-select" value={section} onChange={e => setSection(e.target.value as 'header'|'footer')}>
                  <option value="header">Header</option>
                  <option value="footer">Footer (flipped)</option>
                </select>
              </div>
            </div>

            <RangeField label="Height" id="bh" min={80} max={400} value={height} onChange={setHeight}/>
            <RangeField label="Width"  id="bw" min={300} max={1200} value={width} onChange={setWidth}/>

            <div className="flex gap-3 mt-2">
              <button className="btn-chrome px-5 py-2 rounded-md text-sm flex-1 cursor-pointer">
                ⚡ Preview
              </button>
              <AddButton onClick={() => onAdd(markdown)}/>
            </div>
          </>
        }
        preview={
          <>
            <PreviewBox minHeight={height + 40}>
              {/* In a real deployment this renders via the API route */}
              <img
                src={`/api/banner?text=${encodeURIComponent(text)}&subtext=${encodeURIComponent(subtext)}&metal=${metal}&type=${shape}&height=${height}&width=${Math.min(width,860)}&animation=${anim}&align=${align}&section=${section}`}
                alt="Banner preview"
                className="max-w-full rounded-lg"
                style={{ maxHeight: height + 20 }}
              />
            </PreviewBox>
            <CodeBlock code={markdown}/>
            <div className="font-mono text-[11px] text-[#7880a0] leading-[1.8]">
              <p className="text-[#4a9eff] mb-1">// Available params:</p>
              <p>text · subtext · metal · type · height · width</p>
              <p>animation · align · section · reversal · fontSize</p>
            </div>
          </>
        }
      />
    </div>
  )
}
