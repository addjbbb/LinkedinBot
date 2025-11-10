'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase'

interface QuestionnaireData {
  occasion: string
  travelerStyle: string[]
  rhythm: string
  budget: string
  dietaryRestrictions: string[]
  mobility: string
  phobias: string[]
  visitedRegions: string[]
  maxDistance: number
  transportPreference: string
  accommodationType: string
  preferredTime: string
  desiredExperience: string
  musicPreference: string
}

export default function QuestionnairePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const bookingId = searchParams.get('booking_id')
  const theme = searchParams.get('theme')

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 5

  const [formData, setFormData] = useState<QuestionnaireData>({
    occasion: '',
    travelerStyle: [],
    rhythm: '',
    budget: '',
    dietaryRestrictions: [],
    mobility: '',
    phobias: [],
    visitedRegions: [],
    maxDistance: 300,
    transportPreference: '',
    accommodationType: '',
    preferredTime: '',
    desiredExperience: '',
    musicPreference: '',
  })

  const updateField = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: keyof QuestionnaireData, value: string) => {
    const currentArray = formData[field] as string[]
    if (currentArray.includes(value)) {
      updateField(field, currentArray.filter((item) => item !== value))
    } else {
      updateField(field, [...currentArray, value])
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (!bookingId) {
      showToast('Erreur: ID de réservation manquant', 'error')
      return
    }

    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      showToast('Vous devez être connecté pour soumettre le questionnaire', 'error')
      router.push('/auth/connexion')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookingId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        showToast('Votre session a expiré. Veuillez vous reconnecter.', 'error')
        router.push('/auth/connexion')
        return
      }

      if (data.success) {
        showToast('Questionnaire enregistré avec succès !', 'success')
        router.push(`/reserver/recapitulatif?booking_id=${bookingId}&theme=${theme}`)
      } else {
        showToast('Erreur lors de l\'enregistrement', 'error')
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      showToast('Une erreur est survenue', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              🎉 Parlez-nous de votre voyage
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quelle est l'occasion de ce voyage ?
              </label>
              <Select
                value={formData.occasion}
                onChange={(value) => updateField('occasion', value)}
                options={[
                  { label: 'Choisir une occasion', value: '', disabled: true },
                  { label: 'Week-end en amoureux', value: 'romantic' },
                  { label: 'Anniversaire', value: 'birthday' },
                  { label: 'Demande en mariage', value: 'proposal' },
                  { label: 'Anniversaire de mariage', value: 'anniversary' },
                  { label: 'Retrouvailles entre amis', value: 'friends' },
                  { label: 'Escapade familiale', value: 'family' },
                  { label: 'Juste pour le plaisir', value: 'leisure' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quel type de voyageurs êtes-vous ? (plusieurs choix possibles)
              </label>
              <div className="space-y-3">
                {[
                  { value: 'adventure', label: 'Aventuriers (sensations fortes, activités sportives)' },
                  { value: 'romantic', label: 'Romantiques (dîners aux chandelles, spas)' },
                  { value: 'cultural', label: 'Culturels (musées, patrimoine, histoire)' },
                  { value: 'foodie', label: 'Gourmets (gastronomie, œnotourisme)' },
                  { value: 'nature', label: 'Nature lovers (randos, panoramas)' },
                  { value: 'chill', label: 'Zen (repos, détente, slow travel)' },
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.travelerStyle.includes(option.value)}
                    onChange={() => toggleArrayField('travelerStyle', option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quel rythme préférez-vous ?
              </label>
              <Select
                value={formData.rhythm}
                onChange={(value) => updateField('rhythm', value)}
                options={[
                  { label: 'Choisir un rythme', value: '', disabled: true },
                  { label: 'Intense - Programme complet du matin au soir', value: 'intense' },
                  { label: 'Équilibré - Mix activités et temps libre', value: 'balanced' },
                  { label: 'Relax - Beaucoup de temps libre, peu d\'impératifs', value: 'relaxed' },
                ]}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              🍽️ Vos préférences pratiques
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget global souhaité (hors transport)
              </label>
              <Select
                value={formData.budget}
                onChange={(value) => updateField('budget', value)}
                options={[
                  { label: 'Choisir un budget', value: '', disabled: true },
                  { label: '700-900€ - L\'essentiel avec qualité', value: '700-900' },
                  { label: '900-1200€ - Confort et expériences premium', value: '900-1200' },
                  { label: '1200€+ - Luxe et prestige', value: '1200+' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Restrictions alimentaires ou régimes particuliers ?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Aucune' },
                  { value: 'vegetarian', label: 'Végétarien' },
                  { value: 'vegan', label: 'Vegan' },
                  { value: 'gluten', label: 'Sans gluten' },
                  { value: 'lactose', label: 'Sans lactose' },
                  { value: 'allergies', label: 'Allergies spécifiques (préciser en commentaires)' },
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.dietaryRestrictions.includes(option.value)}
                    onChange={() => toggleArrayField('dietaryRestrictions', option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobilité / Accessibilité
              </label>
              <Select
                value={formData.mobility}
                onChange={(value) => updateField('mobility', value)}
                options={[
                  { label: 'Choisir une option', value: '', disabled: true },
                  { label: 'Aucune contrainte - Randos et activités physiques OK', value: 'full' },
                  { label: 'Mobilité réduite - Préférer des lieux accessibles', value: 'reduced' },
                  { label: 'Besoin d\'aménagements spécifiques (préciser)', value: 'special' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Phobies ou choses à éviter absolument ?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'heights', label: 'Hauteurs / Vertige' },
                  { value: 'water', label: 'Eau profonde / Natation' },
                  { value: 'animals', label: 'Certains animaux' },
                  { value: 'crowds', label: 'Foules / Lieux très touristiques' },
                  { value: 'enclosed', label: 'Espaces confinés' },
                  { value: 'none', label: 'Aucune' },
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.phobias.includes(option.value)}
                    onChange={() => toggleArrayField('phobias', option.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              📍 Géographie et découverte
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Régions françaises déjà visitées (on évitera de vous y renvoyer)
              </label>
              <div className="space-y-3">
                {[
                  { value: 'bretagne', label: 'Bretagne' },
                  { value: 'normandie', label: 'Normandie' },
                  { value: 'provence', label: 'Provence / Côte d\'Azur' },
                  { value: 'alpes', label: 'Alpes' },
                  { value: 'alsace', label: 'Alsace' },
                  { value: 'pays-loire', label: 'Pays de la Loire / Châteaux' },
                  { value: 'pyrenees', label: 'Pyrénées / Sud-Ouest' },
                  { value: 'bourgogne', label: 'Bourgogne' },
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.visitedRegions.includes(option.value)}
                    onChange={() => toggleArrayField('visitedRegions', option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance maximale acceptable depuis chez vous
              </label>
              <Input
                type="number"
                value={formData.maxDistance}
                onChange={(e) => updateField('maxDistance', parseInt(e.target.value) || 300)}
                helperText="En kilomètres"
              />
              <div className="mt-2 text-sm text-gray-600">
                Distance actuelle: {formData.maxDistance} km
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moyen de transport préféré
              </label>
              <Select
                value={formData.transportPreference}
                onChange={(value) => updateField('transportPreference', value)}
                options={[
                  { label: 'Choisir un moyen de transport', value: '', disabled: true },
                  { label: 'Voiture - Je préfère conduire', value: 'car' },
                  { label: 'Train - Plus écolo et reposant', value: 'train' },
                  { label: 'Peu importe - Le plus pratique', value: 'any' },
                ]}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              🏨 Hébergement et ambiance
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'hébergement préféré
              </label>
              <Select
                value={formData.accommodationType}
                onChange={(value) => updateField('accommodationType', value)}
                options={[
                  { label: 'Choisir un type d\'hébergement', value: '', disabled: true },
                  { label: 'Hôtel de charme / Boutique hotel', value: 'boutique' },
                  { label: 'Chambre d\'hôtes authentique', value: 'bnb' },
                  { label: 'Cabane / Hébergement insolite', value: 'unusual' },
                  { label: 'Gîte ou chalet indépendant', value: 'cottage' },
                  { label: 'Spa hotel / Luxe', value: 'luxury' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moment préféré de la journée
              </label>
              <Select
                value={formData.preferredTime}
                onChange={(value) => updateField('preferredTime', value)}
                options={[
                  { label: 'Choisir un moment', value: '', disabled: true },
                  { label: 'Lever de soleil - J\'adore les matins', value: 'sunrise' },
                  { label: 'Journée - Actif en pleine lumière', value: 'daytime' },
                  { label: 'Coucher de soleil - Golden hour magique', value: 'sunset' },
                  { label: 'Soirée / Nuit - Ambiance nocturne', value: 'evening' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiance musicale qui vous correspond
              </label>
              <Select
                value={formData.musicPreference}
                onChange={(value) => updateField('musicPreference', value)}
                options={[
                  { label: 'Choisir une ambiance', value: '', disabled: true },
                  { label: 'Jazz / Blues - Douceur et élégance', value: 'jazz' },
                  { label: 'Classique / Opéra - Raffinement', value: 'classical' },
                  { label: 'Pop / Indie - Moderne et dynamique', value: 'pop' },
                  { label: 'Électro / House - Énergique', value: 'electronic' },
                  { label: 'Folk / Acoustique - Nature et authenticité', value: 'folk' },
                  { label: 'Silence - J\'aime le calme', value: 'silence' },
                ]}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              ✨ La touche finale
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Si vous deviez résumer l'expérience rêvée pour ce voyage en une phrase ?
              </label>
              <Input
                type="text"
                value={formData.desiredExperience}
                onChange={(e) => updateField('desiredExperience', e.target.value)}
                placeholder="Ex: Un week-end cocooning avec spa et bonne bouffe"
                helperText="Soyez spontané, ça nous aide énormément !"
              />
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                📝 Récapitulatif de vos réponses
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div><strong>Occasion:</strong> {formData.occasion || 'Non renseigné'}</div>
                <div><strong>Style de voyage:</strong> {formData.travelerStyle.join(', ') || 'Non renseigné'}</div>
                <div><strong>Rythme:</strong> {formData.rhythm || 'Non renseigné'}</div>
                <div><strong>Budget:</strong> {formData.budget || 'Non renseigné'}</div>
                <div><strong>Transport:</strong> {formData.transportPreference || 'Non renseigné'}</div>
                <div><strong>Hébergement:</strong> {formData.accommodationType || 'Non renseigné'}</div>
              </div>
            </div>

            <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-6 text-center">
              <Sparkles className="w-12 h-12 text-accent-600 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">
                Merci pour ces précieuses informations ! <br />
                Nous allons créer l'aventure parfaite pour vous. 🎉
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Questionnaire Card */}
        <Card>
          <CardHeader>
            <div className="text-center">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Questionnaire personnalisé
              </h1>
              <p className="text-gray-600">
                Aidez-nous à créer le voyage mystère parfait pour vous
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-100">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>

              {currentStep < totalSteps ? (
                <Button variant="primary" onClick={handleNext}>
                  Suivant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Valider le questionnaire
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
