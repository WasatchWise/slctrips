/**
 * Full Supabase Daniel Database Sync
 * Direct sync from authentic Supabase Daniel database to PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';
import { db } from './db';
import { destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export interface SupabaseDestination {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  description_short?: string;
  description_long?: string;
  latitude?: number;
  longitude?: number;
  address_full?: string;
  county?: string;
  region?: string;
  drive_minutes?: number;
  distance_miles?: number;
  pet_policy_allowed?: boolean;
  is_featured?: boolean;
  is_family_friendly?: boolean;
  is_stroller_friendly?: boolean;
  has_playground?: boolean;
  parking_no?: boolean;
  parking_variable?: boolean;
  parking_limited?: boolean;
  parking_true?: boolean;
  is_parking_free?: boolean;
  has_restrooms?: boolean;
  has_visitor_center?: boolean;
  is_season_spring?: boolean;
  is_season_summer?: boolean;
  is_season_fall?: boolean;
  is_season_winter?: boolean;
  is_season_all?: boolean;
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseFullSync {
  private supabase;
  private synced = 0;
  private skipped = 0;
  private errors: string[] = [];

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Sync all destinations from Supabase Daniel database
   */
  async syncAllDestinations(): Promise<{
    success: boolean;
    synced: number;
    skipped: number;
    errors: string[];
    total: number;
  }> {
    // console.log('🚀 Starting full Supabase Daniel database sync...');
    // console.log('=' .repeat(60));

    this.synced = 0;
    this.skipped = 0;
    this.errors = [];

    try {
      // Get all destinations from Supabase
      const { data: supabaseDestinations, error } = await this.supabase
        .from('destinations')
        .select('*')
        .limit(1000);

      if (error) {
        // console.error('❌ Supabase fetch error:', error);
        this.errors.push(`Supabase fetch error: ${error.message}`);
        return {
          success: false,
          synced: 0,
          skipped: 0,
          errors: this.errors,
          total: 0
        };
      }

      // console.log(`📊 Found ${supabaseDestinations?.length || 0} destinations in Supabase`);

      if (!supabaseDestinations || supabaseDestinations.length === 0) {
        // console.log('⚠️  No destinations found in Supabase');
        return {
          success: true,
          synced: 0,
          skipped: 0,
          errors: [],
          total: 0
        };
      }

      // Process destinations in batches
      const batchSize = 25;
      for (let i = 0; i < supabaseDestinations.length; i += batchSize) {
        const batch = supabaseDestinations.slice(i, i + batchSize);
        // console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(supabaseDestinations.length / batchSize)}`);

        await Promise.all(batch.map(dest => this.syncDestination(dest)));
      }

      // console.log('\n' + '='.repeat(60));
      // console.log('🎯 Full Supabase sync completed!');
      // console.log(`📊 Total synced: ${this.synced}`);
      // console.log(`⚠️  Skipped: ${this.skipped}`);
      // console.log(`❌ Errors: ${this.errors.length}`);

      return {
        success: true,
        synced: this.synced,
        skipped: this.skipped,
        errors: this.errors,
        total: supabaseDestinations.length
      };
    } catch (_error) {
      // console.error('❌ Full sync failed:', error);
      this.errors.push(`Sync failed: ${(error as Error).message}`);
      return {
        success: false,
        synced: this.synced,
        skipped: this.skipped,
        errors: this.errors,
        total: 0
      };
    }
  }

  /**
   * Sync a single destination from Supabase
   */
  private async syncDestination(supabaseDest: SupabaseDestination): Promise<void> {
    try {
      const category = this.mapDriveTimeToCategory(supabaseDest.drive_minutes || 30);

      // Create coordinates object
      const coordinates = supabaseDest.latitude && supabaseDest.longitude ? {
        lat: supabaseDest.latitude,
        lng: supabaseDest.longitude
      } : null;

      // Create photo array from cover photo
      const photos = [];
      if (supabaseDest.cover_photo_url) {
        photos.push({
          url: supabaseDest.cover_photo_url,
          alt_text: supabaseDest.cover_photo_alt_text || supabaseDest.name,
          caption: supabaseDest.name,
          source: 'Supabase Daniel Database',
          photographer: 'SLC Trips',
          is_primary: true,
          verified: true,
          uploaded_at: new Date().toISOString()
        });
      }

      // Upsert destination
      const destinationData = {
        externalId: supabaseDest.id,
        name: supabaseDest.name,
        category,
        description: supabaseDest.description_long || supabaseDest.description_short || supabaseDest.tagline || '',
        address: supabaseDest.address_full || '',
        coordinates: coordinates,
        phone: '',
        website: supabaseDest.destination_url || '',
        driveTime: supabaseDest.drive_minutes || 30,
        distance: supabaseDest.distance_miles?.toString() || null,
        photos: photos.length > 0 ? photos : null,
        activities: [],
        highlights: [],
        tags: [],
        difficulty: 'Easy',
        accessibility: this.generateAccessibilityInfo(supabaseDest),
        bestTimeToVisit: this.generateBestTimeToVisit(supabaseDest),
        rating: null,
        createdAt: new Date(supabaseDest.created_at || new Date()),
        updatedAt: new Date(supabaseDest.updated_at || new Date())
      };

      // Check if destination already exists
      const existingDest = await db
        .select()
        .from(destinations)
        .where(eq(destinations.externalId, supabaseDest.id))
        .limit(1);

      if (existingDest.length > 0) {
        // Update existing destination
        await db
          .update(destinations)
          .set(destinationData)
          .where(eq(destinations.externalId, supabaseDest.id));
      } else {
        // Insert new destination
        await db.insert(destinations).values(destinationData);
      }

      this.synced++;
      // console.log(`✅ Synced: ${supabaseDest.name}`);
    } catch (_error) {
      this.skipped++;
      const errorMsg = `❌ Error syncing ${supabaseDest.name}: ${(error as Error).message}`;
      // console.log(errorMsg);
      this.errors.push(errorMsg);
    }
  }

  /**
   * Map drive time to category
   */
  private mapDriveTimeToCategory(driveMinutes: number): string {
    if (driveMinutes <= 30) return 'Downtown & Nearby';
    if (driveMinutes <= 90) return 'Less than 90 Minutes';
    if (driveMinutes <= 180) return 'Less than 3 Hours';
    if (driveMinutes <= 300) return 'Less than 5 Hours';
    if (driveMinutes <= 480) return 'Less than 8 Hours';
    if (driveMinutes <= 720) return 'Less than 12 Hours';
    return 'A little bit farther';
  }

  /**
   * Create URL slug from name
   */
  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate accessibility info from Supabase data
   */
  private generateAccessibilityInfo(dest: SupabaseDestination): string {
    const info = [];

    if (dest.is_stroller_friendly) info.push('Stroller-friendly');
    if (dest.has_playground) info.push('Playground available');
    if (dest.has_restrooms) info.push('Restrooms available');
    if (dest.has_visitor_center) info.push('Visitor center available');
    if (dest.is_parking_free) info.push('Free parking');
    if (dest.pet_policy_allowed) info.push('Pet-friendly');

    return info.join(', ');
  }

  /**
   * Generate best time to visit from season data
   */
  private generateBestTimeToVisit(dest: SupabaseDestination): string {
    const seasons = [];

    if (dest.is_season_spring) seasons.push('Spring');
    if (dest.is_season_summer) seasons.push('Summer');
    if (dest.is_season_fall) seasons.push('Fall');
    if (dest.is_season_winter) seasons.push('Winter');

    if (dest.is_season_all || seasons.length === 0) return 'Year-round';

    return seasons.join(', ');
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<{
    totalDestinations: number;
    withPhotos: number;
    categoryCounts: { [key: string]: number };
  }> {
    const totalResult = await db
      .select()
      .from(destinations);

    const withPhotos = totalResult.filter(dest => 
      dest.photos && dest.photos !== '[]'
    ).length;

    const categoryCounts: { [key: string]: number } = {};
    totalResult.forEach(dest => {
      categoryCounts[dest.category] = (categoryCounts[dest.category] || 0) + 1;
    });

    return {
      totalDestinations: totalResult.length,
      withPhotos,
      categoryCounts
    };
  }

    /**
   * Map Supabase categories to our standardized categories
   */
  private mapCategory(dest: SupabaseDestination): string {
    // Use the category directly from Supabase if it exists
    if (dest.category) {
      return dest.category;
    }

    // Fallback based on drive time
    const driveMinutes = dest.drive_minutes || 0;
    if (driveMinutes <= 30) return 'Downtown & Nearby';
    if (driveMinutes <= 90) return 'Less than 90 Minutes';
    if (driveMinutes <= 180) return 'Less than 3 Hours';
    if (driveMinutes <= 300) return 'Less than 5 Hours';
    if (driveMinutes <= 480) return 'Less than 8 Hours';
    if (driveMinutes <= 720) return 'Less than 12 Hours';
    return 'A little bit farther';
  }
}

export const supabaseFullSync = new SupabaseFullSync();