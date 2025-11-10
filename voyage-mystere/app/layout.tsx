import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toast'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SITE_ORGANIZATION_SCHEMA } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr'),
  title: {
    default: 'Voyage Mystère Premium - Week-end Surprise Haut de Gamme',
    template: '%s | Voyage Mystère Premium',
  },
  description: "Vivez l'émotion d'un voyage surprise ! Destination révélée 48h avant. 2 nuits tout compris dès 700€. Réservez votre aventure.",
  keywords: ['voyage mystère', 'week-end surprise', 'voyage surprise', 'cadeau original', 'week-end romantique', 'weekend insolite', 'voyage à l\'aveugle'],
  authors: [{ name: 'Voyage Mystère Premium' }],
  creator: 'Voyage Mystère Premium',
  publisher: 'Voyage Mystère Premium',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://voyage-mystere.fr',
    siteName: 'Voyage Mystère Premium',
    title: 'Voyage Mystère Premium - Week-end Surprise Haut de Gamme',
    description: 'Destination révélée 48h avant. L\'aventure commence maintenant.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voyage Mystère Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voyage Mystère Premium',
    description: 'Destination révélée 48h avant. L\'aventure commence maintenant.',
    creator: '@voyagemystere',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_ORGANIZATION_SCHEMA),
          }}
        />
      </head>
      <body className="font-body antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="pt-20">{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
