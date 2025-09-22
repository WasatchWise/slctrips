import { createClient } from '@supabase/supabase-js';
import type { Database } from '../shared/supabase-types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.DANIEL_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL must be set");
}

if (!supabaseAnonKey) {
  throw new Error("DANIEL_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY must be set");
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Test connection on module load
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('uuid, name')
      .limit(1);
    
    if (error) {
      // console.error('Supabase connection error:', error.message);
    } else {
      // console.log('✅ Supabase connection successful');
    }
  } catch (_err) {
    // console.error('Supabase connection failed:', err);
  }
}

testConnection();