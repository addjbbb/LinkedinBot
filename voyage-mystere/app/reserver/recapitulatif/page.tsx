'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, Calendar, Users, MapPin, Sparkles, Check } from 'lucide-react'
import { PRICING, calculateTotalPrice } from '@/lib/pricing'
import { formatPrice } from '@/lib/utils'

export default function RecapitulatifPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const bookingId = searchParams.get('booking_id')
  const theme = searchParams.get('theme') as 'romantique' | 'nature' | 'urbain' || 'romantique'

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null)

  const themeData = PRICING[theme]

  const toggleOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    } else {
      setSelectedOptions([...selectedOptions, optionId])
    }
  }

  const totalPrice = calculateTotalPrice(theme, selectedUpgrade, selectedOptions)

  const handleContinue = () => {
    if (!bookingId) {
      alert('Erreur: ID de réservation manquant')
      return
    }

    const params = new URLSearchParams({
      booking_id: bookingId,
      theme,
      total: totalPrice.toString(),
      upgrade: selectedUpgrade || '',
      options: selectedOptions.join(','),
    })

    router.push(`/reserver/informations?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Récapitulatif de votre voyage
          </h1>
          <p className="text-lg text-gray-600">
            Personnalisez encore plus votre expérience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Base Package */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Votre voyage {themeData.name}
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary-500 mt-1 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">2 nuits / 3 jours</div>
                      <div className="text-sm text-gray-600">Week-end mystère</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-primary-500 mt-1 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">2 personnes</div>
                      <div className="text-sm text-gray-600">Formule duo</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary-500 mt-1 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Destination mystère en France</div>
                      <div className="text-sm text-gray-600">Révélée 48h avant le départ</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                  <div className="font-semibold text-gray-900 mb-3">Inclus dans la formule de base :</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {themeData.baseInclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Upgrade Options */}
            {themeData.upgrade && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-display font-bold text-gray-900">
                    ✨ Passez à la version {themeData.upgrade.name}
                  </h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                          {themeData.upgrade.name}
                        </h3>
                        <p className="text-gray-700 text-sm">
                          {themeData.upgrade.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          +{formatPrice(themeData.upgrade.price)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {themeData.upgrade.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-700">
                          <Sparkles className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant={selectedUpgrade === 'upgrade' ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedUpgrade(selectedUpgrade === 'upgrade' ? null : 'upgrade')}
                    >
                      {selectedUpgrade === 'upgrade' ? 'Sélectionné ✓' : 'Ajouter cet upgrade'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Optional Add-ons */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  🎁 Options supplémentaires
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {PRICING.options.map((option) => (
                    <div
                      key={option.id}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        selectedOptions.includes(option.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Checkbox
                            label=""
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => toggleOption(option.id)}
                          />
                          <div className="ml-8 -mt-6">
                            <div className="font-semibold text-gray-900 mb-1">
                              {option.emoji} {option.name}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900">
                            +{formatPrice(option.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-display font-bold text-gray-900">
                    Résumé du prix
                  </h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Formule {themeData.name}</span>
                      <span>{formatPrice(themeData.basePrice)}</span>
                    </div>

                    {selectedUpgrade && themeData.upgrade && (
                      <div className="flex justify-between text-gray-700">
                        <span>{themeData.upgrade.name}</span>
                        <span className="text-accent-600">+{formatPrice(themeData.upgrade.price)}</span>
                      </div>
                    )}

                    {selectedOptions.map((optionId) => {
                      const option = PRICING.options.find((opt) => opt.id === optionId)
                      if (!option) return null
                      return (
                        <div key={optionId} className="flex justify-between text-gray-700">
                          <span>{option.name}</span>
                          <span className="text-accent-600">+{formatPrice(option.price)}</span>
                        </div>
                      )
                    })}

                    <div className="border-t-2 border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="font-bold text-primary-600 text-2xl">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 text-right mt-1">
                        pour 2 personnes
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-6"
                    onClick={handleContinue}
                  >
                    Continuer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Annulation gratuite jusqu'à 30 jours avant</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Paiement sécurisé par Stripe</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Garantie satisfait ou remboursé</span>
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
