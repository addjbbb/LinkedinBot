'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import {
  Gift,
  Users,
  Euro,
  Share2,
  Mail,
  Copy,
  Facebook,
  Twitter,
  MessageCircle,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'

interface ReferralStats {
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  totalEarned: number
  availableCredits: number
}

interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  my_referral_code?: string
}

export default function ParrainagePage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalEarned: 0,
    availableCredits: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)

  const referralCode = user?.my_referral_code || ''
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://voyage-mystere.fr'}/reserver?ref=${referralCode}`

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/auth/connexion?redirect=/parrainage')
        return
      }

      // Get user profile with referral code
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({
          id: authUser.id,
          email: profile.email || authUser.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          my_referral_code: profile.my_referral_code,
        })

        // Fetch referral stats
        await fetchStats(authUser.id)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      showToast('Erreur lors du chargement des données', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/referral/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`${label} copié !`, 'success')
  }

  const shareViaEmail = () => {
    const subject = 'Découvrez Voyage Mystère Premium'
    const body = `Bonjour,\n\nJe t'invite à découvrir Voyage Mystère Premium, des week-ends surprise haut de gamme !\n\nUtilise mon code de parrainage ${referralCode} pour bénéficier de 50€ de réduction sur ta première réservation.\n\nOu clique directement sur ce lien : ${referralLink}\n\nÀ bientôt pour de nouvelles aventures !`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const shareViaWhatsApp = () => {
    const text = `Découvre Voyage Mystère Premium ! Utilise mon code ${referralCode} pour 50€ de réduction : ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
  }

  const shareViaTwitter = () => {
    const text = `Découvrez Voyage Mystère Premium - Week-end surprise haut de gamme ! 50€ de réduction avec mon code : ${referralCode}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !referralCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Code de parrainage introuvable</h2>
            <p className="text-gray-700 mb-6">
              Vous devez avoir un compte pour accéder au programme de parrainage.
            </p>
            <Button variant="primary" onClick={() => router.push('/espace-client')}>
              Retour à l'espace client
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Account */}
        <div className="mb-6">
          <Link href="/espace-client" className="text-primary-600 hover:text-primary-700 inline-flex items-center">
            ← Retour à mon espace
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Parrainez vos amis, <br />
            <span className="text-primary-600">gagnez 50€ chacun !</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plus vous partagez le mystère, plus vous gagnez. C'est aussi simple que ça !
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardBody className="p-8">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">1</span>
              </div>
              <div className="w-16 h-16 mx-auto mb-4">
                <Share2 className="w-16 h-16 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Partagez votre code
              </h3>
              <p className="text-gray-700">
                Envoyez votre lien unique à vos amis par email, WhatsApp ou réseaux sociaux.
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-8">
              <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-accent-600">2</span>
              </div>
              <div className="w-16 h-16 mx-auto mb-4">
                <Users className="w-16 h-16 text-accent-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vos amis réservent
              </h3>
              <p className="text-gray-700">
                Ils bénéficient de 50€ de réduction sur leur première réservation.
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <div className="w-16 h-16 mx-auto mb-4">
                <Euro className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vous gagnez 50€
              </h3>
              <p className="text-gray-700">
                Recevez 50€ de crédit voyage pour chaque ami qui réserve.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Referral Code Section */}
        <Card className="mb-16 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
          <CardBody className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">
                Votre code de parrainage
              </h2>
              <p className="text-primary-100 text-lg">
                Partagez ce code ou ce lien avec vos amis
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-100">
                  Code de parrainage
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-lg font-mono text-xl font-bold text-center">
                    {referralCode}
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={() => copyToClipboard(referralCode, 'Code')}
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copier
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary-100">
                  Lien de parrainage
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-nowrap">
                    {referralLink}
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={() => copyToClipboard(referralLink, 'Lien')}
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copier
                  </Button>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-center text-primary-100 mb-4">Partager directement</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={shareViaEmail}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={shareViaWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={shareViaFacebook}
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                    onClick={shareViaTwitter}
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {loadingStats ? '...' : stats.completedReferrals}
              </div>
              <div className="text-gray-600">Amis parrainés</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {loadingStats ? '...' : stats.totalEarned}€
              </div>
              <div className="text-gray-600">Crédits gagnés</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-accent-600 mb-2">
                {loadingStats ? '...' : stats.pendingReferrals}
              </div>
              <div className="text-gray-600">En attente</div>
            </CardBody>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="mb-16">
          <CardHeader>
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Pourquoi parrainer ?
            </h2>
          </CardHeader>
          <CardBody className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    50€ par ami parrainé
                  </h3>
                  <p className="text-sm text-gray-700">
                    Crédit voyage valable 2 ans sur toutes nos formules
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Pas de limite
                  </h3>
                  <p className="text-sm text-gray-700">
                    Parrainez autant d'amis que vous voulez, cumulez les crédits
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Vos amis aussi gagnent
                  </h3>
                  <p className="text-sm text-gray-700">
                    50€ de réduction sur leur première réservation
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Cumulable avec les promos
                  </h3>
                  <p className="text-sm text-gray-700">
                    Les crédits de parrainage se cumulent avec nos offres
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Suivi en temps réel
                  </h3>
                  <p className="text-sm text-gray-700">
                    Consultez vos parrainages et crédits dans votre espace client
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Paiement automatique
                  </h3>
                  <p className="text-sm text-gray-700">
                    Crédit ajouté automatiquement après validation de la réservation
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Questions fréquentes
            </h2>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quand vais-je recevoir mes crédits ?
                </h3>
                <p className="text-gray-700">
                  Vous recevrez 50€ de crédit voyage dans les 7 jours suivant la validation de la réservation de votre filleul (après la période d'annulation de 30 jours).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Combien d'amis puis-je parrainer ?
                </h3>
                <p className="text-gray-700">
                  Il n'y a aucune limite ! Parrainez autant d'amis que vous le souhaitez et cumulez les crédits voyage.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Les crédits expirent-ils ?
                </h3>
                <p className="text-gray-700">
                  Vos crédits de parrainage sont valables pendant 2 ans à compter de leur attribution et peuvent être utilisés sur toutes nos formules.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Puis-je parrainer quelqu'un qui a déjà un compte ?
                </h3>
                <p className="text-gray-700">
                  Non, le parrainage est réservé aux nouveaux clients. La personne parrainée ne doit jamais avoir réservé sur Voyage Mystère Premium.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comment utiliser mes crédits ?
                </h3>
                <p className="text-gray-700">
                  Vos crédits sont automatiquement appliqués lors de votre prochaine réservation. Vous pouvez les consulter dans votre espace client.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
