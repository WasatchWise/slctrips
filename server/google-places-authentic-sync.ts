/**
 * Google Places Authentic Photo Sync System
 * Gets real, authentic photos for each destination using Google Places API
 */

export class GooglePlacesAuthenticSync {
  private localDb: any;
  private processed: number = 0;
  private successful: number = 0;
  private failed: number = 0;
  private errors: string[] = [];
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || 
                  process.env.GOOGLE_MAPS_API_KEY || 
                  process.env.GOOGLE_API_KEY || '';
  }

  async initializeConnection() {
    const { neon } = await import('@neondatabase/serverless');
    this.localDb = neon(process.env.DATABASE_URL!);
  }

  async syncAuthenticDestinationPhotos(limit?: number): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> {
    await this.initializeConnection();
    
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }
    
    // console.log('\n🚀 Starting Google Places Authentic Photo Sync...');
    // console.log('============================================================');

    // Get destinations without photos or with generic photos
    const destinations = await this.localDb`
      SELECT id, name, latitude, longitude, county, region, cover_photo_url
      FROM destinations 
      WHERE (cover_photo_url IS NULL 
        OR cover_photo_url = '' 
        OR cover_photo_url LIKE '%category-fallback%'
        OR cover_photo_url LIKE '%placeholder%')
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
      ORDER BY RANDOM()
      LIMIT ${limit || 50}
    `;

    // console.log(`📋 Found ${destinations.length} destinations needing authentic photos`);

    // Process each destination
    for (const destination of destinations) {
      await this.getAuthenticDestinationPhoto(destination);
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    }

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 Google Places Authentic Photo Sync Complete!');
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

  async getAuthenticDestinationPhoto(destination: any): Promise<boolean> {
    try {
      this.processed++;
      // console.log(`Processing ${this.processed}: ${destination.name}`);

      // Step 1: Search for the place using name and coordinates
      const searchQuery = encodeURIComponent(`${destination.name} ${destination.county} ${destination.region}`);
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&location=${destination.latitude},${destination.longitude}&radius=10000&key=${this.apiKey}`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`Search API failed: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      if (!searchData.results || searchData.results.length === 0) {
        // console.log(`  ⚠️ No Google Places result for: ${destination.name}`);
        this.failed++;
        this.errors.push(`No Places result: ${destination.name}`);
        return false;
      }

      const place = searchData.results[0];
      const placeId = place.place_id;

      // Step 2: Get place details with photos
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,rating,user_ratings_total&key=${this.apiKey}`;
      
      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) {
        throw new Error(`Details API failed: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();
      const placeDetails = detailsData.result;

      if (!placeDetails.photos || placeDetails.photos.length === 0) {
        // console.log(`  ⚠️ No photos available for: ${destination.name}`);
        this.failed++;
        this.errors.push(`No photos available: ${destination.name}`);
        return false;
      }

      // Step 3: Get the actual photo URL
      const photoReference = placeDetails.photos[0].photo_reference;
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${this.apiKey}`;

      // Step 4: Update destination with authentic photo
      await this.localDb`
        UPDATE destinations 
        SET 
          cover_photo_url = ${photoUrl},
          photo_url = ${photoUrl},
          photo_alt = ${`${destination.name} - Authentic photo from Google Places`},
          google_place_id = ${placeId},
          google_rating = ${placeDetails.rating || null},
          google_total_ratings = ${placeDetails.user_ratings_total || null}
        WHERE id = ${destination.id}
      `;

      // console.log(`  ✅ Authentic photo added: ${destination.name}`);
      // console.log(`     Place ID: ${placeId}`);
      // console.log(`     Rating: ${placeDetails.rating || 'N/A'} (${placeDetails.user_ratings_total || 0} reviews)`);
      
      this.successful++;
      return true;

    } catch (_error) {
      // console.error(`Failed to get photo for ${destination.name}:`, error);
      this.errors.push(`Photo error for ${destination.name}: ${error}`);
      this.failed++;
      return false;
    }
  }

  async syncFeaturedDestinationsPhotos(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> {
    await this.initializeConnection();
    
    // console.log('\n🎯 Starting Featured Destinations Photo Sync...');
    // console.log('============================================================');

    // Priority destinations that appear in featured sections
    const featuredDestinations = [
      'Crestwood Pool',
      "Alta's Rustler Lodge", 
      "Butch Cassidy's Childhood Home",
      'Bloomington Petroglyph Park',
      'Big Sky Resort',
      'Estes Park',
      'Amarillo',
      'Arches National Park',
      'Zion National Park',
      'Bridal Veil Falls',
      'Bonneville Salt Flats',
      'Park City',
      'Antelope Island',
      'Capitol Reef'
    ];

    for (const destName of featuredDestinations) {
      const destinations = await this.localDb`
        SELECT id, name, latitude, longitude, county, region, cover_photo_url
        FROM destinations 
        WHERE LOWER(name) LIKE LOWER(${'%' + destName + '%'})
        LIMIT 1
      `;

      if (destinations.length > 0) {
        await this.getAuthenticDestinationPhoto(destinations[0]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // console.log('\n🎯 Featured Destinations Photo Sync Complete!');
    return {
      processed: this.processed,
      successful: this.successful,
      failed: this.failed,
      errors: this.errors
    };
  }
}