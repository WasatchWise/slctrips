/**
 * GET /api/tripkits
 * List all TripKits with basic info
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    // Query params
    const {
      status = 'active',
      featured,
      tier,
      state
    } = req.query;

    let query = supabase
      .from('tripkits')
      .select(`
        id,
        name,
        slug,
        tagline,
        description,
        price,
        tier,
        status,
        featured,
        cover_image_url,
        collection_type,
        primary_theme,
        states_covered,
        destination_count,
        features,
        target_audience,
        created_at,
        published_at
      `)
      .eq('status', status)
      .order('featured', { ascending: false })
      .order('price', { ascending: true });

    // Optional filters
    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }

    if (tier) {
      query = query.eq('tier', tier);
    }

    if (state) {
      query = query.contains('states_covered', [state.toUpperCase()]);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      tripkits: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('TripKit list error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
