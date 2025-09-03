import { db } from './db';
import { destinations } from '@shared/schema';
import { SUPABASE_URL } from './config';

interface SupabaseDestination {
  id: number;
  name: string;
  slug?: string;
  description_short?: string;
  description_long?: string;
  latitude?: number;
  longitude?: number;
  address_full?: string;
  drive_minutes?: number;
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  is_family_friendly?: boolean;
  pet_policy_allowed?: boolean;
  has_restrooms?: boolean;
  has_visitor_center?: boolean;
  is_parking_free?: boolean;
  has_playground?: boolean;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function categorizeDestination(driveTime: number = 30): string {
  if (driveTime <= 30) return '30 MIN';
  if (driveTime <= 120) return '1-2 HRS';
  if (driveTime <= 240) return 'ROAD TRIPS';
  if (driveTime <= 480) return 'WEEKEND';
  return 'STATE PARKS';
}

function mapSupabaseToDestination(supabaseDest: SupabaseDestination) {
  const slug = supabaseDest.slug || createSlug(supabaseDest.name);
  const driveTime = supabaseDest.drive_minutes || 30;
  const category = categorizeDestination(driveTime);

  // Create photos array from cover photo
  const photos = [];
  if (supabaseDest.cover_photo_url) {
    photos.push({
      url: supabaseDest.cover_photo_url,
      caption: supabaseDest.cover_photo_alt_text || supabaseDest.name,
      source: 'Supabase Daniel',
      verified: true,
      updated: new Date().toISOString()
    });
  }

  return {
    external_id: `supabase-${supabaseDest.id}`,
    name: supabaseDest.name,
    slug,
    category,
    description: supabaseDest.description_long || supabaseDest.description_short || '',
    address: supabaseDest.address_full || '',
    coordinates: supabaseDest.latitude && supabaseDest.longitude ? 
      { lat: supabaseDest.latitude, lng: supabaseDest.longitude } : null,
    driveTime,
    photos,
    activities: [],
    highlights: [],
    tags: [],
    difficulty_level: 'Easy',
    accessibility_info: '',
    best_time_to_visit: 'Year-round',
    estimated_duration: '2-4 hours',
    entrance_fee: 'Free',
    contact_info: supabaseDest.destination_url ? { website: supabaseDest.destination_url } : null,
    amenities: [
      ...(supabaseDest.has_restrooms ? ['Restrooms'] : []),
      ...(supabaseDest.has_visitor_center ? ['Visitor Center'] : []),
      ...(supabaseDest.is_parking_free ? ['Free Parking'] : []),
      ...(supabaseDest.has_playground ? ['Playground'] : [])
    ],
    nearby_attractions: [],
    is_family_friendly: supabaseDest.is_family_friendly || false,
    is_pet_friendly: supabaseDest.pet_policy_allowed || false,
    is_olympic_venue: false,
    rating: 4.2,
    review_count: 0,
    popularity_score: 0.5,
    content_quality_score: 0.8,
    view_count: 0,
    like_count: 0,
    share_count: 0
  };
}

export async function syncSupabaseDestinationsAPI() {
  // console.log('🔄 Starting Supabase API sync...');

  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials not available');
  }

  try {
    // Fetch from the destinations table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/destinations?select=*`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

          // console.log(`📋 Using table: destinations`);
    // console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    const supabaseDestinations: SupabaseDestination[] = await response.json();
    // console.log(`📊 Found ${supabaseDestinations.length} destinations in Supabase`);

    if (supabaseDestinations.length === 0) {
      // console.log('⚠️ No destinations found in Supabase');
      return { synced: 0, errors: [] };
    }

    // Clear existing destinations
    await db.delete(destinations);
    // console.log('🗑️ Cleared existing destinations');

    // Process in batches
    const batchSize = 50;
    let synced = 0;
    const errors: string[] = [];

    for (let i = 0; i < supabaseDestinations.length; i += batchSize) {
      const batch = supabaseDestinations.slice(i, i + batchSize);
      
      try {
        const mappedDestinations = batch.map(mapSupabaseToDestination);
        await db.insert(destinations).values(mappedDestinations);
        
        synced += batch.length;
        // console.log(`✅ Synced batch ${Math.floor(i / batchSize) + 1}: ${batch.length} destinations`);
      } catch (_error) {
        const errorMsg = `Batch ${Math.floor(i / batchSize) + 1} failed: ${error}`;
        errors.push(errorMsg);
        // console.log(`❌ ${errorMsg}`);
      }
    }

    // console.log(`🎯 Supabase API sync complete: ${synced} destinations synced`);
    return { synced, errors };

  } catch (_error) {
    // console.error('💥 Supabase API sync failed:', error);
    throw error;
  }
}