import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailVerificationData {
  email: string
  name: string
  verificationUrl: string
}

export async function sendVerificationEmail(data: EmailVerificationData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'RateMyCollege <onboarding@resend.dev>',
      to: [data.email],
      subject: 'Verify your RateMyCollege account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your RateMyCollege account</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: white;
              color: #333;
              padding: 30px;
              text-align: center;
              border-radius: 12px 12px 0 0;
              border-bottom: 2px solid #e5e7eb;
            }
            .content {
              background: white;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 12px 12px;
            }
            .button {
              display: inline-block;
              background: #F95F62;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">
              <span style="color: #173F5F;">RateMy</span><span style="color: #F95F62;">College</span>
            </h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify your account</p>
          </div>
          
          <div class="content">
            <h2>Welcome to RateMyCollege, ${data.name}!</h2>
            
            <p>Thanks for signing up! To complete your account verification and start sharing your college experiences, please click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">
                Verify My Email Address
              </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">
              ${data.verificationUrl}
            </p>
            
            <p><strong>This link will expire in 24 hours.</strong></p>
            
            <p>If you didn't create a RateMyCollege account, you can safely ignore this email.</p>
          </div>
          
                     <div class="footer">
             <p>© 2025 RateMyCollege. All rights reserved.</p>
             <p>This email was sent to ${data.email}</p>
           </div>
        </body>
        </html>
      `,
      text: `
Welcome to RateMyCollege, ${data.name}!

Thanks for signing up! To complete your account verification and start sharing your college experiences, please visit this link:

${data.verificationUrl}

This link will expire in 24 hours.

If you didn't create a RateMyCollege account, you can safely ignore this email.

© 2025 RateMyCollege. All rights reserved.
      `
    })

    if (error) {
      console.error('Resend email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Verification email sent successfully:', result)
    return { success: true, messageId: result?.id }

  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error: 'Failed to send verification email' }
  }
} 