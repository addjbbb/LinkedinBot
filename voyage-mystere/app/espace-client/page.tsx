'use client'

import { useState } from 'react'
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
} from 'lucide-react'

export default function EspaceClientPage() {
  const [activeTab, setActiveTab] = useState('reservations')

  // Mock user data
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.fr',
    phone: '06 12 34 56 78',
    memberSince: '2024-01-15',
  }

  // Mock bookings data
  const bookings = [
    {
      id: 'VM-2024-11-0001',
      theme: 'Romantique',
      status: 'confirmed',
      startDate: '2024-12-15',
      endDate: '2024-12-17',
      guests: 2,
      totalPrice: 890,
      destination: null, // Not revealed yet
      revealCode: null,
    },
    {
      id: 'VM-2024-08-0042',
      theme: 'Nature',
      status: 'completed',
      startDate: '2024-08-20',
      endDate: '2024-08-22',
      guests: 2,
      totalPrice: 750,
      destination: 'Cabane perchée dans les Vosges',
      hasReview: false,
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      confirmed: { variant: 'success', label: 'Confirmé' },
      pending: { variant: 'warning', label: 'En attente' },
      completed: { variant: 'default', label: 'Terminé' },
      cancelled: { variant: 'error', label: 'Annulé' },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Bonjour {user.firstName} ! 👋
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
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge variant="primary" className="mt-2">
                    <Star className="w-3 h-3 mr-1" />
                    Membre Premium
                  </Badge>
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
                    onClick={() => setActiveTab('favoris')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'favoris'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Favoris
                  </button>

                  <button
                    onClick={() => setActiveTab('cartes-cadeaux')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'cartes-cadeaux'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Gift className="w-5 h-5 mr-3" />
                    Cartes cadeaux
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

                  <button
                    onClick={() => setActiveTab('paiements')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'paiements'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Paiements
                  </button>

                  <button
                    onClick={() => setActiveTab('parametres')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'parametres'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Paramètres
                  </button>

                  <hr className="my-2" />

                  <Link
                    href="/login"
                    className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Déconnexion
                  </Link>
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
                              Voyage {booking.theme}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Réservation n° {booking.id}
                          </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-2xl font-bold text-primary-600">
                            {booking.totalPrice}€
                          </p>
                          <p className="text-sm text-gray-600">pour {booking.guests} personnes</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                          <div>
                            <p className="text-sm text-gray-600">Dates</p>
                            <p className="font-semibold">
                              {new Date(booking.startDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                              })}{' '}
                              -{' '}
                              {new Date(booking.endDate).toLocaleDateString('fr-FR', {
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
                              {booking.destination || '🎭 Mystère (révélation dans 48h)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'confirmed' && !booking.destination && (
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

                      {booking.status === 'completed' && !booking.hasReview && (
                        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <Star className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Partagez votre expérience
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  Votre avis nous aide à améliorer nos services
                                </p>
                              </div>
                            </div>
                            <Button variant="primary" size="sm">
                              Laisser un avis
                            </Button>
                          </div>
                        </div>
                      )}

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
                          defaultValue={user.firstName}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          defaultValue={user.lastName}
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

                    <Button variant="primary">
                      Enregistrer les modifications
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab !== 'reservations' && activeTab !== 'profil' && (
              <Card>
                <CardBody className="p-12 text-center">
                  <p className="text-gray-600">
                    Section "{activeTab}" en cours de développement...
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
