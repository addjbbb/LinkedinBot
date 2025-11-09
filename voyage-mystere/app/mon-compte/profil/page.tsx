'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { updateProfile } from '@/lib/auth'
import {
  User,
  Package,
  Gift,
  LogOut,
  Save,
  Mail,
  Phone,
  UserCircle,
} from 'lucide-react'

export default function ProfilPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: '',
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }

    if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast('Veuillez corriger les erreurs', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      await updateProfile(user!.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      })
      showToast('Profil mis à jour avec succès !', 'success')
    } catch (error) {
      console.error('Update profile error:', error)
      showToast('Erreur lors de la mise à jour du profil', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
            Mon Profil
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos informations personnelles
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
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Package className="w-5 h-5 mr-3" />
                    Mes réservations
                  </Link>
                  <Link
                    href="/mon-compte/profil"
                    className="flex items-center px-4 py-3 text-gray-900 bg-primary-50 rounded-lg font-medium"
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
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Informations personnelles
                </h2>
              </CardHeader>

              <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center pb-6 border-b-2 border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Prénom *"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      error={errors.firstName}
                      placeholder="Jean"
                    />
                    <Input
                      label="Nom *"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      error={errors.lastName}
                      placeholder="Dupont"
                    />
                  </div>

                  <div>
                    <Input
                      label="Email"
                      type="email"
                      value={user.email}
                      disabled
                      helperText="L'email ne peut pas être modifié"
                    />
                  </div>

                  <div>
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="pt-4 border-t-2 border-gray-100">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            {/* Security Section */}
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Sécurité
                </h2>
              </CardHeader>

              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Mot de passe
                      </h3>
                      <p className="text-sm text-gray-600">
                        Dernière modification: Jamais
                      </p>
                    </div>
                    <Link href="/auth/mot-de-passe-oublie">
                      <Button variant="outline">
                        Modifier
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Suppression du compte
                      </h3>
                      <p className="text-sm text-gray-600">
                        Supprimer définitivement votre compte et toutes vos données
                      </p>
                    </div>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50">
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
