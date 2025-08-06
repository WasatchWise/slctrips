import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.NOTIFICATION_EMAIL || 'contact@slctrips.com';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: FROM_EMAIL,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (_error) {
    // console.error('SendGrid email error:', error);
    return false;
  }
}

// Pre-built email templates for SLC Trips
export const EmailTemplates = {
  welcomeEmail: (userEmail: string, userName?: string) => ({
    to: userEmail,
    subject: 'Welcome to SLC Trips - Your Utah Adventure Begins!',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to SLC Trips!</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Utah's Ultimate Adventure Guide</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Hi ${userName || 'Adventure Seeker'}! 🎿</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to Utah's most comprehensive adventure platform! You now have access to over 700 amazing destinations, 
            including all 2034 Winter Olympics venues, within driving distance of Salt Lake City.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">What's waiting for you:</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li>Complete Olympic venue collection</li>
              <li>Drive time-based destination filtering</li>
              <li>UTA public transportation integration</li>
              <li>Authentic photos and detailed guides</li>
              <li>TripKit downloads for offline adventures</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.slctrips.com" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Start Exploring Utah
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
            Questions? Reply to this email or follow us on social media @slctrips
          </p>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            SLC Trips - Your guide to Utah's 2034 Olympic adventure destinations
          </p>
        </div>
      </div>
    `,
    text: `Welcome to SLC Trips, ${userName || 'Adventure Seeker'}!

You now have access to Utah's most comprehensive adventure platform with over 700 destinations, including all 2034 Winter Olympics venues.

What's waiting for you:
• Complete Olympic venue collection
• Drive time-based destination filtering  
• UTA public transportation integration
• Authentic photos and detailed guides
• TripKit downloads for offline adventures

Start exploring: https://www.slctrips.com

Questions? Reply to this email or follow us @slctrips`
  }),

  destinationRecommendation: (userEmail: string, destinations: any[]) => ({
    to: userEmail,
    subject: 'New Utah Adventures Just for You - SLC Trips',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Fresh Utah Adventures</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0;">Handpicked destinations for your next trip</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="color: #475569; line-height: 1.6; margin: 0 0 25px 0;">
            Based on your interests, we've found some amazing new destinations perfect for your next Utah adventure:
          </p>
          
          ${destinations.map(dest => `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0;">${dest.name}</h3>
              <p style="color: #059669; font-weight: 600; margin: 0 0 10px 0;">${dest.driveTimeText} from Salt Lake City</p>
              <p style="color: #475569; margin: 0 0 15px 0; line-height: 1.5;">${dest.description.substring(0, 150)}...</p>
              <div style="text-align: right;">
                <a href="https://www.slctrips.com/destinations/${dest.externalId}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Learn More →</a>
              </div>
            </div>
          `).join('')}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.slctrips.com" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Discover More Adventures
            </a>
          </div>
        </div>
      </div>
    `
  }),

  tripKitPurchaseConfirmation: (userEmail: string, tripKitName: string, downloadLink: string) => ({
    to: userEmail,
    subject: `Your ${tripKitName} TripKit is Ready! - SLC Trips`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">TripKit Ready!</h1>
          <p style="color: #ddd6fe; margin: 10px 0 0 0;">Your Utah adventure guide has arrived</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Thanks for your purchase!</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            Your <strong>${tripKitName}</strong> TripKit is now ready for download. This comprehensive guide includes:
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li>Detailed destination information</li>
              <li>Driving directions from Salt Lake City</li>
              <li>Local tips and insider knowledge</li>
              <li>Photo spots and must-see highlights</li>
              <li>Packing recommendations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadLink}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Download Your TripKit
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
            Enjoy your Utah adventure! Share your photos with us @slctrips
          </p>
        </div>
      </div>
    `
  }),

  olympicVenueAlert: (userEmail: string, venueName: string, eventInfo: string) => ({
    to: userEmail,
    subject: `2034 Olympics Update: ${venueName} - SLC Trips`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🥇 2034 Olympics Update</h1>
          <p style="color: #fecaca; margin: 10px 0 0 0;">${venueName}</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Olympic Venue News</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            ${eventInfo}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.slctrips.com/olympic-venues" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              View All Olympic Venues
            </a>
          </div>
        </div>
      </div>
    `
  })
};

// Utility functions for common email scenarios
export async function sendWelcomeEmail(userEmail: string, userName?: string): Promise<boolean> {
  const emailData = EmailTemplates.welcomeEmail(userEmail, userName);
  return await sendEmail(emailData);
}

export async function sendDestinationRecommendations(userEmail: string, destinations: any[]): Promise<boolean> {
  const emailData = EmailTemplates.destinationRecommendation(userEmail, destinations);
  return await sendEmail(emailData);
}

export async function sendTripKitConfirmation(userEmail: string, tripKitName: string, downloadLink: string): Promise<boolean> {
  const emailData = EmailTemplates.tripKitPurchaseConfirmation(userEmail, tripKitName, downloadLink);
  return await sendEmail(emailData);
}

export async function sendOlympicVenueAlert(userEmail: string, venueName: string, eventInfo: string): Promise<boolean> {
  const emailData = EmailTemplates.olympicVenueAlert(userEmail, venueName, eventInfo);
  return await sendEmail(emailData);
}