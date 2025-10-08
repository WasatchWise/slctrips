/**
 * GET /api/tripkits/:slug
 * Get TripKit details with destinations
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'TripKit slug is required'
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
      .select('*')
      .eq('slug', slug)
      .single();

    if (tripkitError) throw tripkitError;

    if (!tripkit) {
      return res.status(404).json({
        error: 'Not Found',
        message: `TripKit '${slug}' not found`
      });
    }

    // Get linked destinations
    const { data: junctionData, error: junctionError } = await supabase
      .from('tripkit_destinations')
      .select(`
        display_order,
        is_preview,
        state_code,
        destinations (
          id,
          name,
          slug,
          latitude,
          longitude,
          county,
          region,
          category,
          subcategory,
          photo_gallery,
          ai_story,
          ai_summary,
          featured,
          guardian,
          learning_objectives,
          field_trip_stops,
          activities,
          historical_timeline,
          what3words,
          state_code
        )
      `)
      .eq('tripkit_id', tripkit.id)
      .order('display_order', { ascending: true });

    if (junctionError) throw junctionError;

    // Format destinations
    const destinations = (junctionData || []).map(item => ({
      ...item.destinations,
      display_order: item.display_order,
      is_preview: item.is_preview,
      tripkit_state_code: item.state_code
    }));

    // Separate preview and full destinations
    const preview_destinations = destinations.filter(d => d.is_preview);
    const full_destinations = destinations.filter(d => !d.is_preview);

    res.status(200).json({
      ...tripkit,
      destinations: {
        all: destinations,
        preview: preview_destinations,
        full: full_destinations,
        total_count: destinations.length,
        preview_count: preview_destinations.length
      }
    });

  } catch (error) {
    console.error('TripKit detail error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
