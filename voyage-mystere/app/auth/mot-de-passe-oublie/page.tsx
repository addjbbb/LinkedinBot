'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { resetPassword } from '@/lib/auth'
import { Mail, ArrowLeft } from 'lucide-react'

export default function MotDePasseOubliePage() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('L\'email est requis')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await resetPassword(email)
      setIsSuccess(true)
      showToast('Email de réinitialisation envoyé !', 'success')
    } catch (error) {
      console.error('Reset password error:', error)
      showToast('Erreur lors de l\'envoi de l\'email', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardBody className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Email envoyé !
              </h2>
              <p className="text-gray-700 mb-6">
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
                Vérifiez votre boîte mail et suivez les instructions.
              </p>
              <Link href="/auth/connexion">
                <Button variant="primary" size="lg" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/auth/connexion" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Mot de passe oublié
              </h1>
              <p className="text-gray-600">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email *"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                error={error}
                placeholder="vous@exemple.fr"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Envoyer le lien
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
