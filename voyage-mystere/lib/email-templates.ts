// ============================================
// EMAIL TEMPLATES
// ============================================
// Additional email templates for various scenarios
// ============================================

interface BookingReminderParams {
  firstName: string
  bookingNumber: string
  theme: string
  startDate: string
  daysUntilTrip: number
}

export function getBookingReminderEmail(params: BookingReminderParams) {
  const { firstName, bookingNumber, theme, startDate, daysUntilTrip } = params

  const subject = `J-${daysUntilTrip} : Préparez-vous pour votre Voyage Mystère ! 🎒`

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel Voyage Mystère</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎒 Votre aventure approche !</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${firstName},</p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #3b82f6; margin: 0;">J-${daysUntilTrip}</p>
          <p style="margin: 5px 0;">Plus que ${daysUntilTrip} jours avant votre départ !</p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">📋 Checklist avant le départ</h2>

        <ul style="list-style: none; padding: 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            ✅ Vérifiez que vous avez reçu votre boîte mystère
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            ✅ Gardez l'œil sur votre email pour le code de révélation (J-2)
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            ✅ Préparez votre sac (vêtements selon thème ${theme})
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            ✅ Vérifiez votre carte bancaire et papiers d'identité
          </li>
          <li style="padding: 10px 0;">
            ✅ Chargez votre appareil photo pour immortaliser l'aventure !
          </li>
        </ul>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">💡 Rappel important</p>
          <p style="margin: 5px 0 0 0; color: #92400e;">Vous recevrez le code de révélation par email 48h avant votre départ. La destination reste secrète jusque-là !</p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">📞 Besoin d'aide ?</h2>
        <p>Notre équipe est disponible 7j/7 :</p>
        <ul style="list-style: none; padding: 0; margin: 10px 0;">
          <li>📧 <a href="mailto:contact@voyage-mystere.fr" style="color: #3b82f6; text-decoration: none;">contact@voyage-mystere.fr</a></li>
          <li>📱 01 23 45 67 89</li>
        </ul>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; color: #6b7280;">Référence de réservation</p>
          <p style="font-size: 18px; font-weight: bold; color: #1f2937; margin: 5px 0;">${bookingNumber}</p>
        </div>

        <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          À très bientôt pour votre aventure !<br/>
          L'équipe Voyage Mystère 🌟
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>Voyage Mystère Premium</p>
        <p>Paris, France</p>
      </div>
    </body>
    </html>
  `

  const text = `
Bonjour ${firstName},

Plus que ${daysUntilTrip} jours avant votre départ pour votre Voyage Mystère !

Checklist avant le départ :
- Vérifiez que vous avez reçu votre boîte mystère
- Gardez l'œil sur votre email pour le code de révélation (J-2)
- Préparez votre sac (vêtements selon thème ${theme})
- Vérifiez votre carte bancaire et papiers d'identité
- Chargez votre appareil photo !

Rappel : Vous recevrez le code de révélation par email 48h avant votre départ.

Besoin d'aide ? Contactez-nous :
Email: contact@voyage-mystere.fr
Téléphone: 01 23 45 67 89

Référence : ${bookingNumber}

À très bientôt !
L'équipe Voyage Mystère
  `

  return { subject, html, text }
}

interface BoxShippedParams {
  firstName: string
  bookingNumber: string
  trackingNumber: string
  address: string
}

export function getBoxShippedEmail(params: BoxShippedParams) {
  const { firstName, bookingNumber, trackingNumber, address } = params

  const subject = '📦 Votre boîte mystère est en route !'

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Boîte Expédiée</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">📦 Colis en route !</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${firstName},</p>

        <p>Excellente nouvelle ! Votre boîte mystère a été expédiée et devrait arriver sous 2-3 jours ouvrés. 🎉</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; color: #1f2937;">📍 Adresse de livraison</p>
          <p style="margin: 10px 0; color: #4b5563;">${address}</p>

          <p style="margin: 15px 0 0 0; font-weight: bold; color: #1f2937;">📦 Numéro de suivi</p>
          <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; margin: 10px 0; font-size: 16px;">${trackingNumber}</p>

          <a href="https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}"
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 10px; font-weight: bold;">
            Suivre mon colis
          </a>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">📦 Que contient la boîte ?</h2>
        <ul style="color: #4b5563;">
          <li>Votre carnet de voyage personnalisé (sans révéler la destination !)</li>
          <li>Des indications sur le style de voyage et ce qu'il faut prévoir</li>
          <li>Des surprises pour patienter jusqu'au départ</li>
          <li>Les instructions pour utiliser votre code de révélation</li>
        </ul>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ Important</p>
          <p style="margin: 5px 0 0 0; color: #92400e;">Ne l'ouvrez pas avant de recevoir votre code de révélation par email (48h avant le départ) !</p>
        </div>

        <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          Le mystère continue... 🎭<br/>
          L'équipe Voyage Mystère
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Bonjour ${firstName},

Votre boîte mystère a été expédiée !

Numéro de suivi : ${trackingNumber}
Adresse : ${address}

Livraison prévue sous 2-3 jours ouvrés.

La boîte contient :
- Votre carnet de voyage personnalisé
- Des indications sur le style de voyage
- Des surprises pour patienter
- Les instructions pour le code de révélation

Important : Ne l'ouvrez pas avant de recevoir votre code de révélation !

Référence : ${bookingNumber}

L'équipe Voyage Mystère
  `

  return { subject, html, text }
}

interface CancellationParams {
  firstName: string
  bookingNumber: string
  theme: string
  refundAmount: number
  reason?: string
}

export function getCancellationEmail(params: CancellationParams) {
  const { firstName, bookingNumber, refundAmount } = params

  const subject = 'Confirmation d\'annulation de votre Voyage Mystère'

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annulation confirmée</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Annulation confirmée</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${firstName},</p>

        <p>Nous avons bien reçu votre demande d'annulation pour la réservation <strong>${bookingNumber}</strong>.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; color: #1f2937;">💰 Remboursement</p>
          <p style="font-size: 24px; font-weight: bold; color: #10b981; margin: 10px 0;">${refundAmount}€</p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Le remboursement sera effectué sur votre carte bancaire sous 5-10 jours ouvrés.</p>
        </div>

        <p>Nous sommes désolés de vous voir partir et espérons avoir le plaisir de vous accompagner dans une future aventure mystère. 💙</p>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
          <p style="margin: 0; font-weight: bold; color: #1e40af;">🎁 Cadeau de bienvenue</p>
          <p style="margin: 10px 0; color: #1e3a8a;">Pour votre prochaine réservation, utilisez le code :</p>
          <p style="font-family: monospace; background: white; padding: 12px; border-radius: 4px; font-size: 20px; font-weight: bold; color: #3b82f6; margin: 10px 0;">RETOUR50</p>
          <p style="margin: 0; color: #1e3a8a; font-size: 14px;">50€ de réduction sur votre prochain voyage</p>
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="https://voyage-mystere.fr" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Voir nos destinations
          </a>
        </p>

        <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          À bientôt, on l'espère ! ❤️<br/>
          L'équipe Voyage Mystère
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Bonjour ${firstName},

Votre réservation ${bookingNumber} a été annulée avec succès.

Remboursement : ${refundAmount}€
Le remboursement sera effectué sous 5-10 jours ouvrés.

Pour votre prochaine réservation, bénéficiez de 50€ de réduction avec le code : RETOUR50

À bientôt !
L'équipe Voyage Mystère
  `

  return { subject, html, text }
}

interface ReviewRequestParams {
  firstName: string
  bookingNumber: string
  destination: string
  reviewLink: string
}

export function getReviewRequestEmail(params: ReviewRequestParams) {
  const { firstName, bookingNumber, destination, reviewLink } = params

  const subject = '⭐ Partagez votre expérience Voyage Mystère'

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0;">
      <title>Demande d'avis</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">⭐ Votre avis compte !</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${firstName},</p>

        <p>Nous espérons que votre Voyage Mystère à <strong>${destination}</strong> vous a plu ! 🎉</p>

        <p>Votre retour est précieux pour nous aider à améliorer l'expérience et aider d'autres voyageurs à franchir le pas.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${reviewLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Laisser mon avis (2 min)
          </a>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">🎁 Bonus exclusif</p>
          <p style="margin: 5px 0 0 0; color: #92400e;">Laissez un avis et recevez 20€ de réduction sur votre prochaine réservation !</p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">💬 Ce que nous aimerions savoir</h2>
        <ul style="color: #4b5563;">
          <li>La destination correspondait-elle à vos attentes ?</li>
          <li>Le mystère était-il bien maintenu jusqu'au bout ?</li>
          <li>Quelle a été votre meilleure surprise ?</li>
          <li>Recommanderiez-vous Voyage Mystère à vos amis ?</li>
        </ul>

        <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          Merci de votre confiance ! 💙<br/>
          L'équipe Voyage Mystère
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Bonjour ${firstName},

Nous espérons que votre Voyage Mystère à ${destination} vous a plu !

Votre avis nous aide à améliorer l'expérience pour tous.

Laissez un avis et recevez 20€ de réduction sur votre prochaine réservation !

Lien : ${reviewLink}

Merci !
L'équipe Voyage Mystère
  `

  return { subject, html, text }
}

interface RevelationParams {
  firstName: string
  bookingNumber: string
  code: string
  destination: string
  region: string
  startDate: string
  theme: string
}

export function getRevelationEmail(params: RevelationParams) {
  const { firstName, bookingNumber, code, destination, region, startDate, theme } = params

  const themeEmoji = theme === 'romantique' ? '💕' : theme === 'nature' ? '🌲' : '🏙️'

  const subject = `🎉 Le mystère est révélé ! Votre destination: ${destination}`

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Révélation de votre destination</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">🎊 LE MYSTÈRE EST RÉVÉLÉ !</h1>
      </div>

      <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${firstName},</p>

        <p style="font-size: 16px;">Le moment tant attendu est arrivé ! Dans moins de 48h, vous partirez pour votre Voyage Mystère ${themeEmoji}</p>

        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="color: white; font-size: 14px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Votre Destination</p>
          <h2 style="color: white; font-size: 36px; font-weight: bold; margin: 10px 0;">${destination}</h2>
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 10px 0 0 0;">${region}</p>
        </div>

        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937;">🔐 Votre Code de Révélation</p>
          <p style="font-family: monospace; background: white; padding: 15px; border-radius: 6px; font-size: 24px; font-weight: bold; color: #3b82f6; margin: 10px 0; text-align: center; letter-spacing: 2px;">${code}</p>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">Conservez ce code précieusement. Il contient des informations exclusives sur votre séjour.</p>
        </div>

        <h2 style="color: #1f2937; font-size: 22px; margin-top: 35px;">📋 Derniers préparatifs</h2>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">⏰ Date de départ</p>
          <p style="margin: 5px 0; color: #92400e; font-size: 18px;">${new Date(startDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        <ul style="color: #4b5563; line-height: 2;">
          <li>✅ Vérifiez votre boîte mystère (carnet de voyage inclus)</li>
          <li>✅ Préparez vos bagages selon le thème ${themeEmoji}</li>
          <li>✅ Vérifiez vos papiers d'identité et CB</li>
          <li>✅ Rechargez votre téléphone et appareil photo</li>
          <li>✅ Consultez la météo de ${region}</li>
        </ul>

        <div style="background: #dbeafe; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <p style="margin: 0; color: #1e40af; font-size: 18px; font-weight: bold;">🎁 Bon à savoir</p>
          <p style="margin: 10px 0 0 0; color: #1e3a8a;">Tous les détails pratiques (adresse d'hébergement, activités réservées, restaurants) se trouvent dans votre carnet de voyage. Découvrez-les au fur et à mesure de votre séjour !</p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 35px;">📞 Besoin d'aide ?</h2>
        <p>Notre équipe est disponible 24/7 pendant votre séjour :</p>
        <ul style="list-style: none; padding: 0; margin: 10px 0;">
          <li style="padding: 5px 0;">📧 <a href="mailto:contact@voyage-mystere.fr" style="color: #3b82f6; text-decoration: none;">contact@voyage-mystere.fr</a></li>
          <li style="padding: 5px 0;">📱 01 23 45 67 89 (urgences)</li>
        </ul>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 35px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Référence de réservation</p>
          <p style="font-size: 18px; font-weight: bold; color: #1f2937; margin: 5px 0;">${bookingNumber}</p>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; margin-top: 35px; text-align: center;">
          <p style="color: white; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Excellent voyage !</p>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0;">L'aventure commence maintenant. Profitez de chaque instant ! ✨</p>
        </div>

        <p style="margin-top: 35px; text-align: center; color: #6b7280; font-size: 14px;">
          À très bientôt pour vos retours !<br/>
          L'équipe Voyage Mystère 💙
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>Voyage Mystère Premium</p>
        <p>Paris, France</p>
      </div>
    </body>
    </html>
  `

  const text = `
Bonjour ${firstName},

🎊 LE MYSTÈRE EST RÉVÉLÉ !

Votre destination : ${destination}
Région : ${region}

Code de révélation : ${code}
(Conservez-le précieusement)

Date de départ : ${new Date(startDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}

Derniers préparatifs :
- Vérifiez votre boîte mystère
- Préparez vos bagages
- Vérifiez vos papiers et CB
- Consultez la météo de ${region}

Tous les détails pratiques se trouvent dans votre carnet de voyage !

Besoin d'aide ?
Email: contact@voyage-mystere.fr
Téléphone urgence: 01 23 45 67 89

Référence : ${bookingNumber}

Excellent voyage !
L'équipe Voyage Mystère
  `

  return { subject, html, text }
}
