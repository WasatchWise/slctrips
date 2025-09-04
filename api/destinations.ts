import express from "express";
import { createClient } from '@supabase/supabase-js';
import { DANIEL_SUPABASE_ANON_KEY } from '../server/config';

const app = express();
app.use(express.json());

app.get("/api/destinations", async (req, res) => {
  try {
    console.log('Destinations API called');
    console.log('Environment variables:', {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!DANIEL_SUPABASE_ANON_KEY,
      environment: process.env.NODE_ENV
    });
    
    const { limit = "50", offset = "0", category, search } = req.query;
    
    console.log('Creating Supabase client...');
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        DANIEL_SUPABASE_ANON_KEY
      );
    console.log('Supabase client created successfully');

    console.log('Building query...');
    let query = supabase
      .from('destinations')
      .select('*')
      .order('name', { ascending: true })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (category) {
      query = query.eq('category', category as string);
    }

    if (search) {
      query = query.ilike('name', `%${search as string}%`);
    }

    console.log('Executing query...');
    const { data, error } = await query;
    console.log('Query executed');

    if (error) {
      console.error('Destinations API error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message,
        message: 'Check environment variables in Vercel dashboard'
      });
    }

    console.log(`Found ${data?.length || 0} destinations`);
    res.json({
      destinations: data || [],
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Destinations API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default app; 