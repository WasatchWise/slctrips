
/**
 * Supabase Photo Connector
 * Connects actual photo URLs to destinations in Supabase database
 */

import { supabase } from './supabase-client';

interface PhotoConnectionResult {
  destinationId: string;
  name: string;
  success: boolean;
  photoUrl?: string;
  source: string;
  error?: string;
}

export class SupabasePhotoConnector {
  private processed = 0;
  private successful = 0;
  private failed = 0;
  private results: PhotoConnectionResult[] = [];

  /**
   * Get destinations that need photos from Supabase
   */
  async getDestinationsNeedingPhotos(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, photo_gallery, category, latitude, longitude')
        .or('photo_gallery.is.null,photo_gallery.eq.[]')
        .limit(100);

      if (error) {
        // console.error('Error fetching destinations:', error);
        return [];
      }

      return data || [];
    } catch (_error) {
      // console.error('Error in getDestinationsNeedingPhotos:', error);
      return [];
    }
  }

  /**
   * Generate category-based fallback photo URL
   */
  getCategoryFallbackPhoto(category: string): string {
    const categoryPhotos: { [key: string]: string } = {
      'Downtown & Nearby': 'https://images.unsplash.com/photo-1544473244-f6895e69ad8b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'Less than 3 Hours': 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'Less than 5 Hours': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'Less than 8 Hours': 'https://images.unsplash.com/photo-1464822759844-d150ad6c1cfc?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'Less than 12 Hours': 'https://images.unsplash.com/photo-1515790810823-b56e8fe4b6e9?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      'A little bit farther': 'https://images.unsplash.com/photo-1468329649579-4b99be9bd683?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
    };

    return categoryPhotos[category] || categoryPhotos['Downtown & Nearby'];
  }

  /**
   * Search for Google Places photo using destination name
   */
  async searchGooglePlacesPhoto(destinationName: string, latitude?: number, longitude?: number): Promise<string | null> {
    try {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY;
      
      if (!apiKey) {
        // console.log('⚠️ No Google Places API key found');
        return null;
      }

      const query = `${destinationName} Utah`;
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const place = data.results[0];
        
        if (place.photos && place.photos.length > 0) {
          const photoReference = place.photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
          return photoUrl;
        }
      }

      return null;
    } catch (_error) {
      // console.error(`Error searching Google Places for ${destinationName}:`, error);
      return null;
    }
  }

  /**
   * Create photo gallery object
   */
  createPhotoGallery(photoUrl: string, destinationName: string, source: string): any[] {
    return [{
      url: photoUrl,
      alt_text: `${destinationName} - Photo`,
      caption: destinationName,
      source: source,
      photographer: source === 'google_places' ? 'Google Places contributor' : 'Stock photography',
      width: 800,
      height: 600,
      is_primary: true,
      verified: source === 'google_places',
      uploaded_at: new Date().toISOString()
    }];
  }

  /**
   * Update destination with photo data
   */
  async updateDestinationPhoto(destinationId: string, photoGallery: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('destinations')
        .update({ photo_gallery: photoGallery })
        .eq('id', destinationId);

      if (error) {
        // console.error(`Error updating destination ${destinationId}:`, error);
        return false;
      }

      return true;
    } catch (_error) {
      // console.error(`Error in updateDestinationPhoto for ${destinationId}:`, error);
      return false;
    }
  }

  /**
   * Process a single destination
   */
  async processDestination(destination: any): Promise<PhotoConnectionResult> {
    const result: PhotoConnectionResult = {
      destinationId: destination.id,
      name: destination.name,
      success: false,
      source: 'none'
    };

    try {
      this.processed++;
      // console.log(`[${this.processed}] Processing: ${destination.name}`);

      // Try Google Places first
      let photoUrl = await this.searchGooglePlacesPhoto(
        destination.name, 
        destination.latitude, 
        destination.longitude
      );

      let source = 'google_places';

      // Fall back to category photo if Google Places fails
      if (!photoUrl) {
        photoUrl = this.getCategoryFallbackPhoto(destination.category || 'Downtown & Nearby');
        source = 'category_fallback';
      }

      // Create photo gallery
      const photoGallery = this.createPhotoGallery(photoUrl, destination.name, source);

      // Update destination
      const updateSuccess = await this.updateDestinationPhoto(destination.id, photoGallery);

      if (updateSuccess) {
        result.success = true;
        result.photoUrl = photoUrl;
        result.source = source;
        this.successful++;
        // console.log(`  ✅ Photo connected: ${source}`);
      } else {
        result.error = 'Failed to update database';
        this.failed++;
        // console.log(`  ❌ Database update failed`);
      }

    } catch (_error) {
      result.error = (error as Error).message;
      this.failed++;
      // console.log(`  ❌ Error: ${result.error}`);
    }

    this.results.push(result);
    return result;
  }

  /**
   * Connect photos to all destinations needing them
   */
  async connectAllPhotos(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: PhotoConnectionResult[];
  }> {
    // console.log('🚀 Starting Supabase Photo Connection...');
    // console.log('=' .repeat(60));

    const destinations = await this.getDestinationsNeedingPhotos();
    // console.log(`📋 Found ${destinations.length} destinations needing photos`);

    if (destinations.length === 0) {
      // console.log('✅ All destinations already have photos');
      return {
        processed: 0,
        successful: 0,
        failed: 0,
        results: []
      };
    }

    this.processed = 0;
    this.successful = 0;
    this.failed = 0;
    this.results = [];

    for (const destination of destinations) {
      await this.processDestination(destination);
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 Photo Connection Complete!');
    // console.log(`📊 Total processed: ${this.processed}`);
    // console.log(`✅ Successful: ${this.successful}`);
    // console.log(`❌ Failed: ${this.failed}`);
    // console.log(`📈 Success rate: ${((this.successful / this.processed) * 100).toFixed(1)}%`);

    return {
      processed: this.processed,
      successful: this.successful,
      failed: this.failed,
      results: this.results
    };
  }

  /**
   * Get photo statistics
   */
  async getPhotoStats(): Promise<{
    totalDestinations: number;
    withPhotos: number;
    needPhotos: number;
    coverage: number;
  }> {
    try {
      const { count: totalCount } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });

      const { count: withPhotosCount } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true })
        .not('photo_gallery', 'is', null)
        .neq('photo_gallery', '[]');

      const total = totalCount || 0;
      const withPhotos = withPhotosCount || 0;
      const needPhotos = total - withPhotos;
      const coverage = total > 0 ? (withPhotos / total) * 100 : 0;

      return {
        totalDestinations: total,
        withPhotos,
        needPhotos,
        coverage: Math.round(coverage * 10) / 10
      };
    } catch (_error) {
      // console.error('Error getting photo stats:', error);
      return { totalDestinations: 0, withPhotos: 0, needPhotos: 0, coverage: 0 };
    }
  }
}

export const supabasePhotoConnector = new SupabasePhotoConnector();
