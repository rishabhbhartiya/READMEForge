// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers on all pages
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // SVG render endpoints — not useful to index
          '/api/proxy',   // Image proxy — definitely not
        ],
      },
      {
        // Explicitly allow Googlebot everything except API
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://readmeforge.natrajx.in/sitemap.xml',
    host:    'https://readmeforge.natrajx.in',
  }
}
