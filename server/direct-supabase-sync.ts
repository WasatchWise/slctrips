/**
 * Direct Supabase Photo Sync System
 * Syncs authentic photos from Daniel's Supabase database directly to local database
 */

import { SUPABASE_URL, DANIEL_SUPABASE_ANON_KEY, DATABASE_URL } from './config';

interface SupabaseDestination {
  destination_id: number;
  name: string;
  cover_photo_url: string;
  cover_photos_alt_text: string;
}

export class DirectSupabaseSync {
  private supabase: any;
  private localDb: any;
  private processed: number = 0;
  private successful: number = 0;
  private failed: number = 0;
  private errors: string[] = [];

  async initializeConnections() {
    // Initialize Supabase connection to Daniel's database
      const { createClient } = await import('@supabase/supabase-js');
      this.supabase = createClient(
        SUPABASE_URL,
        DANIEL_SUPABASE_ANON_KEY
      );

    // Initialize local database connection
      const { neon } = await import('@neondatabase/serverless');
      this.localDb = neon(DATABASE_URL);
  }

  async syncPhotosFromSupabase(limit?: number): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> {
    await this.initializeConnections();
    
    // console.log('\n🚀 Starting Direct Supabase Photo Sync...');
    // console.log('============================================================');

    // Get destinations with photos from Supabase using correct table name
    let query = this.supabase
      .from('destination_content')
      .select('destination_id, name, cover_photo_url, cover_photos_alt_text')
      .not('cover_photo_url', 'is', null)
      .not('cover_photo_url', 'eq', '')
      .order('name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data: supabaseDestinations, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch Supabase destinations: ${error.message}`);
    }

    if (!supabaseDestinations || supabaseDestinations.length === 0) {
      throw new Error('No destinations with photos found in Supabase');
    }

    // console.log(`📋 Found ${supabaseDestinations.length} destinations with photos in Supabase`);

    // Process each destination
    for (const supabaseDest of supabaseDestinations) {
      await this.syncDestinationPhoto(supabaseDest);
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
    }

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 Direct Supabase Photo Sync Complete!');
    // console.log(`📊 Total processed: ${this.processed}`);
    // console.log(`✅ Successful: ${this.successful}`);
    // console.log(`❌ Failed: ${this.failed}`);
    // console.log(`📈 Success rate: ${((this.successful / this.processed) * 100).toFixed(1)}%`);

    return {
      processed: this.processed,
      successful: this.successful,
      failed: this.failed,
      errors: this.errors
    };
  }

  async syncDestinationPhoto(supabaseDest: SupabaseDestination): Promise<boolean> {
    try {
      this.processed++;
      // console.log(`Processing ${this.processed}: ${supabaseDest.name}`);

      // Find matching destination in local database by name
      const localMatches = await this.localDb`
        SELECT id, name FROM destinations 
        WHERE LOWER(name) = LOWER(${supabaseDest.name})
        LIMIT 1
      `;

      if (!localMatches || localMatches.length === 0) {
        // console.log(`  ⚠️ No local match found for: ${supabaseDest.name}`);
        this.failed++;
        this.errors.push(`No local match for: ${supabaseDest.name}`);
        return false;
      }

      const localDest = localMatches[0];

      // Update local destination with Supabase photo data
      await this.localDb`
        UPDATE destinations 
        SET 
          cover_photo_url = ${supabaseDest.cover_photo_url},
          photo_url = ${supabaseDest.cover_photo_url},
          photo_alt = ${supabaseDest.cover_photos_alt_text || ''}
        WHERE id = ${localDest.id}
      `;

      // console.log(`  ✅ Photo synced: ${supabaseDest.cover_photo_url}`);
      this.successful++;
      return true;

    } catch (_error) {
      // console.error(`Sync failed for ${supabaseDest.name}:`, error);
      this.errors.push(`Sync error for ${supabaseDest.name}: ${error}`);
      this.failed++;
      return false;
    }
  }
}