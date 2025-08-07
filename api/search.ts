import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.json({
        success: true,
        destinations: [],
        count: 0,
        query: q || '',
        timestamp: new Date().toISOString()
      });
    }
    
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.DANIEL_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%`)
      .limit(50);
    
    if (error) throw error;
    
    res.json({
      success: true,
      destinations: data || [],
      count: data?.length || 0,
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search destinations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
