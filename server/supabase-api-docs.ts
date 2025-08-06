/**
 * Comprehensive Supabase API Documentation Generator
 * Auto-generates documentation for all Mt. Olympus Master Plan endpoints
 */

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  queryParams?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  requestBody?: {
    type: string;
    description: string;
    example: any;
  };
  responses: Array<{
    status: number;
    description: string;
    example: any;
  }>;
  category: string;
}

export const SUPABASE_API_DOCUMENTATION: APIEndpoint[] = [
  // ============================================
  // CORE DESTINATION ENDPOINTS
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/destinations/advanced',
    description: 'Get destinations with advanced filtering, pagination, and caching',
    category: 'Core Destinations',
    queryParams: [
      { name: 'limit', type: 'number', required: false, description: 'Number of results to return', example: '50' },
      { name: 'offset', type: 'number', required: false, description: 'Number of results to skip', example: '0' },
      { name: 'orderBy', type: 'string', required: false, description: 'Field to order by', example: 'name' },
      { name: 'orderDirection', type: 'string', required: false, description: 'Order direction', example: 'asc' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category', example: 'Natural Wonders' },
      { name: 'search', type: 'string', required: false, description: 'Search query', example: 'arches' },
      { name: 'minDriveTime', type: 'number', required: false, description: 'Minimum drive time in minutes', example: '60' },
      { name: 'maxDriveTime', type: 'number', required: false, description: 'Maximum drive time in minutes', example: '240' },
      { name: 'featured', type: 'boolean', required: false, description: 'Filter featured destinations', example: 'true' },
      { name: 'familyFriendly', type: 'boolean', required: false, description: 'Filter family-friendly destinations', example: 'true' },
      { name: 'region', type: 'string', required: false, description: 'Filter by region', example: 'Southern Utah' }
    ],
    responses: [
      {
        status: 200,
        description: 'Successful response with destinations',
        example: {
          success: true,
          destinations: [],
          pagination: { total: 995, limit: 50, offset: 0, hasMore: true },
          timestamp: '2025-07-04T15:00:00.000Z'
        }
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/supabase/destinations/uuid/:uuid',
    description: 'Get single destination by UUID',
    category: 'Core Destinations',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: 'Destination UUID', example: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc' }
    ],
    responses: [
      {
        status: 200,
        description: 'Destination found',
        example: {
          success: true,
          destination: {},
          timestamp: '2025-07-04T15:00:00.000Z'
        }
      },
      {
        status: 404,
        description: 'Destination not found',
        example: {
          success: false,
          error: 'Destination not found',
          uuid: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc'
        }
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/supabase/destinations/slug/:slug',
    description: 'Get single destination by slug',
    category: 'Core Destinations',
    parameters: [
      { name: 'slug', type: 'string', required: true, description: 'Destination slug', example: 'arches-national-park' }
    ],
    responses: [
      {
        status: 200,
        description: 'Destination found',
        example: {
          success: true,
          destination: {},
          timestamp: '2025-07-04T15:00:00.000Z'
        }
      }
    ]
  },

  // ============================================
  // ANALYTICS ENDPOINTS
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/analytics/categories',
    description: 'Get all categories with counts and detailed statistics',
    category: 'Analytics',
    responses: [
      {
        status: 200,
        description: 'Category analytics',
        example: {
          success: true,
          categories: [
            {
              category: 'Natural Wonders',
              count: 156,
              stats: {
                avgDriveTime: 120,
                featuredCount: 25,
                familyFriendlyCount: 98
              }
            }
          ]
        }
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/supabase/analytics/regions',
    description: 'Get region statistics and geographic distribution',
    category: 'Analytics',
    responses: [
      {
        status: 200,
        description: 'Region analytics',
        example: {
          success: true,
          regions: [
            {
              region: 'Southern Utah',
              county: 'Washington County',
              count: 45,
              categories: ['National Parks', 'Natural Wonders']
            }
          ]
        }
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/supabase/analytics/drive-times',
    description: 'Get destinations grouped by drive time ranges',
    category: 'Analytics',
    responses: [
      {
        status: 200,
        description: 'Drive time analytics',
        example: {
          success: true,
          driveTimeRanges: [
            {
              range: '0-30 minutes',
              min: 0,
              max: 30,
              count: 125,
              destinations: []
            }
          ]
        }
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/supabase/analytics/comprehensive',
    description: 'Get comprehensive platform analytics including quality metrics',
    category: 'Analytics',
    responses: [
      {
        status: 200,
        description: 'Comprehensive analytics',
        example: {
          success: true,
          analytics: {
            totalDestinations: 995,
            categories: [],
            regions: [],
            driveTimeDistribution: [],
            photosCoverage: { withPhotos: 750, needPhotos: 245, percentage: 75.4 },
            accessibilityStats: {}
          }
        }
      }
    ]
  },

  // ============================================
  // SEARCH AND DISCOVERY
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/search',
    description: 'Advanced search with ranking and relevance',
    category: 'Search',
    queryParams: [
      { name: 'q', type: 'string', required: true, description: 'Search query', example: 'national park hiking' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category', example: 'National Parks' },
      { name: 'region', type: 'string', required: false, description: 'Filter by region', example: 'Southern Utah' },
      { name: 'maxDriveTime', type: 'number', required: false, description: 'Maximum drive time', example: '240' },
      { name: 'limit', type: 'number', required: false, description: 'Results limit', example: '20' }
    ],
    responses: [
      {
        status: 200,
        description: 'Search results',
        example: {
          success: true,
          query: 'national park hiking',
          results: [],
          pagination: { total: 15, limit: 20, offset: 0 }
        }
      }
    ]
  },

  // ============================================
  // MT. OLYMPUS MASTER PLAN
  // ============================================
  {
    method: 'GET',
    path: '/api/mt-olympus/analytics',
    description: 'Get comprehensive Mt. Olympus Master Plan analytics',
    category: 'Mt. Olympus',
    responses: [
      {
        status: 200,
        description: 'Mt. Olympus analytics',
        example: {
          success: true,
          analytics: {
            totalDestinations: 995,
            charactersCreated: 29,
            tripKitsAvailable: 12,
            qualityMetrics: {
              averageCompleteness: 0.87,
              averageAccuracy: 0.94,
              destinationsNeedingWork: 125
            },
            expansionProgress: {
              current: 995,
              target: 1000,
              percentage: 99.5
            },
            recommendations: []
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/mt-olympus/initialize',
    description: 'Initialize Mt. Olympus Master Plan database schema',
    category: 'Mt. Olympus',
    responses: [
      {
        status: 200,
        description: 'Schema initialization result',
        example: {
          success: true,
          result: {
            success: true,
            tablesCreated: ['mt_olympus_characters', 'trip_kits', 'destination_enhancements'],
            errors: []
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/mt-olympus/seed-characters',
    description: 'Seed Mt. Olympus characters for all 29 Utah counties',
    category: 'Mt. Olympus',
    responses: [
      {
        status: 200,
        description: 'Character seeding result',
        example: {
          success: true,
          result: {
            success: true,
            charactersCreated: 29,
            errors: []
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/mt-olympus/tripkits',
    description: 'Create new TripKit package',
    category: 'Mt. Olympus',
    requestBody: {
      type: 'object',
      description: 'TripKit configuration',
      example: {
        title: 'Ultimate Utah Road Trip',
        destinationUuids: ['uuid1', 'uuid2', 'uuid3'],
        priceRange: 'premium',
        difficulty: 'Moderate',
        duration: 24,
        season: ['Spring', 'Summer', 'Fall']
      }
    },
    responses: [
      {
        status: 200,
        description: 'TripKit created successfully',
        example: {
          success: true,
          tripKit: {},
          timestamp: '2025-07-04T15:00:00.000Z'
        }
      }
    ]
  },

  // ============================================
  // REAL-TIME SYNC MANAGEMENT
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/sync/status',
    description: 'Get real-time synchronization status',
    category: 'Sync Management',
    responses: [
      {
        status: 200,
        description: 'Sync status',
        example: {
          success: true,
          sync: {
            healthy: true,
            subscription: 'SUBSCRIBED',
            queueSize: 0,
            stats: {
              totalSynced: 1247,
              errors: 0,
              lastSync: '2025-07-04T15:00:00.000Z',
              currentlyListening: true
            }
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/supabase/sync/trigger',
    description: 'Trigger manual synchronization',
    category: 'Sync Management',
    responses: [
      {
        status: 200,
        description: 'Manual sync triggered',
        example: {
          success: true,
          message: 'Manual sync triggered successfully'
        }
      }
    ]
  },

  // ============================================
  // DATA QUALITY AND VALIDATION
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/audit/quality',
    description: 'Run comprehensive data quality audit',
    category: 'Data Quality',
    responses: [
      {
        status: 200,
        description: 'Quality audit results',
        example: {
          success: true,
          audit: {
            totalDestinations: 995,
            validDestinations: 870,
            invalidDestinations: 125,
            commonIssues: [
              { issue: 'Missing cover photo', count: 245 },
              { issue: 'Missing long description', count: 89 }
            ],
            suggestions: [
              'Implement photo enrichment system using Google Places API',
              'Use AI content generation to fill missing descriptions'
            ]
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/supabase/quality/:uuid',
    description: 'Calculate quality metrics for specific destination',
    category: 'Data Quality',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: 'Destination UUID' }
    ],
    responses: [
      {
        status: 200,
        description: 'Quality metrics calculated',
        example: {
          success: true,
          metrics: {
            destination_uuid: 'uuid',
            completeness_score: 0.87,
            accuracy_score: 0.94,
            photo_quality_score: 1.0,
            description_quality_score: 0.85,
            improvement_suggestions: []
          }
        }
      }
    ]
  },

  // ============================================
  // CACHE MANAGEMENT
  // ============================================
  {
    method: 'GET',
    path: '/api/supabase/cache/stats',
    description: 'Get cache statistics',
    category: 'Cache Management',
    responses: [
      {
        status: 200,
        description: 'Cache statistics',
        example: {
          success: true,
          cache: {
            size: 47,
            keys: ['total_count', 'destinations_{"limit":50}', 'categories']
          }
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/supabase/cache/clear',
    description: 'Clear all cache entries',
    category: 'Cache Management',
    responses: [
      {
        status: 200,
        description: 'Cache cleared',
        example: {
          success: true,
          message: 'Cache cleared successfully'
        }
      }
    ]
  }
];

/**
 * Generate HTML documentation for all Supabase APIs
 */
export function generateAPIDocumentation(): string {
  const categories = [...new Set(SUPABASE_API_DOCUMENTATION.map(endpoint => endpoint.category))];

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SLC Trips - Supabase API Documentation</title>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .header { background: linear-gradient(135deg, #0d2a40, #0087c8); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .header h1 { margin: 0; font-size: 2.5rem; }
    .header p { margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 1.1rem; }
    .category { background: white; margin-bottom: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
    .category-header { background: #f4b441; color: #0d2a40; padding: 1rem 1.5rem; font-size: 1.3rem; font-weight: 600; }
    .endpoint { border-bottom: 1px solid #e2e8f0; padding: 1.5rem; }
    .endpoint:last-child { border-bottom: none; }
    .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; margin-right: 1rem; }
    .method.GET { background: #10b981; color: white; }
    .method.POST { background: #3b82f6; color: white; }
    .method.PUT { background: #f59e0b; color: white; }
    .method.DELETE { background: #ef4444; color: white; }
    .path { font-family: monospace; font-size: 1.1rem; color: #1f2937; }
    .description { margin: 0.5rem 0; color: #6b7280; }
    .params { margin-top: 1rem; }
    .param { margin: 0.5rem 0; padding: 0.5rem; background: #f8fafc; border-radius: 6px; border-left: 4px solid #0087c8; }
    .param-name { font-weight: 600; color: #0d2a40; }
    .param-type { color: #10b981; font-size: 0.9rem; }
    .param-required { color: #ef4444; font-size: 0.8rem; }
    .param-description { color: #6b7280; margin-top: 0.25rem; }
    .example { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; overflow-x: auto; margin-top: 0.5rem; }
    .toc { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .toc h2 { margin-top: 0; color: #0d2a40; }
    .toc ul { list-style: none; padding: 0; }
    .toc li { margin: 0.5rem 0; }
    .toc a { color: #0087c8; text-decoration: none; font-weight: 500; }
    .toc a:hover { text-decoration: underline; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stat-number { font-size: 2rem; font-weight: 700; color: #0d2a40; }
    .stat-label { color: #6b7280; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏔️ SLC Trips - Supabase API</h1>
    <p>Mt. Olympus Master Plan • Advanced Data Architecture • 995 Authentic Destinations</p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-number">${SUPABASE_API_DOCUMENTATION.length}</div>
      <div class="stat-label">API Endpoints</div>
    </div>
    <div class="stat">
      <div class="stat-number">${categories.length}</div>
      <div class="stat-label">Categories</div>
    </div>
    <div class="stat">
      <div class="stat-number">995</div>
      <div class="stat-label">Destinations</div>
    </div>
    <div class="stat">
      <div class="stat-number">29</div>
      <div class="stat-label">Mt. Olympians</div>
    </div>
  </div>

  <div class="toc">
    <h2>📋 Table of Contents</h2>
    <ul>
      ${categories.map(category => `
        <li><a href="#${category.toLowerCase().replace(/\s+/g, '-')}">${category}</a></li>
      `).join('')}
    </ul>
  </div>
`;

  categories.forEach(category => {
    const endpoints = SUPABASE_API_DOCUMENTATION.filter(endpoint => endpoint.category === category);
    
    html += `
  <div class="category" id="${category.toLowerCase().replace(/\s+/g, '-')}">
    <div class="category-header">${category}</div>
`;

    endpoints.forEach(endpoint => {
      html += `
    <div class="endpoint">
      <div>
        <span class="method ${endpoint.method}">${endpoint.method}</span>
        <span class="path">${endpoint.path}</span>
      </div>
      <div class="description">${endpoint.description}</div>
`;

      if (endpoint.parameters && endpoint.parameters.length > 0) {
        html += `
      <div class="params">
        <strong>Path Parameters:</strong>
        ${endpoint.parameters.map(param => `
          <div class="param">
            <span class="param-name">${param.name}</span>
            <span class="param-type">(${param.type})</span>
            ${param.required ? '<span class="param-required">required</span>' : ''}
            <div class="param-description">${param.description}</div>
            ${param.example ? `<div class="example">Example: ${param.example}</div>` : ''}
          </div>
        `).join('')}
      </div>
`;
      }

      if (endpoint.queryParams && endpoint.queryParams.length > 0) {
        html += `
      <div class="params">
        <strong>Query Parameters:</strong>
        ${endpoint.queryParams.map(param => `
          <div class="param">
            <span class="param-name">${param.name}</span>
            <span class="param-type">(${param.type})</span>
            ${param.required ? '<span class="param-required">required</span>' : ''}
            <div class="param-description">${param.description}</div>
            ${param.example ? `<div class="example">Example: ${param.example}</div>` : ''}
          </div>
        `).join('')}
      </div>
`;
      }

      if (endpoint.requestBody) {
        html += `
      <div class="params">
        <strong>Request Body:</strong>
        <div class="param">
          <span class="param-type">(${endpoint.requestBody.type})</span>
          <div class="param-description">${endpoint.requestBody.description}</div>
          <div class="example">${JSON.stringify(endpoint.requestBody.example, null, 2)}</div>
        </div>
      </div>
`;
      }

      html += `
      <div class="params">
        <strong>Responses:</strong>
        ${endpoint.responses.map(response => `
          <div class="param">
            <span class="param-name">Status ${response.status}</span>
            <div class="param-description">${response.description}</div>
            <div class="example">${JSON.stringify(response.example, null, 2)}</div>
          </div>
        `).join('')}
      </div>
    </div>
`;
    });

    html += `  </div>`;
  });

  html += `
</body>
</html>
`;

  return html;
}