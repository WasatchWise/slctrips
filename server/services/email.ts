// Email service using real SendGrid API key
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with real API key
const sendGridApiKey = process.env.SENDGRID_API_KEY
if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey)
}

export interface EmailTemplate {
  to: string
  from: string
  subject: string
  templateId?: string
  dynamicTemplateData?: Record<string, any>
}

export const emailService = {
  async sendWelcomeEmail(userEmail: string, userName: string) {
    if (!sendGridApiKey) {
      console.log(`Welcome email would be sent to ${userEmail} for ${userName} (SendGrid not configured)`)
      return { success: true, message: 'Email logged (SendGrid not configured)' }
    }

    const msg: EmailTemplate = {
      to: userEmail,
      from: 'welcome@slctrips.com',
      subject: 'Welcome to SLC Trips! 🏔️',
      templateId: 'd-welcome-template-id', // Create this template in SendGrid
      dynamicTemplateData: {
        name: userName,
        login_url: 'https://slctrips.com/login',
        explore_url: 'https://slctrips.com/destinations',
        support_email: 'support@slctrips.com'
      }
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Welcome email sent to ${userEmail}`)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, error }
    }
  },

  async sendTripKitEmail(userEmail: string, tripKitName: string, downloadUrl: string) {
    if (!sendGridApiKey) {
      console.log(`TripKit email would be sent to ${userEmail} for ${tripKitName} (SendGrid not configured)`)
      return { success: true, message: 'Email logged (SendGrid not configured)' }
    }

    const msg: EmailTemplate = {
      to: userEmail,
      from: 'trips@slctrips.com',
      subject: `Your ${tripKitName} is ready! 🎒`,
      templateId: 'd-tripkit-template-id', // Create this template in SendGrid
      dynamicTemplateData: {
        trip_kit_name: tripKitName,
        download_url: downloadUrl,
        support_url: 'https://slctrips.com/support'
      }
    }
    
    try {
      await sgMail.send(msg)
      console.log(`TripKit email sent to ${userEmail}`)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, error }
    }
  },

  async sendSubscriptionConfirmation(userEmail: string, planName: string, amount: string) {
    if (!sendGridApiKey) {
      console.log(`Subscription confirmation would be sent to ${userEmail} for ${planName} (SendGrid not configured)`)
      return { success: true, message: 'Email logged (SendGrid not configured)' }
    }

    const msg: EmailTemplate = {
      to: userEmail,
      from: 'billing@slctrips.com',
      subject: `Welcome to ${planName}! 💳`,
      templateId: 'd-subscription-template-id', // Create this template in SendGrid
      dynamicTemplateData: {
        plan_name: planName,
        amount: amount,
        billing_url: 'https://slctrips.com/billing',
        support_email: 'billing@slctrips.com'
      }
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Subscription confirmation sent to ${userEmail}`)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, error }
    }
  },

  async sendPasswordReset(userEmail: string, resetUrl: string) {
    if (!sendGridApiKey) {
      console.log(`Password reset email would be sent to ${userEmail} (SendGrid not configured)`)
      return { success: true, message: 'Email logged (SendGrid not configured)' }
    }

    const msg: EmailTemplate = {
      to: userEmail,
      from: 'security@slctrips.com',
      subject: 'Reset your SLC Trips password 🔐',
      templateId: 'd-password-reset-template-id', // Create this template in SendGrid
      dynamicTemplateData: {
        reset_url: resetUrl,
        expiry_hours: 24,
        support_email: 'security@slctrips.com'
      }
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Password reset email sent to ${userEmail}`)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, error }
    }
  },

  async sendOlympicUpdates(userEmail: string, updates: string[]) {
    if (!sendGridApiKey) {
      console.log(`Olympic updates would be sent to ${userEmail} (SendGrid not configured)`)
      return { success: true, message: 'Email logged (SendGrid not configured)' }
    }

    const msg: EmailTemplate = {
      to: userEmail,
      from: 'olympics@slctrips.com',
      subject: '🏆 Latest Olympic Venue Updates',
      templateId: 'd-olympic-updates-template-id', // Create this template in SendGrid
      dynamicTemplateData: {
        updates: updates,
        venues_url: 'https://slctrips.com/olympic-venues',
        tickets_url: 'https://slctrips.com/olympic-tickets'
      }
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Olympic updates sent to ${userEmail}`)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, error }
    }
  }
} 