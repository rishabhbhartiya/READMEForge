'use client'

import { useState } from 'react'
import { CodeBlock } from './ui'

interface Props {
  items: string[]
  onClear: () => void
}

export default function ReadmeAssembler({ items, onClear }: Props) {
  const [username, setUsername] = useState('yourusername')
  const [name, setName]         = useState('Your Name')

  const fullReadme = `# Hi there, I'm ${name} 👋

${items.join('\n\n')}

---

## 🛠 About Me

- 🔭 I'm currently working on something awesome
- 🌱 I'm learning new things every day
- 💬 Ask me about anything tech-related
- 📫 How to reach me: your@email.com

---

*Generated with [MetalForge](https://metalforge.vercel.app) — Advanced README Component Kit*
`

  const copy = async () => {
    await navigator.clipboard.writeText(fullReadme).catch(() => {})
  }

  return (
    <div className="mt-16">
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(120,140,200,0.2),transparent)] mb-16"/>

      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] text-[#4a9eff] opacity-75 mb-1">// tool: readme_assembler</p>
          <h2 className="font-orbitron text-[22px] font-bold tracking-[2px]"
            style={{
              background:'linear-gradient(135deg,#f0f0f0 0%,#909090 25%,#d8d8d8 50%,#c8c8c8 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
            README ASSEMBLER
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="btn-chrome px-5 py-2 rounded-md text-sm cursor-pointer">
            ⚙ Copy Full README
          </button>
          <button onClick={onClear} className="btn-ghost px-4 py-2 rounded-md text-sm cursor-pointer">
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config */}
        <div className="metal-card p-6">
          <p className="font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-4">Profile Config</p>
          <div className="mb-4">
            <label className="block font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-2">Your Name</label>
            <input className="metal-input" value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="block font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-2">GitHub Username</label>
            <input className="metal-input" value={username} onChange={e => setUsername(e.target.value)}/>
          </div>

          <p className="font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-3 mt-6">
            Added Components ({items.length})
          </p>
          <div className="space-y-2 min-h-[80px]">
            {items.length === 0 ? (
              <p className="font-mono text-[11px] text-[#7880a0] italic">
                // Use "+ Add to README" buttons above...
              </p>
            ) : (
              items.map((item, i) => (
                <div key={i} className="font-mono text-[10px] text-[#4a9eff] bg-[rgba(74,158,255,0.06)]
                  border border-[rgba(74,158,255,0.15)] rounded px-3 py-2 truncate">
                  {i + 1}. {item.split('?')[0].replace('![','').replace('](','')}...
                </div>
              ))
            )}
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          <p className="font-mono text-[11px] tracking-[2px] text-[#7880a0] uppercase mb-3">
            README.md Output
          </p>
          <CodeBlock code={fullReadme}/>
        </div>
      </div>
    </div>
  )
}
