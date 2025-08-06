// Cloudflare Worker entry point for SLC Trips
import { createClient } from '@supabase/supabase-js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  CACHE: KVNamespace;
}

// CORS headers for API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Initialize Supabase client
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

    try {
      // API Routes
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, url, env, supabase);
      }

      // Serve static files or redirect to main domain
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(await getIndexHtml(), {
          headers: { 'Content-Type': 'text/html', ...corsHeaders },
        });
      }

      // Handle other routes - redirect to main app
      return Response.redirect('https://your-main-domain.com' + url.pathname, 302);

    } catch (_error) {
      // console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

async function handleApiRequest(request: Request, url: URL, env: Env, supabase: any): Promise<Response> {
  const pathname = url.pathname;

  // Health check
  if (pathname === '/api/health') {
    const { count, error } = await supabase
      .from('god_brains')
      .select('*', { count: 'exact', head: true });

    return new Response(JSON.stringify({
      status: error ? 'error' : 'healthy',
      timestamp: new Date().toISOString(),
      destinations: count || 0
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get all destinations
  if (pathname === '/api/destinations') {
    const { data: destinations, error } = await supabase
      .from('god_brains')
      .select('*');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Transform to expected format
    const transformedDestinations = destinations.map((dest: any) => ({
      id: dest.id,
      uuid: dest.uuid,
      name: dest.name || 'Unnamed Destination',
      category: dest.category || 'Uncategorized',
      driveTime: dest.drive_time_minutes || 30,
      address: dest.address_full || dest.address,
      coordinates: dest.latitude && dest.longitude ? 
        { lat: dest.latitude, lng: dest.longitude } : null,
      photos: dest.cover_photo_url ? 
        [{ url: dest.cover_photo_url, caption: dest.name, source: 'Supabase' }] : [],
      description: dest.description_short || dest.description_long || dest.description,
      phone: dest.phone || '',
      website: dest.website || ''
    }));

    return new Response(JSON.stringify(transformedDestinations), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get single destination
  if (pathname.startsWith('/api/destinations/')) {
    const id = pathname.split('/').pop();
    let destination;

    // Try numeric ID first
    const numericId = parseInt(id!);
    if (!isNaN(numericId)) {
      const { data, error } = await supabase
        .from('god_brains')
        .select('*')
        .eq('id', numericId)
        .single();
      destination = data;
    } else if (id!.includes('-')) {
      // Try UUID
      const { data, error } = await supabase
        .from('god_brains')
        .select('*')
        .eq('uuid', id)
        .single();
      destination = data;
    }

    if (!destination) {
      return new Response(JSON.stringify({ message: "Destination not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Transform to expected format
    const transformed = {
      id: destination.id,
      uuid: destination.uuid,
      name: destination.name || 'Unnamed Destination',
      slug: destination.slug,
      description: destination.description_short || destination.description_long || destination.description,
      category: destination.category || 'Scenic',
      driveTime: destination.drive_time_minutes || 30,
      address: destination.address_full || destination.address,
      coordinates: destination.latitude && destination.longitude ? 
        { lat: destination.latitude, lng: destination.longitude } : null,
      photos: destination.cover_photo_url ?
        [{ url: destination.cover_photo_url, caption: destination.name, source: 'Supabase' }] : [],
      photoUrl: destination.cover_photo_url,
      activities: destination.activities || [],
      highlights: destination.highlights || [],
      accessibility: destination.accessibility || '',
      difficulty: destination.difficulty || 'Easy',
      pricing: destination.pricing || 'Free',
      phone: destination.phone || '',
      website: destination.website || '',
      localTips: destination.local_tips || '',
      tags: destination.tags || [],
      bestTimeToVisit: destination.best_time_to_visit || 'Year-round',
      timeNeeded: destination.time_needed || '1-2 hours'
    };

    return new Response(JSON.stringify(transformed), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Photo proxy
  if (pathname === '/api/photo-proxy') {
    const ref = url.searchParams.get('ref');
    const photoUrl = url.searchParams.get('url');
    
    if (ref) {
      const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${env.GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(googlePhotoUrl);
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch photo' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          ...corsHeaders
        },
      });
    }
    
    if (photoUrl) {
      // Security check for URLs
      if (!photoUrl.includes('maps.googleapis.com') && 
          !photoUrl.includes('via.placeholder.com') && 
          !photoUrl.includes('unsplash.com')) {
        return new Response(JSON.stringify({ error: "Only Google Places API, Unsplash, or placeholder URLs allowed" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const response = await fetch(photoUrl);
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch photo' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          ...corsHeaders
        },
      });
    }
  }

  // Weather endpoint
  if (pathname === '/api/weather/slc-airport') {
    return new Response(JSON.stringify({
      temperature: 72,
      condition: "Partly Cloudy",
      location: "Salt Lake City",
      updated: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function getIndexHtml(): Promise<string> {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SLC Trips - Ultimate Utah Adventure Guide</title>
    <meta name="description" content="Plan epic Utah adventures from Salt Lake City International Airport. 1,057+ destinations with drive times, authentic photos, and insider tips.">
</head>
<body>
    <div id="root">
        <h1>SLC Trips API</h1>
        <p>API endpoints available at /api/</p>
        <ul>
            <li><a href="/api/health">/api/health</a> - Health check</li>
            <li><a href="/api/destinations">/api/destinations</a> - All destinations</li>
            <li><a href="/api/weather/slc-airport">/api/weather/slc-airport</a> - Weather</li>
        </ul>
    </div>
</body>
</html>
  `;
}