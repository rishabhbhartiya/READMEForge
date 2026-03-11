// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://metal-forage.vercel.app'
    const now = new Date()

    return [
        {
            url: base,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // Individual component anchor pages — helps Google index each tool
        ...[
            '#banners', '#cards', '#buttons', '#badges',
            '#text-anim', '#extras', '#dividers', '#showcase',
        ].map(hash => ({
            url: `${base}/${hash}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ]
}