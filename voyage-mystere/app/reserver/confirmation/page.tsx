'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { CheckCircle, Calendar, Mail, Package, Sparkles, Download, Home } from 'lucide-react'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [bookingData, setBookingData] = useState({
    bookingNumber: 'VM-2024-11-1234',
    email: 'exemple@email.com',
    theme: 'Romantique',
    startDate: '2024-12-15',
    totalPrice: 890,
  })

  useEffect(() => {
    // In a real app, fetch booking details using session_id
    // For now, using mock data
    if (sessionId) {
      console.log('Fetching booking details for session:', sessionId)
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Réservation confirmée ! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Votre aventure mystère commence maintenant
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Détails de votre réservation
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Numéro de réservation</div>
                <div className="font-bold text-xl text-primary-600">{bookingData.bookingNumber}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Email de confirmation</div>
                <div className="font-semibold text-gray-900">{bookingData.email}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Thématique</div>
                <div className="font-semibold text-gray-900">{bookingData.theme}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Date de début</div>
                <div className="font-semibold text-gray-900">
                  {new Date(bookingData.startDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-100 bg-primary-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Montant payé</span>
                <span className="text-2xl font-bold text-primary-600">{bookingData.totalPrice}€</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Next Steps Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Et maintenant ? 📅
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Maintenant</h3>
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Fait ✓
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Email de confirmation envoyé</strong> - Vérifiez votre boîte email (et les spams). Vous y trouverez tous les détails de votre réservation et notre numéro d'assistance.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-accent-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">J-10</h3>
                    <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      À venir
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Livraison de votre boîte mystère</strong> - 10 jours avant votre départ, vous recevrez un colis élégant contenant votre carnet de voyage personnalisé (mais toujours mystérieux !).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">J-2</h3>
                    <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      À venir
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Révélation de la destination</strong> - Vous recevrez par email un code secret. Entrez-le dans votre espace client pour découvrir ENFIN où vous allez !
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-accent-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Jour J</h3>
                    <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      À venir
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <strong>C'est parti pour l'aventure !</strong> - Suivez votre carnet de voyage et laissez-vous guider. Notre équipe est joignable 7j/7 en cas de besoin.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Important Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                📞 Besoin d'aide ?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Notre service client est disponible 7j/7 pour répondre à toutes vos questions.
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>{' '}
                  <a href="mailto:contact@voyage-mystere.fr" className="text-primary-600 hover:underline">
                    contact@voyage-mystere.fr
                  </a>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>{' '}
                  <a href="tel:+33123456789" className="text-primary-600 hover:underline">
                    01 23 45 67 89
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                ℹ️ Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Annulation gratuite jusqu'à J-30</li>
                <li>• Modifications possibles jusqu'à J-15</li>
                <li>• Assistance 7j/7 pendant votre voyage</li>
                <li>• Assurance annulation disponible</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>

          <Button variant="primary" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Télécharger la confirmation (PDF)
          </Button>
        </div>

        {/* Social Sharing */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Partagez votre excitation (sans révéler la destination !) 🤫
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="ghost" size="sm">
              Partager sur Facebook
            </Button>
            <Button variant="ghost" size="sm">
              Partager sur Twitter
            </Button>
            <Button variant="ghost" size="sm">
              Partager sur Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
