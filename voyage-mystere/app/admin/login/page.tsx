'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { Shield, Lock, Mail } from 'lucide-react'
import Cookies from 'js-cookie'

export default function AdminLoginPage() {
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
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store token in cookie
        Cookies.set('admin_token', data.token, { expires: 1/3 }) // 8 hours

        showToast('Connexion réussie !', 'success')

        // Use window.location.href to force full page reload with cookie
        setTimeout(() => {
          window.location.href = '/admin'
        }, 500)
      } else {
        showToast(data.error || 'Email ou mot de passe incorrect', 'error')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      showToast('Erreur de connexion. Veuillez réessayer.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-2 border-gray-700 shadow-2xl">
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Voyage Mystère Premium
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Email administrateur"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  placeholder="admin@voyage-mystere.fr"
                  icon={<Mail className="w-5 h-5" />}
                />
              </div>

              <div>
                <Input
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <Shield className="w-5 h-5 mr-2" />
                Connexion sécurisée
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">🔒 Accès réservé aux administrateurs</p>
                <p className="text-xs text-gray-500">
                  Toutes les connexions sont enregistrées et surveillées
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}
