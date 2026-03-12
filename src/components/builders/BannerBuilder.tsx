'use client'

import { useState } from 'react'
import {
  FieldLabel, MetalPicker, GradientInput, AngleField, ThemePicker,
  CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField,
  SelectField, TextField, AddButton,
} from '../ui'

const SHAPES    = ['wave','flat','diagonal','arch','chevron','egg','venom','wave-bottom','shark','slice','cylinder']
const ANIMATIONS = ['none','shimmer','pulse','fadeIn','scanline','glow','scan','twinkling']
const ALIGNS    = ['left','center','right']
const FONTS     = ['Orbitron','Rajdhani','Share Tech Mono','Arial Black','Georgia']

const BASE_URL = 'https://readmeforge.natrajx.in'

export default function BannerBuilder({ onAdd }: { onAdd: (code: string) => void }) {
  const [text, setText]       = useState('Hello, World!')
  const [subtext, setSubtext] = useState('Full-Stack Developer · Open Source')
  const [metal, setMetal]     = useState('chrome')
  const [colors, setColors]   = useState('')
  const [angle, setAngle]     = useState(135)
  const [theme, setTheme]     = useState<'dark' | 'light'>('dark')
  const [shape, setShape]     = useState('wave')
  const [height, setHeight]   = useState(200)
  const [width, setWidth]     = useState(900)
  const [anim, setAnim]       = useState('none')
  const [align, setAlign]     = useState('center')
  const [section, setSection] = useState<'header' | 'footer'>('header')
  const [font, setFont]       = useState('Orbitron')
  const [bg, setBg]           = useState('')

  function buildParams(w = width) {
    const p = new URLSearchParams({
      text, subtext, metal,
      type: shape,   // route accepts both `type` and `shape`
      height: String(height),
      width: String(w),
      animation: anim,
      align,
      section,
      theme,
      fontFamily: font,
    })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    if (bg) p.set('bg', bg)
    return p.toString()
  }

  const previewUrl = `/api/banner?${buildParams(Math.min(width, 860))}`
  const markdown   = `![Banner](${BASE_URL}/api/banner?${buildParams()})`

  return (
    <div>
      <SectionHeader tag="// component_type: banner" title="METALLIC BANNER GENERATOR"/>
      <BuilderGrid
        controls={<>
          <TextField label="Banner Text"       value={text}    onChange={setText}    placeholder="Your title here"/>
          <TextField label="Subtext / Tagline" value={subtext} onChange={setSubtext} placeholder="Optional subtext"/>

          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme}/>

          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact/>
          </div>

          <GradientInput value={colors} onChange={setColors}/>
          {colors && <AngleField value={angle} onChange={setAngle}/>}

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Shape"     value={shape}   onChange={setShape}   options={SHAPES}/>
            <SelectField label="Animation" value={anim}    onChange={setAnim}    options={ANIMATIONS}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Text Align" value={align} onChange={setAlign} options={ALIGNS}/>
            <SelectField label="Section"    value={section}
              onChange={v => setSection(v as 'header' | 'footer')}
              options={[{ value:'header', label:'Header' }, { value:'footer', label:'Footer (flipped)' }]}/>
          </div>

          <SelectField label="Font Family" value={font} onChange={setFont} options={FONTS}/>

          <div className="mb-5">
            <FieldLabel>Background Override <span className="normal-case opacity-60">(optional hex)</span></FieldLabel>
            <input className="metal-input" value={bg} onChange={e => setBg(e.target.value)} placeholder="#0a0a18"/>
          </div>

          <RangeField label="Height" id="bh" min={80}  max={400}  value={height} onChange={setHeight}/>
          <RangeField label="Width"  id="bw" min={300} max={1200} value={width}  onChange={setWidth}/>

          <div className="flex gap-3 mt-2">
            <AddButton onClick={() => onAdd(markdown)}/>
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={height + 40}>
            <img src={previewUrl} alt="Banner preview" className="max-w-full rounded-lg"
              style={{ maxHeight: height + 20 }}/>
          </PreviewBox>
          <CodeBlock code={markdown}/>
          <div className="font-mono text-[11px] text-[#7880a0] leading-[1.8]">
            <p className="text-[#4a9eff] mb-1">// v3 params:</p>
            <p>text · subtext · metal · colors · angle · shape</p>
            <p>animation · align · section · theme · bg · fontFamily</p>
          </div>
        </>}
      />
    </div>
  )
}
