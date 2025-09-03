/**
 * Comprehensive Photo Enrichment System for SLC Trips
 * Populates all destinations with authentic photos using Google Places API
 */

import axios from 'axios';
import { storage } from './storage';
import { SUPABASE_URL, DANIEL_SUPABASE_ANON_KEY } from './config';

interface GooglePlacesPhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface GooglePlace {
  place_id: string;
  name: string;
  photos?: GooglePlacesPhoto[];
  formatted_address?: string;
  rating?: number;
}

interface PhotoEnrichmentResult {
  destinationId: number;
  name: string;
  success: boolean;
  photoCount: number;
  source: string;
  reason: string;
}

export class PhotoEnrichmentSystem {
  private apiKey: string;
  private processed = 0;
  private successful = 0;
  private failed = 0;
  private results: PhotoEnrichmentResult[] = [];

  constructor() {
    this.apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY || 
                  process.env.GOOGLE_PLACES_API_KEY || 
                  process.env.GOOGLE_MAPS_API_KEY || 
                  process.env.GOOGLE_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Google API key not found. Please set VITE_GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_API_KEY, GOOGLE_MAPS_API_KEY, or GOOGLE_API_KEY environment variable.');
    }
  }

  /**
   * Get all destinations that need photos
   */
  async getDestinationsNeedingPhotos(): Promise<any[]> {
    try {
      const { pool } = await import('./db');
      const result = await pool.query(`
        SELECT id, name, address, coordinates, photos
        FROM destinations 
        WHERE photos IS NULL 
           OR photos = '[]'::jsonb 
           OR jsonb_array_length(photos) = 0
           OR (photos->>0)::jsonb->>'url' LIKE '%placeholder%'
        ORDER BY id
        LIMIT 50
      `);
      
      return result.rows;
    } catch (_error) {
      // console.error('Error fetching destinations needing photos:', error);
      return [];
    }
  }

  /**
   * Search for a place using Google Places Text Search API
   */
  async searchPlace(destinationName: string, address?: string): Promise<GooglePlace | null> {
    try {
      // Create search query with location context
      let query = destinationName;
      if (address) {
        query += `, ${address}`;
      } else {
        query += ', Utah';
      }

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: query,
          key: this.apiKey,
          type: 'tourist_attraction|establishment|point_of_interest'
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        // Return the first result with photos
        const placesWithPhotos = response.data.results.filter((place: GooglePlace) => 
          place.photos && place.photos.length > 0
        );
        
        return placesWithPhotos.length > 0 ? placesWithPhotos[0] : response.data.results[0];
      }

      return null;
    } catch (_error) {
      // console.error(`Error searching for place ${destinationName}:`, error);
      return null;
    }
  }

  /**
   * Generate Google Places photo URL
   */
  generatePhotoUrl(photoReference: string, maxWidth = 800): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Create authentic photo objects from Google Places data
   */
  createPhotoObjects(place: GooglePlace, destinationName: string): any[] {
    if (!place.photos || place.photos.length === 0) {
      return [];
    }

    return place.photos.slice(0, 3).map((photo, index) => ({
      url: this.generatePhotoUrl(photo.photo_reference),
      alt_text: `${destinationName} - Photo ${index + 1}`,
      caption: `${destinationName}`,
      source: 'Google Places API',
      photographer: 'Google Places contributor',
      width: photo.width,
      height: photo.height,
      is_primary: index === 0,
      verified: true,
      uploaded_at: new Date().toISOString()
    }));
  }

  /**
   * Create high-quality placeholder photo
   */
  createPlaceholderPhoto(destinationName: string): any[] {
    return [{
      url: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center`,
      alt_text: `${destinationName} - Utah landscape`,
      caption: `${destinationName} - Scenic Utah destination`,
      source: 'Unsplash',
      photographer: 'Professional stock photography',
      width: 800,
      height: 600,
      is_primary: true,
      verified: false,
      uploaded_at: new Date().toISOString()
    }];
  }

  /**
   * Update destination with photos in both photos table and destinations.photos field
   */
  async updateDestinationPhotos(destinationId: number, photos: any[]): Promise<void> {
    try {
      const { pool } = await import('./db');
      // Update the destinations table photos field
      await pool.query(
        'UPDATE destinations SET photos = $1 WHERE id = $2',
        [JSON.stringify(photos), destinationId]
      );

      // console.log(`✅ Updated ${photos.length} photos for destination ${destinationId}`);
    } catch (_error) {
      // console.error(`Error updating photos for destination ${destinationId}:`, error);
      throw error;
    }
  }

  /**
   * Enrich a single destination with photos
   */
  async enrichDestination(destination: any): Promise<PhotoEnrichmentResult> {
    const result: PhotoEnrichmentResult = {
      destinationId: destination.id,
      name: destination.name,
      success: false,
      photoCount: 0,
      source: '',
      reason: ''
    };

    try {
      // Search for the place using Google Places API
      const place = await this.searchPlace(destination.name, destination.address);
      
      if (!place) {
        // Create high-quality placeholder
        const placeholderPhotos = this.createPlaceholderPhoto(destination.name);
        await this.updateDestinationPhotos(destination.id, placeholderPhotos);
        
        result.success = true;
        result.photoCount = 1;
        result.source = 'Placeholder';
        result.reason = 'Google Places not found, using high-quality placeholder';
        return result;
      }

      if (place.photos && place.photos.length > 0) {
        // Create authentic photos from Google Places
        const photos = this.createPhotoObjects(place, destination.name);
        await this.updateDestinationPhotos(destination.id, photos);
        
        result.success = true;
        result.photoCount = photos.length;
        result.source = 'Google Places API';
        result.reason = `Found ${photos.length} authentic photos`;
      } else {
        // Use placeholder for places without photos
        const placeholderPhotos = this.createPlaceholderPhoto(destination.name);
        await this.updateDestinationPhotos(destination.id, placeholderPhotos);
        
        result.success = true;
        result.photoCount = 1;
        result.source = 'Placeholder';
        result.reason = 'Place found but no photos available';
      }

      return result;
    } catch (_error) {
      result.reason = `Error: ${(error as Error).message}`;
      return result;
    }
  }

  /**
   * Rate limiting delay
   */
  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Enrich all destinations with photos
   */
  async enrichAllDestinations(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: PhotoEnrichmentResult[];
  }> {
    // console.log('🚀 Starting comprehensive photo enrichment...');
    // console.log('='.repeat(60));

    const destinations = await this.getDestinationsNeedingPhotos();
    // console.log(`📊 Found ${destinations.length} destinations needing photos`);

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
      this.processed++;
      
      // Rate limiting: 1 second between requests
      if (this.processed > 1) {
        await this.delay(1000);
      }

      // console.log(`\n[${this.processed}/${destinations.length}] Processing: ${destination.name}`);
      
      const result = await this.enrichDestination(destination);
      this.results.push(result);
      
      if (result.success) {
        this.successful++;
        // console.log(`✅ ${result.reason}`);
      } else {
        this.failed++;
        // console.log(`❌ ${result.reason}`);
      }

      // Progress update every 25 destinations
      if (this.processed % 25 === 0) {
        const percentage = ((this.processed / destinations.length) * 100).toFixed(1);
        // console.log(`\n📈 Progress: ${percentage}% (${this.successful} successful, ${this.failed} failed)`);
      }
    }

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 Photo enrichment completed!');
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
   * Get photo enrichment statistics
   */
  async getPhotoStatistics(): Promise<{
    totalDestinations: number;
    withPhotos: number;
    needPhotos: number;
    photosCoverage: number;
    authenticPhotos: number;
    placeholderPhotos: number;
  }> {
    try {
      // Use Supabase directly instead of storage.query
      const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          SUPABASE_URL,
          DANIEL_SUPABASE_ANON_KEY
        );

      const { count: total } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });

      const { data: destinationsWithPhotos } = await supabase
        .from('destinations')
        .select('photos, photo_url')
        .or('photos.not.is.null,photo_url.not.is.null');

      const withPhotos = destinationsWithPhotos?.length || 0;
      const authentic = destinationsWithPhotos?.filter(d => 
        d.photos && Array.isArray(d.photos) && 
        d.photos.some((p: any) => p.source === 'Google Places API')
      ).length || 0;

      const totalCount = total || 0;
      const needPhotos = totalCount - withPhotos;
      const coverage = totalCount > 0 ? (withPhotos / totalCount) * 100 : 0;
      const placeholders = withPhotos - authentic;

      return {
        totalDestinations: totalCount,
        withPhotos,
        needPhotos,
        photosCoverage: Math.round(coverage * 10) / 10,
        authenticPhotos: authentic,
        placeholderPhotos: placeholders
      };
    } catch (_error) {
      // console.error('Error getting photo statistics:', error);
      return {
        totalDestinations: 0,
        withPhotos: 0,
        needPhotos: 0,
        photosCoverage: 0,
        authenticPhotos: 0,
        placeholderPhotos: 0
      };
    }
  }
}

export const photoEnrichmentSystem = new PhotoEnrichmentSystem();