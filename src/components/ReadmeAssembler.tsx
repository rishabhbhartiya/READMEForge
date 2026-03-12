'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  items: string[]
  onClear: () => void
  onRemove?: (index: number) => void
}

// ─── Minimal markdown → HTML renderer (no external deps) ─────────────────────
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Headings
    .replace(/^###### (.+)$/gm, '<h6 class="md-h6">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    // HR
    .replace(/^---+$/gm, '<hr class="md-hr"/>')
    // Clickable image links: [![alt](img)](href)
    .replace(
      /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
      '<a href="$3" target="_blank" rel="noopener" class="md-img-link"><img src="$2" alt="$1" class="md-img"/></a>'
    )
    // Plain images: ![alt](src)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img"/>')
    // Links: [text](href)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>')
    // HTML img tags passthrough
    .replace(/&lt;img ([^&]*)\/&gt;/g, (_, a) => `<img ${a.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')} class="md-img"/>`)
    .replace(/&lt;img ([^&]*)&gt;/g,  (_, a) => `<img ${a.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')} class="md-img"/>`)
    // div align center
    .replace(/&lt;div align="center"&gt;/g, '<div class="md-center">')
    .replace(/&lt;\/div&gt;/g, '</div>')
    // Lists
    .replace(/^[-*] (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // Paragraphs
    .replace(/^(?!<[a-z/]|\s*$)(.+)$/gm, '<p class="md-p">$1</p>')

  return html
}

type ViewMode = 'edit' | 'split' | 'preview'

export default function ReadmeAssembler({ items, onClear, onRemove }: Props) {
  const [username, setUsername]     = useState('yourusername')
  const [name, setName]             = useState('Your Name')
  const [copied, setCopied]         = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [mode, setMode]             = useState<ViewMode>('split')
  const [content, setContent]       = useState('')
  const [manuallyEdited, setManuallyEdited] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const buildDefault = (n: string) => `# Hi there, I'm ${n} 👋

${items.join('\n\n')}

---

## 🛠 About Me

- 🔭 I'm currently working on something awesome
- 🌱 I'm learning new things every day
- 💬 Ask me about anything tech-related
- 📫 How to reach me: your@email.com

---

*Generated with [ReadmeForge](https://readmeforge.natrajx.in) — Free GitHub README Generator by [Natraj-X](https://www.natrajx.in/)*
`

  // Sync when items/name changes, unless user has manually edited
  useEffect(() => {
    if (!manuallyEdited) setContent(buildDefault(name))
  }, [items, name]) // eslint-disable-line

  useEffect(() => { setContent(buildDefault(name)) }, []) // eslint-disable-line

  function handleEdit(val: string) {
    setContent(val)
    setManuallyEdited(true)
  }

  function handleReset() {
    setManuallyEdited(false)
    setContent(buildDefault(name))
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'README.md'; a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const s = el.selectionStart, end = el.selectionEnd
      const v = content.substring(0, s) + '  ' + content.substring(end)
      setContent(v); setManuallyEdited(true)
      setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2 }, 0)
    }
  }

  const lineCount = content.split('\n').length

  return (
    <div className="mt-16">
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(120,140,200,0.2),transparent)] mb-16"/>

      {/* Header */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] text-[#4a9eff] opacity-75 mb-1">
            // tool: readme_assembler
          </p>
          <h2 className="font-orbitron text-[22px] font-bold tracking-[2px]"
            style={{
              background: 'linear-gradient(135deg,#f0f0f0 0%,#909090 25%,#d8d8d8 50%,#c8c8c8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
            README ASSEMBLER
          </h2>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={handleCopy}
            className={`px-4 py-2 rounded-md text-sm cursor-pointer transition-all font-mono text-[12px] tracking-[1px]
              ${copied ? 'bg-[rgba(57,255,20,0.15)] border border-[rgba(57,255,20,0.4)] text-[#39ff14]' : 'btn-chrome'}`}>
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
          <button onClick={handleDownload}
            className={`px-4 py-2 rounded-md text-sm cursor-pointer transition-all font-mono text-[12px] tracking-[1px]
              ${downloaded ? 'bg-[rgba(57,255,20,0.15)] border border-[rgba(57,255,20,0.4)] text-[#39ff14]' : 'btn-gold'}`}>
            {downloaded ? '✓ Saved!' : '↓ Download .md'}
          </button>
          {manuallyEdited && (
            <button onClick={handleReset}
              className="px-4 py-2 rounded-md text-sm cursor-pointer font-mono text-[12px] tracking-[1px]
                border border-[rgba(255,100,50,0.3)] text-[#ff6432] hover:bg-[rgba(255,100,50,0.1)] transition-all">
              ↺ Reset
            </button>
          )}
          <button onClick={onClear}
            className="btn-ghost px-4 py-2 rounded-md text-sm cursor-pointer font-mono text-[12px]">
            ✕ Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Left sidebar */}
        <div className="metal-card p-5 lg:col-span-1">
          <p className="font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-4">Profile</p>

          <div className="mb-3">
            <label className="block font-mono text-[10px] tracking-[2px] text-[#7880a0] uppercase mb-1.5">Name</label>
            <input className="metal-input text-[13px]" value={name}
              onChange={e => { setName(e.target.value); setManuallyEdited(false) }}/>
          </div>
          <div className="mb-5">
            <label className="block font-mono text-[10px] tracking-[2px] text-[#7880a0] uppercase mb-1.5">GitHub Username</label>
            <input className="metal-input text-[13px]" value={username}
              onChange={e => setUsername(e.target.value)}/>
          </div>

          <p className="font-mono text-[10px] tracking-[2px] text-[#7880a0] uppercase mb-2">
            Components ({items.length})
          </p>
          <div className="space-y-1.5 min-h-[60px] max-h-[300px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="font-mono text-[11px] text-[#56607a] italic leading-[1.7]">
                // Use "+ Add to README"<br/>
                // buttons above ↑
              </p>
            ) : (
              items.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 group">
                  <div className="flex-1 font-mono text-[10px] text-[#4a9eff]
                    bg-[rgba(74,158,255,0.06)] border border-[rgba(74,158,255,0.12)]
                    rounded px-2.5 py-1.5 truncate min-w-0">
                    <span className="text-[#56607a] mr-1">{i + 1}.</span>
                    {item.split('?')[0].replace('![', '').split('](')[0] || 'component'}
                  </div>
                  {onRemove && (
                    <button onClick={() => onRemove(i)}
                      className="shrink-0 w-5 h-5 rounded text-[#56607a] hover:text-[#ff4444]
                        hover:bg-[rgba(255,68,68,0.1)] transition-all text-[11px] cursor-pointer
                        opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {manuallyEdited && (
            <div className="mt-4 p-3 rounded border border-[rgba(240,190,50,0.2)] bg-[rgba(240,190,50,0.04)]">
              <p className="font-mono text-[10px] text-[#f0c030] leading-[1.6]">
                ✎ Manually edited.<br/>
                Click ↺ Reset to rebuild from components.
              </p>
            </div>
          )}
        </div>

        {/* Editor + Preview */}
        <div className="lg:col-span-3 flex flex-col">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2
            bg-[#0c0c18] border border-[rgba(120,140,200,0.15)] rounded-t-lg">
            <div className="flex items-center gap-1">
              {(['edit','split','preview'] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded font-mono text-[11px] tracking-[1px] uppercase
                    cursor-pointer transition-all
                    ${mode === m
                      ? 'bg-[rgba(74,158,255,0.15)] border border-[rgba(74,158,255,0.35)] text-[#4a9eff]'
                      : 'text-[#56607a] hover:text-[#7880a0] border border-transparent'}`}>
                  {m === 'edit' ? '✎ Edit' : m === 'split' ? '⊞ Split' : '◉ Preview'}
                </button>
              ))}
            </div>
            <div className="font-mono text-[10px] text-[#56607a] tracking-[1px]">
              {lineCount} lines · {content.length} chars
              {manuallyEdited && <span className="ml-2 text-[#f0c030]">· edited</span>}
            </div>
          </div>

          {/* Panes */}
          <div className={`flex ${mode === 'split' ? 'flex-row' : 'flex-col'} flex-1`}
            style={{ minHeight: 520 }}>

            {/* Edit pane */}
            {(mode === 'edit' || mode === 'split') && (
              <div className={`flex flex-col ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                {mode === 'split' && (
                  <div className="px-3 py-1 bg-[#0a0a14] border-r border-b border-[rgba(120,140,200,0.1)]
                    font-mono text-[10px] text-[#56607a] tracking-[1.5px] uppercase">
                    ✎ Editor
                  </div>
                )}
                <div className={`flex flex-1 bg-[#08080f] overflow-hidden
                  ${mode === 'split' ? 'border-r border-[rgba(120,140,200,0.1)] rounded-bl-lg' : 'rounded-b-lg border border-t-0 border-[rgba(120,140,200,0.15)]'}`}>
                  {/* Line numbers */}
                  <div className="select-none pt-4 pb-4 px-2 text-right bg-[#06060c]
                    border-r border-[rgba(120,140,200,0.07)] overflow-hidden shrink-0" style={{ minWidth: 38 }}>
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div key={i} className="font-mono text-[11px] text-[#2a2e45] leading-[1.72]">{i + 1}</div>
                    ))}
                  </div>
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => handleEdit(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className="flex-1 py-4 px-4 bg-transparent resize-none outline-none
                      font-mono text-[12px] text-[#c8d0f0] leading-[1.72]
                      placeholder:text-[#2a2e45] caret-[#4a9eff] w-full"
                    style={{ minHeight: 480, tabSize: 2 }}
                    placeholder="# Start writing your README here..."
                  />
                </div>
              </div>
            )}

            {/* Preview pane */}
            {(mode === 'preview' || mode === 'split') && (
              <div className={`flex flex-col ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                {mode === 'split' && (
                  <div className="px-3 py-1 bg-[#0a0a14] border-b border-[rgba(120,140,200,0.1)]
                    font-mono text-[10px] text-[#56607a] tracking-[1.5px] uppercase">
                    ◉ Preview
                  </div>
                )}
                <div className={`flex-1 overflow-y-auto p-6 bg-white text-[#24292f]
                  ${mode === 'preview' ? 'rounded-b-lg border border-t-0 border-[rgba(120,140,200,0.15)]' : ''}
                  ${mode === 'split' ? 'rounded-br-lg' : ''}`}
                  style={{ minHeight: 480, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' }}>
                  <style>{`
                    .md-h1{font-size:1.75rem;font-weight:800;margin:0 0 12px;border-bottom:1px solid #d0d7de;padding-bottom:8px;color:#1f2328}
                    .md-h2{font-size:1.35rem;font-weight:700;margin:20px 0 8px;border-bottom:1px solid #d0d7de;padding-bottom:6px;color:#1f2328}
                    .md-h3{font-size:1.1rem;font-weight:700;margin:16px 0 6px;color:#1f2328}
                    .md-h4,.md-h5,.md-h6{font-weight:600;margin:12px 0 4px;color:#1f2328}
                    .md-p{margin:6px 0;line-height:1.7;font-size:14px;color:#24292f}
                    .md-hr{border:none;border-top:1px solid #d0d7de;margin:16px 0}
                    .md-img{max-width:100%;height:auto;display:inline-block;margin:4px 2px;vertical-align:middle}
                    .md-img-link{display:inline-block}
                    .md-center{text-align:center;display:block;margin:8px 0}
                    .md-link{color:#0969da;text-decoration:none}
                    .md-link:hover{text-decoration:underline}
                    .md-code{background:#f6f8fa;border:1px solid #d0d7de;border-radius:4px;padding:1px 5px;font-size:12px;font-family:monospace;color:#cf222e}
                    .md-blockquote{border-left:3px solid #d0d7de;padding:4px 12px;color:#636c76;margin:8px 0}
                    .md-ul{padding-left:20px;margin:6px 0}
                    .md-li{margin:3px 0;font-size:14px;list-style:disc;color:#24292f}
                    strong{font-weight:700} em{font-style:italic}
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
