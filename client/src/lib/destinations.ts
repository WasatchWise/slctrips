import type { Database, SupabaseDestination } from '@shared/supabase-types';

// Use the proper Supabase destination type

export interface Destination {
  id: number;
  externalId: string;
  name: string;
  category: string;
  driveTime: number;
  driveTimeText?: string;
  distance?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  website?: string;
  description?: string;
  highlights?: string[];
  hours?: any;
  pricing?: any;
  tags?: string[];
  activities?: string[];
  seasonality?: string;
  timeNeeded?: string;
  difficulty?: string;
  accessibility?: string;
  bestTimeToVisit?: string;
  nearbyAttractions?: string[];
  packingList?: string[];
  localTips?: string[];
  olympicVenue?: boolean;
  subscriptionTier: string;
  placesData?: {
    photos?: Array<{
      photoReference: string;
      width: number;
      height: number;
      photoUrl: string;
    }>;
  rating?: number;
  userRatingsTotal?: number;
};
  createdAt?: string;
  updatedAt?: string;
}

export const DRIVE_TIME_ZONES = [
  { minutes: 30, label: "30 minutes or less", title: "Downtown & Nearby" },
  { minutes: 90, label: "Less than 90 minutes", title: "Less than 90 Minutes" },
  { minutes: 180, label: "Less than 3 hours", title: "Less than 3 Hours" },
  { minutes: 300, label: "Less than 5 hours", title: "Less than 5 Hours" },
  { minutes: 480, label: "Less than 8 hours", title: "Less than 8 Hours" },
  { minutes: 720, label: "Less than 12 hours", title: "Less than 12 Hours" },
  { minutes: 1440, label: "A little bit farther", title: "A little bit farther" },
];

export const CATEGORIES = [
  { key: "all", label: "All Categories" },
  { key: "cultural", label: "🏛️ Cultural & Historic" },
  { key: "outdoor", label: "🏔️ Outdoor Adventures" },
  { key: "family", label: "👨‍👩‍👧‍👦 Family Fun" },
  { key: "skiing", label: "⛷️ Skiing & Winter" },
  { key: "olympic", label: "🥇 Olympic Venues" },
  { key: "entertainment", label: "🎭 Entertainment" },
  { key: "museums", label: "🏛️ Museums" },
];

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  OLYMPIC: 'olympic'
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

export function formatDriveTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function getDriveTimeZone(minutes: number) {
  return DRIVE_TIME_ZONES.find(zone => minutes <= zone.minutes) || DRIVE_TIME_ZONES[DRIVE_TIME_ZONES.length - 1];
}

export function canAccessDestination(destination: Destination, userTier?: SubscriptionTier): boolean {
  if (!userTier || userTier === SUBSCRIPTION_TIERS.FREE) {
    return destination.subscriptionTier === SUBSCRIPTION_TIERS.FREE;
  }

  if (userTier === SUBSCRIPTION_TIERS.PREMIUM) {
    return [SUBSCRIPTION_TIERS.FREE, SUBSCRIPTION_TIERS.PREMIUM].includes(destination.subscriptionTier as SubscriptionTier);
  }

  if (userTier === SUBSCRIPTION_TIERS.OLYMPIC) {
    return true; // Olympic tier can access everything
  }

  return false;
}

export function getDestinationImageUrl(destination: Destination): string | null {
  // Only return authentic Google Places photos - no fallbacks
  if (destination.placesData?.photos && destination.placesData.photos.length > 0) {
    return destination.placesData.photos[0].photoUrl;
  }

  return null;
}

export const transformSupabaseDestination = (dest: SupabaseDestination, content?: any): Destination => {
  return {
    uuid: dest.id, // Use id as uuid for compatibility
    name: dest.name,
    description: content?.description_short || content?.description_long || '',
    category: dest.category || 'Downtown & Nearby',
    driveTime: getDriveTimeFromCategory(dest.category || 'Downtown & Nearby'),
    distance: Math.round(getDriveTimeFromCategory(dest.category || 'Downtown & Nearby') * 0.8),
    coordinates: dest.latitude && dest.longitude ? {
      lat: dest.latitude,
      lng: dest.longitude
    } : null,
    photoUrl: content?.cover_photo_url || null,
    rating: 4.5, // Default rating
    // Additional computed properties
    id: dest.id,
    address: content?.address_full || `${dest.county}, Utah` || '',
    phone: content?.destination_phone || '',
    website: content?.destination_url || '',
    highlights: [],
    activities: [],
    tags: [],
    accessibility: 'Contact venue for accessibility information',
    difficulty: 'Easy',
    bestTimeToVisit: 'Year-round',
    isFavorite: false,
    createdAt: dest.created_at ? new Date(dest.created_at) : new Date(),
    updatedAt: dest.updated_at ? new Date(dest.updated_at) : new Date()
  };
};

// Helper function to get drive time from category
function getDriveTimeFromCategory(category: string): number {
  const categoryTimes: { [key: string]: number } = {
    'Downtown & Nearby': 30,
    'Less than 90 Minutes': 75,
    'Less than 3 Hours': 150,
    'Less than 5 Hours': 240,
    'Less than 8 Hours': 360,
    'Less than 12 Hours': 600,
    'A little bit farther': 720
  };
  return categoryTimes[category] || 60;
}