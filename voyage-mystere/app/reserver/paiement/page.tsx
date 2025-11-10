'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Lock, CreditCard, Shield, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function PaiementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const bookingId = searchParams.get('booking_id')
  const theme = searchParams.get('theme')
  const total = searchParams.get('total')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidBooking, setIsValidBooking] = useState(false)

  // Validate booking exists before allowing payment
  useEffect(() => {
    const validateBooking = async () => {
      if (!bookingId) {
        showToast('ID de réservation manquant', 'error')
        router.push('/reserver')
        return
      }

      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          showToast('Vous devez être connecté pour continuer', 'error')
          router.push('/auth/connexion?redirect=/reserver/paiement')
          return
        }

        // Check if booking exists and belongs to user
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('id, status, user_id, total_price')
          .eq('id', bookingId)
          .maybeSingle()

        if (!booking || bookingError) {
          console.error('Booking validation error:', bookingError)
          showToast('Cette réservation n\'existe pas ou a été supprimée', 'error')
          router.push('/espace-client')
          return
        }

        // Verify booking belongs to current user
        if (booking.user_id !== user.id) {
          showToast('Cette réservation ne vous appartient pas', 'error')
          router.push('/espace-client')
          return
        }

        // Verify booking is in correct status (draft or pending)
        if (!['draft', 'pending'].includes(booking.status)) {
          if (booking.status === 'confirmed') {
            showToast('Cette réservation a déjà été payée', 'info')
          } else {
            showToast('Cette réservation n\'est pas disponible pour le paiement', 'error')
          }
          router.push('/espace-client')
          return
        }

        setIsValidBooking(true)
      } catch (error) {
        console.error('Error validating booking:', error)
        showToast('Erreur lors de la vérification de la réservation', 'error')
        router.push('/espace-client')
      } finally {
        setIsValidating(false)
      }
    }

    validateBooking()
  }, [bookingId, router])

  const handlePayment = async () => {
    if (!bookingId || !theme || !total) {
      setError('Informations de réservation manquantes')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get auth session to include token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        showToast('Session expirée, reconnexion nécessaire', 'error')
        router.push('/auth/connexion')
        return
      }

      // Create Stripe Checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookingId,
          theme,
          amount: parseFloat(total),
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        showToast('Redirection vers le paiement sécurisé...', 'success')
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data)
        const errorMessage = data.message || data.error || 'Erreur lors de la création de la session de paiement'
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('Une erreur est survenue lors de la création de la session de paiement')
      showToast('Une erreur est survenue', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while validating booking
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de votre réservation...</p>
        </div>
      </div>
    )
  }

  // Don't render if booking is not valid (will redirect)
  if (!isValidBooking) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Lock className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Paiement sécurisé
          </h1>
          <p className="text-lg text-gray-600">
            Dernière étape avant de concrétiser votre aventure mystère
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Informations de paiement
                </h2>
              </CardHeader>

              <CardBody className="p-6">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start mb-4">
                    <Shield className="w-8 h-8 text-primary-600 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Paiement 100% sécurisé par Stripe
                      </h3>
                      <p className="text-sm text-gray-700">
                        Vos informations bancaires sont cryptées et ne transitent jamais par nos serveurs.
                        Stripe est utilisé par des millions d'entreprises dans le monde.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-lg p-3">
                      <CreditCard className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-700">CB, Visa, Mastercard</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <Lock className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-700">Cryptage SSL 256-bit</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <Shield className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-700">Conforme PCI-DSS</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Préparation du paiement...' : `Payer ${formatPrice(parseFloat(total || '0'))}`}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Vous serez redirigé vers Stripe pour finaliser le paiement de manière sécurisée
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Reassurance */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Vos garanties
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Annulation gratuite jusqu'à 30 jours avant
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vous changez d'avis ? Remboursement intégral si annulation avant J-30
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Garantie satisfait ou remboursé
                      </h3>
                      <p className="text-sm text-gray-600">
                        Si l'expérience ne correspond pas à vos attentes, nous vous remboursons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Service client 7j/7
                      </h3>
                      <p className="text-sm text-gray-600">
                        Notre équipe est disponible par email et téléphone pour vous accompagner
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-display font-bold text-gray-900">
                    Votre commande
                  </h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Thématique</div>
                      <div className="font-semibold text-gray-900 capitalize">{theme}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">Formule</div>
                      <div className="font-semibold text-gray-900">2 personnes • 2 nuits</div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total à payer</span>
                        <span className="font-bold text-primary-600 text-2xl">
                          {formatPrice(parseFloat(total || '0'))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux informations
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center text-gray-900 mb-6">
            Questions fréquentes sur le paiement
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Quand vais-je être débité ?
              </h3>
              <p className="text-sm text-gray-700">
                Le paiement est effectué immédiatement après validation. Vous recevrez une confirmation par email avec votre reçu.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je payer en plusieurs fois ?
              </h3>
              <p className="text-sm text-gray-700">
                Le paiement en plusieurs fois n'est pas disponible actuellement. Cependant, vous pouvez utiliser une carte bancaire avec option de paiement différé selon votre banque.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que se passe-t-il après le paiement ?
              </h3>
              <p className="text-sm text-gray-700">
                Vous recevrez immédiatement une confirmation par email. Votre boîte mystère sera expédiée 10 jours avant votre départ, et vous recevrez le code de révélation 48h avant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
