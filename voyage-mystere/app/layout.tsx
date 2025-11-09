import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

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
  title: 'Voyage Mystère Premium - Week-end Surprise Haut de Gamme',
  description: "Vivez l'émotion d'un voyage surprise ! Destination révélée 48h avant. 2 nuits tout compris dès 700€. Réservez votre aventure.",
  keywords: ['voyage mystère', 'week-end surprise', 'voyage surprise', 'cadeau original', 'week-end romantique'],
  openGraph: {
    title: 'Voyage Mystère Premium',
    description: 'Destination révélée 48h avant. L\'aventure commence maintenant.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
