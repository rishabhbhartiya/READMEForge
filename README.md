<div align="center">

# ReadmeForge

**A free, open-source GitHub README component generator with a 44-metal SVG engine.**

<br/>

<!-- Repo health / community badges -->
[![Stars](https://img.shields.io/github/stars/rishabhbhartiya/ReadmeForge?style=for-the-badge&color=FFD700&labelColor=0d1117)](https://github.com/rishabhbhartiya/ReadmeForge/stargazers)
[![Forks](https://img.shields.io/github/forks/rishabhbhartiya/ReadmeForge?style=for-the-badge&color=58a6ff&labelColor=0d1117)](https://github.com/rishabhbhartiya/ReadmeForge/network/members)
[![Issues](https://img.shields.io/github/issues/rishabhbhartiya/ReadmeForge?style=for-the-badge&color=39ff14&labelColor=0d1117)](https://github.com/rishabhbhartiya/ReadmeForge/issues)
[![Last Commit](https://img.shields.io/github/last-commit/rishabhbhartiya/ReadmeForge?style=for-the-badge&color=ff69b4&labelColor=0d1117)](https://github.com/rishabhbhartiya/ReadmeForge/commits/main)
[![License: MIT](https://img.shields.io/github/license/rishabhbhartiya/ReadmeForge?style=for-the-badge&color=e0e0e0&labelColor=0d1117)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blueviolet?style=for-the-badge&labelColor=0d1117)](#-contributing)

<br/>

Build stunning profile READMEs with metallic banners, animated text, cards, badges, skill trees, terminals and more — no code needed.

**[→ Open the App](https://readmeforge.natrajx.in)** · **[→ Docs](https://readmeforge.natrajx.in/docs)** · **[→ API Reference](https://readmeforge.natrajx.in/api-reference)** · **[→ Report a Bug](https://github.com/rishabhbhartiya/ReadmeForge/issues/new?template=bug_report.md)** · **[→ Request a Feature](https://github.com/rishabhbhartiya/ReadmeForge/issues/new?template=feature_request.md)**

**44 Metal Themes · 16 Component Types · 28 Design Styles · 20+ Text Effects · Edge Rendered · Always Free**

</div>

---

## ✦ Table of Contents

- [What is ReadmeForge?](#-what-is-readmeforge)
- [Why ReadmeForge?](#-why-readmeforge)
- [Features](#-features)
- [Metal Themes](#-metal-themes)
- [Quick Start](#-quick-start--copy-paste-profile-readme)
- [Local Development](#-local-development)
- [Deploy to Vercel](#-deploy-to-vercel)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Star History](#-star-history)
- [Contributors](#-contributors)
- [Built By](#-built-by)
- [License](#-license)

---

## ✦ What is ReadmeForge?

ReadmeForge generates **edge-rendered SVG components** for GitHub READMEs via a simple URL API. Every component is a plain `![alt](url)` markdown image — no JavaScript, no iframes, no GitHub Actions needed.

```md
<!-- Drop any ReadmeForge URL into your README like this: -->
![My Banner](https://readmeforge.natrajx.in/api/banner?text=Hello+World&metal=gold)
```

> **Built by [Natraj-X](https://www.natrajx.in/)** — an AI & IT engineering agency specialising in ML pipelines, data engineering, and full-stack product development.

---

## ✦ Why ReadmeForge?

There are a few README badge/stat generators out there. Here's how ReadmeForge is different:

| | ReadmeForge | Typical badge generators | Screenshot-based generators |
|---|---|---|---|
| Rendering | Edge SVG, generated per-request | Static badge shields | Puppeteer / headless browser |
| Cold starts | None (Vercel Edge) | None | Common |
| Component variety | 16 component types, 28 styles | Badges only | Cards / stats only |
| Metal / theme system | 44 built-in themes + custom hex | Limited palettes | Limited palettes |
| Clickable elements | Yes, via markdown link wrapping | Yes | Rare |
| Cost | Free, no account, no rate limit (fair use) | Free | Often rate-limited or paid tiers |
| Self-hostable | Yes — MIT licensed, deploy your own | Varies | Rarely |

If you've outgrown `shields.io` badges and don't want to run a headless-browser stats service, ReadmeForge sits in between: a lightweight, fully edge-rendered SVG API you can self-host in one command.

---

## ✦ Features

| | |
|---|---|
| 🎨 **44 Metal Themes** | Chrome, Gold, Neon-Green, Rose-Gold, Electric, Holographic, Aurora and 37 more |
| 🧩 **16 Component Types** | Banners, Cards, Buttons, Badges, Headers, Footers, Dividers, Text FX, Progress Bars, Terminals, Social Links, Logo Containers, Image Frames and more |
| ⚡ **Edge Runtime** | All SVGs rendered on Vercel Edge — globally fast, zero cold starts |
| 🎭 **28 Design Styles** | Cyber-grid, Glassmorphic, Neumorphic, Hologram, Neon-sign, Retro-wave and more |
| ✨ **20+ Text Animations** | Typewriter, glitch, neon-pulse, wave, matrix, holographic, fire, scramble and more |
| 🖌️ **Custom Gradients** | Pass any hex colors as comma-separated — overrides the metal theme |
| 🔗 **Pure Markdown** | Every component is a plain `![]()` image — works everywhere GitHub renders markdown |
| 🆓 **Free Forever** | No account, no API key, no rate limits (fair use) |
| 🧑‍💻 **Open Source** | MIT licensed, self-hostable, PRs welcome |

---

## ✦ Metal Themes

<details>
<summary>View all 44 metal themes</summary>

| Group | Names |
|---|---|
| **Classic** | `chrome` `gold` `silver` `bronze` `copper` `iron` `steel` `rose-gold` |
| **Premium** | `platinum` `titanium` `obsidian` `mercury` |
| **Neon** | `neon-green` `neon-blue` `neon-pink` `neon-purple` `neon-orange` `electric` |
| **Aurora** | `aurora` `aurora-rose` `aurora-ocean` |
| **Cyber** | `cyber-yellow` `cyber-red` `cyber-teal` `holographic` |
| **Pastel** | `pastel-pink` `pastel-blue` `pastel-green` `pastel-lavender` `pastel-peach` |
| **Material** | `material-blue` `material-red` `material-green` `material-deep-purple` |
| **Retro** | `retro-orange` `retro-teal` `vintage-sepia` `vintage-green` |
| **Y2K / Memphis** | `y2k-pink` `memphis-yellow` `memphis-coral` |
| **Pixel** | `pixel-green` `pixel-purple` |
| **Neutral** | `white` `black` `slate` `zinc` |

</details>

---

## ✦ Quick Start — Copy-Paste Profile README

```md
<!-- Banner -->
![Banner](https://readmeforge.natrajx.in/api/banner?text=YOUR+NAME&subtext=Full+Stack+Developer&metal=chrome&type=wave&width=900)

<!-- Badges -->
![Status](https://readmeforge.natrajx.in/api/badge?label=Status&value=Open+to+Work&metal=neon-green&shape=pill)
![Role](https://readmeforge.natrajx.in/api/badge?label=Role&value=Full+Stack+Dev&metal=gold&shape=pill)

<!-- Skills -->
![Skills](https://readmeforge.natrajx.in/api/skill-tree?skills=TypeScript:90,Python:85,Next.js:80,AWS:70&metal=neon-blue&width=500)

<!-- Terminal -->
![Terminal](https://readmeforge.natrajx.in/api/terminal?title=~/me&lines=whoami:+fullstack+dev|focus:+AI+%26+web+products|currently:+building+cool+stuff&metal=matrix&width=500)

<!-- Social Links -->
![Social](https://readmeforge.natrajx.in/api/social-links?links=github:@yourusername,twitter:@yourtwitter,linkedin:yourname&metal=chrome&width=500)

<!-- Divider -->
![Divider](https://readmeforge.natrajx.in/api/divider?style=wave&metal=gold&width=900)
```

---

## ✦ Local Development

```bash
git clone https://github.com/rishabhbhartiya/ReadmeForge.git
cd ReadmeForge
npm install
npm run dev
# → http://localhost:3000
```

**Requirements:** Node.js 18+ · npm 9+

---

## ✦ Deploy to Vercel

```bash
npm i -g vercel
vercel deploy
```

All routes use `export const runtime = 'edge'` — zero config needed. Custom domain: point your DNS `CNAME` to `cname.vercel-dns.com`.

---

## ✦ Roadmap

- [x] Core SVG engine — 44 metal themes
- [x] 16 component types, 28 design styles
- [x] Edge API on Vercel
- [x] Visual builder UI + live preview
- [x] API reference & docs site
- [ ] Composite "assemble full README" export
- [ ] GitHub Action to auto-refresh dynamic stats (commits, stars) on a schedule
- [ ] Community theme submissions (custom metal presets)
- [ ] CLI (`npx readmeforge init`) to scaffold a README locally
- [ ] Public component gallery with community-submitted presets

Have an idea? [Open a feature request](https://github.com/rishabhbhartiya/ReadmeForge/issues/new?template=feature_request.md) or vote on existing ones in [Issues](https://github.com/rishabhbhartiya/ReadmeForge/issues).

---

## ✦ Contributing

Contributions are welcome — whether it's a new metal theme, a new component, a bug fix, or a docs improvement.

1. Fork the repo and create a branch: `git checkout -b feat/my-component`
2. Run it locally: `npm install && npm run dev`
3. Make your change
4. Run `npm run lint` and `npm run build` before opening a PR
5. Open a PR against `main` with a clear description and, if visual, a screenshot or rendered SVG link

Please be respectful and constructive in all discussions, issues, and pull requests.

---

## ✦ FAQ

<details>
<summary><strong>Do the SVGs update automatically, or are they static snapshots?</strong></summary>
<br/>
Every request re-renders the SVG on the edge at request time based on the query params you pass — there's no caching layer that goes stale on you (GitHub's own image proxy does cache the response for a short period, which is standard for any camo-proxied image).
</details>

<details>
<summary><strong>Do I need an API key or account?</strong></summary>
<br/>
No. Every endpoint is public and unauthenticated. Fair-use rate limits apply to keep the service available for everyone.
</details>

<details>
<summary><strong>Can I self-host ReadmeForge instead of using the hosted app?</strong></summary>
<br/>
Yes — it's MIT licensed. Clone the repo, run <code>vercel deploy</code>, and point a custom domain at it. See <a href="#-deploy-to-vercel">Deploy to Vercel</a>.
</details>

<details>
<summary><strong>Why doesn't my button link work when clicked?</strong></summary>
<br/>
SVGs embedded via <code>![]()</code> can't carry a clickable <code>href</code> on GitHub. Wrap the image in a markdown link instead: <code>[![label](svg-url)](https://your-link.com)</code>.
</details>

<details>
<summary><strong>Can I use my own brand colors instead of the built-in metals?</strong></summary>
<br/>
Yes — pass <code>colors=#hex1,#hex2</code> (and optionally <code>angle=</code>) on any component that supports gradients; it overrides the <code>metal</code> theme entirely.
</details>

---

## ✦ Star History

<a href="https://star-history.com/#rishabhbhartiya/ReadmeForge&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=rishabhbhartiya/ReadmeForge&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=rishabhbhartiya/ReadmeForge&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=rishabhbhartiya/ReadmeForge&type=Date" width="700" />
  </picture>
</a>

If ReadmeForge saved you time, consider dropping a ⭐ on the repo — it helps others discover the project.

---

## ✦ Contributors

<a href="https://github.com/rishabhbhartiya/ReadmeForge/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rishabhbhartiya/ReadmeForge" alt="Contributors" />
</a>

---

## ✦ Built By

<div align="center">

**Built by [Natraj-X](https://www.natrajx.in/)** — AI & IT Engineering Agency · ML · Full-Stack · Cloud

**ReadmeForge is a free, open-source tool by [Natraj-X](https://www.natrajx.in/) — an AI & IT Engineering Agency.**

We build production-grade AI systems, ML pipelines, data products, and full-stack applications for startups and enterprises worldwide.

| Service | Description |
|---|---|
| 🤖 [AI & ML Engineering](https://www.natrajx.in/aiml) | LLM systems, ML pipelines, model evaluation, RAG |
| 🌐 [Web Development](https://www.natrajx.in/webdev) | Next.js, React, full-stack product engineering |
| ☁️ [Cloud / Infra](https://www.natrajx.in/cloudinfra) | Data pipelines, ETL, cloud data warehouses |
| 📊 [Data Engineering](https://www.natrajx.in/aiml) | Scalable ETL architectures, analytics systems |

**→ [View our work](https://www.natrajx.in/work) · [Read our blog](https://www.natrajx.in/blog) · [Hire us](https://www.natrajx.in/contact)**

<br/>

**[Open ReadmeForge](https://readmeforge.natrajx.in)** · **[Visit Natraj-X](https://www.natrajx.in/)** · **[Hire Us](https://www.natrajx.in/contact)**

</div>

---

## ✦ License

MIT © 2026 [Natraj-X](https://www.natrajx.in/) — free to use, fork, and deploy.

---

<div align="center">

<sub>ReadmeForge · Free, Open-Source GitHub README Generator · Made with ♦ by <a href="https://www.natrajx.in/">Natraj-X AI Engineering</a></sub>

</div>