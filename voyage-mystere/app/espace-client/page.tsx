'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  Clock,
  Download,
  Star,
  Settings,
  LogOut,
  CreditCard,
  Package,
  User,
  Bell,
  Heart,
  Gift,
  FileEdit,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'

interface Booking {
  id: string
  booking_number: string
  user_id: string
  theme: string
  start_date: string
  end_date: string
  num_guests: number
  total_price: number
  status: string
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
}

interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  my_referral_code?: string
  created_at: string
}

export default function EspaceClientPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('reservations')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/auth/connexion')
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({
          id: authUser.id,
          email: profile.email || authUser.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          my_referral_code: profile.my_referral_code,
          created_at: profile.created_at,
        })
      }

      // Get user bookings
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const response = await fetch(`/api/user/bookings?userId=${authUser.id}&email=${authUser.email}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBookings(data.bookings || [])
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      showToast('Erreur lors du chargement des données', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      showToast('Erreur lors de la déconnexion', 'error')
    }
  }

  const handleResumeBooking = (booking: Booking) => {
    // Resume draft booking
    if (booking.status === 'draft') {
      // Redirect to summary/recapitulatif page to continue booking process
      const params = new URLSearchParams({
        booking_id: booking.id,
        theme: booking.theme,
        total: booking.total_price.toString(),
      })
      router.push(`/reserver/recapitulatif?${params.toString()}`)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      confirmed: { variant: 'success', label: 'Confirmé' },
      pending: { variant: 'warning', label: 'En attente' },
      draft: { variant: 'default', label: 'Brouillon' },
      completed: { variant: 'default', label: 'Terminé' },
      cancelled: { variant: 'error', label: 'Annulé' },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getThemeEmoji = (theme: string) => {
    const emojis: Record<string, string> = {
      romantique: '💕',
      nature: '🌲',
      urbain: '🏙️',
    }
    return emojis[theme] || '✨'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
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
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Bonjour {user.first_name || 'Voyageur'} ! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans votre espace personnel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {(user.first_name?.[0] || 'V').toUpperCase()}{(user.last_name?.[0] || 'M').toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.my_referral_code && (
                    <div className="mt-2 px-3 py-1 bg-primary-50 rounded-full">
                      <p className="text-xs font-semibold text-primary-700">
                        Code: {user.my_referral_code}
                      </p>
                    </div>
                  )}
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'reservations'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    Mes réservations
                  </button>

                  <button
                    onClick={() => setActiveTab('profil')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profil'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Mon profil
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
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
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Mes réservations
                  </h2>
                  <Link href="/reserver">
                    <Button variant="primary">
                      <Calendar className="w-5 h-5 mr-2" />
                      Nouvelle réservation
                    </Button>
                  </Link>
                </div>

                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardBody className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {getThemeEmoji(booking.theme)} Voyage {booking.theme}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Réservation n° {booking.booking_number}
                          </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-2xl font-bold text-primary-600">
                            {booking.total_price}€
                          </p>
                          <p className="text-sm text-gray-600">pour {booking.num_guests} personne{booking.num_guests > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                          <div>
                            <p className="text-sm text-gray-600">Dates</p>
                            <p className="font-semibold">
                              {new Date(booking.start_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                              })}{' '}
                              -{' '}
                              {new Date(booking.end_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                          <div>
                            <p className="text-sm text-gray-600">Destination</p>
                            <p className="font-semibold">
                              🎭 Mystère (révélation dans 48h)
                            </p>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'draft' && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <FileEdit className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Réservation en cours
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  Finalisez votre réservation pour recevoir la boîte mystère
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleResumeBooking(booking)}
                            >
                              Reprendre
                            </Button>
                          </div>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="bg-accent-50 border-l-4 border-accent-500 p-4 mb-4">
                          <div className="flex items-start">
                            <Clock className="w-5 h-5 text-accent-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                Code de révélation en attente
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                Vous recevrez le code secret par email 48h avant votre départ
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {booking.status !== 'draft' && (
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger la facture
                          </Button>
                          {booking.status === 'confirmed' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Package className="w-4 h-4 mr-2" />
                                Suivi de la boîte
                              </Button>
                              <Button variant="outline" size="sm">
                                Modifier les dates
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Annuler la réservation
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}

                {bookings.length === 0 && (
                  <Card>
                    <CardBody className="p-12 text-center">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucune réservation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Commencez votre aventure mystère dès aujourd'hui !
                      </p>
                      <Link href="/reserver">
                        <Button variant="primary" size="lg">
                          Réserver mon voyage
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'profil' && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Mon profil
                  </h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          defaultValue={user.first_name}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          defaultValue={user.last_name}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>

                    {user.my_referral_code && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code de parrainage
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={user.my_referral_code}
                            readOnly
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(user.my_referral_code!)
                              showToast('Code copié !', 'success')
                            }}
                          >
                            Copier
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Partagez ce code avec vos amis pour gagner des réductions !
                        </p>
                      </div>
                    )}

                    <Button variant="primary">
                      Enregistrer les modifications
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
