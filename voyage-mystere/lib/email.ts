import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Voyage Mystère <hello@voyage-mystere.fr>'
const REPLY_TO = 'support@voyage-mystere.fr'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(params: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: REPLY_TO,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Email templates
export function getBookingConfirmationEmail(params: {
  firstName: string
  bookingNumber: string
  theme: string
  startDate: string
  totalPrice: number
}) {
  const subject = `Réservation confirmée - ${params.bookingNumber}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #F97316 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✨ Réservation confirmée !</h1>
        </div>

        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${params.firstName},</p>

          <p style="font-size: 16px; margin-bottom: 30px;">
            Votre Voyage Mystère est confirmé ! Préparez-vous à vivre une aventure inoubliable. 🎉
          </p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin-top: 0; color: #3B82F6; font-size: 20px;">Récapitulatif de votre réservation</h2>
            <p style="margin: 10px 0;"><strong>Numéro de réservation :</strong> ${params.bookingNumber}</p>
            <p style="margin: 10px 0;"><strong>Thématique :</strong> ${params.theme}</p>
            <p style="margin: 10px 0;"><strong>Date de départ :</strong> ${new Date(params.startDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 10px 0;"><strong>Montant total :</strong> ${params.totalPrice}€</p>
          </div>

          <h3 style="color: #3B82F6; font-size: 18px;">Prochaines étapes :</h3>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 15px;"><strong>J-10 :</strong> Vous recevrez la boîte mystère chez vous (fermée à clé !)</li>
            <li style="margin-bottom: 15px;"><strong>J-2 à 18h :</strong> Vous recevrez le code secret par email pour ouvrir la boîte</li>
            <li style="margin-bottom: 15px;"><strong>Jour J :</strong> Partez à l'aventure !</li>
          </ol>

          <div style="background: #eff6ff; border-left: 4px solid #3B82F6; padding: 15px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px;">
              💡 <strong>Conseil :</strong> Consultez votre espace client pour suivre votre réservation et accéder à tous les détails.
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/espace-client" style="display: inline-block; background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Accéder à mon espace client
            </a>
          </div>

          <p style="margin-top: 40px; font-size: 14px; color: #6b7280;">
            Une question ? Notre équipe est là pour vous :<br>
            📧 <a href="mailto:support@voyage-mystere.fr" style="color: #3B82F6;">support@voyage-mystere.fr</a><br>
            📱 WhatsApp : +33 6 XX XX XX XX
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>Voyage Mystère Premium<br>Paris, France</p>
        </div>
      </body>
    </html>
  `

  const text = `
    Bonjour ${params.firstName},

    Votre Voyage Mystère est confirmé ! 🎉

    Numéro de réservation : ${params.bookingNumber}
    Thématique : ${params.theme}
    Date de départ : ${new Date(params.startDate).toLocaleDateString('fr-FR')}
    Montant total : ${params.totalPrice}€

    Prochaines étapes :
    - J-10 : Vous recevrez la boîte mystère
    - J-2 : Vous recevrez le code secret
    - Jour J : Partez à l'aventure !

    Accédez à votre espace client : ${process.env.NEXT_PUBLIC_BASE_URL}/espace-client

    Questions ? support@voyage-mystere.fr
  `

  return { subject, html, text }
}

export function getRevealCodeEmail(params: {
  firstName: string
  bookingNumber: string
  code: string
  destination: string
}) {
  const subject = `🔑 Votre code secret - Destination révélée !`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Le moment est venu !</h1>
        </div>

        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${params.firstName},</p>

          <p style="font-size: 16px; margin-bottom: 30px;">
            L'attente est terminée ! Il est temps de découvrir votre destination mystère... 🥁
          </p>

          <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #92400E;">Votre code secret :</p>
            <div style="font-size: 48px; font-weight: bold; color: #F97316; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${params.code}
            </div>
          </div>

          <div style="background: #fee2e2; border: 2px solid #F97316; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <p style="margin: 0; font-size: 18px; color: #991B1B;">
              <strong>🎬 N'oubliez pas de vous filmer en ouvrant la boîte !</strong><br>
              <span style="font-size: 14px;">Les meilleures réactions gagnent des surprises 😉</span>
            </p>
          </div>

          <h3 style="color: #F97316; font-size: 20px; text-align: center;">Instructions :</h3>
          <ol style="padding-left: 20px; font-size: 16px;">
            <li style="margin-bottom: 15px;">Prenez la boîte mystère que vous avez reçue</li>
            <li style="margin-bottom: 15px;">Entrez le code <strong>${params.code}</strong> sur le cadenas</li>
            <li style="margin-bottom: 15px;">Ouvrez la boîte et découvrez votre destination !</li>
            <li style="margin-bottom: 15px;">Lisez attentivement le carnet de voyage (tout y est !)</li>
          </ol>

          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; font-size: 16px; color: #065f46;">
              ✨ <strong>Tout est prêt pour vous :</strong><br>
              Hébergement réservé, activités planifiées, meilleures adresses sélectionnées.<br>
              Vous n'avez qu'à suivre le carnet et profiter !
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
              Une question de dernière minute ?
            </p>
            <a href="mailto:support@voyage-mystere.fr" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Nous contacter
            </a>
          </div>

          <p style="margin-top: 40px; font-size: 16px; text-align: center; color: #F97316; font-weight: bold;">
            Bon voyage et profitez à fond ! 🎒✨
          </p>
        </div>
      </body>
    </html>
  `

  const text = `
    Bonjour ${params.firstName},

    Le moment est venu ! 🎉

    Votre code secret : ${params.code}

    Instructions :
    1. Prenez la boîte mystère
    2. Entrez le code ${params.code}
    3. Ouvrez et découvrez votre destination !
    4. Lisez le carnet de voyage

    N'oubliez pas de vous filmer en ouvrant la boîte ! 📹

    Questions ? support@voyage-mystere.fr

    Bon voyage ! ✨
  `

  return { subject, html, text }
}

export async function sendBookingConfirmation(params: {
  to: string
  firstName: string
  bookingNumber: string
  theme: string
  startDate: string
  totalPrice: number
}) {
  const { subject, html, text } = getBookingConfirmationEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendRevealCode(params: {
  to: string
  firstName: string
  bookingNumber: string
  code: string
  destination: string
}) {
  const { subject, html, text } = getRevealCodeEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

// Export additional email templates
export {
  getBookingReminderEmail,
  getBoxShippedEmail,
  getCancellationEmail,
  getReviewRequestEmail,
} from './email-templates'

// Convenience functions for additional templates
export async function sendBookingReminder(params: {
  to: string
  firstName: string
  bookingNumber: string
  theme: string
  startDate: string
  daysUntilTrip: number
}) {
  const { getBookingReminderEmail } = await import('./email-templates')
  const { subject, html, text } = getBookingReminderEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendBoxShipped(params: {
  to: string
  firstName: string
  bookingNumber: string
  trackingNumber: string
  address: string
}) {
  const { getBoxShippedEmail } = await import('./email-templates')
  const { subject, html, text } = getBoxShippedEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendCancellation(params: {
  to: string
  firstName: string
  bookingNumber: string
  theme: string
  refundAmount: number
  reason?: string
}) {
  const { getCancellationEmail } = await import('./email-templates')
  const { subject, html, text } = getCancellationEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendReviewRequest(params: {
  to: string
  firstName: string
  bookingNumber: string
  destination: string
  reviewLink: string
}) {
  const { getReviewRequestEmail } = await import('./email-templates')
  const { subject, html, text } = getReviewRequestEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendRevelationEmail(params: {
  to: string
  firstName: string
  bookingNumber: string
  code: string
  destination: string
  region: string
  startDate: string
  theme: string
}) {
  const { getRevelationEmail } = await import('./email-templates')
  const { subject, html, text } = getRevelationEmail(params)
  return sendEmail({ to: params.to, subject, html, text })
}
