import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MetalForge — Advanced GitHub README Component Kit',
  description:
    'Generate metallic SVG banners, stat cards, buttons, badges and dividers for your GitHub profile README. Chrome, gold, titanium, neon and more.',
  keywords: ['github readme', 'svg generator', 'metallic', 'banner', 'profile'],
  openGraph: {
    title: 'MetalForge',
    description: 'Advanced GitHub README metallic SVG components',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
