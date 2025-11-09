import { Metadata } from 'next'

interface PageSEOProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function generatePageSEO({
  title,
  description,
  path = '',
  image = '/images/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageSEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr'
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Voyage Mystère Premium',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@voyagemystere',
    },
    alternates: {
      canonical: url,
    },
  }
}

interface OrganizationSchemaProps {
  name: string
  url: string
  logo: string
  contactEmail: string
  contactPhone: string
  socialLinks: string[]
}

export function generateOrganizationSchema({
  name,
  url,
  logo,
  contactEmail,
  contactPhone,
  socialLinks,
}: OrganizationSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    contactPoint: {
      '@type': 'ContactPoint',
      email: contactEmail,
      telephone: contactPhone,
      contactType: 'customer service',
      areaServed: 'FR',
      availableLanguage: ['French'],
    },
    sameAs: socialLinks,
  }
}

interface ProductSchemaProps {
  name: string
  description: string
  price: number
  currency?: string
  url: string
  image: string
  rating?: {
    value: number
    count: number
  }
}

export function generateProductSchema({
  name,
  description,
  price,
  currency = 'EUR',
  url,
  image,
  rating,
}: ProductSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  }

  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
    }
  }

  return schema
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function generateFAQSchema({ questions }: FAQSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

interface ReviewSchemaProps {
  name: string
  rating: number
  reviewBody: string
  author: string
  datePublished: string
  itemReviewed: {
    name: string
    type: string
  }
}

export function generateReviewSchema({
  name,
  rating,
  reviewBody,
  author,
  datePublished,
  itemReviewed,
}: ReviewSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
    },
    reviewBody,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    itemReviewed: {
      '@type': itemReviewed.type,
      name: itemReviewed.name,
    },
  }
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function generateBreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Default organization schema for the site
export const SITE_ORGANIZATION_SCHEMA = generateOrganizationSchema({
  name: 'Voyage Mystère Premium',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr',
  logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr'}/logo.png`,
  contactEmail: 'contact@voyage-mystere.fr',
  contactPhone: '+33123456789',
  socialLinks: [
    'https://www.facebook.com/voyagemystere',
    'https://www.instagram.com/voyagemystere',
    'https://www.twitter.com/voyagemystere',
  ],
})
