import { supabase } from '../lib/supabase';

// Strict TypeScript interfaces matching the new BRAINS schema
export interface Destination {
  uuid: string;
  name: string;
  city: string | null;
  destination_url: string;
  category: string;
  drive_time_minute: number | null;
  latitude: number | null;
  longitude: number | null;
  destination_tags?: { tag_name: string }[];
  activities?: { activity_name: string }[];
  description?: string | null;
  cover_photo_url?: string | null;
  cover_photo_alt_text?: string | null;
}

export interface DestinationTag {
  tag_name: string;
}

export interface Activity {
  activity_name: string;
}

/**
 * Fetch destinations by category with all related data
 * Uses new BRAINS schema with proper foreign key relationships
 */
export async function fetchDestinationsByCategory(category: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      uuid,
      name,
      city,
      destination_url,
      category,
      drive_time_minute,
      latitude,
      longitude,
      description,
      cover_photo_url,
      cover_photo_alt_text,
      destination_tags:destination_tags ( tag_name ),
      activities:activities ( activity_name )
    `)
    .eq('category', category)
    .order('name', { ascending: true });

  if (error) {
    // console.error('Error fetching destinations by category:', error);
    throw error;
  }

  return data as Destination[];
}

/**
 * Fetch single destination by slug (destination_url)
 * SEO-friendly routing using slugified URLs
 */
export async function fetchDestinationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      uuid,
      name,
      city,
      destination_url,
      category,
      drive_time_minute,
      latitude,
      longitude,
      description,
      cover_photo_url,
      cover_photo_alt_text,
      destination_tags:destination_tags ( tag_name ),
      activities:activities ( activity_name )
    `)
    .eq('destination_url', slug)
    .single();

  if (error) {
    // console.error('Error fetching destination by slug:', error);
    throw error;
  }

  return data as Destination;
}

/**
 * Fetch all destinations with category counts
 * Used for homepage category cards
 */
export async function fetchDestinationCounts() {
  const { data, error } = await supabase
    .from('destinations')
    .select('category');

  if (error) {
    // console.error('Error fetching destination counts:', error);
    throw error;
  }

  // Group by category and count
  const counts = data.reduce((acc: Record<string, number>, dest) => {
    acc[dest.category] = (acc[dest.category] || 0) + 1;
    return acc;
  }, {});

  return counts;
}

/**
 * Fetch all destinations for search and filtering
 */
export async function fetchAllDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      uuid,
      name,
      city,
      destination_url,
      category,
      drive_time_minute,
      latitude,
      longitude,
      description,
      cover_photo_url,
      cover_photo_alt_text,
      destination_tags:destination_tags ( tag_name ),
      activities:activities ( activity_name )
    `)
    .order('name', { ascending: true });

  if (error) {
    // console.error('Error fetching all destinations:', error);
    throw error;
  }

  return data as Destination[];
}

/**
 * Fetch all unique tags for filtering
 */
export async function fetchAllTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    // console.error('Error fetching tags:', error);
    throw error;
  }

  return data.map(tag => tag.name);
}

/**
 * Fetch all unique activities for filtering
 */
export async function fetchAllActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('activity_name')
    .order('activity_name', { ascending: true });

  if (error) {
    // console.error('Error fetching activities:', error);
    throw error;
  }

  return data.map(activity => activity.activity_name);
}