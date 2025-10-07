// API Endpoint: Get affiliate gear for a specific destination
// Route: /api/destinations/gear?id={destinationId}
// Method: GET

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Validate destination ID
  if (!id) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Destination ID is required'
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Fetch active gear for destination, sorted by display order
    const { data, error } = await supabase
      .from('destination_affiliate_gear')
      .select('*')
      .eq('destination_id', id)
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('featured', { ascending: false }) // Featured items first within same display_order
      .limit(4); // Max 4 products per destination

    if (error) {
      console.error('Supabase error fetching gear:', error);
      throw error;
    }

    // Return empty array if no gear found (not an error)
    res.status(200).json(data || []);

  } catch (error) {
    console.error('Error fetching affiliate gear:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
