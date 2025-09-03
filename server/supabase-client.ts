/**
 * Supabase Client Configuration for SLC Trips
 * Handles connection to authentic destinations data
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

// Use environment variables only
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Provide better error messages for missing environment variables
if (!SUPABASE_ANON_KEY) {
  // console.error('❌ SUPABASE_ANON_KEY environment variable is not set');
  // console.error('Please check your .env file or environment configuration');
  // Don't throw immediately, allow the app to start with limited functionality
}

// Create Supabase client only if both variables are available
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Service role client for admin operations - use service role key for writes
export const supabaseAdmin = (SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(
      SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : (SUPABASE_URL && SUPABASE_ANON_KEY) 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/**
 * Test connection to Supabase and return available tables
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return { 
      connected: false, 
      error: 'Supabase client not initialized - missing environment variables',
      timestamp: new Date().toISOString()
    };
  }

  try {
    // Try to access the schema information
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      // console.error('Supabase connection error:', error);
      return { connected: false, error: error.message };
    }

    return { 
      connected: true, 
      tables: data?.map(t => t.table_name) || [],
      timestamp: new Date().toISOString()
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // console.error('Supabase test failed:', error.message);
    } else {
      // console.error('Supabase test failed:', error);
    }
    return { connected: false, error: 'Supabase test failed' };
  }
}

/**
 * Get count of records from destinations table
 */
export async function getDanielCount() {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
          const { count, error } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });

    if (error) {
      // console.error('destinations count error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // console.error('destinations count failed:', error.message);
    } else {
      // console.error('destinations count failed:', error);
    }
    return { success: false, error: 'destinations count failed' };
  }
}

/**
 * Get sample data from destinations table
 */
export async function getDanielSample(limit = 3) {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
          const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .limit(limit);

    if (error) {
      // console.error('destinations sample error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // console.error('destinations sample failed:', error.message);
    } else {
      // console.error('destinations sample failed:', error);
    }
    return { success: false, error: 'destinations sample failed' };
  }
}