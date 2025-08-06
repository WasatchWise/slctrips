/**
 * SLCTrips SaaS API Worker
 * Handles all API endpoints for the SaaS platform
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://slctrips.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route API requests
      if (path.startsWith('/api/destinations')) {
        return await handleDestinations(request, env, corsHeaders);
      }
      
      if (path.startsWith('/api/tripkits')) {
        return await handleTripKits(request, env, corsHeaders);
      }
      
      if (path.startsWith('/api/golf')) {
        return await handleGolfCourses(request, env, corsHeaders);
      }
      
      if (path.startsWith('/api/notion')) {
        return await handleNotionIntegration(request, env, corsHeaders);
      }
      
      if (path.startsWith('/api/analytics')) {
        return await handleAnalytics(request, env, corsHeaders);
      }

      // Health check
      if (path === '/api/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          environment: env.ENVIRONMENT,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('API Worker Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle destinations API endpoints
 */
async function handleDestinations(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'GET') {
    // Get destinations with caching
    const cacheKey = `destinations:${url.search}`;
    const cached = await env.CACHE.get(cacheKey);
    
    if (cached) {
      return new Response(cached, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch from Supabase
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/destinations`, {
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
      }
    });

    const data = await response.json();
    
    // Cache for 5 minutes
    await env.CACHE.put(cacheKey, JSON.stringify(data), { expirationTtl: 300 });
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders
  });
}

/**
 * Handle TripKit generation
 */
async function handleTripKits(request, env, corsHeaders) {
  if (request.method === 'POST') {
    const body = await request.json();
    const { destinationId, userId, preferences } = body;

    // Generate TripKit using OpenAI
    const tripkitData = await generateTripKit(destinationId, preferences, env);
    
    // Store in Notion
    const notionResponse = await createNotionPage(tripkitData, env);
    
    return new Response(JSON.stringify({
      success: true,
      tripkitId: notionResponse.id,
      url: `https://notion.so/${notionResponse.id.replace(/-/g, '')}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders
  });
}

/**
 * Handle golf courses API
 */
async function handleGolfCourses(request, env, corsHeaders) {
  const url = new URL(request.url);
  
  if (request.method === 'GET') {
    // Get golf courses from Supabase
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/destinations?category=eq.Golf`, {
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
      }
    });

    const golfCourses = await response.json();
    
    return new Response(JSON.stringify(golfCourses), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders
  });
}

/**
 * Handle Notion integration
 */
async function handleNotionIntegration(request, env, corsHeaders) {
  if (request.method === 'POST') {
    const body = await request.json();
    
    // Create Notion page
    const notionResponse = await createNotionPage(body, env);
    
    return new Response(JSON.stringify({
      success: true,
      pageId: notionResponse.id,
      url: `https://notion.so/${notionResponse.id.replace(/-/g, '')}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders
  });
}

/**
 * Handle analytics
 */
async function handleAnalytics(request, env, corsHeaders) {
  if (request.method === 'POST') {
    const body = await request.json();
    
    // Store analytics in D1
    await env.DB.prepare(`
      INSERT INTO analytics (event_type, user_id, data, timestamp)
      VALUES (?, ?, ?, ?)
    `).bind(
      body.eventType,
      body.userId,
      JSON.stringify(body.data),
      new Date().toISOString()
    ).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { 
    status: 405,
    headers: corsHeaders
  });
}

/**
 * Generate TripKit using OpenAI
 */
async function generateTripKit(destinationId, preferences, env) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert creating comprehensive TripKits for Utah destinations.'
        },
        {
          role: 'user',
          content: `Create a TripKit for destination ${destinationId} with preferences: ${JSON.stringify(preferences)}`
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Create Notion page
 */
async function createNotionPage(content, env) {
  const response = await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: { database_id: env.NOTION_DATABASE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'SLCTrips TripKit'
              }
            }
          ]
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: content
                }
              }
            ]
          }
        }
      ]
    })
  });

  return await response.json();
} 