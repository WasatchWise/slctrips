/**
 * Complete Google Places Photo Sync System
 * CRITICAL MISSION: Get authentic photos for EVERY destination
 */

interface SyncResult {
  destinationId: string;
  name: string;
  status: 'success' | 'failed';
  photoUrl?: string;
  placeId?: string;
  error?: string;
}

export class GooglePlacesCompleteSync {
  private localDb: any;
  private apiKey: string;
  private results: SyncResult[] = [];

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || 
                  process.env.GOOGLE_MAPS_API_KEY || 
                  process.env.GOOGLE_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('CRITICAL: Google Places API key not configured');
    }
  }

  async initializeConnection() {
    const { neon } = await import('@neondatabase/serverless');
    this.localDb = neon(process.env.DATABASE_URL!);
  }

  async syncAllDestinationPhotos(): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: SyncResult[];
  }> {
    await this.initializeConnection();
    
    // console.log('\n🚨 CRITICAL MISSION: COMPLETE GOOGLE PLACES PHOTO SYNC');
    // console.log('================================================================');

    // Get ALL destinations that need photos
    const destinations = await this.localDb`
      SELECT id, name, county, region, address, cover_photo_url
      FROM destinations 
      WHERE cover_photo_url IS NULL 
         OR cover_photo_url = '' 
         OR cover_photo_url NOT LIKE '%googleapis.com%'
      ORDER BY 
        CASE 
          WHEN name ILIKE '%crestwood%' OR name ILIKE '%alta%' OR name ILIKE '%butch%' THEN 1
          WHEN name ILIKE '%arches%' OR name ILIKE '%zion%' OR name ILIKE '%bridal%' THEN 2
          ELSE 3
        END,
        name
      LIMIT 100
    `;

    // console.log(`🎯 PROCESSING ${destinations.length} destinations for authentic photos`);

    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      // console.log(`\n[${i + 1}/${destinations.length}] Processing: ${dest.name}`);
      
      await this.processDestination(dest);
      
      // Rate limiting to avoid API limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successful = this.results.filter(r => r.status === 'success').length;
    const failed = this.results.filter(r => r.status === 'failed').length;

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 MISSION COMPLETE');
    // console.log(`📊 Total processed: ${destinations.length}`);
    // console.log(`✅ Successful: ${successful}`);
    // console.log(`❌ Failed: ${failed}`);
    // console.log(`📈 Success rate: ${((successful / destinations.length) * 100).toFixed(1)}%`);

    return {
      total: destinations.length,
      successful,
      failed,
      results: this.results
    };
  }

  async processDestination(destination: any): Promise<void> {
    try {
      // Step 1: Build comprehensive search query
      const searchTerms = this.buildSearchQuery(destination);
      // console.log(`  🔍 Searching: ${searchTerms}`);

      // Step 2: Find place using Google Places API
      const placeId = await this.findPlaceId(searchTerms);
      if (!placeId) {
        this.results.push({
          destinationId: destination.id,
          name: destination.name,
          status: 'failed',
          error: 'No Google Places result found'
        });
        // console.log(`  ❌ No place found`);
        return;
      }

      // console.log(`  📍 Found place ID: ${placeId}`);

      // Step 3: Get photos for the place
      const photoUrl = await this.getPlacePhoto(placeId);
      if (!photoUrl) {
        this.results.push({
          destinationId: destination.id,
          name: destination.name,
          status: 'failed',
          placeId,
          error: 'No photos available for this place'
        });
        // console.log(`  ❌ No photos available`);
        return;
      }

      // Step 4: Validate the photo URL
      const isValid = await this.validatePhotoUrl(photoUrl);
      if (!isValid) {
        this.results.push({
          destinationId: destination.id,
          name: destination.name,
          status: 'failed',
          placeId,
          error: 'Photo URL validation failed'
        });
        // console.log(`  ❌ Photo validation failed`);
        return;
      }

      // Step 5: Save to database
      await this.localDb`
        UPDATE destinations 
        SET 
          cover_photo_url = ${photoUrl},
          photo_url = ${photoUrl},
          place_id = ${placeId},
          photo_updated_at = NOW()
        WHERE id = ${destination.id}
      `;

      this.results.push({
        destinationId: destination.id,
        name: destination.name,
        status: 'success',
        photoUrl,
        placeId
      });

      // console.log(`  ✅ SUCCESS: Photo saved`);
      // console.log(`     URL: ${photoUrl.substring(0, 80)}...`);

    } catch (_error) {
      // console.error(`  ❌ ERROR processing ${destination.name}:`, error);
      this.results.push({
        destinationId: destination.id,
        name: destination.name,
        status: 'failed',
        error: String(error)
      });
    }
  }

  buildSearchQuery(destination: any): string {
    const parts = [destination.name];
    
    if (destination.address && destination.address !== 'null') {
      parts.push(destination.address);
    } else {
      if (destination.county && destination.county !== 'null') {
        parts.push(destination.county);
      }
      if (destination.region && destination.region !== 'null') {
        parts.push(destination.region);
      }
      parts.push('Utah');
    }
    
    return parts.filter(Boolean).join(', ');
  }

  async findPlaceId(searchQuery: string): Promise<string | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Places search failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        return null;
      }

      return data.results[0].place_id;
    } catch (_error) {
      // console.error('Place search error:', error);
      return null;
    }
  }

  async getPlacePhoto(placeId: string): Promise<string | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Place details failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'OK' || !data.result?.photos || data.result.photos.length === 0) {
        return null;
      }

      const photoReference = data.result.photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1024&photoreference=${photoReference}&key=${this.apiKey}`;
    } catch (_error) {
      // console.error('Photo fetch error:', error);
      return null;
    }
  }

  async validatePhotoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      
      return response.ok && (
        contentType.startsWith('image/') ||
        contentType.includes('jpeg') ||
        contentType.includes('png') ||
        contentType.includes('webp')
      );
    } catch {
      return false;
    }
  }

  async runUntilComplete(maxRetries: number = 3): Promise<any> {
    let attempt = 1;
    let lastSuccessful = 0;

    while (attempt <= maxRetries) {
      // console.log(`\n🔄 ATTEMPT ${attempt}/${maxRetries}`);
      
      this.results = []; // Reset results
      const result = await this.syncAllDestinationPhotos();
      
      // console.log(`📊 Attempt ${attempt}: ${result.successful} successful`);

      // Check if we made significant progress
      if (result.successful > lastSuccessful + 10 || result.successful >= 50) {
        // console.log('✅ SIGNIFICANT PROGRESS MADE');
        return result;
      }

      if (result.successful >= 80) {
        // console.log('🎯 TARGET ACHIEVED');
        return result;
      }

      lastSuccessful = result.successful;
      attempt++;

      if (attempt <= maxRetries) {
        // console.log('⏳ Preparing next attempt...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return this.results;
  }
}