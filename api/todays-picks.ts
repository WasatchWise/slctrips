import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.DANIEL_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get featured destinations or random picks
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('featured', true)
      .limit(6);
    
    if (error) throw error;
    
    // If no featured destinations, get random ones
    let picks = data;
    if (!picks || picks.length === 0) {
      const { data: randomData, error: randomError } = await supabase
        .from('destinations')
        .select('*')
        .limit(6);
      
      if (randomError) throw randomError;
      picks = randomData;
    }
    
    res.json({
      success: true,
      picks: picks || [],
      count: picks?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s picks',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
