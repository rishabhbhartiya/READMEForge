// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://readmeforge.natrajx.in'
  const now  = new Date()

  return [
    // Core pages — highest priority
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/api-reference`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Component builder deep-links (via ?tab= params)
    ...([
      'banner', 'card', 'button', 'badge',
      'text', 'progress', 'terminal', 'divider',
      'header', 'footer', 'neo', 'glass',
      'logo', 'social', 'image', 'showcase',
    ] as const).map(tab => ({
      url: `${base}/?tab=${tab}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
