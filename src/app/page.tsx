// src/app/page.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BannerBuilder from '@/components/builders/BannerBuilder'
import { CardBuilder, ButtonBuilder, BadgeBuilder, DividerBuilder } from '@/components/builders/CardBuilder'
import {
  NeoBrutalCardBuilder, ClayCardBuilder, GlowCardBuilder, SkeuoCardBuilder,
} from '@/components/builders/NewCardsBuilder'
import ShowcaseGrid from '@/components/ShowcaseGrid'
import ReadmeAssembler from '@/components/ReadmeAssembler'
import CompositeBuilder from '@/components/CompositeBuilder'
import { AddToCompositeButton, CompositeCartBadge } from '@/components/CompositeWidgets'
import { CompositeCartProvider } from '@/lib/compositeCart'
import {
  SectionHeader, MetalPicker, FieldLabel, CodeBlock, PreviewBox,
  BuilderGrid, RangeField, AddButton, GradientInput, AngleField,
  ThemePicker, SelectField, TextField,
} from '@/components/ui'

const BASE_URL = 'https://readmeforge.natrajx.in'

const TABS = [
  { id: 'banner', icon: '⬛', label: 'Banners' },
  { id: 'header', icon: '⊞', label: 'Headers' },
  { id: 'footer', icon: '⊟', label: 'Footers' },
  { id: 'card', icon: '◈', label: 'Cards' },
  { id: 'neo', icon: '◑', label: 'Neumorphic' },
  { id: 'glass', icon: '◻', label: 'Glass' },
  { id: 'brutal', icon: '▟', label: 'Neo-Brutal' },
  { id: 'clay', icon: '◍', label: 'Clay' },
  { id: 'glow', icon: '◉', label: 'Glow' },
  { id: 'skeuo', icon: '▦', label: 'Skeuomorphic' },
  { id: 'button', icon: '⬟', label: 'Buttons' },
  { id: 'badge', icon: '◆', label: 'Badges' },
  { id: 'text', icon: 'Ａ', label: 'Text FX' },
  { id: 'progress', icon: '▰', label: 'Progress' },
  { id: 'terminal', icon: '⌨', label: 'Terminal' },
  { id: 'logo', icon: '⬡', label: 'Logos' },
  { id: 'image', icon: '▣', label: 'Frames' },
  { id: 'social', icon: '◈', label: 'Social' },
  { id: 'divider', icon: '─', label: 'Dividers' },
  { id: 'table', icon: '⊞', label: 'Tables' },
  { id: 'composite', icon: '⊕', label: 'Composite' },
  { id: 'showcase', icon: '✦', label: 'Showcase' },
] as const

type TabId = typeof TABS[number]['id']

// ─── Image / GIF note ─────────────────────────────────────────────────────────
function GithubImageNote() {
  return (
    <div className="font-mono text-[11px] p-3 mt-2 leading-[1.9]
      bg-[rgba(74,158,255,0.04)] border border-[rgba(74,158,255,0.15)] rounded-md space-y-1">
      <div>
        <span className="text-[#39ff14] font-bold">✓ App preview:</span>
        <span className="text-[#7880a0]"> The metallic frame SVG is rendered behind your image/GIF using CSS layering — fully animated GIFs supported.</span>
      </div>
      <div>
        <span className="text-[#f0c030] font-bold">⚠ README output:</span>
        <span className="text-[#7880a0]"> GitHub blocks external images inside SVGs. The generated code uses a plain <code>&lt;img&gt;</code> tag — your image/GIF displays correctly but without the metallic frame border.</span>
      </div>
    </div>
  )
}

// ─── Header Builder ───────────────────────────────────────────────────────────
function HeaderBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [name, setName] = useState('John Doe')
  const [title, setTitle] = useState('Full-Stack Developer')
  const [tagline, setTagline] = useState('Building things that matter ✦')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [style, setStyle] = useState('profile')
  const [height, setHeight] = useState(280)

  function buildParams(base = false) {
    const p = new URLSearchParams({ name, title, tagline, metal, style, height: String(height), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/header?${p}`
  }
  const md = `![Header](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: profile_header" title="PROFILE HEADER GENERATOR" />
      <BuilderGrid
        controls={<>
          <TextField label="Your Name" value={name} onChange={setName} />
          <TextField label="Title / Role" value={title} onChange={setTitle} />
          <TextField label="Tagline" value={tagline} onChange={setTagline} />
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <SelectField label="Style" value={style} onChange={setStyle}
            options={['profile', 'minimal', 'cyber', 'terminal', 'hologram']} />
          <RangeField label="Height" id="hh" min={120} max={400} value={height} onChange={setHeight} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="header" label={`Header — ${name}`}
              url={buildParams(true)} width={900} height={height} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={height + 40}>
            <img src={buildParams()} alt="Header preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Footer Builder ───────────────────────────────────────────────────────────
function FooterBuilderUI({ onAdd }: { onAdd: (c: string) => void }) {
  const [text, setText] = useState('Thanks for visiting!')
  const [subtext, setSubtext] = useState('Made with ♦ and ReadmeForge')
  const [links, setLinks] = useState('Twitter,GitHub,LinkedIn')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [style, setStyle] = useState('wave')
  const [height, setHeight] = useState(180)
  const [bg, setBg] = useState('')

  function buildParams(base = false) {
    const p = new URLSearchParams({ text, subtext, links, metal, style, height: String(height), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    if (bg) p.set('bg', bg)
    return `${base ? BASE_URL : ''}/api/footer?${p}`
  }
  const md = `![Footer](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: profile_footer" title="PROFILE FOOTER GENERATOR" />
      <BuilderGrid
        controls={<>
          <TextField label="Main Text" value={text} onChange={setText} />
          <TextField label="Subtext" value={subtext} onChange={setSubtext} />
          <div className="mb-5">
            <FieldLabel>Links <span className="normal-case opacity-60">(comma-separated)</span></FieldLabel>
            <input className="metal-input" value={links} onChange={e => setLinks(e.target.value)}
              placeholder="Twitter,GitHub,LinkedIn" />
          </div>
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <SelectField label="Style" value={style} onChange={setStyle}
            options={['wave', 'minimal', 'cyber', 'credits']} />
          <div className="mb-5">
            <FieldLabel>Background Override <span className="normal-case opacity-60">(optional)</span></FieldLabel>
            <input className="metal-input" value={bg} onChange={e => setBg(e.target.value)} placeholder="#0a0a18" />
          </div>
          <RangeField label="Height" id="fh" min={80} max={300} value={height} onChange={setHeight} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="footer" label={`Footer — ${text}`}
              url={buildParams(true)} width={900} height={height} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={height + 40}>
            <img src={buildParams()} alt="Footer preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Neumorphic Card Builder ──────────────────────────────────────────────────
function NeoCardBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [subtitle, setSub] = useState('')
  const [icon, setIcon] = useState('')
  const [neoTheme, setNeoTheme] = useState('dark')
  const [neoStyle, setNeoStyle] = useState('raised')
  const [border, setBorder] = useState('none')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(160)
  const [linkUrl, setLinkUrl] = useState('')
  const [fontFamily, setFontFamily] = useState('display')
  const [textColor, setTextColor] = useState('')
  const [fontScale, setFontScale] = useState(1)

  function buildParams(base = false) {
    const p = new URLSearchParams({
      neoTheme,
      neoStyle,
      border,
      metal,
      width: String(width), height: String(height),
    })
    if (title) p.set('title', title)
    if (value) p.set('value', value)
    if (subtitle) p.set('subtitle', subtitle)
    if (icon) p.set('icon', icon)
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    if (linkUrl) p.set('linkUrl', linkUrl)
    if (fontFamily !== 'display') p.set('fontFamily', fontFamily)
    if (textColor) p.set('textColor', textColor)
    if (fontScale !== 1) p.set('fontScale', String(fontScale))
    return `${base ? BASE_URL : ''}/api/card-neo?${p}`
  }
  const rawMd = `![${title || 'Card'}](${buildParams(true)})`
  const md = linkUrl ? `[${rawMd}](${linkUrl})` : rawMd

  return (
    <div>
      <SectionHeader tag="// component_type: neumorphic_card" title="NEUMORPHIC CARD" />
      <BuilderGrid
        controls={<>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="col-span-2"><TextField label="Title (optional)" value={title} onChange={setTitle} placeholder="e.g. Commits" /></div>
            <div>
              <FieldLabel>Icon</FieldLabel>
              <input className="metal-input text-center" value={icon} onChange={e => setIcon(e.target.value)} placeholder="◉" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TextField label="Value (optional)" value={value} onChange={setValue} placeholder="e.g. 3,291" />
            <TextField label="Subtitle (optional)" value={subtitle} onChange={setSub} placeholder="e.g. This year" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SelectField label="Neo Theme" value={neoTheme} onChange={setNeoTheme}
              options={['dark', 'light', 'warm', 'cool', 'neon-dark', 'rose', 'forest', 'sunset', 'arctic']} />
            <SelectField label="Style" value={neoStyle} onChange={setNeoStyle}
              options={['raised', 'pressed', 'floating', 'inset', 'outline', 'gradient']} />
          </div>
          <SelectField label="Border" value={border} onChange={setBorder}
            options={['none', 'thin', 'accent', 'glow']} />

          <div className="mb-5 mt-5">
            <FieldLabel>Typography</FieldLabel>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <SelectField label="Font" value={fontFamily} onChange={setFontFamily}
                options={['sans', 'serif', 'mono', 'display', 'rounded']} />
              <div>
                <label className="block font-mono text-[11px] text-[#7880a0] mb-1.5">Text Color</label>
                <input type="color" value={textColor || '#ffffff'} onChange={e => setTextColor(e.target.value)}
                  className="w-full h-9 rounded-md border border-white/10 bg-transparent cursor-pointer" />
              </div>
            </div>
            <RangeField label="Font Scale" id="nc-fs" min={60} max={180}
              value={Math.round(fontScale * 100)} onChange={v => setFontScale(v / 100)} unit="%" />
          </div>

          <div className="mb-5">
            <FieldLabel>Metal Accent</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <div className="grid grid-cols-2 gap-4">
            <RangeField label="Width" id="ncw" min={120} max={400} value={width} onChange={setWidth} />
            <RangeField label="Height" id="nch" min={80} max={300} value={height} onChange={setHeight} />
          </div>

          <TextField label="Link URL (optional)" value={linkUrl} onChange={setLinkUrl} placeholder="https://github.com/you" />

          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="card-neo" label={title || 'Neo card'}
              url={buildParams(true)} width={width} height={height} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={height + 40}>
            <img src={buildParams()} alt="Neo card preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Glass Card Builder ───────────────────────────────────────────────────────
function GlassCardBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [subtitle, setSub] = useState('')
  const [icon, setIcon] = useState('')
  const [glassTheme, setGlassTheme] = useState('dark')
  const [style, setStyle] = useState('card')
  const [border, setBorder] = useState('edge')
  const [metal, setMetal] = useState('electric')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [width, setWidth] = useState(220)
  const [height, setHeight] = useState(170)
  const [username, setUsername] = useState('')
  const [stat, setStat] = useState('repos')
  const [linkUrl, setLinkUrl] = useState('')
  const [fontFamily, setFontFamily] = useState('mono')
  const [textColor, setTextColor] = useState('')
  const [fontScale, setFontScale] = useState(1)

  function buildParams(base = false) {
    const p = new URLSearchParams({
      glassTheme,
      style,
      border,
      metal,
      width: String(width),
      height: String(height),
    })
    if (username.trim()) {
      p.set('username', username.trim())
      p.set('stat', stat)
    }
    // Manual fields always act as overrides — they're independent of username now,
    // and simply omitted (not sent) when left blank, so the renderer skips that row.
    if (title) p.set('title', title)
    if (value) p.set('value', value)
    if (subtitle) p.set('subtitle', subtitle)
    if (icon) p.set('icon', icon)
    if (linkUrl.trim()) p.set('linkUrl', linkUrl.trim())
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    if (fontFamily !== 'mono') p.set('fontFamily', fontFamily)
    if (textColor) p.set('textColor', textColor)
    if (fontScale !== 1) p.set('fontScale', String(fontScale))
    return `${base ? BASE_URL : ''}/api/card-glass?${p}`
  }

  const displayTitle = username.trim()
    ? ({ repos: 'Repositories', stars: 'Stars', followers: 'Followers', forks: 'Forks' } as Record<string, string>)[stat]
    : (title || 'Card')

  const md = linkUrl.trim()
    ? `[![${displayTitle}](${buildParams(true)})](${linkUrl.trim()})`
    : `![${displayTitle}](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: glass_card" title="GLASSMORPHIC CARD" />
      <BuilderGrid
        controls={<>

          {/* ── GitHub live fetch ─────────────────────────────────────────── */}
          <div className="mb-5 p-4 rounded-lg border border-[rgba(0,255,200,0.15)] bg-[rgba(0,255,200,0.03)]">
            <p className="font-mono text-[10px] tracking-[2px] text-[#00ffc8] uppercase mb-3">
              // Live GitHub Stats
            </p>
            <TextField label="GitHub Username (optional — leave blank for a fully custom card)"
              value={username} onChange={setUsername} placeholder="e.g. octocat" />
            {username.trim() && (
              <SelectField label="Stat to display" value={stat} onChange={setStat}
                options={['repos', 'stars', 'followers', 'forks']} />
            )}
            {username.trim() && (
              <p className="font-mono text-[10px] text-[#7880a0] mt-2">
                Title, subtitle &amp; icon are auto-set from GitHub. Fill the fields below to override them.
              </p>
            )}
          </div>

          {/* ── Manual / override fields — all genuinely optional ─────────── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="col-span-2">
              <TextField
                label={username.trim() ? 'Title override (optional)' : 'Title (optional)'}
                value={title} onChange={setTitle} placeholder="e.g. Repositories" />
            </div>
            <div>
              <FieldLabel>Icon</FieldLabel>
              <input className="metal-input text-center" value={icon}
                onChange={e => setIcon(e.target.value)} placeholder="◈" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TextField label={username.trim() ? 'Value override (optional)' : 'Value (optional)'} value={value} onChange={setValue} placeholder="e.g. 42" />
            <TextField label={username.trim() ? 'Subtitle override (optional)' : 'Subtitle (optional)'} value={subtitle} onChange={setSub} placeholder="e.g. Public repos" />
          </div>

          {/* ── Appearance ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SelectField label="Glass Theme" value={glassTheme} onChange={setGlassTheme}
              options={['dark', 'light', 'aurora', 'sunset', 'ocean', 'midnight', 'neon', 'rose', 'forest', 'gold', 'ice', 'void', 'crimson', 'emerald', 'sapphire', 'graphite']} />
            <SelectField label="Style" value={style} onChange={setStyle}
              options={['card', 'pill', 'panel', 'chip', 'ribbon', 'badge']} />
          </div>
          <SelectField label="Border" value={border} onChange={setBorder}
            options={['edge', 'glow', 'minimal', 'ridge', 'double', 'none']} />

          <div className="mb-5 mt-5">
            <FieldLabel>Typography</FieldLabel>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <SelectField label="Font" value={fontFamily} onChange={setFontFamily}
                options={['sans', 'serif', 'mono', 'display', 'rounded']} />
              <div>
                <label className="block font-mono text-[11px] text-[#7880a0] mb-1.5">Text Color</label>
                <input type="color" value={textColor || '#ffffff'} onChange={e => setTextColor(e.target.value)}
                  className="w-full h-9 rounded-md border border-white/10 bg-transparent cursor-pointer" />
              </div>
            </div>
            <RangeField label="Font Scale" id="gc-fs" min={60} max={180}
              value={Math.round(fontScale * 100)} onChange={v => setFontScale(v / 100)} unit="%" />
          </div>

          <div className="mb-5">
            <FieldLabel>Metal Accent</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <RangeField label="Width" id="gcw" min={120} max={400} value={width} onChange={setWidth} />
            <RangeField label="Height" id="gch" min={80} max={300} value={height} onChange={setHeight} />
          </div>

          {/* ── Link URL ──────────────────────────────────────────────────── */}
          <div className="mb-5">
            <FieldLabel>
              Embed Link URL&nbsp;
              <span className="normal-case opacity-60">(optional — makes card clickable)</span>
            </FieldLabel>
            <input
              className="metal-input"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://github.com/yourusername"
            />
            {linkUrl.trim() && (
              <div className="mt-2 p-2.5 rounded border border-[rgba(240,190,50,0.2)] bg-[rgba(240,190,50,0.04)]
                font-mono text-[10px] leading-[1.8] space-y-1">
                <p className="text-[#f0c030] font-bold">⚠ GitHub README note</p>
                <p className="text-[#7880a0]">
                  GitHub's CSP blocks SVG clicks. The generated markdown already wraps the image
                  in a link so it works in GitHub READMEs:
                </p>
                <p className="text-[#39ff14]">
                  {`[![title](svg-url)](your-link)`}
                </p>
                <p className="text-[#7880a0]">
                  The SVG <code>&lt;a&gt;</code> tag inside still makes it clickable in
                  browsers, Notion, GitLab, and any other renderer.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="card-glass" label={displayTitle}
              url={buildParams(true)} width={width} height={height} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={height + 40}>
            {/* Wrap preview in anchor so click is testable in the app itself */}
            {linkUrl.trim() ? (
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                <img src={buildParams()} alt="Glass card preview"
                  className="cursor-pointer hover:opacity-90 transition-opacity" />
              </a>
            ) : (
              <img src={buildParams()} alt="Glass card preview" />
            )}
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Text Animation Builder ───────────────────────────────────────────────────
const TEXT_EFFECTS = [
  'typewriter', 'glitch', 'wave', 'neon-flicker', 'rainbow', 'shimmer',
  'matrix', 'bounce', 'rotate', 'explode', 'fade-in', 'slide-in',
  'morph', 'blur-in', 'scale', 'orbit', 'cascade', 'burn', 'freeze', 'glitter',
]

function TextAnimBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [text, setText] = useState('Hello, World!')
  const [effect, setEffect] = useState('typewriter')
  const [metal, setMetal] = useState('electric')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [width, setWidth] = useState(600)
  const [size, setSize] = useState(32)

  function buildParams(base = false) {
    const p = new URLSearchParams({ text, effect, metal, width: String(width), size: String(size), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/text-anim?${p}`
  }
  const md = `![${text}](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: text_animation" title="TEXT ANIMATION EFFECTS" />
      <BuilderGrid
        controls={<>
          <TextField label="Text" value={text} onChange={setText} />
          <SelectField label="Effect" value={effect} onChange={setEffect} options={TEXT_EFFECTS} />
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal / Color</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <RangeField label="Font Size" id="tfs" min={14} max={80} value={size} onChange={setSize} />
          <RangeField label="Width" id="tw" min={200} max={1000} value={width} onChange={setWidth} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="text-anim" label={`Text FX — ${text}`}
              url={buildParams(true)} width={width} height={size * 2} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={size * 2 + 40}>
            <img src={buildParams()} alt="Text animation preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Progress / Skill Builder ─────────────────────────────────────────────────
const PRESET_SKILLS = [
  { label: 'TypeScript', v: 92, m: 'electric' },
  { label: 'React', v: 88, m: 'neon-blue' },
  { label: 'Python', v: 80, m: 'neon-green' },
  { label: 'Rust', v: 65, m: 'copper' },
  { label: 'Go', v: 70, m: 'titanium' },
  { label: 'CSS', v: 90, m: 'rose-gold' },
]

function ProgressBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [label, setLabel] = useState('JavaScript')
  const [value, setValue] = useState(85)
  const [metal, setMetal] = useState('gold')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(90)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [style, setStyle] = useState('metallic')
  const [width, setWidth] = useState(450)

  function buildParams(base = false) {
    const p = new URLSearchParams({ label, value: String(value), metal, style, width: String(width), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 90) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/progress-bar?${p}`
  }

  const skillTreeUrl = (base = false) =>
    `${base ? BASE_URL : ''}/api/skill-tree?title=Tech+Stack&skills=${encodeURIComponent(
      PRESET_SKILLS.map(s => `${s.label}:${s.v}:${s.m}`).join(',')
    )}&width=420`

  const md = `![${label} ${value}%](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: progress_bar" title="SKILL PROGRESS BARS" />
      <BuilderGrid
        controls={<>
          <TextField label="Skill Label" value={label} onChange={setLabel} />
          <RangeField label="Proficiency" id="pv" min={0} max={100} value={value} onChange={setValue} unit="%" />
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <SelectField label="Style" value={style} onChange={setStyle}
            options={['metallic', 'glow-fill', 'segmented', 'glass', 'circuit', 'neo']} />
          <RangeField label="Width" id="pw" min={200} max={800} value={width} onChange={setWidth} />
          <div className="flex gap-3 mt-4 flex-wrap">
            <button className="btn-chrome px-4 py-2 rounded text-sm cursor-pointer"
              onClick={() => onAdd(`![Skill Tree](${skillTreeUrl(true)})`)}>
              ⚡ Add Full Skill Tree
            </button>
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="progress-bar" label={`Progress — ${label}`}
              url={buildParams(true)} width={width} height={40} />
            <AddToCompositeButton type="skill-tree" label="Skill Tree"
              url={skillTreeUrl(true)} width={420} height={280} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={80}>
            <img src={buildParams()} alt="Progress bar" />
          </PreviewBox>
          <CodeBlock code={md} />
          <div className="mt-4">
            <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// Skill tree preview:</p>
            <PreviewBox minHeight={160}>
              <img src={skillTreeUrl()} alt="Skill tree" className="max-w-full" />
            </PreviewBox>
          </div>
        </>}
      />
    </div>
  )
}

// ─── Terminal Builder ─────────────────────────────────────────────────────────
const TERMINAL_METALS = ['chrome', 'gold', 'neon-green', 'electric', 'titanium', 'obsidian']

function TerminalBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [termTitle, setTermTitle] = useState('profile.sh')
  const [lines, setLines] = useState('$ whoami|full-stack-developer|$ echo $STACK|TypeScript · React · Node.js|$ cat hobbies.txt|Open Source · Gaming · Coffee ☕')
  const [termTheme, setTermTheme] = useState('dark')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [width, setWidth] = useState(500)

  function buildParams(base = false) {
    const p = new URLSearchParams({ title: termTitle, lines, theme: termTheme, metal, width: String(width) })
    if (colors) p.set('colors', colors)
    return `${base ? BASE_URL : ''}/api/terminal?${p}`
  }
  const md = `![Terminal](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: terminal" title="TERMINAL BLOCK" />
      <BuilderGrid
        controls={<>
          <TextField label="Window Title" value={termTitle} onChange={setTermTitle} />
          <div className="mb-5">
            <FieldLabel>Lines <span className="normal-case opacity-60">(separate with |)</span></FieldLabel>
            <textarea className="metal-input" rows={5} value={lines}
              onChange={e => setLines(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SelectField label="Theme" value={termTheme} onChange={setTermTheme}
              options={['dark', 'matrix', 'amber', 'blue']} />
            <div>
              <FieldLabel>Frame Metal</FieldLabel>
              <select className="metal-select" value={metal} onChange={e => setMetal(e.target.value)}>
                {TERMINAL_METALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <GradientInput value={colors} onChange={setColors} />
          <RangeField label="Width" id="termw" min={250} max={800} value={width} onChange={setWidth} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="terminal" label={`Terminal — ${termTitle}`}
              url={buildParams(true)} width={width} height={220} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={260}>
            <img src={buildParams()} alt="Terminal preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Logo Builder ─────────────────────────────────────────────────────────────
function LogoBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [text, setLogoText] = useState('MF')
  const [metal, setMetal] = useState('gold')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [shape, setShape] = useState('hexagon')
  const [size, setSize] = useState(120)
  const [glow, setGlow] = useState(true)

  function buildParams(base = false, overrideShape?: string, overrideSize?: number) {
    const p = new URLSearchParams({
      text, metal,
      style: overrideShape ?? shape,
      size: String(overrideSize ?? size),
      glow: String(glow),
      theme,
    })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/logo-container?${p}`
  }
  const md = `![Logo](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: logo_container" title="LOGO CONTAINER" />
      <BuilderGrid
        controls={<>
          <div className="mb-5">
            <FieldLabel>Initials / Symbol</FieldLabel>
            <input className="metal-input" value={text} onChange={e => setLogoText(e.target.value)} maxLength={4} />
          </div>
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <SelectField label="Shape" value={shape} onChange={setShape}
            options={['hexagon', 'shield', 'circle', 'diamond', 'star', 'rounded-square']} />
          <RangeField label="Size" id="ls" min={40} max={300} value={size} onChange={setSize} />
          <label className="flex items-center gap-3 cursor-pointer mb-5">
            <input type="checkbox" checked={glow} onChange={e => setGlow(e.target.checked)}
              className="accent-[#4a9eff] w-4 h-4" />
            <span className="font-mono text-[12px] text-[#7880a0]">Enable glow</span>
          </label>
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="logo-container" label={`Logo — ${text}`}
              url={buildParams(true)} width={size} height={size} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={size + 40}>
            <img src={buildParams()} alt="Logo preview" />
          </PreviewBox>
          <CodeBlock code={md} />
          <div className="mt-4">
            <p className="font-mono text-[11px] text-[#4a9eff] mb-3">// All shapes preview:</p>
            <div className="flex flex-wrap gap-3">
              {['hexagon', 'shield', 'circle', 'diamond', 'star', 'rounded-square'].map(s => (
                <img key={s} src={buildParams(false, s, 70)} alt={s}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShape(s)} />
              ))}
            </div>
          </div>
        </>}
      />
    </div>
  )
}

// ─── Frame Builder (Image / GIF) ──────────────────────────────────────────────
function FrameBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [frameType, setFrameType] = useState<'image' | 'gif'>('image')
  const [src, setSrc] = useState('')
  const [caption, setCaption] = useState('Project Screenshot')
  const [frame, setFrame] = useState('metallic')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(220)

  const PAD = 12
  const imageFrames = ['metallic', 'glass', 'polaroid', 'circuit', 'neon-sign', 'hologram']
  const gifFrames = ['neon', 'metallic', 'glass', 'minimal']

  function frameUrl(base = false) {
    const endpoint = frameType === 'image' ? 'image-container' : 'gif-container'
    const p = new URLSearchParams({ metal, frame, width: String(width), height: String(height), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/${endpoint}?${p}`
  }

  const md = src
    ? `<img src="${src}" width="${width}" style="border-radius:8px"/>`
    : `![Frame](${frameUrl(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: image_frame" title="IMAGE / GIF FRAME" />
      <GithubImageNote />
      <div className="mt-6">
        <BuilderGrid
          controls={<>
            <div className="flex gap-3 mb-5">
              {(['image', 'gif'] as const).map(t => (
                <button key={t}
                  onClick={() => { setFrameType(t); setFrame(t === 'gif' ? 'neon' : 'metallic') }}
                  className={`px-4 py-2 rounded text-sm font-mono tracking-widest uppercase cursor-pointer border transition-all
                    ${frameType === t ? 'btn-chrome border-transparent' : 'btn-ghost'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="mb-5">
              <FieldLabel>{frameType === 'gif' ? 'GIF URL' : 'Image URL'}</FieldLabel>
              <input className="metal-input" value={src} onChange={e => setSrc(e.target.value)}
                placeholder="https://..." />
            </div>
            {frameType === 'image' && (
              <TextField label="Caption" value={caption} onChange={setCaption} />
            )}
            <FieldLabel>Theme</FieldLabel>
            <ThemePicker value={theme} onChange={setTheme} />
            <SelectField label="Frame Style" value={frame} onChange={setFrame}
              options={frameType === 'image' ? imageFrames : gifFrames} />
            <div className="mb-5">
              <FieldLabel>Metal</FieldLabel>
              <MetalPicker value={metal} onChange={setMetal} compact />
            </div>
            <GradientInput value={colors} onChange={setColors} />
            {colors && <AngleField value={angle} onChange={setAngle} />}
            <div className="grid grid-cols-2 gap-4">
              <RangeField label="Width" id="fw" min={100} max={600} value={width} onChange={setWidth} />
              <RangeField label="Height" id="fh2" min={80} max={500} value={height} onChange={setHeight} />
            </div>
            <div className="flex gap-3">
              <AddButton onClick={() => onAdd(md)} />
              <AddToCompositeButton type={frameType === 'image' ? 'image-container' : 'gif-container'}
                label={caption || 'Frame'} url={frameUrl(true)} width={width} height={height} />
            </div>
          </>}
          preview={<>
            <PreviewBox minHeight={height + 40}>
              <div className="relative" style={{ width, height }}>
                <img src={frameUrl()} alt="frame" className="block" />
                {src && (
                  <img src={src} alt="preview" className="absolute"
                    style={{
                      top: PAD, left: PAD,
                      width: width - PAD * 2, height: height - PAD * 2,
                      objectFit: 'cover', borderRadius: 6,
                    }} />
                )}
              </div>
            </PreviewBox>
            {frameType === 'gif' && (
              <div className="font-mono text-[11px] text-[#f0c030] p-3 mt-2 leading-[1.8]
                    bg-[rgba(240,190,50,0.06)] border border-[rgba(240,190,50,0.2)] rounded-md">
                <span className="font-bold">⚠ GIF README output:</span>
                <span className="text-[#7880a0]"> Uses a plain <code>&lt;img&gt;</code> tag so the GIF animates correctly.</span>
              </div>
            )}
            <CodeBlock code={md} />
          </>}
        />
      </div>
    </div>
  )
}

// ─── Social Links Builder ─────────────────────────────────────────────────────
function SocialBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [links, setLinks] = useState('github:@yourusername,twitter:@yourusername,linkedin:yourname,email:you@email.com')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [style, setStyle] = useState('pills')
  const [width, setWidth] = useState(600)

  function buildParams(base = false) {
    const p = new URLSearchParams({ links, metal, style, width: String(width), theme })
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/social-links?${p}`
  }
  const md = `![Social Links](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: social_links" title="SOCIAL LINKS ROW" />
      <BuilderGrid
        controls={<>
          <div className="mb-5">
            <FieldLabel>Links <span className="normal-case opacity-60">(platform:username, comma-separated)</span></FieldLabel>
            <textarea className="metal-input" rows={4} value={links} onChange={e => setLinks(e.target.value)} />
            <p className="font-mono text-[10px] text-[#7880a0] mt-1">
              Platforms: github · twitter · linkedin · discord · youtube · instagram · email · npm · medium
            </p>
          </div>
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <SelectField label="Style" value={style} onChange={setStyle}
            options={['pills', 'icons', 'minimal']} />
          <RangeField label="Width" id="slw" min={200} max={1000} value={width} onChange={setWidth} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="social-links" label="Social Links"
              url={buildParams(true)} width={width} height={60} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={100}>
            <img src={buildParams()} alt="Social links preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Table Builder ────────────────────────────────────────────────────────────
function TableBuilder({ onAdd }: { onAdd: (c: string) => void }) {
  const [type, setType] = useState('stats')
  const [title, setTitle] = useState('')
  const [headers, setHeaders] = useState('')
  const [rows, setRows] = useState('')
  const [metal, setMetal] = useState('chrome')
  const [colors, setColors] = useState('')
  const [angle, setAngle] = useState(135)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [width, setWidth] = useState(600)

  function buildParams(base = false) {
    const p = new URLSearchParams({ type, metal, width: String(width), theme })
    if (title) p.set('title', title)
    if (headers) p.set('headers', headers)
    if (rows) p.set('rows', rows)
    if (colors) p.set('colors', colors)
    if (angle !== 135) p.set('angle', String(angle))
    return `${base ? BASE_URL : ''}/api/table?${p}`
  }
  const md = `![Table](${buildParams(true)})`

  return (
    <div>
      <SectionHeader tag="// component_type: table" title="TABLE GENERATOR" />
      <BuilderGrid
        controls={<>
          <SelectField label="Table Type" value={type} onChange={setType}
            options={['stats', 'skills', 'projects', 'timeline', 'comparison']} />
          <TextField label="Title (optional)" value={title} onChange={setTitle} />
          <div className="mb-5">
            <FieldLabel>Headers <span className="normal-case opacity-60">(comma-separated)</span></FieldLabel>
            <input className="metal-input" value={headers} onChange={e => setHeaders(e.target.value)}
              placeholder="e.g. Tool, Usage, Rating" />
          </div>
          <div className="mb-5">
            <FieldLabel>Rows <span className="normal-case opacity-60">(cells: comma · rows: pipe |)</span></FieldLabel>
            <textarea className="metal-input" rows={4} value={rows}
              onChange={e => setRows(e.target.value)}
              placeholder="VSCode,Daily,★★★★★|Neovim,Often,★★★★☆"
              style={{ resize: 'vertical' }} />
            <div className="mt-2 p-2.5 rounded border border-[rgba(74,158,255,0.15)] bg-[rgba(74,158,255,0.04)] space-y-1">
              <p className="font-mono text-[10px] text-[#4a9eff] tracking-[1px]">// FORMAT RULES</p>
              <p className="font-mono text-[10px] text-[#7880a0] leading-[1.8]">
                <span className="text-[#f0c030]">,</span> separates cells within a row
              </p>
              <p className="font-mono text-[10px] text-[#7880a0] leading-[1.8]">
                <span className="text-[#f0c030]">|</span> separates rows
              </p>
              <p className="font-mono text-[10px] text-[#56607a] leading-[1.8] pt-0.5 border-t border-[rgba(120,140,200,0.1)]">
                e.g. <span className="text-[#39ff14]">goog,43,+2%|meta,12,-1%|msft,88,+5%</span>
              </p>
            </div>
          </div>
          <FieldLabel>Theme</FieldLabel>
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="mb-5">
            <FieldLabel>Metal Finish</FieldLabel>
            <MetalPicker value={metal} onChange={setMetal} compact />
          </div>
          <GradientInput value={colors} onChange={setColors} />
          {colors && <AngleField value={angle} onChange={setAngle} />}
          <RangeField label="Width" id="tbw" min={300} max={900} value={width} onChange={setWidth} />
          <div className="flex gap-3">
            <AddButton onClick={() => onAdd(md)} />
            <AddToCompositeButton type="table" label={title || `${type} table`}
              url={buildParams(true)} width={width} height={200} />
          </div>
        </>}
        preview={<>
          <PreviewBox minHeight={240}>
            <img src={buildParams()} alt="Table preview" />
          </PreviewBox>
          <CodeBlock code={md} />
        </>}
      />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<TabId>('banner')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab') as TabId | null
    if (tabParam) {
      setTab(tabParam)
      setTimeout(() => {
        const el = document.getElementById('showcase')
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
      }, 50)
      return
    }
    function handleHash() {
      if (window.location.hash === '#showcase') {
        setTab('showcase')
        const el = document.getElementById('showcase')
        if (el) {
          setTimeout(() => {
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
          }, 50)
        }
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const [assembled, setAssembled] = useState<string[]>([])

  const addToReadme = useCallback((code: string) => setAssembled(prev => [...prev, code]), [])
  const removeFromReadme = useCallback((index: number) => setAssembled(prev => prev.filter((_, i) => i !== index)), [])

  return (
    <CompositeCartProvider>
      <div className="min-h-screen grid-bg">
        <Navbar />

        {/* HERO */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]
          bg-[radial-gradient(ellipse,rgba(74,158,255,0.07)_0%,transparent_70%)] pointer-events-none"/>

          <div className="relative max-w-[880px] mx-auto text-center">
            <a href="https://www.natrajx.in/" target="_blank" rel="noopener"
              title="Natraj-X — AI & IT Engineering Agency"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-9
              border border-[rgba(240,190,50,0.3)] bg-[rgba(240,190,50,0.06)]
              font-mono text-[11px] tracking-[1.5px] uppercase text-[#f0c030]
              hover:bg-[rgba(240,190,50,0.12)] transition-all duration-200 cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0c030] shadow-[0_0_6px_#f0c030]" />
              A free tool by Natraj-X AI Engineering
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>

            {/* Forged nameplate — the signature element */}
            <div className="relative inline-block mx-auto px-12 py-9 mb-9"
              style={{
                background: 'linear-gradient(155deg, rgba(150,160,185,0.07) 0%, rgba(16,18,28,0.5) 65%)',
                border: '1px solid rgba(120,140,200,0.16)',
              }}>
              {[
                ['top-2.5', 'left-2.5'], ['top-2.5', 'right-2.5'],
                ['bottom-2.5', 'left-2.5'], ['bottom-2.5', 'right-2.5'],
              ].map(([v, h]) => (
                <span key={v + h}
                  className={`absolute ${v} ${h} w-[5px] h-[5px] rounded-full
                  bg-[rgba(170,180,205,0.4)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]`} />
              ))}
              <h1 className="font-orbitron text-[clamp(28px,6vw,58px)] font-black tracking-[6px] leading-none"
                style={{
                  background: 'linear-gradient(135deg,#e8e8e8 0%,#a0a8c0 35%,#ffffff 55%,#8090b0 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                README FORGE
              </h1>
              <p className="font-mono text-[10px] tracking-[4px] uppercase text-[#5a6080] mt-3">
                SVG Profile Components — Rendered On Request
              </p>
            </div>

            <p className="text-[16px] text-[#7880a0] max-w-[620px] mx-auto mb-8 leading-relaxed">
              Build metallic SVG banners, badges, stat cards, buttons, terminals and more
              for your GitHub README. Set the options, preview it live, copy the markdown.
            </p>

            <div className="flex gap-3 justify-center flex-wrap mb-10">
              <button onClick={() => setTab('showcase')} className="btn-chrome px-6 py-2.5 rounded-md text-sm cursor-pointer">✦ Full Showcase</button>
              <button onClick={() => setTab('header')} className="btn-gold px-6 py-2.5 rounded-md text-sm cursor-pointer">⊞ Build Profile</button>
            </div>

            <div className="flex items-center justify-center gap-x-6 gap-y-2 flex-wrap
              font-mono text-[10px] tracking-[1.5px] uppercase text-[#5a6080]">
              <span>Output <span className="text-[#7880a0]">SVG + Markdown</span></span>
              <span className="text-[rgba(120,140,200,0.25)]">/</span>
              <span>Runtime <span className="text-[#7880a0]">Edge</span></span>
              <span className="text-[rgba(120,140,200,0.25)]">/</span>
              <span>Cost <span className="text-[#7880a0]">Free, no sign-up</span></span>
            </div>
          </div>
        </section>

        <div id="api" className="absolute" style={{ marginTop: '-80px', pointerEvents: 'none' }} />

        <main id="docs" className="max-w-[1320px] mx-auto px-6 pb-24">
          {/* TAB BAR */}
          <div id="showcase" className="flex border-b border-[rgba(120,140,200,0.15)] mb-10 overflow-x-auto pb-0 hide-scrollbar">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3 font-rajdhani font-semibold text-[12px] tracking-[1.2px] uppercase
                border-b-2 -mb-px whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0
                ${tab === t.id
                    ? 'text-[#4a9eff] border-[#4a9eff]'
                    : 'text-[#7880a0] border-transparent hover:text-[#e0e4f0]'}`}>
                {t.icon} {t.label}
                {t.id === 'composite' && <CompositeCartBadge />}
              </button>
            ))}
          </div>

          {tab === 'banner' && <BannerBuilder onAdd={addToReadme} />}
          {tab === 'header' && <HeaderBuilder onAdd={addToReadme} />}
          {tab === 'footer' && <FooterBuilderUI onAdd={addToReadme} />}
          {tab === 'card' && <CardBuilder onAdd={addToReadme} />}
          {tab === 'neo' && <NeoCardBuilder onAdd={addToReadme} />}
          {tab === 'glass' && <GlassCardBuilder onAdd={addToReadme} />}
          {tab === 'brutal' && <NeoBrutalCardBuilder onAdd={addToReadme} />}
          {tab === 'clay' && <ClayCardBuilder onAdd={addToReadme} />}
          {tab === 'glow' && <GlowCardBuilder onAdd={addToReadme} />}
          {tab === 'skeuo' && <SkeuoCardBuilder onAdd={addToReadme} />}
          {tab === 'button' && <ButtonBuilder onAdd={addToReadme} />}
          {tab === 'badge' && <BadgeBuilder onAdd={addToReadme} />}
          {tab === 'text' && <TextAnimBuilder onAdd={addToReadme} />}
          {tab === 'progress' && <ProgressBuilder onAdd={addToReadme} />}
          {tab === 'terminal' && <TerminalBuilder onAdd={addToReadme} />}
          {tab === 'logo' && <LogoBuilder onAdd={addToReadme} />}
          {tab === 'image' && <FrameBuilder onAdd={addToReadme} />}
          {tab === 'social' && <SocialBuilder onAdd={addToReadme} />}
          {tab === 'divider' && <DividerBuilder onAdd={addToReadme} />}
          {tab === 'table' && <TableBuilder onAdd={addToReadme} />}
          {tab === 'composite' && <CompositeBuilder onAdd={addToReadme} />}
          {tab === 'showcase' && <ShowcaseGrid onAdd={addToReadme} />}

          <ReadmeAssembler
            items={assembled}
            onClear={() => setAssembled([])}
            onRemove={removeFromReadme}
          />
        </main>

        <Footer />
      </div>
    </CompositeCartProvider>
  )
}