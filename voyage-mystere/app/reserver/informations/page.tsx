'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function InformationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const bookingId = searchParams.get('booking_id')
  const theme = searchParams.get('theme')
  const total = searchParams.get('total')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    specialRequests: '',
    agreeTerms: false,
    agreeMarketing: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Validate booking exists and load user information
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // First, verify the booking exists
        if (bookingId) {
          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('id, status')
            .eq('id', bookingId)
            .maybeSingle()

          if (!booking || bookingError) {
            showToast('Cette réservation n\'existe pas ou a été supprimée', 'error')
            router.push('/reserver')
            return
          }
        } else {
          showToast('ID de réservation manquant', 'error')
          router.push('/reserver')
          return
        }

        // Load user info
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('first_name, last_name, phone, email')
            .eq('id', user.id)
            .single()

          if (profile) {
            setFormData((prev) => ({
              ...prev,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              email: profile.email || user.email || '',
              phone: profile.phone || '',
            }))
          } else {
            // Fallback to auth email if no profile
            setFormData((prev) => ({
              ...prev,
              email: user.email || '',
            }))
          }
        }
      } catch (error) {
        console.error('Error loading user info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserInfo()
  }, [bookingId, router])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis'
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide (5 chiffres)'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions générales'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Veuillez corriger les erreurs du formulaire', 'error')
      return
    }

    if (!bookingId) {
      showToast('Erreur: ID de réservation manquant', 'error')
      return
    }

    // Get authentication session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      showToast('Vous devez être connecté pour continuer', 'error')
      router.push('/auth/connexion')
      return
    }

    setIsSubmitting(true)

    try {
      // Update booking with user information
      const response = await fetch(`/api/bookings/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookingId,
          userEmail: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
          specialRequests: formData.specialRequests,
          totalPrice: parseFloat(total || '0'),
          status: 'pending', // Update status to pending when info is complete
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        showToast('Votre session a expiré. Veuillez vous reconnecter.', 'error')
        router.push('/auth/connexion')
        return
      }

      if (data.success) {
        showToast('Informations enregistrées avec succès !', 'success')

        const params = new URLSearchParams({
          booking_id: bookingId,
          theme: theme || '',
          total: total || '',
        })

        router.push(`/reserver/paiement?${params.toString()}`)
      } else {
        showToast(`Erreur: ${data.error || 'Erreur lors de l\'enregistrement'}`, 'error')
      }
    } catch (error) {
      console.error('Error saving information:', error)
      showToast('Une erreur est survenue', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Vos informations
          </h1>
          <p className="text-lg text-gray-600">
            Pour finaliser votre réservation et recevoir votre boîte mystère
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Informations du voyageur principal
                </h2>
              </CardHeader>

              <CardBody className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Prénom *"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      error={errors.firstName}
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <Input
                      label="Nom *"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      error={errors.lastName}
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                    placeholder="jean.dupont@exemple.fr"
                    helperText="Pour recevoir votre confirmation et le code de révélation"
                  />
                </div>

                <div>
                  <Input
                    label="Téléphone *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="06 12 34 56 78"
                    helperText="En cas d'urgence pendant votre voyage"
                  />
                </div>

                {/* Address */}
                <div className="pt-4 border-t-2 border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Adresse de livraison de la boîte mystère
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Adresse *"
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      error={errors.address}
                      placeholder="12 rue de la Paix"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Code postal *"
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        error={errors.postalCode}
                        placeholder="75001"
                      />

                      <Input
                        label="Ville *"
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        error={errors.city}
                        placeholder="Paris"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="pt-4 border-t-2 border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Demandes spéciales (optionnel)
                  </h3>

                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    placeholder="Ex: Occasion d'anniversaire, allergie non mentionnée, préférence particulière..."
                    rows={4}
                    helperText="Nous ferons de notre mieux pour accommoder vos demandes"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="pt-4 border-t-2 border-gray-100 space-y-3">
                  <div>
                    <Checkbox
                      label={
                        <span>
                          J'accepte les{' '}
                          <a href="/cgv" className="text-primary-600 hover:underline" target="_blank">
                            conditions générales de vente
                          </a>{' '}
                          et la{' '}
                          <a href="/confidentialite" className="text-primary-600 hover:underline" target="_blank">
                            politique de confidentialité
                          </a>{' '}
                          *
                        </span>
                      }
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                    />
                    {errors.agreeTerms && (
                      <div className="text-sm text-red-600 mt-1 ml-6">{errors.agreeTerms}</div>
                    )}
                  </div>

                  <Checkbox
                    label="J'accepte de recevoir des offres et actualités de Voyage Mystère par email"
                    checked={formData.agreeMarketing}
                    onChange={(e) => updateField('agreeMarketing', e.target.checked)}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-display font-bold text-gray-900">
                    Récapitulatif
                  </h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Formule {theme}</span>
                      <span className="font-semibold">{formatPrice(parseFloat(total || '0'))}</span>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-primary-600 text-2xl">
                          {formatPrice(parseFloat(total || '0'))}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Passer au paiement
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-600 pt-4 border-t-2 border-gray-100">
                      <p className="mb-2">🔒 Paiement 100% sécurisé par Stripe</p>
                      <p>💳 Accepte CB, Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
