import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Log all environment variables
    const allEnvVars = Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || key.includes('POSTGRES') || key.includes('DATABASE')
    );
    
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mkepcjzqnbowrgbvjfem.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.DANIEL_SUPABASE_ANON_KEY;
    
    const testInfo = {
      message: "Supabase Test",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      allEnvVars,
      supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      supabaseKeyPreview: supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'MISSING',
      // Test the connection
      connectionTest: 'pending'
    };

    if (!supabaseKey) {
      return res.status(500).json({
        ...testInfo,
        error: 'No Supabase key found',
        connectionTest: 'failed'
      });
    }

    // Try to create the client
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Try a simple query
      const { data, error } = await supabase
        .from('destinations')
        .select('count')
        .limit(1);

      if (error) {
        return res.status(500).json({
          ...testInfo,
          error: error.message,
          connectionTest: 'failed',
          supabaseError: error
        });
      }

      return res.status(200).json({
        ...testInfo,
        connectionTest: 'success',
        data: data
      });

    } catch (clientError) {
      return res.status(500).json({
        ...testInfo,
        error: clientError instanceof Error ? clientError.message : 'Unknown error',
        connectionTest: 'failed'
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 