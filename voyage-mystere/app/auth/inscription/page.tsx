'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast'
import { signUp } from '@/lib/auth'
import { UserPlus, ArrowLeft } from 'lucide-react'

export default function InscriptionPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions générales'
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
      await signUp(formData.email, formData.password, formData.firstName, formData.lastName)
      showToast('Compte créé avec succès ! Vérifiez votre email.', 'success')
      router.push('/auth/connexion')
    } catch (error: any) {
      console.error('Sign up error:', error)
      if (error.message.includes('already registered')) {
        showToast('Cet email est déjà utilisé', 'error')
      } else {
        showToast('Erreur lors de la création du compte', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                <UserPlus className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Créer un compte
              </h1>
              <p className="text-gray-600">
                Rejoignez l'aventure Voyage Mystère
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                placeholder="vous@exemple.fr"
              />

              <Input
                label="Mot de passe *"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                placeholder="••••••••"
                helperText="Au moins 8 caractères"
              />

              <Input
                label="Confirmer le mot de passe *"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />

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
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
                {errors.agreeTerms && (
                  <div className="text-sm text-red-600 mt-1 ml-6">{errors.agreeTerms}</div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Créer mon compte
              </Button>

              <div className="text-center text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/auth/connexion" className="text-primary-600 hover:underline font-semibold">
                  Se connecter
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
