import type { Metadata } from 'next'
import './globals.css'

const SITE_URL    = 'https://readmeforge.natrajx.in'
const CREATOR_URL = 'https://www.natrajx.in'
const OG_IMAGE    = `${SITE_URL}/og.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'ReadmeForge — Free GitHub README Generator | SVG Badges, Banners & Cards',
    template: '%s | ReadmeForge by Natraj-X',
  },

  description:
    'ReadmeForge is a free GitHub README generator with 44 metallic SVG themes. Create animated banners, stat cards, badges, buttons, skill trees, terminal blocks and more — no code needed. Built by Natraj-X AI Engineering.',

  keywords: [
    // High-volume README keywords
    'github readme generator',
    'github profile readme',
    'github readme badges',
    'github readme banner',
    'github stat card',
    'svg badge generator',
    'readme maker online',
    'github readme template',
    'github profile customizer',
    'readme design tool',
    'animated github banner',
    'github readme components',
    'tech stack badges github',
    // Long-tail
    'metallic svg github badge',
    'github readme progress bar',
    'github readme terminal block',
    'github readme skill tree',
    'neumorphic github card',
    'glassmorphic github card',
    'github readme text animation',
    // Brand
    'natraj-x',
    'natrajx',
    'natrajx.in',
    'natraj-x ai engineering',
    'readmeforge',
  ],

  authors: [{ name: 'Natraj-X', url: CREATOR_URL }],
  creator: 'Natraj-X',
  publisher: 'Natraj-X',

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'ReadmeForge',
    title: 'ReadmeForge — Free GitHub README SVG Generator',
    description:
      'Generate metallic SVG banners, badges, cards, buttons & terminal blocks for your GitHub README. 44 metal themes. Free. By Natraj-X AI Engineering.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'ReadmeForge by Natraj-X' }],
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ReadmeForge — GitHub README Generator',
    description: 'Free SVG generator for GitHub READMEs. Metallic banners, badges, cards, terminals & more. By Natraj-X.',
    images: [OG_IMAGE],
    creator: '@natrajx_in',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  alternates: { canonical: SITE_URL },

  verification: {
    google: 'IWEPGEkp7gMjjLmtFt0QLnBB627U6Q-XZmZ_CJWCcqE',
  },
}

// JSON-LD — WebApplication + Organization (Natraj-X)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'ReadmeForge',
      url: SITE_URL,
      description:
        'Free GitHub README component generator with 44 metallic SVG themes, 28 design styles, and 20+ text animation effects.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'Natraj-X', url: CREATOR_URL },
      featureList: [
        'GitHub README banner generator',
        'Metallic SVG badges',
        'GitHub stat cards',
        'Neumorphic cards',
        'Glassmorphic cards',
        'Animated text effects',
        'Skill tree progress bars',
        'Terminal block SVG',
        'Social links row',
        '44 metal color themes',
        '28 design styles',
        'Edge-rendered SVG API',
      ],
    },
    {
      '@type': 'Organization',
      name: 'Natraj-X',
      url: CREATOR_URL,
      description:
        'AI Engineering agency building production-grade ML pipelines, data products, and full-stack applications for startups and enterprises.',
      sameAs: [CREATOR_URL],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        {/* Canonical backlink to Natraj-X — crawlable by Google */}
        <link rel="author" href={CREATOR_URL} title="Natraj-X AI Engineering"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
