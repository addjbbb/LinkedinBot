'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, Sparkles, User } from 'lucide-react'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Comment ça marche', href: '/comment-ca-marche' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Témoignages', href: '/temoignages' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Offrir', href: '/offrir' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-gradient-to-b from-white to-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display text-xl font-bold text-gray-900">
                Voyage Mystère
              </div>
              <div className="text-xs text-primary-600 font-medium">Premium</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/mon-compte">
                <Button variant="outline" size="md">
                  <User className="w-4 h-4 mr-2" />
                  Mon Compte
                </Button>
              </Link>
            ) : (
              <Link href="/auth/connexion">
                <Button variant="outline" size="md">
                  Connexion
                </Button>
              </Link>
            )}
            <Link href="/reserver">
              <Button variant="primary" size="md">
                Réserver maintenant
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              {user ? (
                <Link href="/mon-compte" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/connexion" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full">
                    Connexion
                  </Button>
                </Link>
              )}
              <Link href="/reserver" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="lg" className="w-full">
                  Réserver maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
