import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Destination ID is required'
      });
    }

    console.log('Fetching destination:', id);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Try UUID lookup first
    let query = supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    let { data, error } = await query;

    // If UUID lookup fails and ID looks like a number, try integer ID
    if (error && /^\d+$/.test(id)) {
      query = supabase
        .from('destinations')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      const result = await query;
      data = result.data;
      error = result.error;
    }

    // If still not found, try slug/name search
    if (error || !data) {
      const searchQuery = supabase
        .from('destinations')
        .select('*')
        .or(`slug.eq.${id},name.ilike.%${id.replace(/-/g, ' ')}%`)
        .limit(1);

      const searchResult = await searchQuery;

      if (searchResult.data && searchResult.data.length > 0) {
        data = searchResult.data[0];
        error = null;
      } else {
        error = searchResult.error || new Error('Destination not found');
      }
    }

    if (error || !data) {
      console.error('Destination not found:', id, error);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Destination not found',
        id
      });
    }

    console.log('Found destination:', data.name);
    res.json(data);

  } catch (error) {
    console.error('Destination lookup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
