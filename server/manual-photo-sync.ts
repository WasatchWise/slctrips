/**
 * Manual Photo Sync Module for SLC Trips
 * Provides granular control over photo synchronization with detailed progress tracking
 */

import { storage } from './storage';
import { PhotoEnrichmentSystem } from './photo-enrichment-system';

interface SyncProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  current: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  errors: string[];
  results: PhotoSyncResult[];
}

interface PhotoSyncResult {
  destinationId: number;
  name: string;
  success: boolean;
  photoCount: number;
  source: string;
  reason: string;
  timestamp: Date;
  processingTime: number;
}

interface SyncOptions {
  batchSize?: number;
  delayMs?: number;
  forceRefresh?: boolean;
  useGooglePlaces?: boolean;
  useUnsplash?: boolean;
  maxRetries?: number;
  categories?: string[];
  driveTimeFilter?: number;
}

export class ManualPhotoSync {
  private progress: SyncProgress;
  private enrichmentSystem: PhotoEnrichmentSystem;
  private isRunning = false;
  private shouldPause = false;

  constructor() {
    this.progress = {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      current: '',
      status: 'idle',
      errors: [],
      results: []
    };
    
    this.enrichmentSystem = new PhotoEnrichmentSystem();
  }

  /**
   * Get current sync progress
   */
  getProgress(): SyncProgress {
    return { ...this.progress };
  }

  /**
   * Start manual photo sync process
   */
  async startSync(options: SyncOptions = {}): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return { success: false, message: 'Sync already running' };
    }

    const {
      batchSize = 10,
      delayMs = 1000,
      forceRefresh = false,
      useGooglePlaces = true,
      useUnsplash = true,
      maxRetries = 3,
      categories = [],
      driveTimeFilter
    } = options;

    try {
      this.isRunning = true;
      this.shouldPause = false;
      this.progress = {
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        current: '',
        status: 'running',
        startTime: new Date(),
        errors: [],
        results: []
      };

      // Get destinations that need photos
      const destinations = await this.getDestinationsForSync({
        forceRefresh,
        categories,
        driveTimeFilter
      });

      this.progress.total = destinations.length;

      if (destinations.length === 0) {
        this.progress.status = 'completed';
        this.progress.endTime = new Date();
        return { success: true, message: 'No destinations need photo sync' };
      }

      // Process destinations in batches
      for (let i = 0; i < destinations.length; i += batchSize) {
        if (this.shouldPause) {
          this.progress.status = 'paused';
          return { success: true, message: 'Sync paused' };
        }

        const batch = destinations.slice(i, i + batchSize);
        
        for (const destination of batch) {
          if (this.shouldPause) {
            this.progress.status = 'paused';
            return { success: true, message: 'Sync paused' };
          }

          this.progress.current = destination.name;
          
          try {
            const startTime = Date.now();
            const result = await this.syncDestinationPhotos(destination, {
              useGooglePlaces,
              useUnsplash,
              maxRetries
            });
            
            const processingTime = Date.now() - startTime;
            result.processingTime = processingTime;
            result.timestamp = new Date();

            this.progress.results.push(result);
            
            if (result.success) {
              this.progress.successful++;
            } else {
              this.progress.failed++;
              this.progress.errors.push(`${destination.name}: ${result.reason}`);
            }

            this.progress.processed++;

            // Add delay between destinations
            if (delayMs > 0) {
              await this.delay(delayMs);
            }
          } catch (error: any) {
            this.progress.failed++;
            this.progress.errors.push(`${destination.name}: ${error.message}`);
            this.progress.processed++;
          }
        }
      }

      this.progress.status = 'completed';
      this.progress.endTime = new Date();
      this.isRunning = false;

      return { 
        success: true, 
        message: `Sync completed. Processed: ${this.progress.processed}, Successful: ${this.progress.successful}, Failed: ${this.progress.failed}` 
      };

    } catch (error: any) {
      this.progress.status = 'error';
      this.progress.errors.push(`Sync failed: ${error.message}`);
      this.isRunning = false;
      return { success: false, message: error.message };
    }
  }

  /**
   * Pause the sync process
   */
  pauseSync(): { success: boolean; message: string } {
    if (!this.isRunning) {
      return { success: false, message: 'No sync running' };
    }

    this.shouldPause = true;
    return { success: true, message: 'Sync will pause after current destination' };
  }

  /**
   * Resume the sync process
   */
  async resumeSync(): Promise<{ success: boolean; message: string }> {
    if (this.progress.status !== 'paused') {
      return { success: false, message: 'No paused sync to resume' };
    }

    this.shouldPause = false;
    this.progress.status = 'running';
    
    // Continue with remaining destinations
    const remaining = this.progress.total - this.progress.processed;
    if (remaining > 0) {
      return this.startSync({ batchSize: 10, delayMs: 1000 });
    }

    return { success: true, message: 'Sync resumed' };
  }

  /**
   * Stop the sync process
   */
  stopSync(): { success: boolean; message: string } {
    if (!this.isRunning) {
      return { success: false, message: 'No sync running' };
    }

    this.shouldPause = true;
    this.isRunning = false;
    this.progress.status = 'idle';
    return { success: true, message: 'Sync stopped' };
  }

  /**
   * Get destinations that need photo sync
   */
  private async getDestinationsForSync(options: {
    forceRefresh?: boolean;
    categories?: string[];
    driveTimeFilter?: number;
  }): Promise<any[]> {
    const { pool } = await import('./db');
    
    let query = `
      SELECT id, name, address, coordinates, photos, category, drive_time
      FROM destinations 
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (!options.forceRefresh) {
      query += `
        AND (photos IS NULL 
             OR photos = '[]'::jsonb 
             OR jsonb_array_length(photos) = 0
             OR (photos->>0)::jsonb->>'url' LIKE '%placeholder%'
             OR (photos->>0)::jsonb->>'url' LIKE '%unsplash%')
      `;
    }

    if (options.categories && options.categories.length > 0) {
      query += ` AND category = ANY($${paramIndex})`;
      params.push(options.categories);
      paramIndex++;
    }

    if (options.driveTimeFilter) {
      query += ` AND drive_time <= $${paramIndex}`;
      params.push(options.driveTimeFilter);
      paramIndex++;
    }

    query += ` ORDER BY drive_time ASC, name ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Sync photos for a single destination
   */
  private async syncDestinationPhotos(destination: any, options: {
    useGooglePlaces: boolean;
    useUnsplash: boolean;
    maxRetries: number;
  }): Promise<PhotoSyncResult> {
    const { useGooglePlaces, useUnsplash, maxRetries } = options;
    
    let retries = 0;
    let lastError: string = '';

    while (retries < maxRetries) {
      try {
        // Try Google Places first if enabled
        if (useGooglePlaces) {
          const result = await this.enrichmentSystem.enrichDestination(destination);
          if (result.success && result.photoCount > 0) {
            return {
              destinationId: destination.id,
              name: destination.name,
              success: true,
              photoCount: result.photoCount,
              source: 'google_places',
              reason: 'Successfully enriched with Google Places photos',
              timestamp: new Date(),
              processingTime: 0
            };
          }
          lastError = result.reason;
        }

        // Fallback to Unsplash if enabled
        if (useUnsplash && (!useGooglePlaces || lastError.includes('no photos found'))) {
          const unsplashPhotos = await this.getUnsplashPhotos(destination.name);
          if (unsplashPhotos.length > 0) {
            await this.updateDestinationPhotos(destination.id, unsplashPhotos);
            return {
              destinationId: destination.id,
              name: destination.name,
              success: true,
              photoCount: unsplashPhotos.length,
              source: 'unsplash',
              reason: 'Successfully enriched with Unsplash photos',
              timestamp: new Date(),
              processingTime: 0
            };
          }
        }

        // If we get here, no photos were found
        return {
          destinationId: destination.id,
          name: destination.name,
          success: false,
          photoCount: 0,
          source: 'none',
          reason: lastError || 'No photos found from any source',
          timestamp: new Date(),
          processingTime: 0
        };

      } catch (error: any) {
        retries++;
        lastError = error.message;
        
        if (retries >= maxRetries) {
          return {
            destinationId: destination.id,
            name: destination.name,
            success: false,
            photoCount: 0,
            source: 'error',
            reason: `Failed after ${maxRetries} retries: ${lastError}`,
            timestamp: new Date(),
            processingTime: 0
          };
        }

        // Wait before retry
        await this.delay(1000 * retries);
      }
    }

    return {
      destinationId: destination.id,
      name: destination.name,
      success: false,
      photoCount: 0,
      source: 'error',
      reason: 'Unexpected error in sync process',
      timestamp: new Date(),
      processingTime: 0
    };
  }

  /**
   * Get Unsplash photos for a destination
   */
  private async getUnsplashPhotos(destinationName: string): Promise<any[]> {
    try {
      const { unsplash } = await import('./unsplash');
      const photos = await unsplash.searchPhotos(destinationName + ' Utah', 3);
      
      return photos.map((photo: any) => ({
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        alt: `${destinationName} - ${photo.alt_description || 'Utah destination'}`,
        source: 'unsplash',
        verified: false,
        width: photo.width,
        height: photo.height,
        photographer: photo.user?.name || 'Unknown',
        photographer_url: photo.user?.links?.html || null
      }));
    } catch (_error) {
      // console.error('Error getting Unsplash photos:', error);
      return [];
    }
  }

  /**
   * Update destination photos in database
   */
  private async updateDestinationPhotos(destinationId: number, photos: any[]): Promise<void> {
    const { pool } = await import('./db');
    
    await pool.query(
      'UPDATE destinations SET photos = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(photos), destinationId]
    );
  }

  /**
   * Utility function for delays
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get sync statistics
   */
  async getSyncStatistics(): Promise<{
    totalDestinations: number;
    withPhotos: number;
    needPhotos: number;
    syncProgress: SyncProgress;
    recentResults: PhotoSyncResult[];
  }> {
    const { pool } = await import('./db');
    
    // Get overall statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN photos IS NOT NULL AND photos != '[]'::jsonb AND jsonb_array_length(photos) > 0 THEN 1 END) as with_photos,
        COUNT(CASE WHEN photos IS NULL OR photos = '[]'::jsonb OR jsonb_array_length(photos) = 0 THEN 1 END) as need_photos
      FROM destinations
    `);

    const stats = statsResult.rows[0];

    return {
      totalDestinations: parseInt(stats.total),
      withPhotos: parseInt(stats.with_photos),
      needPhotos: parseInt(stats.need_photos),
      syncProgress: this.getProgress(),
      recentResults: this.progress.results.slice(-10) // Last 10 results
    };
  }

  /**
   * Clear sync history
   */
  clearHistory(): { success: boolean; message: string } {
    this.progress.results = [];
    this.progress.errors = [];
    return { success: true, message: 'Sync history cleared' };
  }
}

// Export singleton instance
export const manualPhotoSync = new ManualPhotoSync(); 