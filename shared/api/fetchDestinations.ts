// Destination interface for type safety
export interface Destination {
  name: string;
  tagline: string;
  description_long: string;
  drive_time_minutes: number;
  latitude: number;
  longitude: number;
  is_family_friendly: boolean;
  difficulty_level: string;
  best_season: string;
  county: string;
}

// Fetch all destinations from server
export async function getDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/supabase/destinations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    // console.error("Fetch error:", error);
    return [];
  }
}

// Get regular destinations (non-festivals)
export async function getRegularDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/supabase/destinations/regular');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    // console.error("Fetch error:", error);
    return [];
  }
}

// Get festivals/events
export async function getFestivals(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/supabase/destinations/festivals');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    // console.error("Fetch error:", error);
    return [];
  }
}
