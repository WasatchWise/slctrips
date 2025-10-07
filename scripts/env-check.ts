/**
 * Environment Variable Check Script for Node.js 20
 * 
 * This script checks if all required environment variables are set
 * for the SLC Trips application.
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const requiredEnvVars: EnvVar[] = [
  {
    name: 'DATABASE_URL',
    required: true,
    description: 'PostgreSQL database connection string'
  },
  {
    name: 'SUPABASE_URL',
    required: true,
    description: 'Supabase project URL'
  },
  {
    name: 'SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key'
  },
  {
    name: 'GOOGLE_PLACES_API_KEY',
    required: false,
    description: 'Google Places API key (optional for photo sync)'
  },
  {
    name: 'VITE_GOOGLE_PLACES_API_KEY',
    required: false,
    description: 'Google Places API key for client-side (optional)'
  },
  {
    name: 'OPENWEATHER_API_KEY',
    required: false,
    description: 'OpenWeather API key (optional)'
  },
  {
    name: 'SESSION_SECRET',
    required: false,
    description: 'Session secret for authentication (optional)'
  }
];

function checkEnvironmentVariables(): void {
  console.log('🔍 Checking environment variables...');
  console.log('='.repeat(60));

  let allRequiredPresent = true;
  const missing: string[] = [];
  const present: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];
    
    if (value && value.trim() !== '') {
      present.push(envVar.name);
      console.log(`✅ ${envVar.name}: Set`);
    } else {
      if (envVar.required) {
        missing.push(envVar.name);
        allRequiredPresent = false;
        console.log(`❌ ${envVar.name}: Missing (Required)`);
      } else {
        console.log(`⚠️ ${envVar.name}: Not set (Optional)`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (allRequiredPresent) {
    console.log('✅ All required environment variables are set!');
    console.log(`📊 Found ${present.length} variables`);
  } else {
    console.log('❌ Missing required environment variables:');
    missing.forEach(name => {
      console.log(`   - ${name}`);
    });
    console.log('\nPlease set the missing variables in your .env file.');
  }

  console.log('\n📋 Environment Variable Summary:');
  console.log(`   Required: ${requiredEnvVars.filter(r => r.required).length}`);
  console.log(`   Optional: ${requiredEnvVars.filter(r => !r.required).length}`);
  console.log(`   Set: ${present.length}`);
  console.log(`   Missing: ${missing.length}`);

  if (!allRequiredPresent) {
    process.exit(1);
  }
}

// Run the check
checkEnvironmentVariables(); 