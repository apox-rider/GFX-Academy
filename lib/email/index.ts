import nodemailer from 'nodemailer'

const TO_EMAIL = process.env.CONTACT_EMAIL_TO || 'meshackaidan3@gmail.com'

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    console.warn('SMTP credentials not configured. Email notifications will be disabled.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })
}

export async function sendContactNotification(contact: {
  name: string
  email: string
  subject: string | null
  message: string
}) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log('Email skipped: SMTP not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"GalileeFX Academy" <noreply@galileefx.com>',
      to: TO_EMAIL,
      subject: `[GalileeFX] New Contact${contact.subject ? `: ${contact.subject}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contact.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Reply directly to this email to respond to ${contact.name}.</p>
          </div>
        </div>
      `,
      replyTo: contact.email,
    })

    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

export async function sendAutoReply(customerEmail: string, customerName: string) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log('Auto-reply skipped: SMTP not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"GalileeFX Academy" <noreply@galileefx.com>',
      to: customerEmail,
      subject: 'We received your message - GalileeFX Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700;">Hi ${customerName}!</h2>
          
          <p>Thank you for contacting GalileeFX Academy. We've received your message and will get back to you within 24-48 hours.</p>
          
          <p>Best regards,<br><strong>The GalileeFX Team</strong></p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Auto-reply error:', error)
    return { success: false, error }
  }
}
