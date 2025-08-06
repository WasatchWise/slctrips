import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
console.log('🔍 Testing database connection...');
console.log('DATABASE_URL exists:', !!connectionString);

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 Connecting to database...');
    const sql = postgres(connectionString);
    const db = drizzle(sql);
    
    // Test the connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result);
    
    await sql.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection(); 