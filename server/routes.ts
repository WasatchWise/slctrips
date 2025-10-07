import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerSupabaseRoutes } from './supabase-routes';
import { supabaseSyncManager, supabaseDataValidator } from './supabase-sync';
import { mtOlympusDataManager } from './supabase-mt-olympus';
import { generateAPIDocumentation } from './supabase-api-docs';
import { supabaseTableCreator } from './supabase-table-creator';
import { photoEnrichmentSystem } from './photo-enrichment-system';
import { photoVerificationSystem } from './photo-verification';
import express from "express";
import { Client } from '@googlemaps/google-maps-services-js';

// TypeScript interfaces
interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  visibility: number;
  windSpeed: number;
  icon: string;
}

interface Destination {
  id: string;
  name: string;
  description?: string;
  drive_time?: number;
  driveTime?: number;
  category?: string;
  subcategory?: string;
  address?: string;
  rating?: number;
  photos?: Array<{
    url: string;
    alt_text?: string;
  }>;
  photo_url?: string;
  image_url?: string;
  [key: string]: unknown;
}

interface PhotoProxyRequest {
  ref?: string;
  maxwidth?: string;
  url?: string;
}

const googleMapsClient = new Client({});

// Utility function to create URL-friendly slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Validate essential environment variables at startup
const essentialEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'SESSION_SECRET',
];

const missingEssentialVars = essentialEnvVars.filter((key) => !process.env[key]);
if (missingEssentialVars.length > 0) {
  console.warn('Missing essential environment variables:', missingEssentialVars.join(', '));
  console.warn('Some features may not work properly');
}

// Log warnings for optional but recommended variables
const optionalVars = ['GOOGLE_PLACES_API_KEY', 'SENDGRID_API_KEY', 'OPENWEATHER_API_KEY'];
const missingOptionalVars = optionalVars.filter((key) => !process.env[key]);
if (missingOptionalVars.length > 0) {
  console.warn('Optional environment variables missing (some features may not work):', missingOptionalVars.join(', '));
}

export function registerRoutes(app: Express): Server {
  // Health check endpoint with actual destination count from Daniel database
  app.get("/api/health", async (req, res) => {
    try {
      // Simple health check without database dependency for debugging
      res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString(),
        destinations: 0,
        database: "offline",
        environment: process.env.NODE_ENV || 'development',
        message: "Basic health check - database connection disabled for debugging"
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ 
        status: "error", 
        message: "Health check failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Photo proxy endpoint for Google Places photos
  app.get('/api/photo-proxy', async (req, res) => {
    try {
      const { ref, maxwidth = '800', url } = req.query as PhotoProxyRequest;
      const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY || 
                     process.env.GOOGLE_PLACES_API_KEY ||
                     process.env.GOOGLE_MAPS_API_KEY ||
                     process.env.GOOGLE_API_KEY;

      if (!apiKey) {
        console.warn('No Google API key found for photo proxy');
        return res.status(500).json({ 
          error: 'Google API key not configured',
          available_keys: {
            VITE_GOOGLE_PLACES_API_KEY: !!process.env.VITE_GOOGLE_PLACES_API_KEY,
            GOOGLE_PLACES_API_KEY: !!process.env.GOOGLE_PLACES_API_KEY,
            GOOGLE_MAPS_API_KEY: !!process.env.GOOGLE_MAPS_API_KEY,
            GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY
          }
        });
      }

      if (ref) {
        // Handle Google Places photo reference
        const photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=' + maxwidth + '&photoreference=' + ref + '&key=' + apiKey;

        const response = await fetch(photoUrl);
        
        if (response.ok) {
          res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
          res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
          const buffer = await response.arrayBuffer();
          res.send(Buffer.from(buffer));
        } else {
          console.warn('Photo fetch failed:', response.status, response.statusText);
          res.status(404).json({ 
            error: 'Photo not found',
            status: response.status,
            statusText: response.statusText
          });
        }
      } else if (url) {
        // Handle other photo URLs
        const decodedUrl = decodeURIComponent(url);

        // Special handling for Google Places photos
        if (decodedUrl.includes('maps.googleapis.com/maps/api/place/photo')) {
          // Extract photoreference from the URL
          const urlParams = new URLSearchParams(decodedUrl.split('?')[1]);
          const photoreference = urlParams.get('photoreference');
          
          if (photoreference) {
            // Reconstruct the URL with our API key
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoreference}&key=${apiKey}`;
            
            const response = await fetch(photoUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SLC-Trips-Photo-Proxy/1.0)'
              }
            });
            
            if (response.ok) {
              res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
              res.set('Cache-Control', 'public, max-age=86400');
              const buffer = await response.arrayBuffer();
              res.send(Buffer.from(buffer));
              return;
            } else {
              console.warn('Google Places photo fetch failed:', response.status, response.statusText);
              // Fall back to original URL
            }
          }
        }

        // Try the original URL
        const response = await fetch(decodedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SLC-Trips-Photo-Proxy/1.0)'
          }
        });

        if (response.ok) {
          res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
          res.set('Cache-Control', 'public, max-age=86400');
          const buffer = await response.arrayBuffer();
          res.send(Buffer.from(buffer));
        } else {
          console.warn('Photo fetch failed:', response.status, response.statusText);
          res.status(404).json({ 
            error: 'Photo not found',
            status: response.status,
            statusText: response.statusText
          });
        }
      } else {
        res.status(400).json({ error: 'Missing ref or url parameter' });
      }
    } catch (error) {
      console.error('Photo proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Core destinations list endpoint
  app.get("/api/destinations", async (req, res) => {
    try {
      console.log('Destinations API called');
      console.log('Environment variables:', {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
        environment: process.env.NODE_ENV
      });
      
      const { limit = "all", offset = "0", category, search, status = "all" } = req.query;
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      let query = supabase
        .from('destinations')
        .select('*')
        .order('name', { ascending: true });

      // Only apply range if limit is specified and not "all"
      if (limit !== "all") {
        query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
      }

      if (category) {
        query = query.eq('category', category as string);
      }

      if (search) {
        query = query.ilike('name', `%${search as string}%`);
      }

      // Filter by status if specified
      if (status !== "all") {
        query = query.eq('status', status as string);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Destinations API error:', error);
        return res.status(500).json({ 
          error: 'Database error', 
          details: error.message,
          message: 'Check environment variables in Vercel dashboard'
        });
      }

      console.log(`Found ${data?.length || 0} destinations`);
      res.json({
        destinations: data || [],
        pagination: {
          limit: limit === "all" ? data?.length || 0 : parseInt(limit as string),
          offset: parseInt(offset as string),
          total: data?.length || 0,
          status: status
        }
      });
    } catch (error) {
      console.error('Destinations API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Simple activation endpoint
  app.get("/api/destinations/activate", async (req, res) => {
    try {
      console.log('Activating all inactive destinations');
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      // Update all inactive destinations to active
      const { data, error } = await supabase
        .from('destinations')
        .update({ status: 'active' })
        .eq('status', 'inactive');

      if (error) {
        console.error('Activation error:', error);
        return res.status(500).json({ 
          error: 'Database error', 
          details: error.message
        });
      }

      console.log(`Activated destinations`);
      res.json({
        success: true,
        message: `Activated all inactive destinations`,
        activated: true
      });
    } catch (error) {
      console.error('Activation API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Weather API endpoint
  app.get("/api/weather/slc-airport", async (req, res) => {
    try {
      if (!process.env.OPENWEATHER_API_KEY) {
        return res.status(500).json({ error: 'OpenWeather API key not configured' });
      }

      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Salt+Lake+City,UT,US&appid=' + process.env.OPENWEATHER_API_KEY + '&units=imperial');
      
      if (!response.ok) {
        throw new Error(`OpenWeather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        visibility: data.visibility / 1000, // Convert to km
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
      };
      
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Weather data unavailable' });
    }
  });

  // Destinations API endpoint
  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Destination not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Destination API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Golf courses API endpoint
  app.get("/api/golf/courses", async (req, res) => {
    try {
      const { limit = "50", offset = "0", search } = req.query;
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      let query = supabase
        .from('destinations')
        .select('*')
        .or('category.eq.golf,subcategory.eq.golf,course_type.not.is.null')
        .order('name', { ascending: true })
        .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

      if (search) {
        query = query.ilike('name', `%${search as string}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Golf courses API error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
      }

      // Filter to ensure we only return golf courses
      const golfCourses = data?.filter(dest => 
        dest.category === 'golf' || 
        dest.subcategory === 'golf' ||
        dest.course_type ||
        dest.holes ||
        dest.par ||
        dest.yardage
      ) || [];

      res.json({
        golfCourses,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: golfCourses.length
        }
      });
    } catch (error) {
      console.error('Golf courses API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Analytics endpoints
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { page, data, timestamp } = req.body;
      console.log('Page view tracked:', { page, data, timestamp });
      res.json({ success: true });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Analytics tracking failed' });
    }
  });

  app.post("/api/analytics/event", async (req, res) => {
    try {
      const { event, data, timestamp } = req.body;
      console.log('Event tracked:', { event, data, timestamp });
      res.json({ success: true });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Analytics tracking failed' });
    }
  });

  // Admin endpoints
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      // Get basic stats
      const { count: destinationsCount } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });

      res.json({
        destinations: destinationsCount || 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({ error: 'Admin dashboard failed' });
    }
  });

  app.get("/api/admin/submissions", async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Database error', details: error.message });
      }

      res.json(data || []);
    } catch (error) {
      console.error('Admin submissions error:', error);
      res.status(500).json({ error: 'Admin submissions failed' });
    }
  });

  // Analytics endpoints (stubs for MVP)
  app.get("/api/analytics/destinations", async (req, res) => {
    try {
      const { timeframe = "30" } = req.query;
      // Stub: Return empty array for now
      // TODO: Implement actual analytics tracking
      res.json([]);
    } catch (error) {
      console.error('Analytics destinations error:', error);
      res.status(500).json({ error: 'Analytics failed' });
    }
  });

  app.get("/api/marketing/opportunities", async (req, res) => {
    try {
      // Stub: Return empty array for now
      // TODO: Implement marketing opportunities logic
      res.json([]);
    } catch (error) {
      console.error('Marketing opportunities error:', error);
      res.status(500).json({ error: 'Marketing opportunities failed' });
    }
  });

  // Register other routes
  registerSupabaseRoutes(app);

  // Return server instance
  return createServer(app);
} 