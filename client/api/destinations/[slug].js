/**
 * GET /api/destinations/[slug]
 * Get detailed destination information by slug
 * Includes: photos, location, weather, affiliate gear
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter required' });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Fetch destination with all details
    const { data: destination, error: destError } = await supabase
      .from('destinations')
      .select(`
        *,
        destination_affiliate_gear!destination_affiliate_gear_destination_id_fkey(
          id,
          product_name,
          product_description,
          category,
          affiliate_link,
          image_url,
          price,
          price_range,
          display_order,
          featured,
          tags,
          brand
        )
      `)
      .eq('slug', slug)
      .eq('destination_affiliate_gear.active', true)
      .single();

    if (destError) {
      if (destError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Destination not found' });
      }
      throw destError;
    }

    // Sort affiliate gear by display_order
    if (destination.destination_affiliate_gear) {
      destination.destination_affiliate_gear.sort((a, b) =>
        (a.display_order || 0) - (b.display_order || 0)
      );
    }

    // Add computed fields
    const enrichedDestination = {
      ...destination,

      // Google Maps embed URL
      maps_embed_url: destination.latitude && destination.longitude
        ? `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${destination.latitude},${destination.longitude}&zoom=14`
        : null,

      // Google Maps link
      maps_link: destination.latitude && destination.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`
        : null,

      // Weather data placeholder (will be fetched client-side for real-time)
      weather_api_coords: destination.latitude && destination.longitude
        ? { lat: destination.latitude, lon: destination.longitude }
        : null,
    };

    res.status(200).json(enrichedDestination);

  } catch (error) {
    console.error('Destination detail API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
