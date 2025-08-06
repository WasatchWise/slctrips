import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Try to import Supabase client, but don't fail if it doesn't work
let supabase: any = null;
let testSupabaseConnection: any = null;
let getDanielCount: any = null;
let getDanielSample: any = null;

try {
  const supabaseModule = await import('./supabase-client.js');
  supabase = supabaseModule.supabase;
  testSupabaseConnection = supabaseModule.testSupabaseConnection;
  getDanielCount = supabaseModule.getDanielCount;
getDanielSample = supabaseModule.getDanielSample;
  console.log('✅ Supabase client loaded successfully');
} catch (error) {
  console.log('⚠️  Supabase client failed to load:', error);
  console.log('   Server will run with limited functionality');
}

// Import affiliate routes
let affiliateRouter: any = null;
let amazonAffiliateRouter: any = null;
let destinationsRouter: any = null;
let tripKitsRouter: any = null;
try {
  const affiliateModule = await import('./routes/affiliate.js');
      affiliateRouter = affiliateModule.default;
    console.log('✅ Affiliate routes loaded successfully');
  } catch (error) {
    console.log('⚠️  Affiliate routes failed to load:', error);
  }

  try {
    const destinationsModule = await import('./routes/destinations.js');
    destinationsRouter = destinationsModule.default;
    console.log('✅ Destinations routes loaded successfully');
  } catch (error) {
    console.log('⚠️  Destinations routes failed to load:', error);
  }

  try {
    const tripKitsModule = await import('./routes/tripkits.js');
    tripKitsRouter = tripKitsModule.default;
    console.log('✅ TripKits routes loaded successfully');
  } catch (error) {
    console.log('⚠️  TripKits routes failed to load:', error);
  }

try {
  const amazonAffiliateModule = await import('./routes/amazon-affiliate.js');
  amazonAffiliateRouter = amazonAffiliateModule.default;
  console.log('✅ Amazon affiliate routes loaded successfully');
} catch (error) {
  console.log('⚠️  Amazon affiliate routes failed to load:', error);
}

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mount affiliate routes
if (affiliateRouter) {
  app.use('/api/affiliate', affiliateRouter);
  console.log('✅ Affiliate routes mounted at /api/affiliate');
}

if (amazonAffiliateRouter) {
  app.use('/api/amazon-affiliate', amazonAffiliateRouter);
  console.log('✅ Amazon affiliate routes mounted at /api/amazon-affiliate');
}

if (destinationsRouter) {
  app.use('/api/destinations', destinationsRouter);
  console.log('✅ Destinations routes mounted at /api/destinations');
}

if (tripKitsRouter) {
  app.use('/api/tripkits', tripKitsRouter);
  console.log('✅ TripKits routes mounted at /api/tripkits');
}

// Simple health check with database status
app.get('/api/health', async (req, res) => {
  let dbStatus = { connected: false, error: 'Supabase not loaded', tables: [] };
  
  if (testSupabaseConnection) {
    try {
      dbStatus = await testSupabaseConnection();
    } catch (error) {
      dbStatus = { connected: false, error: 'Database test failed', tables: [] };
    }
  }
  
  res.json({
    status: 'healthy',
    message: 'SLC Trips server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: dbStatus
  });
});

// Weather endpoint - keeping mock data for now due to OpenWeather API key issues
app.get('/api/weather/slc-airport', (req, res) => {
  res.json({
    temperature: 75,
    condition: 'Sunny',
    description: 'Beautiful day in Salt Lake City',
    visibility: 10,
    windSpeed: 5,
    icon: '01d',
    note: 'Using mock data - OpenWeather API integration pending'
  });
});

// Real destinations endpoint using Supabase
app.get('/api/destinations', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Supabase client not initialized - check environment variables',
        fallback: [
          {
            id: 1,
            name: 'Mount Olympus',
            category: 'Hiking',
            drive_time: 30,
            distance: '30 miles',
            address: 'Salt Lake City, UT'
          },
          {
            id: 2,
            name: 'Big Cottonwood Canyon',
            category: 'Outdoor',
            drive_time: 45,
            distance: '45 miles',
            address: 'Big Cottonwood Canyon, UT'
          }
        ]
      });
    }

    const { data, error } = await supabase
      .from('destinations')
      .select('id, name, category, drive_time, distance, address, coordinates, website, photos, rating, vibe')
      .limit(20)
      .order('name');

    if (error) {
      console.error('Database error:', error);
      // Return fallback data instead of error
      return res.json({
        destinations: [
          {
            id: 1,
            name: 'Mount Olympus',
            category: 'Hiking',
            drive_time: 30,
            distance: '30 miles',
            address: 'Salt Lake City, UT',
            rating: 4.5,
            vibe: 'Adventure'
          },
          {
            id: 2,
            name: 'Big Cottonwood Canyon',
            category: 'Outdoor',
            drive_time: 45,
            distance: '45 miles',
            address: 'Big Cottonwood Canyon, UT',
            rating: 4.3,
            vibe: 'Nature'
          },
          {
            id: 3,
            name: 'Temple Square',
            category: 'Downtown & Nearby',
            drive_time: 10,
            distance: '2 miles',
            address: 'Salt Lake City, UT',
            rating: 4.0,
            vibe: 'Cultural'
          }
        ],
        pagination: {
          limit: 20,
          offset: 0,
          total: 3
        },
        source: 'Fallback Data (Database unavailable)',
        note: 'Using fallback data due to database connection issue'
      });
    }

    res.json({
      destinations: data || [],
      pagination: {
        limit: 20,
        offset: 0,
        total: data?.length || 0
      },
      source: 'Supabase Database'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database stats endpoint
app.get('/api/database/stats', async (req, res) => {
  try {
    if (!testSupabaseConnection || !getDanielCount || !getDanielSample) {
      return res.json({
        connection: { connected: false, error: 'Supabase functions not available' },
        destinations: { count: 0, sample: [] },
        timestamp: new Date().toISOString(),
        note: 'Running in fallback mode'
      });
    }

    const connectionStatus = await testSupabaseConnection();
    const countResult = await getDanielCount();
const sampleResult = await getDanielSample(3);

    res.json({
      connection: connectionStatus,
      destinations: {
        count: countResult.success ? countResult.count : 0,
        sample: sampleResult.success ? sampleResult.data : []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Failed to get database stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Single destination endpoint
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not connected'
      });
    }

    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Destination not found'
        });
      }
      return res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Photo proxy (simple version)
app.get('/api/photo-proxy', (req, res) => {
  const { ref, url } = req.query;
  
  if (!ref && !url) {
    return res.status(400).json({ error: 'Missing ref or url parameter' });
  }
  
  // For now, just return a placeholder response
  res.json({
    message: 'Photo proxy endpoint working',
    ref: ref || null,
    url: url || null
  });
});

// Analytics endpoints
app.post('/api/analytics/pageview', (req, res) => {
  console.log('Page view tracked:', req.body);
  res.json({ success: true, message: 'Page view tracked' });
});

app.post('/api/analytics/event', (req, res) => {
  console.log('Event tracked:', req.body);
  res.json({ success: true, message: 'Event tracked' });
});

// Admin dashboard with real data
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    let count = 0;
    let databaseConnected = false;

    if (getDanielCount && testSupabaseConnection) {
const countResult = await getDanielCount();
      const connectionStatus = await testSupabaseConnection();
      count = countResult.success ? countResult.count : 0;
      databaseConnected = connectionStatus.connected;
    }

    res.json({
      destinations: count,
      databaseConnected,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple SLC Trips server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌤️  Weather: http://localhost:${PORT}/api/weather/slc-airport`);
  console.log(`🗺️  Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`📊 Database stats: http://localhost:${PORT}/api/database/stats`);
  console.log(`⚙️  Admin dashboard: http://localhost:${PORT}/api/admin/dashboard`);
});

export default app; 