import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { supabase, supabaseAdmin } from './supabase-client';
import { fileURLToPath } from 'url';

const viteLogger = createLogger();

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "slctrips.com",
      "www.slctrips.com",
      "api.slctrips.com",
      "admin.slctrips.com"
    ],
  };

  const vite = await createViteServer({
    root: path.resolve(__dirname, "..", "client"),
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit on error, just log it
      },
    },
    server: serverOptions,
    appType: "custom",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "..", "client", "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
        "@assets": path.resolve(__dirname, "..", "attached_assets"),
      },
    },
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (_e) {
      vite.ssrFixStacktrace(_e as Error);
      next(_e);
    }
  });
}

export function serveStatic(app: Express) {
  // No-op for now. Implement static serving for production if needed.
}

// SupabaseStorage class implementation
export class SupabaseStorage {
  private cache = new Map<string, any>();
  private cacheStats = {
    hits: 0,
    misses: 0,
    sets: 0
  };

  private getCacheKey(key: string): string {
    return `supabase:${key}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.cacheStats.hits++;
      return cached as T;
    }
    this.cacheStats.misses++;
    return null;
  }

  private setCache<T>(key: string, value: T, ttl = 300000): void { // 5 minutes default
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, {
      value,
      expires: Date.now() + ttl
    });
    this.cacheStats.sets++;
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheStats = { hits: 0, misses: 0, sets: 0 };
  }

  getCacheStats() {
    return {
      ...this.cacheStats,
      size: this.cache.size
    };
  }

  async getDestinations(options: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    filters?: Record<string, any>;
    search?: string;
  } = {}): Promise<{ data: any[]; count: number; hasMore: boolean }> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return { data: [], count: 0, hasMore: false };
    }

    const cacheKey = `destinations:${JSON.stringify(options)}`;
    const cached = this.getFromCache<{ data: any[]; count: number; hasMore: boolean }>(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from('destinations')
        .select('*', { count: 'exact' });

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply search
      if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' });
      }

      // Apply pagination
      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error, count } = await query;

      if (error) {
        // console.error('Error fetching destinations:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const result = {
        data: data || [],
        count: count || 0,
        hasMore: options.limit ? (data?.length || 0) === options.limit : false
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (_error) {
      // console.error('Error in getDestinations:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  async getDestinationsByDriveTime(minMinutes: number, maxMinutes: number, options: any = {}): Promise<{ data: any[]; count: number; hasMore: boolean }> {
    // This is a simplified implementation - you may need to adjust based on your actual data structure
    const allDestinations = await this.getDestinations({ ...options, limit: 1000 });
    
    // Filter by drive time (assuming you have a drive_time field)
    const filtered = allDestinations.data.filter((dest: any) => {
      const driveTime = dest.drive_time || dest.driveTime || 0;
      return driveTime >= minMinutes && driveTime <= maxMinutes;
    });

    return {
      data: filtered.slice(0, options.limit || 50),
      count: filtered.length,
      hasMore: filtered.length > (options.limit || 50)
    };
  }

  async getDestinationByUuid(uuid: string): Promise<any> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return null;
    }

    const cacheKey = `destination:${uuid}`;
    const cached = this.getFromCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', uuid)
        .single();

      if (error) {
        // console.error('Error fetching destination by UUID:', error);
        return null;
      }

      this.setCache(cacheKey, data);
      return data;
    } catch (_error) {
      // console.error('Error in getDestinationByUuid:', error);
      return null;
    }
  }

  async getDestinationBySlug(slug: string): Promise<any> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return null;
    }

    const cacheKey = `destination:slug:${slug}`;
    const cached = this.getFromCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        // console.error('Error fetching destination by slug:', error);
        return null;
      }

      this.setCache(cacheKey, data);
      return data;
    } catch (_error) {
      // console.error('Error in getDestinationBySlug:', error);
      return null;
    }
  }

  async getCategories(): Promise<string[]> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return [];
    }

    const cacheKey = 'categories';
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        // console.error('Error fetching categories:', error);
        return [];
      }

      const categories = [...new Set(data?.map((item: any) => item.category).filter(Boolean))];
      this.setCache(cacheKey, categories);
      return categories;
    } catch (_error) {
      // console.error('Error in getCategories:', error);
      return [];
    }
  }

  async getCategoryStats(category: string): Promise<any> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return { count: 0 };
    }

    try {
      const { count, error } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);

      if (error) {
        // console.error('Error fetching category stats:', error);
        return { count: 0 };
      }

      return { count };
    } catch (_error) {
      // console.error('Error in getCategoryStats:', error);
      return { count: 0 };
    }
  }

  async getDestinationsByCategory(category: string, options: any = {}): Promise<{ data: any[]; count: number; hasMore: boolean }> {
    return this.getDestinations({
      ...options,
      filters: { category }
    });
  }

  async getRegionStats(): Promise<any[]> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return [];
    }

    const cacheKey = 'region-stats';
    const cached = this.getFromCache<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('region, category')
        .not('region', 'is', null);

      if (error) {
        // console.error('Error fetching region stats:', error);
        return [];
      }

      const stats = data?.reduce((acc: any, item: any) => {
        if (!acc[item.region]) {
          acc[item.region] = { region: item.region, count: 0, categories: {} };
        }
        acc[item.region].count++;
        acc[item.region].categories[item.category] = (acc[item.region].categories[item.category] || 0) + 1;
        return acc;
      }, {});

      const result = Object.values(stats || {});
      this.setCache(cacheKey, result);
      return result;
    } catch (_error) {
      // console.error('Error in getRegionStats:', error);
      return [];
    }
  }

  async getFeaturedDestinations(limit: number = 10): Promise<any[]> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_featured', true)
        .limit(limit);

      if (error) {
        // console.error('Error fetching featured destinations:', error);
        return [];
      }

      return data || [];
    } catch (_error) {
      // console.error('Error in getFeaturedDestinations:', error);
      return [];
    }
  }

  async getDestinationsWithPhotos(limit: number = 10): Promise<any[]> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .not('photo_gallery', 'is', null)
        .not('photo_gallery', 'eq', '[]')
        .limit(limit);

      if (error) {
        // console.error('Error fetching destinations with photos:', error);
        return [];
      }

      return data || [];
    } catch (_error) {
      // console.error('Error in getDestinationsWithPhotos:', error);
      return [];
    }
  }

  async getDestinationsNeedingPhotos(limit: number = 10): Promise<any[]> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .or('photo_gallery.is.null,photo_gallery.eq.[]')
        .limit(limit);

      if (error) {
        // console.error('Error fetching destinations needing photos:', error);
        return [];
      }

      return data || [];
    } catch (_error) {
      // console.error('Error in getDestinationsNeedingPhotos:', error);
      return [];
    }
  }

  async getPlatformAnalytics(): Promise<any> {
    try {
      const [totalCount, categories, regionStats] = await Promise.all([
        this.getTotalCount(),
        this.getCategories(),
        this.getRegionStats()
      ]);

      return {
        totalDestinations: totalCount,
        categories: categories.length,
        regions: regionStats.length,
        timestamp: new Date().toISOString()
      };
    } catch (_error) {
      // console.error('Error in getPlatformAnalytics:', error);
      return {
        totalDestinations: 0,
        categories: 0,
        regions: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getTotalCount(): Promise<number> {
    if (!supabase) {
      // console.error('Supabase client not initialized');
      return 0;
    }

    try {
      const { count, error } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // console.error('Error fetching total count:', error);
        return 0;
      }

      return count || 0;
    } catch (_error) {
      // console.error('Error in getTotalCount:', error);
      return 0;
    }
  }

  async deleteDestination(uuid: string): Promise<{ error?: string }> {
    if (!supabaseAdmin) {
      // console.error('Supabase admin client not initialized');
      return { error: 'Supabase admin client not initialized' };
    }

    try {
      const { error } = await supabaseAdmin
        .from('destinations')
        .delete()
        .eq('id', uuid);

      if (error) {
        // console.error('Error deleting destination:', error);
        return { error: error.message };
      }

      // Clear cache
      this.cache.delete(this.getCacheKey(`destination:${uuid}`));
      return {};
    } catch (_error) {
      // console.error('Error in deleteDestination:', error);
      return { error: 'Failed to delete destination' };
    }
  }

  async bulkUpdateDestinations(updates: any[]): Promise<void> {
    if (!supabaseAdmin) {
      // console.error('Supabase admin client not initialized');
      throw new Error('Supabase admin client not initialized');
    }

    try {
      const { error } = await supabaseAdmin
        .from('destinations')
        .upsert(updates);

      if (error) {
        // console.error('Error bulk updating destinations:', error);
        throw error;
      }

      // Clear cache
      this.clearCache();
    } catch (_error) {
      // console.error('Error in bulkUpdateDestinations:', error);
      throw error;
    }
  }
}

// Export the singleton instance
export const supabaseStorage = new SupabaseStorage();