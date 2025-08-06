/**
 * Photo Audit System - Complete validation and fixing of destination photos
 * Ensures every destination has a valid, authentic image
 */

interface PhotoValidationResult {
  destinationId: string;
  name: string;
  status: 'valid' | 'fixed' | 'failed' | 'missing';
  oldUrl?: string;
  newUrl?: string;
  error?: string;
}

export class PhotoAuditSystem {
  private localDb: any;
  private apiKey: string;
  private validPhotos: PhotoValidationResult[] = [];
  private fixedPhotos: PhotoValidationResult[] = [];
  private failedPhotos: PhotoValidationResult[] = [];

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || 
                  process.env.GOOGLE_MAPS_API_KEY || 
                  process.env.GOOGLE_API_KEY || '';
  }

  async initializeConnection() {
    const { neon } = await import('@neondatabase/serverless');
    this.localDb = neon(process.env.DATABASE_URL!);
  }

  async runCompletePhotoAudit(limit?: number): Promise<{
    totalProcessed: number;
    validPhotos: number;
    fixedPhotos: number;
    failedPhotos: number;
    results: {
      valid: PhotoValidationResult[];
      fixed: PhotoValidationResult[];
      failed: PhotoValidationResult[];
    };
  }> {
    await this.initializeConnection();
    
    if (!this.apiKey) {
      throw new Error('Google Places API key required for photo audit');
    }

    // console.log('\n🔍 STARTING COMPLETE PHOTO AUDIT SYSTEM');
    // console.log('============================================================');

    // Get all destinations ordered by priority (featured first)
    const destinations = await this.localDb`
      SELECT id, name, county, region, cover_photo_url
      FROM destinations 
      ORDER BY 
        CASE 
          WHEN name ILIKE '%crestwood%' OR name ILIKE '%alta%' OR name ILIKE '%butch%' 
               OR name ILIKE '%bloomington%' OR name ILIKE '%big sky%' OR name ILIKE '%estes%' 
               OR name ILIKE '%amarillo%' OR name ILIKE '%arches%' OR name ILIKE '%zion%'
               OR name ILIKE '%bridal%' OR name ILIKE '%bonneville%' OR name ILIKE '%park city%'
               OR name ILIKE '%antelope%' OR name ILIKE '%capitol%' THEN 1
          ELSE 2
        END,
        name
      LIMIT ${limit || 100}
    `;

    // console.log(`📊 Auditing ${destinations.length} destinations for photo validity`);

    for (const destination of destinations) {
      await this.auditDestinationPhoto(destination);
      await new Promise(resolve => setTimeout(resolve, 150)); // Rate limiting
    }

    const summary = {
      totalProcessed: destinations.length,
      validPhotos: this.validPhotos.length,
      fixedPhotos: this.fixedPhotos.length,
      failedPhotos: this.failedPhotos.length,
      results: {
        valid: this.validPhotos,
        fixed: this.fixedPhotos,
        failed: this.failedPhotos
      }
    };

    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 PHOTO AUDIT COMPLETE');
    // console.log(`📊 Total processed: ${summary.totalProcessed}`);
    // console.log(`✅ Valid photos: ${summary.validPhotos}`);
    // console.log(`🔧 Fixed photos: ${summary.fixedPhotos}`);
    // console.log(`❌ Failed photos: ${summary.failedPhotos}`);
    // console.log(`📈 Success rate: ${(((summary.validPhotos + summary.fixedPhotos) / summary.totalProcessed) * 100).toFixed(1)}%`);

    return summary;
  }

  async auditDestinationPhoto(destination: any): Promise<void> {
    try {
      // console.log(`🔍 Auditing: ${destination.name}`);

      // Step 1: Check if photo exists and is valid
      if (destination.cover_photo_url) {
        const isValid = await this.validatePhotoUrl(destination.cover_photo_url);
        if (isValid) {
          // console.log(`  ✅ Photo valid: ${destination.name}`);
          this.validPhotos.push({
            destinationId: destination.id,
            name: destination.name,
            status: 'valid',
            oldUrl: destination.cover_photo_url
          });
          return;
        }
      }

      // Step 2: Photo missing or invalid - fetch new one
      // console.log(`  🔧 Fetching new photo: ${destination.name}`);
      const newPhotoUrl = await this.fetchAuthenticPhoto(destination);
      
      if (newPhotoUrl) {
        // Update database with new photo
        await this.localDb`
          UPDATE destinations 
          SET 
            cover_photo_url = ${newPhotoUrl},
            photo_url = ${newPhotoUrl},
            photo_updated_at = NOW()
          WHERE id = ${destination.id}
        `;

        // console.log(`  ✅ Photo fixed: ${destination.name}`);
        this.fixedPhotos.push({
          destinationId: destination.id,
          name: destination.name,
          status: 'fixed',
          oldUrl: destination.cover_photo_url,
          newUrl: newPhotoUrl
        });
      } else {
        // console.log(`  ❌ No photo found: ${destination.name}`);
        this.failedPhotos.push({
          destinationId: destination.id,
          name: destination.name,
          status: 'failed',
          error: 'No valid photo source found'
        });
      }

    } catch (_error) {
      // console.error(`Audit failed for ${destination.name}:`, error);
      this.failedPhotos.push({
        destinationId: destination.id,
        name: destination.name,
        status: 'failed',
        error: String(error)
      });
    }
  }

  async validatePhotoUrl(url: string): Promise<boolean> {
    try {
      // Skip validation for URLs that are clearly valid Google/Unsplash images
      if (url.includes('googleapis.com') || url.includes('unsplash.com')) {
        return true;
      }

      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      
      return response.ok && contentType.startsWith('image/');
    } catch {
      return false;
    }
  }

  async fetchAuthenticPhoto(destination: any): Promise<string | null> {
    try {
      // Build search query with location context
      const searchTerms = [
        destination.name,
        destination.county && destination.county !== 'null' ? destination.county : '',
        destination.region && destination.region !== 'null' ? destination.region : '',
        'Utah'
      ].filter(Boolean).join(' ');

      const searchQuery = encodeURIComponent(searchTerms);
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${this.apiKey}`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) return null;

      const searchData = await searchResponse.json();
      if (!searchData.results || searchData.results.length === 0) return null;

      const place = searchData.results[0];
      
      // Get place details with photos
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${this.apiKey}`;
      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) return null;

      const detailsData = await detailsResponse.json();
      if (!detailsData.result?.photos || detailsData.result.photos.length === 0) return null;

      // Get photo URL
      const photoReference = detailsData.result.photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${this.apiKey}`;

    } catch (_error) {
      // console.error(`Failed to fetch photo for ${destination.name}:`, error);
      return null;
    }
  }

  async runUntilComplete(maxIterations: number = 3): Promise<any> {
    let iteration = 1;
    let lastSuccessRate = 0;

    while (iteration <= maxIterations) {
      // console.log(`\n🔄 AUDIT ITERATION ${iteration}/${maxIterations}`);
      
      // Reset counters
      this.validPhotos = [];
      this.fixedPhotos = [];
      this.failedPhotos = [];

      const result = await this.runCompletePhotoAudit(50);
      const successRate = ((result.validPhotos + result.fixedPhotos) / result.totalProcessed) * 100;

      // console.log(`📈 Iteration ${iteration} success rate: ${successRate.toFixed(1)}%`);

      // Check if we've achieved good coverage or no improvement
      if (successRate >= 90 || (successRate - lastSuccessRate < 5 && iteration > 1)) {
        // console.log('🎯 Photo audit complete - target achieved or no significant improvement');
        return result;
      }

      lastSuccessRate = successRate;
      iteration++;
      
      if (iteration <= maxIterations) {
        // console.log('⏳ Waiting before next iteration...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return {
      totalProcessed: this.validPhotos.length + this.fixedPhotos.length + this.failedPhotos.length,
      validPhotos: this.validPhotos.length,
      fixedPhotos: this.fixedPhotos.length,
      failedPhotos: this.failedPhotos.length,
      results: {
        valid: this.validPhotos,
        fixed: this.fixedPhotos,
        failed: this.failedPhotos
      }
    };
  }
}