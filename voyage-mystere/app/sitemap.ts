import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr'

  const routes = [
    '',
    '/comment-ca-marche',
    '/destinations',
    '/destinations/romantique',
    '/destinations/nature',
    '/destinations/urbain',
    '/faq',
    '/temoignages',
    '/offrir',
    '/reserver',
    '/contact',
    '/cgv',
    '/mentions-legales',
    '/confidentialite',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.includes('/reserver') ? 0.9 : 0.8,
  }))
}
