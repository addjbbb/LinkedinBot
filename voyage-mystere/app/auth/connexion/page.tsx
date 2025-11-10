'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ValidatedInput } from '@/components/ui/validated-input'
import { useToast } from '@/components/ui/toast'
import { signIn } from '@/lib/auth'
import { useFormValidation, getFieldProps } from '@/hooks/useFormValidation'
import { LogIn, ArrowLeft } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const { showToast } = useToast()

  // Get redirect from URL without useSearchParams (can cause issues)
  const [redirectUrl, setRedirectUrl] = useState('/espace-client')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      if (redirect) {
        console.log('📍 Redirect URL found:', redirect)
        setRedirectUrl(redirect)
      }
    }
  }, [])

  // Real-time validation
  const validation = useFormValidation(
    { email: '', password: '' },
    {
      email: {
        required: 'L\'email est requis',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Email invalide',
        },
      },
      password: {
        required: 'Le mot de passe est requis',
        minLength: {
          value: 6,
          message: 'Le mot de passe doit contenir au moins 6 caractères',
        },
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const isValid = await validation.validateAll()
    if (!isValid) {
      showToast('Veuillez corriger les erreurs', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signIn(validation.values.email, validation.values.password)
      showToast('Connexion réussie !', 'success')

      // CRITICAL: Wait for Supabase session cookie to be written to browser
      await new Promise(resolve => setTimeout(resolve, 1000))

      window.location.replace(redirectUrl)
    } catch (error: any) {
      if (error.message && error.message.includes('Invalid login credentials')) {
        showToast('Email ou mot de passe incorrect', 'error')
      } else {
        showToast(`Erreur: ${error.message || 'Connexion impossible'}`, 'error')
      }
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
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Connexion
              </h1>
              <p className="text-gray-600">
                Accédez à votre espace client
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                label="Email"
                type="email"
                placeholder="vous@exemple.fr"
                required
                {...getFieldProps('email', validation)}
              />

              <ValidatedInput
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                required
                {...getFieldProps('password', validation)}
              />

              <div className="flex items-center justify-between text-sm">
                <Link href="/auth/mot-de-passe-oublie" className="text-primary-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/auth/inscription" className="text-primary-600 hover:underline font-semibold">
                  Créer un compte
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>En vous connectant, vous acceptez nos</p>
          <div className="flex justify-center gap-2">
            <Link href="/cgv" className="text-primary-600 hover:underline">
              Conditions générales
            </Link>
            <span>et notre</span>
            <Link href="/confidentialite" className="text-primary-600 hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
