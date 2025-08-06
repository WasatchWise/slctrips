/**
 * Mass Photo Enrichment System
 * Processes ALL destinations in parallel batches with authentic Google Places API photos
 */

import axios from 'axios';
import { pool } from './db';

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
  user_ratings_total?: number;
  types?: string[];
  opening_hours?: {
    open_now?: boolean;
  };
  price_level?: number;
}

export class MassPhotoEnrichment {
  private apiKey: string;
  private processed = 0;
  private successful = 0;
  private failed = 0;
  private concurrency = 5; // Process 5 destinations at once

  constructor() {
    this.apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google Places API key is required');
    }
  }

  /**
   * Search for place using Google Places API
   */
  async searchPlace(name: string, address?: string): Promise<GooglePlace | null> {
    try {
      // Try multiple search variations to improve results
      const searchQueries = [
        address ? `${name} ${address}` : `${name} Utah`,
        `${name} Salt Lake City Utah`,
        `${name} Park City Utah`,
        `${name} Moab Utah`,
        name // fallback to just the name
      ];
      
      for (const searchQuery of searchQueries) {
        // console.log(`🔍 Searching for: ${searchQuery}`);
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
          params: {
            query: searchQuery,
            key: this.apiKey,
            type: 'tourist_attraction|establishment|point_of_interest'
          }
        });

        if (response.data.status === 'OK' && response.data.results.length > 0) {
          const placesWithPhotos = response.data.results.filter((place: GooglePlace) => 
            place.photos && place.photos.length > 0
          );
          
          if (placesWithPhotos.length > 0) {
            // console.log(`✅ Found ${placesWithPhotos[0].name} with ${placesWithPhotos[0].photos?.length} photos`);
            return placesWithPhotos[0];
          }
          
          // console.log(`📍 Found ${response.data.results[0].name} but no photos`);
          return response.data.results[0];
        }
        
        // Wait between searches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return null;
    } catch (error: any) {
      // console.error(`❌ Google Places API error for ${name}:`, error.message);
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
   * Create photo objects from Google Places data
   */
  createPhotoObjects(place: GooglePlace, destinationName: string): any[] {
    if (!place.photos || place.photos.length === 0) {
      return [];
    }

    return place.photos.slice(0, 3).map((photo, index) => ({
      url: this.generatePhotoUrl(photo.photo_reference),
      alt_text: `${destinationName} - Photo ${index + 1}`,
      caption: destinationName,
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
   * Update destination with authentic Google Places data
   */
  async updateDestinationWithPlacesData(destinationId: number, place: GooglePlace, photos: any[]): Promise<void> {
    try {
      const updateQuery = `
        UPDATE destinations 
        SET 
          photos = $1::jsonb,
          google_place_id = $2,
          google_rating = $3,
          google_rating_count = $4,
          google_types = $5,
          is_open_now = $6,
          price_level = $7,
          places_data = $8::jsonb,
          updated_at = NOW()
        WHERE id = $9
      `;

      const placesData = {
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        types: place.types,
        opening_hours: place.opening_hours,
        price_level: place.price_level,
        updated_at: new Date().toISOString()
      };

      await pool.query(updateQuery, [
        JSON.stringify(photos),
        place.place_id,
        place.rating || null,
        place.user_ratings_total || null,
        place.types || null,
        place.opening_hours?.open_now || null,
        place.price_level || null,
        JSON.stringify(placesData),
        destinationId
      ]);

      // console.log(`✅ Updated destination ${destinationId} with ${photos.length} photos and places data`);
    } catch (_error) {
      // console.error(`❌ Error updating destination ${destinationId}:`, error);
      throw error;
    }
  }

  /**
   * Process a single destination
   */
  async processDestination(destination: any): Promise<{
    success: boolean;
    destinationId: number;
    name: string;
    photoCount: number;
    reason: string;
  }> {
    const result = {
      success: false,
      destinationId: destination.id,
      name: destination.name,
      photoCount: 0,
      reason: ''
    };

    try {
      // Search for place
      const place = await this.searchPlace(destination.name, destination.address);
      
      if (!place) {
        result.reason = 'Place not found in Google Places API';
        return result;
      }

      // Create photos from Google Places data
      const photos = this.createPhotoObjects(place, destination.name);
      
      if (photos.length === 0) {
        result.reason = 'Place found but no photos available';
        return result;
      }

      // Update destination with all Google Places data
      await this.updateDestinationWithPlacesData(destination.id, place, photos);
      
      result.success = true;
      result.photoCount = photos.length;
      result.reason = `Successfully enriched with ${photos.length} authentic photos`;
      
      return result;
    } catch (_error) {
      result.reason = `Error: ${(error as Error).message}`;
      return result;
    }
  }

  /**
   * Process destinations in batches
   */
  async processBatch(destinations: any[]): Promise<void> {
    const batchSize = this.concurrency;
    
    for (let i = 0; i < destinations.length; i += batchSize) {
      const batch = destinations.slice(i, i + batchSize);
      
      // console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(destinations.length / batchSize)}`);
      // console.log(`📍 Destinations: ${batch.map(d => d.name).join(', ')}`);
      
      // Process batch in parallel
      const promises = batch.map(dest => this.processDestination(dest));
      const results = await Promise.allSettled(promises);
      
      // Update counters
      results.forEach((result, index) => {
        this.processed++;
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            this.successful++;
            // console.log(`✅ ${result.value.name}: ${result.value.reason}`);
          } else {
            this.failed++;
            // console.log(`❌ ${result.value.name}: ${result.value.reason}`);
          }
        } else {
          this.failed++;
          // console.log(`❌ ${batch[index].name}: ${result.reason}`);
        }
      });
      
      // Rate limiting between batches
      if (i + batchSize < destinations.length) {
        // console.log(`⏱️  Rate limiting: waiting 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Enrich all destinations with authentic Google Places data
   */
  async enrichAllDestinations(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    message: string;
  }> {
    // console.log('🚀 Starting MASS photo enrichment with Google Places API...');
    // console.log('=' .repeat(80));
    
    try {
      // Get all destinations that need photos
      const result = await pool.query(`
        SELECT id, name, address, coordinates, photos 
        FROM destinations 
        WHERE photos IS NULL 
           OR photos = '[]'::jsonb 
           OR jsonb_array_length(photos) = 0
           OR NOT EXISTS (
             SELECT 1 FROM jsonb_array_elements(photos) AS photo_elem
             WHERE photo_elem->>'source' = 'Google Places API'
           )
        ORDER BY id
      `);

      const destinations = result.rows;
      // console.log(`📊 Found ${destinations.length} destinations needing authentic photos`);

      if (destinations.length === 0) {
        return {
          processed: 0,
          successful: 0,
          failed: 0,
          message: 'All destinations already have authentic photos'
        };
      }

      // Reset counters
      this.processed = 0;
      this.successful = 0;
      this.failed = 0;

      // Process all destinations in batches
      await this.processBatch(destinations);

      const successRate = ((this.successful / this.processed) * 100).toFixed(1);
      const message = `Mass enrichment completed: ${this.successful}/${this.processed} destinations enriched (${successRate}% success rate)`;
      
      // console.log('\n' + '='.repeat(80));
      // console.log('🎯 MASS PHOTO ENRICHMENT COMPLETED!');
      // console.log(`📊 Total processed: ${this.processed}`);
      // console.log(`✅ Successful: ${this.successful}`);
      // console.log(`❌ Failed: ${this.failed}`);
      // console.log(`📈 Success rate: ${successRate}%`);
      // console.log('=' .repeat(80));

      return {
        processed: this.processed,
        successful: this.successful,
        failed: this.failed,
        message
      };
    } catch (_error) {
      // console.error('❌ Mass enrichment failed:', error);
      throw error;
    }
  }
}

export const massPhotoEnrichment = new MassPhotoEnrichment();