/**
 * Enhanced Photo URL utility for SLCTrips.com
 * Handles Google Places API photos through proxy with robust fallbacks
 */

export function getPhotoUrl(photoReference: string): string | null {
  // console.log('getPhotoUrl called with:', photoReference);
  if (!photoReference) {
    return null;
  }

  // Handle various photo reference formats
  try {
    // Handle Unsplash photo IDs that might be missing the full URL
    if (photoReference.startsWith('photo-') && photoReference.includes('?')) {
      return `https://images.unsplash.com/${photoReference}`;
    }

    // Handle full Unsplash URLs
    if (photoReference.includes('unsplash.com')) {
      return photoReference;
    }

    // Handle full Google Places API URLs - extract photo reference
    if (photoReference.includes('maps.googleapis.com/maps/api/place/photo')) {
      try {
        const url = new URL(photoReference);
        const photoRef = url.searchParams.get('photoreference') || url.searchParams.get('photo_reference');
        if (photoRef) {
          return `/api/photo-proxy?ref=${encodeURIComponent(photoRef)}&maxwidth=800`;
        }
      } catch (_e) {
        // console.warn('Failed to parse Google Places photo URL:', photoReference);
      }
      // Fallback to URL parameter method
      return `/api/photo-proxy?url=${encodeURIComponent(photoReference)}`;
    }

    // Handle placeholder URLs
    if (photoReference.includes('via.placeholder.com')) {
      return photoReference;
    }

    // If it's just a photo reference (Google Places), use the ref parameter
    if (photoReference.length > 10 && !photoReference.includes('http')) {
      return `/api/photo-proxy?ref=${encodeURIComponent(photoReference)}&maxwidth=800`;
    }

    // Handle other HTTP URLs
    if (photoReference.startsWith('http')) {
      return `/api/photo-proxy?url=${encodeURIComponent(photoReference)}`;
    }

    return null;
  } catch (_error) {
    // console.warn('Error processing photo URL:', error);
    return null;
  }
}

export function getMainPhoto(destination: any): string | null {
  // PRIORITY 1: Check Supabase photo_url field first (AUTHENTIC PHOTOS ONLY)
  if (destination.photo_url && 
      destination.photo_url.trim() &&
      !destination.photo_url.includes('via.placeholder.com') &&
      !destination.photo_url.includes('placeholder') &&
      destination.photo_url.startsWith('http')) {
    
    // Direct Google Places API photos - use proxy
    if (destination.photo_url.includes('maps.googleapis.com/maps/api/place/photo')) {
      return `/api/photo-proxy?url=${encodeURIComponent(destination.photo_url)}`;
    }
    
    // Other valid photo URLs
    return destination.photo_url;
  }

  // PRIORITY 1.5: Check Supabase cover_photo_url field as fallback
  if (destination.cover_photo_url && 
      destination.cover_photo_url.trim() &&
      !destination.cover_photo_url.includes('via.placeholder.com') &&
      !destination.cover_photo_url.includes('placeholder') &&
      destination.cover_photo_url.startsWith('http')) {
    
    // Direct Google Places API photos - use proxy
    if (destination.cover_photo_url.includes('maps.googleapis.com/maps/api/place/photo')) {
      return `/api/photo-proxy?url=${encodeURIComponent(destination.cover_photo_url)}`;
    }
    
    // Other valid photo URLs
    return destination.cover_photo_url;
  }

  // PRIORITY 2: Check photos array for authentic photos
  if (destination.photos && Array.isArray(destination.photos) && destination.photos.length > 0) {
    // Find the first non-placeholder photo
    for (const photo of destination.photos) {
      if (photo && typeof photo === 'object' && photo.url) {
        // Skip placeholder URLs
        if (photo.url.includes('via.placeholder.com')) {
          continue;
        }

        // Prioritize Google Places and Unsplash photos
        if (photo.source === 'Google Places API' || 
            photo.url.includes('unsplash.com') ||
            photo.photo_reference) {
          const photoUrl = getPhotoUrl(photo.photo_reference || photo.url);
          if (photoUrl) return photoUrl;
        }

        // Handle other authentic URLs
        const photoUrl = getPhotoUrl(photo.url);
        if (photoUrl) return photoUrl;
      }

      // Handle photo as string
      if (typeof photo === 'string' && !photo.includes('via.placeholder.com')) {
        const photoUrl = getPhotoUrl(photo);
        if (photoUrl) return photoUrl;
      }
    }
  }

  // PRIORITY 3: Check direct photoUrl field
  if (destination.photoUrl && !destination.photoUrl.includes('via.placeholder.com')) {
    const photoUrl = getPhotoUrl(destination.photoUrl);
    if (photoUrl) return photoUrl;
  }

  // PRIORITY 4: Check places_data for Google Places photos
  if (destination.places_data && destination.places_data.photos && destination.places_data.photos.length > 0) {
    const googlePhoto = destination.places_data.photos[0];
    if (googlePhoto.photo_reference) {
      const photoUrl = getPhotoUrl(googlePhoto.photo_reference);
      if (photoUrl) return photoUrl;
    }
  }

  return null;
}

/**
 * CRITICAL: Get destination photo URL with priority for authentic Google Places photos
 */
export function getDestinationPhotoUrl(destination: any): string {
  // PRIORITY 1: Use authentic cover photo URL from database if available
  if (destination.cover_photo_url && destination.cover_photo_url.trim() !== '') {
    // Validate it's a real photo URL (Google Places or Unsplash)
    if (destination.cover_photo_url.includes('googleapis.com') || 
        destination.cover_photo_url.includes('unsplash.com')) {
      return destination.cover_photo_url;
    }
  }

  // PRIORITY 2: Use photo_url field
  if (destination.photo_url && destination.photo_url.trim() !== '') {
    if (destination.photo_url.includes('googleapis.com') || 
        destination.photo_url.includes('unsplash.com')) {
      return destination.photo_url;
    }
  }

  // FALLBACK: High-quality category-based photos ONLY if no authentic photo exists
  const categoryPhotoMap: Record<string, string> = {
    'Downtown & Nearby': '/images/downtown-slc-fallback.jpg',
    'Less than 90 Minutes': 'https://images.unsplash.com/photo-1551524164-6cf31ad5bbb8?w=800&h=600&fit=crop&auto=format',
    'Less than 3 Hours': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop&auto=format',
    'Less than 5 Hours': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format',
    'Less than 8 Hours': 'https://images.unsplash.com/photo-1551524164-8c93e6d4837b?w=800&h=600&fit=crop&auto=format',
    'Less than 12 Hours': 'https://images.unsplash.com/photo-1504830335113-0bb61401f5e1?w=800&h=600&fit=crop&auto=format',
    'A little bit farther': 'https://images.unsplash.com/photo-1504830335113-0bb61401f5e1?w=800&h=600&fit=crop&auto=format'
  };

  return categoryPhotoMap[destination.category] || categoryPhotoMap['Downtown & Nearby'];
}

/**
 * Get high-quality fallback photo for destinations without photos
 */
export function getFallbackPhoto(destination: any): string {
  const categoryColors = {
    'Less than 90 Minutes': '0087c8', // Great Salt Blue
    'Less than 8 Hours': 'f4b441',    // Pioneer Gold
    'Less than 12 Hours': 'b33c1a',   // Canyon Red
    'A little bit farther': '0d2a40'   // Navy Ridge
  };

  const color = categoryColors[destination.category as keyof typeof categoryColors] || '0087c8';
  const encodedName = encodeURIComponent(destination.name || 'Utah Destination');

  return `https://via.placeholder.com/800x600/${color}/ffffff?text=${encodedName}`;
}

/**
 * Validate if a photo URL is accessible
 */
export async function validatePhotoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/photo/validate?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.valid;
  } catch (_error) {
    // console.warn('Photo validation failed:', error);
    return false;
  }
}