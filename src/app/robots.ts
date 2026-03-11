// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/'],   // Don't index SVG API endpoints
            },
        ],
        sitemap: 'https://metal-forage.vercel.app/sitemap.xml',
        host: 'https://metal-forage.vercel.app',
    }
}