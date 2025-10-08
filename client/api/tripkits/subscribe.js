/**
 * POST /api/tripkits/subscribe
 * Email capture for free TripKits (TK-000)
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    name,
    tripkit_id,
    consent_given = false,
    consent_text,
    source = 'tripkit_download'
  } = req.body;

  // Validation
  if (!email || !tripkit_id) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and tripkit_id are required'
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid email address'
    });
  }

  // GDPR: Consent must be explicitly given
  if (!consent_given) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email consent is required'
    });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Verify TripKit exists and is free
    const { data: tripkit, error: tripkitError } = await supabase
      .from('tripkits')
      .select('id, name, slug, price, tier')
      .eq('id', tripkit_id)
      .single();

    if (tripkitError || !tripkit) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'TripKit not found'
      });
    }

    if (tripkit.price > 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'This TripKit requires purchase. Use /api/tripkits/checkout instead.'
      });
    }

    // Get client IP and user agent
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Insert or update subscriber
    const { data: subscriber, error: subError } = await supabase
      .from('tripkit_email_subscribers')
      .upsert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        source,
        tripkit_id,
        consent_given,
        consent_timestamp: new Date().toISOString(),
        consent_text: consent_text || 'I agree to receive emails about this TripKit',
        ip_address,
        user_agent,
        status: 'active',
        tags: [tripkit.slug, 'free_download']
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (subError) throw subError;

    // TODO: Trigger ConvertKit welcome email
    // TODO: Generate download link for TripKit PDF/content

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed',
      subscriber_id: subscriber.id,
      tripkit: {
        name: tripkit.name,
        slug: tripkit.slug
      },
      download_url: `/tripkits/${tripkit.slug}/download`, // Placeholder
      next_steps: 'Check your email for download link and welcome message'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
