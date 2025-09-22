/**
 * Comprehensive Supabase API Routes
 * Advanced endpoints for Mt. Olympus Master Plan data architecture
 */

import { Express } from 'express';
import { supabaseStorage } from './supabase-storage';

const DEFAULT_LIST_LIMIT = 100;
const MAX_LIST_LIMIT = 1000;
const FESTIVAL_FLAG_FIELDS = [
  "isFestival",
  "is_festival",
  "isEvent",
  "is_event",
  "festival",
  "event"
];
const FESTIVAL_CATEGORY_FIELDS = [
  "category",
  "subcategory",
  "type",
  "destination_type",
  "destinationType",
  "experience_type",
  "experienceType",
  "primary_category",
  "primary_subcategory",
  "tier"
];
const FESTIVAL_KEYWORD_PATTERNS = [
  /\bfestival(s)?\b/i,
  /\bfest\b/i,
  /\brodeo\b/i,
  /\bpowwow\b/i,
  /\bcarnival\b/i,
  /\bparade\b/i,
  /\bfair(s)?\b/i,
  /\bcelebration(s)?\b/i,
  /\bexpo\b/i,
  /\bderby\b/i,
  /\bjubilee\b/i
];

function parseNumberParam(value: unknown, defaultValue: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return defaultValue;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return defaultValue;
}

function hasFestivalKeyword(text: string): boolean {
  return FESTIVAL_KEYWORD_PATTERNS.some((pattern) => pattern.test(text));
}

function isFestivalDestination(destination: Record<string, any>): boolean {
  if (!destination || typeof destination !== "object") {
    return false;
  }

  if (FESTIVAL_FLAG_FIELDS.some((field) => Boolean(destination[field]))) {
    return true;
  }

  for (const field of FESTIVAL_CATEGORY_FIELDS) {
    const value = destination[field];
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (normalized.includes("festival") || normalized.includes("festivals") || normalized.includes("event")) {
        return true;
      }
      if (hasFestivalKeyword(value)) {
        return true;
      }
    }
  }

  const textSegments: string[] = [];
  if (typeof destination.name === "string") textSegments.push(destination.name);
  if (typeof destination.tagline === "string") textSegments.push(destination.tagline);
  if (typeof destination.description === "string") textSegments.push(destination.description);
  if (typeof destination.description_long === "string") textSegments.push(destination.description_long);
  if (Array.isArray(destination.tags)) {
    textSegments.push(destination.tags.filter((tag: unknown) => typeof tag === "string").join(" "));
  }
  if (Array.isArray(destination.vibe_descriptors)) {
    textSegments.push(destination.vibe_descriptors.filter((tag: unknown) => typeof tag === "string").join(" "));
  }

  if (textSegments.length === 0) {
    return false;
  }

  return hasFestivalKeyword(textSegments.join(" "));
}

export function registerSupabaseRoutes(app: Express): void {

  // ============================================
  // CORE DESTINATION ENDPOINTS
  // ============================================

  app.get("/api/supabase/destinations", async (req, res) => {
    try {
      const limit = Math.min(parseNumberParam(req.query.limit, DEFAULT_LIST_LIMIT), MAX_LIST_LIMIT);
      const offset = parseNumberParam(req.query.offset, 0);

      const queryOptions: Record<string, any> = {
        orderBy: "name",
        orderDirection: "asc"
      };

      if (limit > 0) {
        queryOptions.limit = limit;
      }
      if (offset > 0) {
        queryOptions.offset = offset;
      }

      const result = await supabaseStorage.getDestinations(queryOptions);
      res.json(result.data || []);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to fetch destinations",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/supabase/destinations/regular", async (req, res) => {
    try {
      const limit = Math.min(parseNumberParam(req.query.limit, DEFAULT_LIST_LIMIT), MAX_LIST_LIMIT);
      const offset = parseNumberParam(req.query.offset, 0);
      const fetchLimit = Math.min(Math.max(limit + offset, DEFAULT_LIST_LIMIT * 2), MAX_LIST_LIMIT);

      const result = await supabaseStorage.getDestinations({
        limit: fetchLimit,
        orderBy: "name",
        orderDirection: "asc"
      });

      const destinations = (result.data || []).filter((destination: Record<string, any>) => !isFestivalDestination(destination));
      const start = Math.min(offset, destinations.length);
      const end = limit > 0 ? Math.min(start + limit, destinations.length) : destinations.length;

      res.json(destinations.slice(start, end));
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to fetch regular destinations",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/supabase/destinations/festivals", async (req, res) => {
    try {
      const limit = Math.min(parseNumberParam(req.query.limit, DEFAULT_LIST_LIMIT), MAX_LIST_LIMIT);
      const offset = parseNumberParam(req.query.offset, 0);
      const fetchLimit = Math.min(Math.max(limit + offset, DEFAULT_LIST_LIMIT * 2), MAX_LIST_LIMIT);

      const result = await supabaseStorage.getDestinations({
        limit: fetchLimit,
        orderBy: "name",
        orderDirection: "asc"
      });

      const festivals = (result.data || []).filter((destination: Record<string, any>) => isFestivalDestination(destination));
      const start = Math.min(offset, festivals.length);
      const end = limit > 0 ? Math.min(start + limit, festivals.length) : festivals.length;

      res.json(festivals.slice(start, end));
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to fetch festivals",
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get destinations with advanced filtering, pagination, and caching
   * Query params: limit, offset, orderBy, orderDirection, category, search,
   *               minDriveTime, maxDriveTime, featured, familyFriendly, etc.
   */
  app.get("/api/supabase/destinations/advanced", async (req, res) => {
    try {
      const {
        limit = "50",
        offset = "0",
        orderBy = "name",
        orderDirection = "asc",
        category,
        search,
        minDriveTime,
        maxDriveTime,
        featured,
        familyFriendly,
        strollerFriendly,
        hasRestrooms,
        hasPlayground,
        petFriendly,
        region,
        county
      } = req.query;

      const filters: Record<string, any> = {};
      
      if (category) filters.category = category;
      if (featured === 'true') filters.is_featured = true;
      if (familyFriendly === 'true') filters.is_family_friendly = true;
      if (strollerFriendly === 'true') filters.is_stroller_friendly = true;
      if (hasRestrooms === 'true') filters.has_restrooms = true;
      if (hasPlayground === 'true') filters.has_playground = true;
      if (petFriendly === 'true') filters.pet_policy_allowed = true;
      if (region) filters.region = region;
      if (county) filters.county = county;

      let result;

      // Handle drive time filtering
      if (minDriveTime || maxDriveTime) {
        const min = parseInt(minDriveTime as string) || 0;
        const max = parseInt(maxDriveTime as string) || 999999;
        
        result = await supabaseStorage.getDestinationsByDriveTime(min, max, {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          orderBy: orderBy as string,
          orderDirection: orderDirection as 'asc' | 'desc',
          filters,
          search: search as string
        });
      } else {
        result = await supabaseStorage.getDestinations({
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          orderBy: orderBy as string,
          orderDirection: orderDirection as 'asc' | 'desc',
          filters,
          search: search as string
        });
      }

      res.json({
        success: true,
        destinations: result.data,
        pagination: {
          total: result.count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: result.hasMore || false
        },
        query: req.query,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get single destination by UUID
   */
  app.get("/api/supabase/destinations/uuid/:uuid", async (req, res) => {
    try {
      const { uuid } = req.params;
      const destination = await supabaseStorage.getDestinationByUuid(uuid);

      if (!destination) {
        return res.status(404).json({
          success: false,
          error: 'Destination not found',
          uuid,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        destination,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get single destination by slug
   */
  app.get("/api/supabase/destinations/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const destination = await supabaseStorage.getDestinationBySlug(slug);

      if (!destination) {
        return res.status(404).json({
          success: false,
          error: 'Destination not found',
          slug,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        destination,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // CATEGORY ANALYTICS ENDPOINTS
  // ============================================

  /**
   * Get all categories with counts and statistics
   */
  app.get("/api/supabase/analytics/categories", async (req, res) => {
    try {
      const categories = await supabaseStorage.getCategories();
      
      // Get detailed stats for each category
      const categoryStats = await Promise.all(
        categories.map(async (cat) => {
          const stats = await supabaseStorage.getCategoryStats(cat.category);
          return {
            ...cat,
            stats
          };
        })
      );

      res.json({
        success: true,
        categories: categoryStats,
        total: categories.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get destinations and stats for specific category
   */
  app.get("/api/supabase/categories/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = "50", offset = "0" } = req.query;

      const result = await supabaseStorage.getDestinationsByCategory(category, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      res.json({
        success: true,
        category,
        destinations: result.destinations,
        stats: result.stats,
        count: result.count,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // GEOGRAPHIC ANALYTICS ENDPOINTS
  // ============================================

  /**
   * Get region statistics and distribution
   */
  app.get("/api/supabase/analytics/regions", async (req, res) => {
    try {
      const regions = await supabaseStorage.getRegionStats();

      res.json({
        success: true,
        regions,
        total: regions.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get destinations by drive time ranges
   */
  app.get("/api/supabase/analytics/drive-times", async (req, res) => {
    try {
      const ranges = [
        { name: '0-30 minutes', min: 0, max: 30 },
        { name: '31-60 minutes', min: 31, max: 60 },
        { name: '1-2 hours', min: 61, max: 120 },
        { name: '2-4 hours', min: 121, max: 240 },
        { name: '4+ hours', min: 241, max: 999999 }
      ];

      const driveTimeAnalytics = await Promise.all(
        ranges.map(async (range) => {
          const result = await supabaseStorage.getDestinationsByDriveTime(range.min, range.max, { limit: 1000 });
          return {
            range: range.name,
            min: range.min,
            max: range.max === 999999 ? null : range.max,
            count: result.count,
            destinations: result.data.slice(0, 10) // First 10 as examples
          };
        })
      );

      res.json({
        success: true,
        driveTimeRanges: driveTimeAnalytics,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // CONTENT MANAGEMENT ENDPOINTS
  // ============================================

  /**
   * Get featured destinations
   */
  app.get("/api/supabase/featured", async (req, res) => {
    try {
      const { limit = "20" } = req.query;
      const featured = await supabaseStorage.getFeaturedDestinations(parseInt(limit as string));

      res.json({
        success: true,
        featured,
        count: featured.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get destinations with photos
   */
  app.get("/api/supabase/content/with-photos", async (req, res) => {
    try {
      const { limit = "100" } = req.query;
      const withPhotos = await supabaseStorage.getDestinationsWithPhotos(parseInt(limit as string));

      res.json({
        success: true,
        destinations: withPhotos,
        count: withPhotos.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Get destinations needing photos
   */
  app.get("/api/supabase/content/need-photos", async (req, res) => {
    try {
      const { limit = "100" } = req.query;
      const needPhotos = await supabaseStorage.getDestinationsNeedingPhotos(parseInt(limit as string));

      res.json({
        success: true,
        destinations: needPhotos,
        count: needPhotos.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // COMPREHENSIVE ANALYTICS ENDPOINT
  // ============================================

  /**
   * Get comprehensive platform analytics
   */
  app.get("/api/supabase/analytics/comprehensive", async (req, res) => {
    try {
      const analytics = await supabaseStorage.getPlatformAnalytics();

      res.json({
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // SEARCH AND DISCOVERY ENDPOINTS
  // ============================================

  /**
   * Advanced search with ranking and relevance
   */
  app.get("/api/supabase/search", async (req, res) => {
    try {
      const { 
        q: query,
        category,
        region,
        maxDriveTime,
        featured,
        familyFriendly,
        limit = "20",
        offset = "0"
      } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query (q) is required',
          timestamp: new Date().toISOString()
        });
      }

      const filters: Record<string, any> = {};
      if (category) filters.category = category;
      if (region) filters.region = region;
      if (featured === 'true') filters.is_featured = true;
      if (familyFriendly === 'true') filters.is_family_friendly = true;

      const searchOptions: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        search: query as string,
        filters,
        orderBy: 'name',
        orderDirection: 'asc'
      };

      // Add drive time filter if specified
      let result;
      if (maxDriveTime) {
        result = await supabaseStorage.getDestinationsByDriveTime(0, parseInt(maxDriveTime as string), searchOptions);
      } else {
        result = await supabaseStorage.getDestinations(searchOptions);
      }

      res.json({
        success: true,
        query: query,
        results: result.data,
        pagination: {
          total: result.count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: result.hasMore || false
        },
        filters: filters,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // CACHE MANAGEMENT ENDPOINTS
  // ============================================

  /**
   * Get cache statistics
   */
  app.get("/api/supabase/cache/stats", async (req, res) => {
    try {
      const cacheStats = supabaseStorage.getCacheStats();

      res.json({
        success: true,
        cache: cacheStats,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Clear cache
   */
  app.post("/api/supabase/cache/clear", async (req, res) => {
    try {
      supabaseStorage.clearCache();

      res.json({
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // DELETE ENDPOINTS
  // ============================================

  /**
   * Delete a destination by UUID
   */
  app.delete("/api/supabase/destinations/:uuid", async (req, res) => {
    try {
      const { uuid } = req.params;
      
      // First, get the destination details
      const destination = await supabaseStorage.getDestinationByUuid(uuid);
      
      if (!destination) {
        return res.status(404).json({
          success: false,
          error: 'Destination not found',
          timestamp: new Date().toISOString()
        });
      }

      // Delete from Supabase
      const { error } = await supabaseStorage.deleteDestination(uuid);
      
      if (error) {
        throw error;
      }

      res.json({
        success: true,
        message: `Successfully deleted destination: ${destination.name}`,
        deletedDestination: {
          uuid: destination.uuid,
          name: destination.name
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // BULK OPERATIONS ENDPOINTS
  // ============================================

  /**
   * Bulk update destinations (admin only)
   */
  app.post("/api/supabase/bulk/update", async (req, res) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          error: 'Updates must be an array of {uuid, updates} objects',
          timestamp: new Date().toISOString()
        });
      }

      await supabaseStorage.bulkUpdateDestinations(updates);

      res.json({
        success: true,
        message: `Successfully updated ${updates.length} destinations`,
        count: updates.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================
  // HEALTH CHECK ENDPOINT
  // ============================================

  /**
   * Comprehensive health check for Supabase integration
   */
  app.get("/api/supabase/health", async (req, res) => {
    try {
      const [
        totalCount,
        categories,
        cacheStats,
        sampleDestination
      ] = await Promise.all([
        supabaseStorage.getTotalCount(),
        supabaseStorage.getCategories(),
        supabaseStorage.getCacheStats(),
        supabaseStorage.getDestinations({ limit: 1 })
      ]);

      res.json({
        success: true,
        health: {
          connected: true,
          totalDestinations: totalCount,
          categoriesCount: categories.length,
          cacheSize: cacheStats.size,
          sampleDestination: sampleDestination.data[0] || null
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        health: {
          connected: false,
          error: error.message
        },
        timestamp: new Date().toISOString()
      });
    }
  });
}