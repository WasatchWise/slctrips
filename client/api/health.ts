import { NextApiRequest, NextApiResponse } from 'next';

// Updated health endpoint for Vercel deployment
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const allEnvVars = Object.keys(process.env).filter(key => 
    key.includes('SUPABASE') || key.includes('POSTGRES') || key.includes('DATABASE')
  );
  
  const envInfo = {
    message: "API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
    hasDanielSupabaseKey: !!process.env.DANIEL_SUPABASE_ANON_KEY,
    hasPostgresUrl: !!process.env.mkepcjzqnbowrgbvjfem_POSTGRES_URL,
    // Show all available environment variables
    allSupabaseKeys: allEnvVars,
    // Show actual values (safely)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING',
    danielSupabaseKey: process.env.DANIEL_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING',
    // Check for other possible names
    hasSupabaseKey: !!process.env.SUPABASE_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL
  };

  res.status(200).json(envInfo);
} 