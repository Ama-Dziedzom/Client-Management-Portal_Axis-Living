import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/studio/', '/api/'],
        },
        sitemap: 'https://axisliving.co.zm/sitemap.xml',
    }
}
