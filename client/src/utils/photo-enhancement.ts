
/**
 * Enhanced Photo Enhancement Utility for SLC Trips Destinations
 * Provides robust photo data integration with improved caching and fallbacks
 */

interface PhotoData {
  url: string;
  alt: string;
  source: 'google_places' | 'unsplash' | 'placeholder' | 'database';
  width?: number;
  height?: number;
  verified?: boolean;
  photographer?: string;
}

interface PhotoCache {
  photos: PhotoData[];
  source: string;
  rating?: number;
  ratingCount?: number;
  placeId?: string;
  lastUpdated: number;
}

// Simple in-memory cache with TTL
const photoCache = new Map<number, PhotoCache>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function isCacheValid(cache: PhotoCache): boolean {
  return Date.now() - cache.lastUpdated < CACHE_TTL;
}

/**
 * Get enhanced photo data for a destination with improved fallbacks
 */
export async function getDestinationPhoto(destination: any): Promise<PhotoData | null> {
  try {
    // Check cache first
    const cached = photoCache.get(destination.id);
    if (cached && isCacheValid(cached)) {
      return cached.photos[0] || null;
    }

    // Check if destination already has verified photos from the database
    if (destination.photos && destination.photos.length > 0) {
      const dbPhoto = destination.photos[0];
      
      // Handle different photo formats
      let photoUrl = null;
      if (typeof dbPhoto === 'string') {
        photoUrl = dbPhoto;
      } else if (dbPhoto.url) {
        photoUrl = dbPhoto.url;
      }
      
      // Skip placeholder URLs
      if (photoUrl && !photoUrl.includes('via.placeholder.com')) {
        const photoData: PhotoData = {
          url: photoUrl,
          alt: (typeof dbPhoto === 'object' ? dbPhoto.alt_text : null) || `Photo of ${destination.name}`,
          source: (typeof dbPhoto === 'object' ? dbPhoto.source : null) || 'database',
          width: (typeof dbPhoto === 'object' ? dbPhoto.width : null) || 800,
          height: (typeof dbPhoto === 'object' ? dbPhoto.height : null) || 600,
          verified: (typeof dbPhoto === 'object' ? dbPhoto.verified : null) || false,
          photographer: (typeof dbPhoto === 'object' ? dbPhoto.photographer : null) || 'Unknown'
        };
        
        // Cache for future use
        photoCache.set(destination.id, {
          photos: [photoData],
          source: photoData.source,
          rating: destination.google_rating,
          ratingCount: destination.google_rating_count,
          placeId: destination.google_place_id,
          lastUpdated: Date.now()
        });
        
        return photoData;
      }
    }

    // Try to get fresh photo from server-side Google Places proxy
    const googlePhoto = await searchGooglePlacesPhoto(destination);
    if (googlePhoto) {
      return googlePhoto;
    }

    // Fallback to high-quality Unsplash photos
    const fallbackPhoto = getFallbackPhoto(destination);
    if (fallbackPhoto) {
      return fallbackPhoto;
    }

    return null;
  } catch (_error) {
    // console.warn('Error getting destination photo:', error);
    return null;
  }
}

/**
 * Search for Google Places photos
 */
async function searchGooglePlacesPhoto(destination: any): Promise<PhotoData | null> {
  try {
    if (!destination.name || !destination.coordinates) {
      return null;
    }

    const response = await fetch('/api/places/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: destination.name,
        location: destination.coordinates,
        radius: 5000,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return {
        url: `/api/photo-proxy?ref=${encodeURIComponent(photo.photo_reference)}&maxwidth=800`,
        alt: `Photo of ${destination.name}`,
        source: 'google_places',
        width: 800,
        height: 600,
        verified: true,
        photographer: 'Google Places'
      };
    }

    return null;
  } catch (_error) {
    // console.warn('Error searching Google Places photos:', error);
    return null;
  }
}

/**
 * Get fallback photo based on destination category
 */
function getFallbackPhoto(destination: any): PhotoData | null {
  const categoryPhotoMap: Record<string, string> = {
    'Downtown & Nearby': '/images/downtown-slc-fallback.jpg',
    'Less than 90 Minutes': 'https://images.unsplash.com/photo-1551524164-6cf31ad5bbb8?w=800&h=600&fit=crop&auto=format',
    'Less than 3 Hours': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop&auto=format',
    'Less than 5 Hours': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format',
    'Less than 8 Hours': 'https://images.unsplash.com/photo-1551524164-8c93e6d4837b?w=800&h=600&fit=crop&auto=format',
    'Less than 12 Hours': 'https://images.unsplash.com/photo-1504830335113-0bb61401f5e1?w=800&h=600&fit=crop&auto=format',
    'A little bit farther': 'https://images.unsplash.com/photo-1504830335113-0bb61401f5e1?w=800&h=600&fit=crop&auto=format'
  };

  const photoUrl = categoryPhotoMap[destination.category] || categoryPhotoMap['Downtown & Nearby'];
  
  return {
    url: photoUrl,
    alt: `Photo of ${destination.name}`,
    source: 'unsplash',
    width: 800,
    height: 600,
    verified: false,
    photographer: 'Unsplash'
  };
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [id, cache] of photoCache.entries()) {
    if (now - cache.lastUpdated > CACHE_TTL) {
      photoCache.delete(id);
    }
  }
}

// Clear expired cache every 10 minutes
setInterval(clearExpiredCache, 10 * 60 * 1000);
