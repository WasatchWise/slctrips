/**
 * Comprehensive Supabase Schema Types
 * Updated to match actual database structure
 */

export interface SupabaseDestination {
  id: string;
  name: string;
  slug?: string;
  latitude?: number;
  longitude?: number;
  county?: string;
  region?: string;
  category?: string;
  subcategory?: string;
  is_verified?: boolean;
  place_id?: string;
  google_place_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DestinationContent {
  id: string;
  destination_id: string;
  tagline?: string;
  description_short?: string;
  description_long?: string;
  address_full?: string;
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  destination_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      destinations: {
        Row: SupabaseDestination;
        Insert: Partial<SupabaseDestination>;
        Update: Partial<SupabaseDestination>;
      };
      destination_content: {
        Row: DestinationContent;
        Insert: Partial<DestinationContent>;
        Update: Partial<DestinationContent>;
      };
    };
  };
}

// Legacy compatibility
export type Destination = SupabaseDestination;