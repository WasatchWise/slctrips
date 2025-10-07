/**
 * Google Places Photo Synchronization System
 * Syncs authentic photos from Google Places API to Supabase cover_photo_url field
 */

interface GooglePlacesResponse {
  candidates: Array<{
    place_id: string;
    name: string;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  }>;
  status: string;
}

interface PlaceDetailsResponse {
  result: {
    place_id: string;
    name: string;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  };
  status: string;
}

export class GooglePlacesPhotoSync {
  private supabase: any;
  private apiKey: string;
  private processed: number = 0;
  private successful: number = 0;
  private failed: number = 0;
  private errors: string[] = [];

  constructor() {
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string {
    const keys = [
      process.env.GOOGLE_PLACES_API_KEY,
      process.env.GOOGLE_MAPS_API_KEY,
      process.env.GOOGLE_API_KEY,
      process.env.VITE_GOOGLE_PLACES_API_KEY
    ];
    
    for (const key of keys) {
      if (key && key.trim()) {
        return key.trim();
      }
    }
    throw new Error('No Google Places API key found in environment variables');
  }

  async initializeSupabase() {
    const { createClient } = await import('@supabase/supabase-js');
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async searchGooglePlaces(name: string, address: string): Promise<{ place_id: string; photo_reference?: string } | null> {
    try {
      const query = `${name} ${address}`.replace(/[^\w\s,]/g, '').trim();
      const encodedQuery = encodeURIComponent(query);
      
      const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedQuery}&inputtype=textquery&fields=place_id,name,photos&key=${this.apiKey}`;
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
      }
      
      const data: GooglePlacesResponse = await response.json();
      
      if (data.status !== 'OK' || !data.candidates || data.candidates.length === 0) {
        // console.log(`No places found for: ${name} (${address})`);
        return null;
      }

      const place = data.candidates[0];
      if (!place.photos || place.photos.length === 0) {
        // Try place details API for more photo data
        return await this.getPlaceDetails(place.place_id);
      }

      return {
        place_id: place.place_id,
        photo_reference: place.photos[0].photo_reference
      };
    } catch (_error) {
      // console.error(`Google Places search failed for ${name}:`, error);
      this.errors.push(`Search failed for ${name}: ${error}`);
      return null;
    }
  }

  async getPlaceDetails(placeId: string): Promise<{ place_id: string; photo_reference?: string } | null> {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,photos&key=${this.apiKey}`;
      
      const response = await fetch(detailsUrl);
      if (!response.ok) {
        throw new Error(`Place Details API error: ${response.status}`);
      }
      
      const data: PlaceDetailsResponse = await response.json();
      
      if (data.status !== 'OK' || !data.result.photos || data.result.photos.length === 0) {
        return { place_id: placeId };
      }

      return {
        place_id: placeId,
        photo_reference: data.result.photos[0].photo_reference
      };
    } catch (_error) {
      // console.error(`Place details failed for ${placeId}:`, error);
      return { place_id: placeId };
    }
  }

  buildPhotoUrl(photoReference: string): string {
    return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=800&key=${this.apiKey}`;
  }

  async updateDestinationPhoto(destinationId: string, photoUrl: string, placeId?: string): Promise<boolean> {
    try {
      const updateData: any = { 
        cover_photo_url: photoUrl,
        photo_url: photoUrl 
      };
      if (placeId) {
        updateData.google_place_id = placeId;
      }

      const { error } = await this.supabase
        .from('destinations')
        .update(updateData)
        .eq('id', destinationId);

      if (error) {
        // console.error(`Failed to update destination ${destinationId}:`, error);
        this.errors.push(`Update failed for ${destinationId}: ${error.message}`);
        return false;
      }

      return true;
    } catch (_error) {
      // console.error(`Database update failed for ${destinationId}:`, error);
      this.errors.push(`Database error for ${destinationId}: ${error}`);
      return false;
    }
  }

  async processDestination(destination: any): Promise<boolean> {
    try {
      this.processed++;
      // console.log(`Processing ${this.processed}: ${destination.name} (${destination.county || 'Unknown'}, Utah)`);

      // Skip if already has valid photo (check cover_photo_url field)
      if (destination.cover_photo_url && 
          !destination.cover_photo_url.includes('placeholder') &&
          !destination.cover_photo_url.includes('via.placeholder') &&
          destination.cover_photo_url.startsWith('http')) {
        // console.log(`  ✅ Already has photo: ${destination.cover_photo_url}`);
        this.successful++;
        return true;
      }

      // Create search query with fallbacks
      const searchName = destination.name;
      const searchAddress = `${destination.county || destination.region || ''}, Utah`.replace(', Utah', '') + ', Utah';

      // Search Google Places
      const placeResult = await this.searchGooglePlaces(searchName, searchAddress);
      if (!placeResult) {
        // console.log(`  ❌ No place found for: ${searchName}`);
        this.failed++;
        return false;
      }

      // Update with place_id even if no photo
      if (!placeResult.photo_reference) {
        // console.log(`  ⚠️ Place found but no photos: ${searchName}`);
        await this.updateDestinationPhoto(destination.id, '', placeResult.place_id);
        this.failed++;
        return false;
      }

      // Build photo URL and update
      const photoUrl = this.buildPhotoUrl(placeResult.photo_reference);
      const success = await this.updateDestinationPhoto(destination.id, photoUrl, placeResult.place_id);

      if (success) {
        // console.log(`  ✅ Photo updated: ${photoUrl}`);
        this.successful++;
        return true;
      } else {
        this.failed++;
        return false;
      }
    } catch (_error) {
      // console.error(`Processing failed for ${destination.name}:`, _error);
      this.errors.push(`Processing error for ${destination.name}: ${_error instanceof Error ? _error.message : 'Unknown error'}`);
      this.failed++;
      return false;
    }
  }

  async syncAllDestinations(limit?: number): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> {
    await this.initializeSupabase();
    
    // console.log('\n🚀 Starting Google Places Photo Sync...');
    // console.log('============================================================');

    // Get destinations that need photos using only existing fields
    let query = this.supabase
      .from('destinations')
      .select('id, name, county, region, cover_photo_url, google_place_id')
      .order('name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data: destinations, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch destinations: ${error.message}`);
    }

    if (!destinations || destinations.length === 0) {
      throw new Error('No destinations found in database');
    }

    // console.log(`📋 Found ${destinations.length} destinations to process`);

    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < destinations.length; i += batchSize) {
      const batch = destinations.slice(i, i + batchSize);
      
      // Process batch with small delay between requests
      for (const destination of batch) {
        await this.processDestination(destination);
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Longer delay between batches
      if (i + batchSize < destinations.length) {
        // console.log(`\n⏸️ Batch complete, pausing 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 Google Places Photo Sync Complete!');
    // console.log(`📊 Total processed: ${this.processed}`);
    // console.log(`✅ Successful: ${this.successful}`);
    // console.log(`❌ Failed: ${this.failed}`);
    // console.log(`📈 Success rate: ${((this.successful / this.processed) * 100).toFixed(1)}%`);

    if (this.errors.length > 0) {
      // console.log(`\n⚠️ Errors encountered: ${this.errors.length}`);
      this.errors.slice(0, 10).forEach(error => {
        // console.log(`  - ${error}`);
      });
      if (this.errors.length > 10) {
        // console.log(`  ... and ${this.errors.length - 10} more errors`);
      }
    }

    return {
      processed: this.processed,
      successful: this.successful,
      failed: this.failed,
      errors: this.errors
    };
  }
}