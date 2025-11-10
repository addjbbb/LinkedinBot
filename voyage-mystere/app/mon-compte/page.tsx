'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Booking } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { getSessionToken } from '@/lib/auth'
import {
  User,
  Calendar,
  MapPin,
  Gift,
  Settings,
  LogOut,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

export default function MonComptePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      // Get auth token
      const token = await getSessionToken()

      const response = await fetch(
        `/api/user/bookings?userId=${user?.id}&email=${user?.email}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.bookings) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: Clock },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    }

    const badge = badges[status] || badges.pending
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    )
  }

  const getThemeLabel = (theme: string) => {
    const themes: Record<string, string> = {
      romantique: 'Romantique',
      nature: 'Nature',
      urbain: 'Urbain',
    }
    return themes[theme] || theme
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Mon Espace Client
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenue {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-6">
                <nav className="space-y-2">
                  <Link
                    href="/mon-compte"
                    className="flex items-center px-4 py-3 text-gray-900 bg-primary-50 rounded-lg font-medium"
                  >
                    <Package className="w-5 h-5 mr-3" />
                    Mes réservations
                  </Link>
                  <Link
                    href="/mon-compte/profil"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Mon profil
                  </Link>
                  <Link
                    href="/parrainage"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Gift className="w-5 h-5 mr-3" />
                    Parrainage
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Déconnexion
                  </button>
                </nav>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">
                    {bookings.filter(b => ['confirmed', 'completed'].includes(b.status)).length}
                  </div>
                  <div className="text-sm text-gray-600">Voyages réalisés</div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6 text-center">
                  <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">
                    {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
                  </div>
                  <div className="text-sm text-gray-600">En cours</div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6 text-center">
                  <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">0€</div>
                  <div className="text-sm text-gray-600">Crédits disponibles</div>
                </CardBody>
              </Card>
            </div>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Mes Réservations
                  </h2>
                  <Link href="/reserver">
                    <Button variant="primary">
                      Nouvelle réservation
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardBody className="p-6">
                {loadingBookings ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des réservations...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune réservation
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Commencez votre première aventure mystère !
                    </p>
                    <Link href="/reserver">
                      <Button variant="primary" size="lg">
                        Réserver maintenant
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                Formule {getThemeLabel(booking.theme)}
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-gray-600">
                              Réservation #{booking.booking_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {formatPrice(booking.total_price)}
                            </div>
                            {booking.payment_status === 'paid' && (
                              <span className="text-sm text-green-600 flex items-center justify-end mt-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Payé
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                            <span>
                              {new Date(booking.start_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                              {' → '}
                              {new Date(booking.end_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <User className="w-5 h-5 mr-2 text-gray-400" />
                            <span>{booking.num_guests} voyageur(s)</span>
                          </div>
                        </div>

                        {booking.special_requests && (
                          <div className="mt-4 pt-4 border-t-2 border-gray-100">
                            <p className="text-sm text-gray-600">
                              <strong>Demandes spéciales:</strong> {booking.special_requests}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t-2 border-gray-100">
                          <div className="flex gap-2">
                            <Link href={`/mon-compte/reservations/${booking.id}`}>
                              <Button variant="outline" size="sm">
                                Voir les détails
                              </Button>
                            </Link>
                            {booking.status === 'confirmed' && (
                              <Button variant="primary" size="sm">
                                Télécharger les documents
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
