import { Metadata } from 'next'
import { Card, CardBody } from '@/components/ui/card'
import { generatePageSEO } from '@/lib/seo'

export const metadata: Metadata = generatePageSEO({
  title: 'Mentions Légales',
  description: 'Mentions légales du site Voyage Mystère Premium. Informations sur l\'éditeur, l\'hébergement et les conditions d\'utilisation.',
  path: '/mentions-legales',
})

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8">
          Mentions Légales
        </h1>

        <Card className="mb-6">
          <CardBody className="p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du Site</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Raison sociale :</strong> Voyage Mystère Premium SARL</p>
                <p className="text-gray-700 mb-2"><strong>Capital social :</strong> 10 000€</p>
                <p className="text-gray-700 mb-2"><strong>Siège social :</strong> [ADRESSE COMPLÈTE À COMPLÉTER]</p>
                <p className="text-gray-700 mb-2"><strong>RCS :</strong> Paris XXX XXX XXX</p>
                <p className="text-gray-700 mb-2"><strong>SIRET :</strong> XXX XXX XXX XXXXX</p>
                <p className="text-gray-700 mb-2"><strong>N° TVA intracommunautaire :</strong> FR XX XXX XXX XXX</p>
                <p className="text-gray-700 mb-2"><strong>Directeur de la publication :</strong> [NOM DU DIRECTEUR]</p>
                <p className="text-gray-700 mb-2"><strong>Email :</strong> <a href="mailto:contact@voyage-mystere.fr" className="text-primary-600 hover:underline">contact@voyage-mystere.fr</a></p>
                <p className="text-gray-700"><strong>Téléphone :</strong> 01 23 45 67 89</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergement du Site</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p className="text-gray-700 mb-2"><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p className="text-gray-700 mb-2"><strong>Site web :</strong> <a href="https://vercel.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">https://vercel.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Conception et Réalisation</h2>
              <p className="text-gray-700">
                <strong>Développement :</strong> Voyage Mystère Premium<br />
                <strong>Design :</strong> Voyage Mystère Premium
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété Intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-gray-700 mb-4">
                La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
              <p className="text-gray-700">
                Les marques, logos, et visuels reproduits sur ce site sont la propriété exclusive de Voyage Mystère Premium ou de leurs propriétaires respectifs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Données Personnelles</h2>
              <p className="text-gray-700 mb-4">
                Conformément à la loi n°78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés, et au Règlement Général sur la Protection des Données (RGPD) entré en vigueur le 25 mai 2018, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p className="text-gray-700 mb-4">
                Pour exercer ce droit, vous pouvez contacter notre Délégué à la Protection des Données :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email : <a href="mailto:dpo@voyage-mystere.fr" className="text-primary-600 hover:underline">dpo@voyage-mystere.fr</a><br />
                  Courrier : Voyage Mystère Premium - DPO, [ADRESSE]
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-primary-600 hover:underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. En naviguant sur ce site, vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.
              </p>
              <p className="text-gray-700">
                Vous pouvez à tout moment désactiver les cookies depuis les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Voyage Mystère Premium s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Voyage Mystère Premium ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p className="text-gray-700 mb-4">
                En conséquence, Voyage Mystère Premium décline toute responsabilité :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
                <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site</li>
                <li>Pour tous dommages directs ou indirects qui pourraient résulter de l'utilisation du site ou de sites qui lui sont liés</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Liens Hypertextes</h2>
              <p className="text-gray-700 mb-4">
                Le site peut contenir des liens hypertextes vers d'autres sites. Voyage Mystère Premium n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
              <p className="text-gray-700">
                La création de liens hypertextes vers le site voyage-mystere.fr nécessite une autorisation préalable écrite de Voyage Mystère Premium.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Droit Applicable</h2>
              <p className="text-gray-700">
                Les présentes mentions légales sont soumises au droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Conditions d'Utilisation</h2>
              <p className="text-gray-700 mb-4">
                L'utilisation du site voyage-mystere.fr implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.
              </p>
              <p className="text-gray-700">
                Les utilisateurs du site sont tenus de les consulter régulièrement. La date de dernière mise à jour est indiquée en haut de page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Crédits</h2>
              <p className="text-gray-700">
                <strong>Photos :</strong> Unsplash, Pexels (Licences libres de droits)<br />
                <strong>Icônes :</strong> Lucide Icons<br />
                <strong>Polices :</strong> Google Fonts (Inter, Poppins)
              </p>
            </section>

            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 mt-8">
              <h3 className="font-bold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-700">
                Pour toute question concernant ces mentions légales :<br />
                Email : <a href="mailto:contact@voyage-mystere.fr" className="text-primary-600 hover:underline">contact@voyage-mystere.fr</a><br />
                Téléphone : 01 23 45 67 89
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
