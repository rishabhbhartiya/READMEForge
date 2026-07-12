'use client'

import { useState } from 'react'
import {
    FieldLabel, MetalPicker, GradientInput, AngleField,
    CodeBlock, PreviewBox, BuilderGrid, SectionHeader, RangeField,
    SelectField, TextField, AddButton,
} from '../ui'
import { AddToCompositeButton } from '../CompositeWidgets'

const BASE_URL = 'https://readmeforge.natrajx.in'
const STAT_OPTIONS = ['repos', 'stars', 'followers', 'forks']
const DIMENSION_OPTIONS = ['2d', '3d']
const FONT_OPTIONS = ['sans', 'serif', 'mono', 'display', 'rounded']

// Shared typography block reused by every builder below
function TypographyControls({
    fontFamily, setFontFamily, textColor, setTextColor, fontScale, setFontScale,
}: {
    fontFamily: string; setFontFamily: (v: string) => void
    textColor: string; setTextColor: (v: string) => void
    fontScale: number; setFontScale: (v: number) => void
}) {
    return (
        <div className="mb-5">
            <FieldLabel>Typography</FieldLabel>
            <div className="grid grid-cols-2 gap-4 mb-3">
                <SelectField label="Font" value={fontFamily} onChange={setFontFamily} options={FONT_OPTIONS} />
                <div>
                    <label className="block font-mono text-[11px] text-[#7880a0] mb-1.5">Text Color</label>
                    <input type="color" value={textColor || '#ffffff'} onChange={e => setTextColor(e.target.value)}
                        className="w-full h-9 rounded-md border border-white/10 bg-transparent cursor-pointer" />
                </div>
            </div>
            <RangeField label="Font Scale" id={`fs-${Math.random().toString(36).slice(2, 7)}`}
                min={60} max={180} value={Math.round(fontScale * 100)}
                onChange={v => setFontScale(v / 100)} unit="%" />
            {textColor && (
                <button onClick={() => setTextColor('')}
                    className="text-[11px] font-mono text-[#7880a0] hover:text-[#e0e4f0] underline">
                    reset to theme color
                </button>
            )}
        </div>
    )
}

// ─── NEO-BRUTALISM CARD BUILDER ──────────────────────────────────────────────
const BRUTAL_THEMES = ['yellow', 'pink', 'cyan', 'lime', 'orange', 'white', 'violet', 'red', 'blue', 'mono', 'teal', 'indigo', 'coral', 'silver']
const BRUTAL_STYLES = ['card', 'block', 'sticker', 'tag']
const BRUTAL_PATTERNS = ['none', 'dots', 'stripes', 'grid', 'cross']

export function NeoBrutalCardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
    const [username, setUsername] = useState('')
    const [stat, setStat] = useState('repos')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [icon, setIcon] = useState('')
    const [brutalTheme, setBrutalTheme] = useState('yellow')
    const [pattern, setPattern] = useState('dots')
    const [style, setStyle] = useState('card')
    const [dimension, setDimension] = useState('2d')
    const [metal, setMetal] = useState('')
    const [colors, setColors] = useState('')
    const [angle, setAngle] = useState(135)
    const [width, setWidth] = useState(220)
    const [height, setHeight] = useState(170)
    const [shadowOffset, setShadowOffset] = useState(8)
    const [borderWidth, setBorderWidth] = useState(4)
    const [depth, setDepth] = useState(16)
    const [rotate, setRotate] = useState(0)
    const [linkUrl, setLinkUrl] = useState('')
    const [fontFamily, setFontFamily] = useState('sans')
    const [textColor, setTextColor] = useState('')
    const [fontScale, setFontScale] = useState(1)

    function buildParams(base = false) {
        const p = new URLSearchParams({
            brutalTheme, pattern, style, dimension,
            width: String(width), height: String(height),
        })
        if (dimension === '3d') p.set('depth', String(depth))
        else { p.set('shadowOffset', String(shadowOffset)); p.set('borderWidth', String(borderWidth)) }
        if (username) { p.set('username', username); p.set('stat', stat) }
        if (title) p.set('title', title)
        if (value) p.set('value', value)
        if (subtitle) p.set('subtitle', subtitle)
        if (icon) p.set('icon', icon)
        if (metal) p.set('metal', metal)
        if (colors) p.set('colors', colors)
        if (angle !== 135) p.set('angle', String(angle))
        if (rotate !== 0) p.set('rotate', String(rotate))
        if (linkUrl) p.set('linkUrl', linkUrl)
        if (fontFamily !== 'sans') p.set('fontFamily', fontFamily)
        if (textColor) p.set('textColor', textColor)
        if (fontScale !== 1) p.set('fontScale', String(fontScale))
        return `${base ? BASE_URL : ''}/api/card-neobrutalism?${p}`
    }

    const rawMarkdown = `![${title || 'Card'}](${buildParams(true)})`
    const markdown = linkUrl ? `[${rawMarkdown}](${linkUrl})` : rawMarkdown

    return (
        <div>
            <SectionHeader tag="// component_type: neo_brutalism_card" title="NEO-BRUTALISM CARDS" />
            <BuilderGrid
                controls={<>
                    <TextField label="GitHub Username (optional — leave blank for a fully custom card)"
                        value={username} onChange={setUsername} placeholder="e.g. octocat" />
                    {username && <SelectField label="Stat" value={stat} onChange={setStat} options={STAT_OPTIONS} />}

                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. Repositories" />
                        <TextField label="Value (optional)" value={value} onChange={setValue} placeholder="e.g. 42" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Subtitle (optional)" value={subtitle} onChange={setSubtitle} placeholder="e.g. Public repos" />
                        <TextField label="Icon (optional)" value={icon} onChange={setIcon} placeholder="◈" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Theme" value={brutalTheme} onChange={setBrutalTheme} options={BRUTAL_THEMES} />
                        <SelectField label="Pattern" value={pattern} onChange={setPattern} options={BRUTAL_PATTERNS} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Style" value={style} onChange={setStyle} options={BRUTAL_STYLES} />
                        <SelectField label="Dimension" value={dimension} onChange={setDimension} options={DIMENSION_OPTIONS} />
                    </div>

                    <TypographyControls fontFamily={fontFamily} setFontFamily={setFontFamily}
                        textColor={textColor} setTextColor={setTextColor}
                        fontScale={fontScale} setFontScale={setFontScale} />

                    <div className="mb-5">
                        <FieldLabel>Metal / Gradient Accent (optional — replaces the theme color)</FieldLabel>
                        <MetalPicker value={metal} onChange={setMetal} compact />
                    </div>
                    <GradientInput value={colors} onChange={setColors} />
                    {colors && <AngleField value={angle} onChange={setAngle} />}

                    <div className="grid grid-cols-2 gap-4">
                        <RangeField label="Width" id="nb-w" min={120} max={600} value={width} onChange={setWidth} />
                        <RangeField label="Height" id="nb-h" min={80} max={400} value={height} onChange={setHeight} />
                    </div>

                    {dimension === '2d' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <RangeField label="Shadow Offset" id="nb-so" min={2} max={20} value={shadowOffset} onChange={setShadowOffset} />
                            <RangeField label="Border Width" id="nb-bw" min={2} max={10} value={borderWidth} onChange={setBorderWidth} />
                        </div>
                    ) : (
                        <RangeField label="Extrusion Depth" id="nb-depth" min={6} max={32} value={depth} onChange={setDepth} />
                    )}
                    <RangeField label="Sticker Tilt" id="nb-rot" min={-15} max={15} value={rotate} onChange={setRotate} unit="°" />

                    <TextField label="Link URL (optional)" value={linkUrl} onChange={setLinkUrl} placeholder="https://github.com/you" />

                    <div className="flex gap-3">
                        <AddButton onClick={() => onAdd(markdown)} />
                        <AddToCompositeButton type="card-neobrutalism" label={title || 'Neo-brutal card'}
                            url={buildParams(true)} width={width} height={height} />
                    </div>
                </>}
                preview={<>
                    <PreviewBox>
                        <img src={buildParams()} alt="Neo-brutalism card preview" className="max-w-full" />
                    </PreviewBox>
                    <CodeBlock code={markdown} />
                </>}
            />
        </div>
    )
}

// ─── CLAYMORPHISM CARD BUILDER ───────────────────────────────────────────────
const CLAY_THEMES = ['blue', 'pink', 'mint', 'lavender', 'peach', 'sky', 'coral', 'butter', 'rose', 'sage', 'sand', 'periwinkle']
const CLAY_STYLES = ['card', 'blob', 'panel']

export function ClayCardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
    const [username, setUsername] = useState('')
    const [stat, setStat] = useState('repos')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [icon, setIcon] = useState('')
    const [clayTheme, setClayTheme] = useState('blue')
    const [style, setStyle] = useState('card')
    const [dimension, setDimension] = useState('2d')
    const [metal, setMetal] = useState('')
    const [colors, setColors] = useState('')
    const [angle, setAngle] = useState(135)
    const [width, setWidth] = useState(220)
    const [height, setHeight] = useState(170)
    const [puff, setPuff] = useState(60)
    const [linkUrl, setLinkUrl] = useState('')
    const [fontFamily, setFontFamily] = useState('rounded')
    const [textColor, setTextColor] = useState('')
    const [fontScale, setFontScale] = useState(1)

    function buildParams(base = false) {
        const p = new URLSearchParams({
            clayTheme, style, dimension,
            width: String(width), height: String(height), puff: String(puff),
        })
        if (username) { p.set('username', username); p.set('stat', stat) }
        if (title) p.set('title', title)
        if (value) p.set('value', value)
        if (subtitle) p.set('subtitle', subtitle)
        if (icon) p.set('icon', icon)
        if (metal) p.set('metal', metal)
        if (colors) p.set('colors', colors)
        if (angle !== 135) p.set('angle', String(angle))
        if (linkUrl) p.set('linkUrl', linkUrl)
        if (fontFamily !== 'rounded') p.set('fontFamily', fontFamily)
        if (textColor) p.set('textColor', textColor)
        if (fontScale !== 1) p.set('fontScale', String(fontScale))
        return `${base ? BASE_URL : ''}/api/card-clay?${p}`
    }

    const rawMarkdown = `![${title || 'Card'}](${buildParams(true)})`
    const markdown = linkUrl ? `[${rawMarkdown}](${linkUrl})` : rawMarkdown

    return (
        <div>
            <SectionHeader tag="// component_type: claymorphism_card" title="CLAYMORPHIC CARDS" />
            <BuilderGrid
                controls={<>
                    <TextField label="GitHub Username (optional — leave blank for a fully custom card)"
                        value={username} onChange={setUsername} placeholder="e.g. octocat" />
                    {username && <SelectField label="Stat" value={stat} onChange={setStat} options={STAT_OPTIONS} />}

                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. Repositories" />
                        <TextField label="Value (optional)" value={value} onChange={setValue} placeholder="e.g. 42" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Subtitle (optional)" value={subtitle} onChange={setSubtitle} placeholder="e.g. Public repos" />
                        <TextField label="Icon (optional)" value={icon} onChange={setIcon} placeholder="◈" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Theme" value={clayTheme} onChange={setClayTheme} options={CLAY_THEMES} />
                        <SelectField label="Style" value={style} onChange={setStyle} options={CLAY_STYLES} />
                    </div>
                    <SelectField label="Dimension" value={dimension} onChange={setDimension} options={DIMENSION_OPTIONS} />

                    <TypographyControls fontFamily={fontFamily} setFontFamily={setFontFamily}
                        textColor={textColor} setTextColor={setTextColor}
                        fontScale={fontScale} setFontScale={setFontScale} />

                    <div className="mb-5">
                        <FieldLabel>Metal / Gradient Accent (optional — replaces the theme color)</FieldLabel>
                        <MetalPicker value={metal} onChange={setMetal} compact />
                    </div>
                    <GradientInput value={colors} onChange={setColors} />
                    {colors && <AngleField value={angle} onChange={setAngle} />}

                    <div className="grid grid-cols-2 gap-4">
                        <RangeField label="Width" id="cl-w" min={120} max={600} value={width} onChange={setWidth} />
                        <RangeField label="Height" id="cl-h" min={80} max={400} value={height} onChange={setHeight} />
                    </div>
                    <RangeField label="Puffiness" id="cl-puff" min={0} max={100} value={puff} onChange={setPuff} unit="%" />

                    <TextField label="Link URL (optional)" value={linkUrl} onChange={setLinkUrl} placeholder="https://github.com/you" />

                    <div className="flex gap-3">
                        <AddButton onClick={() => onAdd(markdown)} />
                        <AddToCompositeButton type="card-clay" label={title || 'Clay card'}
                            url={buildParams(true)} width={width} height={height} />
                    </div>
                </>}
                preview={<>
                    <PreviewBox>
                        <img src={buildParams()} alt="Clay card preview" className="max-w-full" />
                    </PreviewBox>
                    <CodeBlock code={markdown} />
                </>}
            />
        </div>
    )
}

// ─── GLOWMORPHISM CARD BUILDER ───────────────────────────────────────────────
const GLOW_THEMES = ['cyan', 'magenta', 'purple', 'green', 'orange', 'blue', 'red', 'rainbow', 'lime', 'teal', 'gold', 'ice']
const GLOW_STYLES = ['card', 'outline', 'beam']

export function GlowCardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
    const [username, setUsername] = useState('')
    const [stat, setStat] = useState('repos')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [icon, setIcon] = useState('')
    const [glowTheme, setGlowTheme] = useState('cyan')
    const [style, setStyle] = useState('card')
    const [dimension, setDimension] = useState('2d')
    const [metal, setMetal] = useState('')
    const [colors, setColors] = useState('')
    const [angle, setAngle] = useState(135)
    const [width, setWidth] = useState(220)
    const [height, setHeight] = useState(170)
    const [intensity, setIntensity] = useState(65)
    const [pulse, setPulse] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [fontFamily, setFontFamily] = useState('display')
    const [textColor, setTextColor] = useState('')
    const [fontScale, setFontScale] = useState(1)

    function buildParams(base = false) {
        const p = new URLSearchParams({
            glowTheme, style, dimension,
            width: String(width), height: String(height), intensity: String(intensity),
        })
        if (username) { p.set('username', username); p.set('stat', stat) }
        if (title) p.set('title', title)
        if (value) p.set('value', value)
        if (subtitle) p.set('subtitle', subtitle)
        if (icon) p.set('icon', icon)
        if (metal) p.set('metal', metal)
        if (colors) p.set('colors', colors)
        if (angle !== 135) p.set('angle', String(angle))
        if (pulse) p.set('pulse', 'true')
        if (linkUrl) p.set('linkUrl', linkUrl)
        if (fontFamily !== 'display') p.set('fontFamily', fontFamily)
        if (textColor) p.set('textColor', textColor)
        if (fontScale !== 1) p.set('fontScale', String(fontScale))
        return `${base ? BASE_URL : ''}/api/card-glow?${p}`
    }

    const rawMarkdown = `![${title || 'Card'}](${buildParams(true)})`
    const markdown = linkUrl ? `[${rawMarkdown}](${linkUrl})` : rawMarkdown

    return (
        <div>
            <SectionHeader tag="// component_type: glowmorphism_card" title="GLOWMORPHIC CARDS" />
            <BuilderGrid
                controls={<>
                    <TextField label="GitHub Username (optional — leave blank for a fully custom card)"
                        value={username} onChange={setUsername} placeholder="e.g. octocat" />
                    {username && <SelectField label="Stat" value={stat} onChange={setStat} options={STAT_OPTIONS} />}

                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. Repositories" />
                        <TextField label="Value (optional)" value={value} onChange={setValue} placeholder="e.g. 42" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Subtitle (optional)" value={subtitle} onChange={setSubtitle} placeholder="e.g. Public repos" />
                        <TextField label="Icon (optional)" value={icon} onChange={setIcon} placeholder="◈" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Theme" value={glowTheme} onChange={setGlowTheme} options={GLOW_THEMES} />
                        <SelectField label="Style" value={style} onChange={setStyle} options={GLOW_STYLES} />
                    </div>
                    <SelectField label="Dimension" value={dimension} onChange={setDimension} options={DIMENSION_OPTIONS} />

                    <TypographyControls fontFamily={fontFamily} setFontFamily={setFontFamily}
                        textColor={textColor} setTextColor={setTextColor}
                        fontScale={fontScale} setFontScale={setFontScale} />

                    <div className="mb-5">
                        <FieldLabel>Metal / Gradient Accent (optional — drives the border + glow color)</FieldLabel>
                        <MetalPicker value={metal} onChange={setMetal} compact />
                    </div>
                    <GradientInput value={colors} onChange={setColors} />
                    {colors && <AngleField value={angle} onChange={setAngle} />}

                    <div className="grid grid-cols-2 gap-4">
                        <RangeField label="Width" id="gl-w" min={120} max={600} value={width} onChange={setWidth} />
                        <RangeField label="Height" id="gl-h" min={80} max={400} value={height} onChange={setHeight} />
                    </div>
                    <RangeField label="Glow Intensity" id="gl-int" min={10} max={100} value={intensity} onChange={setIntensity} unit="%" />

                    <label className="flex items-center gap-3 cursor-pointer mb-5 group">
                        <input type="checkbox" checked={pulse} onChange={e => setPulse(e.target.checked)}
                            className="accent-[#4a9eff] w-4 h-4" />
                        <span className="font-mono text-[12px] text-[#7880a0] group-hover:text-[#e0e4f0] transition-colors">
                            Animated border pulse
                        </span>
                    </label>

                    <TextField label="Link URL (optional)" value={linkUrl} onChange={setLinkUrl} placeholder="https://github.com/you" />

                    <div className="flex gap-3">
                        <AddButton onClick={() => onAdd(markdown)} />
                        <AddToCompositeButton type="card-glow" label={title || 'Glow card'}
                            url={buildParams(true)} width={width} height={height} />
                    </div>
                </>}
                preview={<>
                    <PreviewBox>
                        <img src={buildParams()} alt="Glow card preview" className="max-w-full" />
                    </PreviewBox>
                    <CodeBlock code={markdown} />
                </>}
            />
        </div>
    )
}

// ─── SKEUOMORPHISM CARD BUILDER ──────────────────────────────────────────────
const SKEUO_THEMES = [
    'leather', 'brushedMetal', 'wood', 'paper', 'carbonFiber', 'glassPlaque', 'denim', 'marble',
    'stone', 'copper', 'canvas', 'satin', 'velvet', 'porcelain', 'rubber', 'lacquer',
]
const SKEUO_STYLES = ['card', 'plaque', 'tag']

export function SkeuoCardBuilder({ onAdd }: { onAdd: (code: string) => void }) {
    const [username, setUsername] = useState('')
    const [stat, setStat] = useState('repos')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [icon, setIcon] = useState('')
    const [skeuoTheme, setSkeuoTheme] = useState('brushedMetal')
    const [style, setStyle] = useState('card')
    const [dimension, setDimension] = useState('2d')
    const [metal, setMetal] = useState('')
    const [colors, setColors] = useState('')
    const [angle, setAngle] = useState(135)
    const [width, setWidth] = useState(220)
    const [height, setHeight] = useState(170)
    const [depth, setDepth] = useState(14)
    const [linkUrl, setLinkUrl] = useState('')
    const [fontFamily, setFontFamily] = useState('serif')
    const [textColor, setTextColor] = useState('')
    const [fontScale, setFontScale] = useState(1)

    function buildParams(base = false) {
        const p = new URLSearchParams({
            skeuoTheme, style, dimension,
            width: String(width), height: String(height),
        })
        if (dimension === '3d') p.set('depth', String(depth))
        if (username) { p.set('username', username); p.set('stat', stat) }
        if (title) p.set('title', title)
        if (value) p.set('value', value)
        if (subtitle) p.set('subtitle', subtitle)
        if (icon) p.set('icon', icon)
        if (metal) p.set('metal', metal)
        if (colors) p.set('colors', colors)
        if (angle !== 135) p.set('angle', String(angle))
        if (linkUrl) p.set('linkUrl', linkUrl)
        if (fontFamily !== 'serif') p.set('fontFamily', fontFamily)
        if (textColor) p.set('textColor', textColor)
        if (fontScale !== 1) p.set('fontScale', String(fontScale))
        return `${base ? BASE_URL : ''}/api/card-skeuo?${p}`
    }

    const rawMarkdown = `![${title || 'Card'}](${buildParams(true)})`
    const markdown = linkUrl ? `[${rawMarkdown}](${linkUrl})` : rawMarkdown

    return (
        <div>
            <SectionHeader tag="// component_type: skeuomorphism_card" title="SKEUOMORPHIC CARDS" />
            <BuilderGrid
                controls={<>
                    <TextField label="GitHub Username (optional — leave blank for a fully custom card)"
                        value={username} onChange={setUsername} placeholder="e.g. octocat" />
                    {username && <SelectField label="Stat" value={stat} onChange={setStat} options={STAT_OPTIONS} />}

                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. Repositories" />
                        <TextField label="Value (optional)" value={value} onChange={setValue} placeholder="e.g. 42" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Subtitle (optional)" value={subtitle} onChange={setSubtitle} placeholder="e.g. Public repos" />
                        <TextField label="Icon (optional)" value={icon} onChange={setIcon} placeholder="◈" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Material" value={skeuoTheme} onChange={setSkeuoTheme} options={SKEUO_THEMES} />
                        <SelectField label="Style" value={style} onChange={setStyle} options={SKEUO_STYLES} />
                    </div>
                    <SelectField label="Dimension" value={dimension} onChange={setDimension} options={DIMENSION_OPTIONS} />

                    <TypographyControls fontFamily={fontFamily} setFontFamily={setFontFamily}
                        textColor={textColor} setTextColor={setTextColor}
                        fontScale={fontScale} setFontScale={setFontScale} />

                    <div className="mb-5">
                        <FieldLabel>Metal / Gradient Accent (optional — tints the material, texture stays visible)</FieldLabel>
                        <MetalPicker value={metal} onChange={setMetal} compact />
                    </div>
                    <GradientInput value={colors} onChange={setColors} />
                    {colors && <AngleField value={angle} onChange={setAngle} />}

                    <div className="grid grid-cols-2 gap-4">
                        <RangeField label="Width" id="sk-w" min={120} max={600} value={width} onChange={setWidth} />
                        <RangeField label="Height" id="sk-h" min={80} max={400} value={height} onChange={setHeight} />
                    </div>
                    {dimension === '3d' && (
                        <RangeField label="Extrusion Depth" id="sk-depth" min={6} max={28} value={depth} onChange={setDepth} />
                    )}

                    <TextField label="Link URL (optional)" value={linkUrl} onChange={setLinkUrl} placeholder="https://github.com/you" />

                    <div className="flex gap-3">
                        <AddButton onClick={() => onAdd(markdown)} />
                        <AddToCompositeButton type="card-skeuo" label={title || 'Skeuomorphic card'}
                            url={buildParams(true)} width={width} height={height} />
                    </div>
                </>}
                preview={<>
                    <PreviewBox>
                        <img src={buildParams()} alt="Skeuomorphic card preview" className="max-w-full" />
                    </PreviewBox>
                    <CodeBlock code={markdown} />
                </>}
            />
        </div>
    )
}