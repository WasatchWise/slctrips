import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Initialize database connection
const db = neon(process.env.DATABASE_URL!);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    message: 'SLC Trips API is running!'
  });
});

// Test environment variables
app.get('/api/env-test', (req: Request, res: Response) => {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Not set',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY ? 'Set' : 'Not set',
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY ? 'Set' : 'Not set'
  };
  
  res.json({
    message: 'Environment variables check',
    variables: envVars,
    totalSet: Object.values(envVars).filter(v => v === 'Set').length,
    totalVariables: Object.keys(envVars).length
  });
});

// Test database connection
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const result = await db`SELECT NOW() as current_time`;
    res.json({
      message: 'Database connection test',
      status: 'connected',
      timestamp: result[0]?.current_time,
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test Supabase connection
app.get('/api/supabase-test', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({
      message: 'Supabase connection test',
      status: 'connected',
      hasData: !!data,
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({
      message: 'Supabase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Daily sync test endpoint
app.get('/api/daily-sync-test', (req: Request, res: Response) => {
  res.json({
    message: 'Daily sync test endpoint',
    status: 'ready',
    timestamp: new Date().toISOString(),
    nextRun: '2:00 AM UTC daily',
    nodeVersion: process.version
  });
});

// Serve static files
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SLC Trips - API Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .status { color: green; font-weight: bold; }
        .version { color: blue; }
      </style>
    </head>
    <body>
      <h1>🚀 SLC Trips API Server</h1>
      <p class="status">✅ Server is running on port ${PORT}</p>
      <p class="version">Node.js Version: ${process.version}</p>
      
      <h2>Available Endpoints:</h2>
      <div class="endpoint">
        <strong>GET /api/health</strong> - Health check
      </div>
      <div class="endpoint">
        <strong>GET /api/env-test</strong> - Environment variables test
      </div>
      <div class="endpoint">
        <strong>GET /api/db-test</strong> - Database connection test
      </div>
      <div class="endpoint">
        <strong>GET /api/supabase-test</strong> - Supabase connection test
      </div>
      <div class="endpoint">
        <strong>GET /api/daily-sync-test</strong> - Daily sync test
      </div>
      
      <h2>Environment:</h2>
      <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      <p>Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}</p>
      <p>Supabase: ${process.env.SUPABASE_URL ? 'Connected' : 'Not configured'}</p>
      <p>Google Places: ${process.env.GOOGLE_PLACES_API_KEY ? 'Configured' : 'Not configured'}</p>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SLC Trips server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Environment test: http://localhost:${PORT}/api/env-test`);
  console.log(`🗄️ Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`🔗 Supabase test: http://localhost:${PORT}/api/supabase-test`);
  console.log(`🔄 Daily sync test: http://localhost:${PORT}/api/daily-sync-test`);
});
