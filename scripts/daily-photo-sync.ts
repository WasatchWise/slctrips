/**
 * Daily Photo Sync Script for Node.js 20
 * 
 * This script updates photo URLs in Supabase and manages destination cleanup.
 */

import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import { Client } from '@googlemaps/google-maps-services-js';
import * as readline from 'readline';
import { DANIEL_SUPABASE_ANON_KEY } from '../server/config';

interface SyncResult {
  destinationId: string;
  name: string;
  action: 'updated' | 'skipped' | 'failed' | 'deleted';
  photoUrl?: string;
  error?: string;
  reason?: string;
}

interface DeletionCandidate {
  id: string;
  name: string;
  lastUpdated: string;
  reason: string;
}

class DailyPhotoSync {
  private supabase: any;
  private localDb: any;
  private googleMapsClient: Client;
  private results: SyncResult[] = [];
  private deletionCandidates: DeletionCandidate[] = [];
  private rl: readline.Interface;

  constructor() {
    // Initialize Supabase client
      this.supabase = createClient(
        process.env.SUPABASE_URL!,
        DANIEL_SUPABASE_ANON_KEY
      );

    // Initialize local database connection
    this.localDb = neon(process.env.DATABASE_URL!);

    // Initialize Google Maps client
    this.googleMapsClient = new Client({});

    // Initialize readline for user input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Main sync function
   */
  async runDailySync(): Promise<void> {
    console.log('🚀 Starting Daily Photo Sync and Destination Management...');
    console.log('='.repeat(60));

    try {
      // Step 1: Test connections
      await this.testConnections();

      // Step 2: Update photo URLs
      await this.updatePhotoUrls();

      // Step 3: Identify destinations for deletion
      await this.identifyDeletionCandidates();

      // Step 4: Ask for confirmation and delete if approved
      if (this.deletionCandidates.length > 0) {
        await this.handleDeletionConfirmation();
      }

      // Step 5: Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Daily sync failed:', error);
      throw error;
    } finally {
      this.rl.close();
    }
  }

  /**
   * Test database and Supabase connections
   */
  private async testConnections(): Promise<void> {
    console.log('\n🔗 Step 1: Testing Connections...');

    try {
      // Test database connection
      const dbResult = await this.localDb`SELECT NOW() as current_time`;
      console.log(`✅ Database connected: ${dbResult[0]?.current_time}`);

      // Test Supabase connection
      const { data, error } = await this.supabase
        .from('destinations')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      console.log('✅ Supabase connected');

    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  }

  /**
   * Update photo URLs for destinations
   */
  private async updatePhotoUrls(): Promise<void> {
    console.log('\n📸 Step 2: Updating Photo URLs...');

    // Get destinations that need photo updates
    const destinations = await this.getDestinationsNeedingPhotos();
    console.log(`📋 Found ${destinations.length} destinations needing photo updates`);

    for (const destination of destinations) {
      try {
        const result = await this.updateDestinationPhoto(destination);
        this.results.push(result);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        this.results.push({
          destinationId: destination.id,
          name: destination.name,
          action: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`✅ Photo URL updates complete: ${this.results.filter(r => r.action === 'updated').length} updated`);
  }

  /**
   * Get destinations that need photo updates
   */
  private async getDestinationsNeedingPhotos(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('destinations')
      .select('id, name, photo_gallery, cover_photo_url, latitude, longitude, county, region')
      .or('photo_gallery.is.null,photo_gallery.eq.[],cover_photo_url.is.null,cover_photo_url.eq.')
      .limit(10); // Limit for testing

    if (error) {
      throw new Error(`Failed to fetch destinations: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update photo for a single destination
   */
  private async updateDestinationPhoto(destination: any): Promise<SyncResult> {
    try {
      // Try Google Places API first
      let photoUrl = await this.searchGooglePlacesPhoto(destination);
      let source = 'google_places';

      // Fallback to category photo if Google Places fails
      if (!photoUrl) {
        photoUrl = this.getCategoryFallbackPhoto(destination.category || 'Downtown & Nearby');
        source = 'category_fallback';
      }

      if (!photoUrl) {
        return {
          destinationId: destination.id,
          name: destination.name,
          action: 'failed',
          error: 'No photo source available'
        };
      }

      // Create photo gallery
      const photoGallery = this.createPhotoGallery(photoUrl, destination.name, source);

      // Update in Supabase
      const { error: updateError } = await this.supabase
        .from('destinations')
        .update({ 
          photo_gallery: photoGallery,
          cover_photo_url: photoUrl,
          photos_verified: true,
          photos_verified_date: new Date().toISOString()
        })
        .eq('id', destination.id);

      if (updateError) {
        return {
          destinationId: destination.id,
          name: destination.name,
          action: 'failed',
          error: updateError.message
        };
      }

      return {
        destinationId: destination.id,
        name: destination.name,
        action: 'updated',
        photoUrl
      };

    } catch (error) {
      return {
        destinationId: destination.id,
        name: destination.name,
        action: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search Google Places for photos
   */
  private async searchGooglePlacesPhoto(destination: any): Promise<string | null> {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return null;
    }

    try {
      const searchQuery = `${destination.name}, ${destination.county || destination.region || 'Utah'}`;
      
      const response = await this.googleMapsClient.findPlaceFromText({
        params: {
          input: searchQuery,
          inputtype: 'textquery',
          fields: ['place_id', 'photos'],
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      });

      if (response.data.candidates && response.data.candidates.length > 0) {
        const place = response.data.candidates[0];
        if (place.photos && place.photos.length > 0) {
          const photoRef = place.photos[0].photo_reference;
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        }
      }

      return null;
    } catch (error) {
      console.warn(`Google Places search failed for ${destination.name}:`, error);
      return null;
    }
  }

  /**
   * Get category fallback photo
   */
  private getCategoryFallbackPhoto(category: string): string {
    const fallbackPhotos: Record<string, string> = {
      'Downtown & Nearby': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
      'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'Less than 3 Hours': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=800',
      'Less than 5 Hours': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'Less than 8 Hours': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=800',
      'Less than 12 Hours': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'A little bit farther': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=800'
    };

    return fallbackPhotos[category] || fallbackPhotos['Downtown & Nearby'];
  }

  /**
   * Create photo gallery array
   */
  private createPhotoGallery(photoUrl: string, destinationName: string, source: string): any[] {
    return [{
      url: photoUrl,
      alt_text: `${destinationName} - Utah Destination`,
      caption: destinationName,
      source: source,
      photographer: 'SLC Trips',
      is_primary: true,
      verified: true,
      uploaded_at: new Date().toISOString()
    }];
  }

  /**
   * Identify destinations that should be deleted
   */
  private async identifyDeletionCandidates(): Promise<void> {
    console.log('\n🗑️ Step 3: Identifying Deletion Candidates...');

    // Get destinations that haven't been updated in 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: oldDestinations, error } = await this.supabase
      .from('destinations')
      .select('id, name, updated_at, created_at')
      .lt('updated_at', sixMonthsAgo.toISOString())
      .order('updated_at', { ascending: true })
      .limit(5); // Limit for testing

    if (error) {
      console.error('Failed to fetch old destinations:', error);
      return;
    }

    // Get destinations with no photos
    const { data: noPhotoDestinations, error: noPhotoError } = await this.supabase
      .from('destinations')
      .select('id, name, updated_at, created_at')
      .or('photo_gallery.is.null,photo_gallery.eq.[],cover_photo_url.is.null,cover_photo_url.eq.')
      .order('updated_at', { ascending: true })
      .limit(5); // Limit for testing

    if (noPhotoError) {
      console.error('Failed to fetch destinations without photos:', noPhotoError);
      return;
    }

    // Combine and deduplicate candidates
    const allCandidates = [...(oldDestinations || []), ...(noPhotoDestinations || [])];
    const uniqueCandidates = this.deduplicateCandidates(allCandidates);

    // Filter to top 5 most problematic destinations
    this.deletionCandidates = uniqueCandidates
      .slice(0, 5)
      .map(dest => ({
        id: dest.id,
        name: dest.name,
        lastUpdated: dest.updated_at,
        reason: this.getDeletionReason(dest)
      }));

    console.log(`📋 Found ${this.deletionCandidates.length} deletion candidates`);
  }

  /**
   * Deduplicate candidates by ID
   */
  private deduplicateCandidates(candidates: any[]): any[] {
    const seen = new Set();
    return candidates.filter(candidate => {
      if (seen.has(candidate.id)) {
        return false;
      }
      seen.add(candidate.id);
      return true;
    });
  }

  /**
   * Get reason for deletion
   */
  private getDeletionReason(destination: any): string {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    if (new Date(destination.updated_at) < sixMonthsAgo) {
      return 'Not updated in 6+ months';
    }
    return 'No photos available';
  }

  /**
   * Handle deletion confirmation with user input
   */
  private async handleDeletionConfirmation(): Promise<void> {
    console.log('\n⚠️ Step 4: Deletion Confirmation Required');
    console.log('='.repeat(60));
    
    console.log('\nThe following destinations are candidates for deletion:');
    this.deletionCandidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.name} (${candidate.reason})`);
    });

    const answer = await this.askQuestion('\nDo you want to delete these destinations? (yes/no/list): ');

    if (answer.toLowerCase() === 'list') {
      await this.handleIndividualDeletion();
    } else if (answer.toLowerCase() === 'yes') {
      await this.deleteAllCandidates();
    } else {
      console.log('❌ Deletion cancelled by user');
    }
  }

  /**
   * Handle individual destination deletion
   */
  private async handleIndividualDeletion(): Promise<void> {
    console.log('\nIndividual deletion mode:');
    
    for (const candidate of this.deletionCandidates) {
      const answer = await this.askQuestion(`Delete "${candidate.name}"? (yes/no): `);
      
      if (answer.toLowerCase() === 'yes') {
        await this.deleteDestination(candidate.id, candidate.name);
      } else {
        console.log(`✅ Kept: ${candidate.name}`);
      }
    }
  }

  /**
   * Delete all candidates
   */
  private async deleteAllCandidates(): Promise<void> {
    console.log('\n🗑️ Deleting all candidates...');
    
    for (const candidate of this.deletionCandidates) {
      await this.deleteDestination(candidate.id, candidate.name);
    }
  }

  /**
   * Delete a single destination
   */
  private async deleteDestination(id: string, name: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`❌ Failed to delete ${name}:`, error.message);
      } else {
        console.log(`✅ Deleted: ${name}`);
        this.results.push({
          destinationId: id,
          name,
          action: 'deleted'
        });
      }
    } catch (error) {
      console.error(`❌ Error deleting ${name}:`, error);
    }
  }

  /**
   * Ask user a question
   */
  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Generate final report
   */
  private generateReport(): void {
    console.log('\n📊 Step 5: Daily Sync Report');
    console.log('='.repeat(60));

    const updated = this.results.filter(r => r.action === 'updated').length;
    const failed = this.results.filter(r => r.action === 'failed').length;
    const deleted = this.results.filter(r => r.action === 'deleted').length;
    const skipped = this.results.filter(r => r.action === 'skipped').length;

    console.log(`📸 Photo Updates: ${updated} updated, ${failed} failed`);
    console.log(`🗑️ Deletions: ${deleted} deleted`);
    console.log(`⏭️ Skipped: ${skipped} skipped`);
    console.log(`📋 Total Processed: ${this.results.length}`);

    if (failed > 0) {
      console.log('\n❌ Failed Updates:');
      this.results
        .filter(r => r.action === 'failed')
        .forEach(result => {
          console.log(`  - ${result.name}: ${result.error}`);
        });
    }

    console.log('\n✅ Daily sync completed successfully!');
  }
}

// Main execution
async function main() {
  const sync = new DailyPhotoSync();
  await sync.runDailySync();
}

// Export for use in other scripts
export { DailyPhotoSync };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
} 