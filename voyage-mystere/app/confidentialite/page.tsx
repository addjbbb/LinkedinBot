import { Metadata } from 'next'
import { Card, CardBody } from '@/components/ui/card'
import { generatePageSEO } from '@/lib/seo'
import { Shield, Lock, Eye, UserCheck, Database, Bell } from 'lucide-react'

export const metadata: Metadata = generatePageSEO({
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de Voyage Mystère Premium. Conformité RGPD.',
  path: '/confidentialite',
})

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            Nous accordons une importance primordiale à la protection de vos données personnelles
          </p>
        </div>

        <Card className="mb-6">
          <CardBody className="p-8">
            <p className="text-sm text-gray-600 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-primary-600" />
                1. Responsable du Traitement
              </h2>
              <div className="bg-primary-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Voyage Mystère Premium SARL</strong></p>
                <p className="text-gray-700 mb-2">Siège social : [ADRESSE À COMPLÉTER]</p>
                <p className="text-gray-700 mb-2">Email : <a href="mailto:dpo@voyage-mystere.fr" className="text-primary-600 hover:underline">dpo@voyage-mystere.fr</a></p>
                <p className="text-gray-700">Téléphone : 01 23 45 67 89</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-primary-600" />
                2. Données Collectées
              </h2>
              <p className="text-gray-700 mb-4">
                Dans le cadre de nos services, nous collectons les données personnelles suivantes :
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📝 Données d'identification</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale (pour l'envoi de la boîte mystère)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Données de réservation</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Thématique choisie (Romantique, Nature, Urbain)</li>
                    <li>Dates de séjour</li>
                    <li>Nombre de voyageurs</li>
                    <li>Réponses au questionnaire de personnalisation</li>
                    <li>Options sélectionnées</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">💳 Données de paiement</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Informations de transaction (via Stripe - nous ne stockons JAMAIS vos coordonnées bancaires complètes)</li>
                    <li>Historique des paiements</li>
                    <li>Factures</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🖥️ Données techniques</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Adresse IP</li>
                    <li>Type de navigateur</li>
                    <li>Pages visitées</li>
                    <li>Durée de visite</li>
                    <li>Cookies (voir section dédiée)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du Traitement</h2>
              <p className="text-gray-700 mb-4">
                Vos données personnelles sont collectées pour les finalités suivantes :
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Gestion des réservations</p>
                    <p className="text-gray-700 text-sm">Traitement de votre commande, confirmation, suivi</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Personnalisation de l'expérience</p>
                    <p className="text-gray-700 text-sm">Sélection de la destination selon vos préférences</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Communication</p>
                    <p className="text-gray-700 text-sm">Envoi d'emails de confirmation, code de révélation, assistance</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Service client</p>
                    <p className="text-gray-700 text-sm">Réponse à vos questions, gestion des réclamations</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Amélioration de nos services</p>
                    <p className="text-gray-700 text-sm">Analyses statistiques, optimisation du site</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Marketing (avec votre consentement)</p>
                    <p className="text-gray-700 text-sm">Newsletter, offres personnalisées, sondages</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Obligations légales</p>
                    <p className="text-gray-700 text-sm">Comptabilité, facturation, lutte contre la fraude</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Légale du Traitement</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, le traitement de vos données repose sur les bases légales suivantes :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>Exécution du contrat :</strong> traitement de votre réservation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>Consentement :</strong> newsletter, cookies marketing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>Obligation légale :</strong> facturation, comptabilité</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>Intérêt légitime :</strong> amélioration de nos services, sécurité</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-primary-600" />
                5. Sécurité des Données
              </h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-1">🔒 Cryptage SSL/TLS</p>
                  <p className="text-sm text-gray-700">Toutes les communications sont chiffrées</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-1">💳 Paiements sécurisés</p>
                  <p className="text-sm text-gray-700">Stripe certifié PCI-DSS niveau 1</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-1">🔐 Accès restreint</p>
                  <p className="text-sm text-gray-700">Seul le personnel autorisé accède aux données</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-1">💾 Sauvegardes</p>
                  <p className="text-sm text-gray-700">Backups réguliers et sécurisés</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partage des Données</h2>
              <p className="text-gray-700 mb-4">
                Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec :
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Nos prestataires de services</h3>
                  <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                    <li><strong>Stripe</strong> - Traitement des paiements</li>
                    <li><strong>Supabase</strong> - Hébergement de la base de données</li>
                    <li><strong>Resend</strong> - Envoi d'emails transactionnels</li>
                    <li><strong>Vercel</strong> - Hébergement du site web</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Ces prestataires sont soumis à des obligations strictes de confidentialité et de sécurité.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Nos partenaires (hébergements, activités)</h3>
                  <p className="text-sm text-gray-700">
                    Uniquement les informations nécessaires à la réalisation du séjour (nom, dates, nombre de personnes).
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Autorités légales</h3>
                  <p className="text-sm text-gray-700">
                    Si requis par la loi ou en cas de litige.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-primary-600" />
                7. Vos Droits
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit d'accès</h3>
                  <p className="text-sm text-gray-700">Obtenir une copie de toutes vos données personnelles</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit de rectification</h3>
                  <p className="text-sm text-gray-700">Corriger des données inexactes ou incomplètes</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit à l'effacement ("droit à l'oubli")</h3>
                  <p className="text-sm text-gray-700">Demander la suppression de vos données (sauf obligations légales)</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit à la limitation du traitement</h3>
                  <p className="text-sm text-gray-700">Restreindre l'utilisation de vos données</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit à la portabilité</h3>
                  <p className="text-sm text-gray-700">Récupérer vos données dans un format structuré</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit d'opposition</h3>
                  <p className="text-sm text-gray-700">Vous opposer au traitement de vos données (marketing notamment)</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit de retirer son consentement</h3>
                  <p className="text-sm text-gray-700">Annuler votre consentement à tout moment</p>
                </div>

                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900">✓ Droit de réclamation</h3>
                  <p className="text-sm text-gray-700">Introduire une réclamation auprès de la CNIL</p>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg mt-6">
                <h3 className="font-bold text-gray-900 mb-3">📧 Exercer vos droits</h3>
                <p className="text-gray-700 mb-2">
                  Pour exercer l'un de ces droits, contactez-nous :
                </p>
                <p className="text-gray-700">
                  Email : <a href="mailto:dpo@voyage-mystere.fr" className="text-primary-600 hover:underline">dpo@voyage-mystere.fr</a><br />
                  Courrier : Voyage Mystère Premium - DPO, [ADRESSE]
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  Nous répondrons à votre demande dans un délai d'un mois maximum. Une pièce d'identité pourra être demandée pour vérifier votre identité.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-3 text-primary-600" />
                8. Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience et analyser notre trafic.
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🍪 Cookies essentiels</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Nécessaires au fonctionnement du site (connexion, panier, sécurité). Ces cookies ne peuvent pas être désactivés.
                  </p>
                  <p className="text-xs text-gray-600">Durée : session ou 1 an maximum</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📊 Cookies analytiques</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Google Analytics pour comprendre comment vous utilisez notre site (pages visitées, temps passé, etc.).
                  </p>
                  <p className="text-xs text-gray-600">Durée : 2 ans • Nécessite votre consentement</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Cookies marketing</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Personnalisation des publicités et mesure de l'efficacité des campagnes.
                  </p>
                  <p className="text-xs text-gray-600">Durée : 1 an • Nécessite votre consentement</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Vous pouvez gérer vos préférences de cookies à tout moment depuis les paramètres de votre navigateur ou notre bannière de cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Conservation des Données</h2>
              <p className="text-gray-700 mb-4">
                Vos données sont conservées pendant les durées suivantes :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Données de réservation :</strong> 3 ans après la fin du séjour</li>
                <li>• <strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                <li>• <strong>Cookies analytiques :</strong> 13 mois maximum</li>
                <li>• <strong>Newsletter :</strong> Jusqu'à désinscription + 3 ans</li>
                <li>• <strong>Compte client inactif :</strong> 3 ans d'inactivité puis suppression</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Transferts Internationaux</h2>
              <p className="text-gray-700 mb-4">
                Certains de nos prestataires peuvent être situés hors de l'Union Européenne (notamment aux États-Unis). Dans ce cas, nous veillons à ce que des garanties appropriées soient mises en place :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Clauses contractuelles types de la Commission Européenne</li>
                <li>• Certifications (ex: Privacy Shield, bien que remplacé par le Data Privacy Framework)</li>
                <li>• Mécanismes de protection équivalents au RGPD</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Mineurs</h2>
              <p className="text-gray-700">
                Nos services ne sont pas destinés aux mineurs de moins de 18 ans. Si vous êtes parent ou tuteur légal et que vous découvrez que votre enfant nous a fourni des données personnelles sans votre consentement, contactez-nous immédiatement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications de la Politique</h2>
              <p className="text-gray-700">
                Nous pouvons modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <div className="bg-accent-50 border-2 border-accent-200 p-6 rounded-lg mt-8">
              <h3 className="font-bold text-gray-900 mb-3">📞 Contact - Délégué à la Protection des Données</h3>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits :
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email :</strong> <a href="mailto:dpo@voyage-mystere.fr" className="text-primary-600 hover:underline">dpo@voyage-mystere.fr</a><br />
                  <strong>Courrier :</strong> Voyage Mystère Premium - DPO<br />
                  [ADRESSE COMPLÈTE À COMPLÉTER]<br />
                  <strong>Téléphone :</strong> 01 23 45 67 89
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">ℹ️ Réclamation auprès de la CNIL</h3>
              <p className="text-sm text-gray-700">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>CNIL</strong><br />
                3 Place de Fontenoy - TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                <a href="https://www.cnil.fr" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
