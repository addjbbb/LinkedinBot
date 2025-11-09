'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Cookies from 'js-cookie'
import {
  Calendar,
  Users,
  Euro,
  TrendingUp,
  MapPin,
  Search,
  Download,
  Filter,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  LogOut,
  Shield,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { admin, loading, signOut } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0,
    avgRating: 0,
    monthlyGrowth: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login')
    }
  }, [admin, loading, router])

  useEffect(() => {
    if (admin) {
      fetchStats()
    }
  }, [admin])

  const fetchStats = async () => {
    try {
      const token = Cookies.get('admin_token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
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

  if (!admin) {
    return null
  }

  // Mock bookings
  const bookings = [
    {
      id: 'VM-2024-11-0128',
      customer: 'Marie Martin',
      email: 'marie.martin@exemple.fr',
      theme: 'Romantique',
      status: 'confirmed',
      startDate: '2024-12-20',
      price: 890,
      paid: true,
    },
    {
      id: 'VM-2024-11-0127',
      customer: 'Pierre Dubois',
      email: 'pierre.dubois@exemple.fr',
      theme: 'Nature',
      status: 'pending',
      startDate: '2024-12-18',
      price: 750,
      paid: false,
    },
    {
      id: 'VM-2024-11-0126',
      customer: 'Sophie Laurent',
      email: 'sophie.laurent@exemple.fr',
      theme: 'Urbain',
      status: 'confirmed',
      startDate: '2024-12-15',
      price: 1090,
      paid: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      confirmed: { variant: 'success', label: 'Confirmé', icon: CheckCircle },
      pending: { variant: 'warning', label: 'En attente', icon: Clock },
      cancelled: { variant: 'error', label: 'Annulé', icon: XCircle },
      completed: { variant: 'default', label: 'Terminé', icon: CheckCircle },
    }
    const config = variants[status] || variants.pending
    const Icon = config.icon
    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Voyage Mystère Premium - Gestion
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <p className="text-xs text-gray-600">{admin?.email}</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-5 h-5 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg p-2 mb-8 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Réservations
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Clients
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'destinations'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            Destinations
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-600" />
                    </div>
                    <Badge variant="success">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{stats.monthlyGrowth}%
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.totalBookings}
                  </h3>
                  <p className="text-sm text-gray-600">Total réservations</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent-600" />
                    </div>
                    <Badge variant="warning">{stats.pendingBookings} en attente</Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.pendingBookings}
                  </h3>
                  <p className="text-sm text-gray-600">À traiter</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Euro className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.revenue.toLocaleString('fr-FR')}€
                  </h3>
                  <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.avgRating}/5
                  </h3>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </CardBody>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Activité récente
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Nouvelle réservation</p>
                          <p className="text-sm text-gray-600">VM-2024-11-012{8 - i}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Il y a {i + 1}h</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email, numéro..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtres
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Bookings Table */}
            <Card>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Réservation
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Thème
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{booking.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{booking.customer}</div>
                            <div className="text-sm text-gray-600">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="primary">{booking.theme}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{booking.price}€</div>
                            <div className="text-xs text-gray-600">
                              {booking.paid ? '✓ Payé' : '⚠️ Non payé'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(booking.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Voir
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Other Tabs (placeholders) */}
        {(activeTab === 'customers' || activeTab === 'destinations') && (
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
  )
}
