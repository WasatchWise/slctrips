import 'dotenv/config';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const DANIEL_SUPABASE_ANON_KEY = getEnvVar('DANIEL_SUPABASE_ANON_KEY');
export const DATABASE_URL = getEnvVar('DATABASE_URL');

