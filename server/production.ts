import express from 'express';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import path from 'path';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://olympus-nine-omega.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.DANIEL_SUPABASE_ANON_KEY!
);

// Middleware
app.use(express.json());

// Serve static files from client/dist
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/api/destinations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .limit(100);
    
    if (error) throw error;
    
    res.json({
      success: true,
      destinations: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destinations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/destinations/count', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('destinations')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    res.json({
      success: true,
      count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destinations count',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.json({
        success: true,
        destinations: [],
        count: 0,
        query: q || '',
        timestamp: new Date().toISOString()
      });
    }
    
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%`)
      .limit(50);
    
    if (error) throw error;
    
    res.json({
      success: true,
      destinations: data || [],
      count: data?.length || 0,
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search destinations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/todays-picks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('featured', true)
      .limit(6);
    
    if (error) throw error;
    
    let picks = data;
    if (!picks || picks.length === 0) {
      const { data: randomData, error: randomError } = await supabase
        .from('destinations')
        .select('*')
        .limit(6);
      
      if (randomError) throw randomError;
      picks = randomData;
    }
    
    res.json({
      success: true,
      picks: picks || [],
      count: picks?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s picks',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SLC Trips Production Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/search?q=golf`);
  console.log(`⭐ Today's Picks: http://localhost:${PORT}/api/todays-picks`);
});
