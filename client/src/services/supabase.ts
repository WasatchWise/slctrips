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
  try {
    const response = await fetch('/api/destinations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.destinations || !Array.isArray(result.destinations)) {
      throw new Error('Invalid API response format');
    }

    // Filter by category
    const filteredDestinations = result.destinations.filter((dest: any) => 
      dest.category === category
    );

    // Transform to match the expected interface
    return filteredDestinations.map((dest: any) => ({
      uuid: dest.id,
      name: dest.name,
      city: dest.city || null,
      destination_url: dest.destination_url || '',
      category: dest.category,
      drive_time_minute: dest.drive_time || 60,
      latitude: dest.latitude,
      longitude: dest.longitude,
      description: dest.description_short || dest.description_long || dest.description,
      cover_photo_url: dest.cover_photo_url,
      cover_photo_alt_text: dest.cover_photo_alt_text,
      destination_tags: dest.tags ? dest.tags.map((tag: string) => ({ tag_name: tag })) : [],
      activities: dest.activities ? dest.activities.map((activity: string) => ({ activity_name: activity })) : []
    })) as Destination[];
  } catch (error) {
    console.error('Error fetching destinations by category:', error);
    throw error;
  }
}

/**
 * Fetch single destination by slug (destination_url)
 * SEO-friendly routing using slugified URLs
 */
export async function fetchDestinationBySlug(slug: string) {
  try {
    const response = await fetch('/api/destinations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.destinations || !Array.isArray(result.destinations)) {
      throw new Error('Invalid API response format');
    }

    // Find destination by slug
    const dest = result.destinations.find((d: any) => 
      d.slug === slug || 
      d.destination_url === slug ||
      d.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase()
    );

    if (!dest) {
      throw new Error('Destination not found');
    }

    // Transform to match the expected interface
    return {
      uuid: dest.id,
      name: dest.name,
      city: dest.city || null,
      destination_url: dest.destination_url || '',
      category: dest.category,
      drive_time_minute: dest.drive_time || 60,
      latitude: dest.latitude,
      longitude: dest.longitude,
      description: dest.description_short || dest.description_long || dest.description,
      cover_photo_url: dest.cover_photo_url,
      cover_photo_alt_text: dest.cover_photo_alt_text,
      destination_tags: dest.tags ? dest.tags.map((tag: string) => ({ tag_name: tag })) : [],
      activities: dest.activities ? dest.activities.map((activity: string) => ({ activity_name: activity })) : []
    } as Destination;
  } catch (error) {
    console.error('Error fetching destination by slug:', error);
    throw error;
  }
}

/**
 * Fetch all destinations with category counts
 * Used for homepage category cards
 */
export async function fetchDestinationCounts() {
  try {
    const response = await fetch('/api/destinations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.destinations || !Array.isArray(result.destinations)) {
      throw new Error('Invalid API response format');
    }

    // Group by category and count
    const counts = result.destinations.reduce((acc: Record<string, number>, dest: any) => {
      const category = dest.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return counts;
  } catch (error) {
    console.error('Error fetching destination counts:', error);
    throw error;
  }
}

/**
 * Fetch all destinations for search and filtering
 */
export async function fetchAllDestinations() {
  try {
    const response = await fetch('/api/destinations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.destinations || !Array.isArray(result.destinations)) {
      throw new Error('Invalid API response format');
    }

    // Transform API data to match the expected interface
    return result.destinations.map((dest: any) => ({
      uuid: dest.id,
      name: dest.name,
      city: dest.city || null,
      destination_url: dest.destination_url || '',
      category: dest.category,
      drive_time_minute: dest.drive_time || 60,
      latitude: dest.latitude,
      longitude: dest.longitude,
      description: dest.description_short || dest.description_long || dest.description,
      cover_photo_url: dest.cover_photo_url,
      cover_photo_alt_text: dest.cover_photo_alt_text,
      destination_tags: dest.tags ? dest.tags.map((tag: string) => ({ tag_name: tag })) : [],
      activities: dest.activities ? dest.activities.map((activity: string) => ({ activity_name: activity })) : []
    })) as Destination[];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
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