import { Metadata } from 'next'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { generatePageSEO } from '@/lib/seo'

export const metadata: Metadata = generatePageSEO({
  title: 'Conditions Générales de Vente',
  description: 'Conditions générales de vente de Voyage Mystère Premium. Informations légales sur nos services de voyages surprise.',
  path: '/cgv',
})

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8">
          Conditions Générales de Vente
        </h1>

        <Card className="mb-6">
          <CardBody className="p-8">
            <p className="text-sm text-gray-600 mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Présentation</h2>
              <p className="text-gray-700 mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Voyage Mystère Premium</strong>, SARL au capital de 10 000€, immatriculée au RCS de Paris sous le numéro XXX XXX XXX, dont le siège social est situé au [ADRESSE], ci-après dénommée "le Prestataire"</li>
                <li>Et toute personne physique ou morale souhaitant procéder à l'achat d'un voyage mystère, ci-après dénommée "le Client"</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objet</h2>
              <p className="text-gray-700 mb-4">
                Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne de voyages surprise organisés par Voyage Mystère Premium.
              </p>
              <p className="text-gray-700">
                Le Client reconnaît avoir pris connaissance des présentes CGV et les accepte sans réserve avant toute commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Description des Services</h2>
              <p className="text-gray-700 mb-4">
                Voyage Mystère Premium propose des séjours surprise comprenant :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>2 nuits d'hébergement dans un établissement de qualité</li>
                <li>Un carnet de voyage personnalisé</li>
                <li>Des activités et expériences sélectionnées selon la thématique choisie</li>
                <li>La révélation de la destination 48h avant le départ</li>
                <li>Une assistance téléphonique 7j/7 pendant le séjour</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Principe du mystère :</strong> La destination exacte reste secrète jusqu'à 48h avant le départ. Le Client choisit uniquement la thématique (Romantique, Nature, ou Urbain) et répond à un questionnaire de personnalisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prix</h2>
              <p className="text-gray-700 mb-4">
                Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). Ils comprennent la TVA applicable au jour de la commande.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Tarifs indicatifs :</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Formule Romantique : à partir de 890€ pour 2 personnes</li>
                <li>Formule Nature : à partir de 750€ pour 2 personnes</li>
                <li>Formule Urbain : à partir de 820€ pour 2 personnes</li>
                <li>Options supplémentaires : selon le tarif en vigueur</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Le prix est ferme et définitif lors de la validation de la commande. Le Prestataire se réserve le droit de modifier ses tarifs à tout moment, mais les prestations seront facturées sur la base des tarifs en vigueur au moment de la validation de la commande.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Non inclus :</strong> Le transport jusqu'au lieu de départ du séjour, les boissons alcoolisées non mentionnées, les dépenses personnelles, l'assurance annulation (optionnelle).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Commande et Réservation</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Processus de commande</h3>
              <p className="text-gray-700 mb-4">
                Pour effectuer une réservation, le Client doit :
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Choisir une thématique de voyage</li>
                <li>Sélectionner les dates souhaitées</li>
                <li>Répondre au questionnaire de personnalisation</li>
                <li>Sélectionner les options éventuelles</li>
                <li>Renseigner ses coordonnées</li>
                <li>Accepter les présentes CGV</li>
                <li>Procéder au paiement sécurisé</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Confirmation de commande</h3>
              <p className="text-gray-700">
                Une fois le paiement validé, le Client reçoit immédiatement par email une confirmation de réservation comprenant son numéro de réservation et un récapitulatif de sa commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Paiement</h2>
              <p className="text-gray-700 mb-4">
                Le paiement s'effectue en ligne de manière sécurisée via notre prestataire Stripe. Les moyens de paiement acceptés sont :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Carte bancaire (CB, Visa, Mastercard, American Express)</li>
                <li>Apple Pay et Google Pay</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Le paiement est intégral au moment de la réservation. Aucun prélèvement ne sera effectué avant la validation finale de la commande par le Client.
              </p>
              <p className="text-gray-700 mt-4">
                Les données de paiement sont sécurisées conformément aux normes PCI-DSS et ne transitent jamais par nos serveurs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Annulation et Remboursement</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Annulation par le Client</h3>
              <p className="text-gray-700 mb-4">
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation de 14 jours ne s'applique pas aux prestations de services d'hébergement et de transport.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Conditions d'annulation :</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Plus de 30 jours avant le départ : Remboursement intégral (100%)</li>
                <li>Entre 30 et 15 jours avant le départ : Remboursement de 50%</li>
                <li>Entre 15 et 7 jours avant le départ : Remboursement de 25%</li>
                <li>Moins de 7 jours avant le départ : Aucun remboursement</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.2 Modification de réservation</h3>
              <p className="text-gray-700">
                Le Client peut modifier une fois gratuitement sa réservation (dates uniquement) jusqu'à 15 jours avant le départ, sous réserve de disponibilités. Toute modification ultérieure sera facturée 50€.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.3 Annulation par le Prestataire</h3>
              <p className="text-gray-700">
                Le Prestataire se réserve le droit d'annuler une réservation en cas de force majeure ou de circonstances exceptionnelles. Dans ce cas, le Client sera remboursé intégralement (100%) dans un délai de 14 jours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Révélation de la Destination</h2>
              <p className="text-gray-700 mb-4">
                La destination sera révélée au Client exactement 48 heures avant la date de départ prévue, par email contenant :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Un code secret pour ouvrir la boîte mystère</li>
                <li>Le nom et l'adresse de la destination</li>
                <li>Les coordonnées de l'hébergement</li>
                <li>Le carnet de voyage complet</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Le Client s'engage à ne pas tenter de découvrir la destination avant la révélation officielle. Toute révélation anticipée ne pourra donner lieu à annulation ou remboursement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Responsabilités</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Responsabilité du Prestataire</h3>
              <p className="text-gray-700 mb-4">
                Le Prestataire s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la bonne exécution des prestations. Sa responsabilité ne peut être engagée qu'en cas de faute prouvée.
              </p>
              <p className="text-gray-700 mb-4">
                Le Prestataire ne peut être tenu responsable :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Des désagréments causés par des prestataires tiers (hébergement, restaurants, etc.)</li>
                <li>Des événements imprévisibles et insurmontables (intempéries, grèves, etc.)</li>
                <li>Du comportement du Client pendant le séjour</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.2 Responsabilité du Client</h3>
              <p className="text-gray-700">
                Le Client s'engage à :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fournir des informations exactes lors de la réservation</li>
                <li>Se présenter aux dates et heures prévues</li>
                <li>Respecter les règlements des établissements visités</li>
                <li>Disposer des documents nécessaires (pièce d'identité)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Réclamations</h2>
              <p className="text-gray-700 mb-4">
                Toute réclamation relative à l'exécution du contrat doit être adressée par email à <a href="mailto:contact@voyage-mystere.fr" className="text-primary-600 hover:underline">contact@voyage-mystere.fr</a> dans un délai maximum de 30 jours suivant la fin du séjour.
              </p>
              <p className="text-gray-700">
                Le Prestataire s'engage à répondre à toute réclamation dans un délai de 15 jours ouvrés.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Données Personnelles</h2>
              <p className="text-gray-700 mb-4">
                Les données personnelles collectées font l'objet d'un traitement informatique destiné à la gestion des réservations et à la relation client. Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au RGPD, le Client dispose d'un droit d'accès, de rectification et de suppression des données le concernant.
              </p>
              <p className="text-gray-700">
                Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-primary-600 hover:underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Propriété Intellectuelle</h2>
              <p className="text-gray-700">
                L'ensemble du contenu du site (textes, images, logos, etc.) est la propriété exclusive de Voyage Mystère Premium ou de ses partenaires. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Droit Applicable et Litiges</h2>
              <p className="text-gray-700 mb-4">
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
              </p>
              <p className="text-gray-700 mb-4">
                Conformément aux dispositions du Code de la consommation, le Client peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige :
              </p>
              <p className="text-gray-700">
                <strong>Médiateur du Tourisme et du Voyage</strong><br />
                BP 80 303 - 75 823 Paris Cedex 17<br />
                <a href="http://www.mtv.travel" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.mtv.travel</a>
              </p>
              <p className="text-gray-700 mt-4">
                À défaut de règlement amiable, le litige sera porté devant les tribunaux compétents de Paris.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Acceptation des CGV</h2>
              <p className="text-gray-700">
                Le fait de passer commande implique l'acceptation pleine et entière des présentes Conditions Générales de Vente. Le Client reconnaît avoir pris connaissance et accepté ces conditions avant toute commande.
              </p>
            </section>

            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 mt-8">
              <h3 className="font-bold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-700">
                Pour toute question concernant ces CGV :<br />
                Email : <a href="mailto:contact@voyage-mystere.fr" className="text-primary-600 hover:underline">contact@voyage-mystere.fr</a><br />
                Téléphone : 01 23 45 67 89
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
