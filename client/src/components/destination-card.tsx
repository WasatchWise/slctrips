import { MapPin, Clock, Star } from "lucide-react";
import { Link } from "wouter";

interface Destination {
  id: number;
  name: string;
  category: string;
  driveTime?: number;
  description?: string;
  photos?: Array<{ url: string; caption?: string }>;
  photoUrl?: string;
  rating?: number;
}

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  // Helper function to get the correct photo URL
  const getPhotoUrl = (url: string) => {
    if (url.includes('maps.googleapis.com/maps/api/place/photo')) {
      return `/api/photo-proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Helper function to format drive time in HHhMMm format
  const formatDriveTime = (minutes?: number) => {
    if (!minutes) return "Drive time varies";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`;
  };

  // Handle photos as JSON string or array
  let photos = destination.photos;
  if (typeof photos === 'string') {
    try {
      photos = JSON.parse(photos);
    } catch (_e) {
      photos = [];
    }
  }

  const mainPhoto = (photos && Array.isArray(photos) && photos.length > 0) ? photos[0] : null;
  const photoUrl = mainPhoto?.url || destination.photoUrl || '';

  // Only proxy Google Places URLs that don't already have an API key
  const displayPhotoUrl = photoUrl.includes('maps.googleapis.com/maps/api/place/photo') && !photoUrl.includes('key=')
    ? `/api/photo-proxy?url=${encodeURIComponent(photoUrl)}`
    : photoUrl;

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {displayPhotoUrl ? (
          <img
            src={displayPhotoUrl}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Use category-based fallback photos
              const categoryImages = {
                'Downtown & Nearby': 'https://images.unsplash.com/photo-1531040630173-7cfb894c8326?w=400&h=200&fit=crop',
                'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
                'Less than 3 Hours': 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=200&fit=crop',
                'Less than 5 Hours': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop',
                'Less than 8 Hours': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop',
                'Less than 12 Hours': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop',
                'A little bit farther': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop'
              };
              target.src = categoryImages[destination.category as keyof typeof categoryImages] || 
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop';
            }}
          />
        ) : (
          <img
            src={(() => {
              const categoryImages = {
                'Downtown & Nearby': 'https://images.unsplash.com/photo-1531040630173-7cfb894c8326?w=400&h=200&fit=crop',
                'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
                'Less than 3 Hours': 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=200&fit=crop',
                'Less than 5 Hours': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop',
                'Less than 8 Hours': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop',
                'Less than 12 Hours': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop',
                'A little bit farther': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop'
              };
              return categoryImages[destination.category as keyof typeof categoryImages] || 
                     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop';
            })()}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span 
            className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
            style={{ backgroundColor: '#0087c8' }}
          >
            {destination.category}
          </span>
        </div>

        {/* Rating Badge - Only show if rating exists and > 0 */}
        {destination.rating && destination.rating > 0 && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded-full text-xs">
              <Star className="w-3 h-3 fill-current mr-1" />
              <span>{destination.rating}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {destination.name}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDriveTime(destination.driveTime)}</span>
          </div>
        </div>

        {destination.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {destination.description}
          </p>
        )}

        {destination.category && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs text-gray-500">{destination.category}</span>
          </div>
        )}
      </div>
    </Link>
  );
}