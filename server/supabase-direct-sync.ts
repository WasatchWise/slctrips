import pg from 'pg';
const { Pool } = pg;
import { db } from './db';
import { destinations } from '@shared/schema';

interface SupabaseDestination {
  uuid: string;
  name: string;
  slug: string;
  tagline?: string;
  description_short?: string;
  description_long?: string;
  latitude?: number;
  longitude?: number;
  address_full?: string;
  county?: string;
  region?: string;
  drive_minutes?: number;
  distance_miles?: number;
  pet_policy_allowed?: boolean;
  is_featured?: boolean;
  is_family_friendly?: boolean;
  is_stroller_friendly?: boolean;
  has_playground?: boolean;
  parking_no?: boolean;
  parking_variable?: boolean;
  parking_limited?: boolean;
  parking_true?: boolean;
  is_parking_free?: boolean;
  has_restrooms?: boolean;
  has_visitor_center?: boolean;
  is_season_spring?: boolean;
  is_season_summer?: boolean;
  is_season_fall?: boolean;
  is_season_winter?: boolean;
  is_season_all?: boolean;
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  content_status?: string;
  updated_at?: string;
}

function mapSupabaseToDestination(supabaseDest: SupabaseDestination) {
  // Determine primary category based on drive time and characteristics
  let category = 'Downtown & Nearby';
  if (supabaseDest.drive_minutes) {
    if (supabaseDest.drive_minutes > 240) {
      category = 'Ultimate Escapes';
    } else if (supabaseDest.drive_minutes > 120) {
      category = 'Epic Adventures';
    } else if (supabaseDest.drive_minutes > 60) {
      category = 'Natural Wonders';
    }
  }

  // Special categorization for ski areas and national parks
  const nameLower = supabaseDest.name.toLowerCase();
  if (nameLower.includes('ski') || nameLower.includes('resort') || 
      nameLower.includes('snowbird') || nameLower.includes('alta')) {
    category = 'Ski Country';
  }

  if (nameLower.includes('national park') || nameLower.includes('arches') ||
      nameLower.includes('zion') || nameLower.includes('bryce') ||
      nameLower.includes('yellowstone')) {
    category = 'National Parks';
  }

  // Create photos array from cover photo
  const photos = [];
  if (supabaseDest.cover_photo_url) {
    photos.push({
      url: supabaseDest.cover_photo_url,
      caption: supabaseDest.cover_photo_alt_text || supabaseDest.name,
      source: 'Supabase',
      verified: true,
      updated: new Date().toISOString()
    });
  }

  return {
    external_id: supabaseDest.uuid,
    name: supabaseDest.name,
    slug: supabaseDest.slug,
    category,
    description: supabaseDest.description_long || supabaseDest.description_short || '',
    address: supabaseDest.address_full || '',
    coordinates: supabaseDest.latitude && supabaseDest.longitude ? 
      { lat: supabaseDest.latitude, lng: supabaseDest.longitude } : null,
    driveTime: supabaseDest.drive_minutes || 30,
    photos,
    activities: [],
    highlights: [],
    tags: [],
    difficulty_level: 'Easy',
    accessibility_info: supabaseDest.is_stroller_friendly ? 'Stroller accessible' : '',
    best_time_to_visit: supabaseDest.is_season_all ? 'Year-round' : 'Seasonal',
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

export async function syncSupabaseDestinationsDirect() {
  // console.log('🔄 Starting direct Supabase PostgreSQL sync...');
  
  const supabasePool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:2025willbegreat!@db.unkfswfemslaeuqaxijg.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    await supabasePool.query('SELECT 1');
    // console.log('✅ Connected to Supabase PostgreSQL');

    // Fetch all destinations from Supabase
    const result = await supabasePool.query(`
      SELECT 
        uuid, name, slug, tagline, description_short, description_long,
        latitude, longitude, address_full, county, region, drive_minutes, distance_miles,
        pet_policy_allowed, is_featured, is_family_friendly, is_stroller_friendly,
        has_playground, parking_no, parking_variable, parking_limited, parking_true,
        is_parking_free, has_restrooms, has_visitor_center,
        is_season_spring, is_season_summer, is_season_fall, is_season_winter, is_season_all,
        cover_photo_url, cover_photo_alt_text, destination_url, content_status, updated_at
      FROM destinations 
      ORDER BY name
    `);

    const supabaseDestinations = result.rows;
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

    // console.log(`🎯 Supabase sync complete: ${synced} destinations synced`);
    return { synced, errors };

  } catch (_error) {
    // console.error('💥 Supabase sync failed:', error);
    throw error;
  } finally {
    await supabasePool.end();
  }
}