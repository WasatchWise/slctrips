/**
 * POST /api/tripkits/checkout
 * Create Stripe checkout session for premium TripKits
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    tripkit_id,
    email,
    success_url,
    cancel_url
  } = req.body;

  // Validation
  if (!tripkit_id || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'tripkit_id and email are required'
    });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Get TripKit details
    const { data: tripkit, error: tripkitError } = await supabase
      .from('tripkits')
      .select('id, name, slug, price, tier, stripe_product_id, stripe_price_id')
      .eq('id', tripkit_id)
      .single();

    if (tripkitError || !tripkit) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'TripKit not found'
      });
    }

    if (tripkit.price === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'This TripKit is free. Use /api/tripkits/subscribe instead.'
      });
    }

    if (!tripkit.stripe_price_id) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'Stripe not configured for this TripKit'
      });
    }

    // TODO: Initialize Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // TODO: Create Stripe checkout session
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: tripkit.stripe_price_id,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: success_url || `${req.headers.origin}/tripkits/${tripkit.slug}/success`,
      cancel_url: cancel_url || `${req.headers.origin}/tripkits/${tripkit.slug}`,
      customer_email: email,
      metadata: {
        tripkit_id: tripkit.id,
        tripkit_slug: tripkit.slug
      }
    });
    */

    // Get client IP
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Create pending order record
    const { data: order, error: orderError } = await supabase
      .from('tripkit_orders')
      .insert({
        // stripe_session_id: session.id, // TODO: Add when Stripe integrated
        tripkit_id: tripkit.id,
        email: email.toLowerCase().trim(),
        amount_cents: Math.round(tripkit.price * 100),
        currency: 'usd',
        status: 'pending',
        ip_address,
        user_agent
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // TODO: Return Stripe session URL
    res.status(200).json({
      success: true,
      message: 'Checkout session created',
      order_id: order.id,
      // checkout_url: session.url, // TODO: Add when Stripe integrated
      checkout_url: '#', // Placeholder
      note: 'Stripe integration pending - set STRIPE_SECRET_KEY environment variable'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
