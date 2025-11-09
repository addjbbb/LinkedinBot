'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { signIn } from '@/lib/auth'
import { LogIn, ArrowLeft } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
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
      await signIn(formData.email, formData.password)
      showToast('Connexion réussie !', 'success')
      router.push('/mon-compte')
    } catch (error: any) {
      console.error('Sign in error:', error)
      if (error.message.includes('Invalid login credentials')) {
        showToast('Email ou mot de passe incorrect', 'error')
      } else {
        showToast('Erreur de connexion. Veuillez réessayer.', 'error')
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
                Se connecter
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
