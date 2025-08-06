import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Destinations API called');
    console.log('Environment variables:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasSupabaseKey: !!process.env.SUPABASE_KEY,
      hasDanielSupabaseKey: !!process.env.DANIEL_SUPABASE_ANON_KEY,
      hasPostgresUrl: !!process.env.mkepcjzqnbowrgbvjfem_POSTGRES_URL,
      environment: process.env.NODE_ENV
    });
    
    const { limit = "50", offset = "0", category, search } = req.query;
    
    // Use available environment variables - try multiple possible names
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mkepcjzqnbowrgbvjfem.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.DANIEL_SUPABASE_ANON_KEY;
    
    if (!supabaseKey) {
      console.error('No Supabase key available');
      return res.status(500).json({ 
        error: 'Configuration error', 
        details: 'Missing Supabase API key',
        message: 'Check environment variables in Vercel dashboard'
      });
    }
    
    console.log('Creating Supabase client with:', { supabaseUrl, hasKey: !!supabaseKey });
    const supabase = createClient(supabaseUrl, supabaseKey);
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
} 