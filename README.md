# ⚙ MetalForge v2.0 — Full GitHub README Component Kit

> The most complete metallic SVG component generator for GitHub profile READMEs.

## ✦ 16 Component Types

| Component | API Endpoint | Variants |
|---|---|---|
| **Banners** | `/api/banner` | 10 metals × 9 shapes × 6 animations |
| **Profile Headers** | `/api/header` | profile, minimal, cyber, terminal, hologram |
| **Profile Footers** | `/api/footer` | wave, minimal, cyber, credits |
| **Metallic Cards** | `/api/card` | stats, langs, streak, trophy, activity |
| **Neumorphic Cards** | `/api/card-neo` | raised, pressed, floating, inset |
| **Glassmorphic Cards** | `/api/card-glass` | dark, aurora, sunset, ocean, midnight |
| **Buttons** | `/api/button` | beveled, pill, sharp, engraved, ghost |
| **Badges** | `/api/badge` | pill, rect, hex, sharp + shield mode |
| **Text Animations** | `/api/text-anim` | typewriter, glitch, wave, neon-flicker, rainbow, shimmer, matrix, bounce |
| **Progress Bars** | `/api/progress-bar` | metallic, glow-fill, segmented, glass, circuit, neo |
| **Skill Trees** | `/api/skill-tree` | stacked progress bars, custom colors per skill |
| **Terminals** | `/api/terminal` | dark, matrix, amber, blue |
| **Logo Containers** | `/api/logo-container` | hexagon, shield, circle, diamond, star, rounded-square |
| **Image Frames** | `/api/image-container` | metallic, glass, polaroid, circuit, neon-sign |
| **GIF Frames** | `/api/gif-container` | neon, metallic, glass, minimal |
| **Social Links** | `/api/social-links` | pills, icons, minimal |
| **Dividers** | `/api/divider` | line, double, dashed, ornate, circuit, wave |

## 🎨 10 Metal Finishes

`chrome` · `gold` · `rose-gold` · `titanium` · `copper` · `obsidian` · `electric` · `neon` · `blood` · `ice`

## 🚀 Deploy

```bash
unzip metalforge-v2.zip
cd metalforge
npm install
npx vercel --prod
```

## 📡 Key API Examples

```markdown
# Profile Header
![Header](https://your-app.vercel.app/api/header?name=John+Doe&title=Full-Stack+Dev&metal=gold&style=cyber)

# Text Animation
![Hello](https://your-app.vercel.app/api/text-anim?text=Welcome+to+my+Profile&effect=typewriter&metal=electric)

# Neumorphic stat card
![Commits](https://your-app.vercel.app/api/card-neo?title=Commits&value=3%2C291&theme=dark&style=raised)

# Glass card
![Stars](https://your-app.vercel.app/api/card-glass?title=Stars&value=12.4k&theme=aurora)

# Skill tree
![Skills](https://your-app.vercel.app/api/skill-tree?skills=TypeScript:92:electric,React:88:electric,Rust:65:copper)

# Terminal block
![Terminal](https://your-app.vercel.app/api/terminal?lines=$+whoami|full-stack-dev|$+echo+$PASSION|Open+Source&theme=matrix)

# Logo container
![Logo](https://your-app.vercel.app/api/logo-container?text=MF&metal=gold&style=hexagon&size=120)

# Social links
![Social](https://your-app.vercel.app/api/social-links?links=github:@you,twitter:@you,linkedin:you&metal=chrome&style=pills)

# GIF frame
![Demo](https://your-app.vercel.app/api/gif-container?src=YOUR_GIF_URL&frame=neon&metal=electric)
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── banner/          ← Metallic banners
│   │   ├── header/          ← Profile headers
│   │   ├── footer/          ← Profile footers
│   │   ├── card/            ← GitHub stat cards
│   │   ├── card-neo/        ← Neumorphic cards
│   │   ├── card-glass/      ← Glassmorphic cards
│   │   ├── button/          ← Forged buttons
│   │   ├── badge/           ← Tech badges
│   │   ├── text-anim/       ← Animated text effects
│   │   ├── progress-bar/    ← Skill progress bars
│   │   ├── skill-tree/      ← Stacked skill bars
│   │   ├── terminal/        ← Terminal blocks
│   │   ├── logo-container/  ← Logo shape containers
│   │   ├── image-container/ ← Image frames
│   │   ├── gif-container/   ← GIF frames
│   │   ├── social-links/    ← Social link rows
│   │   └── divider/         ← Decorative dividers
│   └── page.tsx             ← Full builder UI (16 tabs)
└── lib/
    ├── metals.ts             ← Core metal engine (10 finishes)
    └── renderers/
        ├── banner.ts
        ├── card.ts
        ├── button.ts
        ├── badge.ts
        ├── divider.ts
        ├── header.ts         ← NEW
        ├── footer.ts         ← NEW
        ├── card-neo.ts       ← NEW (Neumorphic)
        ├── card-glass.ts     ← NEW (Glassmorphic)
        ├── containers.ts     ← NEW (Image/GIF/Logo)
        ├── text-anim.ts      ← NEW (8 text effects)
        └── extras.ts         ← NEW (Progress/Skill/Terminal/Social)
```

---

MIT © 2026 MetalForge
